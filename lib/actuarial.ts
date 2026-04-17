import {
  ACTIVITY_OPTIONS,
  ALCOHOL_OPTIONS,
  CHRONIC_DISEASES,
  GENERAL_HEALTH_OPTIONS,
  INSURANCE_COMPANIES,
  JOB_OPTIONS,
  REGION_RISK_FACTORS,
  type InsuranceRecommendation,
  mortalityTable,
} from "./constants";

export interface CalculateInput {
  age: number;
  gender: "male" | "female";
  smoker: boolean;
  region: string;
  heightCm: number;
  weightKg: number;
  generalHealth: "excellent" | "good" | "fair" | "poor";
  chronicDiseases: string[];
  activityLevel: "sedentary" | "moderate" | "active" | "athlete";
  jobCategory: "office" | "field" | "hazardous";
  alcoholUse: "never" | "occasional" | "regular";
  maritalStatus: string;
  education: string;
  incomeRange: string;
  termYears: number;
  coverageAmount: number;
  addCoverage: {
    accident: boolean;
    disability: boolean;
    criticalIllness: boolean;
  };
  purpose: string;
}

export interface TopFactor {
  name: string;
  impact: number;
  direction: "up" | "down";
}

export interface CalculateResult {
  riskScore: number;
  riskLevel: "Төмен" | "Орташа" | "Жоғары" | "Өте жоғары";
  annualPremium: number;
  monthlyPremium: number;
  netPremium: number;
  loadingFactor: number;
  annuityFactor: number;
  adjustedQx: number;
  baseQx: number;
  baseQxForTerm: number;
  ageFactor: number;
  combinedMultiplier: number;
  topFactors: TopFactor[];
  recommendations: InsuranceRecommendation[];
}

const GOMPERTZ_ALPHA = 0.00005;
const GOMPERTZ_BETA_MALE = 0.085;
const GOMPERTZ_BETA_FEMALE = 0.075;
const INTEREST_RATE = 0.085;
const LOADING_FACTOR = 0.3;
const MAX_QX = 0.95;

export function calcBmi(heightCm: number, weightKg: number): number {
  if (!heightCm || heightCm <= 0) return 0;
  const m = heightCm / 100;
  return Number((weightKg / (m * m)).toFixed(1));
}

export function bmiMultiplier(bmi: number): number {
  if (bmi <= 0) return 1.0;
  if (bmi < 18.5) return 1.15;
  if (bmi < 25) return 1.0;
  if (bmi < 30) return 1.1;
  if (bmi < 35) return 1.2;
  return 1.35;
}

export function bmiCategory(bmi: number): {
  label: string;
  tone: "success" | "warn" | "danger" | "info";
} {
  if (bmi <= 0) return { label: "—", tone: "info" };
  if (bmi < 18.5) return { label: "Салмағы жетіспейді", tone: "warn" };
  if (bmi < 25) return { label: "Қалыпты", tone: "success" };
  if (bmi < 30) return { label: "Артық салмақ", tone: "warn" };
  if (bmi < 35) return { label: "Семіздік I", tone: "danger" };
  return { label: "Семіздік II+", tone: "danger" };
}

function lookupBaseQx(age: number, gender: "male" | "female"): number {
  const entries = Object.keys(mortalityTable)
    .map(Number)
    .sort((a, b) => a - b);
  const clampedAge = Math.max(entries[0], Math.min(entries[entries.length - 1], age));
  if (mortalityTable[clampedAge]) {
    return mortalityTable[clampedAge][gender];
  }
  let lower = entries[0];
  let upper = entries[entries.length - 1];
  for (let i = 0; i < entries.length - 1; i++) {
    if (entries[i] <= clampedAge && entries[i + 1] >= clampedAge) {
      lower = entries[i];
      upper = entries[i + 1];
      break;
    }
  }
  const lo = mortalityTable[lower][gender];
  const hi = mortalityTable[upper][gender];
  const t = (clampedAge - lower) / (upper - lower);
  return lo + (hi - lo) * t;
}

export function ageFactor(age: number): number {
  if (age <= 30) return 1.0;
  if (age <= 40) return 1.15;
  if (age <= 50) return 1.35;
  if (age <= 60) return 1.6;
  return 1.9;
}

export function regionFactor(region: string): number {
  return REGION_RISK_FACTORS[region] ?? 1.07;
}

