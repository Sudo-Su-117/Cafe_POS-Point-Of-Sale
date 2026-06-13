"use client";

import React, { useState } from "react";
import { DollarSign, ShoppingBag, TrendingUp, Users, Download } from "lucide-react";
import { ReportStatCard } from "@/features/reports/components/ReportStatCard";
import { RevenueChart } from "@/features/reports/components/RevenueChart";
import { TopProductsTable } from "@/features/reports/components/TopProductsTable";
import { TopOrdersTable } from "@/features/reports/components/TopOrdersTable";
import { CategoryBreakdown } from "@/features/reports/components/CategoryBreakdown";

const periods = ["Today", "This Week", "This Month", "Custom"];

export default function ReportsPage() {
  const [activePeriod, setActivePeriod] = useState("This Week");

  return (
    <div className="flex flex-col gap-6 md:gap-8 max-w-[1600px] mx-auto">

      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-bold text-text-heading">Sales Reports</h2>
          <p className="text-[13px] text-text-muted mt-0.5">All stats update in real time when filters change.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Period filter */}
          <div className="flex bg-[#F1ECE5] rounded-[14px] p-1 gap-1">
            {periods.map(p => (
              <button key={p} onClick={() => setActivePeriod(p)}
                className={`px-3 py-1.5 rounded-[11px] text-[13px] font-semibold transition-all ${activePeriod === p ? "bg-white text-[#CB7637] shadow-sm" : "text-text-muted hover:text-text-body"}`}>
                {p}
              </button>
            ))}
          </div>
          {/* Export */}
          <button className="flex items-center gap-2 bg-[#CB7637] hover:bg-[#b86830] text-white text-[13px] font-semibold px-4 py-2 rounded-[12px] transition-colors">
            <Download size={15} />
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <ReportStatCard title="Total Revenue"   value="$8,452"  sub="+12.4% vs last week" icon={DollarSign}  iconTheme="orange" />
        <ReportStatCard title="Total Orders"    value="342"     sub="+8.2% vs last week"  icon={ShoppingBag} iconTheme="brown"  />
        <ReportStatCard title="Avg Order Value" value="$24.70"  sub="+4.3% vs last week"  icon={TrendingUp}  iconTheme="gold"   />
        <ReportStatCard title="Unique Customers" value="218"    sub="+6.1% vs last week"  icon={Users}       iconTheme="green"  />
      </section>

      {/* Revenue Chart */}
      <section>
        <RevenueChart />
      </section>

      {/* Tables Row */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TopOrdersTable />
        <TopProductsTable />
      </section>

      {/* Category Breakdown */}
      <section>
        <CategoryBreakdown />
      </section>

    </div>
  );
}
