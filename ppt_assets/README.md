# Presentation Assets & Pitch Deck Guide - InsightIQ AI

This folder contains resources and blueprints to build the presentation deck for the **Google Cloud × NVIDIA Data Intelligence Challenge**.

---

## 🗂️ Pitch Deck Slide Structure

### Slide 1: Cover & Intro
* **Title**: InsightIQ AI
* **Subtitle**: GPU-Accelerated Decision Intelligence for Enterprise Data
* **Tagline**: From Raw Data to Better Decisions in Seconds.

### Slide 2: Problem Statement & Opportunity
* **Core Issue**: Organizations ingest massive transactional data but suffer from slow CPU auditing latency, missing values, undetected fraud anomalies, and delayed decision cycles.
* **Opportunity**: Using NVIDIA RAPIDS on Google Cloud scales cleaning and ML forecasting speeds by 10x-15x, shifting analytics from retrospective logs to real-time action.

### Slide 3: Process Flow & User Journey
* *Visual Diagram*: Refer to [diagrams.md](file:///d:/Desktop/Gen%20AI%20Academy%20APAC%20Edition/ppt_assets/diagrams.md#L3-L20) for the Process Flow.
* **Flow**: Login -> Ingestion (GCS) -> Warehouse (BigQuery) -> GPU Auto-Clean (cuDF) -> Predictions (XGBoost) -> AI Copilot Recommendations (Gemini) -> Export Reports.

### Slide 4: Technology Stack
* *Visual Diagram*: Refer to [diagrams.md](file:///d:/Desktop/Gen%20AI%20Academy%20APAC%20Edition/ppt_assets/diagrams.md#L24-L39).
* **Details**: Next.js & TypeScript, FastAPI, NVIDIA cuDF & cuML, Google GCS, BigQuery, Vertex AI Gemini.

### Slide 5: NVIDIA GPU Acceleration Benchmarks
* *Visual Chart*: Refer to [BENCHMARK_REPORT.md](file:///d:/Desktop/Gen%20AI%20Academy%20APAC%20Edition/docs/BENCHMARK_REPORT.md).
* **Details**: side-by-side comparison of Pandas CPU (182.4ms) vs cuDF GPU (14.5ms) representing a **12.6x Speedup** on standard transaction queries.

### Slide 6: ML & AI Copilot Insights
* **Details**: Customer segmentation via K-Means clusters (High Spend / Low Risk) and Sales forecasting via XGBoost Regressors. Natural language query processing via Gemini Enterprise Agent.

### Slide 7: Summary & Impact
* **Impact**: Decreases time-to-insight from hours to seconds. Secure cloud hosting on Cloud Run with Terraform.
