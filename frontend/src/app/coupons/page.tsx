"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Calendar, CheckCircle, AlertCircle, RefreshCw, Trash2, Tag } from "lucide-react";

interface Promotion {
  id: string;
  name: string;
  description: string;
  type: string;
  value: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface AIPromotionRecommendation {
  source: string;
  analysis: string;
  name: string;
  description: string;
  type: string;
  value: number;
  durationDays: number;
}

export default function CouponsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiRecommend, setAiRecommend] = useState<AIPromotionRecommendation | null>(null);
  const [applyingPromo, setApplyingPromo] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const API_BASE_URL = "http://localhost:3000";

  // Auto-login to obtain JWT token
  useEffect(() => {
    async function autoLogin() {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
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
          console.log("Auto-login successful. Token acquired.");
        } else {
          setErrorMsg("Failed to authenticate with backend server. Make sure the backend is running.");
        }
      } catch (err) {
        console.error("Auto-login connection error:", err);
        setErrorMsg("Cannot connect to the backend API. Please make sure the NestJS server is running on port 3000.");
      }
    }
    autoLogin();
  }, []);

  // Fetch promotions list once authenticated
  useEffect(() => {
    if (token) {
      fetchPromotions();
    }
  }, [token]);

  const fetchPromotions = async () => {
    if (!token) return;
    setLoadingList(true);
    try {
      const response = await fetch(`${API_BASE_URL}/promotions`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPromotions(data);
      }
    } catch (err) {
      console.error("Error fetching promotions:", err);
    } finally {
      setLoadingList(false);
    }
  };

  const handleGenerateAI = async () => {
    if (!token) {
      setErrorMsg("Please wait for authentication to complete.");
      return;
    }
    setLoadingAI(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setAiRecommend(null);

    try {
      const response = await fetch(`${API_BASE_URL}/promotions/generate-ai`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAiRecommend(data);
      } else {
        setErrorMsg("Failed to generate AI promotion recommendation. Please check the AI microservice.");
      }
    } catch (err) {
      console.error("AI Generation error:", err);
      setErrorMsg("Failed to connect to the backend promotions generator.");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleApplyPromotion = async () => {
    if (!token || !aiRecommend) return;
    setApplyingPromo(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + (aiRecommend.durationDays || 7));

    try {
      const response = await fetch(`${API_BASE_URL}/promotions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: aiRecommend.name,
          description: aiRecommend.description,
          type: aiRecommend.type, // Maps to 'percentage', 'fixed_amount', 'bogo'
          value: Number(aiRecommend.value),
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          isActive: true,
        }),
      });

      if (response.ok) {
        setSuccessMsg(`Successfully created and applied promotion: "${aiRecommend.name}"`);
        setAiRecommend(null);
        fetchPromotions();
      } else {
        const errJson = await response.json();
        setErrorMsg(errJson.message || "Failed to create promotion in the database.");
      }
    } catch (err) {
      console.error("Error applying promotion:", err);
      setErrorMsg("Connection error while creating the promotion.");
    } finally {
      setApplyingPromo(false);
    }
  };

  const handleDeletePromotion = async (id: string) => {
    if (!token || !confirm("Are you sure you want to delete this promotion?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/promotions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setSuccessMsg("Promotion deleted successfully.");
        fetchPromotions();
      } else {
        setErrorMsg("Failed to delete promotion.");
      }
    } catch (err) {
      console.error("Delete promotion error:", err);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1600px] mx-auto font-sans p-4 md:p-6 text-slate-800">
      
      {/* Alert Banners */}
      {errorMsg && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl animate-fade-in shadow-sm">
          <AlertCircle size={20} className="shrink-0" />
          <p className="text-[14px] font-medium">{errorMsg}</p>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl animate-fade-in shadow-sm">
          <CheckCircle size={20} className="shrink-0" />
          <p className="text-[14px] font-medium">{successMsg}</p>
        </div>
      )}

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-sans tracking-tight">
            Coupons & Promos
          </h2>
          <p className="text-[14px] text-slate-500 mt-1">
            Manage your store coupons and create dynamic campaigns.
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: AI Promotion Generator */}
        <div className="xl:col-span-1 bg-gradient-to-br from-amber-50/50 to-orange-50/20 border border-amber-200/60 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100/60 text-amber-800 rounded-2xl">
              <Sparkles size={24} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">AI Promotion Engine</h3>
              <p className="text-[12px] text-slate-500">Optimizes menus and boosts sales</p>
            </div>
          </div>

          <p className="text-[14px] text-slate-600 leading-relaxed">
            The AI engine automatically scans your sales performance for the last 30 days and inventory levels to suggest marketing promotions that clear slow-moving stock.
          </p>

          <button
            onClick={handleGenerateAI}
            disabled={loadingAI || !token}
            className="w-full h-[50px] rounded-[16px] bg-[#C9783A] text-white text-[14px] font-bold flex items-center justify-center gap-2 hover:bg-[#B7672D] transition-all duration-200 shadow-md disabled:bg-slate-300 disabled:shadow-none cursor-pointer"
          >
            {loadingAI ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                <span>Analyzing Sales Data...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Generate AI Promotion</span>
              </>
            )}
          </button>

          {/* AI Recommendation Result */}
          {aiRecommend && (
            <div className="mt-2 border border-amber-200 bg-white rounded-2xl p-5 flex flex-col gap-4 shadow-sm animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
                  AI Recommendation
                </span>
                <span className="text-[11px] text-slate-400">
                  via {aiRecommend.source || "LLM"}
                </span>
              </div>

              {/* Analysis */}
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                  Analysis
                </span>
                <p className="text-[13px] text-slate-700 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                  "{aiRecommend.analysis}"
                </p>
              </div>

              {/* Promotion proposed */}
              <div className="flex flex-col gap-2.5 bg-gradient-to-r from-amber-50 to-orange-50/50 p-4 rounded-xl border border-amber-100">
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-amber-700" />
                  <span className="font-bold text-[14px] text-slate-900">
                    {aiRecommend.name}
                  </span>
                </div>
                <p className="text-[13px] font-medium text-slate-800">
                  {aiRecommend.description}
                </p>
                <div className="flex gap-4 text-[12px] text-slate-500 mt-1">
                  <span>Type: <strong className="text-slate-700 capitalize">{aiRecommend.type}</strong></span>
                  <span>Value: <strong className="text-slate-700">{aiRecommend.value}%</strong></span>
                  <span>Duration: <strong className="text-slate-700">{aiRecommend.durationDays} Days</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={handleApplyPromotion}
                  disabled={applyingPromo}
                  className="flex-1 h-[42px] text-[13px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  {applyingPromo ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <CheckCircle size={14} />
                  )}
                  <span>Apply Promotion</span>
                </button>
                <button
                  onClick={() => setAiRecommend(null)}
                  disabled={applyingPromo}
                  className="px-4 h-[42px] text-[13px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
                >
                  Discard
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Existing Campaigns */}
        <div className="xl:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Active Campaigns</h3>
              <p className="text-[12px] text-slate-500">Live store promotions</p>
            </div>
            <span className="text-[13px] font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              {promotions.length} Total
            </span>
          </div>

          {loadingList ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <RefreshCw size={24} className="animate-spin text-slate-400" />
              <span className="text-[13px] text-slate-400">Loading active campaigns...</span>
            </div>
          ) : promotions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-slate-100 rounded-2xl gap-3">
              <Tag size={32} className="text-slate-300" />
              <div className="flex flex-col gap-1">
                <span className="text-[14px] font-semibold text-slate-700">No active promotions</span>
                <span className="text-[12px] text-slate-400">
                  Generate an AI promotion on the left to activate your first campaign.
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {promotions.map((promo) => (
                <div
                  key={promo.id}
                  className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl hover:border-slate-200 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white border border-slate-100 text-amber-700 rounded-xl shadow-xs group-hover:scale-105 transition-transform">
                      <Tag size={18} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[14px] text-slate-800 leading-none">
                          {promo.name}
                        </span>
                        {promo.isActive ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase leading-none">
                            Active
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full uppercase leading-none">
                            Draft
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-slate-600">{promo.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400 mt-0.5">
                        <span>Type: <strong className="text-slate-600 capitalize">{promo.type}</strong></span>
                        <span>Value: <strong className="text-slate-600">{promo.value}%</strong></span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          <span>
                            {new Date(promo.startDate).toLocaleDateString()} - {new Date(promo.endDate).toLocaleDateString()}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeletePromotion(promo.id)}
                    className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
