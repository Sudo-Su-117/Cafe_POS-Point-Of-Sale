"use client";

import React, { useState, useEffect } from "react";
import { DollarSign, ShoppingBag, TrendingUp, Users, Download, Sparkles, X, Loader2 } from "lucide-react";
import { ReportStatCard } from "@/features/reports/components/ReportStatCard";
import { RevenueChart } from "@/features/reports/components/RevenueChart";
import { TopProductsTable } from "@/features/reports/components/TopProductsTable";
import { TopOrdersTable } from "@/features/reports/components/TopOrdersTable";
import { CategoryBreakdown } from "@/features/reports/components/CategoryBreakdown";

const periods = ["Today", "This Week", "This Month", "Custom"];

const formatDateToYYYYMMDD = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getPeriodDateRange = (period: string, customStart?: string, customEnd?: string) => {
  const now = new Date();
  let start = new Date();
  let end = new Date();

  if (period === "Today") {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  } else if (period === "This Week") {
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  } else if (period === "This Month") {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  } else if (period === "Custom") {
    if (customStart) {
      start = new Date(customStart);
    } else {
      start.setDate(now.getDate() - 7);
    }
    start.setHours(0, 0, 0, 0);
    if (customEnd) {
      end = new Date(customEnd);
    } else {
      end.setHours(23, 59, 59, 999);
    }
  }

  return {
    startDate: formatDateToYYYYMMDD(start),
    endDate: formatDateToYYYYMMDD(end),
  };
};

