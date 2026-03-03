import { Activity, Shield, AlertTriangle, Target, Download, Play, Pause } from "lucide-react";
import { useState } from "react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { TrafficChart } from "@/components/dashboard/TrafficChart";
import { TrafficPieChart } from "@/components/dashboard/TrafficPieChart";
import { AlertsList } from "@/components/dashboard/AlertsList";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [isActive, setIsActive] = useState(true);

  const handleExportResults = () => {
    // Create report data
    const reportData = {
      generatedAt: new Date().toISOString(),
      summary: {
        totalTraffic: 15040,
        detectedAttacks: 712,
        normalTraffic: 14328,
        accuracy: "98.7%"
      },
      recentAlerts: [
        { type: "DDoS Attack", ip: "192.168.1.105", time: "2 min ago" },
        { type: "Port Scan", ip: "10.0.0.45", time: "5 min ago" },
        { type: "SQL Injection", ip: "172.16.0.23", time: "12 min ago" }
      ]
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ids-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Exported",
      description: "Your IDS report has been downloaded successfully.",
    });
  };

  const handleToggleSystem = () => {
    setIsActive(!isActive);
    toast({
      title: isActive ? "System Deactivated" : "System Activated",
      description: isActive 
        ? "Intrusion detection monitoring has been paused." 
        : "Intrusion detection monitoring is now active.",
      variant: isActive ? "destructive" : "default",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Real-time network intrusion detection overview
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={handleExportResults}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export Results
          </Button>
          <Button 
            onClick={handleToggleSystem}
            className={isActive ? "bg-destructive hover:bg-destructive/90 gap-2" : "bg-success hover:bg-success/90 gap-2"}
          >
            {isActive ? (
              <>
                <Pause className="h-4 w-4" />
                Deactivate
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Activate
              </>
            )}
          </Button>
          <div className={`flex items-center gap-3 rounded-lg border px-4 py-2 ${
            isActive 
              ? "border-success/30 bg-success/10" 
              : "border-muted/30 bg-muted/10"
          }`}>
            <div className="relative">
              <div className={`h-2.5 w-2.5 rounded-full ${isActive ? "bg-success" : "bg-muted-foreground"}`} />
              {isActive && <div className="absolute inset-0 h-2.5 w-2.5 rounded-full bg-success status-pulse" />}
            </div>
            <span className={`text-sm font-medium ${isActive ? "text-success" : "text-muted-foreground"}`}>
              {isActive ? "System Active" : "System Inactive"}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Traffic Analyzed"
          value="15,040"
          subtitle="packets in last 24h"
          icon={Activity}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatsCard
          title="Detected Attacks"
          value="712"
          subtitle="blocked threats"
          icon={AlertTriangle}
          variant="danger"
          trend={{ value: 3.2, isPositive: false }}
        />
        <StatsCard
          title="Normal Traffic"
          value="14,328"
          subtitle="legitimate packets"
          icon={Shield}
          variant="success"
        />
        <StatsCard
          title="Detection Accuracy"
          value="98.7%"
          subtitle="model confidence"
          icon={Target}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TrafficChart />
        </div>
        <TrafficPieChart />
      </div>

      {/* Alerts */}
      <AlertsList />
    </div>
  );
}
