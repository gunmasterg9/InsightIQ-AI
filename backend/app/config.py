import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "InsightIQ AI"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "SUPER_SECRET_KEY_FOR_INSIGHTIQ_AI_DEVELOPMENT")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 1 week
    
    # SQLite local DB path
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./insightiq.db")
    
    # Google Cloud configurations
    GOOGLE_CLOUD_PROJECT: Optional[str] = os.getenv("GOOGLE_CLOUD_PROJECT", None)
    GCS_BUCKET_NAME: str = os.getenv("GCS_BUCKET_NAME", "insightiq-ai-datasets")
    BQ_DATASET_NAME: str = os.getenv("BQ_DATASET_NAME", "insightiq_analytics")
    
    # Gemini API / Vertex AI configurations
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", None)
    
    # Mock integrations mode (automatically true if GCP configuration is missing)
    MOCK_GCP: bool = True
    
    class Config:
        case_sensitive = True

settings = Settings()

# Post-processing settings to determine if we should run in Mock mode
if settings.GOOGLE_CLOUD_PROJECT and not os.getenv("MOCK_GCP"):
    settings.MOCK_GCP = False
else:
    settings.MOCK_GCP = True
