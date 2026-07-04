"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, ShieldAlert, Cpu } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("analyst@insightiq.ai");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Clear old auth
    localStorage.removeItem("insightiq-token");
    localStorage.removeItem("insightiq-user");
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("https://insightiq-backend-1018473658663.us-central1.run.app/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Authentication failed");
      }

      const data = await response.json();
      localStorage.setItem("insightiq-token", data.access_token);
      localStorage.setItem("insightiq-user", JSON.stringify(data.user));
      
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="glass w-full max-w-md p-8 rounded-3xl border shadow-2xl relative overflow-hidden flex flex-col gap-6">
        
        {/* Decorative ambient spots */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-nvidia/10 rounded-full blur-2xl"></div>

        {/* Brand Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-nvidia flex items-center justify-center text-white font-extrabold text-2xl shadow-lg">
            I
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-nvidia">
            InsightIQ AI
          </h2>
          <p className="text-xs text-slate-500 max-w-[280px]">
            From Raw Data to Better Decisions in Seconds.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@insightiq.ai"
                className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 dark:bg-slate-900 border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:bg-slate-400"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
            ) : (
              <>
                Sign In <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Info */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-dashed flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-nvidia font-bold text-xs">
            <Cpu className="w-3.5 h-3.5" /> Demo Ingestion Credentials
          </div>
          <div className="text-[11px] text-slate-500">
            Email: <code className="font-semibold text-slate-800 dark:text-slate-300">analyst@insightiq.ai</code><br/>
            Password: <code className="font-semibold text-slate-800 dark:text-slate-300">password123</code>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary hover:underline font-bold">
            Create Account
          </Link>
        </div>

      </div>
    </div>
  );
}
