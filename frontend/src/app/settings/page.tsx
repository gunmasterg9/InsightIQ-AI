"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { Settings, Save, ShieldCheck, Database, Server, Cpu } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Settings forms
  const [gcsBucket, setGcsBucket] = useState("insightiq-ai-datasets");
  const [bqDataset, setBqDataset] = useState("insightiq_analytics");
  const [mockGCP, setMockGCP] = useState(true);
  const [cudaEnabled, setCudaEnabled] = useState(true);
  const [apiKey, setApiKey] = useState("••••••••••••••••••••••••");

  useEffect(() => {
    const token = localStorage.getItem("insightiq-token");
    if (!token) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleSave = () => {
    alert("Settings persisted to config parameters.");
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
        <Navbar title="System Settings Panel" />
        
        <main className="flex-1 p-8 max-w-4xl space-y-8">
          
          <div className="glass p-6 rounded-3xl border shadow-xl flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b pb-4">
              <Settings className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Global Configuration</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* GCS Bucket */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" /> GCS Ingestion Bucket
                </label>
                <input
                  type="text"
                  value={gcsBucket}
                  onChange={(e) => setGcsBucket(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-3 text-xs font-medium focus:ring-1 focus:ring-primary dark:text-slate-200"
                />
              </div>

              {/* BigQuery Dataset */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5" /> BigQuery Dataset Namespace
                </label>
                <input
                  type="text"
                  value={bqDataset}
                  onChange={(e) => setBqDataset(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-3 text-xs font-medium focus:ring-1 focus:ring-primary dark:text-slate-200"
                />
              </div>

              {/* Gemini API Key */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Gemini API Credentials
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl px-4 py-3 text-xs font-medium focus:ring-1 focus:ring-primary dark:text-slate-200"
                />
              </div>

              {/* Simulated Modes */}
              <div className="flex flex-col gap-3 justify-center">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5" /> Local Mock GCP Mode
                  </span>
                  <input
                    type="checkbox"
                    checked={mockGCP}
                    onChange={(e) => setMockGCP(e.target.checked)}
                    className="w-4 h-4 text-primary bg-slate-100 border-slate-300 rounded focus:ring-primary"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" /> NVIDIA CUDA Hardware Fallback
                  </span>
                  <input
                    type="checkbox"
                    checked={cudaEnabled}
                    onChange={(e) => setCudaEnabled(e.target.checked)}
                    className="w-4 h-4 text-primary bg-slate-100 border-slate-300 rounded focus:ring-primary"
                  />
                </div>
              </div>

            </div>

            <button
              onClick={handleSave}
              className="w-full py-3.5 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl transition duration-200 shadow-md shadow-primary/10 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Configuration Parameters
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}
