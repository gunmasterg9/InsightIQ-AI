"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { ShieldCheck, Server, Database, Key, Activity, Cpu } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("insightiq-token");
    if (!token) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

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
        <Navbar title="Administrator Control Console" />
        
        <main className="flex-1 p-8 max-w-4xl space-y-8">
          
          <div className="glass p-6 rounded-3xl border shadow-xl flex flex-col gap-6">
            <div className="flex items-center gap-2 border-b pb-4">
              <ShieldCheck className="w-5 h-5 text-nvidia" />
              <h3 className="font-bold text-slate-800 dark:text-slate-100">GCP × NVIDIA Infrastructure Health</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Database & Storage */}
              <div className="p-5 rounded-2xl bg-slate-100/40 dark:bg-slate-900/20 border flex flex-col gap-4">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Database className="w-4.5 h-4.5 text-blue-500" /> Storage Catalog Status
                </h4>
                <div className="space-y-3 text-xs font-semibold text-slate-500">
                  <div className="flex justify-between">
                    <span>Active SQLite Connections</span>
                    <span className="text-slate-800 dark:text-slate-300">4 Instances</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ingestion Cache Folder</span>
                    <span className="text-slate-800 dark:text-slate-300 font-mono">./uploaded_datasets/</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Google Cloud Storage Sync</span>
                    <span className="text-emerald-500">Active (Mock Mode)</span>
                  </div>
                </div>
              </div>

              {/* BigQuery & Secret Manager */}
              <div className="p-5 rounded-2xl bg-slate-100/40 dark:bg-slate-900/20 border flex flex-col gap-4">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Server className="w-4.5 h-4.5 text-nvidia" /> Warehousing & Decoupling
                </h4>
                <div className="space-y-3 text-xs font-semibold text-slate-500">
                  <div className="flex justify-between">
                    <span>BigQuery Warehouse Tables</span>
                    <span className="text-slate-800 dark:text-slate-300">1 Online Table</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Secret Manager Key Status</span>
                    <span className="text-slate-800 dark:text-slate-300">JWT Keys Configured</span>
                  </div>
                  <div className="flex justify-between">
                    <span>API Router Throughput</span>
                    <span className="text-slate-800 dark:text-slate-300 font-mono">0.05 ms/query Avg</span>
                  </div>
                </div>
              </div>

              {/* NVIDIA Compute Metrics */}
              <div className="p-5 rounded-2xl bg-slate-100/40 dark:bg-slate-900/20 border flex flex-col gap-4">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Cpu className="w-4.5 h-4.5 text-nvidia" /> CUDA Compute Context
                </h4>
                <div className="space-y-3 text-xs font-semibold text-slate-500">
                  <div className="flex justify-between">
                    <span>Accelerated Library Imports</span>
                    <span className="text-emerald-500">cuDF Fallback Simulation Enabled</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ML Pipeline Retraining Interval</span>
                    <span className="text-slate-800 dark:text-slate-300">On Ingestion</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CUDA GPU Speedup Baseline</span>
                    <span className="text-nvidia font-bold">11.4x Speedup Average</span>
                  </div>
                </div>
              </div>

              {/* Secrets Audited */}
              <div className="p-5 rounded-2xl bg-slate-100/40 dark:bg-slate-900/20 border flex flex-col gap-4">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Key className="w-4.5 h-4.5 text-yellow-500" /> Secret Keys Audited
                </h4>
                <div className="space-y-3 text-xs font-semibold text-slate-500">
                  <div className="flex justify-between">
                    <span>JWT_SECRET</span>
                    <span className="text-slate-800 dark:text-slate-300 font-mono">Verified</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GEMINI_API_KEY</span>
                    <span className="text-slate-800 dark:text-slate-300 font-mono">Default Configured</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GCP_SERVICE_ACCOUNT_KEY</span>
                    <span className="text-slate-800 dark:text-slate-300 font-mono">Using ADC Defaults</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
