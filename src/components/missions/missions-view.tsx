"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getMissions } from "@/lib/finance/mission-manager";
import type { MissionFund, MissionCategory } from "@/lib/finance/types";

const CATEGORY_LABELS: Record<MissionCategory, { label: string; icon: string; color: string }> = {
  homeless_veterans: { label: "Homeless Veterans", icon: "🎖️", color: "from-amber-500 to-orange-600" },
  orphan_support: { label: "Orphan Support", icon: "👶", color: "from-pink-500 to-rose-600" },
  community_development: { label: "Community Development", icon: "🏘️", color: "from-cyan-500 to-teal-600" },
  education: { label: "Education", icon: "📚", color: "from-purple-500 to-violet-600" },
  emergency_relief: { label: "Emergency Relief", icon: "🆘", color: "from-red-500 to-rose-600" },
  operations: { label: "Operations", icon: "⚙️", color: "from-gray-500 to-zinc-600" },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export function MissionsView() {
  const [missions, setMissions] = useState<MissionFund[]>([]);
  const [selected, setSelected] = useState<MissionFund | null>(null);

  useEffect(() => { setMissions(getMissions()); }, []);

  const totalImpact = missions.reduce((s, m) => s + m.disbursedAmount, 0);
  const totalBeneficiaries = missions.reduce((s, m) => s + m.beneficiaries.length, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">🎯 Missions Folder</h2>
        <p className="text-gray-400 text-sm mt-1">Social impact missions funded by SockiiisBack logistics operations</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="border-green-500/20 text-center">
          <div className="text-xs text-gray-400">Total Impact</div>
          <div className="text-2xl font-bold text-green-400 mt-1">{formatCurrency(totalImpact)}</div>
        </Card>
        <Card className="text-center">
          <div className="text-xs text-gray-400">Active Missions</div>
          <div className="text-2xl font-bold text-white mt-1">{missions.filter((m) => m.status === "active").length}</div>
        </Card>
        <Card className="text-center">
          <div className="text-xs text-gray-400">Beneficiaries</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">{totalBeneficiaries}</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {missions.filter((m) => m.category !== "operations").map((mission) => {
          const info = CATEGORY_LABELS[mission.category];
          const progress = mission.targetAmount > 0 ? (mission.currentAmount / mission.targetAmount) * 100 : 0;
          return (
            <Card key={mission.id} onClick={() => setSelected(mission)} className="cursor-pointer hover:scale-[1.01] transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center text-2xl`}>
                  {info.icon}
                </div>
                <div className="flex-1">
                  <div className="text-white font-semibold">{mission.name}</div>
                  <div className="text-xs text-gray-400">{info.label}</div>
                </div>
                <StatusBadge status={mission.status} />
              </div>
              <p className="text-sm text-gray-400 mb-3">{mission.description}</p>
              <div className="mb-2">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>{formatCurrency(mission.currentAmount)} raised</span>
                  <span>{formatCurrency(mission.targetAmount)} goal</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${info.color} rounded-full transition-all`} style={{ width: `${Math.min(progress, 100)}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {mission.beneficiaries.slice(0, 2).map((b) => (
                  <div key={b.id} className="p-2 bg-white/5 rounded text-xs">
                    <div className="text-white font-medium truncate">{b.name}</div>
                    <div className="text-gray-400">{formatCurrency(b.totalReceived)} received</div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {selected && (
        <Card className="border-blue-500/20">
          <CardHeader>
            <CardTitle>{CATEGORY_LABELS[selected.category].icon} {selected.name} — Detail</CardTitle>
          </CardHeader>
          <p className="text-sm text-gray-300 mb-4">{selected.description}</p>
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="p-3 bg-white/5 rounded-lg text-center"><div className="text-xs text-gray-400">Target</div><div className="text-sm font-medium text-white">{formatCurrency(selected.targetAmount)}</div></div>
            <div className="p-3 bg-white/5 rounded-lg text-center"><div className="text-xs text-gray-400">Raised</div><div className="text-sm font-medium text-green-400">{formatCurrency(selected.currentAmount)}</div></div>
            <div className="p-3 bg-white/5 rounded-lg text-center"><div className="text-xs text-gray-400">Allocated</div><div className="text-sm font-medium text-blue-400">{formatCurrency(selected.allocatedAmount)}</div></div>
            <div className="p-3 bg-white/5 rounded-lg text-center"><div className="text-xs text-gray-400">Disbursed</div><div className="text-sm font-medium text-purple-400">{formatCurrency(selected.disbursedAmount)}</div></div>
          </div>
          {selected.beneficiaries.length > 0 && (
            <>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Beneficiaries</h4>
              <div className="space-y-2">
                {selected.beneficiaries.map((b) => (
                  <div key={b.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div><div className="text-sm text-white">{b.name}</div><div className="text-xs text-gray-400">{b.organization}</div></div>
                    <div className="text-right"><div className="text-sm font-medium text-green-400">{formatCurrency(b.totalReceived)}</div><div className="text-xs text-gray-500">Last: {b.lastPaymentDate}</div></div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      )}
    </div>
  );
}
