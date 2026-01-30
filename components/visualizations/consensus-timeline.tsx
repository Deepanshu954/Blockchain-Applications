"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { 
  Cpu, 
  Coins, 
  Shield, 
  Zap, 
  Clock, 
  Leaf, 
  Users,
  ChevronRight,
  X
} from "lucide-react";

interface ConsensusMechanism {
  id: string;
  name: string;
  shortName: string;
  year: number;
  icon: typeof Cpu;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  principles: string[];
  specs: {
    throughput: string;
    finality: string;
    energy: string;
    decentralization: string;
  };
  examples: string[];
  tradeoffs: {
    pros: string[];
    cons: string[];
  };
}

const consensusMechanisms: ConsensusMechanism[] = [
  {
    id: "pow",
    name: "Proof-of-Work",
    shortName: "PoW",
    year: 2009,
    icon: Cpu,
    color: "#0A0A0A",
    bgColor: "#F5F5F0",
    borderColor: "#0A0A0A",
    description: "Miners compete to solve cryptographic puzzles. The first to find a valid solution earns the right to add the next block and receive rewards.",
    principles: [
      "Computational puzzle solving",
      "Longest chain rule",
      "Energy-backed security",
      "Permissionless participation"
    ],
    specs: {
      throughput: "3-7 TPS",
      finality: "~60 min (6 blocks)",
      energy: "~150 TWh/year",
      decentralization: "High"
    },
    examples: ["Bitcoin", "Litecoin", "Dogecoin"],
    tradeoffs: {
      pros: ["Battle-tested security", "Maximum decentralization", "Simple to understand"],
      cons: ["High energy consumption", "Slow finality", "Mining centralization risk"]
    }
  },
  {
    id: "pos",
    name: "Proof-of-Stake",
    shortName: "PoS",
    year: 2012,
    icon: Coins,
    color: "#4169E1",
    bgColor: "#E8EEFA",
    borderColor: "#4169E1",
    description: "Validators stake cryptocurrency as collateral. Selection probability correlates with stake size. Malicious behavior results in stake slashing.",
    principles: [
      "Economic stake as security",
      "Random validator selection",
      "Slashing penalties",
      "Delegated staking support"
    ],
    specs: {
      throughput: "15-100K TPS",
      finality: "~12-15 seconds",
      energy: "~0.01 TWh/year",
      decentralization: "Medium-High"
    },
    examples: ["Ethereum 2.0", "Cardano", "Solana", "Polkadot"],
    tradeoffs: {
      pros: ["99.95% less energy", "Faster finality", "Lower barrier to entry"],
      cons: ["Nothing-at-stake problem", "Wealth concentration", "Newer, less battle-tested"]
    }
  },
  {
    id: "bft",
    name: "Byzantine Fault Tolerance",
    shortName: "BFT",
    year: 2015,
    icon: Shield,
    color: "#2C4A9E",
    bgColor: "#E3E8F4",
    borderColor: "#2C4A9E",
    description: "Nodes communicate in rounds to reach agreement. Can tolerate up to 1/3 malicious nodes. Deterministic finality once consensus is reached.",
    principles: [
      "Multi-round voting",
      "2/3+ honest majority required",
      "Instant finality",
      "Known validator set"
    ],
    specs: {
      throughput: "1K-10K TPS",
      finality: "1-3 seconds",
      energy: "Minimal",
      decentralization: "Medium"
    },
    examples: ["Hyperledger Fabric", "Tendermint", "Cosmos", "Hedera"],
    tradeoffs: {
      pros: ["Instant finality", "Low energy", "High throughput"],
      cons: ["Limited validator set", "Communication overhead", "Centralization trade-off"]
    }
  }
];

const timelineYears = [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017];

