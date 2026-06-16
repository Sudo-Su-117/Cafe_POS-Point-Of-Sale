"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChefHat, Wifi, Monitor, LogOut, Sparkles } from "lucide-react";
import { KDSFilterStage, KDSStage, KDS_STAGE_LABELS } from "@/lib/kds-types";

interface KDSHeaderProps {
  counts: Record<KDSStage, number>;
  filter: KDSFilterStage;
  onFilterChange: (filter: KDSFilterStage) => void;
  onSimulateOrder?: () => void;
}

const counterConfig: {
  stage: KDSStage;
  filterKey: KDSFilterStage;
  dotClass: string;
  bgClass: string;
  textClass: string;
}[] = [
  {
    stage: "to-cook",
    filterKey: "to-cook",
    dotClass: "bg-kds-amber",
    bgClass: "bg-kds-amber-bg/60 border-kds-amber/30",
    textClass: "text-kds-amber",
  },
  {
    stage: "preparing",
    filterKey: "preparing",
    dotClass: "bg-kds-orange",
    bgClass: "bg-kds-orange-bg/60 border-kds-orange/30",
    textClass: "text-kds-orange",
  },
  {
    stage: "ready",
    filterKey: "ready",
    dotClass: "bg-kds-green",
    bgClass: "bg-kds-green-bg/60 border-kds-green/30",
    textClass: "text-kds-green",
  },
];

export function KDSHeader({ counts, filter, onFilterChange, onSimulateOrder }: KDSHeaderProps) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })
      );
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="h-[72px] shrink-0 flex flex-wrap items-center justify-between gap-4 px-7 border-b border-kds-border bg-kds-bg shadow-[0_2px_8px_rgba(0,0,0,0.06)] theme-transition">
      <div className="flex items-center gap-3">
        <ChefHat size={28} strokeWidth={1.75} className="text-kds-amber" />
        <div>
          <h1 className="text-[22px] font-bold text-kds-text leading-none">Kitchen Display</h1>
          <p className="text-[12px] font-medium text-kds-muted mt-0.5">
            {time} · Morning Shift
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 order-last w-full sm:order-none sm:w-auto justify-center">
        {counterConfig.map(({ stage, filterKey, bgClass, textClass }) => {
          const isActive = filter === filterKey;
          return (
            <button
              key={stage}
              type="button"
              onClick={() => onFilterChange(isActive ? "all" : filterKey)}
              aria-pressed={isActive}
              className={`kds-focus-ring flex items-center gap-3 px-4 py-1.5 rounded-xl border transition-all duration-200 cursor-pointer ${bgClass} ${
                isActive ? "ring-2 ring-offset-1 ring-offset-kds-bg ring-current scale-[1.02]" : "hover:brightness-110"
              } ${textClass}`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider opacity-85">
                {KDS_STAGE_LABELS[stage]}
              </span>
              <span className="text-[22px] font-bold tabular-nums leading-none">
                {counts[stage]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2.5">
        {/* Simulate Order Button */}
        {onSimulateOrder && (
          <button
            type="button"
            onClick={onSimulateOrder}
            className="kds-focus-ring flex items-center gap-2 h-9 px-4 rounded-xl bg-kds-amber hover:bg-kds-amber/90 text-kds-action-primary-text text-[12px] font-bold transition-all shadow-[0_2px_6px_rgba(217,119,6,0.15)] active:scale-[0.97] cursor-pointer"
          >
            <Sparkles size={14} className="animate-pulse" />
            <span>Simulate Order</span>
          </button>
        )}

        <div className="h-9 px-3 rounded-full bg-kds-green/10 flex items-center gap-2">
          <Wifi size={14} className="text-kds-online" />
          <span className="text-[12px] font-semibold text-kds-online">Online</span>
          <span className="w-1.5 h-1.5 rounded-full bg-kds-online" />
        </div>

        <Link
          href="/pos"
          aria-label="Open POS"
          className="kds-focus-ring w-9 h-9 rounded-lg bg-kds-elevated border border-kds-border flex items-center justify-center text-kds-muted hover:text-kds-text hover:bg-kds-surface transition-colors"
        >
          <Monitor size={15} />
        </Link>

        <Link
          href="/login"
          aria-label="Logout"
          className="kds-focus-ring w-9 h-9 rounded-lg bg-kds-elevated border border-kds-border flex items-center justify-center text-kds-muted hover:text-kds-text hover:bg-kds-surface transition-colors"
        >
          <LogOut size={15} />
        </Link>
      </div>
    </header>
  );
}
