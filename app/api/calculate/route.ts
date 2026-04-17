import { NextResponse } from "next/server";
import { calculatePremium, calcBmi, type CalculateInput } from "@/lib/actuarial";
import { saveCalculation, type Calculation } from "@/lib/store";

export const runtime = "nodejs";

function randomId(): string {
  return `calc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function isString(v: unknown): v is string {
  return typeof v === "string";
}

function validate(body: Record<string, unknown>): CalculateInput | null {
  const age = Number(body.age);
  const gender = body.gender === "female" ? "female" : "male";
  const smoker = Boolean(body.smoker);
  const region = isString(body.region) ? body.region : "Алматы қаласы";
  const heightCm = Number(body.heightCm);
  const weightKg = Number(body.weightKg);
  const generalHealth = (["excellent", "good", "fair", "poor"].includes(String(body.generalHealth))
    ? body.generalHealth
    : "good") as CalculateInput["generalHealth"];
  const activityLevel = (["sedentary", "moderate", "active", "athlete"].includes(
    String(body.activityLevel),
  )
    ? body.activityLevel
    : "moderate") as CalculateInput["activityLevel"];
  const jobCategory = (["office", "field", "hazardous"].includes(String(body.jobCategory))
    ? body.jobCategory
    : "office") as CalculateInput["jobCategory"];
  const alcoholUse = (["never", "occasional", "regular"].includes(String(body.alcoholUse))
    ? body.alcoholUse
    : "never") as CalculateInput["alcoholUse"];
  const chronicDiseases = Array.isArray(body.chronicDiseases)
    ? body.chronicDiseases.filter(isString)
    : [];
  const termYears = Number(body.termYears);
  const coverageAmount = Number(body.coverageAmount);
  const addCoverageRaw = (body.addCoverage ?? {}) as Record<string, unknown>;
  const purpose = isString(body.purpose) ? body.purpose : "family";
  const maritalStatus = isString(body.maritalStatus) ? body.maritalStatus : "single";
  const education = isString(body.education) ? body.education : "bachelor";
  const incomeRange = isString(body.incomeRange) ? body.incomeRange : "600_1000";

  if (!Number.isFinite(age) || age < 18 || age > 70) return null;
  if (!Number.isFinite(heightCm) || heightCm < 120 || heightCm > 230) return null;
  if (!Number.isFinite(weightKg) || weightKg < 30 || weightKg > 250) return null;
  if (!Number.isFinite(termYears) || termYears < 5 || termYears > 40) return null;
  if (!Number.isFinite(coverageAmount) || coverageAmount < 1_000_000) return null;

  return {
    age,
    gender,
    smoker,
    region,
    heightCm,
    weightKg,
    generalHealth,
    activityLevel,
    jobCategory,
    alcoholUse,
    chronicDiseases,
    termYears,
    coverageAmount,
    addCoverage: {
      accident: Boolean(addCoverageRaw.accident),
      disability: Boolean(addCoverageRaw.disability),
      criticalIllness: Boolean(addCoverageRaw.criticalIllness),
    },
    maritalStatus,
    education,
    incomeRange,
    purpose,
  };
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const input = validate(body);
  if (!input) {
    return NextResponse.json({ error: "Validation failed" }, { status: 422 });
  }

  const result = calculatePremium(input);
  const bmi = calcBmi(input.heightCm, input.weightKg);

  const record: Calculation = {
    id: randomId(),
    createdAt: new Date().toISOString(),
    age: input.age,
    gender: input.gender,
    region: input.region,
    smoker: input.smoker,
    bmi,
    chronicDiseases: input.chronicDiseases,
    generalHealth: input.generalHealth,
    activityLevel: input.activityLevel,
    jobCategory: input.jobCategory,
    alcoholUse: input.alcoholUse,
    riskScore: result.riskScore,
    riskLevel: result.riskLevel,
    annualPremium: result.annualPremium,
    monthlyPremium: result.monthlyPremium,
    netPremium: result.netPremium,
    adjustedQx: result.adjustedQx,
    annuityFactor: result.annuityFactor,
    coverageAmount: input.coverageAmount,
    termYears: input.termYears,
    topFactors: result.topFactors,
  };

  saveCalculation(record);

  return NextResponse.json({ ...result, id: record.id, bmi, input });
}
