"use client";

import React from "react";

interface StatusToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function StatusToggle({ checked, onChange }: StatusToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-[26px] w-[48px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out select-none ${
        checked ? "bg-success" : "bg-border-custom/50"
      }`}
      aria-label="Toggle active status"
    >
      <span
        className={`pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-[22px]" : "translate-x-0"
        }`}
      />
    </button>
  );
}
