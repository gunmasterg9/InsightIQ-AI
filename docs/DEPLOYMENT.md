# Deployment Guide - InsightIQ AI

This document details how to deploy the platform using Docker, Docker Compose, and Terraform to **Google Cloud Run**.

---

## 🐋 1. Local Containerized Orchestration (Docker)

To test the multi-container setup locally, make sure Docker Desktop is active and run:

```bash
# Build and run containers
docker-compose up --build
```
This binds:
* **Frontend client**: Port 3000 -> [http://localhost:3000](http://localhost:3000)
* **Backend server**: Port 8000 -> [http://localhost:8000](http://localhost:8000)

---

## 🌍 2. Google Cloud Deployment (Terraform)

### Prerequisites
* Google Cloud CLI configured with owner permissions on your project.
* Enabled Cloud Run, Artifact Registry, Storage, BigQuery, and Secret Manager APIs.

### Deployment Workflow

#### Step 1: Build and Push Containers to Artifact Registry
Authenticate Docker with your GCP registry:
```bash
gcloud auth configure-docker us-central1-docker.pkg.dev
```

Build the backend and frontend production images:
```bash
# Build Backend
docker build -t us-central1-docker.pkg.dev/[PROJECT_ID]/insightiq/backend:latest -f docker/Dockerfile.backend .
docker push us-central1-docker.pkg.dev/[PROJECT_ID]/insightiq/backend:latest

# Build Frontend
docker build -t us-central1-docker.pkg.dev/[PROJECT_ID]/insightiq/frontend:latest -f docker/Dockerfile.frontend .
docker push us-central1-docker.pkg.dev/[PROJECT_ID]/insightiq/frontend:latest
```

#### Step 2: Initialize Infrastructure via Terraform
```bash
cd terraform
terraform init

# Plan deployments
terraform plan -var="project_id=[PROJECT_ID]"

# Apply plans
terraform apply -var="project_id=[PROJECT_ID]"
```

Upon successful completion, Terraform outputs:
* GCS Bucket URI
* BigQuery dataset ID
* Backend API public URL
* Frontend Next.js URL

#### Step 3: Secret Manager Configuration
Store your credentials in Secret Manager under the created handles:
1. `insightiq-jwt-secret`: Save a randomly generated secure string for JWT generation.
2. `insightiq-gemini-api-key`: Save your Gemini API key to enable Vertex AI insights in production.
