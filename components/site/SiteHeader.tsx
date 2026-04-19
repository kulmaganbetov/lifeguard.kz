"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogIn, LogOut, Menu, Shield, X } from "lucide-react";

const navItems = [
  { href: "/", label: "Басты бет" },
  { href: "/calculator", label: "Калькулятор" },
  { href: "/consultant", label: "AI-кеңесші" },
  { href: "/dashboard", label: "Талдау" },
  { href: "/about", label: "Жоба туралы" },
];

interface SessionUser {
  username: string;
  displayName: string;
}

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { user: SessionUser | null }) => {
        if (active) setUser(d.user);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [pathname]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const initials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((s) => s[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-slate-200/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="LifeGuard KZ басты бет">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
            <Shield className="h-5 w-5 fill-white" />
          </div>
          <span className="text-lg font-display font-semibold text-slate-900">
            LifeGuard <span className="text-blue-600">KZ</span>
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
          {user ? (
            <div className="hidden md:block relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 hover:border-slate-300 transition-colors"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg gradient-brand-animated text-xs font-semibold text-white">
                  {initials}
                </span>
                <span className="font-medium">{user.username}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg animate-fade-in"
                >
                  <div className="px-3 py-2 border-b border-slate-100">
                    <div className="text-xs text-slate-400">Аккаунт</div>
                    <div className="text-sm font-medium text-slate-900 truncate">
                      {user.displayName}
                    </div>
                    <div className="text-xs font-mono text-slate-500">{user.username}</div>
                  </div>
                  <button
                    type="button"
                    onClick={logout}
                    className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    role="menuitem"
                  >
                    <LogOut className="h-4 w-4 text-slate-500" />
                    Шығу
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden md:inline-flex items-center gap-1.5 text-slate-600 hover:text-blue-600 text-sm font-medium px-3 py-2"
            >
              <LogIn className="h-4 w-4" />
              Кіру
            </Link>
          )}
          <Link
            href={user ? "/calculator" : "/login?next=/calculator"}
            className="hidden md:inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-sm font-medium transition-all active:scale-95 shadow-sm"
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
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={user ? "/calculator" : "/login?next=/calculator"}
              onClick={() => setOpen(false)}
              className="mt-2 rounded-xl bg-blue-600 px-3 py-2.5 text-center text-sm font-medium text-white"
            >
              Тегін есептеу
            </Link>
            {user ? (
              <div className="mt-3 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2 px-3 py-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg gradient-brand-animated text-xs font-semibold text-white">
                    {initials}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900 truncate">
                      {user.displayName}
                    </div>
                    <div className="text-xs font-mono text-slate-500">{user.username}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    void logout();
                  }}
                  className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <LogOut className="h-4 w-4 text-slate-500" />
                  Шығу
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700"
              >
                <LogIn className="h-4 w-4" />
                Кіру
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
