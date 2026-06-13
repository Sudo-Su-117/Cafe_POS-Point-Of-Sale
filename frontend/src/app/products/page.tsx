"use client";

import React, { useState } from "react";
import { Product, ProductViewMode, ProductFormData } from "@/lib/product-types";
import { INITIAL_PRODUCTS, DEFAULT_PRODUCT_IMAGE } from "@/lib/mock-products";
import { ProductTable } from "@/features/products/components/ProductTable";
import { ProductGrid } from "@/features/products/components/ProductGrid";
import { ProductModal } from "@/features/products/components/ProductModal";
import { ProductsToolbar } from "@/features/products/components/ProductsToolbar";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [viewMode, setViewMode] = useState<ProductViewMode>("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleToggleActive = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleNewClick = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleViewModeChange = (mode: ProductViewMode) => {
    setViewMode(mode);
  };

  const handleSaveProduct = (productForm: ProductFormData) => {
    if (productForm.id) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productForm.id
            ? {
                ...p,
                ...productForm,
                imageUrl: p.imageUrl,
                sizes: p.sizes,
                defaultSize: p.defaultSize,
              }
            : p
        )
      );
    } else {
      const newProduct: Product = {
        ...productForm,
        id: Math.random().toString(36).substring(2, 9),
        imageUrl: DEFAULT_PRODUCT_IMAGE,
        sizes: ["Small", "Large"],
        defaultSize: "Small",
      };
      setProducts((prev) => [...prev, newProduct]);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto font-sans">
      <ProductsToolbar
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onNewProduct={handleNewClick}
      />

      <section key={viewMode} className="mt-1">
        {viewMode === "grid" ? (
          <ProductGrid
            products={products}
            onEdit={handleEditClick}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
        ) : (
          <ProductTable
            products={products}
            onEdit={handleEditClick}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
        )}
      </section>

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
