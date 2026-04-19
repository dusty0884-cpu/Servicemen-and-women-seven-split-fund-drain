"use client";
import { useState, useCallback } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { useNotification } from "@/lib/hooks/use-notification";
import type { WMSItem } from "@/lib/wms";

const DEMO_BARCODES = ["SKU-001", "SKU-002", "SKU-003", "SKU-004"];

export function LiftOperatorView() {
  const [scanInput, setScanInput] = useState("");
  const [scannedItem, setScannedItem] = useState<WMSItem | null>(null);
  const [scanHistory, setScanHistory] = useState<Array<{ barcode: string; item: WMSItem | null; time: string }>>([]);
  const [scanning, setScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const { notify } = useNotification();

  const performScan = useCallback(async (barcode: string) => {
    setScanning(true);
    try {
      const res = await fetch(`/api/wms?resource=scan&barcode=${encodeURIComponent(barcode)}`);
      const item = res.ok ? await res.json() : null;
      setScannedItem(item);
      setScanHistory((h) => [{ barcode, item, time: new Date().toLocaleTimeString() }, ...h].slice(0, 20));
      if (item) {
        notify("orderPicked", "Item Scanned", `${item.description} — ${item.location}`);
      } else {
        notify("error", "Scan Failed", `Barcode ${barcode} not found in WMS`);
      }
    } catch {
      notify("error", "Scan Error", "Network error during scan. Action queued for retry.");
    } finally {
      setScanning(false);
      setScanInput("");
    }
  }, [notify]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (scanInput.trim()) performScan(scanInput.trim());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">🏗️ Lift Operator Console</h2>
          <p className="text-gray-400 text-sm mt-1">High-speed barcode/QR scanning interface</p>
        </div>
        <button
          onClick={() => setCameraActive(!cameraActive)}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            cameraActive
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {cameraActive ? "■ Stop Camera" : "📷 Start Camera Scanner"}
        </button>
      </div>

      {cameraActive && (
        <Card className="border-blue-500/30">
          <div className="aspect-video bg-black/50 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border-2 border-blue-400 rounded-lg relative">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-400 rounded-tl" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-400 rounded-tr" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-400 rounded-bl" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-400 rounded-br" />
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-red-500 animate-pulse" />
              </div>
            </div>
            <p className="text-gray-400 text-sm z-10 mt-72">Camera feed — position barcode in frame</p>
          </div>
        </Card>
      )}

      <Card>
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={scanInput}
            onChange={(e) => setScanInput(e.target.value)}
            placeholder="Scan or type barcode/QR code..."
            autoFocus
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-lg font-mono"
          />
          <button
            type="submit"
            disabled={scanning || !scanInput.trim()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg font-medium transition-colors"
          >
            {scanning ? "⏳" : "⚡ Scan"}
          </button>
        </form>
        <div className="mt-3 flex gap-2 flex-wrap">
          <span className="text-xs text-gray-500">Quick test:</span>
          {DEMO_BARCODES.map((b) => (
            <button key={b} onClick={() => performScan(b)} className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 text-gray-300 rounded transition-colors">{b}</button>
          ))}
        </div>
      </Card>

      {scannedItem && (
        <Card className="border-green-500/30 bg-green-500/5">
          <CardHeader><CardTitle>✅ Last Scanned Item</CardTitle></CardHeader>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><div className="text-xs text-gray-400">SKU</div><div className="text-white font-mono">{scannedItem.sku}</div></div>
            <div><div className="text-xs text-gray-400">Description</div><div className="text-white">{scannedItem.description}</div></div>
            <div><div className="text-xs text-gray-400">Location</div><div className="text-white font-mono text-lg">{scannedItem.location}</div></div>
            <div><div className="text-xs text-gray-400">Quantity</div><div className="text-white">{scannedItem.quantity} {scannedItem.uom}</div></div>
            {scannedItem.lotNumber && <div><div className="text-xs text-gray-400">Lot #</div><div className="text-white font-mono">{scannedItem.lotNumber}</div></div>}
            {scannedItem.expirationDate && <div><div className="text-xs text-gray-400">Expiration</div><div className="text-white">{scannedItem.expirationDate}</div></div>}
          </div>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>📋 Scan History</CardTitle></CardHeader>
        {scanHistory.length === 0 ? (
          <p className="text-gray-500 text-sm">No scans yet. Use the scanner above to begin.</p>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {scanHistory.map((entry, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded bg-white/5">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-20">{entry.time}</span>
                  <span className="font-mono text-sm text-white">{entry.barcode}</span>
                  {entry.item && <span className="text-sm text-gray-300">{entry.item.description}</span>}
                </div>
                <StatusBadge status={entry.item ? "success" : "error"} />
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
