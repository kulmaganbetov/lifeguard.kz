interface RiskBadgeProps {
  level: string;
  size?: "sm" | "md" | "lg";
}

const palette: Record<string, { bg: string; text: string; dot: string }> = {
  Төмен: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  Орташа: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  Жоғары: { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
  "Өте жоғары": { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

const sizes: Record<string, string> = {
  sm: "text-xs px-2.5 py-1",
  md: "text-sm px-3 py-1.5",
  lg: "text-base px-4 py-2",
};

export default function RiskBadge({ level, size = "md" }: RiskBadgeProps) {
  const p = palette[level] ?? palette["Орташа"];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full font-medium ${p.bg} ${p.text} ${sizes[size]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${p.dot}`} />
      {level}
    </span>
  );
}
