"use client";

import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { ProductGrid } from "@/features/pos/components/ProductGrid";
import { Cart, CartItem } from "@/features/pos/components/Cart";
import { FloorPopup } from "@/features/pos/components/FloorPopup";
import { PaymentModal } from "@/features/pos/components/PaymentModal";

interface Table {
  id: string;
  number: string;
  seats: number;
  hasOrder: boolean;
  status: string;
}

interface POSProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  categoryColor: string;
  emoji: string;
}

const getEmojiForProduct = (name: string, category: string): string => {
  const n = name.toLowerCase();
  const c = category.toLowerCase();
  if (n.includes("espresso") || n.includes("latte") || n.includes("cappuccino") || n.includes("flat white") || c.includes("coffee")) return "☕";
  if (n.includes("brew") || n.includes("iced") || n.includes("cold")) return "🧊";
  if (n.includes("shake") || n.includes("smoothie") || n.includes("milk")) return "🥛";
  if (n.includes("croissant")) return "🥐";
  if (n.includes("muffin")) return "🧁";
  if (n.includes("sandwich") || n.includes("wrap") || n.includes("panini") || n.includes("club") || n.includes("blt")) return "🥪";
  if (n.includes("cookie")) return "🍪";
  if (n.includes("tea") || n.includes("chai") || n.includes("matcha")) return "🍵";
  if (n.includes("cake") || n.includes("cheesecake") || n.includes("dessert") || n.includes("pastry")) return "🍰";
  return "🍔";
};

const POS_STORAGE_KEY = "pos-cart-state";

