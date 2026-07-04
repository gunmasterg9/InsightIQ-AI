"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { User, Activity, Clock, ShieldCheck, Mail } from "lucide-react";

interface ActivityLog {
  action: string;
  timestamp: string;
  details: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("Alex Mercer");
  const [email, setEmail] = useState("analyst@insightiq.ai");
  const [role, setRole] = useState("Business Analyst");
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("insightiq-token");
    if (!token) {
      router.push("/login");
      return;
    }
    
    const userStr = localStorage.getItem("insightiq-user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        setName(u.full_name || "Alex Mercer");
        setEmail(u.email || "analyst@insightiq.ai");
        setRole(u.role || "Business Analyst");
      } catch (e) {}
    }

    // Set mock activity history
    setActivities([
      { action: "Generate Insights", timestamp: "10 mins ago", details: "Asked AI Copilot for sales projections." },
      { action: "Clean Data", timestamp: "30 mins ago", details: "Auto-cleaned dataset 'business_transactions.csv'. Quality score: 92%." },
      { action: "Upload Dataset", timestamp: "45 mins ago", details: "Ingested 'business_transactions.csv' into BigQuery." },
      { action: "Login Session", timestamp: "1 hour ago", details: "User session authenticated using OAuth JWT." },
    ]);
    
    setLoading(false);
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
        <Navbar title="My Profile & Security" />
        
        <main className="flex-1 p-8 max-w-4xl space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Info */}
            <div className="glass p-6 rounded-3xl border shadow-xl flex flex-col items-center text-center gap-4">
              <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-2xl text-primary border border-primary/20">
                {name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 dark:text-slate-200">{name}</h4>
                <p className="text-xs text-slate-500">{role}</p>
              </div>
              
              <div className="w-full border-t my-2" />
              
              <div className="w-full space-y-3 text-left text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Access Level: {role === "Admin" ? "Full Root" : "Write Analyst"}</span>
                </div>
              </div>
            </div>

            {/* Audit Logs */}
            <div className="glass p-6 rounded-3xl border shadow-xl md:col-span-2 flex flex-col gap-4">
              <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" /> Session Activity Audit Log
              </h4>

              <div className="space-y-4">
                {activities.map((act, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-700 dark:text-slate-300">
                        {act.action}
                      </p>
                      <p className="text-slate-500 leading-normal">{act.details}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{act.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
