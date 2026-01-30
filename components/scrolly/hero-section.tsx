"use client";

import { useEffect, useState } from "react";
import { ChevronDown, FileText, BookOpen, Shield, Cpu } from "lucide-react";

const keywords = [
  "Blockchain",
  "Distributed Ledger Technology",
  "Consensus Mechanisms",
  "Smart Contracts",
  "Enterprise Transformation",
  "Cryptography",
  "Decentralization",
];

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen bg-[#4169E1] text-white overflow-hidden"
    >
      {/* Geometric Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-[10%] w-32 h-32 border-4 border-white/10 rotate-12" />
        <div className="absolute bottom-40 left-[5%] w-24 h-24 bg-white/5" />
        <div className="absolute top-1/3 left-[15%] w-16 h-16 border-2 border-white/10 rotate-45" />
        <div className="absolute bottom-1/4 right-[20%] w-20 h-20 bg-[#2E4CB3]/50" />
        <div className="absolute top-1/2 right-[8%] w-40 h-1 bg-white/20" />
        <div className="absolute bottom-[30%] left-[25%] w-1 h-32 bg-white/10" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8 pt-24 pb-16 min-h-screen flex flex-col">
        {/* Header Badge */}
        <div
          className={`transition-all duration-700 delay-100 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 mb-8">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-mono tracking-wide">
              Academic Research Paper
            </span>
          </div>
        </div>

        {/* Main Title */}
        <div
          className={`flex-1 flex flex-col justify-center transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h1 className="text-white mb-6 max-w-4xl">
            Blockchain Applications
          </h1>
          <p className="text-2xl md:text-3xl font-light text-white/90 mb-8 max-w-3xl leading-relaxed">
            Technical Foundations & Enterprise Transformation
          </p>

          {/* Abstract Preview */}
          <div className="max-w-2xl mb-10">
            <p className="text-white/80 leading-relaxed">
              A comprehensive analysis of blockchain's technical foundations,
              enterprise applications, and challenges—examining consensus
              mechanisms, cryptographic primitives, and real-world deployments
              across finance, supply chain, and healthcare.
            </p>
          </div>

          {/* Keywords */}
          <div className="flex flex-wrap gap-2 mb-12">
            {keywords.map((keyword) => (
              <span
                key={keyword}
                className="px-3 py-1 text-sm bg-white/10 border border-white/20 font-mono"
              >
                {keyword}
              </span>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
            {[
              { icon: BookOpen, label: "Sections", value: "12" },
              { icon: FileText, label: "References", value: "40+" },
              { icon: Shield, label: "Case Studies", value: "3" },
              { icon: Cpu, label: "Platforms", value: "5+" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-4 bg-white/5 border border-white/10"
              >
                <stat.icon className="w-5 h-5 mb-2 text-white/70" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className={`flex flex-col items-center transition-all duration-700 delay-500 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="text-sm text-white/60 mb-2 font-mono">
            Scroll to explore
          </span>
          <ChevronDown className="w-6 h-6 text-white/60 animate-bounce" />
        </div>
      </div>

      {/* Bottom Geometric Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#2E4CB3]" />
    </section>
  );
}
