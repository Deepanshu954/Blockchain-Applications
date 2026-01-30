"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NetworkData {
  name: string;
  tps: number;
  maxTps: number;
  category: "blockchain" | "layer2" | "traditional";
  description: string;
  technology: string;
  color: string;
}

const networkData: NetworkData[] = [
  {
    name: "Bitcoin",
    tps: 7,
    maxTps: 7,
    category: "blockchain",
    description: "The original cryptocurrency using Proof-of-Work consensus",
    technology: "PoW, SHA-256, 10-min blocks",
    color: "#F7931A",
  },
  {
    name: "Ethereum",
    tps: 15,
    maxTps: 30,
    category: "blockchain",
    description: "Smart contract platform, now using Proof-of-Stake",
    technology: "PoS, EVM, 12-sec blocks",
    color: "#627EEA",
  },
  {
    name: "Solana",
    tps: 4000,
    maxTps: 65000,
    category: "blockchain",
    description: "High-performance blockchain with Proof of History",
    technology: "PoH + PoS, 400ms blocks",
    color: "#14F195",
  },
  {
    name: "Polygon",
    tps: 7000,
    maxTps: 65000,
    category: "layer2",
    description: "Ethereum Layer 2 scaling solution using sidechains",
    technology: "PoS sidechain, Plasma, zkRollups",
    color: "#8247E5",
  },
  {
    name: "Arbitrum",
    tps: 40000,
    maxTps: 40000,
    category: "layer2",
    description: "Optimistic rollup for Ethereum scaling",
    technology: "Optimistic Rollup, fraud proofs",
    color: "#28A0F0",
  },
  {
    name: "Visa",
    tps: 24000,
    maxTps: 65000,
    category: "traditional",
    description: "Global payment processing network",
    technology: "Centralized, proprietary infrastructure",
    color: "#1A1F71",
  },
];

const categoryLabels: Record<NetworkData["category"], string> = {
  blockchain: "Layer 1 Blockchain",
  layer2: "Layer 2 Solution",
  traditional: "Traditional Finance",
};

