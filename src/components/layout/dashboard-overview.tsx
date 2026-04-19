"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAppStore } from "@/lib/store/app-store";
import { getFinancialSummary } from "@/lib/finance/mission-manager";
import type { WMSOrder, WMSShipment } from "@/lib/wms";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export function DashboardOverview() {
  const connectionStatus = useAppStore((s) => s.connectionStatus);
  const notifications = useAppStore((s) => s.notifications);
  const [orders, setOrders] = useState<WMSOrder[]>([]);
  const [shipments, setShipments] = useState<WMSShipment[]>([]);
  const summary = getFinancialSummary();

  useEffect(() => {
    fetch("/api/wms?resource=orders").then((r) => r.json()).then(setOrders).catch(() => {});
    fetch("/api/wms?resource=shipments").then((r) => r.json()).then(setShipments).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">SockiiisBack — Command Center</h2>
        <p className="text-gray-400 text-sm mt-1">Gold Standard logistics platform overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="text-xs text-gray-400">Active Orders</div>
          <div className="text-3xl font-bold text-white mt-1">{orders.length}</div>
          <div className="text-xs text-gray-500 mt-1">{orders.filter((o) => o.priority === "critical").length} critical</div>
        </Card>
        <Card>
          <div className="text-xs text-gray-400">Shipments</div>
          <div className="text-3xl font-bold text-white mt-1">{shipments.length}</div>
          <div className="text-xs text-gray-500 mt-1">{shipments.filter((s) => s.status === "loading").length} loading</div>
        </Card>
        <Card>
          <div className="text-xs text-gray-400">Revenue Today</div>
          <div className="text-3xl font-bold text-green-400 mt-1">{formatCurrency(summary.totalRevenue)}</div>
          <div className="text-xs text-gray-500 mt-1">{formatCurrency(summary.availableBalance)} available</div>
        </Card>
        <Card>
          <div className="text-xs text-gray-400">System Status</div>
          <div className="mt-2"><StatusBadge status={connectionStatus} size="md" /></div>
          <div className="text-xs text-gray-500 mt-1">{notifications.length} notifications</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>📦 Active Orders</CardTitle></CardHeader>
          <div className="space-y-2">
            {orders.map((order) => (
              <div key={order.orderId} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <div className="text-sm font-mono text-white">{order.orderId}</div>
                  <div className="text-xs text-gray-400">{order.shipTo?.name ?? "N/A"} • {order.items.length} items</div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={order.priority === "critical" ? "alert" : order.priority === "rush" ? "pending_review" : "active"} />
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
            {orders.length === 0 && <p className="text-gray-500 text-sm">Loading orders...</p>}
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>🚛 Active Shipments</CardTitle></CardHeader>
          <div className="space-y-2">
            {shipments.map((ship) => (
              <div key={ship.shipmentId} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <div className="text-sm font-mono text-white">{ship.shipmentId}</div>
                  <div className="text-xs text-gray-400">{ship.truckId} @ {ship.dock} • {ship.orders.length} orders</div>
                </div>
                <div className="flex items-center gap-2">
                  {ship.temperature != null && (
                    <span className={`text-xs px-2 py-0.5 rounded ${ship.temperature <= 40 ? "text-blue-400 bg-blue-500/20" : "text-red-400 bg-red-500/20"}`}>
                      {ship.temperature}°F
                    </span>
                  )}
                  <StatusBadge status={ship.status} />
                </div>
              </div>
            ))}
            {shipments.length === 0 && <p className="text-gray-500 text-sm">Loading shipments...</p>}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>🎯 Social Impact Summary</CardTitle></CardHeader>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-amber-500/10 rounded-lg">
            <div className="text-2xl">🎖️</div>
            <div className="text-lg font-bold text-amber-400 mt-1">{formatCurrency(summary.missionBreakdown.homeless_veterans)}</div>
            <div className="text-xs text-gray-400">Veterans Housing</div>
          </div>
          <div className="p-4 bg-pink-500/10 rounded-lg">
            <div className="text-2xl">👶</div>
            <div className="text-lg font-bold text-pink-400 mt-1">{formatCurrency(summary.missionBreakdown.orphan_support)}</div>
            <div className="text-xs text-gray-400">Orphan Support</div>
          </div>
          <div className="p-4 bg-cyan-500/10 rounded-lg">
            <div className="text-2xl">🏘️</div>
            <div className="text-lg font-bold text-cyan-400 mt-1">{formatCurrency(summary.missionBreakdown.community_development)}</div>
            <div className="text-xs text-gray-400">Community Dev</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
