"use client";

import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { Category } from "./types";

const PRESET_COLORS = [
  "#C9783A", "#866443", "#D6A144", "#789658", "#A86D4D",
  "#D55C4C", "#7C9C57", "#5B8FA8", "#9B6A9B", "#4A7C8A",
  "#E8A45A", "#6B8E5E", "#C4616A", "#7A6E9B", "#3D8B7A",
  "#D4956B", "#8B7355", "#B5C4A0", "#A0B4C8", "#C4A882",
];

interface CategoryModalProps {
  mode: "add" | "edit";
  initial?: Category | null;
  existingNames: string[];
  onSave: (data: { name: string; color: string }) => void;
  onClose: () => void;
}

export function CategoryModal({ mode, initial, existingNames, onSave, onClose }: CategoryModalProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [color, setColor] = useState(initial?.color ?? PRESET_COLORS[0]);
  const [customColor, setCustomColor] = useState(initial?.color ?? PRESET_COLORS[0]);
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    if (initial) { setName(initial.name); setColor(initial.color); setCustomColor(initial.color); }
  }, [initial]);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) { setNameError("Category name is required."); return; }
    const isDupe = existingNames
      .filter(n => mode === "edit" ? n !== initial?.name : true)
      .some(n => n.toLowerCase() === trimmed.toLowerCase());
    if (isDupe) { setNameError("A category with this name already exists."); return; }
    onSave({ name: trimmed, color });
  };

  const isPreset = PRESET_COLORS.includes(color);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
      <div
        className="bg-surface border border-border-custom rounded-[24px] w-full max-w-[460px] shadow-2xl overflow-hidden theme-transition"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with accent strip */}
        <div className="h-[6px] w-full" style={{ backgroundColor: color }} />

        <div className="p-6 flex flex-col gap-5">
          {/* Title row */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[20px] font-bold text-text-heading">
                {mode === "add" ? "New Category" : "Edit Category"}
              </h2>
              <p className="text-[13px] text-text-muted mt-0.5">
                {mode === "add" ? "Add a new product category" : "Update category details"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-[12px] flex items-center justify-center bg-surface hover:bg-border-custom/30 text-text-muted hover:text-text-heading transition-colors theme-transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Preview pill */}
          <div className="flex items-center gap-3 bg-surface border border-border-custom rounded-[16px] px-4 py-3 theme-transition">
            <span className="text-[12px] font-semibold text-text-muted uppercase tracking-wider">Preview</span>
            <span
              className="px-3.5 py-1.5 rounded-full text-[13px] font-bold text-white shadow-sm select-none transition-all duration-200"
              style={{ backgroundColor: color }}
            >
              {name || "Category Name"}
            </span>
          </div>

          {/* Name field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-text-heading">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setNameError(""); }}
              placeholder="e.g. Espresso, Pastries…"
              className={`bg-surface border rounded-[12px] px-4 py-3 text-[14px] font-semibold text-text-heading placeholder:text-text-muted outline-none transition-colors ${
                nameError ? "border-danger focus:border-danger" : "border-border-custom focus:border-primary"
              }`}
            />
            {nameError && (
              <p className="text-[12px] font-semibold text-danger">{nameError}</p>
            )}
          </div>

          {/* Color picker */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[13px] font-bold text-text-heading">Color</label>

            {/* Preset grid */}
            <div className="grid grid-cols-10 gap-2">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => { setColor(c); setCustomColor(c); }}
                  className="w-8 h-8 rounded-[10px] border-2 flex items-center justify-center transition-all duration-150 hover:scale-110"
                  style={{
                    backgroundColor: c,
                    borderColor: color === c ? "var(--text-heading)" : "transparent",
                    boxShadow: color === c ? "0 0 0 2px white, 0 0 0 4px " + c : "none",
                  }}
                >
                  {color === c && <Check size={12} className="text-white" strokeWidth={3} />}
                </button>
              ))}
            </div>

            {/* Custom hex input */}
            <div className="flex items-center gap-3 bg-surface border border-border-custom rounded-[12px] px-3 py-2 theme-transition">
              <div
                className="w-7 h-7 rounded-[8px] border border-white/30 shrink-0 shadow-sm transition-all duration-200"
                style={{ backgroundColor: color }}
              />
              <span className="text-[12px] font-semibold text-text-muted uppercase tracking-wider">Custom</span>
              <input
                type="color"
                value={customColor}
                onChange={e => { setCustomColor(e.target.value); setColor(e.target.value); }}
                className="flex-1 h-7 cursor-pointer rounded bg-transparent border-none outline-none"
              />
              <span className="text-[12px] font-mono font-bold text-text-body uppercase">{color}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 bg-surface hover:bg-border-custom/30 text-text-heading text-[14px] font-bold py-3 rounded-[14px] transition-colors theme-transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 text-white text-[14px] font-bold py-3 rounded-[14px] transition-all hover:brightness-90 active:scale-[0.98]"
              style={{ backgroundColor: color }}
            >
              {mode === "add" ? "Create Category" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
