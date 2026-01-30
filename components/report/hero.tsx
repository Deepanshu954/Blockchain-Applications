"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface HeroProps {
  title: string;
  subtitle?: string;
}

export function Hero({ title, subtitle }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-primary px-4"
    >
      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        style={{ opacity, y }}
        className="relative z-10 mx-auto max-w-5xl text-center"
      >
        <h1 className="text-primary-foreground text-balance">{title}</h1>
        {subtitle && (
          <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-foreground/80 md:text-xl lg:text-2xl font-light">
            {subtitle}
          </p>
        )}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="h-8 w-8 text-primary-foreground/60" />
      </motion.div>
    </section>
  );
}
