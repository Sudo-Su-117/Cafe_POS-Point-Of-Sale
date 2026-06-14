"use client";

import React from "react";

interface ProductRow {
  rank: number;
  name: string;
  category: string;
  qty: number;
  revenue: number;
  trend: "up" | "down" | "flat";
}

interface TopProductsTableProps {
  products?: ProductRow[];
  isLoading?: boolean;
}

const trendBadge = {
  up:   "bg-success/10 text-success",
  down: "bg-danger/10 text-danger",
  flat: "bg-surface text-text-muted",
};
const trendLabel = { up: "▲ Up", down: "▼ Down", flat: "— Flat" };

export function TopProductsTable({ products = [], isLoading = false }: TopProductsTableProps) {
  if (isLoading) {
    return (
      <div className="bg-surface border border-border-custom rounded-[20px] p-6 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] h-[350px] flex items-center justify-center theme-transition">
        <div className="text-text-muted animate-pulse font-semibold">Loading top products...</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-surface border border-border-custom rounded-[20px] p-6 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] h-[350px] flex flex-col items-center justify-center theme-transition">
        <span className="text-text-muted font-semibold">No products sold in this period</span>
        <p className="text-[12px] text-text-muted/60 mt-1">Try selecting a different date range.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border-custom rounded-[20px] p-6 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] theme-transition">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[18px] font-bold text-text-heading">Top Products</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left min-w-[480px]">
          <thead>
            <tr className="bg-surface theme-transition">
              <th className="px-4 py-3 text-[12px] font-bold text-text-heading rounded-l-[12px] w-10">#</th>
              <th className="px-4 py-3 text-[12px] font-bold text-text-heading">Product</th>
              <th className="px-4 py-3 text-[12px] font-bold text-text-heading">Category</th>
              <th className="px-4 py-3 text-[12px] font-bold text-text-heading text-right">Qty Sold</th>
              <th className="px-4 py-3 text-[12px] font-bold text-text-heading text-right">Revenue</th>
              <th className="px-4 py-3 text-[12px] font-bold text-text-heading rounded-r-[12px] text-right">Trend</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.rank} className="h-[52px] border-b border-border-custom/50 last:border-0 hover:bg-white/40 transition-colors">
                <td className="px-4 py-2 text-[13px] font-bold text-text-muted">{p.rank}</td>
                <td className="px-4 py-2 text-[14px] font-semibold text-text-heading">{p.name}</td>
                <td className="px-4 py-2 text-[13px] font-medium text-text-muted">{p.category}</td>
                <td className="px-4 py-2 text-[14px] font-bold text-text-heading text-right">{p.qty}</td>
                <td className="px-4 py-2 text-[14px] font-bold text-primary text-right">
                  ${p.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-2 text-right">
                  <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[11px] font-bold ${trendBadge[p.trend]}`}>
                    {trendLabel[p.trend]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
