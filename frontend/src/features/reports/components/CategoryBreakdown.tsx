"use client";

import React from "react";

interface CategoryRow {
  name: string;
  color: string;
  orders: number;
  revenue: string;
  pct: number;
}

const categories: CategoryRow[] = [
  { name: "Espresso",   color: "var(--primary)", orders: 284, revenue: "$2,958", pct: 35 },
  { name: "Cold Brew",  color: "var(--sidebar)", orders: 211, revenue: "$1,690", pct: 20 },
  { name: "Pastries",   color: "var(--gold)", orders: 198, revenue: "$1,521", pct: 18 },
  { name: "Sandwiches", color: "var(--success)", orders: 142, revenue: "$1,268", pct: 15 },
  { name: "Tea",        color: "var(--primary)", orders: 130, revenue: "$1,014", pct: 12 },
];

export function CategoryBreakdown() {
  return (
    <div className="bg-surface border border-border-custom rounded-[20px] p-6 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] theme-transition">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[18px] font-bold text-text-heading">Category Breakdown</h3>
      </div>
      <div className="flex flex-col gap-3">
        {categories.map(cat => (
          <div key={cat.name} className="flex items-center gap-3">
            <div className="flex items-center gap-2 w-[110px] shrink-0">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
              <span className="text-[13px] font-semibold text-text-body truncate">{cat.name}</span>
            </div>
            <div className="flex-1 h-[10px] bg-border-custom/30 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${cat.pct}%`, backgroundColor: cat.color }}
              />
            </div>
            <span className="text-[13px] font-bold text-text-heading w-8 text-right shrink-0">{cat.pct}%</span>
            <span className="text-[13px] font-semibold text-primary w-16 text-right shrink-0">{cat.revenue}</span>
          </div>
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-border-custom/60 flex justify-between text-[13px] font-semibold">
        <span className="text-text-muted">Total Orders: <span className="text-text-heading font-bold">965</span></span>
        <span className="text-text-muted">Total Revenue: <span className="text-primary font-bold">$8,451</span></span>
      </div>
    </div>
  );
}
