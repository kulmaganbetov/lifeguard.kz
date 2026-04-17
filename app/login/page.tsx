"use client";

import { AlertCircle, Eye, EyeOff, Loader2, Lock, LogIn, Shield, User } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

const DEMO_ACCOUNTS = [
  { login: "client1", password: "123456" },
  { login: "client2", password: "123456" },
  { login: "client3", password: "123456" },
  { login: "client4", password: "123456" },
  { login: "client5", password: "123456" },
  { login: "admin", password: "admin123" },
];

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const nextUrl = params.get("next") ?? "/calculator";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError((err as { error?: string }).error ?? "Кіру мүмкін болмады");
        setLoading(false);
        return;
      }
      router.push(nextUrl);
      router.refresh();
    } catch {
      setError("Желі қатесі. Қайталап көріңіз.");
      setLoading(false);
    }
  };

  const quickFill = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setError(null);
  };

  return (
    <div className="grid w-full gap-8 md:grid-cols-2 md:gap-12">
      <div className="hidden md:flex flex-col justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-brand-animated text-white shadow-glow">
          <Shield className="h-6 w-6 fill-white" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold text-slate-900 leading-tight">
          LifeGuard KZ-ке <span className="gradient-text">қош келдіңіз</span>
        </h1>
        <p className="mt-3 text-slate-600 leading-relaxed">
          Жеке кабинетке кіру арқылы калькулятор, AI-кеңесші және талдау
          панеліне қол жеткізесіз.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
            Демо аккаунттар
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((a) => (
              <button
                key={a.login}
                type="button"
                onClick={() => quickFill(a.login, a.password)}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
              >
                <span className="font-semibold">{a.login}</span>
                <span className="text-slate-400">{a.password}</span>
              </button>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-slate-500 leading-relaxed">
            Картаны басу арқылы өрістер автоматты толтырылады. MVP нұсқасында
            аккаунттар демо мақсатында көрсетілген.
          </p>
        </div>
      </div>

      <div>
        <div className="glass-card p-7 md:p-8">
          <div className="md:hidden mb-6 flex h-12 w-12 items-center justify-center rounded-2xl gradient-brand-animated text-white shadow-glow">
            <Shield className="h-6 w-6 fill-white" />
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-900">Жүйеге кіру</h2>
          <p className="mt-1 text-sm text-slate-500">
            Логин мен құпиясөзіңізді енгізіңіз
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="username" className="text-sm font-medium text-slate-700">
                Логин
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="client1"
                  className="input-field pl-10 font-mono"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Құпиясөз
              </label>
              <div className="relative mt-1.5">
                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="input-field pl-10 pr-10 font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "Құпиясөзді жасыру" : "Құпиясөзді көрсету"}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-red-700"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Тексерілуде...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Кіру
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Аккаунтыңыз жоқ па?{" "}
            <Link href="/about" className="text-emerald-600 hover:underline">
              Жоба туралы
            </Link>
          </div>
        </div>

        <div className="md:hidden mt-5 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
            Демо аккаунттар
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map((a) => (
              <button
                key={a.login}
                type="button"
                onClick={() => quickFill(a.login, a.password)}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
              >
                <span className="font-semibold">{a.login}</span>
                <span className="text-slate-400">{a.password}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-5xl items-center justify-center px-4 py-10 md:px-6">
      <Suspense
        fallback={
          <div className="flex items-center gap-2 text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Жүктелуде...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
