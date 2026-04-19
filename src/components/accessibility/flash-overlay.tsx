"use client";
import { useAppStore } from "@/lib/store/app-store";

export function FlashOverlay() {
  const { visible, color, opacity } = useAppStore((s) => s.flashOverlay);
  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[9999] pointer-events-none transition-opacity duration-100"
      style={{ backgroundColor: color, opacity }}
    />
  );
}
