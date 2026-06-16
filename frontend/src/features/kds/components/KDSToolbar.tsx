"use client";

import React from "react";
import { Search, LayoutGrid, Columns3, ChefHat, Coffee, Cookie } from "lucide-react";
import { KDSFilterStage, KDSViewMode, KDSStation } from "@/lib/kds-types";

interface KDSToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  filter: KDSFilterStage;
  onFilterChange: (filter: KDSFilterStage) => void;
  viewMode: KDSViewMode;
  onViewModeChange: (mode: KDSViewMode) => void;
  activeStation: KDSStation;
  onStationChange: (station: KDSStation) => void;
}

const filters: { key: KDSFilterStage; label: string }[] = [
  { key: "all", label: "All Statuses" },
  { key: "to-cook", label: "To Cook" },
  { key: "preparing", label: "Preparing" },
  { key: "ready", label: "Ready" },
];

const stations: { key: KDSStation; label: string; icon: React.ComponentType<any> }[] = [
  { key: "all", label: "All Stations", icon: LayoutGrid },
  { key: "kitchen", label: "Kitchen", icon: ChefHat },
  { key: "beverage", label: "Barista", icon: Coffee },
  { key: "bakery", label: "Bakery", icon: Cookie },
];

export function KDSToolbar({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  viewMode,
  onViewModeChange,
  activeStation,
  onStationChange,
}: KDSToolbarProps) {
  return (
    <div className="shrink-0 flex flex-wrap items-center justify-between gap-4 px-7 py-3 border-b border-kds-border/60 bg-kds-bg/50">
      <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-kds-muted pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search order or table..."
            className="kds-focus-ring w-full h-10 pl-10 pr-4 rounded-xl bg-kds-search-bg border border-kds-border text-[14px] font-medium text-kds-text placeholder:text-kds-muted outline-none focus:border-kds-amber transition-colors theme-transition"
          />
        </div>

        {/* Station Tabs Filter */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-kds-elevated border border-kds-border theme-transition">
          {stations.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => onStationChange(s.key)}
                className={`kds-focus-ring flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-bold transition-all duration-150 cursor-pointer ${
                  activeStation === s.key
                    ? "bg-kds-amber text-kds-action-primary-text shadow-sm"
                    : "text-kds-muted hover:text-kds-text"
                }`}
              >
                <Icon size={13} />
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => onFilterChange(f.key)}
              className={`kds-focus-ring h-10 px-3.5 rounded-full text-[12px] font-bold transition-all duration-200 cursor-pointer border ${
                filter === f.key
                  ? "bg-kds-filter-active-bg border-kds-filter-active-bg text-kds-filter-active-text"
                  : "bg-transparent border-kds-border text-kds-text hover:border-kds-amber/50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Kanban Columns vs Grid Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-kds-elevated border border-kds-border theme-transition">
          <button
            type="button"
            onClick={() => onViewModeChange("kanban")}
            aria-pressed={viewMode === "kanban"}
            aria-label="Column view"
            className={`kds-focus-ring flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-bold transition-colors cursor-pointer ${
              viewMode === "kanban"
                ? "bg-kds-amber text-kds-action-primary-text"
                : "text-kds-muted hover:text-kds-text"
            }`}
          >
            <Columns3 size={13} />
            Columns
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            aria-pressed={viewMode === "grid"}
            aria-label="Grid view"
            className={`kds-focus-ring flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-bold transition-colors cursor-pointer ${
              viewMode === "grid"
                ? "bg-kds-amber text-kds-action-primary-text"
                : "text-kds-muted hover:text-kds-text"
            }`}
          >
            <LayoutGrid size={13} />
            Grid
          </button>
        </div>
      </div>
    </div>
  );
}
