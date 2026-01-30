"use client";

import { cn } from "@/lib/utils";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        "border-t-2 border-foreground bg-foreground px-4 py-8 text-background",
        className
      )}
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-background/60">
              Blockchain Applications Research
            </p>
            <p className="mt-1 text-sm text-background/80">
              Technical Foundations & Enterprise Transformation
            </p>
          </div>
          <p className="text-xs text-background/50 font-mono">
            Deepanshu Chauhan
          </p>
        </div>
      </div>
    </footer>
  );
}
