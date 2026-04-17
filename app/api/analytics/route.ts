import { NextResponse } from "next/server";
import { getCalculations, type Calculation } from "@/lib/store";
import { KZ_REGIONS } from "@/lib/constants";

export const runtime = "nodejs";

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function buildMockData(): Calculation[] {
  const rand = seededRandom(42);
  const now = Date.now();
  const regions = [...KZ_REGIONS];
  const levels = ["Төмен", "Орташа", "Жоғары", "Өте жоғары"];
  const mock: Calculation[] = [];
  for (let i = 0; i < 120; i++) {
    const daysAgo = Math.floor(rand() * 30);
    const age = 22 + Math.floor(rand() * 45);
    const gender = rand() > 0.5 ? "male" : "female";
    const riskScore = Math.min(99, Math.max(5, Math.round(rand() * 90 + age * 0.4)));
    const level =
      riskScore <= 30
        ? levels[0]
        : riskScore <= 55
        ? levels[1]
        : riskScore <= 75
        ? levels[2]
        : levels[3];
    const coverage = [10, 20, 30, 50, 100][Math.floor(rand() * 5)] * 1_000_000;
    const annualPremium = Math.round((coverage * (riskScore / 100) * 0.04) / 10) * 10;
    const bmi = Number((18 + rand() * 18).toFixed(1));
    mock.push({
      id: `mock_${i}`,
      createdAt: new Date(now - daysAgo * 86400_000 - rand() * 86400_000).toISOString(),
      age,
      gender,
      region: regions[Math.floor(rand() * regions.length)],
      smoker: rand() < 0.25,
      bmi,
      chronicDiseases:
        rand() < 0.3
          ? ([["diabetes"], ["hypertension"], ["asthma"]][Math.floor(rand() * 3)] as string[])
          : [],
      generalHealth: ["excellent", "good", "fair", "poor"][Math.floor(rand() * 4)] as string,
      activityLevel: ["sedentary", "moderate", "active", "athlete"][
        Math.floor(rand() * 4)
      ] as string,
      jobCategory: ["office", "field", "hazardous"][Math.floor(rand() * 3)] as string,
      alcoholUse: ["never", "occasional", "regular"][Math.floor(rand() * 3)] as string,
      riskScore,
      riskLevel: level,
      annualPremium,
      monthlyPremium: Math.round(annualPremium / 12),
      netPremium: Math.round(annualPremium * 0.7),
      adjustedQx: Number((riskScore / 100).toFixed(4)),
      annuityFactor: Number((8 + rand() * 4).toFixed(3)),
      coverageAmount: coverage,
      termYears: [10, 15, 20, 25, 30][Math.floor(rand() * 5)] as number,
      topFactors: [],
    });
  }
  return mock;
}

