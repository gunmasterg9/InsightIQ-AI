# 🏗️ System Architecture Guide — InsightIQ AI

<div align="center">

**Google Cloud** &nbsp;×&nbsp; **Gen AI Academy** `APAC Edition` &nbsp;×&nbsp; **NVIDIA**

### InsightIQ AI — Accelerated Decision Intelligence Platform
*Scalable • Secure • AI-Powered • GPU Accelerated • Cloud-Native*

</div>

---

## 📐 High-Level Architecture

```mermaid
graph TD
    subgraph Sources ["1. DATA SOURCES"]
        CSV["📄 CSV / Excel"]
        Sheets["📊 Google Sheets"]
        SQL["🗄️ Databases SQL"]
        APIs["🌐 APIs / Web Services"]
        Streams["📡 Real-time Streams"]
    end

    subgraph Ingestion ["2. INGESTION LAYER"]
        GCS["☁️ Cloud Storage"]
        PubSub["📨 Cloud Pub/Sub"]
    end

    subgraph DataPlatform ["3. DATA PLATFORM - GOOGLE CLOUD"]
        direction TB
        ETL["Cloud Dataflow / Dataform / dbt"]
        BQ["🏢 BigQuery - Serverless Analytics"]
        Catalog["Data Catalog + Dataplex"]
        IAM["Cloud IAM"]
        ETL --> BQ
        BQ --> Catalog
    end

    subgraph GPU ["4. GPU ACCELERATION LAYER - NVIDIA"]
        direction TB
        RAPIDS["🟢 NVIDIA RAPIDS"]
        cuDF["cuDF + cuML + cuGraph"]
        GPUML["GPU DataFrames and ML"]
        RAPIDS --> cuDF --> GPUML
    end

    subgraph AIML ["5. AI / ML and GEN AI LAYER"]
        direction TB
        VertexAI["🤖 Vertex AI"]
        Gemini["✨ Gemini Enterprise"]
        Models["Forecasting / Risk / Anomaly / Classification"]
        VertexAI --> Models
        Gemini --> Models
    end

    subgraph Action ["6. PRESENTATION and ACTION LAYER"]
        direction TB
        WebApp["🖥️ Web Application - Cloud Run"]
        Alerts["🔔 Alerts and Notifications"]
        Export["📤 Export - PDF / Excel / CSV"]
    end

    subgraph Users ["END USERS"]
        CXO["👔 CXOs / Executives"]
        Analyst["📊 Business Analysts"]
        Ops["⚙️ Operations Teams"]
        Risk["🛡️ Risk and Compliance"]
        DS["🔬 Data Scientists"]
    end

    Sources --> Ingestion
    Ingestion --> DataPlatform
    DataPlatform --> GPU
    GPU --> AIML
    AIML --> Action
    Action --> Users
```

---

## 🔗 Component Interaction Diagram

```mermaid
graph TD
    subgraph UI ["Presentation Layer - Client"]
        Next["Next.js 15 Application"]
        Recharts["Recharts Visualizations"]
        CopilotUI["AI Copilot Chat Pane"]
    end

    subgraph API ["Orchestration Layer - Backend"]
        FastAPI["FastAPI Web Server"]
        JWT["JWT Auth Guards"]
        SQLite["SQLite - Auth and Catalog Metadata"]
    end

    subgraph GCP ["Google Cloud Infrastructure"]
        GCS["Google Cloud Storage - Raw Files"]
        BQ["BigQuery - Data Warehouse"]
        Gemini["Vertex AI - Gemini Enterprise Agent"]
        SM["Secret Manager - Keys and Credentials"]
    end

    subgraph Compute ["GPU Acceleration Layer - NVIDIA RAPIDS"]
        cuDF["NVIDIA cuDF - GPU DataFrames"]
        cuML["NVIDIA cuML - Clustering and Stats"]
        XGB["XGBoost - Forecast and Classification"]
    end

    Next -- "Auth and API calls" --> FastAPI
    FastAPI -- "Save User/Dataset metadata" --> SQLite
    FastAPI -- "Direct stream upload" --> GCS
    GCS -- "Sync Ingest" --> BQ
    FastAPI -- "Load File for processing" --> cuDF
    cuDF -- "Cleaned DataFrame" --> GCS
    cuDF -- "Train and Infer" --> XGB
    XGB -- "ML Predictions" --> FastAPI
    BQ -- "Compute Stats" --> Gemini
    Gemini -- "Text Inferences" --> CopilotUI
    Recharts -- "Render API data" --> Next
    SM -- "Inject secrets at runtime" --> FastAPI
```

---

## 📂 Component Specifications

### Layer 1 — Data Sources
| Source Type | Format | Ingestion Method |
|-------------|--------|-----------------|
| CSV / Excel | `.csv`, `.xlsx` | Next.js File Upload → FastAPI Multipart |
| Google Sheets | API | OAuth2 Connector (UI ready) |
| Databases (SQL) | SQL queries | API Webhook Connector (UI ready) |
| APIs / Web Services | JSON | REST API Ingestion |

---

### Layer 2 — Ingestion Layer
| Technology | Purpose |
|------------|---------|
| **Cloud Storage (GCS)** | Raw file storage — all uploaded datasets land here first |
| **FastAPI Multipart** | Files parsed locally for structure validation, then streamed to GCS |
| **BigQuery Load Jobs** | Structured data auto-loaded from GCS into BigQuery schemas |

