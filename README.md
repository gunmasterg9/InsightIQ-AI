# 🚀 InsightIQ AI

<div align="center">

![Google Cloud](https://img.shields.io/badge/Google%20Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)
![NVIDIA](https://img.shields.io/badge/NVIDIA%20RAPIDS-76B900?style=for-the-badge&logo=nvidia&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini%20AI-886FBF?style=for-the-badge&logo=google&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js%2015-000000?style=for-the-badge&logo=next.js&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

### From Raw Data to Better Decisions in Seconds

**Accelerated Decision Intelligence Platform** built for the  
**Google Cloud × NVIDIA Gen AI Academy APAC Edition**

[🌐 Live Demo](https://insightiq-frontend-1018473658663.us-central1.run.app) · [📖 Docs](docs/) · [🏗️ Architecture](docs/ARCHITECTURE.md) · [🚀 Deploy](docs/DEPLOYMENT.md)

</div>

---

## ✨ What is InsightIQ AI?

InsightIQ AI is an **end-to-end Decision Intelligence Platform** that transforms raw business data into actionable insights in seconds. It combines **GPU-accelerated analytics** via NVIDIA RAPIDS with **Gemini AI-powered recommendations** on Google Cloud to drastically improve:

- ⚡ **Data Processing Speed** — 10x–15x faster with NVIDIA RAPIDS cuDF
- 🤖 **AI-Driven Decisions** — Natural language insights via Gemini Enterprise Agent
- 🔍 **Fraud & Anomaly Detection** — Real-time risk scoring with XGBoost
- 📈 **Revenue Forecasting** — ML-powered predictions with confidence intervals
- 📊 **Executive Dashboards** — Real-time KPIs, charts, and actionable alerts

---

## 🏗️ Architecture & Processing Pipeline

```
DATA SOURCES          INGESTION         DATA PLATFORM        GPU ACCELERATION       AI/ML & GEN AI         PRESENTATION
─────────────       ──────────────     ─────────────────    ──────────────────     ─────────────────      ──────────────
 CSV / Excel    →    Cloud Storage  →   BigQuery         →   NVIDIA RAPIDS     →   Vertex AI          →   Dashboards
 Google Sheets       Cloud Pub/Sub      Data Catalog          cuDF + cuML           Gemini Enterprise      Alerts
 Databases (SQL)                        Dataplex              XGBoost               NL Insights            Reports
 APIs / Webhooks                        Cloud IAM             10x Faster            Recommendations        Export (PDF)
```

### Platform Workflow

| Step | Component | Technology |
|------|-----------|------------|
| 1️⃣ | **Data Ingestion** | Upload CSV/Excel/JSON → Cloud Storage → BigQuery |
| 2️⃣ | **Data Preparation** | Validation, cleaning, outlier detection, imputation |
| 3️⃣ | **GPU Processing** | NVIDIA RAPIDS cuDF parallel acceleration (10x faster) |
| 4️⃣ | **AI/ML Models** | XGBoost forecasting, fraud detection, clustering |
| 5️⃣ | **AI Insights** | Gemini Enterprise Agent generates recommendations |
| 6️⃣ | **Business Actions** | Dashboards, alerts, reports, exports |

---

## 🖥️ Platform Features (8 Screens)

| # | Screen | Description |
|---|--------|-------------|
| 1 | **Login / Welcome** | Secure JWT auth, pre-seeded demo credentials |
| 2 | **Data Upload** | Drag-and-drop upload, Google Sheets / BigQuery / GCS / SQL connectors |
| 3 | **Executive Dashboard** | KPIs (Revenue, Profit, Risk Score, Growth), charts, alerts |
| 4 | **GPU Analytics** | NVIDIA RAPIDS benchmark suite — CPU vs GPU side-by-side comparison |
| 5 | **AI Insights Copilot** | Natural language chat with Gemini, executive report generation |
| 6 | **ML Forecasting** | XGBoost revenue forecasting, confidence scoring, key drivers |
| 7 | **Alerts & Notifications** | Real-time risk alerts with severity levels and resolve actions |
| 8 | **Reports & Export** | PDF / Excel / CSV generation, scheduled automatic reports |

---

## 🛠️ Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 15, React 19, TypeScript, TailwindCSS, Framer Motion, Recharts |
| **Backend** | FastAPI, Python 3.11, SQLAlchemy, JWT Security, Uvicorn |
| **AI / ML / GPU** | NVIDIA RAPIDS cuDF, cuML, XGBoost, scikit-learn, Vertex AI Gemini |
| **Google Cloud** | Cloud Run, Cloud Storage, BigQuery, Secret Manager, Cloud Build, Artifact Registry |
| **DevOps** | Docker, Docker Compose, Terraform, GitHub |

---

## 🚀 Quick Start

### Pre-seeded Demo Credentials
> **Email**: `analyst@insightiq.ai` &nbsp;|&nbsp; **Password**: `password123`

### Option 1: Local Development

```bash
# Backend
cd backend
python -m venv .venv && .venv/Scripts/activate    # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload                     # → http://localhost:8000

# Frontend (new terminal)
cd frontend
npm install && npm run dev                        # → http://localhost:3000
```

### Option 2: Docker Compose

```bash
docker-compose up --build
```
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8000/docs](http://localhost:8000/docs)

### Option 3: Google Cloud Deployment

See the full [Deployment Guide →](docs/DEPLOYMENT.md)

---

## 📡 Live Production URLs

| Service | URL |
|---------|-----|
| 🌐 Frontend | [https://insightiq-frontend-1018473658663.us-central1.run.app](https://insightiq-frontend-1018473658663.us-central1.run.app) |
| ⚙️ Backend API | [https://insightiq-backend-1018473658663.us-central1.run.app](https://insightiq-backend-1018473658663.us-central1.run.app) |

---

## 📊 NVIDIA GPU Acceleration

Navigate to the **GPU Analytics** tab to run side-by-side execution benchmarks comparing **CPU (pandas)** vs **GPU (RAPIDS cuDF)** across:

| Operation | CPU Time | GPU Time | Speedup |
|-----------|----------|----------|---------|
| Data Ingestion | ~50ms | ~4ms | **11.3x** |
| Sorting | ~45ms | ~3ms | **15x** |
| GroupBy Aggregation | ~38ms | ~5ms | **7.6x** |
| Statistical Summary | ~42ms | ~4ms | **10.5x** |

---

## 🏆 Key Highlights

- ✅ **End-to-End Data to Decision Architecture**
- ✅ **GPU Accelerated Analytics with NVIDIA RAPIDS** (10x–15x speedup)
- ✅ **AI-Powered Insights using Vertex AI & Gemini Enterprise**
- ✅ **Scalable, Secure & Cloud-Native on Google Cloud**
- ✅ **Real-time Dashboards, Alerts & Actionable Recommendations**
- ✅ **8 Fully Functional Production Screens**

---

## 📂 Project Structure

```
InsightIQ-AI/
├── backend/               # FastAPI Python backend
│   ├── app/
│   │   ├── routers/       # API endpoints (auth, datasets, analytics, ai, reports)
│   │   ├── services/      # Business logic (gcp, gpu, ml services)
│   │   └── main.py        # Application entry point
│   └── requirements.txt
├── frontend/              # Next.js React frontend
│   └── src/
│       ├── app/           # Pages (dashboard, upload, datasets, analytics, etc.)
│       └── components/    # Reusable UI components
├── docker/                # Dockerfiles (backend & frontend)
├── terraform/             # Infrastructure as Code
├── docs/                  # Documentation
├── sample_data/           # Demo datasets
└── docker-compose.yml     # Local orchestration
```

---

## 🤝 Use Cases

| Industry | Application |
|----------|------------|
| 🏦 Banking & Finance | Fraud detection, risk scoring, transaction anomalies |
| 🛒 Retail & E-commerce | Customer segmentation, demand forecasting |
| 🏭 Manufacturing | Supply chain optimization, quality analytics |
| 🏥 Healthcare | Patient data analysis, operational efficiency |
| 🏛️ Government | Public data analysis, compliance monitoring |
| 🚀 MSMEs & Startups | Business intelligence, growth forecasting |

---

<div align="center">

**InsightIQ AI** — *From Raw Data to Better Decisions in Seconds* 🚀

Built with ❤️ for **Google Cloud × NVIDIA Gen AI Academy APAC Edition**

**Decision Makers**: CXOs · Business Analysts · Operations Teams · Risk & Compliance · Data Scientists

</div>
