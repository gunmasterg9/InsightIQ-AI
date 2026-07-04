provider "google" {
  project = var.project_id
  region  = var.region
}

# 1. Google Cloud Storage Bucket for Datasets Ingestion
resource "google_storage_bucket" "datasets_bucket" {
  name          = "${var.project_id}-datasets"
  location      = "US"
  force_destroy = true

  uniform_bucket_level_access = true

  cors {
    origin          = ["http://localhost:3000"]
    method          = ["GET", "POST", "PUT", "DELETE"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}

# 2. BigQuery Dataset for Data Warehouse Storage
resource "google_bigquery_dataset" "analytics_dataset" {
  dataset_id                  = "insightiq_analytics"
  friendly_name               = "InsightIQ AI Data Warehouse"
  description                 = "Aggregated dataset and tables for GPU analytics and ML forecasting."
  location                    = "US"
  default_table_expiration_ms = 3600000 * 24 * 30 # 30 days
}

# 3. Secret Manager for JWT Secret key
resource "google_secret_manager_secret" "jwt_secret" {
  secret_id = "insightiq-jwt-secret"

  replication {
    auto {}
  }
}

# 4. Secret Manager for Gemini API key
resource "google_secret_manager_secret" "gemini_key" {
  secret_id = "insightiq-gemini-api-key"

  replication {
    auto {}
  }
}

# 5. Cloud Run Service for Backend Server
resource "google_cloud_run_v2_service" "backend_service" {
  name     = "insightiq-backend"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    containers {
      image = "gcr.io/${var.project_id}/insightiq-backend:latest"
      
      ports {
        container_port = 8000
      }

      env {
        name  = "DATABASE_URL"
        value = "sqlite:///./insightiq.db"
      }
      env {
        name  = "GCS_BUCKET_NAME"
        value = google_storage_bucket.datasets_bucket.name
      }
      env {
        name  = "BQ_DATASET_NAME"
        value = google_bigquery_dataset.analytics_dataset.dataset_id
      }
      env {
        name  = "GOOGLE_CLOUD_PROJECT"
        value = var.project_id
      }
      env {
        name  = "MOCK_GCP"
        value = "false"
      }
      
      # Bind secret manager references
      env {
        name = "SECRET_KEY"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.jwt_secret.secret_id
            version = "latest"
          }
        }
      }
      env {
        name = "GEMINI_API_KEY"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.gemini_key.secret_id
            version = "latest"
          }
        }
      }

      resources {
        limits = {
          cpu    = "2"
          memory = "4Gi"
        }
      }
    }
  }
}

# 6. Cloud Run Service for Frontend Next.js Client
resource "google_cloud_run_v2_service" "frontend_service" {
  name     = "insightiq-frontend"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    containers {
      image = "gcr.io/${var.project_id}/insightiq-frontend:latest"
      ports {
        container_port = 3000
      }
      resources {
        limits = {
          cpu    = "1"
          memory = "2Gi"
        }
      }
    }
  }
}
