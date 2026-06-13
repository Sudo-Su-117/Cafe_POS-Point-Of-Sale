"use client";

import React from "react";
import { Clock, ChevronRight } from "lucide-react";

export type KDSStage = "to-cook" | "preparing" | "completed";

export interface KDSItem {
  id: number;
  name: string;
  quantity: number;
  done: boolean;
}

export interface KDSOrder {
  id: string;
  table: string;
  stage: KDSStage;
  items: KDSItem[];
  sentAt: string;
  elapsed: number; // minutes
}

interface KDSTicketProps {
  order: KDSOrder;
  onAdvanceStage: (id: string) => void;
  onToggleItem: (orderId: string, itemId: number) => void;
}

const stageConfig = {
  "to-cook":   { label: "To Cook",   bg: "bg-[#FFE3DE]", text: "text-[#D55C4C]", dot: "bg-[#D55C4C]" },
  "preparing": { label: "Preparing", bg: "bg-[#FFF1D9]", text: "text-[#D6A144]", dot: "bg-[#D6A144]" },
  "completed": { label: "Completed", bg: "bg-[#E7F3DD]", text: "text-[#7C9C57]", dot: "bg-[#7C9C57]" },
};

const urgencyColor = (elapsed: number) => {
  if (elapsed >= 15) return "border-[#D55C4C]";
  if (elapsed >= 8)  return "border-[#D6A144]";
  return "border-[#D8CCBF]";
};

export function KDSTicket({ order, onAdvanceStage, onToggleItem }: KDSTicketProps) {
  const stage = stageConfig[order.stage];
  const allDone = order.items.every(i => i.done);

  return (
    <div className={`bg-[#F7F3ED] border-2 ${urgencyColor(order.elapsed)} rounded-[20px] flex flex-col overflow-hidden hover:-translate-y-0.5 transition-all duration-200 shadow-[0_1px_4px_rgba(0,0,0,0.06)]`}>
      {/* Ticket Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#F1ECE5] border-b border-[#D8CCBF]">
        <div className="flex items-center gap-2">
          <span className="text-[16px] font-bold text-text-heading">{order.id}</span>
          <span className="text-[12px] font-semibold text-text-muted bg-white border border-[#D8CCBF] px-2 py-0.5 rounded-full">
            {order.table}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full ${stage.bg} ${stage.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${stage.dot} ${order.stage !== "completed" ? "animate-pulse" : ""}`} />
            {stage.label}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 px-4 py-3 flex flex-col gap-2">
        {order.items.map(item => (
          <button
            key={item.id}
            onClick={() => onToggleItem(order.id, item.id)}
            className={`flex items-center gap-3 py-2 px-3 rounded-[12px] text-left transition-all hover:bg-white/50 ${
              item.done ? "opacity-50" : ""
            }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
              item.done ? "border-[#7C9C57] bg-[#7C9C57]" : "border-[#D8CCBF]"
            }`}>
              {item.done && <span className="text-white text-[10px]">✓</span>}
            </div>
            <span className={`flex-1 text-[14px] font-semibold text-text-heading ${item.done ? "line-through text-text-muted" : ""}`}>
              {item.name}
            </span>
            <span className={`text-[13px] font-bold shrink-0 ${item.done ? "text-text-muted" : "text-[#CB7637]"}`}>
              ×{item.quantity}
            </span>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[#D8CCBF] flex items-center justify-between">
        <div className={`flex items-center gap-1 text-[12px] font-semibold ${order.elapsed >= 15 ? "text-[#D55C4C]" : order.elapsed >= 8 ? "text-[#D6A144]" : "text-text-muted"}`}>
          <Clock size={12} />
          {order.elapsed}m ago
        </div>
        {order.stage !== "completed" && (
          <button
            onClick={() => onAdvanceStage(order.id)}
            className={`flex items-center gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-[10px] transition-all ${
              allDone || order.stage === "to-cook"
                ? "bg-[#CB7637] hover:bg-[#B86830] text-white"
                : "bg-[#F1ECE5] hover:bg-[#E8DECE] text-text-heading"
            }`}
          >
            {order.stage === "to-cook" ? "Start" : "Ready"}
            <ChevronRight size={13} />
          </button>
        )}
        {order.stage === "completed" && (
          <span className="text-[12px] font-bold text-[#7C9C57]">✓ Done</span>
        )}
      </div>
    </div>
  );
}
