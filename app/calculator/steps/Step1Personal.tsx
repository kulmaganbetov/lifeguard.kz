"use client";

import { KZ_REGIONS } from "@/lib/constants";
import type { CalculatorFormState } from "../types";

interface Props {
  form: CalculatorFormState;
  update: (patch: Partial<CalculatorFormState>) => void;
}

export default function Step1Personal({ form, update }: Props) {
  const ageProgress = ((form.age - 18) / (70 - 18)) * 100;
  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="age" className="flex items-center justify-between text-sm font-medium text-slate-700">
          <span>Жасыңыз</span>
          <span className="font-mono text-lg font-bold text-emerald-600">{form.age}</span>
        </label>
        <div className="mt-3 flex items-center gap-4">
          <input
            id="age"
            type="range"
            min={18}
            max={70}
            value={form.age}
            onChange={(e) => update({ age: Number(e.target.value) })}
            className="slider-emerald flex-1"
            style={{ ["--val" as string]: `${ageProgress}%` }}
          />
          <input
            type="number"
            min={18}
            max={70}
            value={form.age}
            onChange={(e) => update({ age: Math.max(18, Math.min(70, Number(e.target.value) || 18)) })}
            className="input-field w-20 text-center font-mono"
            aria-label="Жас енгізу"
          />
        </div>
        <div className="mt-1 flex justify-between text-xs text-slate-400">
          <span>18</span>
          <span>70</span>
        </div>
      </div>

      <div>
        <div className="text-sm font-medium text-slate-700">Жынысыңыз</div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {[
            { id: "male", label: "Ер" },
            { id: "female", label: "Әйел" },
          ].map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => update({ gender: o.id as "male" | "female" })}
              className={`pill-option ${form.gender === o.id ? "pill-option-active" : ""}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-sm font-medium text-slate-700">Темекі шегесіз бе?</div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {[
            { val: false, label: "Жоқ" },
            { val: true, label: "Иә" },
          ].map((o) => (
            <button
              key={String(o.val)}
              type="button"
              onClick={() => update({ smoker: o.val })}
              className={`pill-option ${form.smoker === o.val ? "pill-option-active" : ""}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="region" className="text-sm font-medium text-slate-700">
          Тұратын аймағыңыз
        </label>
        <select
          id="region"
          value={form.region}
          onChange={(e) => update({ region: e.target.value })}
          className="input-field mt-2 appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 24 24%22 stroke-width=%221.5%22 stroke=%22%2364748B%22><path stroke-linecap=%22round%22 stroke-linejoin=%22round%22 d=%22M19.5 8.25l-7.5 7.5-7.5-7.5%22/></svg>')] bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat pr-10"
        >
          {KZ_REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
