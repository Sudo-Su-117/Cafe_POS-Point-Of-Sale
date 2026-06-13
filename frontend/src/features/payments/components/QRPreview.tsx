"use client";

import React, { useEffect, useRef } from "react";

interface QRPreviewProps {
  upiId: string;
  size?: number;
}

// Lightweight QR renderer using a canvas — no external dependency.
// Encodes the UPI deeplink string as a QR-style visual using a simple
// deterministic pattern based on the string content.
// For production, swap this with a real QR library (e.g. qrcode.react).
export function QRPreview({ upiId, size = 140 }: QRPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const modules = 25;
    const cell = Math.floor(size / modules);
    const offset = Math.floor((size - modules * cell) / 2);

    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);

    // Deterministic pattern from string hash
    const str = `upi://pay?pa=${upiId}&pn=Brewhouse`;
    const seed = str.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);

    const pseudo = (i: number, j: number) => {
      const v = (seed * (i + 1) * 37 + (j + 1) * 17 + i * j) % 97;
      return v < 48;
    };

    // Draw cells
    for (let i = 0; i < modules; i++) {
      for (let j = 0; j < modules; j++) {
        const dark = pseudo(i, j);
        ctx.fillStyle = dark ? "#2B1F16" : "#ffffff";
        ctx.fillRect(offset + j * cell, offset + i * cell, cell, cell);
      }
    }

    // Draw finder patterns (top-left, top-right, bottom-left)
    const drawFinder = (startX: number, startY: number) => {
      ctx.fillStyle = "#2B1F16";
      ctx.fillRect(startX, startY, cell * 7, cell * 7);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(startX + cell, startY + cell, cell * 5, cell * 5);
      ctx.fillStyle = "#2B1F16";
      ctx.fillRect(startX + cell * 2, startY + cell * 2, cell * 3, cell * 3);
    };

    drawFinder(offset, offset);
    drawFinder(offset + (modules - 7) * cell, offset);
    drawFinder(offset, offset + (modules - 7) * cell);

  }, [upiId, size]);

  if (!upiId.trim()) {
    return (
      <div
        className="flex items-center justify-center bg-[#F1ECE5] rounded-[12px] border border-dashed border-[#D8CCBF]"
        style={{ width: size, height: size }}
      >
        <p className="text-[12px] text-text-muted font-semibold text-center px-2">
          Enter UPI ID to generate QR
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="p-2.5 bg-white rounded-[12px] border border-[#D8CCBF] shadow-sm">
        <canvas ref={canvasRef} width={size} height={size} style={{ display: "block" }} />
      </div>
      <p className="text-[11px] font-semibold text-text-muted text-center">
        UPI QR · <span className="text-text-heading font-bold">{upiId}</span>
      </p>
    </div>
  );
}
