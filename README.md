# LifeGuard KZ

AI-негізіндегі өмірді сақтандыру тәуекелін бағалау платформасы — Қазақстан үшін.

## Мүмкіндіктер

- 4 қадамды актуарлық калькулятор (Гомперц заңы, ҚР өлім кестесі)
- GPT-4o mini AI-кеңесшісі (стриминг)
- Талдау панелі (тәуекел таралуы, аймақ heatmap, тренд)
- PDF есеп экспорты
- 100% қазақ тілінде

## Іске қосу

```bash
npm install
cp .env.example .env.local   # OPENAI_API_KEY қосыңыз
npm run dev
```

## Стек

- Next.js 14 (App Router, TypeScript)
- Tailwind CSS 3
- Framer Motion, Recharts, Lucide
- OpenAI SDK, jsPDF

## Құрылым

```
app/             # pages + API routes
components/      # reusable UI + dashboard widgets
lib/             # actuarial engine, store, constants
```

## Заңдық сәйкестік

ҚР №126-II Заңы, Азаматтық кодекс 40-тарау, Салық кодексі 341-бап.
