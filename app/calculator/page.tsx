"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Step1Personal from "./steps/Step1Personal";
import Step2Health from "./steps/Step2Health";
import Step3Lifestyle from "./steps/Step3Lifestyle";
import Step4Coverage from "./steps/Step4Coverage";
import { initialForm, type CalculatorFormState } from "./types";
import { calcBmi, quickRiskEstimate } from "@/lib/actuarial";
import RiskBadge from "@/components/ui/RiskBadge";

const steps = [
  { id: 1, title: "Жеке ақпарат", short: "Жеке" },
  { id: 2, title: "Денсаулық", short: "Денсаулық" },
  { id: 3, title: "Өмір салты", short: "Салт" },
  { id: 4, title: "Жабу", short: "Жабу" },
];

export default function CalculatorPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<CalculatorFormState>(initialForm);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const bmi = useMemo(() => calcBmi(form.heightCm, form.weightKg), [form.heightCm, form.weightKg]);

  const preview = useMemo(
    () =>
      quickRiskEstimate({
        age: form.age,
        gender: form.gender,
        smoker: form.smoker,
        bmi,
        activityLevel: form.activityLevel,
        generalHealth: form.generalHealth,
        chronicDiseases: form.chronicDiseases,
      }),
    [form, bmi],
  );

  const update = (patch: Partial<CalculatorFormState>) => {
    setForm((f) => ({ ...f, ...patch }));
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const validate = (): boolean => {
    if (step === 1) {
      if (!form.age || form.age < 18 || form.age > 70) {
        showToast("Жасыңызды 18–70 аралығында көрсетіңіз");
        return false;
      }
    }
    if (step === 2) {
      if (!form.heightCm || form.heightCm < 120) {
        showToast("Бойыңызды енгізіңіз");
        return false;
      }
      if (!form.weightKg || form.weightKg < 30) {
        showToast("Салмағыңызды енгізіңіз");
        return false;
      }
    }
    if (step === 4) {
      if (!form.coverageAmount || form.coverageAmount < 1_000_000) {
        showToast("Сақтандыру сомасын көрсетіңіз");
        return false;
      }
    }
    return true;
  };

  const next = () => {
    if (!validate()) return;
    setDirection(1);
    setStep((s) => Math.min(4, s + 1));
  };
  const prev = () => {
    setDirection(-1);
    setStep((s) => Math.max(1, s - 1));
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Қате" }));
        showToast((err as { error?: string }).error ?? "Есептеу қатесі");
        setLoading(false);
        return;
      }
      const data = await res.json();
      sessionStorage.setItem("lifeguard_result", JSON.stringify(data));
      sessionStorage.setItem("lifeguard_form", JSON.stringify(form));
      router.push("/calculator/result");
    } catch {
      showToast("Желі қатесі. Қайталап көріңіз.");
      setLoading(false);
    }
  };

  const variants = {
    initial: (dir: 1 | -1) => ({ x: dir === 1 ? 40 : -40, opacity: 0 }),
    animate: { x: 0, opacity: 1 },
    exit: (dir: 1 | -1) => ({ x: dir === 1 ? -40 : 40, opacity: 0 }),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14 md:px-6">
      <div className="mb-8 text-center">
        <h1 className="section-heading">Тәуекел калькуляторы</h1>
        <p className="mt-2 text-slate-600">
          4 қадамда жеке актуарлық есептеуді алыңыз — 3 минут.
        </p>
      </div>

      <div className="glass-card p-6 md:p-8 relative">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {steps.map((s, i) => {
                const done = step > s.id;
                const active = step === s.id;
                return (
                  <div key={s.id} className="flex flex-1 items-center">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-all ${
                        done
                          ? "bg-blue-600 text-white"
                          : active
                          ? "bg-blue-100 text-blue-700 ring-4 ring-blue-100"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {done ? <Check className="h-4 w-4" /> : s.id}
                    </div>
                    {i < steps.length - 1 && (
                      <div
                        className={`mx-1 h-0.5 flex-1 rounded-full transition-all ${
                          step > s.id ? "bg-blue-600" : "bg-slate-200"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-2 hidden md:flex items-center justify-between text-xs text-slate-500">
              {steps.map((s) => (
                <div key={s.id} className="flex-1 text-center">
                  {s.title}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:flex flex-col items-end gap-1">
            <div className="text-[10px] uppercase tracking-wider text-slate-400">Болжамды тәуекел</div>
            <RiskBadge level={preview.level} size="sm" />
          </div>
        </div>

        <div className="mt-4 min-h-[380px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                {steps[step - 1].title}
              </h2>
              {step === 1 && <Step1Personal form={form} update={update} />}
              {step === 2 && <Step2Health form={form} update={update} />}
              {step === 3 && <Step3Lifestyle form={form} update={update} />}
              {step === 4 && <Step4Coverage form={form} update={update} />}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
          <button
            type="button"
            onClick={prev}
            disabled={step === 1}
            className="btn-secondary"
          >
            <ArrowLeft className="h-4 w-4" />
            Артқа
          </button>

          <div className="md:hidden">
            <RiskBadge level={preview.level} size="sm" />
          </div>

          {step < 4 ? (
            <button type="button" onClick={next} className="btn-primary">
              Келесі
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Есептеу...
                </>
              ) : (
                <>
                  Нәтижені алу
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg"
            role="alert"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-400" />
              {toast}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
