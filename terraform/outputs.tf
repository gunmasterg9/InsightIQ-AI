output "gcs_bucket_url" {
  description = "The URL of the GCS bucket for dataset uploads."
  value       = google_storage_bucket.datasets_bucket.url
}

output "bigquery_dataset_id" {
  description = "The BigQuery dataset ID."
  value       = google_bigquery_dataset.analytics_dataset.dataset_id
}

output "backend_endpoint" {
  description = "The public endpoint of the backend Cloud Run service."
  value       = google_cloud_run_v2_service.backend_service.uri
}

output "frontend_endpoint" {
  description = "The public endpoint of the frontend Cloud Run client."
  value       = google_cloud_run_v2_service.frontend_service.uri
}
