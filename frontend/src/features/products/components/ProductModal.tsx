"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Product, ProductFormData } from "@/lib/product-types";
import { X } from "lucide-react";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: any) => void;
  product?: Product | null;
  categories: Array<{ id: string; name: string }>;
}

const UOMS = ["Cup", "Can", "Piece", "Plate", "Bottle"];
const TAXES = ["5%", "8%", "10%", "0%"];

export function ProductModal({ isOpen, onClose, onSave, product, categories }: ProductModalProps) {
  const [name, setName] = useState(product ? product.name : "");
  const [categoryId, setCategoryId] = useState(product && (product as any).categoryId ? (product as any).categoryId : (categories[0]?.id || ""));
  const [price, setPrice] = useState(product ? product.price.toString() : "");
  const [uom, setUom] = useState(product ? product.uom : "Cup");
  const [tax, setTax] = useState(product ? product.tax : "8%");
  const [active, setActive] = useState(product ? product.active : true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.imageUrl || null);

  if (!isOpen || typeof document === "undefined") return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || isNaN(parseFloat(price))) return;

    onSave({
      id: product?.id,
      name: name.trim(),
      categoryId,
      price: parseFloat(price),
      uom,
      tax,
      active,
      imageFile,
    });
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-modal-overlay-in"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-border-custom rounded-[20px] shadow-xl w-full max-w-[500px] overflow-hidden flex flex-col theme-transition"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-custom/60 bg-card-bg theme-transition">
          <h3 className="text-[18px] font-bold text-text-heading font-sans">
            {product ? "Edit Product" : "New Product"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-text-muted hover:text-text-heading hover:bg-border-custom/50 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 font-sans">
          {/* Image upload */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-text-body uppercase tracking-wider">
              Product Image
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageFile(file);
                    const reader = new FileReader();
                    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
                className="text-[13px] text-text-muted cursor-pointer"
              />
              {imagePreview && (
                <div className="relative w-10 h-10 rounded-[6px] overflow-hidden border border-border-custom shrink-0">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-[13px] font-bold text-text-body mb-1.5 uppercase tracking-wider">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Flat White"
              className="h-[42px] px-3.5 rounded-[10px] bg-white border border-border-custom text-[14px] font-medium text-text-heading outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-muted"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-[13px] font-bold text-text-body mb-1.5 uppercase tracking-wider">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="h-[42px] px-3.5 rounded-[10px] bg-white border border-border-custom text-[14px] font-semibold text-text-heading outline-none focus:border-primary transition-all cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-[13px] font-bold text-text-body mb-1.5 uppercase tracking-wider">
                Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 5.50"
                className="h-[42px] px-3.5 rounded-[10px] bg-white border border-border-custom text-[14px] font-medium text-text-heading outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-text-muted"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-[13px] font-bold text-text-body mb-1.5 uppercase tracking-wider">
                UOM
              </label>
              <select
                value={uom}
                onChange={(e) => setUom(e.target.value)}
                className="h-[42px] px-3.5 rounded-[10px] bg-white border border-border-custom text-[14px] font-semibold text-text-heading outline-none focus:border-primary transition-all cursor-pointer"
              >
                {UOMS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-[13px] font-bold text-text-body mb-1.5 uppercase tracking-wider">
                Tax Rate
              </label>
              <select
                value={tax}
                onChange={(e) => setTax(e.target.value)}
                className="h-[42px] px-3.5 rounded-[10px] bg-white border border-border-custom text-[14px] font-semibold text-text-heading outline-none focus:border-primary transition-all cursor-pointer"
              >
                {TAXES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border-custom/60 pt-4 mt-2 select-none">
            <span className="text-[14px] font-bold text-text-body">
              Active in Menu
            </span>
            <button
              type="button"
              onClick={() => setActive(!active)}
              className={`relative inline-flex h-[26px] w-[48px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                active ? "bg-success" : "bg-border-custom/50"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  active ? "translate-x-[22px]" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="h-[40px] px-5 rounded-[12px] bg-card-bg text-text-body text-[14px] font-bold hover:bg-border-custom/70 transition-colors cursor-pointer select-none theme-transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-[40px] px-5 rounded-[12px] bg-primary text-white text-[14px] font-bold hover:brightness-105 transition-all shadow-[0_2px_4px_rgba(201,120,58,0.2)] cursor-pointer select-none"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
