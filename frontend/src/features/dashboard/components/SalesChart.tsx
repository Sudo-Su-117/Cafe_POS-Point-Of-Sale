"use client";

import React, { useState } from "react";

interface ChartDataPoint {
  day: string;
  sales: number;
  cost: number;
}

const chartData: ChartDataPoint[] = [
  { day: "Jun 7", sales: 1950, cost: 220 },
  { day: "Jun 8", sales: 1350, cost: 180 },
  { day: "Jun 9", sales: 1300, cost: 190 },
  { day: "Jun 10", sales: 1750, cost: 210 },
  { day: "Jun 11", sales: 1950, cost: 230 },
  { day: "Jun 12", sales: 2100, cost: 210 },
  { day: "Jun 13", sales: 450, cost: 150 },
];

export function SalesChart() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const svgWidth = 680;
  const svgHeight = 250;
  const paddingLeft = 45;
  const paddingRight = 15;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const maxVal = 2200;

  const getX = (index: number) => {
    return paddingLeft + (index / (chartData.length - 1)) * chartWidth;
  };

  const getY = (val: number) => {
    return paddingTop + (1 - val / maxVal) * chartHeight;
  };

  const orangePoints = chartData.map((d, i) => [getX(i), getY(d.sales)] as [number, number]);
  const greenPoints = chartData.map((d, i) => [getX(i), getY(d.cost)] as [number, number]);

  const getBezierPath = (points: [number, number][]) => {
    return points.reduce((acc, point, i, arr) => {
      if (i === 0) return `M ${point[0]} ${point[1]}`;
      const prev = arr[i - 1];
      const cpX1 = prev[0] + (point[0] - prev[0]) / 3;
      const cpY1 = prev[1];
      const cpX2 = prev[0] + (2 * (point[0] - prev[0])) / 3;
      const cpY2 = point[1];
      return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${point[0]} ${point[1]}`;
    }, "");
  };

  const orangePath = getBezierPath(orangePoints);
  const greenPath = getBezierPath(greenPoints);

  const yTicks = [0, 550, 1100, 1650, 2200];

  return (
    <div className="bg-[#F7F3ED] border border-[#D8CCBF] rounded-[20px] p-6 flex flex-col justify-between hover:translate-y-[-2px] transition-all duration-200 shadow-[0_1px_1px_rgba(0,0,0,0.03)] h-[360px] relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[18px] font-bold text-text-heading font-sans">
          Sales Trend
        </h3>
        <div className="flex items-center gap-4 text-xs font-semibold select-none">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded-full bg-[#CB7637] border-t-2 border-[#CB7637]"></span>
            <span className="text-text-body">Sales</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded-full bg-[#78964E] border-t-2 border-[#78964E]"></span>
            <span className="text-text-body">Costs</span>
          </div>
        </div>
      </div>

      <div className="relative flex-1 w-full">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full overflow-visible"
        >
          {yTicks.map((tick) => {
            const y = getY(tick);
            return (
              <g key={tick} className="opacity-40">
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="#D8CCBF"
                  strokeWidth={0.75}
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-text-muted text-[11px] font-semibold font-sans"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {chartData.map((d, i) => {
            const x = getX(i);
            return (
              <text
                key={d.day}
                x={x}
                y={svgHeight - 8}
                textAnchor="middle"
                className="fill-text-muted text-[11px] font-semibold font-sans select-none"
              >
                {d.day}
              </text>
            );
          })}

          <path
            d={orangePath}
            fill="none"
            stroke="#CB7637"
            strokeWidth={3}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
          <path
            d={greenPath}
            fill="none"
            stroke="#78964E"
            strokeWidth={3}
            strokeLinecap="round"
            className="transition-all duration-300"
          />

          {hoveredIdx !== null && (
            <line
              x1={getX(hoveredIdx)}
              y1={paddingTop}
              x2={getX(hoveredIdx)}
              y2={svgHeight - paddingBottom}
              stroke="#D8CCBF"
              strokeWidth={1.5}
              strokeDasharray="2 2"
            />
          )}

          {orangePoints.map((pt, i) => (
            <circle
              key={`o-${i}`}
              cx={pt[0]}
              cy={pt[1]}
              r={hoveredIdx === i ? 6 : 4}
              className="fill-[#CB7637] stroke-white stroke-2 cursor-pointer transition-all duration-150"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          ))}

          {greenPoints.map((pt, i) => (
            <circle
              key={`g-${i}`}
              cx={pt[0]}
              cy={pt[1]}
              r={hoveredIdx === i ? 6 : 4}
              className="fill-[#78964E] stroke-white stroke-2 cursor-pointer transition-all duration-150"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          ))}

          {chartData.map((_, i) => {
            const x = getX(i);
            const w = chartWidth / (chartData.length - 1);
            return (
              <rect
                key={`hit-${i}`}
                x={x - w / 2}
                y={paddingTop}
                width={w}
                height={chartHeight}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>

        {hoveredIdx !== null && (
          <div
            className="absolute bg-white/95 backdrop-blur-sm border border-[#D8CCBF] rounded-xl p-3 shadow-md pointer-events-none transition-all duration-150 z-20 font-sans"
            style={{
              left: `${((getX(hoveredIdx) - paddingLeft) / chartWidth) * 85 + 5}%`,
              top: "20px",
              transform: "translateX(-50%)",
            }}
          >
            <div className="text-[12px] font-bold text-text-heading mb-1">
              {chartData[hoveredIdx].day}, 2026
            </div>
            <div className="flex flex-col gap-1 text-[11px] font-semibold text-text-body">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#CB7637]"></span>
                <span>Sales: ${chartData[hoveredIdx].sales}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#78964E]"></span>
                <span>Costs: ${chartData[hoveredIdx].cost}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
