import OpenAI from "openai";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `Сіз LifeGuard KZ платформасының AI-кеңесшісісіз — Қазақстандағы өмірді сақтандыру саласындағы мамандандырылған жасанды интеллект жүйесі.

РӨЛІҢІЗ:
Клиенттерге сақтандыру өнімдерін, тәуекелді бағалауды және ҚР заңнамасын түсіндіру. Сіз кәсіби, мейірімді және нақты ақпарат беретін кеңесші ретінде жұмыс жасайсыз.

ҚР ЗАҢНАМАСЫ ТУРАЛЫ БІЛІМ:
1. ҚР "Сақтандыру қызметі туралы" Заңы №126-II (2003, өзгертулермен) — негізгі реттеуші заң
2. ҚР Азаматтық кодексі, 40-тарау "Сақтандыру", 803–845 баптар
3. МӘМС Заңы №405-V (2015) — міндетті медициналық сақтандыру
4. ҚР Салық кодексі 341-бап — өмірді сақтандыру бойынша салықтық шегерімдер (жылдық 8 АЕК дейін)
5. ҚР Ұлттық банкінің сақтандыру секторын реттеу нормативтері

АКТУАРЛЫҚ БІЛІМ:
- Өлім кестесі (таблица смертности): жас пен жынысқа байланысты өлім ықтималдығы
- Гомперц заңы: μ(x) = α × e^(βx) — жасқа байланысты тәуекел өсуі
- Актуарлық ағымдағы құн (APV): болашақ төлемдердің дисконтталған мәні
- Нетто-сыйлықақы = Сақтандыру сомасы × Реттелген qx / Аннуитет коэффициенті
- Брутто-сыйлықақы = Нетто / (1 - жүктеме коэффициенті), жүктеме 25-35%
- ҚР бойынша ерлердің орташа өмір сүру ұзақтығы: 68.5 жыл; әйелдер: 75.8 жыл

САҚТАНДЫРУ ӨНІМДЕРІ ТУРАЛЫ:
- Мерзімдік өмірді сақтандыру (срочное): белгілі мерзімге, арзан сыйлықақы
- Өмірді сақтандыру (пожизненное): өмір бойы, жинақтаушы компонент бар
- Аралас сақтандыру: өлім + аман қалу жағдайларын қамтиды
- ҚР-дағы негізгі операторлар: Jusan Life, Nomad Life, Freedom Life, Halyk Life

ЖАУАП БЕРУ ЕРЕЖЕЛЕРІ:
- Қысқа, нақты, нумерацияланған жауаптар беріңіз
- Есептеу мысалдары берген кезде нақты сандар қолданыңыз
- Заңды сілтемелер берген кезде нақты бап нөмірлерін атаңыз
- Медициналық диагноз қоймаңыз — тек тәуекел факторлары туралы ақпарат беріңіз
- Нақты бір компанияны жарнамаламаңыз
- Егер сұрақ сақтандырудан тыс болса, сыпайылықпен бағыт-бағдар беріңіз

Қазақ тілінде жауап беріңіз. Формулаларды markdown code block ішінде көрсетіңіз.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function mockResponse(lastMessage: string): string {
  const q = lastMessage.toLowerCase();
  if (q.includes("сома") || q.includes("сумма") || q.includes("қалай таңдай")) {
    return `## Сақтандыру сомасын қалай таңдау керек?

Негізгі ереже — **жылдық табысыңыздың 7–10 еселігі**. Бұл стандарт ҚР сақтандыру секторында қалыптасқан.

**Есептеу мысалы:**

