import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Check,
  FileCheck,
  ScrollText,
  Shield,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import CountUp from "@/components/ui/CountUp";
import GaugeChart from "@/components/ui/GaugeChart";

const features = [
  {
    title: "AI Тәуекел талдауы",
    description:
      "Гомперц заңы, ҚР өлім кестесі және GPT-4o mini негізіндегі жасырын тәуекелдерді табатын интеллектуалды модель.",
    icon: Brain,
    tint: "bg-blue-50 text-blue-600",
  },
  {
    title: "ҚР Заңнамасы",
    description:
      "Сақтандыру қызметі туралы №126-II Заңы, МӘМС нормалары және Салық кодексі 341-бабы толық ескерілген.",
    icon: ScrollText,
    tint: "bg-cyan-50 text-cyan-600",
  },
  {
    title: "Жеке ұсыныстар",
    description:
      "Jusan Life, Nomad Life, Freedom Life — 3 серіктес компанияның жылдам салыстырылған ұсыныстарын бір жерден көру.",
    icon: FileCheck,
    tint: "bg-violet-50 text-violet-600",
  },
];

const steps = [
  {
    n: 1,
    title: "Деректерді енгізу",
    desc: "4 қысқа қадамда жас, денсаулық, өмір салты мен сақтандыру сомасы туралы ақпаратты енгізіңіз.",
  },
  {
    n: 2,
    title: "AI тәуекелді есептейді",
    desc: "Актуарлық модель Гомперц заңы арқылы сіздің жеке тәуекеліңізді 0–100 шкаласында бағалайды.",
  },
  {
    n: 3,
    title: "Ұсыныстарды алыңыз",
    desc: "3 сақтандыру компаниясынан жылдық/айлық сыйлықақыны, PDF есебін және AI-кеңесшіні пайдаланыңыз.",
  },
];

const testimonials = [
  {
    name: "Айжан Нұрғалиева",
    role: "Алматы, IT-маман",
    quote:
      "Ипотекаға сақтандыру іздеп жүр едім. LifeGuard 5 минутта актуарлық тәуекелімді көрсетіп, 3 компанияның бағасын салыстырды. Nomad Life-пен келісімшар жасадым.",
  },
  {
    name: "Данияр Тоқтасынұлы",
    role: "Астана, кәсіпкер",
    quote:
      "AI-кеңесші салық шегерімі бойынша 341-бапты толық түсіндіріп берді. Жылына ~32 мың ₸ үнемдеймін.",
  },
  {
    name: "Мадина Серікқызы",
    role: "Шымкент, дәрігер",
    quote:
      "Пациенттерге кеңес беру үшін платформаны қолданам. Актуарлық мәліметтер ашық түрде көрсетіледі — бұл өте маңызды.",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="relative flex min-h-[88vh] items-center py-16 md:py-24">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 text-center md:px-6">
          <div className="premium-badge animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            ҚР №126-II Заңына сәйкес • 2024
          </div>

          <h1 className="mt-6 max-w-4xl font-display text-[40px] font-bold leading-[1.05] text-slate-900 md:text-[64px] animate-slide-up">
            Өміріңізді сақтандырыңыз —<br />
            <span className="gradient-text">AI-мен</span>
          </h1>

          <p className="mt-5 max-w-xl text-base text-slate-600 md:text-lg animate-slide-up" style={{ animationDelay: "80ms" }}>
            Қазақстандағы алғашқы AI-негізіндегі өмірді сақтандыру платформасы.
            Актуарлық есептеу, ҚР заңнамасы және жеке ұсыныстар — 5 минутта.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row animate-slide-up" style={{ animationDelay: "160ms" }}>
            <Link href="/calculator" className="btn-primary text-base">
              Тегін есептеу
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/consultant" className="btn-secondary text-base">
              <Sparkles className="h-4 w-4 text-blue-600" />
              AI-кеңесші
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 animate-fade-in" style={{ animationDelay: "240ms" }}>
            <span className="chip">
              <Shield className="h-3.5 w-3.5 text-blue-600" />
              ҚР заңнамасы
            </span>
            <span className="chip">
              <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
              AI технологиясы
            </span>
            <span className="chip">
              <Check className="h-3.5 w-3.5 text-blue-600" />
              Тегін
            </span>
          </div>

          <div className="relative mt-12 flex items-center justify-center animate-float">
            <div className="absolute h-56 w-56 rounded-full bg-blue-400/10 blur-2xl" />
            <div className="relative">
              <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-pulse-ring" />
              <GaugeChart value={42} size={280} label="Демо: Орташа тәуекел" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="premium-badge bg-white text-blue-700" style={{ background: "#DBEAFE", boxShadow: "none" }}>
            Негізгі мүмкіндіктер
          </div>
          <h2 className="section-heading mt-4">
            Сақтандыру үшін барлық керекті құралдар
          </h2>
          <p className="mt-3 text-slate-600">
            Бір платформада актуарлық есептеу, AI кеңес және нарықтың ең жақсы
            ұсыныстары.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="glass-card-hover p-6 group">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${f.tint}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.description}</p>
                <Link
                  href="/about"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Толығырақ
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white/60">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-12 md:grid-cols-4 md:px-6">
          {[
            { value: 50000, suffix: "+", label: "есептеу" },
            { value: 14, suffix: "", label: "аймақ қамтылған" },
            { value: 98.7, suffix: "%", label: "дәлдік", decimals: 1 },
            { value: 4, suffix: "", label: "серіктес компания" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-mono text-3xl font-bold text-slate-900 md:text-4xl">
                <CountUp
                  end={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.decimals ?? 0}
                />
              </div>
              <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="section-heading">Қалай жұмыс істейді</h2>
          <p className="mt-3 text-slate-600">3 қарапайым қадамда жеке сақтандыру ұсынысын алыңыз.</p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6 relative">
          <div className="hidden md:block absolute top-6 left-[17%] right-[17%] h-px border-t-2 border-dashed border-slate-200" />
          {steps.map((s) => (
            <div key={s.n} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl gradient-brand text-white font-display font-bold text-lg shadow-glow">
                {s.n}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-2 max-w-xs text-sm text-slate-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-1 text-blue-600 text-sm">
            <Users className="h-4 w-4" />
            Клиенттерден пікірлер
          </div>
          <h2 className="section-heading mt-2">
            Қазақстан бойынша мыңдаған қолданушы
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="glass-card p-6">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-3 text-sm text-slate-700 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-brand-animated text-sm font-semibold text-white">
                  {t.name.split(" ").map((s) => s[0]).join("")}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-6">
        <div className="relative overflow-hidden rounded-3xl gradient-brand-animated p-10 md:p-14 shadow-glow">
          <div className="relative z-10 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl text-white">
              <h2 className="font-display text-3xl font-bold md:text-4xl">
                Қазір бастау — 5 минут
              </h2>
              <p className="mt-3 text-white/90">
                Тегін тәуекел талдауы, 3 компанияның жылдық сыйлықақысы және
                PDF есебі.
              </p>
            </div>
            <Link
              href="/calculator"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-medium text-blue-700 transition-all hover:bg-blue-50 active:scale-95 shadow-sm"
            >
              Қазір бастау
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        </div>
      </section>
    </div>
  );
}
