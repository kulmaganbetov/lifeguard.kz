"use client";

import {
  ALCOHOL_OPTIONS,
  EDUCATION_OPTIONS,
  INCOME_OPTIONS,
  JOB_OPTIONS,
  MARITAL_OPTIONS,
} from "@/lib/constants";
import type { CalculatorFormState } from "../types";

interface Props {
  form: CalculatorFormState;
  update: (patch: Partial<CalculatorFormState>) => void;
}

export default function Step3Lifestyle({ form, update }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm font-medium text-slate-700">Жұмыс категориясы</div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {JOB_OPTIONS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => update({ jobCategory: o.id })}
              className={`pill-option ${form.jobCategory === o.id ? "pill-option-active" : ""}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-sm font-medium text-slate-700">Алкоголь пайдалану</div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {ALCOHOL_OPTIONS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => update({ alcoholUse: o.id })}
              className={`pill-option ${form.alcoholUse === o.id ? "pill-option-active" : ""}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-sm font-medium text-slate-700">Отбасы жағдайы</div>
        <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4">
          {MARITAL_OPTIONS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => update({ maritalStatus: o.id })}
              className={`pill-option ${form.maritalStatus === o.id ? "pill-option-active" : ""}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-sm font-medium text-slate-700">Білім деңгейі</div>
        <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4">
          {EDUCATION_OPTIONS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => update({ education: o.id })}
              className={`pill-option ${form.education === o.id ? "pill-option-active" : ""}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-sm font-medium text-slate-700">Айлық кіріс</div>
        <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
          {INCOME_OPTIONS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => update({ incomeRange: o.id })}
              className={`pill-option ${form.incomeRange === o.id ? "pill-option-active" : ""}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
