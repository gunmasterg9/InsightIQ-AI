# Demo Video Narration Script - InsightIQ AI
### Voiceover & Visual Direction (3 Minutes)

---

## 🎬 Act 1: The Problem & Ingestion (0:00 - 0:45)

* **Visual**: Camera pans over the Next.js landing login screen. The presenter logs in with the default credentials (`analyst@insightiq.ai` / `password123`). The dashboard loads with smooth Framer Motion transitions showing rich metrics.
* **Audio (Narration)**:
  > *"Every day, organizations ingest millions of transaction rows, but slow CPU-based architectures bottleneck data audit pipelines. Today, we're launching InsightIQ AI—a decision intelligence platform designed to clean, predict, and extract business value in seconds."*
* **Visual**: Presenter clicks on the **Upload Dataset** tab, drags `business_transactions.csv` into the dropzone, and clicks "Ingest". The progress bar animate-updates.
* **Audio (Narration)**:
  > *"Here, our raw spreadsheet is ingested, copied to Google Cloud Storage, and automatically synchronized into BigQuery schema tables. The ingestion pipeline handles Excel, CSV, and JSON seamlessly."*

---

## ⚙️ Act 2: GPU Cleaning & Benchmarking (0:45 - 1:45)

* **Visual**: Presenter navigates to **Datasets List**, showing the quality score, then navigates to **GPU Analytics** and clicks "Run Benchmark Test". The side-by-side Recharts double bar comparing CPU vs GPU loads instantly, highlighting a **12.6x Speedup**.
* **Audio (Narration)**:
  > *"Once warehoused, we trigger our auto-cleaning pipeline. Standard CPU Pandas processing takes 182 milliseconds for sorting, grouping, and imputing. But by parallelizing operations on NVIDIA CUDA GPU threads via RAPIDS cuDF, we complete the clean-up in just 14 milliseconds—representing a massive twelve point six times speedup. This translates to instant auditing, even on millions of customer rows."*
* **Visual**: Scroll down to show the category correlation matrix.
* **Audio (Narration)**:
  > *"Our data is now quality-indexed. We can visually audit correlations between categories using cuML Pearson calculations."*

---

## 🔮 Act 3: ML Forecasting & Gemini AI (1:45 - 2:30)

* **Visual**: Presenter clicks on **ML Forecasting**, selects meta models, and clicks "Retrain". A Composed Chart appears, rendering blue historical bars merging into green dashed forecast lines. The presenter scrolls down to show customer scatter points clustered in four quadrants.
* **Audio (Narration)**:
  > *"Next, we retrain our XGBoost trees. Within seconds, we forecast sales trends and map customer clusters using K-Means. We isolate strategic, high-value corporate partners from high-risk payment processor accounts."*
* **Visual**: Presenter clicks **AI Insights**, types *"Predict next month's revenue"* in the Copilot prompt, and clicks send. The typing state updates and Gemini responds with structured markdown analysis and list recommendations.
* **Audio (Narration)**:
  > *"To guide executive actions, our Gemini Enterprise Copilot integrates with BigQuery. We can ask natural language questions like 'predict revenue' or 'explain anomalies'. Gemini compiles transaction summaries and delivers immediate holds recommendations."*

---

## 💾 Act 4: Export Reports & Outro (2:30 - 3:00)

* **Visual**: Presenter navigates to **Reports Export** and clicks "Download Report" for the Executive PDF summary. The PDF download starts and opens, displaying the tables.
* **Audio (Narration)**:
  > *"Finally, we export our findings. With one click, the backend uses ReportLab to generate a formatted PDF Executive Summary, Excel audit files, and CSV datasets. InsightIQ AI takes you from raw spreadsheets to business-critical decisions in seconds. Built on Google Cloud and accelerated by NVIDIA."*
* **Visual**: Pushes back to the dashboard. Screen fades to dark showing the tagline: *"From Raw Data to Better Decisions in Seconds."*
