"use client";

import React from "react";
import { Product } from "@/lib/product-types";

interface CategoryBadgeProps {
  category: Product["category"];
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const styles = {
    Espresso: "bg-[#F3E7DB] text-[#C9783A]",
    "Cold Brew": "bg-[#EEE8DF] text-[#866443]",
    Pastries: "bg-[#EAF0DE] text-[#8FA55A]",
    Sandwiches: "bg-[#F0E3DD] text-[#B67A58]",
    Tea: "bg-[#F8ECD8] text-[#D5A04B]",
  };

  return (
    <span
      className={`inline-flex items-center justify-center h-[24px] px-3 rounded-full text-[13px] font-medium font-sans select-none border border-black/5 ${
        styles[category] || "bg-gray-100 text-gray-800"
      }`}
    >
      {category}
    </span>
  );
}
