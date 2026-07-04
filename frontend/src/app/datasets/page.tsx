"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { Database, Trash2, Cpu, CheckCircle, Clock, AlertTriangle, Sparkles } from "lucide-react";

interface Dataset {
  id: number;
  filename: string;
  size_bytes: number;
  row_count: number;
  cleanliness_score: number;
  status: string;
  gcs_uri?: string;
  bq_table?: string;
  created_at: string;
}

export default function DatasetsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [cleaningId, setCleaningId] = useState<number | null>(null);
  const [cleaningStats, setCleaningStats] = useState<any | null>(null);

  const fetchDatasets = async () => {
    try {
      const token = localStorage.getItem("insightiq-token");
      const res = await fetch("http://localhost:8000/api/v1/datasets/", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setDatasets(data);
    } catch (e) {
      // Offline fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("insightiq-token");
    if (!token) {
      router.push("/login");
      return;
    }
    
    fetchDatasets().then(() => {
      // Check if URL specifies auto-cleaning
      const cleanParam = searchParams.get("clean");
      if (cleanParam) {
        const id = parseInt(cleanParam);
        if (!isNaN(id)) {
          triggerClean(id);
        }
      }
    });
  }, [router, searchParams]);

  const triggerClean = async (id: number) => {
    setCleaningId(id);
    setCleaningStats(null);
    try {
      const token = localStorage.getItem("insightiq-token");
      
      // Update local state temporarily to Processing
      setDatasets((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: "Processing" } : d))
      );

      const res = await fetch(`http://localhost:8000/api/v1/datasets/${id}/clean`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error("Cleaning failed");
      const stats = await res.json();
      setCleaningStats(stats);
      await fetchDatasets();
    } catch (e) {
      alert("Auto-cleaning pipeline failed. Please check the CUDA/backend logs.");
      fetchDatasets();
    } finally {
      setCleaningId(null);
    }
  };

  const deleteDataset = async (id: number) => {
    if (!confirm("Are you sure you want to remove this dataset from GCS & BigQuery?")) return;
    try {
      const token = localStorage.getItem("insightiq-token");
      const res = await fetch(`http://localhost:8000/api/v1/datasets/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        fetchDatasets();
      }
    } catch (e) {
      // Delete failure
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Cleaned":
        return <CheckCircle className="w-4.5 h-4.5 text-emerald-500" />;
      case "Processing":
        return <Cpu className="w-4.5 h-4.5 text-primary animate-spin" />;
      case "Error":
        return <AlertTriangle className="w-4.5 h-4.5 text-red-500" />;
      default:
        return <Clock className="w-4.5 h-4.5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Cleaned":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20";
      case "Processing":
        return "bg-primary/10 text-primary border border-primary/20";
      case "Error":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-500 border dark:border-slate-800";
    }
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
        <Navbar title="Intelligence Data Catalog" />
        
        <main className="flex-1 p-8 space-y-8">
          
          {/* Cleaning Stats Banner */}
          {cleaningStats && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-nvidia/10 via-nvidia/5 to-transparent border border-nvidia/20 flex flex-col gap-3 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  RAPIDS Auto-Cleaning Completed <Sparkles className="w-4 h-4 text-nvidia fill-nvidia/20" />
                </h3>
                <span className="text-xs text-nvidia font-bold">cuDF Engine Active</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Data Quality Score</span>
                  <span className="text-xl font-extrabold text-nvidia">{cleaningStats.cleanliness_score}%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Nulls Imputed</span>
                  <span className="text-xl font-extrabold text-slate-800 dark:text-slate-200">{cleaningStats.nulls_filled}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Duplicates Dropped</span>
                  <span className="text-xl font-extrabold text-slate-800 dark:text-slate-200">{cleaningStats.duplicates_removed}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Outliers Flagged</span>
                  <span className="text-xl font-extrabold text-slate-800 dark:text-slate-200">{cleaningStats.outliers_handled}</span>
                </div>
              </div>
            </div>
          )}

          {/* Catalog List */}
          <div className="glass p-6 rounded-3xl border shadow-xl flex flex-col gap-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Dataset Catalog</h3>

            {datasets.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Database className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-bold text-sm">No Datasets Ingested Yet</p>
                <p className="text-xs text-slate-500 mt-1">Please use the Upload Dataset panel to add data.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b text-slate-500 font-bold">
                      <th className="pb-3 pl-4">Filename</th>
                      <th className="pb-3">Size</th>
                      <th className="pb-3">Cleanliness</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">BigQuery Table</th>
                      <th className="pb-3 pr-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-700 dark:text-slate-300">
                    {datasets.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                        <td className="py-4 pl-4 font-bold max-w-[200px] truncate">{d.filename}</td>
                        <td className="py-4">{(d.size_bytes / 1024).toFixed(1)} KB</td>
                        <td className="py-4 font-bold text-nvidia">
                          {d.status === "Cleaned" ? `${d.cleanliness_score}%` : "--"}
                        </td>
                        <td className="py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 ${getStatusBadge(d.status)}`}>
                            {getStatusIcon(d.status)}
                            {d.status}
                          </span>
                        </td>
                        <td className="py-4 font-mono text-[10px] max-w-[150px] truncate">
                          {d.bq_table || "--"}
                        </td>
                        <td className="py-4 pr-4 text-right">
                          <div className="flex justify-end gap-3">
                            {d.status !== "Cleaned" && d.status !== "Processing" && (
                              <button
                                onClick={() => triggerClean(d.id)}
                                className="px-3 py-1.5 bg-primary hover:bg-blue-600 text-white rounded-lg text-[11px] font-bold shadow"
                              >
                                Clean Data
                              </button>
                            )}
                            <button
                              onClick={() => deleteDataset(d.id)}
                              className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                              title="Delete"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