function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function GET() {
  const real = getCalculations();
  const merged = real.length >= 5 ? real : [...buildMockData(), ...real];

  const now = new Date();
  const today = fmtDate(now);
  const totalCalculations = merged.length;

  const highRiskCount = merged.filter((c) => c.riskLevel === "Жоғары" || c.riskLevel === "Өте жоғары").length;
  const lowRiskCount = merged.filter((c) => c.riskLevel === "Төмен").length;

  const highRiskPercent = totalCalculations ? Math.round((highRiskCount / totalCalculations) * 100) : 0;
  const lowRiskPercent = totalCalculations ? Math.round((lowRiskCount / totalCalculations) * 100) : 0;

  const avgAnnualPremium = totalCalculations
    ? Math.round(merged.reduce((a, c) => a + c.annualPremium, 0) / totalCalculations)
    : 0;

  const todayCount = merged.filter((c) => c.createdAt.startsWith(today)).length;

  const weekAgo = new Date(now.getTime() - 7 * 86400_000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 86400_000);
  const thisWeek = merged.filter((c) => new Date(c.createdAt) >= weekAgo).length;
  const lastWeek = merged.filter((c) => {
    const d = new Date(c.createdAt);
    return d >= twoWeeksAgo && d < weekAgo;
  }).length;
  const weekTrend = lastWeek ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : 0;

  const dailyMap = new Map<string, { count: number; sum: number }>();
  for (let i = 29; i >= 0; i--) {
    const d = fmtDate(new Date(now.getTime() - i * 86400_000));
    dailyMap.set(d, { count: 0, sum: 0 });
  }
  for (const c of merged) {
    const d = c.createdAt.slice(0, 10);
    if (dailyMap.has(d)) {
      const e = dailyMap.get(d)!;
      e.count += 1;
      e.sum += c.annualPremium;
    }
  }
  const dailyData = Array.from(dailyMap.entries()).map(([date, v]) => ({
    date,
    count: v.count,
    avgPremium: v.count ? Math.round(v.sum / v.count) : 0,
  }));

  const riskDistribution = [
    { level: "Төмен", count: merged.filter((c) => c.riskLevel === "Төмен").length, color: "#059669" },
    { level: "Орташа", count: merged.filter((c) => c.riskLevel === "Орташа").length, color: "#F59E0B" },
    { level: "Жоғары", count: merged.filter((c) => c.riskLevel === "Жоғары").length, color: "#EA580C" },
    { level: "Өте жоғары", count: merged.filter((c) => c.riskLevel === "Өте жоғары").length, color: "#DC2626" },
  ];

  const ageBuckets = [
    { range: "18–29", min: 18, max: 29 },
    { range: "30–39", min: 30, max: 39 },
    { range: "40–49", min: 40, max: 49 },
    { range: "50–59", min: 50, max: 59 },
    { range: "60–69", min: 60, max: 69 },
    { range: "70+", min: 70, max: 200 },
  ];
  const ageDistribution = ageBuckets.map((b) => {
    const group = merged.filter((c) => c.age >= b.min && c.age <= b.max);
    const avgPremium = group.length
      ? Math.round(group.reduce((s, c) => s + c.annualPremium, 0) / group.length)
      : 0;
    return { range: b.range, avgPremium, count: group.length };
  });

  const factorCounts = new Map<string, { count: number; total: number }>();
  for (const c of merged) {
    if (c.smoker) {
      const e = factorCounts.get("Темекі шегу") ?? { count: 0, total: 0 };
      e.count += 1;
      e.total += 35;
      factorCounts.set("Темекі шегу", e);
    }
    if (c.bmi >= 30) {
      const e = factorCounts.get("Семіздік") ?? { count: 0, total: 0 };
      e.count += 1;
      e.total += 20;
      factorCounts.set("Семіздік", e);
    }
    if (c.bmi >= 25 && c.bmi < 30) {
      const e = factorCounts.get("Артық салмақ") ?? { count: 0, total: 0 };
      e.count += 1;
      e.total += 10;
      factorCounts.set("Артық салмақ", e);
    }
    if (c.chronicDiseases.length) {
      const e = factorCounts.get("Созылмалы аурулар") ?? { count: 0, total: 0 };
      e.count += 1;
      e.total += 22;
      factorCounts.set("Созылмалы аурулар", e);
    }
    if (c.activityLevel === "sedentary") {
      const e = factorCounts.get("Отырықшы өмір салты") ?? { count: 0, total: 0 };
      e.count += 1;
      e.total += 10;
      factorCounts.set("Отырықшы өмір салты", e);
    }
    if (c.jobCategory === "hazardous") {
      const e = factorCounts.get("Қауіпті жұмыс") ?? { count: 0, total: 0 };
      e.count += 1;
      e.total += 25;
      factorCounts.set("Қауіпті жұмыс", e);
    }
    if (c.alcoholUse === "regular") {
      const e = factorCounts.get("Жиі алкоголь") ?? { count: 0, total: 0 };
      e.count += 1;
      e.total += 18;
      factorCounts.set("Жиі алкоголь", e);
    }
    if (c.age >= 50) {
      const e = factorCounts.get("Жас (50+)") ?? { count: 0, total: 0 };
      e.count += 1;
      e.total += 35;
      factorCounts.set("Жас (50+)", e);
    }
  }
  const topRiskFactors = Array.from(factorCounts.entries())
    .map(([factor, v]) => ({
      factor,
      count: v.count,
      avgImpact: v.count ? Math.round(v.total / v.count) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const regionMap = new Map<string, { sum: number; count: number; prem: number }>();
  for (const r of KZ_REGIONS) regionMap.set(r, { sum: 0, count: 0, prem: 0 });
  for (const c of merged) {
    const e = regionMap.get(c.region);
    if (e) {
      e.sum += c.riskScore;
      e.count += 1;
      e.prem += c.annualPremium;
    }
  }
  const regionData = Array.from(regionMap.entries()).map(([region, v]) => ({
    region,
    avgRisk: v.count ? Math.round(v.sum / v.count) : 0,
    avgPremium: v.count ? Math.round(v.prem / v.count) : 0,
    count: v.count,
  }));

  const recentCalculations = [...merged]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 20);

  return NextResponse.json({
    totalCalculations,
    highRiskPercent,
    lowRiskPercent,
    avgAnnualPremium,
    todayCount,
    weekTrend,
    dailyData,
    riskDistribution,
    ageDistribution,
    topRiskFactors,
    regionData,
    recentCalculations,
  });
}
