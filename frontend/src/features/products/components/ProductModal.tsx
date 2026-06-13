"use client";

import React, { useState } from "react";
import { Product } from "@/lib/product-types";
import { X } from "lucide-react";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, "id"> & { id?: string }) => void;
  product?: Product | null; // If editing, we pass the product details
}

const CATEGORIES: Product["category"][] = ["Espresso", "Cold Brew", "Pastries", "Sandwiches", "Tea"];
const UOMS = ["Cup", "Can", "Piece", "Plate", "Bottle"];
const TAXES = ["5%", "8%", "10%", "0%"];

export function ProductModal({ isOpen, onClose, onSave, product }: ProductModalProps) {
  const [name, setName] = useState(product ? product.name : "");
  const [category, setCategory] = useState<Product["category"]>(product ? product.category : "Espresso");
  const [price, setPrice] = useState(product ? product.price.toString() : "");
  const [uom, setUom] = useState(product ? product.uom : "Cup");
  const [tax, setTax] = useState(product ? product.tax : "8%");
  const [active, setActive] = useState(product ? product.active : true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || isNaN(parseFloat(price))) return;

    onSave({
      id: product?.id,
      name: name.trim(),
      category,
      price: parseFloat(price),
      uom,
      tax,
      active,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#F7F3ED] border border-[#D8CCBF] rounded-[20px] shadow-xl w-full max-w-[500px] overflow-hidden flex flex-col hover:translate-y-0 transition-transform duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D8CCBF]/60 bg-[#EFE8DE]">
          <h3 className="text-[18px] font-bold text-text-heading font-sans">
            {product ? "Edit Product" : "New Product"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-text-muted hover:text-text-heading hover:bg-[#DCCFC1]/50 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 font-sans">
          
          {/* Product Name */}
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
              className="h-[42px] px-3.5 rounded-[10px] bg-white border border-[#D8CCBF] text-[14px] font-medium text-text-heading outline-none focus:border-[#C9783A] focus:ring-2 focus:ring-[#C9783A]/10 transition-all placeholder:text-[#9A8A7C]"
            />
          </div>

          {/* Grid: Category and Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-[13px] font-bold text-text-body mb-1.5 uppercase tracking-wider">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Product["category"])}
                className="h-[42px] px-3.5 rounded-[10px] bg-white border border-[#D8CCBF] text-[14px] font-semibold text-text-heading outline-none focus:border-[#C9783A] transition-all cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
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
                className="h-[42px] px-3.5 rounded-[10px] bg-white border border-[#D8CCBF] text-[14px] font-medium text-text-heading outline-none focus:border-[#C9783A] focus:ring-2 focus:ring-[#C9783A]/10 transition-all placeholder:text-[#9A8A7C]"
              />
            </div>
          </div>

          {/* Grid: UOM and Tax */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-[13px] font-bold text-text-body mb-1.5 uppercase tracking-wider">
                UOM
              </label>
              <select
                value={uom}
                onChange={(e) => setUom(e.target.value)}
                className="h-[42px] px-3.5 rounded-[10px] bg-white border border-[#D8CCBF] text-[14px] font-semibold text-text-heading outline-none focus:border-[#C9783A] transition-all cursor-pointer"
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
                className="h-[42px] px-3.5 rounded-[10px] bg-white border border-[#D8CCBF] text-[14px] font-semibold text-text-heading outline-none focus:border-[#C9783A] transition-all cursor-pointer"
              >
                {TAXES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status Toggle option inside modal */}
          <div className="flex items-center justify-between border-t border-[#D8CCBF]/60 pt-4 mt-2 select-none">
            <span className="text-[14px] font-bold text-text-body">
              Active in Menu
            </span>
            <button
              type="button"
              onClick={() => setActive(!active)}
              className={`relative inline-flex h-[26px] w-[48px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                active ? "bg-[#789658]" : "bg-[#E5DED5]"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  active ? "translate-x-[22px]" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Buttons Row */}
          <div className="flex items-center justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="h-[40px] px-5 rounded-[12px] bg-[#EFE8DE] text-text-body text-[14px] font-bold hover:bg-[#DCCFC1]/70 transition-colors cursor-pointer select-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-[40px] px-5 rounded-[12px] bg-[#C9783A] text-white text-[14px] font-bold hover:brightness-105 transition-all shadow-[0_2px_4px_rgba(201,120,58,0.2)] cursor-pointer select-none"
            >
              Save Product
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
