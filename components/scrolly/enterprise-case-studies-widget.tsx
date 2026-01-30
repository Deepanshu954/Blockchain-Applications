"use client";

import React from "react"

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  ArrowRight,
  Building2,
  Ship,
  Landmark,
  Clock,
  TrendingDown,
  Zap,
  AlertTriangle,
  Users,
  DollarSign,
  Globe,
} from "lucide-react";

interface CaseStudy {
  id: string;
  company: string;
  logo: React.ReactNode;
  industry: string;
  heroMetric: string;
  heroMetricLabel: string;
  status: "success" | "discontinued" | "active";
  statusLabel: string;
  blockchain: string;
  yearLaunched: number;
  yearEnded?: number;
  challenge: string;
  solution: string;
  outcomes: {
    metric: string;
    label: string;
    sentiment: "positive" | "negative" | "neutral";
  }[];
  keyInsight: string;
  backgroundColor: string;
  accentColor: string;
}

const caseStudies: CaseStudy[] = [
  {
    id: "walmart",
    company: "Walmart",
    logo: <Building2 className="w-12 h-12" />,
    industry: "Retail / Supply Chain",
    heroMetric: "7 days → 2.2s",
    heroMetricLabel: "Traceability Time Reduction",
    status: "success",
    statusLabel: "Operational Success",
    blockchain: "Hyperledger Fabric",
    yearLaunched: 2018,
    challenge:
      "Traditional food traceability required 7 days to trace produce from farm to store, making rapid recall responses impossible during contamination events.",
    solution:
      "Deployed Hyperledger Fabric-based food traceability system across leafy greens supply chain with mandatory supplier participation.",
    outcomes: [
      { metric: "2.2 sec", label: "Traceability time", sentiment: "positive" },
      { metric: "25%", label: "Waste reduction", sentiment: "positive" },
      { metric: "40%", label: "Shipping delay reduction", sentiment: "positive" },
      { metric: "100+", label: "Supplier integrations", sentiment: "neutral" },
    ],
    keyInsight:
      "Demonstrates that permissioned blockchains excel in enterprise supply chains when a dominant participant can mandate adoption.",
    backgroundColor: "#1A1A2E",
    accentColor: "#0071CE",
  },
  {
    id: "maersk",
    company: "Maersk TradeLens",
    logo: <Ship className="w-12 h-12" />,
    industry: "Global Shipping",
    heroMetric: "2018 → 2022",
    heroMetricLabel: "Platform Lifecycle",
    status: "discontinued",
    statusLabel: "Discontinued",
    blockchain: "Hyperledger Fabric",
    yearLaunched: 2018,
    yearEnded: 2022,
    challenge:
      "Global shipping documentation involves 30+ organizations per shipment with paper-based processes causing delays and disputes.",
    solution:
      "IBM-Maersk joint venture creating blockchain-based shipping documentation platform with digital bill of lading and cargo tracking.",
    outcomes: [
      { metric: "150+", label: "Organizations onboarded", sentiment: "neutral" },
      { metric: "20M+", label: "Containers tracked", sentiment: "positive" },
      { metric: "~40%", label: "Documentation time savings", sentiment: "positive" },
      { metric: "Failed", label: "Industry-wide adoption", sentiment: "negative" },
    ],
    keyInsight:
      "Illustrates that technical success is insufficient—governance and neutral platform ownership are critical for multi-stakeholder blockchain consortia.",
    backgroundColor: "#1A1A2E",
    accentColor: "#00A3E0",
  },
  {
    id: "jpmorgan",
    company: "JPMorgan Kinexys",
    logo: <Landmark className="w-12 h-12" />,
    industry: "Financial Services",
    heroMetric: "$1B+ daily",
    heroMetricLabel: "Transaction Volume",
    status: "active",
    statusLabel: "Active & Scaling",
    blockchain: "Quorum / Onyx",
    yearLaunched: 2020,
    challenge:
      "Cross-border payments require multiple correspondent banks, causing 3-5 day settlement times and significant trapped liquidity.",
    solution:
      "Enterprise-grade permissioned blockchain (Quorum-based) enabling programmable payments with real-time settlement for institutional clients.",
    outcomes: [
      { metric: "$1B+", label: "Daily volume processed", sentiment: "positive" },
      { metric: "Seconds", label: "Settlement time", sentiment: "positive" },
      { metric: "24/7", label: "Operating hours", sentiment: "positive" },
      { metric: "100+", label: "Enterprise clients", sentiment: "positive" },
    ],
    keyInsight:
      "Proves that blockchain can achieve enterprise-grade deployment with regulatory compliance when controlled by a trusted financial institution.",
    backgroundColor: "#1A1A2E",
    accentColor: "#1A73E8",
  },
];

