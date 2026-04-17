export interface Calculation {
  id: string;
  createdAt: string;
  age: number;
  gender: "male" | "female";
  region: string;
  smoker: boolean;
  bmi: number;
  chronicDiseases: string[];
  generalHealth: string;
  activityLevel: string;
  jobCategory: string;
  alcoholUse: string;
  riskScore: number;
  riskLevel: string;
  annualPremium: number;
  monthlyPremium: number;
  netPremium: number;
  adjustedQx: number;
  annuityFactor: number;
  coverageAmount: number;
  termYears: number;
  topFactors: { name: string; impact: number; direction: "up" | "down" }[];
}

declare global {
  // eslint-disable-next-line no-var
  var __lifeguardStore: Calculation[] | undefined;
}

const store: Calculation[] = globalThis.__lifeguardStore ?? [];
globalThis.__lifeguardStore = store;

export const saveCalculation = (c: Calculation): void => {
  store.push(c);
  if (store.length > 5000) store.splice(0, store.length - 5000);
};

export const getCalculations = (): Calculation[] => [...store];

export const clearCalculations = (): void => {
  store.length = 0;
};
