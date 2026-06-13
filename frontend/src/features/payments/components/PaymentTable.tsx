"use client";

import React from "react";
import { Pencil, Trash2, GripVertical, Banknote, CreditCard, QrCode } from "lucide-react";
import { PaymentMethod } from "./types";

const typeIconConfig = {
  Cash: { icon: Banknote,    bg: "bg-[#E7F3DD]", color: "text-[#7C9C57]"  },
  Card: { icon: CreditCard,  bg: "bg-[#EAF0FB]", color: "text-[#5B8FA8]"  },
  UPI:  { icon: QrCode,      bg: "bg-[#F2E5D6]", color: "text-[#CB7637]"  },
};

const typeBadge: Record<string, string> = {
  Cash: "bg-[#E7F3DD] text-[#7C9C57]",
  Card: "bg-[#EAF0FB] text-[#5B8FA8]",
  UPI:  "bg-[#F2E5D6] text-[#CB7637]",
};

interface PaymentTableProps {
  methods: PaymentMethod[];
  onEdit:   (m: PaymentMethod) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
}

export function PaymentTable({ methods, onEdit, onDelete, onToggleActive }: PaymentTableProps) {
  if (methods.length === 0) {
    return (
      <div className="bg-[#F7F3ED] border border-[#D8CCBF] rounded-[20px] flex flex-col items-center justify-center py-16 gap-3">
        <span className="text-4xl">💳</span>
        <p className="text-[15px] font-bold text-text-heading">No payment methods yet</p>
        <p className="text-[13px] text-text-muted">Click &quot;+ New&quot; to add your first payment method.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F7F3ED] border border-[#D8CCBF] rounded-[20px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      {/* Table header */}
      <div className="grid grid-cols-[32px_1fr_120px_160px_80px_80px] items-center px-5 py-3 bg-[#F1ECE5] border-b border-[#D8CCBF]">
        <span />
        <span className="text-[12px] font-bold text-text-heading uppercase tracking-wider">Payment Method</span>
        <span className="text-[12px] font-bold text-text-heading uppercase tracking-wider">Type</span>
        <span className="text-[12px] font-bold text-text-heading uppercase tracking-wider">ID / Reference</span>
        <span className="text-[12px] font-bold text-text-heading uppercase tracking-wider text-center">Active</span>
        <span className="text-[12px] font-bold text-text-heading uppercase tracking-wider text-center">Action</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-[#D8CCBF]/60">
        {methods.map(m => (
          <div
            key={m.id}
            className="grid grid-cols-[32px_1fr_120px_160px_80px_80px] items-center px-5 py-4 hover:bg-white/50 transition-colors group"
          >
            {/* Drag handle */}
            <div className="flex items-center">
              <GripVertical size={15} className="text-[#D8CCBF] group-hover:text-text-muted cursor-grab transition-colors" />
            </div>

            {/* Name + icon */}
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-[10px] border border-[#D8CCBF] flex items-center justify-center shrink-0 ${typeIconConfig[m.type].bg}`}>
                {(() => { const Icon = typeIconConfig[m.type].icon; return <Icon size={18} strokeWidth={1.75} className={typeIconConfig[m.type].color} />; })()}
              </div>
              <div>
                <p className="text-[14px] font-bold text-text-heading">{m.name}</p>
              </div>
            </div>

            {/* Type badge */}
            <div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-bold ${typeBadge[m.type]}`}>
                {m.type}
              </span>
            </div>

            {/* UPI ID or dash */}
            <div>
              {m.type === "UPI" && m.upiId ? (
                <span className="text-[13px] font-mono font-semibold text-[#CB7637] bg-[#F2E5D6] px-2.5 py-1 rounded-[8px]">
                  {m.upiId}
                </span>
              ) : (
                <span className="text-[13px] text-text-muted font-medium">—</span>
              )}
            </div>

            {/* Active toggle */}
            <div className="flex justify-center">
              <button
                onClick={() => onToggleActive(m.id)}
                className={`relative inline-flex items-center w-10 h-[22px] rounded-full transition-colors duration-200 shrink-0 ${m.active ? "bg-[#7C9C57]" : "bg-[#D8CCBF]"}`}
              >
                <span className={`absolute left-[3px] w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${m.active ? "translate-x-[18px]" : "translate-x-0"}`} />
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-1.5">
              <button
                onClick={() => onEdit(m)}
                className="w-8 h-8 rounded-[9px] flex items-center justify-center bg-[#F1ECE5] hover:bg-[#E8DECE] text-text-muted hover:text-[#CB7637] transition-colors"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => onDelete(m.id)}
                className="w-8 h-8 rounded-[9px] flex items-center justify-center bg-[#F1ECE5] hover:bg-[#FFE3DE] text-text-muted hover:text-[#D55C4C] transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