function loadPOSState() {
  try {
    const stored = sessionStorage.getItem(POS_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return null;
}

function savePOSState(data: { cartItems: CartItem[]; selectedTable: Table | null; activeOrderId: string | null }) {
  try {
    sessionStorage.setItem(POS_STORAGE_KEY, JSON.stringify(data));
  } catch { /* ignore */ }
}

function clearPOSState() {
  try {
    sessionStorage.removeItem(POS_STORAGE_KEY);
    sessionStorage.removeItem("pos-applied-coupon");
  } catch { /* ignore */ }
}

export default function POSPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showFloor, setShowFloor] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [kitchenSent, setKitchenSent] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [tables, setTables] = useState<any[]>([]);
  const [products, setProducts] = useState<POSProduct[]>([]);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<{
    recommendedProductId: string;
    recommendedProductName: string;
    recommendedProductPrice: number;
    reason: string;
  } | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; value: number; minOrderAmount?: number | null } | null>(null);
  const [loadedTableId, setLoadedTableId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Restore POS state from sessionStorage on mount
  useEffect(() => {
    const saved = loadPOSState();
    if (saved) {
      if (saved.cartItems) setCartItems(saved.cartItems);
      if (saved.selectedTable) {
        setSelectedTable(saved.selectedTable);
        setLoadedTableId(saved.selectedTable.id);
      }
      if (saved.activeOrderId) setActiveOrderId(saved.activeOrderId);
    }
    setIsLoaded(true);
  }, []);

  // Restore applied coupon from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("pos-applied-coupon");
      if (stored) {
        setAppliedCoupon(JSON.parse(stored));
      }
    } catch { /* ignore */ }
  }, []);

  // Persist applied coupon to sessionStorage
  useEffect(() => {
    try {
      if (appliedCoupon) {
        sessionStorage.setItem("pos-applied-coupon", JSON.stringify(appliedCoupon));
      } else {
        sessionStorage.removeItem("pos-applied-coupon");
      }
    } catch { /* ignore */ }
  }, [appliedCoupon]);

  // Persist POS state to sessionStorage whenever cart, table, or order changes
  useEffect(() => {
    if (isLoaded) {
      savePOSState({ cartItems, selectedTable, activeOrderId });
    }
  }, [cartItems, selectedTable, activeOrderId, isLoaded]);

  // Auto-login to obtain JWT token
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
        console.error("POS auto-login error:", err);
      }
    }
    autoLogin();
  }, []);

  // Fetch current open session or create one, plus fetch POS data
  const initializePOS = async (jwt: string) => {
    const headers = { Authorization: `Bearer ${jwt}` };
    try {
      // 1. Session check/creation
      const sessionRes = await fetch("http://localhost:3000/sessions/current", { headers });
      if (sessionRes.status === 404) {
        // Create session
        const openRes = await fetch("http://localhost:3000/sessions/open", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: JSON.stringify({ openingAmount: 1000 }),
        });
        if (openRes.ok) {
          const openData = await openRes.json();
          setSessionId(openData.session?.id || openData.data?.id || openData.id);
        }
      } else if (sessionRes.ok) {
        const sessionData = await sessionRes.json();
        setSessionId(sessionData.id);
      }

      // 2. Fetch tables and products catalog
      const [tablesRes, productsRes] = await Promise.all([
        fetch("http://localhost:3000/tables", { headers }),
        fetch("http://localhost:3000/products/pos-data", { headers }),
      ]);

      if (tablesRes.ok) {
        setTables(await tablesRes.json());
      }
      if (productsRes.ok) {
        const productsData = await productsRes.json();
        const mappedProducts: POSProduct[] = (productsData.data || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          price: Number(p.price),
          category: p.category ? p.category.name : "Uncategorized",
          categoryColor: p.category?.color || "#C9783A",
          emoji: getEmojiForProduct(p.name, p.category ? p.category.name : ""),
        }));
        setProducts(mappedProducts);
      }
    } catch (err) {
      console.error("Error initializing POS data:", err);
    }
  };

  useEffect(() => {
    if (token) {
      initializePOS(token);
    }
  }, [token]);

  // Fetch active order for selected table
  useEffect(() => {
    if (!token || !selectedTable || !isLoaded) return;

    // If this table matches the one loaded from sessionStorage on mount and it doesn't have an active order in DB,
    // do not wipe/override the local draft cart state.
    if (selectedTable.id === loadedTableId && !selectedTable.hasOrder) {
      return;
    }

    const fetchActiveOrder = async () => {
      const headers = { Authorization: `Bearer ${token}` };
      try {
        if (selectedTable.hasOrder) {
          const res = await fetch(`http://localhost:3000/orders/table/${selectedTable.id}`, { headers });
          if (res.ok) {
            const orderData = await res.json();
            setActiveOrderId(orderData.id);
            const mappedItems: CartItem[] = (orderData.orderItems || []).map((item: any) => ({
              id: item.productId,
              name: item.productNameSnapshot,
              price: Number(item.unitPriceSnapshot),
              quantity: item.quantity,
              emoji: getEmojiForProduct(item.productNameSnapshot, ""),
            }));
            setCartItems(mappedItems);
          } else {
            setActiveOrderId(null);
            setCartItems([]);
          }
        } else {
          setActiveOrderId(null);
          setCartItems([]);
        }
      } catch (err) {
        console.error("Error fetching table active order:", err);
        setActiveOrderId(null);
        setCartItems([]);
      }
      setLoadedTableId(selectedTable.id);
    };

    fetchActiveOrder();
  }, [selectedTable, token, loadedTableId, isLoaded]);

  // Fetch AI recommendation whenever cart items change
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
    const foundProduct = products.find(
      p => p.name.toLowerCase() === recommendation.recommendedProductName.toLowerCase()
    );
    if (foundProduct) {
      addToCart(foundProduct);
    }
  };

  const addToCart = (product: { id: string; name: string; price: number; emoji: string }) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCartItems(prev =>
      prev.flatMap(i => {
        const newQty = i.quantity + delta;
        if (newQty <= 0) return [];
        return [{ ...i, quantity: newQty }];
      })
    );
  };

  const removeItem = (id: string) => setCartItems(prev => prev.filter(i => i.id !== id));

  // Connect Send to Kitchen button to order creation and kitchen endpoint
  const sendToKitchen = async () => {
    if (!token || !selectedTable || !sessionId || cartItems.length === 0) return;
    try {
      let orderId = activeOrderId;
      
      // If no active order exists, create a DRAFT order first
      if (!orderId) {
        const orderRes = await fetch("http://localhost:3000/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            sessionId,
            tableId: selectedTable.id,
            items: cartItems.map(i => ({ productId: i.id, quantity: i.quantity })),
            notes: "Kitchen preparation requested",
          }),
        });

        if (orderRes.ok) {
          const orderData = await orderRes.json();
          orderId = orderData.order?.id || orderData.data?.id || orderData.id;
          setActiveOrderId(orderId);
        } else {
          const err = await orderRes.json();
          alert(`Error creating order: ${err.message || "Failed"}`);
          return;
        }
      }

      // Send to Kitchen
      const sendRes = await fetch(`http://localhost:3000/orders/${orderId}/send-to-kitchen`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (sendRes.ok) {
        setKitchenSent(true);
        setTimeout(() => setKitchenSent(false), 3000);
        // Refresh tables list
        const tablesRes = await fetch("http://localhost:3000/tables", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (tablesRes.ok) {
          setTables(await tablesRes.json());
        }
      } else {
        const err = await sendRes.json();
        alert(`Error sending to kitchen: ${err.message || "Failed"}`);
      }
    } catch (err) {
      console.error("Error sending order to kitchen:", err);
    }
  };

  const handleCheckoutClick = () => {
    if (!selectedTable) {
      alert("Please select a table before checking out.");
      return;
    }
    if (cartItems.length === 0) {
      alert("Please add items to the order first.");
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (method: string, amount: number) => {
    if (!token || !selectedTable || !sessionId) return;
    try {
      let orderId = activeOrderId;
      
      // If order hasn't been created yet, create it
      if (!orderId) {
        const orderRes = await fetch("http://localhost:3000/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            sessionId,
            tableId: selectedTable.id,
            items: cartItems.map(i => ({ productId: i.id, quantity: i.quantity })),
            notes: "POS Checkout",
          }),
        });

        if (orderRes.ok) {
          const orderData = await orderRes.json();
          orderId = orderData.order?.id || orderData.data?.id || orderData.id;
        } else {
          const err = await orderRes.json();
          alert(`Error creating order: ${err.message || "Failed"}`);
          return;
        }
      }

      // Send to kitchen so it appears in KDS
      try {
        await fetch(`http://localhost:3000/orders/${orderId}/send-to-kitchen`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // Order may already be sent to kitchen — continue with payment
      }

      // Record checkout payment
      const paymentRes = await fetch("http://localhost:3000/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId,
          amount,
          method: method.toUpperCase(), // CASH, CARD, UPI
          couponCode: appliedCoupon?.code || undefined,
        }),
      });

      if (paymentRes.ok) {
        setCartItems([]);
        setSelectedTable(null);
        setActiveOrderId(null);
        setAppliedCoupon(null);
        clearPOSState();
        // Refresh tables list to show it's available
        const tablesRes = await fetch("http://localhost:3000/tables", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (tablesRes.ok) {
          setTables(await tablesRes.json());
        }
      } else {
        const err = await paymentRes.json();
        alert(`Payment error: ${err.message || "Failed"}`);
      }
    } catch (err) {
      console.error("Error processing checkout payment:", err);
    }
  };

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = subtotal * 0.08;
  let discountAmt = 0;
  if (appliedCoupon) {
    discountAmt = appliedCoupon.value <= 100 ? subtotal * (appliedCoupon.value / 100) : appliedCoupon.value;
  }
  const total = Math.max(0, subtotal + tax - discountAmt);

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
          <ProductGrid products={products} onAddToCart={addToCart} />
        </div>

        {/* Right: Cart */}
        <div className="min-h-[400px] lg:h-full">
          <Cart
            items={cartItems}
            onUpdateQty={updateQty}
            onRemove={removeItem}
            onSendToKitchen={sendToKitchen}
            onCheckout={handleCheckoutClick}
            token={token}
            recommendation={recommendation}
            onAddRecommendation={handleAddRecommendation}
            appliedCoupon={appliedCoupon}
            setAppliedCoupon={setAppliedCoupon}
          />
        </div>
      </div>

      {/* Floor Popup */}
      {showFloor && (
        <FloorPopup
          tables={tables}
          onClose={() => setShowFloor(false)}
          onSelectTable={(t: any) => setSelectedTable(t)}
        />
      )}

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          total={total}
          onClose={() => { setShowPayment(false); }}
          onSuccess={() => {}}
          onPaySuccess={handlePaymentSuccess}
          cartItems={cartItems.map(i => ({ name: i.name, price: i.price, quantity: i.quantity }))}
          tableName={selectedTable?.number}
        />
      )}
    </div>
  );
}
