"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";

interface BenchmarkChartProps {
  cpuTime: number;
  gpuTime: number;
  acceleration: number;
}

export default function BenchmarkChart({ cpuTime, gpuTime, acceleration }: BenchmarkChartProps) {
  const data = [
    {
      name: "CPU (Pandas)",
      time: cpuTime,
      fill: "#3b82f6" // Blue
    },
    {
      name: "GPU (cuDF RAPIDS)",
      time: gpuTime,
      fill: "#76B900" // NVIDIA Green
    }
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 items-center w-full">
      {/* Chart Wrapper */}
      <div className="w-full md:w-2/3 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} unit="ms" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(17, 24, 39, 0.95)",
                borderColor: "#374151",
                borderRadius: "12px",
                color: "#f8fafc"
              }}
              formatter={(value) => [`${Number(value).toFixed(2)} ms`, "Execution Time"]}
            />
            <Bar dataKey="time" radius={[8, 8, 0, 0]} barSize={50}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Speedup Callout */}
      <div className="w-full md:w-1/3 flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-nvidia/5 to-nvidia/10 border border-nvidia/20 text-center">
        <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          NVIDIA Acceleration
        </span>
        <span className="text-5xl font-extrabold text-nvidia mt-3 tracking-tight">
          {acceleration.toFixed(1)}x
        </span>
        <span className="text-xs font-semibold text-slate-400 mt-2">
          Faster decision processing than standard CPU
        </span>
        
        <div className="w-full h-px bg-nvidia/20 my-4" />
        
        <div className="flex justify-between w-full text-xs">
          <div className="flex flex-col items-start">
            <span className="text-slate-400">CPU Duration</span>
            <span className="font-bold text-blue-500">{cpuTime.toFixed(2)} ms</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-slate-400">GPU Duration</span>
            <span className="font-bold text-nvidia">{gpuTime.toFixed(2)} ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}
