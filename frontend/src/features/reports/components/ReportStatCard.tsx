"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface ReportStatCardProps {
  title: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  iconTheme: "orange" | "green" | "gold" | "brown";
}

const themeStyles = {
  orange: { bg: "bg-[#FBECE1]", text: "text-[#CB7637]" },
  green:  { bg: "bg-[#ECF1E7]", text: "text-[#78964E]" },
  gold:   { bg: "bg-[#FAF2E1]", text: "text-[#D6A144]" },
  brown:  { bg: "bg-[#F1ECE6]", text: "text-[#866443]" },
};

export function ReportStatCard({ title, value, sub, icon: Icon, iconTheme }: ReportStatCardProps) {
  const theme = themeStyles[iconTheme];
  return (
    <div className="bg-[#F7F3ED] border border-[#D8CCBF] rounded-[18px] p-5 flex items-center justify-between hover:-translate-y-0.5 transition-all duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col gap-1">
        <span className="text-[12px] font-semibold text-text-muted uppercase tracking-wider select-none">{title}</span>
        <span className="text-[26px] font-bold text-text-heading leading-none">{value}</span>
        <span className="text-[12px] font-medium text-text-muted">{sub}</span>
      </div>
      <div className={`w-[52px] h-[52px] rounded-[16px] flex items-center justify-center shrink-0 ${theme.bg} ${theme.text}`}>
        <Icon size={22} strokeWidth={1.75} />
      </div>
    </div>
  );
}
