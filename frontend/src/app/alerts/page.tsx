"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { AlertTriangle, ShieldAlert, Cpu, Bell, Check, Search, Filter } from "lucide-react";

interface Alert {
  id: string;
  type: "High Risk" | "Anomaly" | "System" | "Inventory";
  title: string;
  message: string;
  time: string;
  status: "Active" | "Resolved";
  dataset: string;
}

export default function AlertsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "ALT-101",
      type: "High Risk",
      title: "High Risk Customer Detected",
      message: "Customer CUST1024 risk rating surpassed 85/100 threshold on transaction TXN100234.",
      time: "2 mins ago",
      status: "Active",
      dataset: "business_transactions.csv"
    },
    {
      id: "ALT-102",
      type: "Anomaly",
      title: "Statistical Anomaly in Software Category",
      message: "Transaction amount ($235,000) exceeded 3 standard deviations from average software sales.",
      time: "15 mins ago",
      status: "Active",
      dataset: "business_transactions.csv"
    },
    {
      id: "ALT-103",
      type: "Inventory",
      title: "NVIDIA DGX GPU Allocation Close to Capacity",
      message: "Hardware compute instances allocated near 94% threshold. Automated scaling suggested.",
      time: "1 hour ago",
      status: "Active",
      dataset: "DGX Cloud Log"
    },
    {
      id: "ALT-104",
      type: "System",
      title: "K-Means Retraining Trigger Completed",
      message: "Customer segmentation models rebuilt successfully using BigQuery. Silhouette score: 0.74.",
      time: "3 hours ago",
      status: "Resolved",
      dataset: "BigQuery Customer Catalog"
    },
    {
      id: "ALT-105",
      type: "System",
      title: "GCS Sync Pipeline Connected",
      message: "Successfully verified connection to bucket 'insightiq-ai-datasets'.",
      time: "1 day ago",
      status: "Resolved",
      dataset: "Cloud Storage Setup"
    }
  ]);

  useEffect(() => {
    const token = localStorage.getItem("insightiq-token");
    if (!token) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  const resolveAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Resolved" } : a))
    );
  };

  const getAlertBadge = (type: string) => {
    switch (type) {
      case "High Risk":
        return "bg-red-500/10 text-red-500 border border-red-500/20";
      case "Anomaly":
        return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      case "Inventory":
        return "bg-nvidia/10 text-nvidia border border-nvidia/20";
      default:
        return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "High Risk":
        return <ShieldAlert className="w-5 h-5 text-red-500" />;
      case "Anomaly":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "Inventory":
        return <Cpu className="w-5 h-5 text-nvidia" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(search.toLowerCase()) ||
      alert.message.toLowerCase().includes(search.toLowerCase()) ||
      alert.id.toLowerCase().includes(search.toLowerCase());
      
    const matchesFilter = filterType === "All" || alert.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

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
        <Navbar title="Decision Alerts & Notifications" />
        
        <main className="flex-1 p-8 space-y-8">
          
          {/* Filter Bar */}
          <div className="glass p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search alerts by name, content or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary dark:text-slate-200"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-slate-50 dark:bg-slate-900 border rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none dark:text-slate-200"
              >
                <option value="All">All Types</option>
                <option value="High Risk">High Risk</option>
                <option value="Anomaly">Anomaly</option>
                <option value="Inventory">Inventory</option>
                <option value="System">System</option>
              </select>
            </div>
          </div>

          {/* Alerts List */}
          <div className="glass p-6 rounded-3xl border shadow-xl flex flex-col gap-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">System Logs</h3>

            <div className="space-y-4">
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Check className="w-12 h-12 mx-auto mb-3 opacity-20 text-emerald-500" />
                  <p className="font-bold text-sm">No Alerts Match Your Filters</p>
                  <p className="text-xs text-slate-500 mt-1">All clean! No anomalies detected.</p>
                </div>
              ) : (
                filteredAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      alert.status === "Active"
                        ? "bg-slate-50/50 dark:bg-slate-900/10 hover:border-slate-300 dark:hover:border-slate-700"
                        : "bg-slate-100/20 dark:bg-slate-950/10 opacity-70"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${getAlertBadge(alert.type)} shrink-0`}>
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                            {alert.title}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${getAlertBadge(alert.type)}`}>
                            {alert.type}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {alert.id}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                          {alert.message}
                        </p>
                        <div className="text-[10px] text-slate-400 flex items-center gap-3">
                          <span>Target: <code className="font-semibold">{alert.dataset}</code></span>
                          <span>•</span>
                          <span>Timestamp: {alert.time}</span>
                        </div>
                      </div>
                    </div>

                    {alert.status === "Active" ? (
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition duration-200 shadow shrink-0 self-end sm:self-auto"
                      >
                        Resolve
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 rounded-xl text-xs font-bold inline-flex items-center gap-1 border shrink-0">
                        <Check className="w-3.5 h-3.5" /> Resolved
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
