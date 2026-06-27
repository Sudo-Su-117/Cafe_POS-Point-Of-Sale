"use client";

import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { GatewayScreen } from "@/components/gateway/GatewayScreen";
import { usePathname, useRouter } from "next/navigation";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const role = sessionStorage.getItem("brewhouse_session_role");
    if (role) {
      setAuthorized(true);
    } else {
      setAuthorized(false);
    }
  }, [pathname]);

  const handleAuthorized = (role: string) => {
    sessionStorage.setItem("brewhouse_session_role", role);
    setAuthorized(true);
    
    // Redirect depending on authorized role choice
    if (role === "admin" || role === "dev") {
      if (pathname === "/pos" || pathname.startsWith("/pos/") || pathname === "/kds") {
        // Keep current path if explicitly navigating to it
      } else {
        router.push("/");
      }
    } else if (role === "pos") {
      router.push("/pos/session");
    } else if (role === "kds") {
      router.push("/kds");
    }
  };

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-[#1E1611] text-white flex items-center justify-center font-sans font-semibold">
        Loading Brewhouse...
      </div>
    );
  }

  if (pathname === "/login") {
    return (
      <ThemeProvider>
        {children}
        <ThemeSwitcher />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      {authorized ? (
        <>
          {children}
          {/* Switch Portal trigger button */}
          <div className="fixed bottom-4 right-4 z-[9999] opacity-80 hover:opacity-100 transition-opacity select-none">
            <button
              onClick={() => {
                sessionStorage.removeItem("brewhouse_session_role");
                setAuthorized(false);
                router.push("/");
              }}
              className="px-3.5 py-2 bg-[#2C2118] text-white border border-white/10 hover:border-[#C9783A] text-xs font-bold rounded-full shadow-lg transition-all duration-150 active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              Switch Portal
            </button>
          </div>
        </>
      ) : (
        <GatewayScreen onAuthorized={handleAuthorized} />
      )}
      <ThemeSwitcher />
    </ThemeProvider>
  );
}
