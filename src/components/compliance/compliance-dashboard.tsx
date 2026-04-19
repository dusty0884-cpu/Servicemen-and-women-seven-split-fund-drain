"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { WMSComplianceRecord } from "@/lib/wms";

const REGULATION_INFO: Record<string, { title: string; desc: string; icon: string }> = {
  FSMA204: {
    title: "FSMA Section 204 — Food Traceability Rule",
    desc: "Requires traceability records for foods on the FDA Food Traceability List (FTL). Key Data Elements (KDEs) must be captured at Critical Tracking Events (CTEs).",
    icon: "🔬",
  },
  "21CFR11": {
    title: "21 CFR Part 11 — Electronic Records & Signatures",
    desc: "FDA regulation establishing criteria for electronic records and signatures to be trustworthy, reliable, and equivalent to paper records with handwritten signatures.",
    icon: "📝",
  },
  GMP: {
    title: "Current Good Manufacturing Practice (cGMP)",
    desc: "FDA regulations ensuring products are consistently produced and controlled according to quality standards. Covers facilities, equipment, production, and process controls.",
    icon: "🏭",
  },
  HACCP: {
    title: "Hazard Analysis Critical Control Points",
    desc: "Systematic preventive approach to food safety that addresses biological, chemical, and physical hazards from production through consumption.",
    icon: "⚠️",
  },
};

export function ComplianceDashboard() {
  const [records, setRecords] = useState<WMSComplianceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<WMSComplianceRecord | null>(null);

  useEffect(() => {
    fetch("/api/wms?resource=compliance")
      .then((r) => r.json())
      .then((data) => { setRecords(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const compliantCount = records.filter((r) => r.status === "compliant").length;
  const issueCount = records.filter((r) => r.status === "non_compliant" || r.status === "pending_review").length;

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-400">Loading compliance data...</div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">🛡️ Digital FDA Global Compliance</h2>
        <p className="text-gray-400 text-sm mt-1">FSMA 204 & 21 CFR Part 11 compliance tracking and audit management</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-xs text-gray-400">Total Regulations</div>
          <div className="text-3xl font-bold text-white mt-1">{records.length}</div>
        </Card>
        <Card className="border-green-500/20">
          <div className="text-xs text-gray-400">Compliant</div>
          <div className="text-3xl font-bold text-green-400 mt-1">{compliantCount}</div>
        </Card>
        <Card className={issueCount > 0 ? "border-red-500/20" : ""}>
          <div className="text-xs text-gray-400">Issues</div>
          <div className={`text-3xl font-bold mt-1 ${issueCount > 0 ? "text-red-400" : "text-green-400"}`}>{issueCount}</div>
        </Card>
        <Card>
          <div className="text-xs text-gray-400">Compliance Score</div>
          <div className="text-3xl font-bold text-white mt-1">{records.length > 0 ? Math.round((compliantCount / records.length) * 100) : 0}%</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {records.map((record) => {
          const info = REGULATION_INFO[record.type] ?? { title: record.type, desc: "", icon: "📄" };
          return (
            <Card
              key={record.id}
              onClick={() => setSelectedRecord(record)}
              className={`cursor-pointer transition-all hover:scale-[1.01] ${
                record.status === "non_compliant" ? "border-red-500/30" :
                record.status === "pending_review" ? "border-yellow-500/30" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{info.icon}</span>
                  <div>
                    <div className="text-white font-semibold">{info.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{info.desc.slice(0, 100)}...</div>
                  </div>
                </div>
                <StatusBadge status={record.status} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div><div className="text-xs text-gray-400">Last Audit</div><div className="text-sm text-white">{record.lastAudit}</div></div>
                <div><div className="text-xs text-gray-400">Next Audit</div><div className="text-sm text-white">{record.nextAudit}</div></div>
              </div>
              {record.findings.length > 0 && (
                <div className="mt-3 p-2 bg-red-500/10 rounded-lg">
                  <div className="text-xs text-red-400 font-medium mb-1">⚠️ Findings ({record.findings.length})</div>
                  {record.findings.map((f, i) => (
                    <div key={i} className="text-xs text-gray-300 ml-3">• {f}</div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {selectedRecord?.cteData && selectedRecord.cteData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>📊 Critical Tracking Events (CTEs)</CardTitle>
            <p className="text-sm text-gray-400">FSMA 204 traceability event log</p>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-2 px-3 text-left text-gray-400 font-medium">Event</th>
                  <th className="py-2 px-3 text-left text-gray-400 font-medium">Timestamp</th>
                  <th className="py-2 px-3 text-left text-gray-400 font-medium">Location</th>
                  <th className="py-2 px-3 text-left text-gray-400 font-medium">TLC</th>
                  <th className="py-2 px-3 text-left text-gray-400 font-medium">Product</th>
                  <th className="py-2 px-3 text-left text-gray-400 font-medium">Qty</th>
                  <th className="py-2 px-3 text-left text-gray-400 font-medium">Docs</th>
                </tr>
              </thead>
              <tbody>
                {selectedRecord.cteData.map((cte) => (
                  <tr key={cte.id} className="border-b border-white/5">
                    <td className="py-2 px-3 capitalize text-white">{cte.eventType}</td>
                    <td className="py-2 px-3 text-gray-300 font-mono text-xs">{new Date(cte.timestamp).toLocaleString()}</td>
                    <td className="py-2 px-3 text-gray-300">{cte.location}</td>
                    <td className="py-2 px-3 text-blue-400 font-mono text-xs">{cte.traceabilityLotCode}</td>
                    <td className="py-2 px-3 text-gray-300">{cte.product}</td>
                    <td className="py-2 px-3 text-gray-300">{cte.quantity} {cte.uom}</td>
                    <td className="py-2 px-3 text-gray-300">{cte.referenceDocuments.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
