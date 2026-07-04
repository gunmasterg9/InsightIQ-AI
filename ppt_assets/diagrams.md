# Presentation Diagrams Code - InsightIQ AI

Use these Mermaid codes to generate professional diagrams for your pitch deck slides.

---

## 🔄 1. Process Flow Diagram

```mermaid
graph LR
    A[Raw Spreadsheets] --> B[GCS Ingestion]
    B --> C[BigQuery Sync]
    C --> D[RAPIDS cuDF Auto-Clean]
    D --> E[XGBoost Forecasting]
    E --> F[Gemini Copilot Audit]
    F --> G[Next.js Action Dashboard]
```

---

## 🎯 2. Use Case Diagram

```mermaid
graph TD
    User([Business Analyst / CXO]) --> Ingest[Upload Excel/CSV Data]
    User --> Clean[Trigger GPU Cleaning]
    User --> Predict[Generate ML Forecasts]
    User --> Chat[Ask Gemini AI Copilot]
    User --> Export[Export PDF/Excel Reports]

    subgraph Platform ["InsightIQ AI Platform"]
        Ingest
        Clean
        Predict
        Chat
        Export
    end
```

---

## 🛠️ 3. Technology Stack Diagram

```mermaid
graph TD
    subgraph Frontend
        React[Next.js TypeScript]
        Tailwind[TailwindCSS & Framer Motion]
        Recharts[Recharts Interactive Visuals]
    end

    subgraph Backend
        FastAPI[FastAPI Server]
        SQL[SQLAlchemy Database Models]
        JWT[OAuth2 JWT Authentication]
    end

    subgraph GPU_Analytics
        cuDF[NVIDIA cuDF Data Cleaning]
        cuML[NVIDIA cuML Clustering]
        XGB[XGBoost Forecasting Model]
    end

    subgraph GCP_Cloud
        GCS[Cloud Storage]
        BQ[BigQuery Warehouse]
        Gemini[Vertex AI Gemini API]
    end

    React --> FastAPI
    FastAPI --> SQL
    FastAPI --> cuDF
    FastAPI --> GCS
    GCS --> BQ
    BQ --> Gemini
```
