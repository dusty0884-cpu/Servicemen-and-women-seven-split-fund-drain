"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotification } from "@/lib/hooks/use-notification";

interface WalkieMessage {
  id: string;
  from: string;
  channel: string;
  message: string;
  timestamp: string;
  priority: "normal" | "urgent";
}

const MOCK_MESSAGES: WalkieMessage[] = [
  { id: "wm-1", from: "Dock Supervisor", channel: "Dock-1", message: "TRK-A29 ready for loading. Seal numbers confirmed.", timestamp: "10:24 PM", priority: "normal" },
  { id: "wm-2", from: "Shift Lead", channel: "Floor-All", message: "⚠️ Temperature alarm at Zone C. Check cold storage immediately.", timestamp: "10:21 PM", priority: "urgent" },
  { id: "wm-3", from: "Lift Op 7", channel: "Aisle-3", message: "Pallet jam cleared at A-03. Resuming picks.", timestamp: "10:18 PM", priority: "normal" },
  { id: "wm-4", from: "QA Inspector", channel: "Compliance", message: "FSMA 204 spot check complete for LOT-2026-0412. All KDEs verified.", timestamp: "10:15 PM", priority: "normal" },
];

const CHANNELS = ["Floor-All", "Dock-1", "Dock-2", "Aisle-3", "Compliance", "Admin"];

export function WalkieView() {
  const [messages, setMessages] = useState<WalkieMessage[]>(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("Floor-All");
  const [pttActive, setPttActive] = useState(false);
  const { notify } = useNotification();

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const msg: WalkieMessage = {
      id: `wm-${Date.now()}`,
      from: "Admin",
      channel: selectedChannel,
      message: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      priority: "normal",
    };
    setMessages((prev) => [msg, ...prev]);
    notify("walkie", "Walkie Message Sent", `[${selectedChannel}] ${newMessage.slice(0, 50)}`);
    setNewMessage("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">📻 Walkie Communications</h2>
        <p className="text-gray-400 text-sm mt-1">Real-time team messaging with haptic & visual alerts</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {CHANNELS.map((ch) => (
          <button
            key={ch}
            onClick={() => setSelectedChannel(ch)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedChannel === ch
                ? "bg-blue-600 text-white"
                : "bg-white/10 text-gray-400 hover:bg-white/20"
            }`}
          >
            {ch}
          </button>
        ))}
      </div>

      <Card>
        <div className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={`Message to ${selectedChannel}...`}
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={sendMessage}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Send
          </button>
          <button
            onMouseDown={() => { setPttActive(true); notify("walkie", "PTT Active", "Push-to-talk active"); }}
            onMouseUp={() => setPttActive(false)}
            onMouseLeave={() => setPttActive(false)}
            className={`px-5 py-3 rounded-lg font-medium transition-all ${
              pttActive ? "bg-red-600 text-white scale-95" : "bg-orange-600 hover:bg-orange-700 text-white"
            }`}
          >
            🎙️ PTT
          </button>
        </div>
      </Card>

      <div className="space-y-2">
        {messages.map((msg) => (
          <Card
            key={msg.id}
            className={msg.priority === "urgent" ? "border-red-500/30 bg-red-500/5" : ""}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  msg.from === "Admin" ? "bg-blue-600" : "bg-white/20"
                } text-white`}>
                  {msg.from.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{msg.from}</span>
                    <span className="text-[10px] text-gray-500 bg-white/10 px-1.5 py-0.5 rounded">{msg.channel}</span>
                    {msg.priority === "urgent" && <span className="text-[10px] text-red-400 bg-red-500/20 px-1.5 py-0.5 rounded">URGENT</span>}
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{msg.message}</p>
                </div>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">{msg.timestamp}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
