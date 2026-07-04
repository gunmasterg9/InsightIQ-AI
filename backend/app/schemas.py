from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: Optional[str] = "User"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class TokenData(BaseModel):
    email: Optional[str] = None

class DatasetBase(BaseModel):
    filename: str
    size_bytes: int
    row_count: int
    cleanliness_score: float
    status: str
    gcs_uri: Optional[str] = None
    bq_table: Optional[str] = None

class DatasetOut(DatasetBase):
    id: int
    created_at: datetime
    user_id: int
    
    class Config:
        from_attributes = True

class ActivityLogOut(BaseModel):
    id: int
    user_id: Optional[int]
    action: str
    timestamp: datetime
    details: Optional[str] = None
    
    class Config:
        from_attributes = True

class CleanDataResponse(BaseModel):
    dataset_id: int
    cleanliness_score: float
    row_count: int
    cleaned_rows: int
    nulls_filled: int
    duplicates_removed: int
    outliers_handled: int
    status: str

class GPUBenchmarkResponse(BaseModel):
    rows: int
    cpu_time_ms: float
    gpu_time_ms: float
    acceleration_factor: float
    gpu_memory_used_mb: float
    operations: List[str]

class ForecastResponse(BaseModel):
    historical: List[Dict[str, Any]]
    forecast: List[Dict[str, Any]]
    model_used: str
    confidence_score: float

class FraudDetectionResponse(BaseModel):
    total_scanned: int
    fraud_detected: int
    fraud_percentage: float
    fraudulent_transactions: List[Dict[str, Any]]

class CustomerSegmentationResponse(BaseModel):
    segments: Dict[str, int]
    clustered_data: List[Dict[str, Any]]

class AIInsightResponse(BaseModel):
    query: str
    insight: str
    recommendations: List[str]
