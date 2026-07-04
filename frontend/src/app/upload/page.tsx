"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { Upload, File, CheckCircle, AlertCircle, ArrowRight, Server, FileSpreadsheet, Globe, Database } from "lucide-react";

export default function UploadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [datasetId, setDatasetId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("insightiq-token");
    if (!token) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (ext && ["csv", "xlsx", "xls", "json"].includes(ext)) {
      setFile(selectedFile);
      setUploadStatus("idle");
      setErrorMsg("");
    } else {
      setErrorMsg("Invalid format. Please load a CSV, Excel, or JSON file.");
      setFile(null);
    }
  };

  const handleUploadSubmit = async () => {
    if (!file) return;

    setUploadStatus("uploading");
    setUploadProgress(10);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("insightiq-token");
      
      // Simulate progress bar increments
      const interval = setInterval(() => {
        setUploadProgress((p) => (p < 80 ? p + 15 : p));
      }, 300);

      const res = await fetch("https://insightiq-backend-1018473658663.us-central1.run.app/api/v1/datasets/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      clearInterval(interval);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Upload failed");
      }

      const data = await res.json();
      setDatasetId(data.id);
      setUploadProgress(100);
      setUploadStatus("success");
    } catch (e: any) {
      setErrorMsg(e.message || "Failed to upload file to GCS/BigQuery");
      setUploadStatus("error");
    }
  };

  const triggerClean = async () => {
    if (!datasetId) return;
    router.push(`/datasets?clean=${datasetId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50/50 dark:bg-slate-950/20">
      <Sidebar />
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        <Navbar title="Dataset Ingestion Panel" />
        
        <main className="flex-1 p-8 max-w-4xl space-y-8">
          
          {/* Form Zone */}
          <div className="glass p-8 rounded-3xl border shadow-xl flex flex-col gap-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Upload New Dataset</h3>
              <p className="text-xs text-slate-500">
                Drag and drop your dataset to sync to Google Cloud Storage and warehouse in BigQuery.
              </p>
            </div>

            {/* Drag Zone */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 flex flex-col items-center justify-center gap-4 ${
                dragActive 
                  ? "border-primary bg-primary/5 scale-[1.01]" 
                  : "border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 bg-slate-50/20 dark:bg-slate-900/10"
              }`}
            >
              <input
                type="file"
                id="file-upload"
                onChange={handleChange}
                accept=".csv, .xlsx, .xls, .json"
                className="hidden"
              />
              
              {file ? (
                <>
                  <File className="w-12 h-12 text-primary" />
                  <div>
                    <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{file.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-slate-400 dark:text-slate-500 animate-pulse" />
                  <div>
                    <label 
                      htmlFor="file-upload" 
                      className="font-bold text-sm text-primary hover:underline cursor-pointer"
                    >
                      Browse Files
                    </label>
                    <span className="text-slate-500 text-sm"> or drag and drop here</span>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                      Supported formats: CSV, Excel, JSON. Max size 25MB.
                    </p>
                  </div>
                </>
              )}
            </div>

            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Actions / Upload Status */}
            {uploadStatus === "uploading" && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>Uploading to Google Cloud Storage...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {uploadStatus === "success" && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 shrink-0 text-emerald-500" />
                  <div>
                    <p className="font-bold">Sync Successful!</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Ingested into BigQuery table.
                    </p>
                  </div>
                </div>
                <button
                  onClick={triggerClean}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 shadow"
                >
                  Trigger Auto-Clean <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {file && uploadStatus === "idle" && (
              <button
                onClick={handleUploadSubmit}
                className="w-full py-3.5 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-primary/20"
              >
                Injest Data into BigQuery
              </button>
            )}
          </div>

          {/* Connectors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass p-5 rounded-2xl border flex flex-col gap-3 hover:scale-[1.02] transition-all cursor-pointer">
              <div className="p-2 w-fit rounded-lg bg-google-green/10 text-google-green">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Google Sheets</h4>
              <p className="text-[11px] text-slate-500">Connect spreadsheets from Google Drive folders directly.</p>
            </div>
            
            <div className="glass p-5 rounded-2xl border flex flex-col gap-3 hover:scale-[1.02] transition-all cursor-pointer">
              <div className="p-2 w-fit rounded-lg bg-blue-500/10 text-blue-500">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">BigQuery Tables</h4>
              <p className="text-[11px] text-slate-500">Load directly from existing data warehouse schemas.</p>
            </div>

            <div className="glass p-5 rounded-2xl border flex flex-col gap-3 hover:scale-[1.02] transition-all cursor-pointer">
              <div className="p-2 w-fit rounded-lg bg-google-blue/10 text-google-blue">
                <Globe className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Cloud Storage</h4>
              <p className="text-[11px] text-slate-500">Attach GCS buckets and ingest raw cloud folders.</p>
            </div>

            <div className="glass p-5 rounded-2xl border flex flex-col gap-3 hover:scale-[1.02] transition-all cursor-pointer">
              <div className="p-2 w-fit rounded-lg bg-purple-500/10 text-purple-500">
                <Server className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">SQL API Webhook</h4>
              <p className="text-[11px] text-slate-500">Post transaction payload streams via REST endpoint.</p>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
