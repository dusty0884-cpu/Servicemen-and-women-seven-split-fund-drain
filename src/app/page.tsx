"use client";
import { useEffect } from "react";
import { useAppStore } from "@/lib/store/app-store";
import { useServiceWorker } from "@/lib/hooks/use-service-worker";
import { useHeartbeat } from "@/lib/hooks/use-heartbeat";
import { getPreferences } from "@/lib/accessibility";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { FlashOverlay } from "@/components/accessibility/flash-overlay";
import { DashboardOverview } from "@/components/layout/dashboard-overview";
import { LiftOperatorView } from "@/components/logistics/lift-operator-view";
import { SelectorView } from "@/components/logistics/selector-view";
import { LoaderView } from "@/components/logistics/loader-view";
import { WalkieView } from "@/components/logistics/walkie-view";
import { ComplianceDashboard } from "@/components/compliance/compliance-dashboard";
import { FinancialDashboard } from "@/components/finance/financial-dashboard";
import { MissionsView } from "@/components/missions/missions-view";
import { AccessibilitySettings } from "@/components/accessibility/a11y-settings";

const VIEWS: Record<string, React.ComponentType> = {
  dashboard: DashboardOverview,
  "lift-operator": LiftOperatorView,
  selector: SelectorView,
  loader: LoaderView,
  walkie: WalkieView,
  compliance: ComplianceDashboard,
  finance: FinancialDashboard,
  missions: MissionsView,
  accessibility: AccessibilitySettings,
};

export default function Home() {
  const { activeView, sidebarOpen, setA11yPrefs } = useAppStore();

  useServiceWorker();
  useHeartbeat();

  useEffect(() => {
    const prefs = getPreferences();
    setA11yPrefs(prefs);
  }, [setA11yPrefs]);

  const ActiveComponent = VIEWS[activeView] ?? DashboardOverview;

  return (
    <>
      <FlashOverlay />
      <Sidebar />
      <main
        className={`transition-all duration-300 min-h-screen ${
          sidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <Header />
        <div className="p-6 max-w-7xl mx-auto">
          <ActiveComponent />
        </div>
      </main>
    </>
  );
}
