"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { type ReactNode } from "react";
import CountUp from "@/components/ui/CountUp";

interface KpiCardProps {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  trend?: number;
  icon: ReactNode;
  tint?: "emerald" | "sky" | "violet" | "amber";
}

const tints: Record<string, string> = {
  emerald: "bg-emerald-50 text-emerald-600",
  sky: "bg-sky-50 text-sky-600",
  violet: "bg-violet-50 text-violet-600",
  amber: "bg-amber-50 text-amber-600",
};

export default function KpiCard({
  label,
  value,
  suffix,
  prefix,
  trend,
  icon,
  tint = "emerald",
}: KpiCardProps) {
  const positive = (trend ?? 0) >= 0;
  return (
    <div className="glass-card p-5 animate-slide-up">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-sm font-medium text-slate-500">{label}</div>
          <div className="mt-2 font-mono text-2xl font-bold text-slate-900 tabular-nums">
            <CountUp end={value} prefix={prefix} suffix={suffix} separator />
          </div>
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tints[tint]}`}>
          {icon}
        </div>
      </div>
      {typeof trend === "number" && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span
            className={`inline-flex items-center gap-0.5 font-medium ${
              positive ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {Math.abs(trend)}%
          </span>
          <span className="text-slate-400">өткен аптамен салыстырғанда</span>
        </div>
      )}
    </div>
  );
}
