"use client";

import React from "react";
import { UserStatus } from "./types";

const styles: Record<UserStatus, string> = {
  Active:   "bg-[#E7F3DD] text-[#7C9C57]",
  Archived: "bg-[#FFE3DE] text-[#D55C4C]",
};

export function StatusBadge({ status }: { status: UserStatus }) {
  return (
    <span className={`inline-flex items-center justify-center h-[24px] px-3 rounded-full text-[12px] font-bold select-none border border-black/5 ${styles[status]}`}>
      {status}
    </span>
  );
}
