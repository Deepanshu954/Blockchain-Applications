"use client";

import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

interface EventCardProps {
  date: string;
  event: string;
  citation?: string;
  className?: string;
}

export function EventCard({
  date,
  event,
  citation,
  className,
}: EventCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });

  return (
    <div
      className={cn(
        "border-2 border-foreground bg-card p-4 border-l-4 border-l-primary",
        className
      )}
    >
      <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
        <Calendar className="h-3 w-3" />
        {formattedDate}
      </div>
      <p className="mt-2 text-sm font-medium leading-snug">{event}</p>
      {citation && (
        <p className="mt-2 text-xs text-muted-foreground/70 font-mono">[{citation}]</p>
      )}
    </div>
  );
}
