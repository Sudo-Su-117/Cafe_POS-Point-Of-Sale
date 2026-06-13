"use client";

import React, { useState } from "react";
import { MapPin } from "lucide-react";
import { ProductGrid } from "@/features/pos/components/ProductGrid";
import { Cart, CartItem } from "@/features/pos/components/Cart";
import { FloorPopup } from "@/features/pos/components/FloorPopup";
import { PaymentModal } from "@/features/pos/components/PaymentModal";

interface Table { id: number; number: string; seats: number; hasOrder: boolean; }

export default function POSPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showFloor, setShowFloor] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [kitchenSent, setKitchenSent] = useState(false);

  const addToCart = (product: { id: number; name: string; price: number; emoji: string }) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCartItems(prev =>
      prev.flatMap(i => {
        const newQty = i.quantity + delta;
        if (newQty <= 0) return [];
        return [{ ...i, quantity: newQty }];
      })
    );
  };

  const removeItem = (id: number) => setCartItems(prev => prev.filter(i => i.id !== id));

  const sendToKitchen = () => {
    setKitchenSent(true);
    setTimeout(() => setKitchenSent(false), 3000);
  };

  const handlePaymentSuccess = () => {
    setCartItems([]);
    setShowPayment(false);
    setSelectedTable(null);
  };

  const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0) * 1.08;

  return (
    <div className="flex flex-col h-full gap-4">
      {/* POS Header bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFloor(true)}
            className="flex items-center gap-2 bg-[#F1ECE5] hover:bg-[#E8DECE] border border-[#D8CCBF] text-text-heading text-[13px] font-bold px-4 py-2 rounded-[12px] transition-colors"
          >
            <MapPin size={15} className="text-[#CB7637]" />
            {selectedTable ? selectedTable.number : "Select Table"}
          </button>
          {selectedTable && (
            <span className="text-[13px] text-text-muted font-semibold">
              {selectedTable.seats} seats
            </span>
          )}
        </div>
        {kitchenSent && (
          <div className="flex items-center gap-2 bg-[#E7F3DD] text-[#7C9C57] text-[13px] font-bold px-4 py-2 rounded-[12px] animate-pulse">
            ✅ Order sent to kitchen!
          </div>
        )}
      </div>

      {/* Main POS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] gap-5 flex-1 min-h-0">
        {/* Left: Product Grid */}
        <div className="bg-[#F7F3ED] border border-[#D8CCBF] rounded-[20px] p-5 min-h-[500px] lg:h-full overflow-hidden flex flex-col">
          <ProductGrid onAddToCart={addToCart} />
        </div>

        {/* Right: Cart */}
        <div className="min-h-[400px] lg:h-full">
          <Cart
            items={cartItems}
            onUpdateQty={updateQty}
            onRemove={removeItem}
            onSendToKitchen={sendToKitchen}
            onCheckout={() => setShowPayment(true)}
          />
        </div>
      </div>

      {/* Floor Popup */}
      {showFloor && (
        <FloorPopup
          onClose={() => setShowFloor(false)}
          onSelectTable={(t) => setSelectedTable(t)}
        />
      )}

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          total={total}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
