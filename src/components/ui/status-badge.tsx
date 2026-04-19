import { clsx } from "clsx";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

const COLOR_MAP: Record<string, string> = {
  connected: "bg-sb-neon/20 text-sb-neon border-sb-neon/30",
  degraded: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  disconnected: "bg-red-500/20 text-red-400 border-red-500/30",
  reconnecting: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  compliant: "bg-sb-neon/20 text-sb-neon border-sb-neon/30",
  non_compliant: "bg-red-500/20 text-red-400 border-red-500/30",
  pending_review: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  expired: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  active: "bg-sb-neon/15 text-sb-neon border-sb-neon/25",
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  picking: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  picked: "bg-sb-neon/20 text-sb-neon border-sb-neon/30",
  loading: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  shipped: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  cancelled: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  success: "bg-sb-neon/20 text-sb-neon border-sb-neon/30",
  processing: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  denied: "bg-red-500/20 text-red-400 border-red-500/30",
  cleared: "bg-sb-neon/20 text-sb-neon border-sb-neon/30",
  disputed: "bg-red-500/20 text-red-400 border-red-500/30",
  scheduled: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  loaded: "bg-sb-neon/20 text-sb-neon border-sb-neon/30",
  departed: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  in_storage: "bg-sb-neon/15 text-sb-neon border-sb-neon/25",
  checked_out: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  in_transit: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  in_analysis: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  court_submitted: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  intake: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  draft: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  submitted: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  confirmed: "bg-sb-neon/20 text-sb-neon border-sb-neon/30",
  received: "bg-sb-neon/20 text-sb-neon border-sb-neon/30",
  alert: "bg-red-500/20 text-red-400 border-red-500/30",
  error: "bg-red-500/20 text-red-400 border-red-500/30",
};

const PULSE_STATUSES = new Set(["connected", "compliant", "active", "success", "cleared", "in_storage", "loaded"]);

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const colors = COLOR_MAP[status] ?? "bg-gray-500/20 text-gray-400 border-gray-500/30";
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border font-medium uppercase tracking-wider",
        colors,
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
      )}
    >
      <span className={clsx(
        "mr-1.5 h-1.5 w-1.5 rounded-full",
        PULSE_STATUSES.has(status) ? "bg-sb-neon animate-pulse" : "bg-current"
      )} />
      {status.replace(/_/g, " ")}
    </span>
  );
}
