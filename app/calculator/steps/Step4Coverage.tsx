"use client";

import { GOAL_OPTIONS, TERM_OPTIONS } from "@/lib/constants";
import type { CalculatorFormState } from "../types";

interface Props {
  form: CalculatorFormState;
  update: (patch: Partial<CalculatorFormState>) => void;
}

const MIN = 5_000_000;
const MAX = 100_000_000;

function fmt(n: number): string {
  return n.toLocaleString("ru-RU");
}

export default function Step4Coverage({ form, update }: Props) {
  const coverageProgress = ((form.coverageAmount - MIN) / (MAX - MIN)) * 100;

  const toggleCoverage = (key: keyof CalculatorFormState["addCoverage"]) => {
    update({
      addCoverage: { ...form.addCoverage, [key]: !form.addCoverage[key] },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm font-medium text-slate-700">Сақтандыру мерзімі</div>
        <div className="mt-2 grid grid-cols-5 gap-2">
          {TERM_OPTIONS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => update({ termYears: t })}
              className={`pill-option ${form.termYears === t ? "pill-option-active" : ""}`}
            >
              {t} жыл
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-slate-700">Сақтандыру сомасы</div>
          <div className="font-mono text-lg font-bold text-blue-600">
            {fmt(form.coverageAmount)} ₸
          </div>
        </div>
        <input
          type="range"
          min={MIN}
          max={MAX}
          step={1_000_000}
          value={form.coverageAmount}
          onChange={(e) => update({ coverageAmount: Number(e.target.value) })}
          className="slider-blue mt-3"
          style={{ ["--val" as string]: `${coverageProgress}%` }}
          aria-label="Сақтандыру сомасы"
        />
        <div className="mt-1 flex justify-between text-xs text-slate-400">
          <span>5 млн ₸</span>
          <span>100 млн ₸</span>
        </div>
      </div>

      <div>
        <div className="text-sm font-medium text-slate-700">Қосымша жабу (опция)</div>
        <div className="mt-2 space-y-2">
          {[
            { key: "accident" as const, label: "Жазатайым оқиға", note: "+7%" },
            { key: "disability" as const, label: "Мүгедектік", note: "+12%" },
            { key: "criticalIllness" as const, label: "Ауыр науқас", note: "+15%" },
          ].map((c) => {
            const active = form.addCoverage[c.key];
            return (
              <label
                key={c.key}
                className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-all ${
                  active
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-blue-600"
                    checked={active}
                    onChange={() => toggleCoverage(c.key)}
                  />
                  <span className={`text-sm ${active ? "text-blue-700 font-medium" : "text-slate-700"}`}>
                    {c.label}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-500">{c.note}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <div className="text-sm font-medium text-slate-700">Сақтандыру мақсаты</div>
        <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4">
          {GOAL_OPTIONS.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => update({ purpose: o.id })}
              className={`pill-option ${form.purpose === o.id ? "pill-option-active" : ""}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
