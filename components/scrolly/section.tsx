"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "hero" | "alternate" | "accent";
  fullWidth?: boolean;
}

export function Section({
  id,
  children,
  className,
  variant = "default",
  fullWidth = false,
}: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const variantStyles = {
    default: "bg-background",
    hero: "bg-[#4169E1] text-white",
    alternate: "bg-warm-gray",
    accent: "bg-charcoal text-white",
  };

  return (
    <section
      id={id}
      ref={ref}
      className={cn(
        "relative py-16 md:py-24",
        variantStyles[variant],
        className
      )}
    >
      <div
        className={cn(
          "transition-all duration-700 ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          fullWidth ? "w-full" : "mx-auto max-w-5xl px-6 md:px-8"
        )}
      >
        {children}
      </div>
    </section>
  );
}

interface SectionHeaderProps {
  number?: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({
  number,
  title,
  subtitle,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-10 md:mb-14", className)}>
      <div className="flex items-baseline gap-4 mb-3">
        {number && (
          <span className="font-mono text-sm font-semibold text-primary tracking-wider">
            {number}
          </span>
        )}
        <div className="h-[2px] flex-1 bg-primary/20 max-w-24" />
      </div>
      <h2 className="text-charcoal">{title}</h2>
      {subtitle && (
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}

interface SubsectionProps {
  id?: string;
  title: string;
  children: ReactNode;
  className?: string;
}

export function Subsection({ id, title, children, className }: SubsectionProps) {
  return (
    <div id={id} className={cn("mb-10", className)}>
      <h4 className="text-charcoal mb-4 flex items-center gap-3">
        <span className="w-2 h-2 bg-primary inline-block" />
        {title}
      </h4>
      <div className="prose-academic">{children}</div>
    </div>
  );
}
