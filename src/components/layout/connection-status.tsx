"use client";
import { useAppStore } from "@/lib/store/app-store";
import { StatusBadge } from "@/components/ui/status-badge";

export function ConnectionStatus() {
  const status = useAppStore((s) => s.connectionStatus);
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-zinc-600 hidden sm:inline font-mono">SIG:</span>
      <StatusBadge status={status} />
    </div>
  );
}
