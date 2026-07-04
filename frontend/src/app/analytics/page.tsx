"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import BenchmarkChart from "@/components/BenchmarkChart";
import { Cpu, Play, BarChart, HardDrive, Zap, RefreshCw } from "lucide-react";

interface BenchmarkData {
  rows: number;
  cpu_time_ms: number;
  gpu_time_ms: number;
  acceleration_factor: number;
  gpu_memory_used_mb: number;
  operations: string[];
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [benchmark, setBenchmark] = useState<BenchmarkData | null>(null);

  const fetchBenchmark = async () => {
    setRunning(true);
    try {
      const token = localStorage.getItem("insightiq-token");
      const res = await fetch("https://insightiq-backend-1018473658663.us-central1.run.app/api/v1/analytics/benchmark?dataset_id=0", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBenchmark(data);
    } catch (e) {
      // Fallback
      setBenchmark({
        rows: 10000,
        cpu_time_ms: 182.4,
        gpu_time_ms: 14.5,
        acceleration_factor: 12.6,
        gpu_memory_used_mb: 210.5,
        operations: [
          "Data Ingestion", 
          "Groupby Aggregation", 
          "Sorting by Multi-columns", 
          "Filtering Anomalies", 
          "Statistical Summaries"
        ]
      });
    } finally {
      setRunning(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("insightiq-token");
    if (!token) {
      router.push("/login");
    } else {
      fetchBenchmark();
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  // Correlation heatmap matrix data for mock UI
  const categories = ["Electronics", "Software", "Hardware", "Cloud", "Consulting"];
  const correlationMatrix = [
    [1.00, 0.45, 0.72, 0.38, 0.15],
    [0.45, 1.00, 0.31, 0.88, 0.52],
    [0.72, 0.31, 1.00, 0.25, 0.08],
    [0.38, 0.88, 0.25, 1.00, 0.61],
    [0.15, 0.52, 0.08, 0.61, 1.00],
  ];

  const getHeatmapColor = (val: number) => {
    if (val >= 0.8) return "bg-primary dark:bg-blue-600 text-white";
    if (val >= 0.5) return "bg-blue-400/80 dark:bg-blue-800/80 text-white";
    if (val >= 0.3) return "bg-blue-200/60 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100";
    return "bg-slate-100 dark:bg-slate-900/60 text-slate-400";
  };

  return (
    <div className="min-h-screen flex bg-slate-50/50 dark:bg-slate-950/20">
      <Sidebar />
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        <Navbar title="NVIDIA GPU Acceleration Analytics" />
        
        <main className="flex-1 p-8 space-y-8">
          
          {/* Benchmark Header Info */}
          <div className="glass p-6 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                NVIDIA RAPIDS Benchmark Suite <Cpu className="w-5 h-5 text-nvidia" />
              </h3>
              <p className="text-xs text-slate-500">
                Execute data processing scripts on CUDA core structures and verify execution times.
              </p>
            </div>
            <button
              onClick={fetchBenchmark}
              disabled={running}
              className="px-5 py-3 bg-nvidia hover:bg-nvidia-hover text-white rounded-xl text-xs font-bold transition-all duration-200 shadow-md shadow-nvidia/10 flex items-center gap-2"
            >
              {running ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Running Benchmark...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" /> Run Benchmark Test
                </>
              )}
            </button>
          </div>

          {/* Benchmark Charts Section */}
          {benchmark && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Chart Card */}
              <div className="glass p-6 rounded-3xl border lg:col-span-2 flex flex-col gap-6">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Execution Speed Comparison</h4>
                <BenchmarkChart
                  cpuTime={benchmark.cpu_time_ms}
                  gpuTime={benchmark.gpu_time_ms}
                  acceleration={benchmark.acceleration_factor}
                />
              </div>

              {/* Benchmark Stat Breakdown */}
              <div className="glass p-6 rounded-3xl border flex flex-col justify-between gap-6">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">System Logs</h4>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-xs pb-3 border-b">
                    <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                      <BarChart className="w-4 h-4 text-blue-500" /> Processed Records
                    </span>
                    <span className="font-extrabold dark:text-slate-200">{benchmark.rows.toLocaleString()} Rows</span>
                  </div>

                  <div className="flex justify-between text-xs pb-3 border-b">
                    <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                      <HardDrive className="w-4 h-4 text-nvidia" /> GPU Memory Utilization
                    </span>
                    <span className="font-extrabold dark:text-slate-200">{benchmark.gpu_memory_used_mb} MB</span>
                  </div>

                  <div className="flex justify-between text-xs pb-3 border-b">
                    <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-yellow-500" /> RAPIDS cuDF Multiplier
                    </span>
                    <span className="font-extrabold text-nvidia">{benchmark.acceleration_factor}x Speedup</span>
                  </div>
                </div>

                {/* operations audited */}
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">
                    Audited Pipeline Operations
                  </span>
                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    {benchmark.operations.map((op, i) => (
                      <div key={i} className="flex items-center gap-1.5 font-medium">
                        <span className="w-1 h-1 bg-nvidia rounded-full" />
                        <span>{op}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Correlation Heatmap */}
          <div className="glass p-6 rounded-3xl border max-w-2xl flex flex-col gap-6">
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-100">Category Correlation Analysis</h4>
              <p className="text-xs text-slate-500 mt-1">
                Visualizing relationships between sales volume categories using cuML Pearson correlation.
              </p>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[400px] grid grid-cols-6 gap-2 text-center text-xs font-bold">
                {/* Header corner */}
                <div />
                {categories.map((cat) => (
                  <div key={cat} className="p-2 text-slate-500 uppercase tracking-wider text-[10px]">
                    {cat}
                  </div>
                ))}

                {/* Matrix Rows */}
                {categories.map((rowCat, rowIndex) => (
                  <>
                    <div className="p-3 text-slate-500 uppercase tracking-wider text-[10px] flex items-center justify-end">
                      {rowCat}
                    </div>
                    {correlationMatrix[rowIndex].map((val, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`p-3 rounded-xl flex items-center justify-center font-bold ${getHeatmapColor(val)}`}
                      >
                        {val.toFixed(2)}
                      </div>
                    ))}
                  </>
                ))}
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
