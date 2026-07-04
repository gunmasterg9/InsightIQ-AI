from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from .config import settings
from .database import engine, Base, SessionLocal
from .models import User, Dataset
from .auth import get_password_hash
from .routers import auth, datasets, analytics, ai, reports

# Create database tables
Base.metadata.create_all(bind=engine)

# Seed database on startup if empty
def seed_database():
    db = SessionLocal()
    try:
        # Check if default user exists
        user = db.query(User).filter(User.email == "analyst@insightiq.ai").first()
        if not user:
            # Seed Analyst User
            analyst = User(
                email="analyst@insightiq.ai",
                hashed_password=get_password_hash("password123"),
                full_name="Alex Mercer",
                role="Business Analyst"
            )
            db.add(analyst)
            db.commit()
            db.refresh(analyst)
            
            # Seed Sample Dataset entry
            sample_dataset = Dataset(
                filename="business_transactions.csv",
                size_bytes=1356800, # Approx 1.3MB
                row_count=10000,
                cleanliness_score=92.5,
                status="Cleaned",
                gcs_uri=f"gs://{settings.GCS_BUCKET_NAME}/business_transactions.csv",
                bq_table=f"{settings.BQ_DATASET_NAME}.business_transactions",
                user_id=analyst.id
            )
            db.add(sample_dataset)
            db.commit()
            print("Database seeded successfully with default analyst and sample dataset.")
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        db.close()

seed_database()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Accelerated Decision Intelligence Platform API",
    version="1.0.0"
)

# CORS configurations
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "*" # Wildcard for deployment flexibility
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(datasets.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(ai.router, prefix=settings.API_V1_STR)
app.include_router(reports.router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "mode": "Mock GCP Mode" if settings.MOCK_GCP else "Production GCP Mode",
        "version": "1.0.0"
    }
