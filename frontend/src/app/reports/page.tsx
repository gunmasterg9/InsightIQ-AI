"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { FileText, FileSpreadsheet, Download, RefreshCw, Clock, CheckCircle } from "lucide-react";

interface Report {
  id: string;
  name: string;
  type: "PDF" | "Excel" | "CSV";
  date: string;
  datasetId: number;
}

export default function ReportsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  const [reports] = useState<Report[]>([
    { id: "REP-01", name: "Executive Business Summary", type: "PDF", date: "Jul 04, 2026", datasetId: 0 },
    { id: "REP-02", name: "Transaction Audit Log (Cleaned)", type: "Excel", date: "Jul 04, 2026", datasetId: 0 },
    { id: "REP-03", name: "Raw Ingestion Dataset", type: "CSV", date: "Jul 04, 2026", datasetId: 0 }
  ]);

  useEffect(() => {
    const token = localStorage.getItem("insightiq-token");
    if (!token) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleDownload = async (report: Report) => {
    setDownloading(report.id);
    try {
      const token = localStorage.getItem("insightiq-token");
      let endpoint = "";
      
      if (report.type === "PDF") {
        endpoint = `https://insightiq-backend-1018473658663.us-central1.run.app/api/v1/reports/export/pdf?dataset_id=${report.datasetId}`;
      } else if (report.type === "Excel") {
        endpoint = `https://insightiq-backend-1018473658663.us-central1.run.app/api/v1/reports/export/excel?dataset_id=${report.datasetId}`;
      } else {
        endpoint = `https://insightiq-backend-1018473658663.us-central1.run.app/api/v1/reports/export/csv?dataset_id=${report.datasetId}`;
      }

      const res = await fetch(endpoint, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error("Download failed");
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = report.type === "PDF" 
        ? `${report.name.replace(/\s+/g, '_')}.pdf`
        : report.type === "Excel"
          ? `${report.name.replace(/\s+/g, '_')}.xlsx`
          : `${report.name.replace(/\s+/g, '_')}.csv`;
          
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert("Failed to export report. Verify backend configuration.");
    } finally {
      setDownloading(null);
    }
  };

  const getReportIcon = (type: string) => {
    if (type === "PDF") return <FileText className="w-8 h-8 text-red-500" />;
    return <FileSpreadsheet className="w-8 h-8 text-emerald-500" />;
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
        <Navbar title="Intelligence Report Center" />
        
        <main className="flex-1 p-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reports.map((rep) => (
              <div 
                key={rep.id} 
                className="glass p-6 rounded-3xl border flex flex-col justify-between h-56 hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border">
                    {getReportIcon(rep.type)}
                  </div>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-bold">
                    {rep.type}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                    {rep.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Generated: {rep.date}
                  </p>
                </div>

                <button
                  onClick={() => handleDownload(rep)}
                  disabled={downloading === rep.id}
                  className="w-full py-2.5 bg-primary hover:bg-blue-600 disabled:bg-slate-400 text-white rounded-xl text-xs font-bold transition duration-200 flex items-center justify-center gap-1.5 shadow"
                >
                  {downloading === rep.id ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Fetching File...
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" /> Download Report
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Automate Section */}
          <div className="glass p-8 rounded-3xl border max-w-xl flex flex-col gap-4">
            <h4 className="font-bold text-slate-800 dark:text-slate-100">Schedule Automatic Reports</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Configure InsightIQ AI to build and email executive reports weekly. Retrains forecast structures on BigQuery.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500">
              <CheckCircle className="w-4 h-4" /> Weekly Auto-Ingestion Active
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