**Mechanism**: Files are validated client-side (format, size), uploaded via multipart POST to FastAPI, saved to GCS bucket, and then loaded into BigQuery with auto-detected schemas.

---

### Layer 3 — Data Platform (Google Cloud)

| Service | Role |
|---------|------|
| **BigQuery** | Serverless data warehouse — stores all analytical data |
| **Data Catalog** | Metadata management and governance |
| **Cloud IAM** | Fine-grained access control and permissions |
| **Secret Manager** | Secure storage for API keys and JWT secrets |

---

### Layer 4 — GPU Acceleration Layer (NVIDIA)

| Component | Purpose | Speedup |
|-----------|---------|---------|
| **cuDF** | GPU-accelerated DataFrames (drop-in pandas replacement) | 10x–15x |
| **cuML** | GPU-accelerated machine learning (clustering, stats) | 5x–8x |
| **cuGraph** | GPU-accelerated graph analytics | 10x+ |

**Mechanism**: Data cleaning operations (median imputation, duplicate removal, sorting, groupby aggregation) are parallelized across thousands of CUDA cores via cuDF. The system benchmarks CPU vs GPU execution and displays the acceleration factor in real-time.

**Accelerated Workloads**:
- ✅ Large Scale Data Processing
- ✅ Feature Engineering
- ✅ ML Training & Inference
- ✅ Fraud & Anomaly Detection
- ✅ Time Series Forecasting

---

### Layer 5 — AI / ML & Gen AI Layer

| Model | Algorithm | Purpose |
|-------|-----------|---------|
| **Revenue Forecasting** | XGBoost Regressor | Predicts daily revenue using 7-day and 14-day lag features |
| **Fraud Detection** | XGBoost Classifier | Identifies high-risk anomalous transactions based on value and category |
| **Customer Segmentation** | K-Means Clustering | Groups clients into 4 quadrants (Strategic, Growing, Risky, Stable) |
| **AI Copilot** | Gemini Enterprise Agent | Natural language insights from dataset statistics and anomalies |

**Gemini Integration**: Summarized dataset metrics and detected anomalies are appended as structured prompt context. Gemini generates executive-level findings and actionable recommendations in markdown format.

---

### Layer 6 — Presentation & Action Layer

| Component | Technology | Function |
|-----------|-----------|----------|
| **Web Application** | Next.js on Cloud Run | Interactive dashboards, real-time insights |
| **Alerts System** | FastAPI + WebSocket | Real-time risk notifications with severity levels |
| **Report Generator** | PDF / Excel / CSV | Scheduled and on-demand report exports |
| **AI Copilot UI** | React Chat Component | Natural language Q&A with Gemini |

---

## 🔐 Cross-Cutting Services (Google Cloud)

| Service | Icon | Purpose |
|---------|------|---------|
| **Cloud Run** | ☁️ | Application Hosting (Serverless Compute) |
| **Cloud Build** | 🔨 | CI/CD Pipeline (Container Image Builds) |
| **Secret Manager** | 🔒 | Secrets & API Keys (JWT, Gemini API Key) |
| **Cloud Logging** | 📝 | Application Logs & Error Tracking |
| **Cloud Monitoring** | 📈 | Metrics, Alerts & Performance Monitoring |
| **Cloud IAM** | 🛡️ | Access Control & Role-Based Permissions |
| **Artifact Registry** | 📦 | Docker Container Image Storage |

---

## 🔧 DevOps & Infrastructure Pipeline

```mermaid
graph LR
    GH["🐙 GitHub\nSource Code"] --> CB["🔨 Cloud Build\nCI/CD Pipeline"]
    CB --> AR["📦 Artifact Registry\nContainer Images"]
    AR --> CR["🚀 Cloud Run\nDeployment"]

    style GH fill:#24292e,color:#fff
    style CB fill:#4285F4,color:#fff
    style AR fill:#34A853,color:#fff
    style CR fill:#EA4335,color:#fff
```

| Step | Service | Action |
|------|---------|--------|
| 1 | **GitHub** | Push code changes to `main` branch |
| 2 | **Cloud Build** | Automatically builds Docker images from Dockerfiles |
| 3 | **Artifact Registry** | Stores versioned container images (`gcr.io/[PROJECT_ID]/...`) |
| 4 | **Cloud Run** | Deploys new revision, routes 100% traffic to latest |

---

## 🌊 Data Flow Legend

| Arrow Style | Meaning |
|-------------|---------|
| ──────→ | Data Flow |
| ─ ─ ─ → | Control / Orchestration |
| · · · · → | User Interaction |
| ═══════→ | Secure & Monitored |

---

## 🏆 Key Highlights

| # | Highlight |
|---|-----------|
| ✅ | End-to-End Data to Decision Architecture |
| ✅ | GPU Accelerated Analytics with NVIDIA RAPIDS (10x–15x speedup) |
| ✅ | AI-Powered Insights using Vertex AI & Gemini Enterprise |
| ✅ | Scalable, Secure & Cloud-Native on Google Cloud |
| ✅ | Real-time Dashboards, Alerts & Actionable Recommendations |
| ✅ | 8 Fully Functional Production Screens |

---

<div align="center">

**InsightIQ AI** — *From Raw Data to Better Decisions in Seconds* 🚀

Built with ❤️ for **Google Cloud × NVIDIA Gen AI Academy APAC Edition**

</div>
