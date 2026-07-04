variable "project_id" {
  description = "The Google Cloud Platform Project ID."
  type        = string
  default     = "insightiq-ai-project-id"
}

variable "region" {
  description = "The target deployment region for Cloud Run services."
  type        = string
  default     = "us-central1"
}
