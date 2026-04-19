"use client";
import { useAppStore } from "@/lib/store/app-store";
import { ConnectionStatus } from "./connection-status";
import { ContextSwitcher } from "@/components/context/context-switcher";

export function Header() {
  const { toggleSidebar, sidebarOpen, notifications } = useAppStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-14 border-b border-sb-neon/10 bg-sb-black/80 backdrop-blur-md flex items-center justify-between px-4 sticky top-0 z-30 relative">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-sb-neon/10 rounded-lg transition-colors text-zinc-500 hover:text-sb-neon"
          aria-label="Toggle sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {sidebarOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
        <ContextSwitcher />
      </div>
      <div className="flex items-center gap-4">
        <ConnectionStatus />
        <div className="relative">
          <button className="p-2 hover:bg-sb-neon/10 rounded-lg transition-colors text-zinc-500 hover:text-sb-neon relative">
            🔔
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-sb-neon text-sb-black text-[10px] rounded-full flex items-center justify-center font-bold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        </div>
        <div className="w-8 h-8 rounded-full bg-sb-neon/20 border border-sb-neon/30 flex items-center justify-center neon-text text-xs font-bold">
          A
        </div>
      </div>
    </header>
  );
}