export function TPSComparator({ className }: { className?: string }) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [showHighThroughput, setShowHighThroughput] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection observer for scroll-triggered animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.4 && !hasAnimated) {
            setHasAnimated(true);
            // Start animation sequence
            setTimeout(() => {
              setAnimationProgress(1);
            }, 300);
            setTimeout(() => {
              setShowHighThroughput(true);
              setAnimationProgress(2);
            }, 1500);
          }
        });
      },
      { threshold: 0.4 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  // Calculate max TPS for scale (logarithmic for better visualization)
  const maxTPS = Math.max(...networkData.map((n) => n.tps));
  
  // Get networks to display based on animation state
  const visibleNetworks = showHighThroughput 
    ? networkData 
    : networkData.filter(n => n.category === "blockchain" && n.tps < 100);

  // Calculate bar width using logarithmic scale for dramatic effect
  const getBarWidth = (tps: number, animated: boolean) => {
    if (!animated) return 0;
    const logMax = Math.log10(maxTPS + 1);
    const logTps = Math.log10(tps + 1);
    return (logTps / logMax) * 100;
  };

  // Format TPS for display
  const formatTPS = (tps: number) => {
    if (tps >= 1000) {
      return `${(tps / 1000).toFixed(tps >= 10000 ? 0 : 1)}K`;
    }
    return tps.toString();
  };

  return (
    <TooltipProvider delayDuration={100}>
      <div
        ref={containerRef}
        className={cn(
          "my-8 border-2 border-foreground bg-background p-6 md:p-8",
          className
        )}
      >
        {/* Header */}
        <div className="mb-6 border-b-2 border-foreground pb-4">
          <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Network Throughput Comparison
          </h4>
          <p className="mt-1 text-lg font-bold">
            Transactions Per Second (TPS)
          </p>
        </div>

        {/* Chart Container */}
        <div className="space-y-4">
          {visibleNetworks.map((network, index) => (
            <Tooltip key={network.name}>
              <TooltipTrigger asChild>
                <div 
                  className="group cursor-pointer"
                  style={{
                    opacity: hasAnimated ? 1 : 0,
                    transform: hasAnimated ? 'translateX(0)' : 'translateX(-20px)',
                    transition: `opacity 0.4s ease ${index * 0.1}s, transform 0.4s ease ${index * 0.1}s`,
                  }}
                >
                  {/* Network Label Row */}
                  <div className="mb-1 flex items-baseline justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold uppercase tracking-tight">
                        {network.name}
                      </span>
                      <span 
                        className="font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 border"
                        style={{ 
                          borderColor: network.color,
                          color: network.color,
                        }}
                      >
                        {categoryLabels[network.category]}
                      </span>
                    </div>
                    <span 
                      className="font-mono text-lg font-black tabular-nums"
                      style={{ color: network.color }}
                    >
                      {formatTPS(network.tps)}
                      <span className="ml-1 text-xs font-normal text-muted-foreground">
                        TPS
                      </span>
                    </span>
                  </div>

                  {/* Bar */}
                  <div className="relative h-8 w-full border-2 border-foreground bg-secondary/30">
                    {/* Background grid lines */}
                    <div 
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `repeating-linear-gradient(
                          to right,
                          transparent,
                          transparent calc(20% - 1px),
                          rgba(0,0,0,0.1) calc(20% - 1px),
                          rgba(0,0,0,0.1) 20%
                        )`,
                      }}
                    />
                    
                    {/* Animated bar */}
                    <div
                      className="absolute inset-y-0 left-0 flex items-center justify-end pr-2 transition-all duration-1000 ease-out"
                      style={{
                        width: `${getBarWidth(network.tps, animationProgress >= 1)}%`,
                        backgroundColor: network.color,
                        minWidth: animationProgress >= 1 ? '2%' : '0%',
                      }}
                    >
                      {/* Stripe pattern overlay */}
                      <div 
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage: `repeating-linear-gradient(
                            45deg,
                            transparent,
                            transparent 4px,
                            rgba(255,255,255,0.3) 4px,
                            rgba(255,255,255,0.3) 8px
                          )`,
                        }}
                      />
                    </div>

                    {/* Hover indicator */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary transition-colors duration-150" />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent 
                side="right" 
                className="max-w-xs border-2 border-foreground bg-background p-4 text-foreground"
                sideOffset={12}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-3 w-3 border border-foreground"
                      style={{ backgroundColor: network.color }}
                    />
                    <span className="font-bold">{network.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {network.description}
                  </p>
                  <div className="border-t border-foreground/20 pt-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      Technology
                    </span>
                    <p className="font-mono text-xs mt-0.5">
                      {network.technology}
                    </p>
                  </div>
                  <div className="flex justify-between font-mono text-xs">
                    <span>Current TPS:</span>
                    <span className="font-bold">{network.tps.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-mono text-xs text-muted-foreground">
                    <span>Max Capacity:</span>
                    <span>{network.maxTps.toLocaleString()}</span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Animation state indicator */}
        {!showHighThroughput && hasAnimated && (
          <div 
            className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground"
            style={{
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          >
            <span className="inline-block h-2 w-2 bg-primary animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider">
              Loading high-throughput networks...
            </span>
          </div>
        )}

        {/* Scale Legend */}
        {showHighThroughput && (
          <div 
            className="mt-6 border-t-2 border-foreground pt-4"
            style={{
              opacity: showHighThroughput ? 1 : 0,
              transition: 'opacity 0.5s ease 0.3s',
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                {(["blockchain", "layer2", "traditional"] as const).map((category) => (
                  <div key={category} className="flex items-center gap-1.5">
                    <div 
                      className="h-2 w-2 border border-foreground"
                      style={{ 
                        backgroundColor: networkData.find(n => n.category === category)?.color 
                      }}
                    />
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {categoryLabels[category]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="font-mono text-[10px] text-muted-foreground">
                Scale: Logarithmic
              </div>
            </div>

            {/* Key insight callout */}
            <div className="mt-4 border-l-4 border-primary bg-primary/5 p-4">
              <p className="font-mono text-xs uppercase tracking-wider text-primary mb-1">
                Key Insight
              </p>
              <p className="text-sm">
                Layer 2 solutions like Arbitrum achieve throughput comparable to Visa while 
                inheriting Ethereum&apos;s security guarantees. This represents a{" "}
                <span className="font-bold">5,700x improvement</span> over Bitcoin&apos;s base layer.
              </p>
            </div>
          </div>
        )}

        {/* Initial state message */}
        {!hasAnimated && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 h-16 w-16 border-2 border-foreground bg-primary/10 flex items-center justify-center">
              <span className="font-mono text-2xl font-bold text-primary">TPS</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Scroll to reveal the dramatic difference in transaction throughput 
              between blockchain networks and traditional payment systems.
            </p>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
