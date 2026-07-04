"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Upload,
  Database,
  Cpu,
  TrendingUp,
  Brain,
  Bell,
  FileSpreadsheet,
  Settings,
  User,
  ShieldAlert,
  LogOut
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState("Alex Mercer");
  const [userRole, setUserRole] = useState("Business Analyst");

  useEffect(() => {
    const userStr = localStorage.getItem("insightiq-user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.full_name || "Alex Mercer");
        setUserRole(user.role || "Business Analyst");
      } catch (e) {
        // use default
      }
    }
  }, []);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Upload Dataset", href: "/upload", icon: Upload },
    { name: "Datasets List", href: "/datasets", icon: Database },
    { name: "GPU Analytics", href: "/analytics", icon: Cpu },
    { name: "ML Forecasting", href: "/forecast", icon: TrendingUp },
    { name: "AI Insights", href: "/ai-insights", icon: Brain },
    { name: "Alerts Log", href: "/alerts", icon: Bell },
    { name: "Reports Export", href: "/reports", icon: FileSpreadsheet },
    { name: "Profile Settings", href: "/profile", icon: User },
    { name: "System Settings", href: "/settings", icon: Settings },
    { name: "Admin Control", href: "/admin", icon: ShieldAlert },
  ];

  const handleSignOut = () => {
    localStorage.removeItem("insightiq-token");
    localStorage.removeItem("insightiq-user");
    router.push("/login");
  };

  return (
    <aside className="w-64 glass border-r h-screen fixed top-0 left-0 flex flex-col justify-between z-30 transition-all duration-300">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-nvidia flex items-center justify-center text-white font-extrabold text-lg">
              I
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-nvidia">
              InsightIQ AI
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase ml-1">
            Decision Intelligence
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/25 dark:shadow-primary/10"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Footer profile section */}
      <div className="p-4 border-t flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-sm text-primary dark:text-primary-foreground border border-primary/20 shrink-0">
            {userName.split(" ").map(n => n[0]).join("")}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-semibold text-xs truncate dark:text-slate-200">{userName}</span>
            <span className="text-[10px] text-slate-500 truncate">{userRole}</span>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-all duration-200"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
