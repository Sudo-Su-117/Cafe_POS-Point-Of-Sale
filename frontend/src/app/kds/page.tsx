"use client";

import React, { useState } from "react";
import { Search, RefreshCw } from "lucide-react";
import { KDSTicket, KDSOrder, KDSStage } from "@/features/kds/components/KDSTicket";

const initialOrders: KDSOrder[] = [
  {
    id: "#0847", table: "Table 3", stage: "to-cook", elapsed: 2,
    sentAt: "14:22",
    items: [
      { id: 1, name: "Espresso",       quantity: 2, done: false },
      { id: 2, name: "Croissant",      quantity: 1, done: false },
      { id: 3, name: "Cold Brew",      quantity: 1, done: false },
    ],
  },
  {
    id: "#0846", table: "Table 7", stage: "preparing", elapsed: 9,
    sentAt: "14:15",
    items: [
      { id: 1, name: "Flat White",     quantity: 1, done: true  },
      { id: 2, name: "Club Sandwich",  quantity: 2, done: false },
      { id: 3, name: "Matcha Latte",   quantity: 1, done: false },
    ],
  },
  {
    id: "#0845", table: "Bar",     stage: "preparing", elapsed: 17,
    sentAt: "14:07",
    items: [
      { id: 1, name: "Cappuccino",     quantity: 3, done: true  },
      { id: 2, name: "Blueberry Muffin",quantity:2, done: true  },
    ],
  },
  {
    id: "#0844", table: "Table 2", stage: "completed", elapsed: 24,
    sentAt: "14:00",
    items: [
      { id: 1, name: "Nitro Cold Brew",quantity: 1, done: true  },
      { id: 2, name: "BLT",            quantity: 1, done: true  },
    ],
  },
  {
    id: "#0843", table: "Table 11",stage: "to-cook", elapsed: 1,
    sentAt: "14:23",
    items: [
      { id: 1, name: "Chai",           quantity: 2, done: false },
      { id: 2, name: "Lemonade",       quantity: 1, done: false },
    ],
  },
];

type FilterStage = "all" | KDSStage;

const stageFilters: { key: FilterStage; label: string; color: string }[] = [
  { key: "all",       label: "All",       color: "#866443" },
  { key: "to-cook",   label: "To Cook",   color: "#D55C4C" },
  { key: "preparing", label: "Preparing", color: "#D6A144" },
  { key: "completed", label: "Completed", color: "#7C9C57" },
];

export default function KDSPage() {
  const [orders, setOrders] = useState<KDSOrder[]>(initialOrders);
  const [filter, setFilter] = useState<FilterStage>("all");
  const [search, setSearch] = useState("");

  const advanceStage = (id: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o;
      const next: KDSStage = o.stage === "to-cook" ? "preparing" : "completed";
      return { ...o, stage: next };
    }));
  };

  const toggleItem = (orderId: string, itemId: number) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      return { ...o, items: o.items.map(i => i.id === itemId ? { ...i, done: !i.done } : i) };
    }));
  };

  const filtered = orders.filter(o => {
    const matchStage  = filter === "all" || o.stage === filter;
    const matchSearch = search === "" ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.table.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some(i => i.name.toLowerCase().includes(search.toLowerCase()));
    return matchStage && matchSearch;
  });

  const counts = {
    "all":       orders.length,
    "to-cook":   orders.filter(o => o.stage === "to-cook").length,
    "preparing": orders.filter(o => o.stage === "preparing").length,
    "completed": orders.filter(o => o.stage === "completed").length,
  };

  return (
    <div className="flex flex-col gap-5 max-w-[1600px] mx-auto">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-[22px] font-bold text-text-heading">Kitchen Display</h2>
          <p className="text-[13px] text-text-muted mt-0.5">Click a ticket to advance stage · Click an item to mark it done</p>
        </div>
        <button
          onClick={() => setOrders(initialOrders)}
          className="flex items-center gap-2 bg-[#F1ECE5] hover:bg-[#E8DECE] border border-[#D8CCBF] text-text-muted hover:text-text-heading text-[13px] font-semibold px-4 py-2 rounded-[12px] transition-colors"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Stage Filter */}
        <div className="flex bg-[#F1ECE5] rounded-[14px] p-1 gap-1">
          {stageFilters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[11px] text-[13px] font-semibold transition-all ${
                filter === f.key ? "bg-white shadow-sm text-text-heading" : "text-text-muted hover:text-text-body"
              }`}
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: f.color }} />
              {f.label}
              <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${filter === f.key ? "bg-[#F1ECE5] text-text-muted" : "bg-transparent"}`}>
                {counts[f.key]}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-[280px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search order, table, item..."
            className="w-full bg-[#F1ECE5] border border-[#D8CCBF] rounded-[12px] pl-9 pr-4 py-2 text-[13px] font-medium text-text-heading placeholder:text-text-muted outline-none focus:border-[#CB7637] transition-colors"
          />
        </div>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {(["to-cook", "preparing", "completed"] as KDSStage[]).map(stage => {
          const cfg = { "to-cook": { label: "To Cook", color: "#D55C4C" }, "preparing": { label: "Preparing", color: "#D6A144" }, "completed": { label: "Completed", color: "#7C9C57" } }[stage];
          const stageOrders = filtered.filter(o => o.stage === stage);

          return (
            <div key={stage} className="flex flex-col gap-3">
              {/* Column Header */}
              <div className="flex items-center gap-2 px-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.color }} />
                <h3 className="text-[14px] font-bold text-text-heading">{cfg.label}</h3>
                <span className="ml-auto text-[12px] font-bold px-2 py-0.5 rounded-full bg-[#F1ECE5] text-text-muted">{stageOrders.length}</span>
              </div>

              {/* Tickets */}
              <div className="flex flex-col gap-3">
                {stageOrders.length === 0 ? (
                  <div className="bg-[#F7F3ED] border border-dashed border-[#D8CCBF] rounded-[18px] flex flex-col items-center justify-center py-10 text-text-muted gap-2">
                    <span className="text-2xl">🍳</span>
                    <span className="text-[13px] font-semibold">No orders here</span>
                  </div>
                ) : (
                  stageOrders.map(order => (
                    <KDSTicket
                      key={order.id}
                      order={order}
                      onAdvanceStage={advanceStage}
                      onToggleItem={toggleItem}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
