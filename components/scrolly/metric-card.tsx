"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface MetricCardProps {
  metric: string;
  description: string;
  icon?: ReactNode;
  sentiment?: "positive" | "negative" | "neutral";
  className?: string;
}

export function MetricCard({
  metric,
  description,
  icon,
  sentiment = "neutral",
  className,
}: MetricCardProps) {
  const sentimentColors = {
    positive: "border-l-green-500",
    negative: "border-l-red-500",
    neutral: "border-l-primary",
  };

  return (
    <div
      className={cn(
        "bg-card p-5 border-2 border-charcoal border-l-4",
        sentimentColors[sentiment],
        "shadow-[3px_3px_0_#1A1A2E]",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {icon && <div className="text-muted-foreground mt-1">{icon}</div>}
        <div>
          <div className="text-2xl font-bold text-charcoal mb-1">{metric}</div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}

interface MetricGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function MetricGrid({
  children,
  columns = 3,
  className,
}: MetricGridProps) {
  const colClasses = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-4", colClasses[columns], className)}>
      {children}
    </div>
  );
}
