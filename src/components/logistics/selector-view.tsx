"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { useNotification } from "@/lib/hooks/use-notification";

interface BluetoothDevice {
  id: string;
  name: string;
  type: "headset" | "scanner" | "printer" | "scale";
  connected: boolean;
  battery: number;
  signal: "strong" | "medium" | "weak";
  lastSeen: string;
}

const MOCK_DEVICES: BluetoothDevice[] = [
  { id: "bt-001", name: "Vocollect A730", type: "headset", connected: true, battery: 82, signal: "strong", lastSeen: "Now" },
  { id: "bt-002", name: "Zebra DS3678", type: "scanner", connected: true, battery: 65, signal: "medium", lastSeen: "Now" },
  { id: "bt-003", name: "Honeywell 8680i", type: "scanner", connected: false, battery: 45, signal: "weak", lastSeen: "5 min ago" },
  { id: "bt-004", name: "Zebra ZQ630", type: "printer", connected: false, battery: 91, signal: "strong", lastSeen: "12 min ago" },
  { id: "bt-005", name: "CAS PD-II", type: "scale", connected: false, battery: 100, signal: "strong", lastSeen: "1 hr ago" },
];

const TYPE_ICONS: Record<string, string> = { headset: "🎧", scanner: "📱", printer: "🖨️", scale: "⚖️" };

export function SelectorView() {
  const [devices, setDevices] = useState<BluetoothDevice[]>(MOCK_DEVICES);
  const [scanning, setScanning] = useState(false);
  const { notify } = useNotification();

  const toggleConnection = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((d) => {
        if (d.id === deviceId) {
          const newState = !d.connected;
          notify(
            newState ? "success" : "info",
            newState ? "Device Connected" : "Device Disconnected",
            `${d.name} ${newState ? "paired and connected" : "disconnected"}`
          );
          return { ...d, connected: newState, lastSeen: newState ? "Now" : new Date().toLocaleTimeString() };
        }
        return d;
      })
    );
  };

  const startScan = () => {
    setScanning(true);
    notify("info", "Bluetooth Scan", "Scanning for nearby devices...");
    setTimeout(() => {
      setScanning(false);
      notify("success", "Scan Complete", `Found ${devices.length} devices in range`);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">📡 Selector — Device Manager</h2>
          <p className="text-gray-400 text-sm mt-1">Bluetooth headset & scanner management</p>
        </div>
        <button
          onClick={startScan}
          disabled={scanning}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-700 text-white rounded-lg font-medium text-sm transition-colors"
        >
          {scanning ? "⏳ Scanning..." : "🔍 Scan for Devices"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {devices.map((device) => (
          <Card key={device.id} className={device.connected ? "border-green-500/30" : ""}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{TYPE_ICONS[device.type]}</span>
                <div>
                  <div className="text-white font-medium">{device.name}</div>
                  <div className="text-xs text-gray-400 capitalize">{device.type}</div>
                </div>
              </div>
              <StatusBadge status={device.connected ? "connected" : "disconnected"} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div>
                <div className="text-xs text-gray-400">Battery</div>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        device.battery > 50 ? "bg-green-500" : device.battery > 20 ? "bg-yellow-500" : "bg-red-500"
                      }`}
                      style={{ width: `${device.battery}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-300 ml-1">{device.battery}%</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Signal</div>
                <div className="flex items-center gap-0.5 mt-1">
                  {[1, 2, 3].map((bar) => (
                    <div
                      key={bar}
                      className={`w-1.5 rounded-sm ${
                        (device.signal === "strong" && bar <= 3) ||
                        (device.signal === "medium" && bar <= 2) ||
                        (device.signal === "weak" && bar <= 1)
                          ? "bg-blue-400"
                          : "bg-white/10"
                      }`}
                      style={{ height: `${bar * 6}px` }}
                    />
                  ))}
                  <span className="text-xs text-gray-300 ml-1.5 capitalize">{device.signal}</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Last Seen</div>
                <div className="text-xs text-gray-300 mt-1">{device.lastSeen}</div>
              </div>
            </div>
            <button
              onClick={() => toggleConnection(device.id)}
              className={`mt-4 w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                device.connected
                  ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  : "bg-green-500/20 text-green-400 hover:bg-green-500/30"
              }`}
            >
              {device.connected ? "Disconnect" : "Connect"}
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
