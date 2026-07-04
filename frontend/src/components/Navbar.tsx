"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Bell, Search, ShieldAlert, Cpu } from "lucide-react";
import { useEffect, useState } from "react";

interface NavbarProps {
  title: string;
}

export default function Navbar({ title }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [alertsCount, setAlertsCount] = useState(3);

  return (
    <header className="h-16 glass border-b px-8 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
      {/* Page Title */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          {title}
        </h1>
        {/* Sub-badge indicating GCP and GPU connection */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <Cpu className="w-3 h-3" /> CUDA GPU Active
        </div>
      </div>

      {/* Utilities */}
      <div className="flex items-center gap-6">
        {/* Partner Badges */}
        <div className="hidden md:flex items-center gap-3 border-r pr-6">
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Google Cloud</span>
            <div className="flex gap-0.5">
              <span className="w-1.5 h-3 bg-google-blue rounded-full"></span>
              <span className="w-1.5 h-3 bg-google-red rounded-full"></span>
              <span className="w-1.5 h-3 bg-google-yellow rounded-full"></span>
              <span className="w-1.5 h-3 bg-google-green rounded-full"></span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">NVIDIA RAPIDS</span>
            <span className="px-1.5 py-0.2 bg-nvidia/20 text-nvidia text-[9px] font-extrabold rounded border border-nvidia/30">
              cuDF
            </span>
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
          title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* Notification Bell */}
        <button className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 relative">
          <Bell className="w-4 h-4" />
          {alertsCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          )}
        </button>
      </div>
    </header>
  );
}