function gompertzBeta(gender: "male" | "female"): number {
  return gender === "male" ? GOMPERTZ_BETA_MALE : GOMPERTZ_BETA_FEMALE;
}

export function gompertzSurvival(
  age: number,
  t: number,
  gender: "male" | "female",
): number {
  const beta = gompertzBeta(gender);
  const inside =
    -(GOMPERTZ_ALPHA / beta) *
    (Math.exp(beta * (age + t)) - Math.exp(beta * age));
  return Math.exp(inside);
}

export function cumulativeQxForTerm(
  age: number,
  termYears: number,
  gender: "male" | "female",
): number {
  const survival = gompertzSurvival(age, termYears, gender);
  return 1 - survival;
}

export function annuityDueFactor(
  age: number,
  termYears: number,
  gender: "male" | "female",
): number {
  const v = 1 / (1 + INTEREST_RATE);
  let sum = 0;
  for (let t = 0; t < termYears; t++) {
    const surv = gompertzSurvival(age, t, gender);
    sum += Math.pow(v, t) * surv;
  }
  return sum;
}

export interface FactorContribution {
  name: string;
  multiplier: number;
}

export function buildMultipliers(input: CalculateInput): {
  factors: FactorContribution[];
  combined: number;
} {
  const factors: FactorContribution[] = [];
  const bmi = calcBmi(input.heightCm, input.weightKg);

  if (input.smoker) factors.push({ name: "Темекі шегу", multiplier: 1.35 });

  const bmiMult = bmiMultiplier(bmi);
  if (Math.abs(bmiMult - 1.0) > 0.0001) {
    const bmiLabel =
      bmi < 18.5
        ? "Салмағы жетіспейді"
        : bmi < 30
        ? "Артық салмақ"
        : bmi < 35
        ? "Семіздік I"
        : "Семіздік II+";
    factors.push({ name: `ИМТ: ${bmiLabel}`, multiplier: bmiMult });
  }

  const activity = ACTIVITY_OPTIONS.find((o) => o.id === input.activityLevel);
  if (activity && Math.abs(activity.multiplier - 1.0) > 0.0001) {
    factors.push({ name: `Белсенділік: ${activity.label}`, multiplier: activity.multiplier });
  }

  const alcohol = ALCOHOL_OPTIONS.find((o) => o.id === input.alcoholUse);
  if (alcohol && Math.abs(alcohol.multiplier - 1.0) > 0.0001) {
    factors.push({ name: `Алкоголь: ${alcohol.label}`, multiplier: alcohol.multiplier });
  }

  const job = JOB_OPTIONS.find((o) => o.id === input.jobCategory);
  if (job && Math.abs(job.multiplier - 1.0) > 0.0001) {
    factors.push({ name: `Жұмыс: ${job.label}`, multiplier: job.multiplier });
  }

  for (const disease of input.chronicDiseases) {
    const found = CHRONIC_DISEASES.find((d) => d.id === disease);
    if (found) {
      factors.push({ name: found.label, multiplier: found.multiplier });
    }
  }

  const gh = GENERAL_HEALTH_OPTIONS.find((o) => o.id === input.generalHealth);
  if (gh && Math.abs(gh.multiplier - 1.0) > 0.0001) {
    factors.push({ name: `Жалпы денсаулық: ${gh.label}`, multiplier: gh.multiplier });
  }

  const regMult = regionFactor(input.region);
  if (Math.abs(regMult - 1.0) > 0.0001) {
    factors.push({ name: `Аймақ: ${input.region}`, multiplier: regMult });
  }

  const combined = factors.reduce((acc, f) => acc * f.multiplier, 1.0);
  return { factors, combined };
}

export function riskLevelFromScore(
  score: number,
): "Төмен" | "Орташа" | "Жоғары" | "Өте жоғары" {
  if (score <= 30) return "Төмен";
  if (score <= 55) return "Орташа";
  if (score <= 75) return "Жоғары";
  return "Өте жоғары";
}

function recommendationsFor(
  annualPremium: number,
  coverageAmount: number,
): InsuranceRecommendation[] {
  return INSURANCE_COMPANIES.map((c) => {
    const annual = annualPremium * c.premiumFactor;
    const monthly = annual / 12;
    return {
      company: c.company,
      tagline: c.tagline,
      monthlyPrice: Math.round(monthly),
      coverageHighlight: c.coverageHighlight.replace(
        "{{coverage}}",
        coverageAmount.toLocaleString("ru-RU"),
      ),
      rating: c.rating,
      brandColor: c.brandColor,
      payoutMonths: c.payoutMonths,
    };
  });
}

