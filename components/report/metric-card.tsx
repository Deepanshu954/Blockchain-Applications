"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  metric: string;
  description: string;
  sentiment?: "good" | "warning" | "neutral";
  citation?: string;
  className?: string;
}

export function MetricCard({
  metric,
  description,
  sentiment = "neutral",
  citation,
  className,
}: MetricCardProps) {
  const sentimentConfig = {
    good: {
      border: "border-l-[#16A34A]",
      icon: TrendingUp,
      iconColor: "text-[#16A34A]",
    },
    warning: {
      border: "border-l-[#D97706]",
      icon: TrendingDown,
      iconColor: "text-[#D97706]",
    },
    neutral: {
      border: "border-l-[#525252]",
      icon: Minus,
      iconColor: "text-[#525252]",
    },
  };

  const config = sentimentConfig[sentiment];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "border-2 border-foreground bg-card p-4 border-l-4",
        config.border,
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="font-mono text-3xl font-black tracking-tight md:text-4xl">
          {metric}
        </div>
        <Icon className={cn("h-5 w-5 shrink-0", config.iconColor)} />
      </div>
      <p className="mt-2 text-sm text-muted-foreground leading-snug">{description}</p>
      {citation && (
        <p className="mt-2 text-xs text-muted-foreground/70 font-mono">[{citation}]</p>
      )}
    </div>
  );
}
