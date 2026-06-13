"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Palette } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { ThemeDefinition, ThemeId } from "@/lib/theme-config";

function ThemePreviewCard({
  theme,
  isActive,
  onSelect,
}: {
  theme: ThemeDefinition;
  isActive: boolean;
  onSelect: () => void;
}) {
  const { primary, sidebar, background, surface } = theme.colors;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isActive}
      className={`w-full flex items-center gap-3 p-3 rounded-[14px] border transition-all duration-200 text-left cursor-pointer theme-transition ${
        isActive
          ? "border-primary bg-primary/5 ring-2 ring-primary/30"
          : "border-border-custom bg-background hover:bg-surface"
      }`}
    >
      <div className="flex gap-1 shrink-0">
        {[primary, sidebar, background, surface].map((color) => (
          <div
            key={color}
            className="w-5 h-5 rounded-full border border-black/10"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-text-heading truncate">
          {theme.name}
        </p>
        <p className="text-[11px] font-medium text-text-muted">{theme.category}</p>
      </div>
      {isActive && (
        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
          <Check size={14} className="text-white" strokeWidth={3} />
        </div>
      )}
    </button>
  );
}

export function ThemeSwitcher() {
  const { themeId, themes, setTheme, isReady } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const fabRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    fabRef.current?.focus();
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        panelRef.current?.contains(target) ||
        fabRef.current?.contains(target)
      ) {
        return;
      }
      close();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, close]);

  if (!mounted || !isReady) return null;

  return createPortal(
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Theme selector"
          className="w-[320px] bg-surface border border-border-custom rounded-[20px] shadow-xl p-4 animate-theme-panel-in theme-transition"
        >
          <h2 className="text-[16px] font-bold text-text-heading mb-3">Themes</h2>
          <div className="flex flex-col gap-2 max-h-[360px] overflow-y-auto no-scrollbar">
            {themes.map((theme) => (
              <ThemePreviewCard
                key={theme.id}
                theme={theme}
                isActive={themeId === theme.id}
                onSelect={() => {
                  setTheme(theme.id as ThemeId);
                  close();
                }}
              />
            ))}
          </div>
        </div>
      )}

      <button
        ref={fabRef}
        type="button"
        onClick={toggle}
        aria-label="Change theme"
        aria-expanded={isOpen}
        className="w-14 h-14 rounded-full bg-sidebar-bg text-white shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200 ease hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <Palette size={22} strokeWidth={1.75} />
      </button>
    </div>,
    document.body
  );
}
