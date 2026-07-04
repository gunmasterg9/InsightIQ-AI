from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="User") # Admin, Business Analyst, CXO, User
    created_at = Column(DateTime, default=datetime.utcnow)
    
    datasets = relationship("Dataset", back_populates="owner")

class Dataset(Base):
    __tablename__ = "datasets"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    size_bytes = Column(Integer, nullable=False)
    row_count = Column(Integer, default=0)
    cleanliness_score = Column(Float, default=0.0)
    status = Column(String, default="Uploaded") # Uploaded, Processing, Cleaned, Error
    gcs_uri = Column(String, nullable=True)
    bq_table = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    owner = relationship("User", back_populates="datasets")

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String, nullable=False) # Login, Upload, Clean, ML, Generate Insights
    timestamp = Column(DateTime, default=datetime.utcnow)
    details = Column(String, nullable=True)
