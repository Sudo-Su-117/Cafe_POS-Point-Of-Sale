"use client";

import React, { useState } from "react";
import { X, Banknote, CreditCard, QrCode, CheckCircle } from "lucide-react";

type PaymentMethod = "cash" | "card" | "upi";

interface PaymentModalProps {
  total: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function PaymentModal({ total, onClose, onSuccess }: PaymentModalProps) {
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [cashReceived, setCashReceived] = useState("");
  const [cardRef, setCardRef] = useState("");
  const [paid, setPaid] = useState(false);

  const change = method === "cash" && cashReceived ? Math.max(0, parseFloat(cashReceived) - total) : 0;
  const canPay =
    method === "card" ? cardRef.trim().length > 0 :
    method === "cash" ? parseFloat(cashReceived) >= total :
    true;

  const handlePay = () => {
    if (!canPay) return;
    setPaid(true);
    setTimeout(() => { onSuccess(); }, 1800);
  };

  const methods = [
    { id: "cash" as PaymentMethod, label: "Cash",   icon: Banknote  },
    { id: "card" as PaymentMethod, label: "Card",   icon: CreditCard },
    { id: "upi"  as PaymentMethod, label: "UPI QR", icon: QrCode    },
  ];

  if (paid) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-surface border border-border-custom rounded-[22px] w-full max-w-[380px] p-8 flex flex-col items-center text-center shadow-2xl theme-transition">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
            <CheckCircle size={36} className="text-success" />
          </div>
          <h3 className="text-[20px] font-bold text-text-heading">Payment Successful</h3>
          <p className="text-text-muted text-[14px] mt-2">Order marked as paid</p>
          <p className="text-[28px] font-bold text-primary mt-3">${total.toFixed(2)}</p>
          <div className="flex gap-3 mt-6 w-full">
            <button className="flex-1 bg-surface hover:bg-border-custom/30 text-text-heading text-[13px] font-bold py-2.5 rounded-[12px] transition-colors theme-transition">
              Print Receipt
            </button>
            <button onClick={onClose} className="flex-1 bg-primary hover:brightness-105 text-white text-[13px] font-bold py-2.5 rounded-[12px] transition-colors">
              New Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-border-custom rounded-[22px] w-full max-w-[440px] shadow-2xl overflow-hidden theme-transition">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border-custom">
          <div>
            <h2 className="text-[20px] font-bold text-text-heading">Payment</h2>
            <p className="text-[13px] text-text-muted mt-0.5">Total due: <span className="text-primary font-bold">${total.toFixed(2)}</span></p>
          </div>
          <button onClick={onClose} className="p-2 rounded-[12px] hover:bg-surface text-text-muted transition-colors theme-transition">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Method tabs */}
          <div className="grid grid-cols-3 gap-2">
            {methods.map(m => {
              const Icon = m.icon;
              return (
                <button key={m.id} onClick={() => setMethod(m.id)}
                  className={`flex flex-col items-center gap-2 py-3 rounded-[14px] border-2 transition-all font-sans ${
                    method === m.id
                      ? "bg-primary border-primary text-white"
                      : "bg-surface border-border-custom text-text-muted hover:border-primary hover:text-text-heading"
                  }`}>
                  <Icon size={20} strokeWidth={1.75} />
                  <span className="text-[12px] font-bold">{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Cash */}
          {method === "cash" && (
            <div className="flex flex-col gap-3">
              <label className="text-[13px] font-semibold text-text-muted">Amount Received</label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={cashReceived}
                onChange={e => setCashReceived(e.target.value)}
                placeholder="0.00"
                className="bg-surface border border-border-custom rounded-[12px] px-4 py-3 text-[18px] font-bold text-text-heading outline-none focus:border-primary transition-colors theme-transition"
              />
              {cashReceived && parseFloat(cashReceived) >= total && (
                <div className="flex justify-between bg-success/10 rounded-[12px] px-4 py-3">
                  <span className="text-[14px] font-semibold text-success">Change Due</span>
                  <span className="text-[18px] font-bold text-success">${change.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}

          {/* Card */}
          {method === "card" && (
            <div className="flex flex-col gap-3">
              <label className="text-[13px] font-semibold text-text-muted">Transaction Reference</label>
              <input
                type="text"
                value={cardRef}
                onChange={e => setCardRef(e.target.value)}
                placeholder="e.g. TXN-20260613-001"
                className="bg-surface border border-border-custom rounded-[12px] px-4 py-3 text-[14px] font-semibold text-text-heading outline-none focus:border-primary transition-colors theme-transition"
              />
            </div>
          )}

          {/* UPI */}
          {method === "upi" && (
            <div className="flex flex-col items-center gap-3">
              <div className="bg-white border-2 border-border-custom rounded-[16px] p-4 flex flex-col items-center gap-2">
                {/* Simulated QR */}
                <div className="w-[140px] h-[140px] bg-surface rounded-[10px] flex items-center justify-center relative overflow-hidden theme-transition">
                  <div className="grid grid-cols-7 gap-0.5 opacity-60">
                    {Array.from({ length: 49 }).map((_, i) => (
                      <div key={i} className={`w-3 h-3 rounded-[1px] ${(i * 7 + 13) % 3 !== 0 ? "bg-text-heading" : "bg-transparent"}`} />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl">☕</span>
                  </div>
                </div>
                <p className="text-[13px] font-bold text-text-heading">cafe@ybl</p>
                <p className="text-[12px] text-text-muted">Scan with any UPI app</p>
              </div>
              <p className="text-[22px] font-bold text-primary">${total.toFixed(2)}</p>
            </div>
          )}

          {/* Pay Button */}
          <button
            onClick={handlePay}
            disabled={!canPay}
            className="w-full bg-primary hover:brightness-105 disabled:opacity-40 disabled:cursor-not-allowed text-white text-[15px] font-bold py-3.5 rounded-[14px] transition-colors"
          >
            {method === "upi" ? "Confirm Payment" : `Charge $${total.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
