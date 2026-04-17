"use client";

import { useState } from "react";

interface RegionData {
  region: string;
  avgRisk: number;
  avgPremium: number;
  count: number;
}

interface RegionHeatmapProps {
  data: RegionData[];
}

function riskColor(risk: number): string {
  if (risk === 0) return "bg-slate-100 text-slate-400";
  if (risk <= 30) return "bg-emerald-100 text-emerald-800";
  if (risk <= 50) return "bg-lime-100 text-lime-800";
  if (risk <= 65) return "bg-amber-100 text-amber-800";
  if (risk <= 80) return "bg-orange-200 text-orange-900";
  return "bg-red-200 text-red-900";
}

const regionOrder = [
  ["Солтүстік Қазақстан облысы", "Ақмола облысы", "Павлодар облысы", "Шығыс Қазақстан облысы"],
  ["Қостанай облысы", "Астана қаласы", "Қарағанды облысы", "Алматы қаласы"],
  ["Батыс Қазақстан облысы", "Ақтөбе облысы", "Жамбыл облысы", "Алматы облысы"],
  ["Атырау облысы", "Маңғыстау облысы", "Қызылорда облысы", "Түркістан облысы"],
  ["Шымкент қаласы"],
];

export default function RegionHeatmap({ data }: RegionHeatmapProps) {
  const [hover, setHover] = useState<RegionData | null>(null);
  const map = new Map(data.map((d) => [d.region, d]));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">Аймақтар бойынша тәуекел</h3>
        <div className="flex items-center gap-1.5 text-[10px]">
          <span className="text-slate-400">Төмен</span>
          <span className="h-2 w-6 rounded bg-emerald-200" />
          <span className="h-2 w-6 rounded bg-lime-200" />
          <span className="h-2 w-6 rounded bg-amber-200" />
          <span className="h-2 w-6 rounded bg-orange-300" />
          <span className="h-2 w-6 rounded bg-red-300" />
          <span className="text-slate-400">Жоғары</span>
        </div>
      </div>
      <div className="space-y-2">
        {regionOrder.map((row, i) => (
          <div key={i} className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {row.map((name) => {
              const d = map.get(name);
              const risk = d?.avgRisk ?? 0;
              return (
                <button
                  key={name}
                  type="button"
                  onMouseEnter={() => d && setHover(d)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => d && setHover(d)}
                  onBlur={() => setHover(null)}
                  className={`relative rounded-xl px-3 py-3 text-left text-xs font-medium transition-all hover:-translate-y-0.5 hover:shadow-md ${riskColor(risk)}`}
                >
                  <div className="truncate">{name.replace(" облысы", " обл.").replace(" қаласы", "")}</div>
                  <div className="mt-1 font-mono text-sm font-bold tabular-nums">
                    {risk || "—"}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
      {hover && (
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-soft animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">{hover.region}</div>
            <div className="text-xs text-slate-500">{hover.count} есептеу</div>
          </div>
          <div className="mt-1 flex items-center gap-4 text-xs">
            <div>
              <span className="text-slate-500">Орташа тәуекел:</span>{" "}
              <span className="font-mono font-semibold text-slate-900">{hover.avgRisk}</span>
            </div>
            <div>
              <span className="text-slate-500">Орташа сыйлықақы:</span>{" "}
              <span className="font-mono font-semibold text-slate-900">
                {hover.avgPremium.toLocaleString("ru-RU")} ₸
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
