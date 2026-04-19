"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Download,
  Info,
  Loader2,
  Minus,
  Sparkles,
  Star,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import GaugeChart from "@/components/ui/GaugeChart";
import RiskBadge from "@/components/ui/RiskBadge";
import type { CalculateResult } from "@/lib/actuarial";
import type { CalculatorFormState } from "../types";
import {
  bmiMultiplier,
  calcBmi,
  calculatePremium,
  type CalculateInput,
} from "@/lib/actuarial";

interface StoredResult extends CalculateResult {
  id: string;
  bmi: number;
  input: CalculateInput;
}

function fmtMoney(n: number): string {
  return n.toLocaleString("ru-RU");
}

export default function ResultPage() {
  const router = useRouter();
  const [data, setData] = useState<StoredResult | null>(null);
  const [form, setForm] = useState<CalculatorFormState | null>(null);
  const [actuarialOpen, setActuarialOpen] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const [wi, setWi] = useState({ quitSmoking: false, loseWeightKg: 0, changeJob: false });

  useEffect(() => {
    const raw = sessionStorage.getItem("lifeguard_result");
    const formRaw = sessionStorage.getItem("lifeguard_form");
    if (!raw || !formRaw) {
      router.replace("/calculator");
      return;
    }
    try {
      setData(JSON.parse(raw) as StoredResult);
      setForm(JSON.parse(formRaw) as CalculatorFormState);
    } catch {
      router.replace("/calculator");
    }
  }, [router]);

  const whatIf = useMemo(() => {
    if (!data || !form) return null;
    const newForm: CalculatorFormState = {
      ...form,
      smoker: wi.quitSmoking ? false : form.smoker,
      weightKg: Math.max(40, form.weightKg - wi.loseWeightKg),
      jobCategory: wi.changeJob ? "office" : form.jobCategory,
    };
    const input: CalculateInput = { ...newForm };
    return calculatePremium(input);
  }, [data, form, wi]);

  if (!data || !form) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <div className="mt-3 text-sm text-slate-500">Нәтиже жүктелуде...</div>
      </div>
    );
  }

  const delta = whatIf ? whatIf.annualPremium - data.annualPremium : 0;

  const downloadPdf = async () => {
    setDownloading(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("LifeGuard KZ - Risk Report", 40, 50);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`Date: ${new Date().toLocaleString("ru-RU")}`, 40, 70);
      doc.text(`Report ID: ${data.id}`, 40, 85);

      doc.setDrawColor(200);
      doc.line(40, 100, 555, 100);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Risk Assessment", 40, 125);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`Risk Score: ${data.riskScore} / 100`, 40, 145);
      doc.text(`Risk Level: ${data.riskLevel}`, 40, 160);
      doc.text(`Adjusted qx: ${data.adjustedQx}`, 40, 175);
      doc.text(`Annuity factor: ${data.annuityFactor}`, 40, 190);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Premium", 40, 220);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`Net annual premium: ${fmtMoney(data.netPremium)} KZT`, 40, 240);
      doc.text(`Gross annual premium: ${fmtMoney(data.annualPremium)} KZT`, 40, 255);
      doc.text(`Monthly premium: ${fmtMoney(data.monthlyPremium)} KZT`, 40, 270);
      doc.text(`Loading factor: ${data.loadingFactor * 100}%`, 40, 285);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Profile", 40, 315);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`Age: ${form.age}  Gender: ${form.gender}`, 40, 335);
      doc.text(`Region: ${form.region}`, 40, 350);
      doc.text(`BMI: ${data.bmi}  Smoker: ${form.smoker ? "Yes" : "No"}`, 40, 365);
      doc.text(`Coverage: ${fmtMoney(form.coverageAmount)} KZT`, 40, 380);
      doc.text(`Term: ${form.termYears} years`, 40, 395);

      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(
        "LifeGuard KZ - demonstration report. Not a legal insurance offer.",
        40,
        800,
      );

      doc.save(`lifeguard-report-${data.id}.pdf`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 md:px-6">
      <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="section-heading">Тәуекел талдауыңыз</h1>
          <p className="mt-1 text-sm text-slate-500">
            ID: <span className="font-mono">{data.id}</span> • Жасалған уақыты:{" "}
            {new Date().toLocaleString("ru-RU")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={downloadPdf}
            disabled={downloading}
            className="btn-secondary"
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            PDF жүктеу
          </button>
          <Link href="/consultant" className="btn-primary">
            <Sparkles className="h-4 w-4" />
            AI-кеңесші
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="glass-card p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
            <div className="flex justify-center">
              <GaugeChart value={data.riskScore} size={280} label="Тәуекел көрсеткіші" />
            </div>
            <div className="flex flex-col items-start gap-3">
              <RiskBadge level={data.riskLevel} size="lg" />
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-400">
                  Жылдық сыйлықақы
                </div>
                <div className="font-mono text-3xl font-bold text-slate-900 md:text-4xl">
                  {fmtMoney(data.annualPremium)} ₸
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm text-slate-500">айына</span>
                <span className="font-mono text-xl font-semibold text-blue-600">
                  {fmtMoney(data.monthlyPremium)} ₸
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="chip">Мерзім: {form.termYears} жыл</span>
                <span className="chip">Сома: {fmtMoney(form.coverageAmount)} ₸</span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 md:p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-slate-900">Тәуекел факторлары</h3>
              <div className="text-xs text-slate-400" title="Сыйлықақыға % әсер">
                <Info className="h-3.5 w-3.5" />
              </div>
            </div>
            <span className="text-xs text-slate-500">{data.topFactors.length} фактор</span>
          </div>

          <div className="mt-5 space-y-3">
            {data.topFactors.length === 0 && (
              <div className="text-sm text-slate-500">
                Маңызды тәуекел факторлары табылған жоқ. Негізгі тариф бойынша есептелді.
              </div>
            )}
            {data.topFactors.map((f) => {
              const up = f.direction === "up";
              const width = Math.min(100, f.impact * 2);
              return (
                <div key={f.name}>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      {up ? (
                        <TrendingUp className="h-3.5 w-3.5 text-red-500" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5 text-emerald-500" />
                      )}
                      {f.name}
                    </div>
                    <span
                      className={`font-mono text-xs font-semibold ${
                        up ? "text-red-600" : "text-emerald-600"
                      }`}
                    >
                      {up ? "+" : "−"}
                      {f.impact.toFixed(1)}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${up ? "bg-red-400" : "bg-emerald-500"}`}
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 glass-card">
        <button
          type="button"
          onClick={() => setActuarialOpen((v) => !v)}
          className="flex w-full items-center justify-between p-6"
        >
          <div>
            <h3 className="text-base font-semibold text-slate-900">Актуарлық мәліметтер</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Есептеу формуласы және негізгі коэффициенттер
            </p>
          </div>
          <ChevronDown
            className={`h-5 w-5 text-slate-500 transition-transform ${
              actuarialOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        <AnimatePresence>
          {actuarialOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="border-t border-slate-100 p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-xs uppercase tracking-wider text-slate-400">
                      <tr>
                        <th className="text-left pb-2">Көрсеткіш</th>
                        <th className="text-right pb-2">Мәні</th>
                        <th className="text-left pb-2 pl-6">Түсіндірме</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <Row
                        label="qx (базалық)"
                        value={data.baseQx.toFixed(6)}
                        hint="Жас пен жынысқа негізделген өлім ықтималдығы (ҚР кестесі)"
                      />
                      <Row
                        label="qx мерзім үшін"
                        value={data.baseQxForTerm.toFixed(6)}
                        hint="Гомперц заңы бойынша мерзімге жинақталған ықтималдық"
                      />
                      <Row
                        label="Жас коэффициенті"
                        value={`×${data.ageFactor.toFixed(2)}`}
                        hint="Жас тобына байланысты түзету"
                      />
                      <Row
                        label="Комбинацияланған көбейткіш"
                        value={`×${data.combinedMultiplier.toFixed(3)}`}
                        hint="Темекі, ИМТ, денсаулық, аймақ факторларының мультипликативті нәтижесі"
                      />
                      <Row
                        label="Реттелген qx"
                        value={data.adjustedQx.toFixed(6)}
                        hint="Барлық факторлар ескерілген соңғы өлім ықтималдығы"
                      />
                      <Row
                        label="Аннуитет коэффициенті (ä)"
                        value={data.annuityFactor.toFixed(4)}
                        hint="Болашақ төлемдерді дисконттау факторы (i = 8.5%)"
                      />
                      <Row
                        label="Нетто сыйлықақы"
                        value={`${fmtMoney(data.netPremium)} ₸`}
                        hint="Таза актуарлық шығын (жүктемесіз)"
                      />
                      <Row
                        label="Жүктеме коэффициенті"
                        value={`${data.loadingFactor * 100}%`}
                        hint="Шығындар, пайда, резервтер (ҚР нарығы үшін типтік)"
                      />
                      <Row
                        label="Брутто сыйлықақы"
                        value={`${fmtMoney(data.annualPremium)} ₸`}
                        hint="Нетто / (1 − жүктеме) — клиент төлейтін сома"
                      />
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 rounded-xl bg-slate-50 p-4 font-mono text-xs text-slate-600">
                  <div>P_net = Сома × qx_реттелген ÷ ä</div>
                  <div>P_gross = P_net ÷ (1 − 0.30)</div>
                  <div>P_month = P_gross ÷ 12</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 glass-card p-6 md:p-8">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <h3 className="text-base font-semibold text-slate-900">&ldquo;Не болар еді&rdquo; сценариі</h3>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Өмір салтыңызды өзгертсеңіз, сыйлықақы қалай өзгереді — тікелей есептеу.
        </p>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 cursor-pointer hover:border-blue-300 transition-colors">
            <input
              type="checkbox"
              className="h-4 w-4 accent-blue-600"
              checked={wi.quitSmoking}
              onChange={(e) => setWi((w) => ({ ...w, quitSmoking: e.target.checked }))}
              disabled={!form.smoker}
            />
            <div>
              <div className="text-sm font-medium text-slate-700">Темекіні тастасам</div>
              <div className="text-xs text-slate-500">
                {form.smoker ? "Қазір темекі шегесіз" : "Сіз шекпейсіз"}
              </div>
            </div>
          </label>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between text-sm font-medium text-slate-700">
              Арықтасам
              <span className="font-mono text-emerald-600">−{wi.loseWeightKg} кг</span>
            </div>
            <input
              type="range"
              min={0}
              max={20}
              value={wi.loseWeightKg}
              onChange={(e) => setWi((w) => ({ ...w, loseWeightKg: Number(e.target.value) }))}
              className="slider-blue mt-3"
              style={{ ["--val" as string]: `${(wi.loseWeightKg / 20) * 100}%` }}
            />
            {wi.loseWeightKg > 0 && (
              <div className="mt-2 text-xs text-slate-500">
                Жаңа ИМТ: {calcBmi(form.heightCm, form.weightKg - wi.loseWeightKg).toFixed(1)} (×
                {bmiMultiplier(
                  calcBmi(form.heightCm, form.weightKg - wi.loseWeightKg),
                ).toFixed(2)}
                )
              </div>
            )}
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 cursor-pointer hover:border-blue-300 transition-colors">
            <input
              type="checkbox"
              className="h-4 w-4 accent-blue-600"
              checked={wi.changeJob}
              onChange={(e) => setWi((w) => ({ ...w, changeJob: e.target.checked }))}
              disabled={form.jobCategory === "office"}
            />
            <div>
              <div className="text-sm font-medium text-slate-700">Офиске ауысам</div>
              <div className="text-xs text-slate-500">
                {form.jobCategory === "office" ? "Сіз қазір офисте" : "Қауіпсіз жұмысқа ауысу"}
              </div>
            </div>
          </label>
        </div>

        {whatIf && (
          <div className="mt-6 flex items-center justify-between rounded-xl bg-emerald-50/60 p-4 border border-emerald-100">
            <div>
              <div className="text-xs text-emerald-700 font-medium">Жаңа сыйлықақы</div>
              <div className="font-mono text-2xl font-bold text-slate-900">
                {fmtMoney(whatIf.annualPremium)} ₸
                <span className="text-sm text-slate-500 font-sans font-normal"> / жыл</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {delta === 0 ? (
                <div className="flex items-center gap-1 text-slate-500 text-sm">
                  <Minus className="h-4 w-4" /> өзгеріссіз
                </div>
              ) : delta < 0 ? (
                <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <TrendingDown className="h-4 w-4" />
                  <span className="font-mono">−{fmtMoney(Math.abs(delta))} ₸</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-600 font-semibold">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-mono">+{fmtMoney(delta)} ₸</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">Ұсынылатын компаниялар</h3>
          <span className="text-xs text-slate-500">3 серіктес</span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {data.recommendations.map((r) => (
            <div
              key={r.company}
              className="glass-card-hover p-5 flex flex-col"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold"
                style={{ background: r.brandColor }}
              >
                {r.company.charAt(0)}
              </div>
              <div className="mt-3">
                <div className="text-base font-semibold text-slate-900">{r.company}</div>
                <div className="text-xs text-slate-500">{r.tagline}</div>
              </div>
              <div className="mt-4 flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < Math.round(r.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200"
                    }`}
                  />
                ))}
                <span className="ml-1 text-xs font-mono text-slate-500">{r.rating}</span>
              </div>
              <div className="mt-4">
                <div className="text-[11px] uppercase tracking-wider text-slate-400">Айына</div>
                <div className="font-mono text-2xl font-bold text-slate-900">
                  {fmtMoney(r.monthlyPrice)} ₸
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                <Check className="inline h-3.5 w-3.5 text-blue-600 mr-1" />
                {r.coverageHighlight}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                <Check className="inline h-3.5 w-3.5 text-blue-600 mr-1" />
                Төлем мерзімі: {r.payoutMonths} ай
              </p>
              <button
                type="button"
                className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-blue-600 hover:text-blue-600 transition-all"
              >
                Өтінім жіберу
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-8 text-xs text-slate-500 leading-relaxed">
        <span className="font-semibold text-slate-600">Ескерту:</span> Бұл есептеу
        LifeGuard KZ актуарлық моделі арқылы жасалған жалпылама бағалау.
        Нақты сыйлықақы сақтандыру компаниясында медициналық тексерістен кейін
        анықталады. Платформа ҚР Азаматтық кодексінің 40-тарауына және
        Сақтандыру қызметі туралы №126-II Заңына сәйкес ақпараттық құрал
        ретінде қызмет етеді.
      </p>
    </div>
  );
}

function Row({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <tr>
      <td className="py-2 text-slate-600">{label}</td>
      <td className="py-2 text-right font-mono font-semibold text-slate-900">{value}</td>
      <td className="py-2 pl-6 text-xs text-slate-500">{hint}</td>
    </tr>
  );
}
