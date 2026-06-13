"use client";

import React, { useState } from "react";
import { Minus, Plus, Trash2, Tag, Send, ChefHat } from "lucide-react";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
}

interface CartProps {
  items: CartItem[];
  onUpdateQty: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onSendToKitchen: () => void;
  onCheckout: () => void;
}

const TAX_RATE = 0.08;

const COUPON_CODES: Record<string, number> = {
  "BREW10": 0.10,
  "CAFE20": 0.20,
  "SAVE5":  5,
};

export function Cart({ items, onUpdateQty, onRemove, onSendToKitchen, onCheckout }: CartProps) {
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; value: number } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [showCoupon, setShowCoupon] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = subtotal * TAX_RATE;

  let discountAmt = 0;
  if (appliedCoupon) {
    discountAmt = appliedCoupon.value < 1 ? subtotal * appliedCoupon.value : appliedCoupon.value;
  }
  const total = Math.max(0, subtotal + tax - discountAmt);

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    const val = COUPON_CODES[code];
    if (val !== undefined) {
      setAppliedCoupon({ code, value: val });
      setCouponError("");
      setShowCoupon(false);
      setCouponInput("");
    } else {
      setCouponError("Invalid coupon code");
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F3ED] border border-[#D8CCBF] rounded-[20px] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#D8CCBF]">
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
            <div key={item.id} className="flex items-center gap-3 bg-[#F1ECE5] rounded-[14px] p-3">
              <span className="text-xl">{item.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-text-heading truncate">{item.name}</p>
                <p className="text-[12px] text-[#CB7637] font-semibold">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => onUpdateQty(item.id, -1)} className="w-6 h-6 rounded-full bg-[#D8CCBF] hover:bg-[#C9B9A7] flex items-center justify-center transition-colors">
                  <Minus size={10} className="text-text-heading" />
                </button>
                <span className="text-[13px] font-bold text-text-heading w-5 text-center">{item.quantity}</span>
                <button onClick={() => onUpdateQty(item.id, 1)} className="w-6 h-6 rounded-full bg-[#CB7637] hover:bg-[#B86830] flex items-center justify-center transition-colors">
                  <Plus size={10} className="text-white" />
                </button>
              </div>
              <span className="text-[13px] font-bold text-text-heading w-14 text-right">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
              <button onClick={() => onRemove(item.id)} className="p-1 rounded-lg hover:bg-[#FFE3DE] text-text-muted hover:text-[#D55C4C] transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      <div className="px-5 py-4 border-t border-[#D8CCBF] flex flex-col gap-2.5">
        <div className="flex justify-between text-[13px] text-text-muted font-medium">
          <span>Subtotal</span><span className="text-text-body font-semibold">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[13px] text-text-muted font-medium">
          <span>Tax (8%)</span><span className="text-text-body font-semibold">${tax.toFixed(2)}</span>
        </div>
        {appliedCoupon && (
          <div className="flex justify-between text-[13px] font-semibold text-[#7C9C57]">
            <span className="flex items-center gap-1"><Tag size={12} /> {appliedCoupon.code}</span>
            <span>-${discountAmt.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-[16px] font-bold text-text-heading border-t border-[#D8CCBF] pt-2.5 mt-0.5">
          <span>Total</span><span className="text-[#CB7637]">${total.toFixed(2)}</span>
        </div>

        {/* Coupon */}
        <div>
          {!showCoupon && !appliedCoupon && (
            <button onClick={() => setShowCoupon(true)} className="flex items-center gap-1.5 text-[13px] font-semibold text-text-muted hover:text-[#CB7637] transition-colors">
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
                className="flex-1 bg-[#F1ECE5] border border-[#D8CCBF] rounded-[10px] px-3 py-2 text-[13px] font-semibold outline-none focus:border-[#CB7637] transition-colors uppercase"
              />
              <button onClick={applyCoupon} className="bg-[#CB7637] hover:bg-[#B86830] text-white text-[13px] font-semibold px-3 py-2 rounded-[10px] transition-colors">
                Apply
              </button>
            </div>
          )}
          {couponError && <p className="text-[12px] text-[#D55C4C] font-semibold mt-1">{couponError}</p>}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-1">
          <button
            onClick={onSendToKitchen}
            disabled={items.length === 0}
            className="flex-1 flex items-center justify-center gap-2 bg-[#F1ECE5] hover:bg-[#E8DECE] disabled:opacity-40 disabled:cursor-not-allowed text-text-heading text-[13px] font-bold py-2.5 rounded-[12px] transition-colors"
          >
            <ChefHat size={15} /> Kitchen
          </button>
          <button
            onClick={onCheckout}
            disabled={items.length === 0}
            className="flex-1 flex items-center justify-center gap-2 bg-[#CB7637] hover:bg-[#B86830] disabled:opacity-40 disabled:cursor-not-allowed text-white text-[13px] font-bold py-2.5 rounded-[12px] transition-colors"
          >
            <Send size={15} /> Pay ${total.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}
