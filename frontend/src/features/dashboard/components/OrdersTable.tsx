"use client";

import React from "react";

interface OrderRow {
  id: string;
  table: string;
  staff: string;
  amount: string;
  status: "Paid" | "Draft" | "Cancelled";
}

const ordersData: OrderRow[] = [
  { id: "#0844", table: "Table 3", staff: "Jamie S.", amount: "$27.50", status: "Paid" },
  { id: "#0843", table: "Table 7", staff: "Priya R.", amount: "$42.00", status: "Paid" },
  { id: "#0842", table: "Bar", staff: "Jamie S.", amount: "$18.50", status: "Draft" },
  { id: "#0841", table: "Table 2", staff: "Marcus T.", amount: "$31.00", status: "Paid" },
  { id: "#0840", table: "Table 9", staff: "Priya R.", amount: "$15.50", status: "Cancelled" },
];

export function OrdersTable() {
  const statusStyles = {
    Paid: "bg-success/10 text-success",
    Draft: "bg-gold/10 text-gold",
    Cancelled: "bg-danger/10 text-danger",
  };

  return (
    <div className="bg-surface border border-border-custom rounded-[20px] p-6 hover:translate-y-[-2px] transition-all duration-200 shadow-[0_1px_1px_rgba(0,0,0,0.03)] h-[440px] flex flex-col justify-between theme-transition">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] font-bold text-text-heading font-sans">
            Recent Orders
          </h3>
          <button className="text-[13px] font-semibold text-text-muted hover:text-primary transition-colors bg-surface px-3.5 py-1.5 rounded-[12px] cursor-pointer select-none theme-transition">
            Export
          </button>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full border-collapse text-left font-sans min-w-[420px]">
            <thead>
              <tr className="bg-surface rounded-xl overflow-hidden theme-transition">
                <th className="px-4 py-3 text-[13px] font-bold text-text-heading rounded-l-[14px]">
                  Order
                </th>
                <th className="px-4 py-3 text-[13px] font-bold text-text-heading">
                  Table
                </th>
                <th className="px-4 py-3 text-[13px] font-bold text-text-heading">
                  Staff
                </th>
                <th className="px-4 py-3 text-[13px] font-bold text-text-heading">
                  Amount
                </th>
                <th className="px-4 py-3 text-[13px] font-bold text-text-heading rounded-r-[14px] text-right">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {ordersData.map((row) => (
                <tr
                  key={row.id}
                  className="h-[56px] border-b border-border-custom/60 last:border-0 hover:bg-white/40 transition-colors"
                >
                  <td className="px-4 py-2 text-[14px] font-bold text-primary">
                    {row.id}
                  </td>
                  <td className="px-4 py-2 text-[14px] font-semibold text-text-body">
                    {row.table}
                  </td>
                  <td className="px-4 py-2 text-[14px] font-semibold text-text-muted">
                    {row.staff}
                  </td>
                  <td className="px-4 py-2 text-[14px] font-bold text-text-heading">
                    {row.amount}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <span
                      className={`inline-flex items-center justify-center min-w-[72px] h-[28px] px-3 rounded-full text-[12px] font-bold select-none ${
                        statusStyles[row.status]
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
