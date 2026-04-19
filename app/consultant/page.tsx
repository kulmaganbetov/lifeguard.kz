"use client";

import {
  Bot,
  Calculator,
  Check,
  Copy,
  FileText,
  Heart,
  Menu,
  MessageSquarePlus,
  Scale,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

const sidebarTopics = [
  "Сақтандыру сомасын қалай таңдаймын?",
  "ҚР заңнамасы бойынша талаптар",
  "ИМТ және сыйлықақы қатынасы",
  "Темекі шегу тәуекелі",
  "Жас және тариф арасындағы байланыс",
  "Актуарлық есептеу қалай жұмыс істейді?",
];

const suggestions = [
  {
    icon: Calculator,
    title: "Актуарлық есептеу",
    preview: "Гомперц заңы қалай жұмыс істейді?",
    tint: "bg-blue-50 text-blue-600 border-blue-100",
    prompt: "Гомперц заңы арқылы өлім ықтималдығы қалай есептелетінін нақты мысалмен түсіндіріңіз.",
  },
  {
    icon: Scale,
    title: "ҚР заңнамасы",
    preview: "№126-II Заңы не қамтиды?",
    tint: "bg-cyan-50 text-cyan-600 border-cyan-100",
    prompt: "ҚР Сақтандыру қызметі туралы №126-II Заңы бойынша негізгі тараптардың құқықтары қандай?",
  },
  {
    icon: FileText,
    title: "Салық жеңілдігі",
    preview: "Салық кодексі 341-бап",
    tint: "bg-violet-50 text-violet-600 border-violet-100",
    prompt: "ҚР Салық кодексі 341-бабы бойынша өмірді сақтандырудан қанша салық шегерімін алуға болады?",
  },
  {
    icon: Heart,
    title: "Денсаулық факторлары",
    preview: "ИМТ тарифке қалай әсер етеді?",
    tint: "bg-rose-50 text-rose-600 border-rose-100",
    prompt: "ИМТ көрсеткіші сақтандыру сыйлықақысына қалай әсер етеді? Кестемен көрсетіңіз.",
  },
  {
    icon: Sparkles,
    title: "Оптималды сома",
    preview: "Қанша сомаға сақтандыру керек?",
    tint: "bg-amber-50 text-amber-600 border-amber-100",
    prompt: "Отбасы үшін оптималды сақтандыру сомасын қалай дұрыс есептеуге болады?",
  },
  {
    icon: Bot,
    title: "Компанияларды салыстыру",
    preview: "Jusan vs Nomad vs Freedom",
    tint: "bg-indigo-50 text-indigo-600 border-indigo-100",
    prompt: "Jusan Life, Nomad Life және Freedom Life компанияларының өмірді сақтандыру өнімдерін салыстырыңыз.",
  },
];

function Avatar({ role, size = 32 }: { role: "user" | "assistant"; size?: number }) {
  if (role === "user") {
    return (
      <div
        className="flex shrink-0 items-center justify-center rounded-xl bg-slate-800 text-white"
        style={{ width: size, height: size }}
      >
        <User style={{ width: size * 0.5, height: size * 0.5 }} />
      </div>
    );
  }
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-xl gradient-brand-animated text-white shadow-sm"
      style={{ width: size, height: size }}
    >
      <Bot style={{ width: size * 0.5, height: size * 0.5 }} />
    </div>
  );
}

function TypingIndicator() {
  return (
    <span className="inline-flex items-end h-5">
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
    </span>
  );
}

