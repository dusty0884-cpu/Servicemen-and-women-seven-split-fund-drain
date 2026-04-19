"use client";
import { clsx } from "clsx";
import { useAppStore } from "@/lib/store/app-store";
import { CONTEXT_CONFIGS } from "@/lib/context";

interface NavItem {
  id: string;
  label: string;
  icon: string;
  group: string;
}

const WAREHOUSE_NAV: NavItem[] = [
  { id: "dashboard", label: "Command Center", icon: "📊", group: "Core" },
  { id: "lift-operator", label: "Lift Operator", icon: "🏗️", group: "Operations" },
  { id: "selector", label: "Selector", icon: "📡", group: "Operations" },
  { id: "loader", label: "Loader", icon: "🚛", group: "Operations" },
  { id: "walkie", label: "Walkie", icon: "📻", group: "Operations" },
  { id: "compliance", label: "FDA Compliance", icon: "🛡️", group: "Compliance" },
  { id: "finance", label: "Finance", icon: "💰", group: "Admin" },
  { id: "missions", label: "Missions Folder", icon: "🎯", group: "Admin" },
  { id: "accessibility", label: "Accessibility", icon: "♿", group: "System" },
];

const RETAIL_NAV: NavItem[] = [
  { id: "retail-dashboard", label: "Store Overview", icon: "📊", group: "Core" },
  { id: "retail-pos", label: "POS / Checkout", icon: "💳", group: "Sales" },
  { id: "retail-inventory", label: "Inventory", icon: "📦", group: "Sales" },
  { id: "retail-restock", label: "Restock Orders", icon: "🔄", group: "Sales" },
  { id: "finance", label: "Finance", icon: "💰", group: "Admin" },
  { id: "missions", label: "Missions Folder", icon: "🎯", group: "Admin" },
  { id: "accessibility", label: "Accessibility", icon: "♿", group: "System" },
];

const LEGAL_NAV: NavItem[] = [
  { id: "legal-dashboard", label: "Case Overview", icon: "📊", group: "Core" },
  { id: "evidence-tracker", label: "Evidence Tracker", icon: "🔍", group: "Chain of Custody" },
  { id: "chain-of-custody", label: "Custody Log", icon: "🔗", group: "Chain of Custody" },
  { id: "legal-audit", label: "Audit Trail", icon: "📋", group: "Compliance" },
  { id: "finance", label: "Finance", icon: "💰", group: "Admin" },
  { id: "missions", label: "Missions Folder", icon: "🎯", group: "Admin" },
  { id: "accessibility", label: "Accessibility", icon: "♿", group: "System" },
];

const NAV_MAP = { warehouse: WAREHOUSE_NAV, retail: RETAIL_NAV, legal: LEGAL_NAV };

export function Sidebar() {
  const { sidebarOpen, activeView, setActiveView, appContext } = useAppStore();
  const navItems = NAV_MAP[appContext];
  const groups = [...new Set(navItems.map((n) => n.group))];
  const ctxConfig = CONTEXT_CONFIGS[appContext];

  return (
    <aside
      className={clsx(
        "fixed left-0 top-0 h-full bg-sb-black border-r border-sb-neon/10 z-40 transition-all duration-300 flex flex-col",
        sidebarOpen ? "w-64" : "w-16"
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b border-sb-neon/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sb-neon/10 border border-sb-neon/30 flex items-center justify-center neon-text font-bold text-lg flex-shrink-0">
            S
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <div className="neon-text font-bold text-sm tracking-wide">SockiiisBack</div>
              <div className="text-[10px] text-zinc-600 truncate">{ctxConfig.label}</div>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-4">
        {groups.map((group) => (
          <div key={group}>
            {sidebarOpen && (
              <div className="text-[10px] text-sb-neon/40 uppercase tracking-[0.15em] px-3 mb-1.5 font-semibold">{group}</div>
            )}
            {navItems.filter((n) => n.group === group).map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={clsx(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 mb-0.5",
                  activeView === item.id
                    ? "bg-sb-neon/10 text-sb-neon neon-border"
                    : "text-zinc-500 hover:bg-sb-neon/5 hover:text-zinc-300"
                )}
              >
                <span className="text-base flex-shrink-0">{item.icon}</span>
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sb-neon/10">
        {sidebarOpen && (
          <div className="text-[10px] text-zinc-700 text-center font-mono">v1.0.0 — GOLD STANDARD</div>
        )}
      </div>
    </aside>
  );
}
