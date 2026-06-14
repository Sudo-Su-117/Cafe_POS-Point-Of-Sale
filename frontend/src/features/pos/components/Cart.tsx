"use client";

import React, { useState, useEffect } from "react";
import { Minus, Plus, Trash2, Tag, Send, ChefHat, Sparkles, Loader2 } from "lucide-react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
}

interface CartProps {
  items: CartItem[];
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onSendToKitchen: () => void;
  onCheckout: () => void;
  token?: string | null;
  recommendation?: {
    recommendedProductId: string;
    recommendedProductName: string;
    recommendedProductPrice: number;
    reason: string;
  } | null;
  onAddRecommendation?: () => void;
  appliedCoupon: { code: string; value: number; minOrderAmount?: number | null } | null;
  setAppliedCoupon: (coupon: { code: string; value: number; minOrderAmount?: number | null } | null) => void;
}

const TAX_RATE = 0.08;

export function Cart({ items, onUpdateQty, onRemove, onSendToKitchen, onCheckout, token, recommendation, onAddRecommendation, appliedCoupon, setAppliedCoupon }: CartProps) {
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [showCoupon, setShowCoupon] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = subtotal * TAX_RATE;

  // Dynamic validation for applied coupon's minimum order requirement
  useEffect(() => {
    if (appliedCoupon && appliedCoupon.minOrderAmount !== undefined && appliedCoupon.minOrderAmount !== null) {
      if (subtotal < appliedCoupon.minOrderAmount) {
        setAppliedCoupon(null);
        setCouponError(`Coupon removed: minimum order of $${appliedCoupon.minOrderAmount.toFixed(2)} is not met.`);
      }
    }
  }, [subtotal, appliedCoupon, setAppliedCoupon]);

  let discountAmt = 0;
  if (appliedCoupon) {
    // discountPercentage from the DB is stored as a whole number (e.g. 10 for 10%)
    discountAmt = appliedCoupon.value <= 100 ? subtotal * (appliedCoupon.value / 100) : appliedCoupon.value;
  }
  const total = Math.max(0, subtotal + tax - discountAmt);

  const applyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a coupon code");
      return;
    }

    if (!token) {
      setCouponError("Authentication required");
      return;
    }

    setIsValidating(true);
    setCouponError("");

    try {
      const response = await fetch(`http://localhost:3000/coupons/${encodeURIComponent(code)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        setCouponError("Invalid coupon code");
        setIsValidating(false);
        return;
      }

      const coupon = await response.json();

      // Check if coupon is expired
      if (new Date(coupon.expiryDate) <= new Date()) {
        setCouponError("This coupon has expired");
        setIsValidating(false);
        return;
      }

      // Check usage limit
      if (coupon.currentUsageCount >= coupon.maxUsageCount) {
        setCouponError("This coupon has reached its usage limit");
        setIsValidating(false);
        return;
      }

      // Check minimum order amount
      if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
        setCouponError(`Minimum order amount: $${coupon.minOrderAmount.toFixed(2)}`);
        setIsValidating(false);
        return;
      }

      setAppliedCoupon({
        code: coupon.code,
        value: coupon.discountPercentage,
        minOrderAmount: coupon.minOrderAmount ? Number(coupon.minOrderAmount) : null,
      });
      setCouponError("");
      setShowCoupon(false);
      setCouponInput("");
    } catch {
      setCouponError("Failed to validate coupon");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface border border-border-custom rounded-[20px] overflow-hidden theme-transition">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border-custom">
        <h3 className="text-[16px] font-bold text-text-heading">Current Order</h3>
        <p className="text-[12px] text-text-muted mt-0.5">{items.length} item{items.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 flex flex-col gap-2">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-text-muted py-8">
            <span className="text-3xl mb-2">🛒</span>
            <span className="text-[13px] font-semibold">Cart is empty</span>
            <span className="text-[12px] mt-1">Add products from the left panel</span>
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className="flex items-center gap-3 bg-surface rounded-[14px] p-3 theme-transition">
              <span className="text-xl">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-text-heading truncate">{item.name}</p>
                <p className="text-[12px] text-primary font-semibold">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => onUpdateQty(item.id, -1)} className="w-6 h-6 rounded-full bg-border-custom hover:bg-border-custom/80 flex items-center justify-center transition-colors">
                  <Minus size={10} className="text-text-heading" />
                </button>
                <span className="text-[13px] font-bold text-text-heading w-5 text-center">{item.quantity}</span>
                <button onClick={() => onUpdateQty(item.id, 1)} className="w-6 h-6 rounded-full bg-primary hover:brightness-105 flex items-center justify-center transition-colors">
                  <Plus size={10} className="text-white" />
                </button>
              </div>
              <span className="text-[13px] font-bold text-text-heading w-14 text-right">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
              <button onClick={() => onRemove(item.id)} className="p-1 rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Recommended Add-on */}
      {items.length > 0 && recommendation && (
        <div className="mx-4 my-2 bg-primary/5 border border-primary/15 rounded-[14px] p-3.5 flex flex-col gap-2 animate-fade-in-up theme-transition">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-primary text-[12px] font-bold">
              <Sparkles size={13} className="animate-pulse" />
              <span>Recommended Add-on</span>
            </div>
            <button
              onClick={onAddRecommendation}
              className="text-[12px] font-bold text-white bg-primary hover:brightness-105 px-3 py-1 rounded-[8px] transition-all"
            >
              Add +${recommendation.recommendedProductPrice.toFixed(2)}
            </button>
          </div>
          <div className="flex flex-col gap-0.5">
            <h4 className="text-[13px] font-bold text-text-heading">
              {recommendation.recommendedProductName}
            </h4>
            <p className="text-[12px] text-text-muted italic leading-relaxed">
              "{recommendation.reason}"
            </p>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="px-5 py-4 border-t border-border-custom flex flex-col gap-2.5">
        <div className="flex justify-between text-[13px] text-text-muted font-medium">
          <span>Subtotal</span><span className="text-text-body font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[13px] text-text-muted font-medium">
          <span>Tax (8%)</span><span className="text-text-body font-semibold">${tax.toFixed(2)}</span>
        </div>
        {appliedCoupon && (
          <div className="flex justify-between text-[13px] font-semibold text-success items-center">
            <span className="flex items-center gap-1.5">
              <Tag size={12} /> {appliedCoupon.code}
              <button
                type="button"
                onClick={() => setAppliedCoupon(null)}
                className="p-0.5 rounded-full hover:bg-success/20 text-success transition-colors cursor-pointer"
                title="Remove Coupon"
              >
                <Trash2 size={12} />
              </button>
            </span>
            <span>-${discountAmt.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-[16px] font-bold text-text-heading border-t border-border-custom pt-2.5 mt-0.5">
          <span>Total</span><span className="text-primary">${total.toFixed(2)}</span>
        </div>

        {/* Coupon */}
        <div>
          {!showCoupon && !appliedCoupon && (
            <button onClick={() => setShowCoupon(true)} className="flex items-center gap-1.5 text-[13px] font-semibold text-text-muted hover:text-primary transition-colors">
              <Tag size={14} /> Apply coupon
            </button>
          )}
          {showCoupon && (
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={couponInput}
                onChange={e => { setCouponInput(e.target.value); setCouponError(""); }}
                placeholder="Enter code"
                className="flex-1 bg-surface border border-border-custom rounded-[10px] px-3 py-2 text-[13px] font-semibold outline-none focus:border-primary transition-colors uppercase theme-transition"
              />
              <button onClick={applyCoupon} disabled={isValidating} className="bg-primary hover:brightness-105 text-white text-[13px] font-semibold px-3 py-2 rounded-[10px] transition-colors disabled:opacity-60 flex items-center gap-1.5">
                {isValidating ? <><Loader2 size={13} className="animate-spin" /> Checking...</> : "Apply"}
              </button>
            </div>
          )}
          {couponError && <p className="text-[12px] text-danger font-semibold mt-1">{couponError}</p>}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-1">
          <button
            onClick={onSendToKitchen}
            disabled={items.length === 0}
            className="flex-1 flex items-center justify-center gap-2 bg-surface hover:bg-border-custom/30 disabled:opacity-40 disabled:cursor-not-allowed text-text-heading text-[13px] font-bold py-2.5 rounded-[12px] transition-colors theme-transition"
          >
            <ChefHat size={15} /> Kitchen
          </button>
          <button
            onClick={onCheckout}
            disabled={items.length === 0}
            className="flex-1 flex items-center justify-center gap-2 bg-primary hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[13px] font-bold py-2.5 rounded-[12px] transition-colors"
          >
            <Send size={15} /> Pay ${total.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}
