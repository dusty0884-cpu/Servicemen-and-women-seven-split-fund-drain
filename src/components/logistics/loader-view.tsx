"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { useNotification } from "@/lib/hooks/use-notification";

interface ChecklistItem {
  id: string;
  label: string;
  required: boolean;
  checked: boolean;
  category: "pre_load" | "loading" | "post_load" | "compliance";
  notes?: string;
}

interface TruckLoad {
  truckId: string;
  dock: string;
  shipmentId: string;
  status: string;
  sealNumber: string;
  temperature: number | null;
  checklist: ChecklistItem[];
}

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: "cl-01", label: "Dock door secured and sealed", required: true, checked: false, category: "pre_load" },
  { id: "cl-02", label: "Truck floor inspected (clean, dry, no damage)", required: true, checked: false, category: "pre_load" },
  { id: "cl-03", label: "Temperature pre-cool verified", required: true, checked: false, category: "pre_load" },
  { id: "cl-04", label: "BOL (Bill of Lading) printed", required: true, checked: false, category: "pre_load" },
  { id: "cl-05", label: "Pallets staged in load sequence", required: true, checked: false, category: "loading" },
  { id: "cl-06", label: "Load bars / straps secured", required: true, checked: false, category: "loading" },
  { id: "cl-07", label: "Weight distribution verified", required: true, checked: false, category: "loading" },
  { id: "cl-08", label: "Case count matches order", required: true, checked: false, category: "loading" },
  { id: "cl-09", label: "Temperature reading logged (FSMA 204)", required: true, checked: false, category: "compliance" },
  { id: "cl-10", label: "Traceability lot codes recorded", required: true, checked: false, category: "compliance" },
  { id: "cl-11", label: "Seal number applied and logged", required: true, checked: false, category: "post_load" },
  { id: "cl-12", label: "Final photo documentation taken", required: false, checked: false, category: "post_load" },
  { id: "cl-13", label: "Driver signature collected", required: true, checked: false, category: "post_load" },
  { id: "cl-14", label: "Dispatch notification sent", required: true, checked: false, category: "post_load" },
];

export function LoaderView() {
  const [truckLoad, setTruckLoad] = useState<TruckLoad>({
    truckId: "TRK-A29",
    dock: "DOCK-1",
    shipmentId: "SHIP-5001",
    status: "loading",
    sealNumber: "SEAL-887712",
    temperature: 34,
    checklist: DEFAULT_CHECKLIST.map((c) => ({ ...c })),
  });
  const { notify } = useNotification();

  const toggleItem = (id: string) => {
    setTruckLoad((prev) => ({
      ...prev,
      checklist: prev.checklist.map((c) =>
        c.id === id ? { ...c, checked: !c.checked } : c
      ),
    }));
  };

  const completedCount = truckLoad.checklist.filter((c) => c.checked).length;
  const totalCount = truckLoad.checklist.length;
  const requiredRemaining = truckLoad.checklist.filter((c) => c.required && !c.checked).length;
  const progress = Math.round((completedCount / totalCount) * 100);

  const canComplete = requiredRemaining === 0;

  useEffect(() => {
    if (canComplete && completedCount > 0) {
      notify("success", "Load Complete", "All required checks passed. Ready for dispatch.");
    }
  // Only fire when canComplete changes to true
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canComplete]);

  const handleComplete = () => {
    if (!canComplete) return;
    setTruckLoad((prev) => ({ ...prev, status: "loaded" }));
    notify("success", "Truck Loaded", `${truckLoad.truckId} at ${truckLoad.dock} — sealed and ready for departure`);
  };

  const categories = [
    { key: "pre_load", label: "Pre-Load Inspection", icon: "🔍" },
    { key: "loading", label: "Loading Validation", icon: "📦" },
    { key: "compliance", label: "FDA Compliance", icon: "📋" },
    { key: "post_load", label: "Post-Load & Dispatch", icon: "✅" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">🚛 Loader Console</h2>
          <p className="text-gray-400 text-sm mt-1">Truck loading checklist & validation</p>
        </div>
        <StatusBadge status={truckLoad.status} size="md" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><div className="text-xs text-gray-400">Truck</div><div className="text-white font-mono text-lg mt-1">{truckLoad.truckId}</div></Card>
        <Card><div className="text-xs text-gray-400">Dock</div><div className="text-white font-mono text-lg mt-1">{truckLoad.dock}</div></Card>
        <Card><div className="text-xs text-gray-400">Seal #</div><div className="text-white font-mono text-lg mt-1">{truckLoad.sealNumber}</div></Card>
        <Card><div className="text-xs text-gray-400">Temp</div><div className="text-white font-mono text-lg mt-1">{truckLoad.temperature}°F</div></Card>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-300">Progress: {completedCount}/{totalCount}</div>
          <div className="text-sm text-gray-300">{progress}%</div>
        </div>
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              canComplete ? "bg-green-500" : "bg-blue-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        {requiredRemaining > 0 && (
          <p className="text-xs text-yellow-400 mt-2">⚠️ {requiredRemaining} required item(s) remaining</p>
        )}
      </Card>

      {categories.map(({ key, label, icon }) => {
        const items = truckLoad.checklist.filter((c) => c.category === key);
        if (items.length === 0) return null;
        return (
          <Card key={key}>
            <CardHeader>
              <CardTitle>{icon} {label}</CardTitle>
            </CardHeader>
            <div className="space-y-2">
              {items.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleItem(item.id)}
                    className="w-5 h-5 rounded border-white/30 bg-white/10 text-blue-500 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className={`text-sm flex-1 ${item.checked ? "text-gray-500 line-through" : "text-white"}`}>
                    {item.label}
                  </span>
                  {item.required && !item.checked && (
                    <span className="text-[10px] text-red-400 bg-red-500/20 px-1.5 py-0.5 rounded">REQUIRED</span>
                  )}
                </label>
              ))}
            </div>
          </Card>
        );
      })}

      <button
        onClick={handleComplete}
        disabled={!canComplete || truckLoad.status === "loaded"}
        className={`w-full py-4 rounded-xl text-lg font-bold transition-all ${
          canComplete && truckLoad.status !== "loaded"
            ? "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20"
            : "bg-gray-700 text-gray-500 cursor-not-allowed"
        }`}
      >
        {truckLoad.status === "loaded" ? "✅ Load Complete — Dispatched" : "🚀 Complete Load & Dispatch"}
      </button>
    </div>
  );
}