export default function ConsultantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sessionStart] = useState(() => new Date());

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(160, el.scrollHeight) + "px";
  }, [input]);

  const sessionTime = useMemo(
    () =>
      sessionStart.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    [sessionStart],
  );

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      role: "user",
      content: trimmed,
      createdAt: Date.now(),
    };
    const aiId = `a_${Date.now() + 1}`;
    const aiMsg: Message = {
      id: aiId,
      role: "assistant",
      content: "",
      createdAt: Date.now() + 1,
    };

    const next = [...messages, userMsg, aiMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next
            .filter((m) => m.id !== aiId)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.body) throw new Error("No stream");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === aiId ? { ...m, content: acc } : m)),
        );
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Қате";
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiId
            ? { ...m, content: `> AI жауабын алу мүмкін болмады: ${msg}` }
            : m,
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => setMessages([]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const copyMessage = async (m: Message) => {
    try {
      await navigator.clipboard.writeText(m.content);
      setCopiedId(m.id);
      setTimeout(() => setCopiedId(null), 1400);
    } catch {
      // ignore
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:py-8 md:px-6">
      <div className="grid h-[calc(100vh-9rem)] min-h-[640px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:grid-cols-[288px_1fr]">
        <aside
          className={`${
            sidebarOpen ? "block" : "hidden md:block"
          } border-r border-slate-200 bg-slate-50/50 overflow-y-auto scrollbar-thin`}
        >
          <div className="p-5">
            <div className="flex items-center gap-3">
              <Avatar role="assistant" size={44} />
              <div>
                <div className="text-sm font-semibold text-slate-900">LifeGuard AI</div>
                <div className="text-xs text-slate-500">Сақтандыру кеңесшісі</div>
              </div>
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              <span className="pulse-dot" />
              Онлайн
            </div>
          </div>

          <div className="border-t border-slate-200 p-5">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Жиі сұрақтар
            </div>
            <div className="mt-3 space-y-1.5">
              {sidebarTopics.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setInput(t);
                    setSidebarOpen(false);
                  }}
                  className="block w-full rounded-lg px-3 py-2 text-left text-xs text-slate-600 hover:bg-white hover:text-blue-600 transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-200 p-5">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Сессия ақпараты
            </div>
            <div className="mt-3 text-xs text-slate-500">
              Сөйлесу басталды: <span className="font-mono text-slate-700">{sessionTime}</span>
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Хабарлама саны:{" "}
              <span className="font-mono text-slate-700">{messages.length}</span>
            </div>
            <button
              type="button"
              onClick={resetChat}
              className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:border-slate-300 transition-colors"
            >
              <MessageSquarePlus className="h-3.5 w-3.5" />
              Жаңа сөйлесу
            </button>
          </div>
        </aside>

        <section className="flex flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 md:px-5">
            <div className="flex items-center gap-3 md:hidden">
              <button
                type="button"
                aria-label="Бүйірлік панель"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600"
                onClick={() => setSidebarOpen((v) => !v)}
              >
                {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
              <Avatar role="assistant" size={32} />
              <div>
                <div className="text-sm font-semibold text-slate-900">LifeGuard AI</div>
                <div className="inline-flex items-center gap-1.5 text-[10px] text-emerald-600">
                  <span className="pulse-dot" />
                  Онлайн
                </div>
              </div>
            </div>
            <div className="hidden md:block text-xs text-slate-500">
              Сессия: <span className="font-mono text-slate-700">{sessionTime}</span>
            </div>
            <div className="text-xs text-slate-400 hidden md:block">GPT-4o mini • Қазақ тілі</div>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6 md:px-8 bg-slate-50/50"
          >
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center animate-fade-in">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl gradient-brand-animated text-white shadow-glow">
                  <Bot className="h-10 w-10" />
                </div>
                <h2 className="mt-5 text-2xl font-semibold text-slate-900 font-display">
                  Сәлеметсіз бе! 👋 Мен LifeGuard AI
                </h2>
                <p className="mt-2 max-w-md text-center text-sm text-slate-600">
                  Сақтандыру, тәуекелді бағалау және ҚР заңнамасы бойынша кеңес беремін.
                  Төмендегі ұсыныстарды қолданыңыз немесе өз сұрағыңызды жазыңыз.
                </p>
                <div className="mt-8 grid w-full max-w-2xl gap-3 md:grid-cols-2">
                  {suggestions.map((s) => {
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.title}
                        type="button"
                        onClick={() => send(s.prompt)}
                        className={`rounded-xl border bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${s.tint.split(" ")[2]}`}
                      >
                        <div className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${s.tint}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="mt-2 text-sm font-semibold text-slate-900">
                          {s.title}
                        </div>
                        <div className="mt-0.5 text-xs text-slate-500">{s.preview}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="mx-auto flex max-w-3xl flex-col gap-5">
                {messages.map((m) => {
                  const isUser = m.role === "user";
                  return (
                    <div
                      key={m.id}
                      className={`group flex gap-3 animate-slide-up ${isUser ? "flex-row-reverse" : ""}`}
                    >
                      <Avatar role={m.role} />
                      <div className={`flex-1 max-w-[calc(100%-3rem)] ${isUser ? "text-right" : ""}`}>
                        <div
                          className={`inline-block text-left rounded-2xl px-4 py-3 ${
                            isUser
                              ? "bg-blue-600 text-white rounded-tr-sm"
                              : "bg-white border border-slate-200 text-slate-900 rounded-tl-sm"
                          }`}
                        >
                          {isUser ? (
                            <div className="whitespace-pre-wrap text-sm">{m.content}</div>
                          ) : m.content ? (
                            <MarkdownRenderer content={m.content} />
                          ) : (
                            <TypingIndicator />
                          )}
                        </div>
                        <div className={`mt-1 flex items-center gap-2 text-[10px] text-slate-400 ${isUser ? "justify-end" : ""}`}>
                          <span>
                            {new Date(m.createdAt).toLocaleTimeString("ru-RU", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {!isUser && m.content && (
                            <button
                              type="button"
                              onClick={() => copyMessage(m)}
                              className="inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-blue-600"
                              aria-label="Көшіру"
                            >
                              {copiedId === m.id ? (
                                <>
                                  <Check className="h-3 w-3" />
                                  Көшірілді
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" />
                                  Көшіру
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 bg-white p-4 md:px-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="mx-auto flex max-w-3xl items-end gap-2"
            >
              <div className="flex-1 rounded-2xl border border-slate-200 bg-white focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  rows={1}
                  placeholder="Сақтандыру туралы сұрақ қойыңыз..."
                  className="w-full resize-none rounded-2xl bg-transparent px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none scrollbar-thin max-h-40"
                  disabled={loading}
                  aria-label="Сұрақ енгізу өрісі"
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Жіберу"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 gradient-brand-animated shadow-glow"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
            <div className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-slate-400">
              LifeGuard AI кеңестері анықтамалық сипатта. Заңды кеңес үшін маманға жүгініңіз.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
