"use client";

import React from "react";
import { DollarSign, ShoppingBag, CreditCard, Coffee } from "lucide-react";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { SalesChart } from "@/features/dashboard/components/SalesChart";
import { CategoryChart } from "@/features/dashboard/components/CategoryChart";
import { ProductsTable } from "@/features/dashboard/components/ProductsTable";
import { OrdersTable } from "@/features/dashboard/components/OrdersTable";

export default function Home() {
  return (
    <div className="flex flex-col gap-6 md:gap-8 max-w-[1600px] mx-auto">
      
      {/* 4 KPI Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title="Total Revenue"
          value="$8,452.50"
          deltaText="+12.4% this week"
          isPositive={true}
          icon={DollarSign}
          iconTheme="orange"
        />
        <StatCard
          title="Total Orders"
          value="342 orders"
          deltaText="+8.2% this week"
          isPositive={true}
          icon={ShoppingBag}
          iconTheme="brown"
        />
        <StatCard
          title="Avg. Ticket Value"
          value="$24.70"
          deltaText="+4.3% this week"
          isPositive={true}
          icon={CreditCard}
          iconTheme="gold"
        />
        <StatCard
          title="Active Tables"
          value="12 / 15"
          deltaText="+2 active tables"
          isPositive={true}
          icon={Coffee}
          iconTheme="green"
        />
      </section>

      {/* Charts / Analytics Section (2fr 1fr Grid) */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-2 min-w-0">
          <SalesChart />
        </div>
        <div className="min-w-0">
          <CategoryChart />
        </div>
      </section>

      {/* Tables Section (1fr 1fr Grid) */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <div className="min-w-0">
          <ProductsTable />
        </div>
        <div className="min-w-0">
          <OrdersTable />
        </div>
      </section>

    </div>
  );
}
