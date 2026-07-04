"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import KPICard from "@/components/KPICard";
import {
  DollarSign,
  TrendingUp,
  Percent,
  Activity,
  Cpu,
  ShoppingBag,
  MapPin,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from "recharts";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Visual chart datasets
  const revenueTrend = [
    { month: "Jan", revenue: 45000, profit: 12000 },
    { month: "Feb", revenue: 52000, profit: 15000 },
    { month: "Mar", revenue: 49000, profit: 13000 },
    { month: "Apr", revenue: 63000, profit: 21000 },
    { month: "May", revenue: 58000, profit: 19000 },
    { month: "Jun", revenue: 71000, profit: 25000 },
  ];

  const categoryDistribution = [
    { name: "Electronics", value: 35, fill: "#2563eb" },
    { name: "Software", value: 25, fill: "#76B900" },
    { name: "Hardware", value: 20, fill: "#3b82f6" },
    { name: "Cloud Services", value: 12, fill: "#10b981" },
    { name: "Consulting", value: 8, fill: "#f59e0b" },
  ];

  const topProducts = [
    { name: "Enterprise SaaS", sales: 2400 },
    { name: "NVIDIA DGX Cloud", sales: 1850 },
    { name: "GCP BigQuery Hub", sales: 1420 },
    { name: "CUDA Compute Pack", sales: 980 },
    { name: "DevOps Consulting", sales: 560 },
  ];

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
        <Navbar title="Executive Decision Board" />
        
        <main className="flex-1 p-8 space-y-8 overflow-y-auto">
          {/* Header Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-nvidia/5 to-transparent border flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                Operational Intelligence Hub <Cpu className="w-5 h-5 text-nvidia" />
              </h2>
              <p className="text-xs text-slate-500">
                Data pipeline sync complete. BigQuery and GPU analytics engines are online.
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold rounded-full">
              <CheckCircle className="w-3.5 h-3.5" /> All Services Operational
            </div>
          </div>

          {/* KPI Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <KPICard
              title="Total Revenue"
              value="$126.8M"
              icon={DollarSign}
              trend="+18.4%"
              trendType="up"
              colorClass="text-blue-500"
            />
            <KPICard
              title="Net Profit"
              value="$22.4M"
              icon={TrendingUp}
              trend="+14.2%"
              trendType="up"
              colorClass="text-nvidia"
            />
            <KPICard
              title="Risk Score"
              value="28 / 100"
              icon={Activity}
              trend="Low Risk"
              trendType="neutral"
              colorClass="text-emerald-500"
            />
            <KPICard
              title="Growth Rate"
              value="12.6%"
              icon={Percent}
              trend="+4.3%"
              trendType="up"
              colorClass="text-amber-500"
            />
            <KPICard
              title="RAPIDS Speedup"
              value="11.4x"
              icon={Cpu}
              trend="NVIDIA cuDF"
              trendType="nvidia"
              colorClass="text-nvidia"
            />
          </div>

          {/* Main Visuals Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Revenue Area Chart */}
            <div className="glass p-6 rounded-2xl border lg:col-span-2 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-800 dark:text-slate-100">Revenue & Profit Growth</h3>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded-md font-semibold">
                  Last 6 Months
                </span>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueTrend} margin={{ left: -20, top: 10 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#76B900" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#76B900" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.05} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "rgba(17,24,39,0.9)", borderColor: "#1f2937", borderRadius: "8px" }}
                      itemStyle={{ color: "#fff" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#2563eb" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} name="Revenue" />
                    <Area type="monotone" dataKey="profit" stroke="#76B900" fillOpacity={1} fill="url(#colorProf)" strokeWidth={2} name="Profit" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Pie Chart */}
            <div className="glass p-6 rounded-2xl border flex flex-col gap-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Category Share</h3>
              <div className="h-56 w-full flex justify-center items-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip 
                      contentStyle={{ backgroundColor: "rgba(17,24,39,0.9)", borderColor: "#1f2937", borderRadius: "8px" }}
                      itemStyle={{ color: "#fff" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Donut Center text */}
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-slate-800 dark:text-slate-100">5</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Sectors</span>
                </div>
              </div>
              
              {/* Legend Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-500">
                {categoryDistribution.map((cat, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.fill }} />
                    <span className="truncate">{cat.name} ({cat.value}%)</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Lower Grid: Products and Alert preview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Top Products Bar Chart */}
            <div className="glass p-6 rounded-2xl border lg:col-span-2 flex flex-col gap-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Top Performing Products</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProducts} layout="vertical" margin={{ left: 30, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.05} />
                    <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "rgba(17,24,39,0.9)", borderColor: "#1f2937", borderRadius: "8px" }}
                      itemStyle={{ color: "#fff" }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <Bar dataKey="sales" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                      {topProducts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#2563eb" : "#76B900"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Ingestion Alerts Log Preview */}
            <div className="glass p-6 rounded-2xl border flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100">Risk Alerts</h3>
                  <span className="text-[10px] text-red-500 font-bold bg-red-500/10 px-2 py-0.5 rounded-full">
                    3 Active
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-red-500/5 dark:bg-red-500/10 border border-red-500/15 flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-bold dark:text-slate-200">High Risk Customer Flagged</p>
                      <p className="text-slate-500 mt-0.5">CUST1024 risk rating surpassed 85/100 threshold.</p>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/15 flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-bold dark:text-slate-200">Anomaly Detected in Software sales</p>
                      <p className="text-slate-500 mt-0.5">Transaction amount exceeded 3 standard dev.</p>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/15 flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-bold dark:text-slate-200">Inventory Supply Drop</p>
                      <p className="text-slate-500 mt-0.5">DGX Cloud instances allocated near cap limits.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => router.push("/alerts")}
                className="w-full py-2.5 text-center text-xs font-bold text-primary hover:text-blue-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-800/80 rounded-xl transition-all duration-200"
              >
                View Full Alert Logs
              </button>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
