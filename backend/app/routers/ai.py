from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import os
import pandas as pd
from ..database import get_db
from ..models import User, ActivityLog
from ..schemas import AIInsightResponse
from ..auth import get_current_user
from ..services.gcp_service import GCPService
from .analytics import get_dataset_path

router = APIRouter(prefix="/ai", tags=["AI Copilot"])

@router.get("/copilot", response_model=AIInsightResponse)
def run_copilot(
    query: str = Query(..., description="Query for Gemini Copilot"),
    dataset_id: int = Query(0, description="Dataset ID to contextualize query. 0 for sample."),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    path = get_dataset_path(dataset_id, db, current_user.id)
    
    # Generate statistics to feed as context to the AI
    stats = {}
    try:
        if os.path.exists(path):
            df = pd.read_csv(path)
            stats = {
                "total_rows": len(df),
                "columns": list(df.columns),
                "numerical_summary": df.describe().to_dict() if not df.empty else {}
            }
    except Exception as e:
        stats = {"error": f"Failed to compute dataset stats: {str(e)}"}
        
    try:
        # Generate prompt for Gemini
        prompt = f"""
        User Query: "{query}"
        
        You are the Decision Intelligence Copilot for InsightIQ AI.
        Answer the user query based on the dataset metrics provided.
        Identify trends, explain anomalies, and recommend actions.
        Format your response in professional markdown with clear bullet points.
        """
        
        insight_text = GCPService.generate_insights(prompt, stats)
        
        # Log activity
        log = ActivityLog(user_id=current_user.id, action="Generate Insights", details=f"AI Copilot query: {query[:60]}")
        db.add(log)
        db.commit()
        
        # Simple extraction of recommendations
        recommendations = [
            "Validate and audit high-risk transactions exceeding $50k.",
            "Establish alert triggers on BigQuery table schemas.",
            "Deploy fraud classification scoring updates in production."
        ]
        
        # If the generated response has a list of recommendations, we can extract it
        if "Recommend" in insight_text or "recommend" in insight_text:
            lines = insight_text.split("\n")
            extracted_recs = []
            for line in lines:
                line_strip = line.strip()
                if (line_strip.startswith("1.") or line_strip.startswith("2.") or line_strip.startswith("3.") or line_strip.startswith("*") or line_strip.startswith("-")) and len(line_strip) > 5:
                    # Clean up prefix
                    clean_rec = line_strip.lstrip("0123456789.*- ").strip()
                    if clean_rec and len(clean_rec) > 10:
                        extracted_recs.append(clean_rec)
            if len(extracted_recs) >= 3:
                recommendations = extracted_recs[:4]
                
        return {
            "query": query,
            "insight": insight_text,
            "recommendations": recommendations
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Copilot failed: {str(e)}")
