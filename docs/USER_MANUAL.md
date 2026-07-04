# User Manual & Operation Guide - InsightIQ AI

Welcome to **InsightIQ AI**! This manual guides you through the user journey to extract business value from raw transactional data.

---

## 🔑 1. Getting Started & Authentication

1. Open your browser and navigate to [http://localhost:3000](http://localhost:3000).
2. Enter the default analyst credentials:
   * **Email**: `analyst@insightiq.ai`
   * **Password**: `password123`
3. Click **Sign In**.

---

## 📂 2. Dataset Ingestion (Next.js dropzone)

1. Click **Upload Dataset** in the sidebar.
2. Select or drag a `.csv`, `.xlsx`, or `.json` file containing business transactions into the dashed dropzone.
3. Click **Injest Data into BigQuery**.
4. Once the upload finishes, a success banner appears. Click **Trigger Auto-Clean**.

---

## 🧹 3. Dataset Catalog & Auto-Clean

1. Navigate to the **Datasets List** page.
2. If your dataset status is "Uploaded", click **Clean Data**.
3. The RAPIDS engine imputes null values, drops duplicates, and resolves outliers.
4. The system calculates a **Data Quality Score** (e.g. 92.5%) and displays it.

---

## 📊 4. GPU Benchmarks & Analytics

1. Select **GPU Analytics** in the sidebar.
2. Click **Run Benchmark Test** to compare Pandas CPU vs cuDF GPU speeds on the uploaded dataset.
3. The page displays the speedup multiplier (e.g. **12.6x Faster**) and audited pipeline times.
4. Scroll down to inspect the correlation heatmap between categories.

---

## 📈 5. Forecasting & Machine Learning

1. Navigate to the **ML Forecasting** page.
2. Select your forecast horizon (30, 60, or 90 days) and model choice (e.g. XGBoost).
3. Click **Retrain & Predict** to train model trees on daily revenue and forecast sales trends.
4. Inspect the **Customer Segmentation** scatter plot to identify quadrants of strategic, standard, or high-risk corporate accounts.

---

## 🧠 6. AI Copilot Insights

1. Click **AI Insights** in the sidebar.
2. Use the **Gemini AI Copilot** chatbot to ask questions about your data:
   * *Why are sales declining?*
   * *Predict next month's revenue.*
   * *Explain anomalies.*
3. Gemini outputs a professional markdown summary and recommends actionable business holds.

---

## 📑 7. Reports & Document Export

1. Select **Reports Export** in the sidebar.
2. Click **Download Report** next to any card:
   * **Executive Business Summary (PDF)**: Generates a formatted PDF report showing statistics, data health, and actions.
   * **Transaction Audit Log (Excel)**: Downloads the parsed excel sheet.
   * **Raw Ingestion Dataset (CSV)**: Downloads the raw CSV log.
