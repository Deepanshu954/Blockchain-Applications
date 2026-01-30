"use client";

import { useRef, type ReactNode } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  variant?: "default" | "primary" | "dark" | "muted";
}

export function Section({
  children,
  className,
  id,
  variant = "default",
}: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const variantStyles = {
    default: "bg-background text-foreground",
    primary: "bg-primary text-primary-foreground",
    dark: "bg-foreground text-background",
    muted: "bg-secondary text-secondary-foreground",
  };

  return (
    <section
      ref={ref}
      id={id}
      className={cn(
        "relative w-full px-4 py-16 md:px-8 md:py-24 lg:py-32",
        variantStyles[variant],
        className
      )}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
      }}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({ title, subtitle, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-12 md:mb-16", className)}>
      <h2 className="border-b-4 border-current pb-4 text-balance">{title}</h2>
      {subtitle && (
        <p className="mt-4 text-lg text-muted-foreground md:text-xl">{subtitle}</p>
      )}
    </div>
  );
}

interface ContentRowProps {
  children: ReactNode;
  className?: string;
}

export function ContentRow({ children, className }: ContentRowProps) {
  return (
    <div
      className={cn(
        "grid gap-8 lg:grid-cols-[1fr_280px] lg:gap-12",
        className
      )}
    >
      {children}
    </div>
  );
}

interface PrimaryColumnProps {
  children: ReactNode;
  className?: string;
}

export function PrimaryColumn({ children, className }: PrimaryColumnProps) {
  return (
    <div className={cn("prose prose-lg max-w-none", className)}>
      {children}
    </div>
  );
}

interface SidebarColumnProps {
  children: ReactNode;
  className?: string;
}

export function SidebarColumn({ children, className }: SidebarColumnProps) {
  return (
    <aside className={cn("flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start", className)}>
      {children}
    </aside>
  );
}
