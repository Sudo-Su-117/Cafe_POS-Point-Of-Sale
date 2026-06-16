"use client";

import React from "react";

interface OrderRow {
  id: string;
  customer: string;
  table: string;
  items: number;
  amount: number;
  status: "Paid" | "Draft" | "Cancelled";
  date: string;
}

interface TopOrdersTableProps {
  orders?: OrderRow[];
  isLoading?: boolean;
}

const statusStyles = {
  Paid:      "bg-success/10 text-success",
  Draft:     "bg-gold/10 text-gold",
  Cancelled: "bg-danger/10 text-danger",
};

export function TopOrdersTable({ orders = [], isLoading = false }: TopOrdersTableProps) {
  if (isLoading) {
    return (
      <div className="bg-surface border border-border-custom rounded-[20px] p-6 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] h-[350px] flex items-center justify-center theme-transition">
        <div className="text-text-muted animate-pulse font-semibold">Loading top orders...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-surface border border-border-custom rounded-[20px] p-6 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] h-[350px] flex flex-col items-center justify-center theme-transition">
        <span className="text-text-muted font-semibold">No orders found for this period</span>
        <p className="text-[12px] text-text-muted/60 mt-1">Try selecting a different date range.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border-custom rounded-[20px] p-6 hover:-translate-y-0.5 transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] theme-transition">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[18px] font-bold text-text-heading">Top Orders</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left min-w-[480px]">
          <thead>
            <tr className="bg-surface theme-transition">
              <th className="px-4 py-3 text-[12px] font-bold text-text-heading rounded-l-[12px]">Order</th>
              <th className="px-4 py-3 text-[12px] font-bold text-text-heading">Customer</th>
              <th className="px-4 py-3 text-[12px] font-bold text-text-heading">Table</th>
              <th className="px-4 py-3 text-[12px] font-bold text-text-heading text-center">Items</th>
              <th className="px-4 py-3 text-[12px] font-bold text-text-heading text-right">Amount</th>
              <th className="px-4 py-3 text-[12px] font-bold text-text-heading rounded-r-[12px] text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="h-[52px] border-b border-border-custom/50 last:border-0 hover:bg-white/40 transition-colors">
                <td className="px-4 py-2">
                  <span className="text-[14px] font-bold text-primary">{o.id}</span>
                  <span className="block text-[11px] text-text-muted font-medium">{o.date}</span>
                </td>
                <td className="px-4 py-2 text-[14px] font-semibold text-text-body">{o.customer}</td>
                <td className="px-4 py-2 text-[13px] font-medium text-text-muted">{o.table}</td>
                <td className="px-4 py-2 text-[14px] font-bold text-text-heading text-center">{o.items}</td>
                <td className="px-4 py-2 text-[14px] font-bold text-text-heading text-right whitespace-nowrap">
                  ₹{o.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-2 text-right">
                  <span className={`inline-flex items-center justify-center px-2.5 h-[26px] rounded-full text-[12px] font-bold ${statusStyles[o.status]}`}>
                    {o.status}
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
