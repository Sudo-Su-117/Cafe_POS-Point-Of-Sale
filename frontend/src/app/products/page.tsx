"use client";

import React, { useState } from "react";
import { Product } from "@/lib/product-types";
import { ProductTable } from "@/features/products/components/ProductTable";
import { ProductModal } from "@/features/products/components/ProductModal";
import { Plus } from "lucide-react";

const INITIAL_PRODUCTS: Product[] = [
  { id: "1", name: "Flat White", category: "Espresso", price: 5.50, uom: "Cup", tax: "8%", active: true },
  { id: "2", name: "Nitro Cold Brew", category: "Cold Brew", price: 6.50, uom: "Can", tax: "8%", active: true },
  { id: "3", name: "Butter Croissant", category: "Pastries", price: 4.50, uom: "Piece", tax: "5%", active: true },
  { id: "4", name: "BLT Club", category: "Sandwiches", price: 11.00, uom: "Piece", tax: "5%", active: true },
  { id: "5", name: "Chai Latte", category: "Tea", price: 5.00, uom: "Cup", tax: "8%", active: false },
  { id: "6", name: "Avocado Toast", category: "Sandwiches", price: 9.00, uom: "Plate", tax: "5%", active: true },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Toggle active status
  const handleToggleActive = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  // Delete product
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Open modal for editing
  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Open modal for new product
  const handleNewClick = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  // Save/Create product handler
  const handleSaveProduct = (productForm: Omit<Product, "id"> & { id?: string }) => {
    if (productForm.id) {
      // Edit
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productForm.id ? (productForm as Product) : p
        )
      );
    } else {
      // Create
      const newProduct: Product = {
        ...productForm,
        id: Math.random().toString(36).substring(2, 9),
      };
      setProducts((prev) => [...prev, newProduct]);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto font-sans">
      
      {/* Title & Action Row */}
      <div className="flex items-center justify-between select-none">
        <h2 className="text-[20px] font-bold text-text-heading font-sans">
          Products
        </h2>
        
        {/* + New Product Button */}
        <button
          onClick={handleNewClick}
          className="h-[44px] px-5 rounded-[14px] bg-[#C9783A] text-white text-[14px] font-bold flex items-center gap-2 hover:brightness-105 hover:translate-y-[-1px] transition-all duration-200 shadow-[0_2px_6px_rgba(201,120,58,0.2)] cursor-pointer"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>New Product</span>
        </button>
      </div>

      {/* Product Table Container */}
      <section className="mt-1">
        <ProductTable
          products={products}
          onEdit={handleEditClick}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
        />
      </section>

      {/* CRUD Product Modal Overlay */}
      {isModalOpen && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveProduct}
          product={selectedProduct}
        />
      )}

    </div>
  );
}
