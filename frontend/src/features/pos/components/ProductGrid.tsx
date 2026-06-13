"use client";

import React, { useState } from "react";
import { Search, Plus } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  categoryColor: string;
  emoji: string;
}

export const allProducts: Product[] = [
  { id: 1,  name: "Espresso",               price: 2.50,  category: "Coffee",             categoryColor: "#C9783A", emoji: "☕" },
  { id: 2,  name: "Caffe Latte",             price: 4.20,  category: "Coffee",             categoryColor: "#C9783A", emoji: "☕" },
  { id: 3,  name: "Cappuccino",              price: 4.20,  category: "Coffee",             categoryColor: "#C9783A", emoji: "☕" },
  { id: 4,  name: "Cold Brew Coffee",        price: 4.00,  category: "Cold Beverages",     categoryColor: "#866443", emoji: "🧊" },
  { id: 5,  name: "Chocolate Milkshake",     price: 4.80,  category: "Cold Beverages",     categoryColor: "#866443", emoji: "🥛" },
  { id: 6,  name: "Butter Croissant",        price: 3.00,  category: "Bakery",             categoryColor: "#D6A144", emoji: "🥐" },
  { id: 7,  name: "Blueberry Muffin",        price: 3.20,  category: "Bakery",             categoryColor: "#D6A144", emoji: "🧁" },
  { id: 8,  name: "Chicken Club Sandwich",   price: 8.50,  category: "Sandwiches & Wraps", categoryColor: "#789658", emoji: "🥪" },
  { id: 9,  name: "Chocolate Chip Cookie",   price: 2.50,  category: "Bakery",             categoryColor: "#D6A144", emoji: "🍪" },
  { id: 10, name: "Matcha Latte",            price: 4.90,  category: "Tea & Chai",         categoryColor: "#A86D4D", emoji: "🍵" },
  { id: 11, name: "Masala Chai",             price: 3.50,  category: "Tea & Chai",         categoryColor: "#A86D4D", emoji: "🧋" },
  { id: 12, name: "New York Cheesecake",     price: 5.50,  category: "Desserts",           categoryColor: "#78964E", emoji: "🍰" },
];

const categories = ["All", ...Array.from(new Set(allProducts.map(p => p.category)))];

interface ProductGridProps {
  onAddToCart: (product: Product) => void;
}

export function ProductGrid({ onAddToCart }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = allProducts.filter(p => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-surface border border-border-custom rounded-[12px] pl-9 pr-4 py-2.5 text-[14px] font-medium text-text-heading placeholder:text-text-muted outline-none focus:border-primary transition-colors theme-transition"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 px-3.5 py-1.5 rounded-[10px] text-[13px] font-semibold transition-all whitespace-nowrap ${
              activeCategory === cat
                ? "bg-primary text-white shadow-sm"
                : "bg-surface text-text-muted hover:text-text-body"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto no-scrollbar flex-1 pr-1">
        {filtered.map(product => (
          <button
            key={product.id}
            onClick={() => onAddToCart(product)}
            className="bg-surface border border-border-custom rounded-[16px] p-3.5 flex flex-col gap-2 text-left hover:border-primary hover:bg-primary/10 hover:-translate-y-0.5 active:scale-[0.97] transition-all duration-150 group theme-transition"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{product.emoji}</span>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: product.categoryColor }}
              >
                {product.category}
              </span>
            </div>
            <div>
              <p className="text-[13px] font-bold text-text-heading leading-tight">{product.name}</p>
              <p className="text-[15px] font-bold text-primary mt-0.5">${product.price.toFixed(2)}</p>
            </div>
            <div className="flex items-center justify-end">
              <span className="w-7 h-7 rounded-full bg-primary group-hover:brightness-105 flex items-center justify-center transition-colors">
                <Plus size={14} className="text-white" />
              </span>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-text-muted">
            <span className="text-3xl mb-2">🔍</span>
            <span className="text-[14px] font-semibold">No products found</span>
          </div>
        )}
      </div>
    </div>
  );
}