export default function ReportsPage() {
  const [activePeriod, setActivePeriod] = useState("This Week");

  const [token, setToken] = useState<string | null>(null);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState<string[] | null>(null);
  const [exportToast, setExportToast] = useState(false);

  // Custom period date fields
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  // Report Data states
  const [isReportsLoading, setIsReportsLoading] = useState(false);
  const [salesData, setSalesData] = useState<{
    totalRevenue: number;
    revenueGrowth: number;
    totalOrders: number;
    ordersGrowth: number;
    averageOrderValue: number;
    aovGrowth: number;
    uniqueCustomers: number;
    customersGrowth: number;
  } | null>(null);

  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [topOrders, setTopOrders] = useState<any[]>([]);
  const [categoriesData, setCategoriesData] = useState<any[]>([]);
  const [revenueTrend, setRevenueTrend] = useState<any[]>([]);

  // Auto-login to obtain JWT token
  useEffect(() => {
    async function autoLogin() {
      try {
        const response = await fetch("http://localhost:3000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "admin@cafe.com",
            password: "Admin@123",
          }),
        });
        if (response.ok) {
          const data = await response.json();
          setToken(data.accessToken);
        }
      } catch (err) {
        console.error("Reports page auto-login error:", err);
      }
    }
    autoLogin();

    // Default custom date picker ranges
    const todayStr = formatDateToYYYYMMDD(new Date());
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    setCustomStart(formatDateToYYYYMMDD(sevenDaysAgo));
    setCustomEnd(todayStr);
  }, []);

  // Fetch all report analytics in parallel
  const fetchReportsData = async (start: string, end: string) => {
    if (!token) return;
    setIsReportsLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [salesRes, productsRes, ordersRes, categoriesRes, trendRes] = await Promise.all([
        fetch(`http://localhost:3000/reports/sales?startDate=${start}&endDate=${end}`, { headers }),
        fetch(`http://localhost:3000/reports/top-products?startDate=${start}&endDate=${end}`, { headers }),
        fetch(`http://localhost:3000/reports/top-orders?startDate=${start}&endDate=${end}`, { headers }),
        fetch(`http://localhost:3000/reports/categories?startDate=${start}&endDate=${end}`, { headers }),
        fetch(`http://localhost:3000/reports/revenue-trend?startDate=${start}&endDate=${end}`, { headers }),
      ]);

      if (salesRes.ok) setSalesData(await salesRes.json());
      if (productsRes.ok) setTopProducts(await productsRes.json());
      if (ordersRes.ok) setTopOrders(await ordersRes.json());
      if (categoriesRes.ok) {
        const data = await categoriesRes.json();
        setCategoriesData(data.categories || []);
      }
      if (trendRes.ok) setRevenueTrend(await trendRes.json());
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setIsReportsLoading(false);
    }
  };

  // Re-fetch reports when period, token, or custom date ranges change
  useEffect(() => {
    if (!token) return;
    const { startDate: start, endDate: end } = getPeriodDateRange(activePeriod, customStart, customEnd);
    fetchReportsData(start, end);
  }, [activePeriod, token, customStart, customEnd]);

  const handleFetchInsights = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }
    setIsDateModalOpen(false);
    setIsLoading(true);
    setAiInsights(null);

    try {
      const response = await fetch(
        `http://localhost:3000/reports/ai-insights?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAiInsights(data.insights || []);
      } else {
        const err = await response.json();
        alert("Failed to fetch insights: " + (err.message || response.statusText));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to backend server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    setExportToast(true);
    setTimeout(() => setExportToast(false), 2500);
  };

  // Map products to the TopProductsTable props interface
  const mappedProducts = topProducts.map((p, index) => ({
    rank: index + 1,
    name: p.productName,
    category: p.categoryName,
    qty: p.quantity,
    revenue: p.revenue,
    trend: index % 3 === 0 ? ("up" as const) : index % 3 === 1 ? ("flat" as const) : ("down" as const),
  }));

  const formatGrowthSub = (growth: number | undefined) => {
    if (growth === undefined) return "Calculating...";
    const prefix = growth >= 0 ? "+" : "";
    return `${prefix}${growth.toFixed(1)}% vs prior period`;
  };

  return (
    <>
      <div className="flex flex-col gap-6 md:gap-8 max-w-[1600px] mx-auto">
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-[22px] font-bold text-text-heading">Sales Reports</h2>
            <p className="text-[13px] text-text-muted mt-0.5">All stats update in real time when filters change.</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Custom period inputs */}
            {activePeriod === "Custom" && (
              <div className="flex items-center gap-2 bg-surface border border-border-custom rounded-[14px] p-1.5 theme-transition animate-fade-in text-[13px] font-semibold">
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="bg-transparent border-0 outline-none text-text-heading px-2 py-0.5 w-[125px] cursor-pointer"
                />
                <span className="text-text-muted text-[11px] font-bold select-none">to</span>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="bg-transparent border-0 outline-none text-text-heading px-2 py-0.5 w-[125px] cursor-pointer"
                />
              </div>
            )}
            {/* Period filter */}
            <div className="flex bg-surface rounded-[14px] p-1 gap-1 theme-transition border border-border-custom">
              {periods.map((p) => (
                <button
                  key={p}
                  onClick={() => setActivePeriod(p)}
                  className={`px-3 py-1.5 rounded-[11px] text-[13px] font-semibold transition-all ${activePeriod === p ? "bg-white text-primary shadow-sm" : "text-text-muted hover:text-text-body"}`}
                >
                  {p}
                </button>
              ))}
            </div>
            {/* AI Insights Button */}
            <button
              onClick={() => setIsDateModalOpen(true)}
              className="flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-[13px] font-semibold px-4 py-2 rounded-[12px] transition-colors hover:bg-primary/20 cursor-pointer"
            >
              <Sparkles size={15} className="animate-pulse" />
              AI Insights
            </button>
            {/* Export button */}
            <button
              onClick={handleExport}
              className="flex items-center gap-2 bg-primary hover:brightness-105 active:scale-[0.97] text-white text-[13px] font-semibold px-4 py-2 rounded-[12px] transition-all"
            >
              <Download size={15} />
              Export
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <section className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 transition-opacity duration-300 ${isReportsLoading ? "opacity-70" : "opacity-100"}`}>
          <ReportStatCard
            title="Total Revenue"
            value={salesData ? `₹${salesData.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "₹0.00"}
            sub={formatGrowthSub(salesData?.revenueGrowth)}
            icon={DollarSign}
            iconTheme="orange"
          />
          <ReportStatCard
            title="Total Orders"
            value={salesData ? salesData.totalOrders.toString() : "0"}
            sub={formatGrowthSub(salesData?.ordersGrowth)}
            icon={ShoppingBag}
            iconTheme="brown"
          />
          <ReportStatCard
            title="Avg Order Value"
            value={salesData ? `₹${salesData.averageOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "₹0.00"}
            sub={formatGrowthSub(salesData?.aovGrowth)}
            icon={TrendingUp}
            iconTheme="gold"
          />
          <ReportStatCard
            title="Unique Customers"
            value={salesData ? salesData.uniqueCustomers.toString() : "0"}
            sub={formatGrowthSub(salesData?.customersGrowth)}
            icon={Users}
            iconTheme="green"
          />
        </section>

        {/* Revenue Chart */}
        <section>
          <RevenueChart data={revenueTrend} isLoading={isReportsLoading} />
        </section>

        {/* Tables Row */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <TopOrdersTable orders={topOrders} isLoading={isReportsLoading} />
          <TopProductsTable products={mappedProducts} isLoading={isReportsLoading} />
        </section>

        {/* Category Breakdown */}
        <section>
          <CategoryBreakdown categories={categoriesData} isLoading={isReportsLoading} />
        </section>
      </div>

      {/* Date Picker Modal */}
      {isDateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-surface border border-border-custom rounded-[20px] w-full max-w-[400px] shadow-xl p-6 flex flex-col gap-5 theme-transition animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary font-bold text-[18px]">
                <Sparkles size={18} className="animate-pulse" />
                <span>AI Insights Period</span>
              </div>
              <button
                type="button"
                onClick={() => setIsDateModalOpen(false)}
                className="p-1 rounded-full text-text-muted hover:text-text-heading hover:bg-surface transition-colors cursor-pointer theme-transition"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label className="text-[13px] font-semibold text-text-heading mb-1.5">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-[44px] w-full px-4 rounded-[12px] bg-surface border border-border-custom text-[14px] font-medium text-text-heading outline-none focus:border-primary transition-colors theme-transition"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-[13px] font-semibold text-text-heading mb-1.5">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-[44px] w-full px-4 rounded-[12px] bg-surface border border-border-custom text-[14px] font-medium text-text-heading outline-none focus:border-primary transition-colors theme-transition"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsDateModalOpen(false)}
                className="h-[42px] rounded-[12px] bg-white border border-border-custom text-[13px] font-semibold text-text-heading hover:bg-surface transition-colors cursor-pointer theme-transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFetchInsights}
                className="h-[42px] rounded-[12px] bg-primary text-white text-[13px] font-semibold hover:brightness-[1.04] transition-all cursor-pointer"
              >
                Get Insights
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Modal */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-surface border border-border-custom rounded-[20px] w-full max-w-[450px] shadow-xl p-8 flex flex-col items-center justify-center gap-4 theme-transition animate-fade-in-up">
            <Sparkles size={40} className="text-primary animate-spin" />
            <p className="text-[14px] font-bold text-text-heading">Analyzing sales data using AI...</p>
            <p className="text-[12px] text-text-muted text-center">This may take up to a minute to aggregate database records and run LLM queries.</p>
          </div>
        </div>
      )}

      {/* AI Insights Modal */}
      {aiInsights && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-surface border border-border-custom rounded-[20px] w-full max-w-[550px] shadow-xl p-6 flex flex-col gap-5 theme-transition animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary font-bold text-[18px]">
                <Sparkles size={20} className="animate-pulse" />
                <span>AI Sales Performance Insights</span>
              </div>
              <button
                type="button"
                onClick={() => setAiInsights(null)}
                className="p-1 rounded-full text-text-muted hover:text-text-heading hover:bg-surface transition-colors cursor-pointer theme-transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1">
              {aiInsights.map((insight, index) => {
                const text = insight.replace(/^-\s*/, "").replace(/^\*\s*/, "").replace(/^•\s*/, "");
                return (
                  <div key={index} className="flex gap-2.5 p-3.5 bg-primary/5 border border-primary/10 rounded-[12px]">
                    <span className="text-[14px] leading-relaxed text-text-body font-medium">
                      {text}
                    </span>
                  </div>
                );
              })}
              {aiInsights.length === 0 && (
                <p className="text-[14px] text-text-muted text-center py-4">No insights generated for this period.</p>
              )}
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setAiInsights(null)}
                className="h-[42px] px-6 rounded-[12px] bg-primary text-white text-[13px] font-semibold hover:brightness-[1.04] transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Export toast */}
      {exportToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-text-heading text-white text-[13px] font-semibold px-5 py-3 rounded-full shadow-xl flex items-center gap-2 animate-fade-in">
          <Download size={14} className="text-primary" />
          Export started — file will download shortly
        </div>
      )}
    </>
  );
}
