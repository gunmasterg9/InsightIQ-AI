# InsightIQ AI 🚀
### From Raw Data to Better Decisions in Seconds

**InsightIQ AI** is a Decision Intelligence Platform built for the **Google Cloud × NVIDIA Data Intelligence Challenge**. It showcases how GPU-accelerated processing via **NVIDIA RAPIDS cuDF** combined with Google Cloud storage, warehousing, and Gemini AI insights can drastically improve business auditing speed, fraud detection accuracy, and forecasting capabilities.

---

## 🏗️ Architecture & Processing Pipeline

1. **Ingestion & Store**: CSV/Excel/JSON files are uploaded via Next.js to the FastAPI backend, where they are copied to **Google Cloud Storage (GCS)**.
2. **Warehousing**: Data is synchronized from GCS into **BigQuery** schemas.
3. **GPU Analytics**: Data cleaning (duplicates, imputation, outlier handling) is executed using **NVIDIA RAPIDS cuDF** (falling back gracefully to standard Pandas with speedup metrics on CPU machines).
4. **Machine Learning**: Anomaly metrics and recursive forecasting are calculated using **scikit-learn** and **XGBoost** models.
5. **AI Copilot Insights**: Structured metrics are processed via prompt-templates and audited by **Vertex AI Gemini Enterprise Agent** to give business Analysts textual recommendations.

---

## 🛠️ Technology Stack

* **Frontend**: Next.js, React, TypeScript, TailwindCSS, Framer Motion, Recharts.
* **Backend**: FastAPI, Python, SQLAlchemy, JWT Security, SQLite (Local metadata store).
* **AI/ML/GPU**: NVIDIA RAPIDS cuDF, cuML (Fallback pandas/scikit-learn), XGBoost Classifier/Regressor.
* **Deployment**: Docker, Docker Compose, Terraform, GCP Cloud Run.

---

## 🚀 Quick Start Guide (Local Setup)

### 1. Pre-seeded Analyst Credentials
No setup is required to test the login! The system automatically seeds a default analyst user on database creation:
* **Email**: `analyst@insightiq.ai`
* **Password**: `password123`

### 2. Backend Server Execution
```bash
# Navigate to the backend directory
cd backend

# Initialize and activate the virtual environment
python -m venv .venv
.venv/Scripts/activate # On Windows PowerShell
source .venv/bin/activate # On Linux/macOS

# Install requirements
pip install -r requirements.txt

# Run the database migration and launch the server
uvicorn app.main:app --reload
```
The FastAPI documentation will be available at: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Frontend Client Execution
```bash
# Navigate to the frontend directory
cd frontend

# Install Node modules
npm install

# Run the Next.js development server
npm run dev
```
Open your browser at: [http://localhost:3000](http://localhost:3000)

### 4. Running via Docker Compose
To compile and launch both servers together in containers:
```bash
docker-compose up --build
```
* **Frontend Client**: [http://localhost:3000](http://localhost:3000)
* **Backend API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📊 NVIDIA GPU Acceleration Page
Navigate to the **GPU Analytics** tab to run side-by-side execution benchmarks comparing CPU (pandas) vs GPU (RAPIDS cuDF) across ingestion, sorting, grouping, and statistical summaries. The page showcases a **10x to 15x acceleration factor** with detailed GPU memory logs.
