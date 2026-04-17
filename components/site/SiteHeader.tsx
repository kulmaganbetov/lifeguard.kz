"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Shield, X } from "lucide-react";

const navItems = [
  { href: "/", label: "Басты бет" },
  { href: "/calculator", label: "Калькулятор" },
  { href: "/consultant", label: "AI-кеңесші" },
  { href: "/dashboard", label: "Талдау" },
  { href: "/about", label: "Жоба туралы" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-slate-200/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="LifeGuard KZ басты бет">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
            <Shield className="h-5 w-5 fill-white" />
          </div>
          <span className="text-lg font-display font-semibold text-slate-900">
            LifeGuard <span className="text-emerald-600">KZ</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${isActive(item.href) ? "nav-link-active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/calculator"
            className="hidden md:inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 py-2 text-sm font-medium transition-all active:scale-95 shadow-sm"
          >
            Тегін есептеу
          </Link>
          <button
            type="button"
            aria-label={open ? "Мәзірді жабу" : "Мәзірді ашу"}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/calculator"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-center text-sm font-medium text-white"
            >
              Тегін есептеу
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
