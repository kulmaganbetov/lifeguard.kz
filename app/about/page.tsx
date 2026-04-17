"use client";

import {
  BookOpen,
  Brain,
  ChevronDown,
  FileCheck,
  Landmark,
  Scale,
  Shield,
  Target,
} from "lucide-react";
import { useState } from "react";
import CountUp from "@/components/ui/CountUp";

const faq = [
  {
    q: "LifeGuard KZ есептеулері қаншалықты дәл?",
    a: "Біздің модель ҚР Бюро нацстатистики деректері, ДДСҰ статистикасы және Гомперц-Мейкхам заңы негізінде құрылған. Дәлдік ~98.7% (жалпы бағалау үшін). Ресми сыйлықақы сақтандыру компаниясының андеррайтинг тобы медициналық тексерістен кейін анықтайды.",
  },
  {
    q: "Деректерім қауіпсіз сақталады ма?",
    a: "Платформа MVP нұсқасында жеке деректер шифрланбай уақытша сақталады. Коммерциялық нұсқада деректер ҚР \"Жеке деректер және оларды қорғау туралы\" Заңына (№94-V) сәйкес шифрланады. Біз медициналық ақпаратты үшінші тараптарға тапсырмаймыз.",
  },
  {
    q: "Неге қорытынды сома сақтандыру компаниясының ұсынысынан ерекшеленеді?",
    a: "Біздің модель жалпы актуарлық есептеу жүргізеді. Нақты компания өз андеррайтинг ережелерін, медициналық тексерістерді, кірістерді тексеруді және ішкі коэффициенттерін қолданады. Сондықтан ±15% айырмашылық болуы қалыпты.",
  },
  {
    q: "AI-кеңесшіні қолдану тегін бе?",
    a: "Иә, GPT-4o mini негізіндегі AI-кеңесші толық тегін. Платформа ашық деректерді қолданады және жарнамалық қызметтен кіріс алмайды.",
  },
  {
    q: "Қандай сақтандыру компанияларымен жұмыс істейсіздер?",
    a: "Қазіргі уақытта демо режимінде 3 негізгі компания көрсетіледі: Jusan Life, Nomad Life, Freedom Life. Коммерциялық нұсқада Halyk Life, Kompetenz, Eurasia Life және басқалар қосылады.",
  },
];

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 md:px-6">
      <section className="text-center mb-16">
        <div className="premium-badge inline-flex">Біздің миссия</div>
        <h1 className="mt-5 font-display text-4xl md:text-5xl font-bold leading-tight text-slate-900">
          Өмірді сақтандыруды{" "}
          <span className="gradient-text">ашық және түсінікті</span> ету
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-slate-600 leading-relaxed">
          LifeGuard KZ — Қазақстанда тұрғындардың өмірді сақтандыру туралы
          шешімді фактыларға негіздеп қабылдауына көмектесетін тәуелсіз
          платформа. Актуарлық математика, ашық деректер және қазіргі AI
          технологияларын біріктіреміз.
        </p>
        <div className="mt-10 grid grid-cols-3 gap-4 md:gap-8">
          {[
            { v: 50000, s: "+", l: "есептеу жасалды" },
            { v: 17, s: "", l: "аймақ қамтылған" },
            { v: 2024, s: "", l: "жылы іске қосылды" },
          ].map((x, i) => (
            <div key={i} className="glass-card p-5">
              <div className="font-mono text-2xl md:text-3xl font-bold text-slate-900">
                <CountUp end={x.v} suffix={x.s} />
              </div>
              <div className="mt-1 text-xs text-slate-500">{x.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <SectionTitle icon={Brain} title="Актуарлық әдіснама" badge="Математика" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="glass-card p-6">
            <div className="text-sm font-semibold text-slate-900">
              1. Өлім кестесі (Mortality table)
            </div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Жас пен жынысқа негізделген өлім ықтималдығы qx. Базалық
              мәндер ҚР Бюро нацстатистики деректері мен ДДСҰ өмір сүру
              үстемелерінен алынған.
            </p>
            <pre className="mt-3 rounded-lg bg-slate-900 p-3 font-mono text-xs text-emerald-400 overflow-x-auto">
{`qx(30, male)   = 0.00241
qx(30, female) = 0.00089
qx(50, male)   = 0.01089`}
            </pre>
          </div>
          <div className="glass-card p-6">
            <div className="text-sm font-semibold text-slate-900">
              2. Гомперц-Мейкхам заңы
            </div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Жасқа байланысты өлім қарқынының экспоненциалды өсуі. Мерзім
              ішіндегі кумулятивті тірі қалу ықтималдығын есептеуге мүмкіндік
              береді.
            </p>
            <pre className="mt-3 rounded-lg bg-slate-900 p-3 font-mono text-xs text-emerald-400 overflow-x-auto">
{`μ(x) = α × e^(β·x)

α = 0.00005
β_male   = 0.085
β_female = 0.075

S(x,t) = exp( -α/β × (e^(β(x+t)) − e^(βx)) )`}
            </pre>
          </div>
          <div className="glass-card p-6">
            <div className="text-sm font-semibold text-slate-900">
              3. Актуарлық ағымдағы құн
            </div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Аннуитет-due факторы: болашақ төлемдерді ҚР Ұлттық банкінің
              базалық мөлшерлемесімен (i = 8.5%) дисконттайды.
            </p>
            <pre className="mt-3 rounded-lg bg-slate-900 p-3 font-mono text-xs text-emerald-400 overflow-x-auto">
{`v = 1 / (1 + i)
ä = Σ_{t=0}^{n-1}  v^t · S(x,t)

P_net   = Сома · qx_реттелген / ä
P_gross = P_net / (1 − 0.30)`}
            </pre>
          </div>
          <div className="glass-card p-6">
            <div className="text-sm font-semibold text-slate-900">
              4. Тәуекел мультипликаторлары
            </div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Темекі, ИМТ, белсенділік, созылмалы аурулар, аймақ және жұмыс
              категориясы қарсы мультипликативті түрде қосылады. Соңғы қадамда
              qx = 0.95-пен шектеледі.
            </p>
            <div className="mt-3 space-y-1 text-xs">
              <FactorRow label="Темекі шегу" mult="×1.35" />
              <FactorRow label="Семіздік II+ (ИМТ ≥ 35)" mult="×1.35" />
              <FactorRow label="Жүрек ауруы" mult="×1.35" />
              <FactorRow label="Қатерлі ісік (тарих)" mult="×1.55" />
              <FactorRow label="Белсенді өмір салты" mult="×0.95" pos />
              <FactorRow label="Спортшы" mult="×0.90" pos />
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <SectionTitle icon={BookOpen} title="Деректер көздері" badge="Ашық" />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              t: "Бюро нацстатистики РК",
              d: "Өлім-жітім және өмір сүру күтімі бойынша ресми кестелер. Жыл сайын жаңартылады.",
            },
            {
              t: "ДДСҰ (WHO)",
              d: "Халықаралық өлім-жітім коэффициенттері және аурушаңдық статистикасы.",
            },
            {
              t: "МӘМС",
              d: "ҚР Міндетті әлеуметтік медициналық сақтандыру базасы — созылмалы аурулар таралуы.",
            },
          ].map((x) => (
            <div key={x.t} className="glass-card p-5">
              <div className="text-sm font-semibold text-slate-900">{x.t}</div>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <SectionTitle icon={Target} title="AI анық: не істейді, не істемейді" badge="Ашықтық" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="glass-card p-6 border-emerald-100 bg-emerald-50/30">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
              ✓ Істейді
            </div>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>• ҚР заңнамасы бойынша сұрақтарға жауап береді (№126-II, Азаматтық кодекс 40-тарау)</li>
              <li>• Актуарлық формулаларды түсіндіреді, есептеу мысалдарын береді</li>
              <li>• Тәуекел факторларын бағалайды және ұсыныстар береді</li>
              <li>• Сақтандыру өнімдерінің айырмашылықтарын салыстырады</li>
              <li>• Қазақ тілінде дәл, кәсіби жауаптар береді</li>
            </ul>
          </div>
          <div className="glass-card p-6 border-red-100 bg-red-50/30">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
              ✗ Істемейді
            </div>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>• Медициналық диагноз қоймайды</li>
              <li>• Заңды кеңес тапсырмайды (тек анықтамалық сипатта)</li>
              <li>• Сақтандыру компаниясының ресми тарапы ретінде келісімшар жасамайды</li>
              <li>• Бір нақты компанияны жарнамаламайды</li>
              <li>• Жеке деректерді сақтамайды (сессия аяқталған соң өшеді)</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-16" id="legal">
        <SectionTitle icon={Scale} title="Заңдық сәйкестік" badge="ҚР Заңнамасы" />
        <div className="space-y-3">
          <LegalItem
            icon={<Landmark className="h-4 w-4" />}
            code="ҚР №126-II Заңы"
            title="Сақтандыру қызметі туралы (2003, өзгертулермен)"
            desc="Сақтандыру нарығын реттейтін негізгі заң. Сақтандырушылардың құқықтары, лицензиялау талаптары, тәуекелдерді бағалау принциптері."
          />
          <LegalItem
            icon={<FileCheck className="h-4 w-4" />}
            code="Азаматтық кодекс, 40-тарау"
            title="Сақтандыру (803–845 баптар)"
            desc="Сақтандыру келісімшарының мәні, тараптардың міндеттері, 832-бап — сақтанушының ақпаратты шынайы берудегі міндеті."
          />
          <LegalItem
            icon={<Shield className="h-4 w-4" />}
            code="ҚР №405-V Заңы"
            title="Міндетті әлеуметтік медициналық сақтандыру туралы (МӘМС)"
            desc="Медициналық сақтандыру жүйесі, жарналардың мөлшері, азаматтардың құқықтары."
          />
          <LegalItem
            icon={<FileCheck className="h-4 w-4" />}
            code="ҚР Салық кодексі, 341-бап"
            title="Салықтық шегерімдер"
            desc="Өмірді сақтандыруға төленген сыйлықақылар бойынша жылдық 8 АЕК-ке дейін жеке табыс салығынан шегерім."
          />
        </div>
      </section>

      <section id="privacy" className="mb-16">
        <SectionTitle icon={BookOpen} title="Жиі қойылатын сұрақтар" badge="FAQ" />
        <div className="space-y-2">
          {faq.map((item, i) => {
            const open = openFaq === i;
            return (
              <div key={i} className="glass-card">
                <button
                  type="button"
                  onClick={() => setOpenFaq(open ? null : i)}
                  className="flex w-full items-center justify-between p-5 text-left"
                >
                  <span className="text-sm font-medium text-slate-900">{item.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {open && (
                  <div className="border-t border-slate-100 p-5 pt-4 text-sm text-slate-600 leading-relaxed animate-fade-in">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section id="terms" className="glass-card p-6 md:p-8">
        <h3 className="text-sm font-semibold text-slate-900">Пайдалану шарттары</h3>
        <p className="mt-3 text-xs text-slate-500 leading-relaxed">
          LifeGuard KZ платформасы ақпараттық-анықтамалық сипатта жұмыс істейді
          және ресми сақтандыру ұсынысы болып саналмайды. Платформа ҚР Азаматтық
          кодексінің 40-тарауына және Сақтандыру қызметі туралы №126-II Заңына
          сәйкес, пайдаланушыларға сақтандыру өнімдері туралы ақпарат беру
          мақсатында құрылған. Нақты сақтандыру келісімшарын жасау үшін
          лицензияланған сақтандыру компаниясына жүгіну қажет. Платформа
          қолданушы енгізген деректердің шынайылығына жауап бермейді. AI-кеңесші
          жауаптары жалпылама сипатта және заңды, медициналық немесе қаржылық
          кеңес болып табылмайды.
        </p>
      </section>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  badge,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  badge: string;
}) {
  return (
    <div className="mb-6">
      <div className="inline-flex items-center gap-2 text-emerald-600 text-xs font-semibold uppercase tracking-wider">
        <Icon className="h-3.5 w-3.5" />
        {badge}
      </div>
      <h2 className="mt-2 text-2xl md:text-3xl font-bold text-slate-900 font-display">
        {title}
      </h2>
    </div>
  );
}

function FactorRow({ label, mult, pos = false }: { label: string; mult: string; pos?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-md bg-slate-50 px-2 py-1">
      <span className="text-slate-600">{label}</span>
      <span className={`font-mono font-semibold ${pos ? "text-emerald-600" : "text-red-600"}`}>
        {mult}
      </span>
    </div>
  );
}

function LegalItem({
  icon,
  code,
  title,
  desc,
}: {
  icon: React.ReactNode;
  code: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="glass-card p-5 flex items-start gap-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
        {icon}
      </div>
      <div>
        <div className="text-xs font-mono text-emerald-600">{code}</div>
        <div className="mt-0.5 text-sm font-semibold text-slate-900">{title}</div>
        <p className="mt-1 text-xs text-slate-600 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
