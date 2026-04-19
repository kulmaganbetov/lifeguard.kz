"use client";

import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BarChart3,
  Calendar,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import KpiCard from "@/components/dashboard/KpiCard";
import RegionHeatmap from "@/components/dashboard/RegionHeatmap";
import RiskBadge from "@/components/ui/RiskBadge";
import Skeleton from "@/components/ui/Skeleton";

interface DashboardData {
  totalCalculations: number;
  highRiskPercent: number;
  lowRiskPercent: number;
  avgAnnualPremium: number;
  todayCount: number;
  weekTrend: number;
  dailyData: { date: string; count: number; avgPremium: number }[];
  riskDistribution: { level: string; count: number; color: string }[];
  ageDistribution: { range: string; avgPremium: number; count: number }[];
  topRiskFactors: { factor: string; count: number; avgImpact: number }[];
  regionData: { region: string; avgRisk: number; avgPremium: number; count: number }[];
  recentCalculations: {
    id: string;
    createdAt: string;
    age: number;
    gender: "male" | "female";
    region: string;
    bmi: number;
    riskScore: number;
    riskLevel: string;
    annualPremium: number;
  }[];
}

type SortKey = "createdAt" | "age" | "riskScore" | "annualPremium" | "bmi";

const PAGE = 10;

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d: DashboardData) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-4 w-96 mb-8" />
        <div className="grid gap-4 md:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" rounded="" />
          ))}
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-2xl" rounded="" />
          <Skeleton className="h-80 rounded-2xl" rounded="" />
        </div>
      </div>
    );
  }

  const toggleSort = (k: SortKey) => {
    if (k === sortKey) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortKey(k);
      setSortDir("desc");
    }
    setPage(1);
  };

  const sorted = [...data.recentCalculations].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
    return sortDir === "asc" ? cmp : -cmp;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE));
  const pageRows = sorted.slice((page - 1) * PAGE, page * PAGE);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-14 md:px-6">
      <div className="mb-8">
        <h1 className="section-heading">Талдау панелі</h1>
        <p className="mt-2 text-slate-600">
          Платформа бойынша статистика және тәуекел үрдістері.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard
          label="Барлық есептеулер"
          value={data.totalCalculations}
          icon={<BarChart3 className="h-5 w-5" />}
          tint="blue"
          trend={data.weekTrend}
        />
        <KpiCard
          label="Жоғары тәуекел"
          value={data.highRiskPercent}
          suffix="%"
          icon={<AlertTriangle className="h-5 w-5" />}
          tint="amber"
        />
        <KpiCard
          label="Орташа жылдық сыйлықақы"
          value={data.avgAnnualPremium}
          suffix=" ₸"
          icon={<Wallet className="h-5 w-5" />}
          tint="cyan"
        />
        <KpiCard
          label="Бүгінгі есептеулер"
          value={data.todayCount}
          icon={<Calendar className="h-5 w-5" />}
          tint="violet"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Күндік көлем</h3>
              <p className="text-xs text-slate-500">Соңғы 30 күн</p>
            </div>
            <div className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
              <TrendingUp className="h-3 w-3" />
              +{Math.max(0, data.weekTrend)}%
            </div>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.dailyData} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
                <defs>
                  <linearGradient id="volArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#94A3B8", fontSize: 11 }}
                  tickFormatter={(v: string) => v.slice(5)}
                  axisLine={{ stroke: "#E2E8F0" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#94A3B8", fontSize: 11 }}
                  axisLine={{ stroke: "#E2E8F0" }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #E2E8F0",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#2563EB"
                  fill="url(#volArea)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-base font-semibold text-slate-900">Тәуекел таралуы</h3>
          <p className="text-xs text-slate-500">Деңгейлер бойынша үлес</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.riskDistribution}
                  dataKey="count"
                  nameKey="level"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {data.riskDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #E2E8F0",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{ fontSize: 12, color: "#64748B" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="glass-card p-5">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-slate-400" />
            <h3 className="text-base font-semibold text-slate-900">Жас тобы бойынша орташа сыйлықақы</h3>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.ageDistribution} margin={{ top: 5, right: 5, bottom: 0, left: 10 }}>
                <XAxis
                  dataKey="range"
                  tick={{ fill: "#94A3B8", fontSize: 11 }}
                  axisLine={{ stroke: "#E2E8F0" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#94A3B8", fontSize: 11 }}
                  axisLine={{ stroke: "#E2E8F0" }}
                  tickLine={false}
                  tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #E2E8F0",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => `${v.toLocaleString("ru-RU")} ₸`}
                />
                <Bar dataKey="avgPremium" fill="#06B6D4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-slate-400" />
            <h3 className="text-base font-semibold text-slate-900">Негізгі тәуекел факторлары</h3>
          </div>
          <div className="mt-4 space-y-2.5">
            {data.topRiskFactors.map((f, i) => {
              const max = Math.max(...data.topRiskFactors.map((x) => x.count));
              const pct = (f.count / max) * 100;
              return (
                <div key={f.factor} className="flex items-center gap-3">
                  <div className="w-40 shrink-0 text-xs text-slate-600 truncate">
                    {i + 1}. {f.factor}
                  </div>
                  <div className="relative flex-1 h-6 rounded-lg bg-slate-100 overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-between px-2 text-[10px] font-mono">
                      <span className="text-white font-semibold mix-blend-difference">{f.count}</span>
                      <span className="text-slate-500">+{f.avgImpact}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 glass-card p-5">
        <RegionHeatmap data={data.regionData} />
      </div>

      <div className="mt-6 glass-card p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900">Соңғы есептеулер</h3>
          <div className="text-xs text-slate-500">
            Барлығы {sorted.length} жазба
          </div>
        </div>
        <div className="mt-4 -mx-5 overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-slate-400 border-b border-slate-100">
              <tr>
                <SortHeader label="Күні" k="createdAt" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                <SortHeader label="Жасы" k="age" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                <th className="px-5 py-3 font-medium">Жынысы</th>
                <th className="px-5 py-3 font-medium">Аймақ</th>
                <SortHeader label="ИМТ" k="bmi" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                <SortHeader label="Тәуекел" k="riskScore" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                <SortHeader label="Жылдық сыйлықақы" k="annualPremium" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} align="right" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pageRows.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3 text-xs text-slate-500 font-mono">
                    {new Date(r.createdAt).toLocaleDateString("ru-RU")}
                  </td>
                  <td className="px-5 py-3 font-mono text-slate-700">{r.age}</td>
                  <td className="px-5 py-3 text-slate-600">
                    {r.gender === "male" ? "Ер" : "Әйел"}
                  </td>
                  <td className="px-5 py-3 text-slate-600 text-xs truncate max-w-[180px]">
                    {r.region}
                  </td>
                  <td className="px-5 py-3 font-mono text-slate-700">{r.bmi}</td>
                  <td className="px-5 py-3">
                    <RiskBadge level={r.riskLevel} size="sm" />
                  </td>
                  <td className="px-5 py-3 text-right font-mono font-semibold text-slate-900">
                    {r.annualPremium.toLocaleString("ru-RU")} ₸
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Бет {page} / {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-secondary px-3 py-1.5 text-xs"
            >
              Артқа
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn-secondary px-3 py-1.5 text-xs"
            >
              Келесі
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SortHeader({
  label,
  k,
  sortKey,
  sortDir,
  onSort,
  align = "left",
}: {
  label: string;
  k: SortKey;
  sortKey: SortKey;
  sortDir: "asc" | "desc";
  onSort: (k: SortKey) => void;
  align?: "left" | "right";
}) {
  const active = sortKey === k;
  return (
    <th className={`px-5 py-3 font-medium ${align === "right" ? "text-right" : ""}`}>
      <button
        type="button"
        onClick={() => onSort(k)}
        className={`inline-flex items-center gap-1 transition-colors ${
          active ? "text-blue-600" : "hover:text-slate-700"
        }`}
      >
        {label}
        {active &&
          (sortDir === "asc" ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          ))}
      </button>
    </th>
  );
}
