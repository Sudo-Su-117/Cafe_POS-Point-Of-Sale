"use client";

import React, { useEffect, useRef, useState } from "react";

interface DataPoint {
  label: string;
  revenue: number;
  orders: number;
}

interface RevenueChartProps {
  data?: DataPoint[];
  isLoading?: boolean;
}

type Metric = "revenue" | "orders";

const SVG_H = 200;
const P_L = 55;
const P_R = 15;
const P_T = 20;
const P_B = 32;

export function RevenueChart({ data = [], isLoading = false }: RevenueChartProps) {
  const [metric, setMetric] = useState<Metric>("revenue");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [svgW, setSvgW] = useState(620);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateWidth = () => {
      const width = el.getBoundingClientRect().width;
      if (width > 0) setSvgW(width);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-surface border border-border-custom rounded-[20px] px-4 py-6 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] h-[280px] flex items-center justify-center theme-transition">
        <div className="text-text-muted animate-pulse font-semibold">Loading revenue trend...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-surface border border-border-custom rounded-[20px] px-4 py-6 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] h-[280px] flex flex-col items-center justify-center theme-transition">
        <span className="text-text-muted font-semibold">No trend data available</span>
        <p className="text-[12px] text-text-muted/60 mt-1">Try selecting a different date range.</p>
      </div>
    );
  }

  const values = data.map((d) => (metric === "revenue" ? d.revenue : d.orders));
  const maxVal = Math.max(...values, 1); // fallback to 1 to avoid division by zero

  const cW = svgW - P_L - P_R;
  const cH = SVG_H - P_T - P_B;

  const getX = (i: number) => P_L + (i / Math.max(data.length - 1, 1)) * cW;
  const getY = (v: number) => P_T + (1 - v / maxVal) * cH;

  const pts: [number, number][] = values.map((v, i) => [getX(i), getY(v)]);

  const path = pts.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt[0]} ${pt[1]}`;
    const prev = arr[i - 1];
    const cp1x = prev[0] + (pt[0] - prev[0]) / 3;
    const cp2x = prev[0] + (2 * (pt[0] - prev[0])) / 3;
    return `${acc} C ${cp1x} ${prev[1]}, ${cp2x} ${pt[1]}, ${pt[0]} ${pt[1]}`;
  }, "");

  const areaPath =
    pts.length > 0
      ? path + ` L ${pts[pts.length - 1][0]} ${P_T + cH} L ${pts[0][0]} ${P_T + cH} Z`
      : "";

  const yTicks = [
    0,
    Math.round(maxVal * 0.25),
    Math.round(maxVal * 0.5),
    Math.round(maxVal * 0.75),
    maxVal,
  ];

  const fmt = (v: number) =>
    metric === "revenue"
      ? `₹${v >= 1000 ? (v / 1000).toFixed(1) + "k" : v}`
      : `${v}`;

  return (
    <div className="bg-surface border border-border-custom rounded-[20px] p-6 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] theme-transition">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h3 className="text-[18px] font-bold text-text-heading">Revenue Trend</h3>
        <div className="flex items-center gap-2">
          <div className="flex bg-surface rounded-[12px] p-1 gap-1 theme-transition">
            {(["revenue", "orders"] as Metric[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMetric(m)}
                className={`px-3 py-1 rounded-[10px] text-[13px] font-semibold transition-all capitalize ${metric === m ? "bg-white text-primary shadow-sm" : "text-text-muted hover:text-text-body"}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div ref={containerRef} className="relative w-full">
        <svg
          viewBox={`0 0 ${svgW} ${SVG_H}`}
          className="w-full h-[200px] overflow-visible"
        >
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {yTicks.map((tick) => (
            <g key={tick}>
              <line
                x1={P_L}
                y1={getY(tick)}
                x2={svgW - P_R}
                y2={getY(tick)}
                stroke="var(--border-color)"
                strokeWidth={0.75}
                strokeDasharray="4 4"
                opacity={0.5}
              />
              <text
                x={P_L - 6}
                y={getY(tick) + 4}
                textAnchor="end"
                fontSize={10}
                fill="var(--text-muted)"
                fontWeight={600}
              >
                {fmt(tick)}
              </text>
            </g>
          ))}

          {data.map((d, i) => (
            <text
              key={`${d.label}-${i}`}
              x={getX(i)}
              y={SVG_H - 6}
              textAnchor="middle"
              fontSize={11}
              fill="var(--text-muted)"
              fontWeight={600}
            >
              {d.label}
            </text>
          ))}

          {pts.length > 0 && <path d={areaPath} fill="url(#areaGrad)" />}
          {pts.length > 0 && (
            <path
              d={path}
              fill="none"
              stroke="var(--primary)"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          )}

          {hoveredIdx !== null && hoveredIdx < pts.length && (
            <line
              x1={getX(hoveredIdx)}
              y1={P_T}
              x2={getX(hoveredIdx)}
              y2={P_T + cH}
              stroke="var(--border-color)"
              strokeWidth={1.5}
              strokeDasharray="3 3"
            />
          )}

          {pts.map((pt, i) => (
            <circle
              key={i}
              cx={pt[0]}
              cy={pt[1]}
              r={hoveredIdx === i ? 6 : 4}
              fill="var(--primary)"
              stroke="white"
              strokeWidth={2}
              className="cursor-pointer transition-all duration-150"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          ))}

          {data.map((_, i) => {
            const segW = cW / Math.max(data.length - 1, 1);
            return (
              <rect
                key={i}
                x={getX(i) - segW / 2}
                y={P_T}
                width={segW}
                height={cH}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>

        {hoveredIdx !== null && hoveredIdx < data.length && (
          <div
            className="absolute top-4 bg-white border border-border-custom rounded-[12px] p-2.5 shadow-md pointer-events-none z-10 text-xs font-semibold text-text-body"
            style={{
              left: `${((getX(hoveredIdx) - P_L) / cW) * 100}%`,
              transform: "translateX(-50%)",
            }}
          >
            <div className="text-[11px] font-bold text-text-heading mb-1">
              {data[hoveredIdx].label}
            </div>
            <div>
              Revenue: ₹{data[hoveredIdx].revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div>Orders: {data[hoveredIdx].orders}</div>
          </div>
        )}
      </div>
    </div>
  );
}
