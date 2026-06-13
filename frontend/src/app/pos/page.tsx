"use client";

import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { ProductGrid, allProducts } from "@/features/pos/components/ProductGrid";
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
  const [token, setToken] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<{
    recommendedProductId: string;
    recommendedProductName: string;
    recommendedProductPrice: number;
    reason: string;
  } | null>(null);

  // Auto-login to obtain JWT token for AI recommendations
  useEffect(() => {
    async function autoLogin() {
      try {
        const response = await fetch("http://localhost:3000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "admin@cafe.com",
            password: "Admin@123",
          }),
        });
        if (response.ok) {
          const data = await response.json();
          setToken(data.accessToken);
        }
      } catch (err) {
        console.error("POS recommendation auto-login error:", err);
      }
    }
    autoLogin();
  }, []);

  // Fetch recommendation whenever cart items change
  useEffect(() => {
    if (!token) return;
    if (cartItems.length === 0) {
      setRecommendation(null);
      return;
    }

    const productNames = cartItems.map(item => item.name);
    
    const fetchRecommendation = async () => {
      try {
        const response = await fetch("http://localhost:3000/products/recommend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productIds: productNames,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          if (data && data.recommendedProductName) {
            setRecommendation(data);
          } else {
            setRecommendation(null);
          }
        }
      } catch (err) {
        console.error("Failed to fetch recommendation:", err);
      }
    };

    const timeoutId = setTimeout(fetchRecommendation, 300);
    return () => clearTimeout(timeoutId);
  }, [cartItems, token]);

  const handleAddRecommendation = () => {
    if (!recommendation) return;
    const foundProduct = allProducts.find(
      p => p.name.toLowerCase() === recommendation.recommendedProductName.toLowerCase()
    );
    if (foundProduct) {
      addToCart(foundProduct);
    }
  };

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
            className="flex items-center gap-2 bg-surface hover:bg-border-custom/30 border border-border-custom text-text-heading text-[13px] font-bold px-4 py-2 rounded-[12px] transition-colors theme-transition"
          >
            <MapPin size={15} className="text-primary" />
            {selectedTable ? selectedTable.number : "Select Table"}
          </button>
          {selectedTable && (
            <span className="text-[13px] text-text-muted font-semibold">
              {selectedTable.seats} seats
            </span>
          )}
        </div>
        {kitchenSent && (
          <div className="flex items-center gap-2 bg-success/10 text-success text-[13px] font-bold px-4 py-2 rounded-[12px] animate-pulse">
            ✅ Order sent to kitchen!
          </div>
        )}
      </div>

      {/* Main POS Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px] gap-5 flex-1 min-h-0">
        {/* Left: Product Grid */}
        <div className="bg-surface border border-border-custom rounded-[20px] p-5 min-h-[500px] lg:h-full overflow-hidden flex flex-col theme-transition">
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
            recommendation={recommendation}
            onAddRecommendation={handleAddRecommendation}
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