export function calculatePremium(input: CalculateInput): CalculateResult {
  const baseQx = lookupBaseQx(input.age, input.gender);
  const baseQxForTerm = cumulativeQxForTerm(input.age, input.termYears, input.gender);
  const af = ageFactor(input.age);
  const { factors, combined } = buildMultipliers(input);

  const rawQx = baseQxForTerm * af * combined;
  const adjustedQx = Math.min(MAX_QX, rawQx);

  const annuity = annuityDueFactor(input.age, input.termYears, input.gender);
  const nsp = input.coverageAmount * adjustedQx;
  const netAnnual = nsp / Math.max(annuity, 1);
  let grossAnnual = netAnnual / (1 - LOADING_FACTOR);

  if (input.addCoverage.accident) grossAnnual *= 1.07;
  if (input.addCoverage.disability) grossAnnual *= 1.12;
  if (input.addCoverage.criticalIllness) grossAnnual *= 1.15;

  const monthly = grossAnnual / 12;

  const riskScore = Math.min(100, Math.max(1, Math.round((adjustedQx / MAX_QX) * 100)));
  const riskLevel = riskLevelFromScore(riskScore);

  const baselineRaw = baseQxForTerm * 1.0 * 1.0;
  const baselineAdjusted = Math.min(MAX_QX, baselineRaw);
  const baselineAnnual =
    (input.coverageAmount * baselineAdjusted) / Math.max(annuity, 1) / (1 - LOADING_FACTOR);

  const topFactors: TopFactor[] = factors
    .map((f) => {
      const impact = (f.multiplier - 1.0) * 100;
      return {
        name: f.name,
        impact: Math.round(Math.abs(impact) * 10) / 10,
        direction: f.multiplier >= 1.0 ? ("up" as const) : ("down" as const),
      };
    })
    .sort((a, b) => b.impact - a.impact)
    .slice(0, 5);

  return {
    riskScore,
    riskLevel,
    annualPremium: Math.round(grossAnnual),
    monthlyPremium: Math.round(monthly),
    netPremium: Math.round(netAnnual),
    loadingFactor: LOADING_FACTOR,
    annuityFactor: Number(annuity.toFixed(4)),
    adjustedQx: Number(adjustedQx.toFixed(6)),
    baseQx: Number(baseQx.toFixed(6)),
    baseQxForTerm: Number(baseQxForTerm.toFixed(6)),
    ageFactor: af,
    combinedMultiplier: Number(combined.toFixed(4)),
    topFactors,
    recommendations: recommendationsFor(grossAnnual, input.coverageAmount),
  };
}

export function quickRiskEstimate(params: {
  age?: number;
  gender?: "male" | "female";
  smoker?: boolean;
  bmi?: number;
  activityLevel?: "sedentary" | "moderate" | "active" | "athlete";
  generalHealth?: "excellent" | "good" | "fair" | "poor";
  chronicDiseases?: string[];
}): { score: number; level: "Төмен" | "Орташа" | "Жоғары" | "Өте жоғары" } {
  const age = params.age ?? 30;
  const gender = params.gender ?? "male";
  let base = lookupBaseQx(age, gender) * ageFactor(age);
  if (params.smoker) base *= 1.35;
  if (params.bmi && params.bmi > 0) base *= bmiMultiplier(params.bmi);
  if (params.activityLevel) {
    const a = ACTIVITY_OPTIONS.find((o) => o.id === params.activityLevel);
    if (a) base *= a.multiplier;
  }
  if (params.generalHealth) {
    const g = GENERAL_HEALTH_OPTIONS.find((o) => o.id === params.generalHealth);
    if (g) base *= g.multiplier;
  }
  if (params.chronicDiseases) {
    for (const d of params.chronicDiseases) {
      const f = CHRONIC_DISEASES.find((x) => x.id === d);
      if (f) base *= f.multiplier;
    }
  }
  const adjusted = Math.min(MAX_QX, base);
  const score = Math.min(100, Math.max(1, Math.round((adjusted / MAX_QX) * 100)));
  return { score, level: riskLevelFromScore(score) };
}
