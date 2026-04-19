import Link from "next/link";
import { Linkedin, Send, Shield } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white/60 backdrop-blur">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-3 md:px-6">
        <div>
          <Link href="/" className="flex items-center gap-2" aria-label="LifeGuard KZ">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
              <Shield className="h-5 w-5 fill-white" />
            </div>
            <span className="text-lg font-display font-semibold text-slate-900">
              LifeGuard <span className="text-blue-600">KZ</span>
            </span>
          </Link>
          <p className="mt-3 text-sm text-slate-500 max-w-xs leading-relaxed">
            AI-негізіндегі өмірді сақтандыру тәуекелін бағалау платформасы.
            ҚР заңнамасына сәйкес, нақты актуарлық есептеулер.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-blue-600 hover:border-blue-300 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="https://t.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-blue-600 hover:border-blue-300 transition-colors"
              aria-label="Telegram"
            >
              <Send className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold text-slate-900">Навигация</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/" className="text-slate-600 hover:text-blue-600">Басты бет</Link></li>
            <li><Link href="/calculator" className="text-slate-600 hover:text-blue-600">Тәуекел калькуляторы</Link></li>
            <li><Link href="/consultant" className="text-slate-600 hover:text-blue-600">AI-кеңесші</Link></li>
            <li><Link href="/dashboard" className="text-slate-600 hover:text-blue-600">Талдау панелі</Link></li>
            <li><Link href="/about" className="text-slate-600 hover:text-blue-600">Жоба туралы</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-semibold text-slate-900">Заңды ескерту</div>
          <p className="mt-4 text-sm text-slate-500 leading-relaxed">
            LifeGuard KZ платформасы — ақпараттық құрал. Нәтижелер жалпы
            бағалау сипатында және ресми сақтандыру ұсынысы болып саналмайды.
            Нақты сақтандыру келісімшары үшін лицензияланған сақтандыру
            компаниясына жүгініңіз. Платформа ҚР №126-II Заңына және Азаматтық
            кодекстің 40-тарауына сәйкес жұмыс істейді.
          </p>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-slate-500 md:flex-row md:px-6">
          <div>© 2024 LifeGuard KZ. Барлық құқықтар қорғалған.</div>
          <div className="flex items-center gap-4">
            <Link href="/about#privacy" className="hover:text-blue-600">
              Құпиялылық саясаты
            </Link>
            <Link href="/about#terms" className="hover:text-blue-600">
              Шарттар
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
