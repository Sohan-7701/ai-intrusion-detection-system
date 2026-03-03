import { AlertTriangle, Shield, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  message: string;
  source: string;
  timestamp: string;
}

const alerts: Alert[] = [
  {
    id: "1",
    type: "critical",
    message: "DDoS Attack Pattern Detected",
    source: "192.168.1.105",
    timestamp: "2 min ago",
  },
  {
    id: "2",
    type: "critical",
    message: "Port Scan Attempt Blocked",
    source: "10.0.0.45",
    timestamp: "5 min ago",
  },
  {
    id: "3",
    type: "warning",
    message: "Unusual Traffic Spike Detected",
    source: "172.16.0.88",
    timestamp: "12 min ago",
  },
  {
    id: "4",
    type: "warning",
    message: "SSH Brute Force Attempt",
    source: "192.168.2.201",
    timestamp: "18 min ago",
  },
  {
    id: "5",
    type: "info",
    message: "New Device Connected to Network",
    source: "10.0.1.150",
    timestamp: "25 min ago",
  },
];

export function AlertsList() {
  const typeStyles = {
    critical: {
      bg: "bg-destructive/10",
      border: "border-destructive/30",
      icon: "text-destructive",
    },
    warning: {
      bg: "bg-warning/10",
      border: "border-warning/30",
      icon: "text-warning",
    },
    info: {
      bg: "bg-primary/10",
      border: "border-primary/30",
      icon: "text-primary",
    },
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 gradient-border">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Alerts</h3>
          <p className="text-sm text-muted-foreground">Latest threat detections</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-destructive/10 px-3 py-1">
          <div className="h-2 w-2 rounded-full bg-destructive status-pulse" />
          <span className="text-xs font-medium text-destructive">
            {alerts.filter((a) => a.type === "critical").length} Critical
          </span>
        </div>
      </div>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={cn(
              "flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/30",
              typeStyles[alert.type].bg,
              typeStyles[alert.type].border
            )}
          >
            <div className={cn("mt-0.5", typeStyles[alert.type].icon)}>
              {alert.type === "critical" ? (
                <AlertTriangle className="h-4 w-4" />
              ) : alert.type === "warning" ? (
                <AlertTriangle className="h-4 w-4" />
              ) : (
                <Shield className="h-4 w-4" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{alert.message}</p>
              <p className="text-xs text-muted-foreground">Source: {alert.source}</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {alert.timestamp}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
