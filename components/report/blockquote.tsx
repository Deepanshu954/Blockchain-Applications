"use client";

import { cn } from "@/lib/utils";
import { Quote } from "lucide-react";

interface BlockquoteProps {
  quote: string;
  citation?: string;
  className?: string;
}

export function Blockquote({
  quote,
  citation,
  className,
}: BlockquoteProps) {
  return (
    <blockquote
      className={cn(
        "relative my-8 border-l-4 border-primary bg-secondary/50 p-6 pl-8",
        className
      )}
    >
      <Quote className="absolute -left-3 -top-3 h-6 w-6 bg-background text-primary" />
      <p className="text-lg italic leading-relaxed text-foreground/90">
        &ldquo;{quote}&rdquo;
      </p>
      {citation && (
        <footer className="mt-3 text-xs font-mono text-muted-foreground">
          [{citation}]
        </footer>
      )}
    </blockquote>
  );
}
