from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
import os
import shutil
from typing import List
from ..database import get_db
from ..models import Dataset, User, ActivityLog
from ..schemas import DatasetOut, CleanDataResponse
from ..auth import get_current_user
from ..services.gcp_service import GCPService
from ..services.gpu_service import GPUService

router = APIRouter(prefix="/datasets", tags=["Datasets"])

UPLOAD_DIR = "uploaded_datasets"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", response_model=DatasetOut, status_code=status.HTTP_201_CREATED)
async def upload_dataset(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Validate extension
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ['.csv', '.xlsx', '.xls', '.json']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file format. Please upload CSV, Excel, or JSON."
        )
        
    local_path = os.path.join(UPLOAD_DIR, file.filename)
    
    # Save locally
    with open(local_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Get file size
    size_bytes = os.path.getsize(local_path)
    
    # Create DB entry
    db_dataset = Dataset(
        filename=file.filename,
        size_bytes=size_bytes,
        row_count=0,
        cleanliness_score=0.0,
        status="Uploaded",
        user_id=current_user.id
    )
    db.add(db_dataset)
    db.commit()
    db.refresh(db_dataset)
    
    # Log activity
    log = ActivityLog(
        user_id=current_user.id,
        action="Upload",
        details=f"Uploaded file {file.filename} (Size: {size_bytes} bytes)"
    )
    db.add(log)
    db.commit()
    
    return db_dataset

@router.post("/{dataset_id}/clean", response_model=CleanDataResponse)
def clean_dataset(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id, Dataset.user_id == current_user.id).first()
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found"
        )
        
    local_path = os.path.join(UPLOAD_DIR, dataset.filename)
    if not os.path.exists(local_path):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Local file missing. Please re-upload."
        )
        
    # Update status to Processing
    dataset.status = "Processing"
    db.commit()
    
    try:
        # Perform cleaning using GPU/CPU pipeline
        cleaned_path, cleaning_metrics = GPUService.clean_and_validate_dataset(local_path)
        
        # Upload cleaned file to GCS
        cleaned_filename = os.path.basename(cleaned_path)
        gcs_uri = GCPService.upload_to_gcs(cleaned_path, cleaned_filename)
        
        # Ingest cleaned file into BigQuery
        bq_table_name = cleaned_filename.replace(".csv", "").replace("-", "_").lower()
        # Ensure BQ table identifier is clean
        bq_table_name = "".join(c for c in bq_table_name if c.isalnum() or c == "_")
        bq_table = GCPService.load_to_bigquery(gcs_uri, bq_table_name)
        
        # Update DB values
        dataset.row_count = cleaning_metrics["cleaned_rows"]
        dataset.cleanliness_score = cleaning_metrics["cleanliness_score"]
        dataset.gcs_uri = gcs_uri
        dataset.bq_table = bq_table
        dataset.status = "Cleaned"
        db.commit()
        
        # Log activity
        log = ActivityLog(
            user_id=current_user.id,
            action="Clean",
            details=f"Cleaned dataset ID {dataset_id}. Quality: {dataset.cleanliness_score}%, Rows: {dataset.row_count}"
        )
        db.add(log)
        db.commit()
        
        return {
            "dataset_id": dataset_id,
            "cleanliness_score": dataset.cleanliness_score,
            "row_count": dataset.row_count,
            "cleaned_rows": cleaning_metrics["cleaned_rows"],
            "nulls_filled": cleaning_metrics["nulls_filled"],
            "duplicates_removed": cleaning_metrics["duplicates_removed"],
            "outliers_handled": cleaning_metrics["outliers_handled"],
            "status": "Cleaned"
        }
    except Exception as e:
        dataset.status = "Error"
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Cleaning failed: {str(e)}"
        )

@router.get("/", response_model=List[DatasetOut])
def list_datasets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Dataset).filter(Dataset.user_id == current_user.id).all()

@router.delete("/{dataset_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_dataset(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    dataset = db.query(Dataset).filter(Dataset.id == dataset_id, Dataset.user_id == current_user.id).first()
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found"
        )
        
    local_path = os.path.join(UPLOAD_DIR, dataset.filename)
    if os.path.exists(local_path):
        os.remove(local_path)
    cleaned_path = local_path.replace(".csv", "_cleaned.csv")
    if os.path.exists(cleaned_path):
        os.remove(cleaned_path)
        
    db.delete(dataset)
    db.commit()
    return None