export function ConsensusTimeline() {
  const [selectedMechanism, setSelectedMechanism] = useState<ConsensusMechanism | null>(null);
  const [hoveredMechanism, setHoveredMechanism] = useState<string | null>(null);
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

  const handleMechanismClick = (mechanism: ConsensusMechanism) => {
    setSelectedMechanism(mechanism);
  };

  const closeDetail = () => {
    setSelectedMechanism(null);
  };

  return (
    <div ref={containerRef} className="my-12">
      {/* Header */}
      <div className="mb-8 border-b-4 border-foreground pb-4">
        <h4 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
          Interactive Timeline
        </h4>
        <p className="text-lg font-bold">Evolution of Consensus Mechanisms</p>
        <p className="text-sm text-muted-foreground mt-1">
          Click on a mechanism to explore technical specifications
        </p>
      </div>

      {/* Timeline Container */}
      <div className="relative">
        {/* Year markers */}
        <div className="flex justify-between mb-2 px-4">
          {timelineYears.map((year) => (
            <span 
              key={year} 
              className={cn(
                "font-mono text-xs transition-all duration-500",
                isVisible ? "opacity-100" : "opacity-0",
                consensusMechanisms.some(m => m.year === year) 
                  ? "text-foreground font-bold" 
                  : "text-muted-foreground"
              )}
              style={{ 
                transitionDelay: `${(year - 2009) * 50}ms` 
              }}
            >
              {year}
            </span>
          ))}
        </div>

        {/* Timeline track */}
        <div className="relative h-4 bg-secondary border-2 border-foreground">
          <div 
            className="absolute inset-y-0 left-0 bg-primary transition-all duration-1000 ease-out"
            style={{ width: isVisible ? "100%" : "0%" }}
          />
        </div>

        {/* Mechanism nodes */}
        <div className="relative h-40 mt-4">
          {consensusMechanisms.map((mechanism, index) => {
            const position = ((mechanism.year - 2009) / (2017 - 2009)) * 100;
            const Icon = mechanism.icon;
            const isHovered = hoveredMechanism === mechanism.id;
            const isSelected = selectedMechanism?.id === mechanism.id;
            
            return (
              <button
                key={mechanism.id}
                onClick={() => handleMechanismClick(mechanism)}
                onMouseEnter={() => setHoveredMechanism(mechanism.id)}
                onMouseLeave={() => setHoveredMechanism(null)}
                className={cn(
                  "absolute transform -translate-x-1/2 cursor-pointer transition-all duration-300 group",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
                style={{ 
                  left: `${position}%`,
                  transitionDelay: `${index * 200 + 300}ms`,
                  zIndex: isHovered || isSelected ? 20 : 10 - index
                }}
              >
                {/* Connector line */}
                <div 
                  className={cn(
                    "absolute top-0 left-1/2 w-0.5 -translate-x-1/2 -translate-y-full transition-all duration-300",
                    isHovered || isSelected ? "h-8" : "h-6"
                  )}
                  style={{ backgroundColor: mechanism.color }}
                />

                {/* Node */}
                <div
                  className={cn(
                    "relative flex flex-col items-center transition-all duration-300",
                    isHovered || isSelected ? "scale-110" : "scale-100"
                  )}
                >
                  {/* Icon container */}
                  <div
                    className={cn(
                      "w-14 h-14 flex items-center justify-center border-3 transition-all duration-300",
                      isHovered || isSelected 
                        ? "border-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)]" 
                        : "border-2"
                    )}
                    style={{ 
                      backgroundColor: isHovered || isSelected ? mechanism.color : mechanism.bgColor,
                      borderColor: mechanism.borderColor
                    }}
                  >
                    <Icon 
                      className={cn(
                        "w-6 h-6 transition-colors duration-300",
                        isHovered || isSelected ? "text-white" : ""
                      )}
                      style={{ color: isHovered || isSelected ? "white" : mechanism.color }}
                    />
                  </div>

                  {/* Label */}
                  <div className="mt-3 text-center">
                    <p 
                      className={cn(
                        "font-bold text-sm transition-colors duration-300",
                        isHovered || isSelected ? "text-primary" : "text-foreground"
                      )}
                    >
                      {mechanism.shortName}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {mechanism.year}
                    </p>
                  </div>

                  {/* Hover tooltip */}
                  <div
                    className={cn(
                      "absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap",
                      "bg-foreground text-background px-3 py-1.5 text-xs font-medium",
                      "transition-all duration-200 pointer-events-none",
                      isHovered && !isSelected 
                        ? "opacity-100 translate-y-0" 
                        : "opacity-0 -translate-y-2"
                    )}
                  >
                    {mechanism.name}
                    <ChevronRight className="inline-block w-3 h-3 ml-1" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mt-8 mb-8">
        {consensusMechanisms.map((mechanism, index) => {
          const Icon = mechanism.icon;
          const isSelected = selectedMechanism?.id === mechanism.id;
          
          return (
            <button
              key={mechanism.id}
              onClick={() => handleMechanismClick(mechanism)}
              className={cn(
                "p-4 border-2 text-left transition-all duration-300 cursor-pointer",
                "hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5",
                isSelected 
                  ? "border-primary bg-primary/5 shadow-[4px_4px_0_0_rgba(65,105,225,1)]" 
                  : "border-foreground bg-background",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{ transitionDelay: `${index * 100 + 600}ms` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div 
                  className="w-8 h-8 flex items-center justify-center border-2"
                  style={{ 
                    backgroundColor: mechanism.bgColor,
                    borderColor: mechanism.borderColor 
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: mechanism.color }} />
                </div>
                <span className="font-bold text-sm">{mechanism.shortName}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <Zap className="w-3 h-3 text-muted-foreground" />
                  <span className="text-muted-foreground">TPS:</span>
                  <span className="font-mono font-bold">{mechanism.specs.throughput}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Finality:</span>
                  <span className="font-mono font-bold">{mechanism.specs.finality}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Leaf className="w-3 h-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Energy:</span>
                  <span className="font-mono font-bold text-[10px]">{mechanism.specs.energy}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail Panel */}
      {selectedMechanism && (
        <div 
          className="border-4 border-foreground bg-background relative overflow-hidden animate-in slide-in-from-bottom-4 duration-300"
        >
          {/* Header */}
          <div 
            className="p-6 border-b-4 border-foreground flex items-center justify-between"
            style={{ backgroundColor: selectedMechanism.bgColor }}
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 flex items-center justify-center border-3"
                style={{ 
                  backgroundColor: selectedMechanism.color,
                  borderColor: selectedMechanism.borderColor 
                }}
              >
                <selectedMechanism.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{selectedMechanism.name}</h3>
                <p className="text-sm text-muted-foreground font-mono">
                  Introduced {selectedMechanism.year}
                </p>
              </div>
            </div>
            <button 
              onClick={closeDetail}
              className="w-10 h-10 flex items-center justify-center border-2 border-foreground bg-background hover:bg-foreground hover:text-background transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-base mb-6">{selectedMechanism.description}</p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Core Principles */}
              <div className="border-2 border-foreground p-4">
                <h4 className="font-bold text-sm uppercase tracking-wider mb-3 pb-2 border-b-2 border-foreground">
                  Core Principles
                </h4>
                <ul className="space-y-2">
                  {selectedMechanism.principles.map((principle, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span 
                        className="w-1.5 h-1.5 mt-1.5 flex-shrink-0"
                        style={{ backgroundColor: selectedMechanism.color }}
                      />
                      {principle}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technical Specs */}
              <div className="border-2 border-foreground p-4">
                <h4 className="font-bold text-sm uppercase tracking-wider mb-3 pb-2 border-b-2 border-foreground">
                  Technical Specifications
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Zap className="w-3 h-3" />
                      Throughput
                    </div>
                    <p className="font-mono font-bold text-lg">{selectedMechanism.specs.throughput}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Clock className="w-3 h-3" />
                      Finality
                    </div>
                    <p className="font-mono font-bold text-lg">{selectedMechanism.specs.finality}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Leaf className="w-3 h-3" />
                      Energy
                    </div>
                    <p className="font-mono font-bold text-sm">{selectedMechanism.specs.energy}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Users className="w-3 h-3" />
                      Decentralization
                    </div>
                    <p className="font-mono font-bold text-lg">{selectedMechanism.specs.decentralization}</p>
                  </div>
                </div>
              </div>

              {/* Trade-offs */}
              <div className="border-2 border-foreground p-4">
                <h4 className="font-bold text-sm uppercase tracking-wider mb-3 pb-2 border-b-2 border-foreground">
                  Trade-offs
                </h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-bold text-sentiment-good mb-1.5">Advantages</p>
                    <ul className="space-y-1">
                      {selectedMechanism.tradeoffs.pros.map((pro, i) => (
                        <li key={i} className="text-xs flex items-start gap-1.5">
                          <span className="text-sentiment-good">+</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-destructive mb-1.5">Limitations</p>
                    <ul className="space-y-1">
                      {selectedMechanism.tradeoffs.cons.map((con, i) => (
                        <li key={i} className="text-xs flex items-start gap-1.5">
                          <span className="text-destructive">-</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Examples */}
              <div className="border-2 border-foreground p-4">
                <h4 className="font-bold text-sm uppercase tracking-wider mb-3 pb-2 border-b-2 border-foreground">
                  Notable Implementations
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMechanism.examples.map((example, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1.5 text-sm font-medium border-2"
                      style={{ 
                        borderColor: selectedMechanism.color,
                        backgroundColor: selectedMechanism.bgColor
                      }}
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
