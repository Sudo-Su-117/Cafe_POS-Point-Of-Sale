"use client";

import React from "react";
import {
  ArrowRight,
  ChefHat,
  Check,
  AlertTriangle,
  Circle,
  CheckCircle2,
  GripVertical,
  Coffee,
  Cookie,
  Layers
} from "lucide-react";
import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { KDSOrder, KDSStage, KDSStation, getTimerUrgency } from "@/lib/kds-types";
import { KDSStatusBadge } from "./KDSStatusBadge";
import { KDSTimerBadge } from "./KDSTimerBadge";

interface KDSOrderCardProps {
  order: KDSOrder;
  onAdvanceStage: (id: string) => void;
  onDismiss: (id: string) => void;
  onToggleItem: (orderId: string, itemId: number) => void;
  showDragHandle?: boolean;
  isDragging?: boolean;
  dragHandleListeners?: SyntheticListenerMap;
  dragHandleAttributes?: DraggableAttributes;
  setDragHandleRef?: (element: HTMLElement | null) => void;
  isKanban?: boolean;
  activeStation?: KDSStation;
}

const topBarByStage: Record<KDSStage, string> = {
  "to-cook": "bg-kds-amber",
  preparing: "bg-kds-orange",
  ready: "bg-kds-green",
};

const actionConfig: Record<
  KDSStage,
  { label: string; icon: React.ReactNode; className: string }
> = {
  "to-cook": {
    label: "Start Cooking",
    icon: <ChefHat size={16} />,
    className: "bg-kds-amber text-kds-action-primary-text hover:bg-kds-amber/90",
  },
  preparing: {
    label: "Mark Ready",
    icon: <Check size={16} />,
    className: "bg-kds-orange text-white hover:bg-kds-orange/90",
  },
  ready: {
    label: "Dismiss Order",
    icon: <Check size={16} />,
    className: "bg-kds-green text-white hover:bg-kds-green/90",
  },
};

const stationIcons: Record<string, React.ReactNode> = {
  kitchen: <ChefHat size={11} className="text-[#D95C4D]" />,
  beverage: <Coffee size={11} className="text-[#C9783A]" />,
  bakery: <Cookie size={11} className="text-[#789658]" />,
};

const stationLabels: Record<string, string> = {
  kitchen: "KIT",
  beverage: "BEV",
  bakery: "BAK",
};

const stationBadgeClasses: Record<string, string> = {
  kitchen: "bg-red-50 text-[#D95C4D] border-red-100",
  beverage: "bg-orange-50 text-[#C9783A] border-orange-100",
  bakery: "bg-green-50 text-[#789658] border-green-100",
};

