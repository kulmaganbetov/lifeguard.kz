export interface MortalityRow {
  male: number;
  female: number;
}

export const mortalityTable: Record<number, MortalityRow> = {
  18: { male: 0.00142, female: 0.00058 },
  25: { male: 0.00189, female: 0.00071 },
  30: { male: 0.00241, female: 0.00089 },
  35: { male: 0.00312, female: 0.00108 },
  40: { male: 0.00489, female: 0.00156 },
  45: { male: 0.00712, female: 0.00221 },
  50: { male: 0.01089, female: 0.00334 },
  55: { male: 0.01612, female: 0.00498 },
  60: { male: 0.02341, female: 0.00789 },
  65: { male: 0.03489, female: 0.01234 },
  70: { male: 0.05123, female: 0.01987 },
};

export const KZ_REGIONS = [
  "Алматы қаласы",
  "Астана қаласы",
  "Шымкент қаласы",
  "Алматы облысы",
  "Ақмола облысы",
  "Ақтөбе облысы",
  "Атырау облысы",
  "Батыс Қазақстан облысы",
  "Жамбыл облысы",
  "Қарағанды облысы",
  "Қостанай облысы",
  "Қызылорда облысы",
  "Маңғыстау облысы",
  "Павлодар облысы",
  "Солтүстік Қазақстан облысы",
  "Түркістан облысы",
  "Шығыс Қазақстан облысы",
] as const;

export type KzRegion = (typeof KZ_REGIONS)[number];

export const REGION_RISK_FACTORS: Record<string, number> = {
  "Алматы қаласы": 1.0,
  "Астана қаласы": 1.0,
  "Шымкент қаласы": 1.03,
  "Алматы облысы": 1.03,
  "Ақмола облысы": 1.07,
  "Ақтөбе облысы": 1.07,
  "Атырау облысы": 1.1,
  "Батыс Қазақстан облысы": 1.07,
  "Жамбыл облысы": 1.07,
  "Қарағанды облысы": 1.07,
  "Қостанай облысы": 1.07,
  "Қызылорда облысы": 1.1,
  "Маңғыстау облысы": 1.1,
  "Павлодар облысы": 1.07,
  "Солтүстік Қазақстан облысы": 1.07,
  "Түркістан облысы": 1.07,
  "Шығыс Қазақстан облысы": 1.07,
};

export interface ChronicDiseaseOption {
  id: string;
  label: string;
  multiplier: number;
}

export const CHRONIC_DISEASES: ChronicDiseaseOption[] = [
  { id: "diabetes", label: "Қант диабеті", multiplier: 1.22 },
  { id: "heart", label: "Жүрек ауруы", multiplier: 1.35 },
  { id: "hypertension", label: "Гипертония", multiplier: 1.18 },
  { id: "asthma", label: "Астма", multiplier: 1.12 },
  { id: "cancer", label: "Қатерлі ісік (тарих)", multiplier: 1.55 },
  { id: "arthritis", label: "Артрит", multiplier: 1.08 },
];

export const GENERAL_HEALTH_OPTIONS = [
  { id: "excellent", label: "Өте жақсы", multiplier: 0.92 },
  { id: "good", label: "Жақсы", multiplier: 1.0 },
  { id: "fair", label: "Орташа", multiplier: 1.15 },
  { id: "poor", label: "Нашар", multiplier: 1.3 },
] as const;

export const ACTIVITY_OPTIONS = [
  { id: "sedentary", label: "Отырықшы", multiplier: 1.1 },
  { id: "moderate", label: "Орташа", multiplier: 1.0 },
  { id: "active", label: "Белсенді", multiplier: 0.95 },
  { id: "athlete", label: "Спортшы", multiplier: 0.9 },
] as const;

export const JOB_OPTIONS = [
  { id: "office", label: "Офис", multiplier: 1.0 },
  { id: "field", label: "Дала", multiplier: 1.1 },
  { id: "hazardous", label: "Қауіпті", multiplier: 1.25 },
] as const;

export const ALCOHOL_OPTIONS = [
  { id: "never", label: "Ешқашан", multiplier: 1.0 },
  { id: "occasional", label: "Кейде", multiplier: 1.05 },
  { id: "regular", label: "Жиі", multiplier: 1.18 },
] as const;

export const MARITAL_OPTIONS = [
  { id: "single", label: "Жалғыз" },
  { id: "married", label: "Үйленген" },
  { id: "divorced", label: "Ажырасқан" },
  { id: "widowed", label: "Жесір" },
] as const;

export const EDUCATION_OPTIONS = [
  { id: "school", label: "Орта білім" },
  { id: "college", label: "Колледж" },
  { id: "bachelor", label: "Жоғары білім" },
  { id: "master", label: "Магистр / PhD" },
] as const;

export const INCOME_OPTIONS = [
  { id: "lt_300", label: "300 000 ₸-ге дейін" },
  { id: "300_600", label: "300–600 мың ₸" },
  { id: "600_1000", label: "600 мың – 1 млн ₸" },
  { id: "1000_2000", label: "1–2 млн ₸" },
  { id: "2000_5000", label: "2–5 млн ₸" },
  { id: "gt_5000", label: "5 млн ₸-ден жоғары" },
] as const;

export const GOAL_OPTIONS = [
  { id: "family", label: "Отбасын қорғау" },
  { id: "mortgage", label: "Ипотека" },
  { id: "business", label: "Бизнес" },
  { id: "retirement", label: "Зейнетақы" },
] as const;

export const TERM_OPTIONS = [10, 15, 20, 25, 30] as const;

export interface InsuranceRecommendation {
  company: string;
  tagline: string;
  monthlyPrice: number;
  coverageHighlight: string;
  rating: number;
  brandColor: string;
  payoutMonths: number;
}

export const INSURANCE_COMPANIES: {
  key: string;
  company: string;
  tagline: string;
  brandColor: string;
  rating: number;
  premiumFactor: number;
  coverageHighlight: string;
  payoutMonths: number;
}[] = [
  {
    key: "jusan",
    company: "Jusan Life",
    tagline: "Цифрлық сақтандыру",
    brandColor: "#2563EB",
    rating: 4.8,
    premiumFactor: 1.0,
    coverageHighlight: "Жылдам онлайн төлем, 10 жыл кепілдік",
    payoutMonths: 1,
  },
  {
    key: "nomad",
    company: "Nomad Life",
    tagline: "Дәстүрлі сенімділік",
    brandColor: "#06B6D4",
    rating: 4.6,
    premiumFactor: 0.94,
    coverageHighlight: "Халық Банк желісімен интеграция",
    payoutMonths: 2,
  },
  {
    key: "freedom",
    company: "Freedom Life",
    tagline: "Инвестициялық өнімдер",
    brandColor: "#7C3AED",
    rating: 4.7,
    premiumFactor: 1.06,
    coverageHighlight: "Инвестициялық компонент + салықтық жеңілдік",
    payoutMonths: 1,
  },
];
