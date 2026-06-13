"use client";

import React from "react";

export function Header() {
  // Static date as per screenshot, but could also be dynamically generated if needed.
  const dateStr = "Saturday, June 13, 2026";

  return (
    <header className="h-[80px] w-full flex items-center justify-between px-6 lg:px-8 border-b border-border-custom bg-background z-10">
      {/* Left side: Page Title and Date */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2">
          <span className="text-text-muted font-mono font-medium text-lg">#</span>
          <h1 className="text-[28px] font-bold text-text-heading leading-tight font-sans">
            Dashboard
          </h1>
        </div>
        <p className="text-[13px] font-medium text-text-muted mt-0.5">
          {dateStr}
        </p>
      </div>

      {/* Right side: User Profile Info */}
      <div className="flex items-center gap-3">
        {/* Initials Avatar */}
        <div className="w-[40px] h-[40px] rounded-full bg-primary flex items-center justify-center text-white font-bold text-[15px] select-none shadow-sm">
          OC
        </div>
        
        {/* Name and Role Badge */}
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-semibold text-text-heading font-sans">
            Olivia Chen
          </span>
          <span className="h-[28px] px-3 rounded-full bg-primary/10 text-primary text-[13px] font-semibold flex items-center justify-center select-none">
            Admin
          </span>
        </div>
      </div>
    </header>
  );
}
