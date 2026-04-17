import { Fragment } from "react";

interface MarkdownRendererProps {
  content: string;
}

type Block =
  | { type: "h1" | "h2" | "h3"; text: string }
  | { type: "hr" }
  | { type: "quote"; text: string }
  | { type: "code"; lang: string; code: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "table"; header: string[]; rows: string[][] }
  | { type: "p"; text: string };

function parseBlocks(src: string): Block[] {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;
  const pushParagraph = (buf: string[]) => {
    const text = buf.join("\n").trim();
    if (text) blocks.push({ type: "p", text });
  };
  let paragraph: string[] = [];
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim().startsWith("```")) {
      pushParagraph(paragraph);
      paragraph = [];
      const lang = line.trim().slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      blocks.push({ type: "code", lang, code: codeLines.join("\n") });
      continue;
    }
    if (/^\s*---+\s*$/.test(line)) {
      pushParagraph(paragraph);
      paragraph = [];
      blocks.push({ type: "hr" });
      i++;
      continue;
    }
    const h = /^(#{1,3})\s+(.*)$/.exec(line);
    if (h) {
      pushParagraph(paragraph);
      paragraph = [];
      const level = h[1].length as 1 | 2 | 3;
      blocks.push({ type: (`h${level}` as "h1" | "h2" | "h3"), text: h[2] });
      i++;
      continue;
    }
    if (/^\s*>\s+/.test(line)) {
      pushParagraph(paragraph);
      paragraph = [];
      const quoteLines: string[] = [];
      while (i < lines.length && /^\s*>\s+/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^\s*>\s+/, ""));
        i++;
      }
      blocks.push({ type: "quote", text: quoteLines.join(" ") });
      continue;
    }
    if (/^\s*\|/.test(line) && i + 1 < lines.length && /^\s*\|?\s*-{2,}/.test(lines[i + 1])) {
      pushParagraph(paragraph);
      paragraph = [];
      const header = line
        .trim()
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((c) => c.trim());
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) {
        const cells = lines[i]
          .trim()
          .replace(/^\|/, "")
          .replace(/\|$/, "")
          .split("|")
          .map((c) => c.trim());
        rows.push(cells);
        i++;
      }
      blocks.push({ type: "table", header, rows });
      continue;
    }
    if (/^\s*[-*]\s+/.test(line)) {
      pushParagraph(paragraph);
      paragraph = [];
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ""));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      pushParagraph(paragraph);
      paragraph = [];
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }
    if (line.trim() === "") {
      pushParagraph(paragraph);
      paragraph = [];
      i++;
      continue;
    }
    paragraph.push(line);
    i++;
  }
  pushParagraph(paragraph);
  return blocks;
}

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/;
  while (remaining.length) {
    const m = regex.exec(remaining);
    if (!m) {
      parts.push(<Fragment key={key++}>{remaining}</Fragment>);
      break;
    }
    const before = remaining.slice(0, m.index);
    if (before) parts.push(<Fragment key={key++}>{before}</Fragment>);
    const token = m[0];
    if (token.startsWith("**")) {
      parts.push(
        <strong key={key++} className="font-semibold text-slate-900">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("*")) {
      parts.push(
        <em key={key++} className="italic">
          {token.slice(1, -1)}
        </em>,
      );
    } else if (token.startsWith("`")) {
      parts.push(
        <code
          key={key++}
          className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] text-emerald-700"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("[")) {
      const mm = /\[([^\]]+)\]\(([^)]+)\)/.exec(token);
      if (mm) {
        parts.push(
          <a
            key={key++}
            href={mm[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 underline underline-offset-2 hover:text-emerald-700"
          >
            {mm[1]}
          </a>,
        );
      }
    }
    remaining = remaining.slice(m.index + token.length);
  }
  return parts;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const blocks = parseBlocks(content);
  return (
    <div className="space-y-3 text-[15px] leading-relaxed text-slate-700">
      {blocks.map((b, i) => {
        if (b.type === "h1")
          return (
            <h1 key={i} className="text-2xl font-bold text-slate-900 mt-2">
              {renderInline(b.text)}
            </h1>
          );
        if (b.type === "h2")
          return (
            <h2 key={i} className="text-xl font-semibold text-slate-900 mt-2">
              {renderInline(b.text)}
            </h2>
          );
        if (b.type === "h3")
          return (
            <h3 key={i} className="text-lg font-semibold text-slate-900 mt-1">
              {renderInline(b.text)}
            </h3>
          );
        if (b.type === "hr") return <hr key={i} className="border-slate-200" />;
        if (b.type === "quote")
          return (
            <blockquote
              key={i}
              className="rounded-r-lg border-l-4 border-emerald-500 bg-emerald-50/50 px-4 py-2 text-slate-600 italic"
            >
              {renderInline(b.text)}
            </blockquote>
          );
        if (b.type === "code")
          return (
            <pre
              key={i}
              className="rounded-lg bg-slate-900 p-3 font-mono text-sm text-emerald-400 overflow-x-auto"
            >
              <code>{b.code}</code>
            </pre>
          );
        if (b.type === "ul")
          return (
            <ul key={i} className="list-disc pl-5 space-y-1">
              {b.items.map((it, j) => (
                <li key={j}>{renderInline(it)}</li>
              ))}
            </ul>
          );
        if (b.type === "ol")
          return (
            <ol key={i} className="list-decimal pl-5 space-y-1">
              {b.items.map((it, j) => (
                <li key={j}>{renderInline(it)}</li>
              ))}
            </ol>
          );
        if (b.type === "table")
          return (
            <div key={i} className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {b.header.map((h, j) => (
                      <th
                        key={j}
                        className="px-3 py-2 text-left font-semibold text-slate-700"
                      >
                        {renderInline(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {b.rows.map((r, j) => (
                    <tr key={j} className="border-t border-slate-100">
                      {r.map((c, k) => (
                        <td key={k} className="px-3 py-2 text-slate-600">
                          {renderInline(c)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        return (
          <p key={i} className="whitespace-pre-wrap">
            {renderInline(b.text)}
          </p>
        );
      })}
    </div>
  );
}
