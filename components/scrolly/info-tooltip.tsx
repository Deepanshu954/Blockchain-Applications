"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

interface InfoTooltipProps {
  term: string;
  definition: string;
  children?: ReactNode;
  className?: string;
}

export function InfoTooltip({
  term,
  definition,
  children,
  className,
}: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span className={cn("relative inline-block", className)}>
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="underline decoration-dotted decoration-primary underline-offset-2 cursor-pointer hover:text-primary transition-colors"
      >
        {children || term}
      </button>
      {isVisible && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-4 bg-charcoal text-white text-sm shadow-lg border-2 border-charcoal">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
            <div>
              <strong className="block mb-1 text-white">{term}</strong>
              <span className="text-white/80">{definition}</span>
            </div>
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-charcoal" />
        </div>
      )}
    </span>
  );
}
