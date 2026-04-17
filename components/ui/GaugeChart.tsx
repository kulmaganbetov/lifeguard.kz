"use client";

import { useEffect, useRef, useState } from "react";

interface GaugeChartProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

const zones = [
  { min: 0, max: 30, color: "#059669" },
  { min: 31, max: 55, color: "#F59E0B" },
  { min: 56, max: 75, color: "#EA580C" },
  { min: 76, max: 100, color: "#DC2626" },
];

function colorForValue(value: number): string {
  return zones.find((z) => value >= z.min && value <= z.max)?.color ?? "#94A3B8";
}

export default function GaugeChart({
  value,
  size = 240,
  strokeWidth = 18,
  label,
}: GaugeChartProps) {
  const [animated, setAnimated] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const duration = 900;
    const from = animated;
    const to = Math.max(0, Math.min(100, value));

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimated(from + (to - from) * eased);
      if (t < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = -220;
  const endAngle = 40;
  const totalAngle = endAngle - startAngle;

  const polar = (angleDeg: number, r: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const arcPath = (from: number, to: number) => {
    const p1 = polar(from, radius);
    const p2 = polar(to, radius);
    const large = to - from > 180 ? 1 : 0;
    return `M ${p1.x} ${p1.y} A ${radius} ${radius} 0 ${large} 1 ${p2.x} ${p2.y}`;
  };

  const needleAngle = startAngle + (animated / 100) * totalAngle;
  const needleTip = polar(needleAngle, radius - strokeWidth / 2 - 8);
  const color = colorForValue(Math.round(animated));

  return (
    <div className="relative inline-flex flex-col items-center">
      <svg width={size} height={size * 0.78} viewBox={`0 0 ${size} ${size * 0.78}`}>
        <defs>
          <linearGradient id="gauge-track" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>
        </defs>
        <path
          d={arcPath(startAngle, endAngle)}
          stroke="url(#gauge-track)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
        {zones.map((z, i) => {
          const from = startAngle + (z.min / 100) * totalAngle;
          const to = startAngle + (z.max / 100) * totalAngle;
          return (
            <path
              key={i}
              d={arcPath(from, to)}
              stroke={z.color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="butt"
              opacity={animated >= z.min ? 1 : 0.25}
              style={{ transition: "opacity 0.5s" }}
            />
          );
        })}
        <line
          x1={cx}
          y1={cy}
          x2={needleTip.x}
          y2={needleTip.y}
          stroke="#0F172A"
          strokeWidth={3}
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={9} fill="#0F172A" />
        <circle cx={cx} cy={cy} r={4} fill="#FFFFFF" />
      </svg>
      <div className="absolute inset-x-0 bottom-2 flex flex-col items-center">
        <div className="font-mono text-4xl font-bold tabular-nums" style={{ color }}>
          {Math.round(animated)}
        </div>
        {label && <div className="text-xs text-slate-500 mt-0.5">{label}</div>}
      </div>
    </div>
  );
}
