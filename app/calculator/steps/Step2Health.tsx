"use client";

import { ACTIVITY_OPTIONS, CHRONIC_DISEASES, GENERAL_HEALTH_OPTIONS } from "@/lib/constants";
import { bmiCategory, calcBmi } from "@/lib/actuarial";
import type { CalculatorFormState } from "../types";

interface Props {
  form: CalculatorFormState;
  update: (patch: Partial<CalculatorFormState>) => void;
}

const toneBg: Record<string, string> = {
  success: "bg-emerald-50 text-emerald-700",
  warn: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-700",
  info: "bg-slate-50 text-slate-500",
};

export default function Step2Health({ form, update }: Props) {
  const bmi = calcBmi(form.heightCm, form.weightKg);
  const cat = bmiCategory(bmi);

  const toggleDisease = (id: string) => {
    const has = form.chronicDiseases.includes(id);
    update({
      chronicDiseases: has
        ? form.chronicDiseases.filter((x) => x !== id)
        : [...form.chronicDiseases, id],
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm font-medium text-slate-700">Денсаулықтың жалпы бағасы</div>
        <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4">
          {GENERAL_HEALTH_OPTIONS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => update({ generalHealth: o.id })}
              className={`pill-option ${form.generalHealth === o.id ? "pill-option-active" : ""}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-sm font-medium text-slate-700">Созылмалы аурулар</div>
        <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
          {CHRONIC_DISEASES.map((d) => {
            const active = form.chronicDiseases.includes(d.id);
            return (
              <label
                key={d.id}
                className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-all ${
                  active
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-blue-600"
                  checked={active}
                  onChange={() => toggleDisease(d.id)}
                />
                {d.label}
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <div className="text-sm font-medium text-slate-700">Бойы және салмағы</div>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="height" className="text-xs text-slate-500">
              Бойы (см)
            </label>
            <input
              id="height"
              type="number"
              min={120}
              max={230}
              value={form.heightCm}
              onChange={(e) => update({ heightCm: Number(e.target.value) || 0 })}
              className="input-field mt-1 font-mono"
            />
          </div>
          <div>
            <label htmlFor="weight" className="text-xs text-slate-500">
              Салмағы (кг)
            </label>
            <input
              id="weight"
              type="number"
              min={30}
              max={250}
              value={form.weightKg}
              onChange={(e) => update({ weightKg: Number(e.target.value) || 0 })}
              className="input-field mt-1 font-mono"
            />
          </div>
        </div>
        {bmi > 0 && (
          <div className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${toneBg[cat.tone]}`}>
            <span>ИМТ</span>
            <span className="font-mono font-bold">{bmi}</span>
            <span>•</span>
            <span>{cat.label}</span>
          </div>
        )}
      </div>

      <div>
        <div className="text-sm font-medium text-slate-700">Физикалық белсенділік</div>
        <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4">
          {ACTIVITY_OPTIONS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => update({ activityLevel: o.id })}
              className={`pill-option ${form.activityLevel === o.id ? "pill-option-active" : ""}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
