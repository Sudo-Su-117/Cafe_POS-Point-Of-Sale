"use client";

import React from "react";
import { UserRole } from "./types";

const styles: Record<UserRole, string> = {
  Admin:    "bg-[#F2E5D6] text-[#CB7637]",
  Employee: "bg-[#E7F3DD] text-[#7C9C57]",
};

export function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span className={`inline-flex items-center justify-center h-[24px] px-3 rounded-full text-[12px] font-bold select-none border border-black/5 ${styles[role]}`}>
      {role}
    </span>
  );
}