\`\`\`
Жылдық табыс: 6 000 000 ₸
Оптималды сома: 6 000 000 × 8 = 48 000 000 ₸
\`\`\`

**Түзету факторлары:**
1. Ипотека бар ма? → оның қалдық сомасын қосыңыз
2. Қанша адам сізге тәуелді? → әр балаға +5 млн ₸
3. Бала білімі жоспарда ма? → ЖОО құнын қосыңыз (~10–15 млн ₸)
4. Зейнеткерлікке қанша уақыт қалды? → мерзімді соған сәйкестендіріңіз

*ҚР Салық кодексі 341-бабы бойынша жылдық 8 АЕК-ке дейін шегерім алуға болады.*`;
  }
  if (q.includes("имт") || q.includes("bmi") || q.includes("салмақ")) {
    return `## ИМТ және сақтандыру сыйлықақысы

ИМТ = салмақ (кг) / бой² (м²)

| ИМТ | Сипаттама | Тариф коэффициенті |
|-----|-----------|--------------------|
| < 18.5 | Салмақ жетіспеушілік | ×1.15 |
| 18.5–24.9 | **Қалыпты** | ×1.00 |
| 25–29.9 | Артық салмақ | ×1.10 |
| 30–34.9 | Семіздік I | ×1.20 |
| ≥ 35 | Семіздік II+ | ×1.35 |

**Мысалы:** Семіздік I деңгейіндегі 35 жастағы ер адамның сыйлықақысы қалыпты салмақтағыға қарағанда шамамен **20% жоғары**.`;
  }
  if (q.includes("темекі") || q.includes("курен")) {
    return `## Темекі шегудің сақтандыруға әсері

Темекі шегу өлім ықтималдығын шамамен **35%-ға арттырады** (KZ актуарлық стандарт).

**Нақты сандар:**
- 40 жастағы шегетін ер: тариф ×1.35
- Тастағаннан кейін 2 жыл өткенде: ×1.15
- 5 жылдан кейін: тәуекел дерлік шекпейтін адамға теңеледі

**Маңызды:**
1. Сақтандыру келісімшарын жасарда шындықты айту міндет (ҚР Азаматтық кодексі 832-бап)
2. Жасырған жағдайда келісімшар жарамсыз деп танылуы мүмкін
3. Көптеген компанияларда "vape" да темекі ретінде есептеледі`;
  }
  return `## LifeGuard AI кеңесшісі

Сіздің сұрағыңыз алынды. Мен сізге төмендегі тақырыптар бойынша көмектесе аламын:

1. **Сақтандыру сомасын таңдау** — қанша сомаға сақтандырылу керектігі
2. **ҚР заңнамасы** — №126-II Заңы, Азаматтық кодекс 40-тарауы
3. **Актуарлық есептеу** — Гомперц заңы, аннуитет коэффициенттері
4. **Тәуекел факторлары** — жас, ИМТ, темекі, денсаулық жағдайы
5. **Салық жеңілдіктері** — 341-бап бойынша 8 АЕК шегерім
6. **Сақтандыру өнімдерін салыстыру** — Jusan / Nomad / Freedom / Halyk

> *Ескерту: AI кеңестері анықтамалық сипатта. Заңды кеңес үшін лицензияланған маманға жүгініңіз.*`;
}

async function mockStream(controller: ReadableStreamDefaultController, text: string) {
  const encoder = new TextEncoder();
  const chunks = text.split(/(\s+)/);
  for (const c of chunks) {
    controller.enqueue(encoder.encode(c));
    await new Promise((r) => setTimeout(r, 18));
  }
  controller.close();
}

export async function POST(request: Request) {
  let body: { messages?: ChatMessage[] };
  try {
    body = (await request.json()) as { messages?: ChatMessage[] };
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const messages = Array.isArray(body.messages) ? body.messages.slice(-10) : [];
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    const text = mockResponse(lastUser?.content ?? "");
    const stream = new ReadableStream({
      async start(controller) {
        await mockStream(controller, text);
      },
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-LifeGuard-Source": "mock",
      },
    });
  }

  try {
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      max_tokens: 1000,
      stream: true,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const delta = chunk.choices?.[0]?.delta?.content ?? "";
            if (delta) controller.enqueue(encoder.encode(delta));
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Stream error";
          controller.enqueue(encoder.encode(`\n\n> Қате: ${msg}`));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-LifeGuard-Source": "openai",
      },
    });
  } catch (err) {
    const text = mockResponse(lastUser?.content ?? "");
    const stream = new ReadableStream({
      async start(controller) {
        await mockStream(
          controller,
          `> AI қызметіне қосылу мүмкін болмады. Демо жауап көрсетіліп тұр.\n\n${text}`,
        );
      },
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-LifeGuard-Source": "fallback",
      },
    });
  }
}
