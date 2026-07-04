from fastapi.testclient import TestClient
import pytest
import os
import sys

# Append parent dir to path so we can import app
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.main import app
from backend.app.database import Base, engine, SessionLocal
from backend.app.models import User

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_db():
    # Ensure tables are built
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Check and clean user test record
        user = db.query(User).filter(User.email == "test_analyst@insightiq.ai").first()
        if user:
            db.delete(user)
            db.commit()
    finally:
        db.close()
    yield
    # Cleanup after tests
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["service"] == "InsightIQ AI"

def test_auth_register():
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "test_analyst@insightiq.ai",
            "password": "password123",
            "full_name": "Test Analyst User",
            "role": "Business Analyst"
        }
    )
    assert response.status_code == 201
    assert response.json()["email"] == "test_analyst@insightiq.ai"

def test_auth_login():
    # Register first (to ensure user is there)
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "test_analyst@insightiq.ai",
            "password": "password123",
            "full_name": "Test Analyst User",
            "role": "Business Analyst"
        }
    )
    
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "test_analyst@insightiq.ai",
            "password": "password123"
        }
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["user"]["email"] == "test_analyst@insightiq.ai"

def test_get_datasets_without_auth():
    response = client.get("/api/v1/datasets/")
    assert response.status_code == 401 # Unauthorized

def test_analytics_benchmark():
    # Authenticate
    response_auth = client.post(
        "/api/v1/auth/login",
        json={
            "email": "analyst@insightiq.ai", # Use default seeded analyst
            "password": "password123"
        }
    )
    token = response_auth.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    response = client.get("/api/v1/analytics/benchmark?dataset_id=0", headers=headers)
    assert response.status_code == 200
    assert "cpu_time_ms" in response.json()
    assert "gpu_time_ms" in response.json()
    assert response.json()["rows"] == 10000

def test_ai_copilot():
    response_auth = client.post(
        "/api/v1/auth/login",
        json={
            "email": "analyst@insightiq.ai",
            "password": "password123"
        }
    )
    token = response_auth.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    response = client.get("/api/v1/ai/copilot?query=Why+are+sales+declining?&dataset_id=0", headers=headers)
    assert response.status_code == 200
    assert "insight" in response.json()
    assert len(response.json()["recommendations"]) >= 1
