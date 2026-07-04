from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import os
from ..database import get_db
from ..models import Dataset, User, ActivityLog
from ..schemas import GPUBenchmarkResponse, ForecastResponse, FraudDetectionResponse, CustomerSegmentationResponse
from ..auth import get_current_user
from ..services.gpu_service import GPUService
from ..services.ml_service import MLService

router = APIRouter(prefix="/analytics", tags=["Analytics"])

DEFAULT_DATASET = "sample_data/business_transactions.csv"

def get_dataset_path(dataset_id: int, db: Session, user_id: int) -> str:
    """Helper to retrieve local dataset path or default to sample dataset."""
    if dataset_id == 0:
        if os.path.exists(DEFAULT_DATASET):
            return DEFAULT_DATASET
        raise HTTPException(
            status_code=404,
            detail="Sample dataset not found. Please generate sample data first."
        )
        
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id, Dataset.user_id == user_id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
        
    local_path = os.path.join("uploaded_datasets", dataset.filename)
    # Prefer cleaned version if it exists
    cleaned_path = local_path.replace(".csv", "_cleaned.csv")
    if os.path.exists(cleaned_path):
        return cleaned_path
    elif os.path.exists(local_path):
        return local_path
    else:
        raise HTTPException(status_code=404, detail="Dataset file missing")

@router.get("/benchmark", response_model=GPUBenchmarkResponse)
def get_benchmark(
    dataset_id: int = Query(0, description="Dataset ID to benchmark. 0 for sample data."),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    path = get_dataset_path(dataset_id, db, current_user.id)
    try:
        # Log benchmark run
        log = ActivityLog(user_id=current_user.id, action="Benchmark", details=f"Ran CPU vs GPU benchmark for dataset ID {dataset_id}")
        db.add(log)
        db.commit()
        return GPUService.run_benchmark(path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Benchmark execution failed: {str(e)}")

@router.get("/forecast", response_model=ForecastResponse)
def get_forecast(
    dataset_id: int = Query(0, description="Dataset ID to forecast. 0 for sample data."),
    days: int = Query(30, description="Number of days to forecast."),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    path = get_dataset_path(dataset_id, db, current_user.id)
    try:
        log = ActivityLog(user_id=current_user.id, action="ML", details=f"Ran Sales Forecasting for dataset ID {dataset_id}")
        db.add(log)
        db.commit()
        return MLService.run_forecast(path, days)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Forecasting execution failed: {str(e)}")

@router.get("/fraud-detection", response_model=FraudDetectionResponse)
def get_fraud_detection(
    dataset_id: int = Query(0, description="Dataset ID. 0 for sample data."),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    path = get_dataset_path(dataset_id, db, current_user.id)
    try:
        log = ActivityLog(user_id=current_user.id, action="ML", details=f"Ran Fraud Detection for dataset ID {dataset_id}")
        db.add(log)
        db.commit()
        return MLService.run_fraud_detection(path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Fraud detection failed: {str(e)}")

@router.get("/customer-segmentation", response_model=CustomerSegmentationResponse)
def get_customer_segmentation(
    dataset_id: int = Query(0, description="Dataset ID. 0 for sample data."),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    path = get_dataset_path(dataset_id, db, current_user.id)
    try:
        log = ActivityLog(user_id=current_user.id, action="ML", details=f"Ran Customer Segmentation for dataset ID {dataset_id}")
        db.add(log)
        db.commit()
        return MLService.run_customer_segmentation(path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Customer segmentation failed: {str(e)}")
