# API Documentation - InsightIQ AI

The **InsightIQ AI** backend service is built using FastAPI. It exposes JWT authentication guards, ingestion interfaces, machine learning modeling routers, and ReportLab PDF exporters.

---

## 🔐 1. Authentication Router
All auth endpoints are nested under `/api/v1/auth`.

### `POST /register`
Creates a new user account.
* **Payload**:
  ```json
  {
    "email": "analyst@insightiq.ai",
    "password": "password123",
    "full_name": "Alex Mercer",
    "role": "Business Analyst"
  }
  ```
* **Response**: `201 Created`
  ```json
  {
    "id": 1,
    "email": "analyst@insightiq.ai",
    "full_name": "Alex Mercer",
    "role": "Business Analyst",
    "created_at": "2026-07-04T13:30:00"
  }
  ```

### `POST /login`
Authenticates user and returns JWT token.
* **Payload**:
  ```json
  {
    "email": "analyst@insightiq.ai",
    "password": "password123"
  }
  ```
* **Response**: `200 OK`
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsIn...",
    "token_type": "bearer",
    "user": {
      "id": 1,
      "email": "analyst@insightiq.ai",
      "full_name": "Alex Mercer",
      "role": "Business Analyst"
    }
  }
  ```

---

## 📂 2. Datasets Router
All dataset endpoints require a valid JWT bearer token. Nested under `/api/v1/datasets`.

### `POST /upload`
Uploads a dataset to GCS and registers in SQLite database.
* **Payload**: `multipart/form-data` with key `file` (supports `.csv`, `.xlsx`, `.json`).
* **Response**: `201 Created`

### `POST /{dataset_id}/clean`
Triggers the RAPIDS cuDF cleaning pipeline (imputation, deduplication, outlier capping) and pushes results to GCS and BigQuery.
* **Response**: `200 OK`

### `GET /`
Lists all uploaded datasets.
* **Response**: `200 OK`

---

## 📊 3. Analytics & ML Router
Require authentication. Nested under `/api/v1/analytics`.

### `GET /benchmark`
Runs CPU vs GPU benchmark for a dataset.
* **Query Parameters**: `dataset_id` (0 for default transaction sample).
* **Response**: `200 OK`

### `GET /forecast`
Executes forecasting regressor on daily revenue.
* **Query Parameters**: `dataset_id` (0 for sample), `days` (forecast horizon: 30, 60, 90).
* **Response**: `200 OK`

### `GET /customer-segmentation`
Segments clients using K-Means clustering.
* **Response**: `200 OK`

---

## 🧠 4. AI Copilot Router
Nested under `/api/v1/ai`.

### `GET /copilot`
Sends queries to Gemini Enterprise Agent.
* **Query Parameters**: `query` (URL encoded string), `dataset_id` (0 for sample).
* **Response**: `200 OK`

---

## 📝 5. Reports Router
Nested under `/api/v1/reports`.

### `GET /export/pdf`
Generates a ReportLab PDF summary of the data and starts download.
* **Response**: `application/pdf` binary stream.
