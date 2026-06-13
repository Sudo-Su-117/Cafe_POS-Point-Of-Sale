"use client";

import React from "react";
import { X, Users } from "lucide-react";

interface Table {
  id: number;
  number: string;
  seats: number;
  hasOrder: boolean;
}

const floors = [
  {
    name: "Ground Floor",
    tables: [
      { id: 1, number: "T1", seats: 2, hasOrder: false },
      { id: 2, number: "T2", seats: 4, hasOrder: true },
      { id: 3, number: "T3", seats: 4, hasOrder: false },
      { id: 4, number: "T4", seats: 2, hasOrder: true },
      { id: 5, number: "T5", seats: 6, hasOrder: false },
      { id: 6, number: "T6", seats: 4, hasOrder: false },
      { id: 7, number: "Bar", seats: 8, hasOrder: true },
    ],
  },
  {
    name: "First Floor",
    tables: [
      { id: 8,  number: "T8",  seats: 4, hasOrder: false },
      { id: 9,  number: "T9",  seats: 4, hasOrder: false },
      { id: 10, number: "T10", seats: 2, hasOrder: true  },
      { id: 11, number: "T11", seats: 6, hasOrder: false },
    ],
  },
];

interface FloorPopupProps {
  onClose: () => void;
  onSelectTable: (table: Table) => void;
}

export function FloorPopup({ onClose, onSelectTable }: FloorPopupProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-border-custom rounded-[22px] w-full max-w-[640px] max-h-[85vh] overflow-y-auto shadow-2xl theme-transition">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-custom">
          <div>
            <h2 className="text-[20px] font-bold text-text-heading">Select a Table</h2>
            <p className="text-[13px] text-text-muted mt-0.5">Choose a table to start or continue an order</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-[12px] hover:bg-surface text-text-muted transition-colors theme-transition">
            <X size={20} />
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 px-6 pt-4 text-[12px] font-semibold text-text-muted">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-[4px] bg-surface border border-border-custom theme-transition" />
            Available
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-[4px] bg-primary" />
            Has Active Order
          </div>
        </div>

        {/* Floors */}
        <div className="p-6 flex flex-col gap-7">
          {floors.map(floor => (
            <div key={floor.name}>
              <h3 className="text-[14px] font-bold text-text-muted uppercase tracking-wider mb-3">{floor.name}</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {floor.tables.map(table => (
                  <button
                    key={table.id}
                    onClick={() => { onSelectTable(table); onClose(); }}
                    className={`relative flex flex-col items-center justify-center gap-1.5 h-[90px] rounded-[16px] border-2 font-sans transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] ${
                      table.hasOrder
                        ? "bg-primary border-primary text-white shadow-md"
                        : "bg-surface border-border-custom text-text-heading hover:border-primary hover:bg-primary/10"
                    }`}
                  >
                    {table.hasOrder && (
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white/80 animate-pulse" />
                    )}
                    <span className="text-[18px] font-bold leading-none">{table.number}</span>
                    <div className={`flex items-center gap-1 text-[11px] font-semibold ${table.hasOrder ? "text-white/80" : "text-text-muted"}`}>
                      <Users size={11} />
                      {table.seats}
                    </div>
                    {table.hasOrder && (
                      <span className="text-[10px] font-bold text-white/90">Active</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
