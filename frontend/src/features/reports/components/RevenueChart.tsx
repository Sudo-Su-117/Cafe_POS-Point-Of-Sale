"use client";

import React, { useState } from "react";

interface DataPoint { label: string; revenue: number; orders: number; }

const weeklyData: DataPoint[] = [
  { label: "Mon", revenue: 1240, orders: 48 },
  { label: "Tue", revenue: 1580, orders: 63 },
  { label: "Wed", revenue: 1350, orders: 54 },
  { label: "Thu", revenue: 1900, orders: 76 },
  { label: "Fri", revenue: 2200, orders: 88 },
  { label: "Sat", revenue: 2050, orders: 82 },
  { label: "Sun", revenue: 1680, orders: 67 },
];

const monthlyData: DataPoint[] = [
  { label: "Week 1", revenue: 8200, orders: 328 },
  { label: "Week 2", revenue: 9400, orders: 376 },
  { label: "Week 3", revenue: 8800, orders: 352 },
  { label: "Week 4", revenue: 10200, orders: 408 },
];

type Mode = "weekly" | "monthly";
type Metric = "revenue" | "orders";

export function RevenueChart() {
  const [mode, setMode] = useState<Mode>("weekly");
  const [metric, setMetric] = useState<Metric>("revenue");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const data = mode === "weekly" ? weeklyData : monthlyData;
  const values = data.map(d => metric === "revenue" ? d.revenue : d.orders);
  const maxVal = Math.max(...values);

  const svgW = 620; const svgH = 200;
  const pL = 50; const pR = 16; const pT = 16; const pB = 28;
  const cW = svgW - pL - pR; const cH = svgH - pT - pB;

  const getX = (i: number) => pL + (i / (data.length - 1)) * cW;
  const getY = (v: number) => pT + (1 - v / maxVal) * cH;

  const pts: [number, number][] = values.map((v, i) => [getX(i), getY(v)]);

  const path = pts.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt[0]} ${pt[1]}`;
    const prev = arr[i - 1];
    const cp1x = prev[0] + (pt[0] - prev[0]) / 3;
    const cp2x = prev[0] + (2 * (pt[0] - prev[0])) / 3;
    return `${acc} C ${cp1x} ${prev[1]}, ${cp2x} ${pt[1]}, ${pt[0]} ${pt[1]}`;
  }, "");

  const areaPath = path + ` L ${pts[pts.length - 1][0]} ${pT + cH} L ${pts[0][0]} ${pT + cH} Z`;

  const yTicks = [0, Math.round(maxVal * 0.25), Math.round(maxVal * 0.5), Math.round(maxVal * 0.75), maxVal];

  const fmt = (v: number) => metric === "revenue" ? `$${v >= 1000 ? (v / 1000).toFixed(1) + "k" : v}` : `${v}`;

  return (
    <div className="bg-[#F7F3ED] border border-[#D8CCBF] rounded-[20px] p-6 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h3 className="text-[18px] font-bold text-text-heading">Revenue Trend</h3>
        <div className="flex items-center gap-2">
          {/* Metric Toggle */}
          <div className="flex bg-[#F1ECE5] rounded-[12px] p-1 gap-1">
            {(["revenue", "orders"] as Metric[]).map(m => (
              <button key={m} onClick={() => setMetric(m)}
                className={`px-3 py-1 rounded-[10px] text-[13px] font-semibold transition-all capitalize ${metric === m ? "bg-white text-[#CB7637] shadow-sm" : "text-text-muted hover:text-text-body"}`}>
                {m}
              </button>
            ))}
          </div>
          {/* Period Toggle */}
          <div className="flex bg-[#F1ECE5] rounded-[12px] p-1 gap-1">
            {(["weekly", "monthly"] as Mode[]).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`px-3 py-1 rounded-[10px] text-[13px] font-semibold transition-all capitalize ${mode === m ? "bg-white text-[#CB7637] shadow-sm" : "text-text-muted hover:text-text-body"}`}>
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative w-full">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-[200px] overflow-visible">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#CB7637" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#CB7637" stopOpacity="0" />
            </linearGradient>
          </defs>

          {yTicks.map(tick => (
            <g key={tick}>
              <line x1={pL} y1={getY(tick)} x2={svgW - pR} y2={getY(tick)} stroke="#D8CCBF" strokeWidth={0.75} strokeDasharray="4 4" opacity={0.5} />
              <text x={pL - 8} y={getY(tick) + 4} textAnchor="end" fontSize={10} fill="#9A8B7D" fontWeight={600}>{fmt(tick)}</text>
            </g>
          ))}

          {data.map((d, i) => (
            <text key={d.label} x={getX(i)} y={svgH - 6} textAnchor="middle" fontSize={11} fill="#9A8B7D" fontWeight={600}>{d.label}</text>
          ))}

          <path d={areaPath} fill="url(#areaGrad)" />
          <path d={path} fill="none" stroke="#CB7637" strokeWidth={2.5} strokeLinecap="round" />

          {hoveredIdx !== null && (
            <line x1={getX(hoveredIdx)} y1={pT} x2={getX(hoveredIdx)} y2={pT + cH} stroke="#D8CCBF" strokeWidth={1.5} strokeDasharray="3 3" />
          )}

          {pts.map((pt, i) => (
            <circle key={i} cx={pt[0]} cy={pt[1]} r={hoveredIdx === i ? 6 : 4}
              fill="#CB7637" stroke="white" strokeWidth={2} className="cursor-pointer transition-all duration-150"
              onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)} />
          ))}

          {data.map((_, i) => {
            const segW = cW / Math.max(data.length - 1, 1);
            return (
              <rect key={i} x={getX(i) - segW / 2} y={pT} width={segW} height={cH} fill="transparent"
                className="cursor-pointer" onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)} />
            );
          })}
        </svg>

        {hoveredIdx !== null && (
          <div className="absolute top-4 bg-white border border-[#D8CCBF] rounded-[12px] p-2.5 shadow-md pointer-events-none z-10 text-xs font-semibold text-text-body"
            style={{ left: `${((getX(hoveredIdx) - pL) / cW) * 80 + 5}%`, transform: "translateX(-50%)" }}>
            <div className="text-[11px] font-bold text-text-heading mb-1">{data[hoveredIdx].label}</div>
            <div>Revenue: ${data[hoveredIdx].revenue.toLocaleString()}</div>
            <div>Orders: {data[hoveredIdx].orders}</div>
          </div>
        )}
      </div>
    </div>
  );
}