interface FlipCardProps {
  study: CaseStudy;
  isActive: boolean;
  isFlipped: boolean;
  onFlip: () => void;
  position: "left" | "center" | "right";
}

function FlipCard({ study, isActive, isFlipped, onFlip, position }: FlipCardProps) {
  const positionStyles = {
    left: "scale-75 -translate-x-[40%] opacity-40 z-0",
    center: "scale-100 translate-x-0 opacity-100 z-10",
    right: "scale-75 translate-x-[40%] opacity-40 z-0",
  };

  const StatusIcon = study.status === "success" ? Check : study.status === "active" ? Zap : X;
  const statusColors = {
    success: "bg-emerald-500",
    active: "bg-blue-500",
    discontinued: "bg-red-500",
  };

  return (
    <div
      className={cn(
        "absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500 ease-out cursor-pointer",
        "w-[320px] md:w-[380px] h-[480px] md:h-[520px]",
        positionStyles[position],
        !isActive && "pointer-events-none"
      )}
      style={{ perspective: "1500px" }}
      onClick={isActive ? onFlip : undefined}
      onKeyDown={(e) => {
        if (isActive && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onFlip();
        }
      }}
      tabIndex={isActive ? 0 : -1}
      role="button"
      aria-label={`${study.company} case study. ${isFlipped ? "Click to see summary" : "Click to see details"}`}
    >
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-700 ease-out",
          "[transform-style:preserve-3d]"
        )}
        style={{
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front of Card */}
        <div
          className="absolute inset-0 [backface-visibility:hidden] brutalist-border bg-card"
          style={{ boxShadow: `8px 8px 0 ${study.accentColor}` }}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div
              className="p-6 text-white relative overflow-hidden"
              style={{ backgroundColor: study.backgroundColor }}
            >
              {/* Geometric accent */}
              <div
                className="absolute -right-8 -top-8 w-32 h-32 opacity-20"
                style={{ backgroundColor: study.accentColor }}
              />
              <div
                className="absolute right-4 bottom-0 w-16 h-2"
                style={{ backgroundColor: study.accentColor }}
              />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div style={{ color: study.accentColor }}>{study.logo}</div>
                  <div
                    className={cn(
                      "flex items-center gap-1.5 px-2 py-1 text-xs font-bold text-white",
                      statusColors[study.status]
                    )}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {study.statusLabel}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-1">{study.company}</h3>
                <p className="text-sm opacity-70">{study.industry}</p>
              </div>
            </div>

            {/* Hero Metric */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div
                className="text-4xl md:text-5xl font-bold mb-2 font-mono tracking-tight"
                style={{ color: study.accentColor }}
              >
                {study.heroMetric}
              </div>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                {study.heroMetricLabel}
              </p>

              <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="px-2 py-1 bg-secondary font-mono">{study.blockchain}</span>
                <span className="text-border">|</span>
                <span>
                  {study.yearLaunched}
                  {study.yearEnded ? ` - ${study.yearEnded}` : " - Present"}
                </span>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="p-4 border-t-2 border-charcoal bg-secondary">
              <div className="flex items-center justify-center gap-2 text-sm font-semibold text-charcoal">
                <span>Tap to reveal details</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Back of Card */}
        <div
          className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] brutalist-border bg-card overflow-hidden"
          style={{ boxShadow: `8px 8px 0 ${study.accentColor}` }}
        >
          <div className="h-full flex flex-col">
            {/* Header - Compact */}
            <div
              className="px-4 py-3 text-white flex items-center justify-between"
              style={{ backgroundColor: study.backgroundColor }}
            >
              <div className="flex items-center gap-3">
                <div style={{ color: study.accentColor }}>{study.logo}</div>
                <div>
                  <h4 className="font-bold text-lg leading-tight">{study.company}</h4>
                  <p className="text-xs opacity-70">{study.blockchain}</p>
                </div>
              </div>
              <div
                className={cn(
                  "w-8 h-8 flex items-center justify-center text-white",
                  statusColors[study.status]
                )}
              >
                <StatusIcon className="w-4 h-4" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {/* Challenge */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Challenge
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{study.challenge}</p>
              </div>

              {/* Solution */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Zap className="w-4 h-4" style={{ color: study.accentColor }} />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Solution
                  </span>
                </div>
                <p className="text-sm leading-relaxed">{study.solution}</p>
              </div>

              {/* Outcomes Grid */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Key Outcomes
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {study.outcomes.map((outcome, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "p-2 border-2 border-charcoal text-center",
                        outcome.sentiment === "positive" && "bg-emerald-50",
                        outcome.sentiment === "negative" && "bg-red-50",
                        outcome.sentiment === "neutral" && "bg-secondary"
                      )}
                    >
                      <div
                        className={cn(
                          "text-lg font-bold font-mono",
                          outcome.sentiment === "positive" && "text-emerald-600",
                          outcome.sentiment === "negative" && "text-red-600",
                          outcome.sentiment === "neutral" && "text-charcoal"
                        )}
                      >
                        {outcome.metric}
                      </div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        {outcome.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Key Insight Footer */}
            <div className="p-3 border-t-2 border-charcoal bg-secondary">
              <p className="text-xs text-charcoal leading-relaxed">
                <span className="font-bold">Key Insight:</span> {study.keyInsight}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EnterpriseCaseStudiesWidget() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.4 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleFlip = (id: string) => {
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const navigate = (direction: "prev" | "next") => {
    // Reset flip state when navigating
    setFlippedCards({});
    setActiveIndex((prev) => {
      if (direction === "prev") {
        return prev === 0 ? caseStudies.length - 1 : prev - 1;
      }
      return prev === caseStudies.length - 1 ? 0 : prev + 1;
    });
  };

  const getPosition = (index: number): "left" | "center" | "right" => {
    const diff = index - activeIndex;
    if (diff === 0) return "center";
    if (diff === -1 || (activeIndex === 0 && index === caseStudies.length - 1)) return "left";
    if (diff === 1 || (activeIndex === caseStudies.length - 1 && index === 0)) return "right";
    return "right";
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full transition-all duration-700 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border-2 border-primary/20 mb-4">
          <Globe className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Real-World Deployments
          </span>
        </div>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Compare enterprise blockchain implementations across supply chain, shipping, and finance.
          Click cards to reveal detailed analysis.
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative h-[540px] md:h-[580px] overflow-hidden">
        {/* Navigation Buttons */}
        <button
          onClick={() => navigate("prev")}
          className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-card brutalist-border flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer"
          aria-label="Previous case study"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => navigate("next")}
          className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-card brutalist-border flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer"
          aria-label="Next case study"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Cards */}
        <div className="relative w-full h-full">
          {caseStudies.map((study, index) => (
            <FlipCard
              key={study.id}
              study={study}
              isActive={index === activeIndex}
              isFlipped={flippedCards[study.id] || false}
              onFlip={() => handleFlip(study.id)}
              position={getPosition(index)}
            />
          ))}
        </div>
      </div>

      {/* Indicators */}
      <div className="flex items-center justify-center gap-3 mt-6">
        {caseStudies.map((study, index) => (
          <button
            key={study.id}
            onClick={() => {
              setFlippedCards({});
              setActiveIndex(index);
            }}
            className={cn(
              "flex items-center gap-2 px-3 py-2 border-2 border-charcoal transition-all cursor-pointer",
              index === activeIndex
                ? "bg-charcoal text-white"
                : "bg-card text-charcoal hover:bg-secondary"
            )}
            aria-label={`Go to ${study.company} case study`}
            aria-current={index === activeIndex ? "true" : "false"}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              {study.logo}
            </div>
            <span className="text-xs font-bold hidden md:inline">{study.company.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-emerald-500" />
          <span>Success</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-blue-500" />
          <span>Active</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-red-500" />
          <span>Discontinued</span>
        </div>
      </div>
    </div>
  );
}
