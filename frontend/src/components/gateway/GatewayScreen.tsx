"use client";

import React, { useState } from "react";
import { Coffee, LayoutDashboard, ShoppingBag, ChefHat, Lock, ArrowRight, AlertCircle, Key, Terminal } from "lucide-react";
import { API_BASE_URL } from "@/lib/config";

interface GatewayScreenProps {
  onAuthorized: (role: string) => void;
}

export function GatewayScreen({ onAuthorized }: GatewayScreenProps) {
  const [selectedPortal, setSelectedPortal] = useState<"admin" | "pos" | "kds" | null>(null);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fast Dev access bypass helper
  const handleDevBypass = () => {
    setIsLoading(true);
    setTimeout(() => {
      onAuthorized("dev");
      setIsLoading(false);
    }, 400);
  };

  const handlePortalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPortal) return;
    setError("");

    // Check for dev bypass in password field
    if (password.toLowerCase().trim() === "dev") {
      handleDevBypass();
      return;
    }

    setIsLoading(true);
    try {
      const email = selectedPortal === "admin" ? "admin@cafe.com" : "employee@cafe.com";
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Save access token to session storage
        sessionStorage.setItem("brewhouse_token", data.accessToken);
        onAuthorized(selectedPortal);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || "Invalid password for this portal. Try again or use dev bypass.");
      }
    } catch (err) {
      console.error("Gateway auth error:", err);
      // Fail-safe default local passwords in case backend is offline
      if (
        (selectedPortal === "admin" && password === "Admin@123") ||
        (selectedPortal !== "admin" && password === "Employee@123")
      ) {
        onAuthorized(selectedPortal);
      } else {
        setError("Network error. Backend seems offline. Try standard fallback credentials or dev mode.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#1E1611] text-white px-4 py-12 relative overflow-hidden font-sans select-none">
      {/* Background decorations */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#C9783A]/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#866443]/15 blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-[900px] z-10 flex flex-col items-center gap-10">
        
        {/* Logo and Header */}
        <div className="flex flex-col items-center text-center max-w-[500px]">
          <div className="w-20 h-20 rounded-[24px] bg-[#C9783A] flex items-center justify-center shadow-[0_8px_30px_rgba(201,120,58,0.3)] mb-5">
            <Coffee size={40} className="text-white" strokeWidth={2} />
          </div>
          <h1 className="text-[32px] sm:text-[40px] font-extrabold tracking-tight text-white leading-tight">
            Brewhouse Portal Gateway
          </h1>
          <p className="text-[14px] sm:text-[16px] text-white/60 mt-2 font-medium">
            Select a portal to access the café POS management terminal system.
          </p>
        </div>

        {/* Portal Selection Grid / Card */}
        {!selectedPortal ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[840px] mt-2">
            
            {/* Admin portal card */}
            <button
              onClick={() => {
                setSelectedPortal("admin");
                setError("");
                setPassword("");
              }}
              className="group flex flex-col text-left p-6 rounded-[24px] bg-white/[0.04] border border-white/10 hover:border-[#C9783A] hover:bg-white/[0.08] transition-all duration-300 transform hover:-translate-y-1 shadow-lg cursor-pointer"
            >
              <div className="w-12 h-12 rounded-[16px] bg-[#C9783A]/10 group-hover:bg-[#C9783A] flex items-center justify-center mb-5 transition-colors duration-300">
                <LayoutDashboard size={24} className="text-[#C9783A] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Admin Dashboard</h3>
              <p className="text-sm text-white/50 leading-relaxed font-medium">
                Manage inventory, coupons, reports, users, and overall store metrics.
              </p>
              <div className="mt-auto pt-6 flex items-center gap-2 text-xs font-bold text-[#C9783A] group-hover:text-white transition-colors duration-300">
                Enter Panel <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* POS Portal Card */}
            <button
              onClick={() => {
                setSelectedPortal("pos");
                setError("");
                setPassword("");
              }}
              className="group flex flex-col text-left p-6 rounded-[24px] bg-white/[0.04] border border-white/10 hover:border-[#C9783A] hover:bg-white/[0.08] transition-all duration-300 transform hover:-translate-y-1 shadow-lg cursor-pointer"
            >
              <div className="w-12 h-12 rounded-[16px] bg-[#C9783A]/10 group-hover:bg-[#C9783A] flex items-center justify-center mb-5 transition-colors duration-300">
                <ShoppingBag size={24} className="text-[#C9783A] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">POS Terminal</h3>
              <p className="text-sm text-white/50 leading-relaxed font-medium">
                Ring up orders, open sessions, choose tables, and process customer payments.
              </p>
              <div className="mt-auto pt-6 flex items-center gap-2 text-xs font-bold text-[#C9783A] group-hover:text-white transition-colors duration-300">
                Launch Terminal <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Kitchen Portal Card */}
            <button
              onClick={() => {
                setSelectedPortal("kds");
                setError("");
                setPassword("");
              }}
              className="group flex flex-col text-left p-6 rounded-[24px] bg-white/[0.04] border border-white/10 hover:border-[#C9783A] hover:bg-white/[0.08] transition-all duration-300 transform hover:-translate-y-1 shadow-lg cursor-pointer"
            >
              <div className="w-12 h-12 rounded-[16px] bg-[#C9783A]/10 group-hover:bg-[#C9783A] flex items-center justify-center mb-5 transition-colors duration-300">
                <ChefHat size={24} className="text-[#C9783A] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Kitchen KDS</h3>
              <p className="text-sm text-white/50 leading-relaxed font-medium">
                Monitor live order statuses, prepare items, and send out ready updates.
              </p>
              <div className="mt-auto pt-6 flex items-center gap-2 text-xs font-bold text-[#C9783A] group-hover:text-white transition-colors duration-300">
                Open KDS Screen <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

          </div>
        ) : (
          /* Password Form Dialog Card */
          <div className="w-full max-w-[440px] bg-[#291F18] border border-white/10 rounded-[28px] p-8 shadow-[0_12px_40px_rgba(0,0,0,0.4)] animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Lock size={20} className="text-[#C9783A]" />
              Password Protection
            </h3>
            <p className="text-sm text-white/60 mt-1 font-medium">
              Enter password for {selectedPortal === "admin" ? "Admin" : selectedPortal === "pos" ? "POS" : "Kitchen KDS"}.
            </p>

            <form onSubmit={handlePortalSubmit} className="mt-6 flex flex-col gap-4">
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password (or 'dev' to bypass)"
                  required
                  autoFocus
                  disabled={isLoading}
                  className="w-full h-12 pl-10 pr-4 rounded-[14px] bg-black/30 border border-white/10 text-white placeholder-white/30 text-sm font-semibold outline-none focus:border-[#C9783A] transition-colors"
                />
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              </div>

              {error && (
                <div className="flex items-start gap-2 text-[13px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 rounded-[12px] p-3 leading-relaxed">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 flex items-center justify-center gap-2 bg-[#C9783A] hover:bg-[#B86A30] text-white text-sm font-bold rounded-[14px] transition-all active:scale-[0.98] cursor-pointer shadow-md disabled:opacity-50"
              >
                {isLoading ? "Authenticating..." : "Authorize & Enter"}
                {!isLoading && <ArrowRight size={16} strokeWidth={2.5} />}
              </button>

              <div className="grid grid-cols-2 gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPortal(null)}
                  disabled={isLoading}
                  className="h-10 text-xs font-bold text-white/50 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded-[12px] transition-all cursor-pointer border border-white/5"
                >
                  Change Portal
                </button>
                <button
                  type="button"
                  onClick={handleDevBypass}
                  disabled={isLoading}
                  className="h-10 text-xs font-bold text-[#C9783A] hover:text-[#D18C52] bg-[#C9783A]/10 hover:bg-[#C9783A]/15 rounded-[12px] transition-all cursor-pointer border border-[#C9783A]/20 flex items-center justify-center gap-1.5"
                >
                  <Terminal size={12} />
                  Dev Bypass
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Global Dev Access quick badge */}
        <div className="flex flex-col items-center gap-2 mt-4 select-none">
          <button
            onClick={handleDevBypass}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] text-xs font-bold text-white/40 hover:text-white/80 transition-all cursor-pointer"
          >
            <Key size={12} className="text-[#C9783A]" />
            Fast Dev Access (Enter without password)
          </button>
        </div>

        {/* Footer */}
        <p className="text-[11px] font-medium text-white/30 select-none">
          &copy; 2026 Brewhouse POS System &bull; Secured deployment environment
        </p>

      </div>
    </div>
  );
}
