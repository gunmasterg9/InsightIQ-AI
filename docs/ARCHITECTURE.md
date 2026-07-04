# System Architecture Guide - InsightIQ AI

This document maps out the system architecture, component relationships, and data workflows of the **InsightIQ AI Decision Intelligence Platform**.

---

## 🗺️ Architectural Diagram

```mermaid
graph TD
    %% Clients & Presentation
    subgraph UI ["Presentation Layer (Client)"]
        Next["Next.js Application"]
        Recharts["Recharts Visuals"]
        CopilotUI["AI Copilot Pane"]
    end

    %% Web Server & Orchestration
    subgraph API ["Orchestration Layer (Backend)"]
        FastAPI["FastAPI Web Server"]
        JWT["JWT Auth Guards"]
        SQLite["SQLite (Auth & Catalog Metadata)"]
    end

    %% Storage & Warehouse
    subgraph GCP ["Google Cloud Infrastructure"]
        GCS["Google Cloud Storage (Raw Files)"]
        BQ["BigQuery (Data Warehouse Data)"]
        Gemini["Vertex AI (Gemini Enterprise Agent)"]
    end

    %% Acceleration Engine
    subgraph Compute ["GPU Acceleration Layer (NVIDIA RAPIDS)"]
        cuDF["NVIDIA cuDF (GPU DataFrames)"]
        cuML["NVIDIA cuML (Clustering & Stats)"]
        XGB["XGBoost (Forecast & Classification)"]
    end

    %% Connections
    Next -- Auth & API calls --> FastAPI
    FastAPI -- Save User/Dataset metadata --> SQLite
    FastAPI -- Direct stream --> GCS
    GCS -- Sync Ingest --> BQ
    FastAPI -- Load File --> cuDF
    cuDF -- Cleaned Array --> GCS
    cuDF -- Train & Infer --> XGB
    XGB -- ML Predictions --> FastAPI
    BQ -- Compute Stats --> Gemini
    Gemini -- Text Inferences --> CopilotUI
    Recharts -- Render API data --> Next
```

---

## 📂 Component Specifications

### 1. Ingestion Layer
* **Technology**: Next.js custom dropzone -> FastAPI Multipart payload.
* **Mechanism**: Files are parsed locally to check structure (.csv, .xlsx, .json). Valid payloads are saved temporarily, uploaded to GCS, and loaded into BigQuery.

### 2. GPU Acceleration Layer
* **Technology**: NVIDIA RAPIDS (cuDF / cuML), CUDA cores.
* **Mechanism**: Instead of heavy CPU threads, cleaning logic (median imputation, drop duplicates, and sorting) is parallelized on GPU threads via cuDF. The system compares execution speeds and highlights the acceleration factor on the benchmark page.

### 3. Machine Learning Layer
* **Models**:
  * **Recursive Forecasting**: XGBoost Regressor predicts daily revenue using 7-day and 14-day lags.
  * **Fraud Detection**: XGBoost Classifier identifies high-risk anomalous transactions based on transaction value and categorical variables.
  * **Customer Segmentation**: K-Means clustering groups clients into 4 distinct quadrants (e.g. Strategic, Risky).

### 4. AI Insight Copilot Layer
* **Technology**: Vertex AI Gemini API.
* **Mechanism**: Summarized dataset details and anomalies are appended as prompt context. Gemini structures key findings and outputs recommendations.
