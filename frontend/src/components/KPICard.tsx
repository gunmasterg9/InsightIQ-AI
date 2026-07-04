"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendType?: "up" | "down" | "neutral" | "nvidia";
  colorClass?: string;
}

export default function KPICard({
  title,
  value,
  icon: Icon,
  trend,
  trendType = "neutral",
  colorClass = "text-primary"
}: KPICardProps) {
  
  const getTrendColor = () => {
    switch(trendType) {
      case "up":
        return "text-emerald-500 bg-emerald-500/10 border border-emerald-500/20";
      case "down":
        return "text-red-500 bg-red-500/10 border border-red-500/20";
      case "nvidia":
        return "text-nvidia bg-nvidia/10 border border-nvidia/20";
      default:
        return "text-slate-500 bg-slate-500/10 border border-slate-500/20";
    }
  };

  return (
    <div className="glass p-6 rounded-2xl border flex flex-col justify-between hover:scale-[1.02] hover:shadow-xl hover:shadow-slate-200/20 dark:hover:shadow-slate-900/40 transition-all duration-300">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      <div className="mt-4 flex items-baseline justify-between gap-2 flex-wrap">
        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
          {value}
        </span>
        {trend && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getTrendColor()}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
