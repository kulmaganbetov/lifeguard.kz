export interface CalculatorFormState {
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

export const initialForm: CalculatorFormState = {
  age: 32,
  gender: "male",
  smoker: false,
  region: "Алматы қаласы",
  heightCm: 175,
  weightKg: 75,
  generalHealth: "good",
  chronicDiseases: [],
  activityLevel: "moderate",
  jobCategory: "office",
  alcoholUse: "occasional",
  maritalStatus: "married",
  education: "bachelor",
  incomeRange: "600_1000",
  termYears: 20,
  coverageAmount: 20_000_000,
  addCoverage: {
    accident: false,
    disability: false,
    criticalIllness: false,
  },
  purpose: "family",
};
