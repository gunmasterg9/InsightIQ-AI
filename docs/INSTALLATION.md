# Installation & Configuration Guide - InsightIQ AI

Follow these instructions to configure and execute **InsightIQ AI** in a local development environment.

---

## 📋 Prerequisites
Ensure you have the following installed:
1. **Python v3.11.x**: Required for Uvicorn and FastAPI backend packages.
2. **Node.js v24.x** & **npm v11.x**: For building Next.js.
3. **Google Cloud CLI**: For BigQuery/GCS integration.
4. **NVIDIA CUDA Toolkit & RAPIDS** (Optional): For native GPU execution.

---

## 🛠️ Installation Steps

### 1. Clone & Set Up Directory structure
Ensure the folder layout matches the repository:
```text
InsightIQ-AI/
├── backend/
├── frontend/
└── sample_data/
```

### 2. Backend Environment Configuration
Initialize the local SQLite database and install packages:
```bash
cd backend
python -m venv .venv

# Activate venv (Windows PowerShell)
.venv\Scripts\activate

# Install requirements
pip install -r requirements.txt
```

### 3. Frontend Client Ingestion
Install Next.js dependencies:
```bash
cd ../frontend
npm install
```

### 4. Running the Servers
Start both servers in separate terminal panes:
* **Backend**: `uvicorn app.main:app --reload` (Launches on [http://localhost:8000](http://localhost:8000))
* **Frontend**: `npm run dev` (Launches on [http://localhost:3000](http://localhost:3000))

---

## ⚙️ Environment Variables (.env)
You can configure a `.env` file in the `backend/` directory to connect to production resources:

```env
# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT=your-gcp-project-id
GCS_BUCKET_NAME=your-gcs-bucket-name
BQ_DATASET_NAME=your-bigquery-dataset-name

# Gemini API Key (Vertex AI Fallback)
GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere

# Mock Controls (Set to false to use actual Google Cloud)
MOCK_GCP=false
```
If variables are not provided, the backend automatically runs in **Mock GCP Mode**, allowing all APIs (except GCS sync and BigQuery queries) to output realistic simulated metrics for local evaluation.
