import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "danger" | "warning";
}

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  variant = "default" 
}: StatsCardProps) {
  const variantStyles = {
    default: "text-primary",
    success: "text-success",
    danger: "text-destructive",
    warning: "text-warning",
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 gradient-border">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-semibold tracking-tight text-foreground">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <p className={cn(
              "text-xs font-medium",
              trend.isPositive ? "text-success" : "text-destructive"
            )}>
              {trend.isPositive ? "+" : ""}{trend.value}% from last hour
            </p>
          )}
        </div>
        <div className={cn(
          "rounded-lg p-3 bg-muted/50",
          variantStyles[variant]
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
