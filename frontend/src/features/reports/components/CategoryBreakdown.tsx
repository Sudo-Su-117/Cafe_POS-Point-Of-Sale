"use client";

import React from "react";

interface CategoryRow {
  name: string;
  orders: number;
  revenue: number;
  pct: number;
}

interface CategoryBreakdownProps {
  categories?: CategoryRow[];
  isLoading?: boolean;
}

const colors = [
  "var(--primary)",
  "var(--sidebar)",
  "var(--gold)",
  "var(--success)",
  "var(--danger)",
];

export function CategoryBreakdown({ categories = [], isLoading = false }: CategoryBreakdownProps) {
  if (isLoading) {
    return (
      <div className="bg-surface border border-border-custom rounded-[20px] p-6 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] h-[250px] flex items-center justify-center theme-transition">
        <div className="text-text-muted animate-pulse font-semibold">Loading category breakdown...</div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-surface border border-border-custom rounded-[20px] p-6 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] h-[250px] flex flex-col items-center justify-center theme-transition">
        <span className="text-text-muted font-semibold">No category data available</span>
        <p className="text-[12px] text-text-muted/60 mt-1">Try selecting a different date range.</p>
      </div>
    );
  }

  const totalOrders = categories.reduce((sum, cat) => sum + cat.orders, 0);
  const totalRevenue = categories.reduce((sum, cat) => sum + cat.revenue, 0);

  return (
    <div className="bg-surface border border-border-custom rounded-[20px] p-6 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] theme-transition">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[18px] font-bold text-text-heading">Category Breakdown</h3>
      </div>
      <div className="flex flex-col gap-3">
        {categories.map((cat, index) => {
          const color = colors[index % colors.length];
          return (
            <div key={cat.name} className="flex items-center gap-3">
              <div className="flex items-center gap-2 w-[110px] shrink-0">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span className="text-[13px] font-semibold text-text-body truncate">{cat.name}</span>
              </div>
              <div className="flex-1 h-[10px] bg-border-custom/30 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${cat.pct}%`, backgroundColor: color }}
                />
              </div>
              <span className="text-[13px] font-bold text-text-heading w-10 text-right shrink-0">{cat.pct}%</span>
              <span className="text-[13px] font-semibold text-primary w-28 text-right shrink-0 whitespace-nowrap">
                ₹{cat.revenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-5 pt-4 border-t border-border-custom/60 flex justify-between gap-4 text-[13px] font-semibold flex-wrap">
        <span className="text-text-muted whitespace-nowrap">Total Orders: <span className="text-text-heading font-bold">{totalOrders}</span></span>
        <span className="text-text-muted whitespace-nowrap">Total Revenue: <span className="text-primary font-bold whitespace-nowrap">
          ₹{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </span></span>
      </div>
    </div>
  );
}
