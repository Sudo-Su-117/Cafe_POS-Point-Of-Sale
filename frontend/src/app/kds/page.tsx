"use client";

import React, { useState, useEffect } from "react";
import { Search, RefreshCw } from "lucide-react";
import { KDSTicket, KDSOrder, KDSStage } from "@/features/kds/components/KDSTicket";

type FilterStage = "all" | KDSStage;

const stageFilters: { key: FilterStage; label: string; color: string }[] = [
  { key: "all",       label: "All",       color: "var(--sidebar)" },
  { key: "to-cook",   label: "To Cook",   color: "var(--danger)" },
  { key: "preparing", label: "Preparing", color: "var(--gold)" },
  { key: "completed", label: "Completed", color: "var(--success)" },
];

export default function KDSPage() {
  const [orders, setOrders] = useState<KDSOrder[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [filter, setFilter] = useState<FilterStage>("all");
  const [search, setSearch] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

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
        console.error("KDS auto-login error:", err);
      }
    }
    autoLogin();
  }, []);

  const refreshQueue = async (jwt: string) => {
    try {
      const headers = { Authorization: `Bearer ${jwt}` };
      const [queueRes, tablesRes] = await Promise.all([
        fetch("http://localhost:3000/kds/queue", { headers }),
        fetch("http://localhost:3000/tables", { headers }),
      ]);

      if (queueRes.ok && tablesRes.ok) {
        const queueData = await queueRes.json();
        const tablesData = await tablesRes.json();
        setTables(tablesData);

        const mapped: KDSOrder[] = queueData.map((order: any) => {
          const matchedTable = tablesData.find((t: any) => t.id === order.tableId);
          const tableNumber = matchedTable ? matchedTable.tableNumber : "Table";
          
          let stage: KDSStage = "to-cook";
          if (order.status === "PREPARING") {
            stage = "preparing";
          } else if (order.status === "COMPLETED") {
            stage = "completed";
          } else if (order.status === "SENT_TO_KITCHEN" || order.status === "PAID") {
            stage = "to-cook";
          }

          const date = new Date(order.createdAt);
          const sentAt = date.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" });
          const elapsed = Math.max(0, Math.round((Date.now() - date.getTime()) / 60000));

          const completedAtDate = new Date(order.updatedAt || order.createdAt);
          const completedAt = (order.status === "COMPLETED")
            ? completedAtDate.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" })
            : undefined;

          const items = (order.orderItems || []).map((item: any) => ({
            id: item.id,
            name: item.product?.name || "Product",
            quantity: item.quantity,
            done: !!checkedItems[item.id]
          }));

          return {
            id: order.id,
            table: tableNumber,
            stage,
            items,
            sentAt,
            elapsed,
            completedAt
          };
        });

        setOrders(mapped);
      }
    } catch (err) {
      console.error("Error refreshing KDS queue:", err);
    }
  };

  useEffect(() => {
    if (token) {
      refreshQueue(token);
      const interval = setInterval(() => refreshQueue(token), 5000);
      return () => clearInterval(interval);
    }
  }, [token, checkedItems]); // include checkedItems to refresh lists correctly when toggled

  const advanceStage = async (id: string) => {
    if (!token) return;
    const order = orders.find(o => o.id === id);
    if (!order) return;

    try {
      if (order.stage === "to-cook") {
        const response = await fetch(`http://localhost:3000/kds/order/${id}/status`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: "preparing",
          }),
        });
        if (response.ok) {
          refreshQueue(token);
        } else {
          console.error("Failed to update status to preparing");
        }
      } else if (order.stage === "preparing") {
        const response = await fetch(`http://localhost:3000/kds/order/${id}/mark-ready`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          refreshQueue(token);
        } else {
          console.error("Failed to mark order completed");
        }
      }
    } catch (err) {
      console.error("Error advancing KDS stage:", err);
    }
  };

  const toggleItem = (orderId: string, itemId: any) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
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
          onClick={() => token && refreshQueue(token)}
          className="flex items-center gap-2 bg-surface hover:bg-border-custom/30 border border-border-custom text-text-muted hover:text-text-heading text-[13px] font-semibold px-4 py-2 rounded-[12px] transition-colors theme-transition"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Stage Filter */}
        <div className="flex bg-surface rounded-[14px] p-1 gap-1 theme-transition">
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
              <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${filter === f.key ? "bg-surface text-text-muted" : "bg-transparent"}`}>
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
            className="w-full bg-surface border border-border-custom rounded-[12px] pl-9 pr-4 py-2 text-[13px] font-medium text-text-heading placeholder:text-text-muted outline-none focus:border-primary transition-colors theme-transition"
          />
        </div>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {(["to-cook", "preparing", "completed"] as KDSStage[]).map(stage => {
          const cfg = { "to-cook": { label: "To Cook", color: "var(--danger)" }, "preparing": { label: "Preparing", color: "var(--gold)" }, "completed": { label: "Completed", color: "var(--success)" } }[stage];
          const stageOrders = filtered.filter(o => o.stage === stage);

          return (
            <div key={stage} className="flex flex-col gap-3">
              {/* Column Header */}
              <div className="flex items-center gap-2 px-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.color }} />
                <h3 className="text-[14px] font-bold text-text-heading">{cfg.label}</h3>
                <span className="ml-auto text-[12px] font-bold px-2 py-0.5 rounded-full bg-surface text-text-muted theme-transition">{stageOrders.length}</span>
              </div>

              {/* Tickets */}
              <div className="flex flex-col gap-3">
                {stageOrders.length === 0 ? (
                  <div className="bg-surface border border-dashed border-border-custom rounded-[18px] flex flex-col items-center justify-center py-10 text-text-muted gap-2 theme-transition">
                    <span className="text-2xl">🍳</span>
                    <span className="text-[13px] font-semibold">No orders here</span>
                  </div>
                ) : (
                  stageOrders.map(order => {
                    const displayOrder = {
                      ...order,
                      // format ID for display using last 4 characters of UUID
                      id: `#${order.id.slice(-4).toUpperCase()}`
                    };
                    return (
                      <KDSTicket
                        key={order.id}
                        order={displayOrder}
                        onAdvanceStage={() => advanceStage(order.id)}
                        onToggleItem={(orderId, itemId) => toggleItem(orderId, itemId)}
                      />
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
