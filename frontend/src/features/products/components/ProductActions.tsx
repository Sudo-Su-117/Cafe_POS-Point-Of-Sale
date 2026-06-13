"use client";

import React from "react";
import { Pencil, Trash2 } from "lucide-react";

interface ProductActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function ProductActions({ onEdit, onDelete }: ProductActionsProps) {
  return (
    <div className="flex items-center gap-2.5">
      <button
        onClick={onEdit}
        className="w-[30px] h-[30px] rounded-full bg-[#F3ECE3] text-[#9A846F] hover:brightness-[0.97] transition-all flex items-center justify-center cursor-pointer select-none"
        title="Edit Product"
      >
        <Pencil size={14} strokeWidth={2} />
      </button>

      <button
        onClick={onDelete}
        className="w-[30px] h-[30px] rounded-full bg-[#FBE7E3] text-[#D96052] hover:brightness-[0.97] transition-all flex items-center justify-center cursor-pointer select-none"
        title="Delete Product"
      >
        <Trash2 size={14} strokeWidth={2} />
      </button>
    </div>
  );
}