export function KDSOrderCard({
  order,
  onAdvanceStage,
  onDismiss,
  onToggleItem,
  showDragHandle = false,
  isDragging = false,
  dragHandleListeners,
  dragHandleAttributes,
  setDragHandleRef,
  isKanban = false,
  activeStation = "all",
}: KDSOrderCardProps) {
  const action = actionConfig[order.stage];
  const urgency = getTimerUrgency(order.elapsed);
  const isOverdue = urgency === "danger";
  const isWarning = urgency === "warning";
  const isNew = order.stage === "to-cook" && order.elapsed < 3;

  // Filter items based on active station
  const visibleItems = order.items.filter(
    (item) => activeStation === "all" || item.station === activeStation
  );
  const otherItemsCount = order.items.length - visibleItems.length;

  // Compute stations involved in the order for split order badges
  const distinctStations = Array.from(new Set(order.items.map((i) => i.station)));

  const handleAction = () => {
    if (order.stage === "ready") {
      onDismiss(order.id);
    } else {
      onAdvanceStage(order.id);
    }
  };

  // Modern card container styles based on urgency/drag state
  let cardClass = "bg-white dark:bg-zinc-900 border border-zinc-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]";
  
  if (isDragging) {
    cardClass = "border-2 border-dashed border-amber-500/50 opacity-40 scale-[0.98]";
  } else if (isOverdue) {
    cardClass = "border-2 border-red-500 bg-gradient-to-b from-red-50/40 to-white dark:from-red-950/5 dark:to-zinc-900 shadow-[0_0_15px_rgba(239,68,68,0.15)] animate-kds-pulse-danger";
  } else if (isWarning) {
    cardClass = "border-2 border-amber-500 bg-gradient-to-b from-amber-50/40 to-white dark:from-amber-950/5 dark:to-zinc-900 shadow-[0_0_12px_rgba(245,158,11,0.1)]";
  } else if (isNew) {
    cardClass = "border-2 border-emerald-500 bg-gradient-to-b from-emerald-50/40 to-white dark:from-emerald-950/5 dark:to-zinc-900 shadow-[0_0_12px_rgba(16,185,129,0.1)]";
  }

  return (
    <div
      className={`rounded-2xl flex flex-col shrink-0 transition-all duration-200 animate-kds-card-in select-none ${cardClass}`}
    >
      <div className={`h-1.5 rounded-t-2xl ${topBarByStage[order.stage]}`} />

      {/* Header */}
      <div className="px-4.5 pt-4 pb-3 flex items-start justify-between gap-2 shrink-0 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <KDSStatusBadge stage={order.stage} isNew={isNew} />
            <KDSTimerBadge elapsed={order.elapsed} />
            
            {/* Overdue/Late alert tags */}
            {isOverdue && (
              <span className="inline-flex items-center gap-0.5 h-6 px-2 rounded-full bg-red-600 text-white text-[9px] font-black uppercase tracking-wider animate-pulse">
                <AlertTriangle size={10} />
                <span>OVERDUE</span>
              </span>
            )}
            {isWarning && !isOverdue && (
              <span className="inline-flex items-center gap-0.5 h-6 px-2 rounded-full bg-amber-500 text-white text-[9px] font-extrabold uppercase tracking-wider">
                <AlertTriangle size={10} />
                <span>LATE</span>
              </span>
            )}

            {/* Split order indicator badge */}
            {distinctStations.length > 1 && (
              <span className="inline-flex items-center gap-1 h-6 px-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[9px] font-extrabold uppercase tracking-wider">
                <Layers size={9} />
                <span>Split ({distinctStations.length})</span>
              </span>
            )}
          </div>
          <div className="flex items-baseline justify-between mt-3">
            <div className="flex items-center gap-1.5">
              <h3 className="text-[26px] font-black text-zinc-900 dark:text-white leading-none tracking-tight tabular-nums">
                #{order.id.replace("ORD-", "")}
              </h3>
              <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 tabular-nums">
                ({order.id})
              </span>
            </div>
            <span className="text-[12px] font-extrabold text-amber-700 bg-amber-50 border border-amber-100/50 px-2.5 py-0.5 rounded-full dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30">
              {order.table}
            </span>
          </div>
        </div>

        {showDragHandle && (
          <button
            type="button"
            ref={setDragHandleRef}
            {...dragHandleListeners}
            {...dragHandleAttributes}
            aria-label={`Drag order ${order.id} to another column`}
            className="shrink-0 w-8.5 h-8.5 flex items-center justify-center rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-grab active:cursor-grabbing touch-none transition-colors border border-zinc-200/50 dark:border-zinc-700/50"
          >
            <GripVertical size={15} aria-hidden />
          </button>
        )}
      </div>

      {/* Item List */}
      <div className="flex-none px-4.5 py-3.5 flex flex-col gap-2">
        {visibleItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onToggleItem(order.id, item.id)}
            aria-pressed={item.done}
            className={`group flex items-center gap-3 w-full text-left rounded-xl transition-all duration-150 px-3 py-2 border select-none outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 ${
              item.done
                ? "bg-zinc-50/60 dark:bg-zinc-850/40 border-zinc-100 dark:border-zinc-800/60 opacity-55"
                : "bg-white dark:bg-zinc-850/80 shadow-[0_1px_3px_rgba(0,0,0,0.015)] border-zinc-200/60 dark:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-800"
            }`}
            style={{
              minHeight: "44px",
              borderLeftWidth: item.done ? "1px" : "4px",
              borderLeftColor: item.done 
                ? "transparent" 
                : item.station === "kitchen" 
                  ? "#D95C4D" 
                  : item.station === "beverage" 
                    ? "#C9783A" 
                    : "#789658"
            }}
          >
            <div className="flex items-center justify-center shrink-0">
              {item.done ? (
                <CheckCircle2
                  size={19}
                  className="text-emerald-600 dark:text-emerald-500 shrink-0 animate-kds-check-in"
                  aria-hidden
                />
              ) : (
                <Circle 
                  size={19} 
                  className="text-zinc-300 dark:text-zinc-600 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors shrink-0" 
                  aria-hidden 
                />
              )}
            </div>

            <span
              className={`text-[12px] font-extrabold shrink-0 w-8 text-center py-0.5 rounded-md tabular-nums ${
                item.done 
                  ? "text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800" 
                  : "text-amber-600 bg-amber-50 border border-amber-100/30 dark:text-amber-400 dark:bg-amber-950/30 dark:border-amber-900/30"
              }`}
            >
              x{item.quantity}
            </span>
            
            <span
              className={`text-[14px] font-semibold text-zinc-800 dark:text-zinc-200 flex-1 truncate ${
                item.done ? "line-through text-zinc-400 dark:text-zinc-500 font-medium" : ""
              }`}
            >
              {item.name}
            </span>

            {/* Station indicator badge */}
            <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded-md border flex items-center gap-0.5 shrink-0 transition-opacity ${item.done ? "opacity-40" : "opacity-100"} ${stationBadgeClasses[item.station]}`}>
              {stationIcons[item.station]}
              <span>{stationLabels[item.station]}</span>
            </span>
          </button>
        ))}

        {/* Muted count of items at other stations */}
        {otherItemsCount > 0 && (
          <div className="mt-1 text-center py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-dashed border-zinc-200 dark:border-zinc-700/60 text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
            + {otherItemsCount} other item{otherItemsCount !== 1 ? "s" : ""} on other stations
          </div>
        )}

        {/* Order note */}
        {order.note && (
          <div className="mt-1.5 mb-0.5 flex items-start gap-2 rounded-xl bg-amber-50 border-l-3 border-amber-500 px-3.5 py-2.5 dark:bg-amber-950/20 dark:border-amber-700">
            <AlertTriangle size={13} className="text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden />
            <p className="text-[12px] font-bold text-amber-900 dark:text-amber-300 leading-tight">
              {order.note}
            </p>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="p-4 pt-1.5 shrink-0 mt-auto">
        <button
          type="button"
          onClick={handleAction}
          className={`kds-focus-ring w-full rounded-xl flex items-center justify-center gap-2 text-[13px] font-black tracking-wide transition-all duration-150 active:scale-[0.98] cursor-pointer shadow-sm ${action.className}`}
          style={{ height: "42px" }}
        >
          {action.icon}
          <span>{action.label.toUpperCase()}</span>
          {order.stage === "to-cook" && <ArrowRight size={14} aria-hidden />}
        </button>
      </div>
    </div>
  );
}
