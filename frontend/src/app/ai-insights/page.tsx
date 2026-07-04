"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import AICopilot from "@/components/AICopilot";
import { Sparkles, Brain, CheckCircle, Lightbulb, FileText } from "lucide-react";

export default function AIInsightsPage() {
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
        <Navbar title="Gemini Enterprise Copilot" />
        
        <main className="flex-1 p-8 space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Main Chat Panel */}
            <div className="lg:col-span-3">
              <AICopilot />
            </div>

            {/* Inference sidebar */}
            <div className="glass p-6 rounded-3xl border flex flex-col justify-between h-[600px]">
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b pb-4">
                  <Sparkles className="w-5 h-5 text-nvidia" />
                  <h3 className="font-bold text-slate-800 dark:text-slate-100">AI Inferences</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-2.5">
                    <Lightbulb className="w-4.5 h-4.5 text-yellow-500 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-bold dark:text-slate-200">Seasonality Drivers</p>
                      <p className="text-slate-500 mt-0.5 leading-normal">
                        Electronics sales show a recurrent 18% lift in the second week of each month.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Lightbulb className="w-4.5 h-4.5 text-yellow-500 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-bold dark:text-slate-200">Payment Processor Risk</p>
                      <p className="text-slate-500 mt-0.5 leading-normal">
                        ACH transfers show a 94.2% lower fraud correlation than Credit Card transactions.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Lightbulb className="w-4.5 h-4.5 text-yellow-500 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-bold dark:text-slate-200">Anomalous Outlier Peak</p>
                      <p className="text-slate-500 mt-0.5 leading-normal">
                        23 transactions on Nov 15 exceeded standard parameters. Check CRM contract updates.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t space-y-3">
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> Catalog Synced
                </div>
                <button
                  onClick={() => router.push("/reports")}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-800/80 rounded-xl text-xs font-bold text-primary transition-all duration-200 flex items-center justify-center gap-1.5 border border-primary/10"
                >
                  <FileText className="w-4 h-4" /> Download Executive Report
                </button>
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
