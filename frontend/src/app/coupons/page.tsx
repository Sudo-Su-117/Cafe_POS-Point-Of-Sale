"use client";

import React, { useState } from "react";
import {
  CouponFormData,
  MarketingTab,
  Promotion,
  PromotionFormData,
} from "@/lib/marketing-types";
import { INITIAL_COUPONS, INITIAL_PROMOTIONS } from "@/lib/mock-marketing";
import { MarketingToolbar } from "@/features/marketing/components/MarketingToolbar";
import { CouponsTable } from "@/features/marketing/components/CouponsTable";
import { PromotionsTable } from "@/features/marketing/components/PromotionsTable";
import { CouponModal } from "@/features/marketing/components/CouponModal";
import { PromotionModal } from "@/features/marketing/components/PromotionModal";

export default function CouponsPage() {
  const [activeTab, setActiveTab] = useState<MarketingTab>("coupons");
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [promotions, setPromotions] = useState(INITIAL_PROMOTIONS);
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [promotionModalOpen, setPromotionModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(
    null
  );

  const handleToggleActive = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  const handleDeleteCoupon = (id: string) => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleDeletePromotion = (id: string) => {
    if (confirm("Are you sure you want to delete this promotion?")) {
      setPromotions((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setPromotionModalOpen(true);
  };

  const handleNewClick = () => {
    if (activeTab === "coupons") {
      setCouponModalOpen(true);
    } else {
      setEditingPromotion(null);
      setPromotionModalOpen(true);
    }
  };

  const handleClosePromotionModal = () => {
    setPromotionModalOpen(false);
    setEditingPromotion(null);
  };

  const handleSaveCoupon = (data: CouponFormData) => {
    if (data.id) {
      setCoupons((prev) =>
        prev.map((c) => (c.id === data.id ? { ...c, ...data, id: c.id } : c))
      );
    } else {
      setCoupons((prev) => [
        ...prev,
        {
          ...data,
          id: Math.random().toString(36).substring(2, 9),
        },
      ]);
    }
  };

  const handleSavePromotion = (data: PromotionFormData) => {
    if (data.id) {
      setPromotions((prev) =>
        prev.map((p) =>
          p.id === data.id ? { ...data, id: p.id } : p
        )
      );
    } else {
      setPromotions((prev) => [
        ...prev,
        {
          ...data,
          id: Math.random().toString(36).substring(2, 9),
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col gap-5 max-w-[1600px] mx-auto font-sans">
      <MarketingToolbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onNewClick={handleNewClick}
      />

      <section>
        {activeTab === "coupons" ? (
          <CouponsTable
            coupons={coupons}
            onToggleActive={handleToggleActive}
            onDelete={handleDeleteCoupon}
          />
        ) : (
          <PromotionsTable
            promotions={promotions}
            onEdit={handleEditPromotion}
            onDelete={handleDeletePromotion}
          />
        )}
      </section>

      <CouponModal
        isOpen={couponModalOpen}
        onClose={() => setCouponModalOpen(false)}
        onSave={handleSaveCoupon}
        existingCodes={coupons.map((c) => c.code)}
      />

      <PromotionModal
        isOpen={promotionModalOpen}
        onClose={handleClosePromotionModal}
        onSave={handleSavePromotion}
        promotion={editingPromotion}
      />
    </div>
  );
}
