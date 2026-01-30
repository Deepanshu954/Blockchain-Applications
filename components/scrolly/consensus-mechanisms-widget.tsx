"use client";

import React from "react"

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  Cpu,
  Coins,
  Vote,
  Zap,
  Clock,
  Leaf,
  Network,
  ChevronRight,
} from "lucide-react";

// Types
type ConsensusMechanism = "pow" | "pos" | "bft";

interface Node {
  id: number;
  x: number;
  y: number;
  stake?: number;
  computing?: number;
  vote?: "agree" | "disagree" | null;
  isLeader?: boolean;
  isWinner?: boolean;
  color: string;
}

interface MechanismData {
  name: string;
  shortName: string;
  icon: React.ReactNode;
  description: string;
  details: string[];
  metrics: {
    tps: string;
    finality: string;
    energy: string;
    decentralization: string;
  };
  color: string;
}

const MECHANISMS: Record<ConsensusMechanism, MechanismData> = {
  pow: {
    name: "Proof of Work",
    shortName: "PoW",
    icon: <Cpu className="w-5 h-5" />,
    description:
      "Miners compete to solve cryptographic puzzles. The first to find a valid hash wins the right to add a block.",
    details: [
      "Computational competition determines block producer",
      "High energy consumption due to mining hardware",
      "51% attack requires majority hashpower",
      "Used by Bitcoin and original Ethereum",
    ],
    metrics: {
      tps: "5-10 TPS",
      finality: "~60 min",
      energy: "High",
      decentralization: "High",
    },
    color: "#4169E1",
  },
  pos: {
    name: "Proof of Stake",
    shortName: "PoS",
    icon: <Coins className="w-5 h-5" />,
    description:
      "Validators are selected based on the amount of cryptocurrency they stake as collateral.",
    details: [
      "Staked tokens determine selection probability",
      "99% less energy than Proof of Work",
      "Slashing penalties for malicious behavior",
      "Used by Ethereum 2.0, Cardano, Solana",
    ],
    metrics: {
      tps: "100-1000 TPS",
      finality: "~15 min",
      energy: "Low",
      decentralization: "Medium",
    },
    color: "#2E4CB3",
  },
  bft: {
    name: "Byzantine Fault Tolerance",
    shortName: "BFT",
    icon: <Vote className="w-5 h-5" />,
    description:
      "Nodes vote in multiple rounds to reach consensus, tolerating up to 1/3 malicious actors.",
    details: [
      "Multi-round voting protocol",
      "Requires 2/3+ agreement for consensus",
      "Deterministic finality (no forks)",
      "Used by Hyperledger, Tendermint, PBFT",
    ],
    metrics: {
      tps: "1000-10000 TPS",
      finality: "~3 sec",
      energy: "Very Low",
      decentralization: "Low",
    },
    color: "#6B8DEF",
  },
};

// Node generation helper
function generateNodes(mechanism: ConsensusMechanism, count: number): Node[] {
  const nodes: Node[] = [];
  const centerX = 200;
  const centerY = 150;
  const radius = 100;

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    nodes.push({
      id: i,
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      stake: mechanism === "pos" ? Math.random() * 80 + 20 : undefined,
      computing: mechanism === "pow" ? Math.random() * 100 : undefined,
      vote: null,
      isLeader: false,
      isWinner: false,
      color: MECHANISMS[mechanism].color,
    });
  }
  return nodes;
}

// PoW Animation Component
function PoWVisualization({
  nodes,
  animationPhase,
}: {
  nodes: Node[];
  animationPhase: number;
}) {
  const winnerIndex = animationPhase >= 3 ? 2 : -1;

  return (
    <svg viewBox="0 0 400 300" className="w-full h-full">
      {/* Background grid */}
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="#E2E1DE"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="400" height="300" fill="url(#grid)" />

      {/* Center block */}
      <g transform="translate(180, 130)">
        <rect
          x="0"
          y="0"
          width="40"
          height="40"
          fill={animationPhase >= 3 ? "#4169E1" : "#F5F4F1"}
          stroke="#1A1A2E"
          strokeWidth="2"
          className="transition-all duration-500"
        />
        <text
          x="20"
          y="25"
          textAnchor="middle"
          className="font-mono text-xs fill-charcoal"
        >
          {animationPhase >= 3 ? "BLOCK" : "???"}
        </text>
      </g>

      {/* Mining nodes */}
      {nodes.map((node, i) => {
        const isCompeting = animationPhase >= 1;
        const isWinner = i === winnerIndex && animationPhase >= 3;
        const hashProgress = isCompeting
          ? Math.min((animationPhase - 1) * 33 + (i === winnerIndex ? 34 : i * 5), 100)
          : 0;

        return (
          <g key={node.id}>
            {/* Connection line to center */}
            <line
              x1={node.x}
              y1={node.y}
              x2={200}
              y2={150}
              stroke={isWinner ? "#4169E1" : "#E2E1DE"}
              strokeWidth={isWinner ? 3 : 1}
              strokeDasharray={isWinner ? "none" : "4,4"}
              className="transition-all duration-300"
            />

            {/* Node */}
            <g transform={`translate(${node.x - 25}, ${node.y - 25})`}>
              <rect
                width="50"
                height="50"
                fill={isWinner ? "#4169E1" : "#FAF9F6"}
                stroke="#1A1A2E"
                strokeWidth="2"
                className="transition-all duration-300"
              />

              {/* Mining icon */}
              <g transform="translate(15, 8)">
                <rect
                  width="20"
                  height="14"
                  fill={isCompeting ? "#1A1A2E" : "#E2E1DE"}
                  className="transition-all duration-300"
                />
                {isCompeting && (
                  <rect
                    x="0"
                    y="0"
                    width={(hashProgress / 100) * 20}
                    height="14"
                    fill={isWinner ? "#6B8DEF" : "#4169E1"}
                    className="transition-all duration-200"
                  />
                )}
              </g>

              {/* Node label */}
              <text
                x="25"
                y="40"
                textAnchor="middle"
                className="font-mono text-[10px] fill-charcoal"
              >
                {isWinner ? "WINNER" : `M${i + 1}`}
              </text>
            </g>

            {/* Hash attempts visual */}
            {isCompeting && !isWinner && animationPhase < 3 && (
              <g>
                {[0, 1, 2].map((j) => (
                  <text
                    key={j}
                    x={node.x + 30 + j * 3}
                    y={node.y - 30 + j * 8}
                    className="font-mono text-[8px] fill-slate animate-pulse"
                    style={{ animationDelay: `${j * 100}ms` }}
                  >
                    {Math.random().toString(16).slice(2, 6)}
                  </text>
                ))}
              </g>
            )}
          </g>
        );
      })}

      {/* Status text */}
      <text
        x="200"
        y="280"
        textAnchor="middle"
        className="font-mono text-sm fill-charcoal font-semibold"
      >
        {animationPhase === 0 && "Waiting for transactions..."}
        {animationPhase === 1 && "Mining competition started"}
        {animationPhase === 2 && "Searching for valid hash..."}
        {animationPhase >= 3 && "Block validated and added to chain"}
      </text>
    </svg>
  );
}

// PoS Animation Component
function PoSVisualization({
  nodes,
  animationPhase,
}: {
  nodes: Node[];
  animationPhase: number;
}) {
  // Sort nodes by stake for selection
  const sortedNodes = [...nodes].sort((a, b) => (b.stake || 0) - (a.stake || 0));
  const selectedIndex = animationPhase >= 2 ? 0 : -1;
  const selectedNode = sortedNodes[selectedIndex];

  return (
    <svg viewBox="0 0 400 300" className="w-full h-full">
      {/* Background */}
      <rect width="400" height="300" fill="#FAF9F6" />

      {/* Staking pool visual */}
      <g transform="translate(200, 150)">
        <circle
          r="80"
          fill="none"
          stroke="#E2E1DE"
          strokeWidth="2"
          strokeDasharray="8,4"
        />
        <circle
          r="40"
          fill={animationPhase >= 2 ? "#2E4CB3" : "#F5F4F1"}
          stroke="#1A1A2E"
          strokeWidth="2"
          className="transition-all duration-500"
        />
        <text
          y="5"
          textAnchor="middle"
          className="font-mono text-xs fill-white font-semibold"
        >
          {animationPhase >= 2 ? "SELECTED" : "POOL"}
        </text>
      </g>

      {/* Validator nodes */}
      {nodes.map((node, i) => {
        const isSelected =
          selectedNode && node.id === selectedNode.id && animationPhase >= 2;
        const stakeHeight = ((node.stake || 50) / 100) * 40;
        const isValidating = animationPhase >= 1;

        return (
          <g key={node.id}>
            {/* Connection to pool */}
            <line
              x1={node.x}
              y1={node.y}
              x2={200}
              y2={150}
              stroke={isSelected ? "#2E4CB3" : "#E2E1DE"}
              strokeWidth={isSelected ? 3 : 1}
              className="transition-all duration-300"
            />

            {/* Stake indicator line from node */}
            {isValidating && (
              <line
                x1={node.x}
                y1={node.y}
                x2={200}
                y2={150}
                stroke="#2E4CB3"
                strokeWidth={((node.stake || 50) / 100) * 4}
                opacity={0.3}
                className="transition-all duration-500"
              />
            )}

            {/* Node container */}
            <g transform={`translate(${node.x - 25}, ${node.y - 30})`}>
              {/* Stake bar */}
              <rect
                x="0"
                y={40 - stakeHeight}
                width="50"
                height={stakeHeight}
                fill={isSelected ? "#2E4CB3" : "#6B8DEF"}
                stroke="#1A1A2E"
                strokeWidth="2"
                className="transition-all duration-300"
              />

              {/* Node circle */}
              <circle
                cx="25"
                cy="0"
                r="18"
                fill={isSelected ? "#2E4CB3" : "#FAF9F6"}
                stroke="#1A1A2E"
                strokeWidth="2"
                className="transition-all duration-300"
              />

              {/* Stake amount */}
              <text
                x="25"
                y="5"
                textAnchor="middle"
                className={cn(
                  "font-mono text-[10px] font-bold",
                  isSelected ? "fill-white" : "fill-charcoal"
                )}
              >
                {Math.round(node.stake || 0)}
              </text>

              {/* Label */}
              <text
                x="25"
                y="55"
                textAnchor="middle"
                className="font-mono text-[9px] fill-slate"
              >
                {isSelected ? "VALIDATOR" : `V${i + 1}`}
              </text>
            </g>
          </g>
        );
      })}

      {/* Selection indicator */}
      {animationPhase >= 1 && animationPhase < 2 && (
        <g className="animate-pulse">
          <circle
            cx="200"
            cy="150"
            r={60 + (animationPhase * 20)}
            fill="none"
            stroke="#2E4CB3"
            strokeWidth="2"
            opacity="0.5"
          />
        </g>
      )}

      {/* Status */}
      <text
        x="200"
        y="280"
        textAnchor="middle"
        className="font-mono text-sm fill-charcoal font-semibold"
      >
        {animationPhase === 0 && "Validators staking tokens..."}
        {animationPhase === 1 && "Selecting validator by stake weight..."}
        {animationPhase === 2 && "Validator selected, proposing block..."}
        {animationPhase >= 3 && "Block proposed and attested"}
      </text>
    </svg>
  );
}

// BFT Animation Component
function BFTVisualization({
  nodes,
  animationPhase,
}: {
  nodes: Node[];
  animationPhase: number;
}) {
  const leaderIndex = 0;
  const votingRound = Math.min(animationPhase, 3);

  return (
    <svg viewBox="0 0 400 300" className="w-full h-full">
      {/* Background */}
      <rect width="400" height="300" fill="#FAF9F6" />

      {/* Voting rounds indicator */}
      <g transform="translate(20, 20)">
        {["Propose", "Pre-vote", "Pre-commit", "Commit"].map((label, i) => (
          <g key={label} transform={`translate(${i * 90}, 0)`}>
            <rect
              width="80"
              height="24"
              fill={i <= votingRound ? "#6B8DEF" : "#E2E1DE"}
              stroke="#1A1A2E"
              strokeWidth="1"
              className="transition-all duration-300"
            />
            <text
              x="40"
              y="16"
              textAnchor="middle"
              className={cn(
                "font-mono text-[10px] font-semibold",
                i <= votingRound ? "fill-white" : "fill-slate"
              )}
            >
              {label}
            </text>
          </g>
        ))}
      </g>

      {/* Center proposal */}
      <g transform="translate(180, 130)">
        <rect
          width="40"
          height="40"
          fill={animationPhase >= 3 ? "#6B8DEF" : "#F5F4F1"}
          stroke="#1A1A2E"
          strokeWidth="2"
          className="transition-all duration-500"
        />
        <text
          x="20"
          y="25"
          textAnchor="middle"
          className="font-mono text-xs fill-charcoal font-semibold"
        >
          {animationPhase >= 3 ? "FINAL" : "PROP"}
        </text>
      </g>

      {/* Validator nodes */}
      {nodes.map((node, i) => {
        const isLeader = i === leaderIndex;
        const hasVoted = animationPhase >= 1 && i <= animationPhase + 2;
        const vote = i === nodes.length - 1 && animationPhase < 3 ? "disagree" : "agree";

        return (
          <g key={node.id}>
            {/* Connection to center */}
            <line
              x1={node.x}
              y1={node.y}
              x2={200}
              y2={150}
              stroke={hasVoted ? (vote === "agree" ? "#22C55E" : "#DC2626") : "#E2E1DE"}
              strokeWidth={isLeader ? 3 : hasVoted ? 2 : 1}
              className="transition-all duration-300"
            />

            {/* Vote message animation */}
            {hasVoted && animationPhase >= 1 && (
              <circle
                cx={node.x + (200 - node.x) * 0.5}
                cy={node.y + (150 - node.y) * 0.5}
                r="6"
                fill={vote === "agree" ? "#22C55E" : "#DC2626"}
                className="animate-pulse"
              />
            )}

            {/* Node */}
            <g transform={`translate(${node.x - 22}, ${node.y - 22})`}>
              <rect
                width="44"
                height="44"
                fill={isLeader ? "#6B8DEF" : "#FAF9F6"}
                stroke="#1A1A2E"
                strokeWidth="2"
                className="transition-all duration-300"
              />

              {/* Vote indicator */}
              {hasVoted && (
                <g transform="translate(12, 8)">
                  <rect
                    width="20"
                    height="16"
                    fill={vote === "agree" ? "#22C55E" : "#DC2626"}
                  />
                  <text
                    x="10"
                    y="12"
                    textAnchor="middle"
                    className="font-mono text-[8px] fill-white font-bold"
                  >
                    {vote === "agree" ? "YES" : "NO"}
                  </text>
                </g>
              )}

              {/* Node label */}
              <text
                x="22"
                y="38"
                textAnchor="middle"
                className={cn(
                  "font-mono text-[9px] font-semibold",
                  isLeader ? "fill-white" : "fill-charcoal"
                )}
              >
                {isLeader ? "LEADER" : `N${i + 1}`}
              </text>
            </g>
          </g>
        );
      })}

      {/* Consensus progress */}
      <g transform="translate(50, 260)">
        <text className="font-mono text-[10px] fill-slate">
          Consensus: {Math.min(nodes.length - 1, animationPhase >= 1 ? animationPhase + 2 : 0)}/{nodes.length} votes ({Math.round((Math.min(nodes.length - 1, animationPhase >= 1 ? animationPhase + 2 : 0) / nodes.length) * 100)}%)
        </text>
        <rect
          x="0"
          y="8"
          width="300"
          height="8"
          fill="#E2E1DE"
          stroke="#1A1A2E"
          strokeWidth="1"
        />
        <rect
          x="0"
          y="8"
          width={Math.min(300, (Math.min(nodes.length - 1, animationPhase >= 1 ? animationPhase + 2 : 0) / nodes.length) * 300)}
          height="8"
          fill="#6B8DEF"
          className="transition-all duration-300"
        />
        {/* 2/3 threshold marker */}
        <line
          x1="200"
          y1="6"
          x2="200"
          y2="18"
          stroke="#1A1A2E"
          strokeWidth="2"
        />
        <text x="200" y="4" textAnchor="middle" className="font-mono text-[8px] fill-charcoal">
          2/3
        </text>
      </g>
    </svg>
  );
}

// Metrics Panel Component
function MetricsPanel({
  mechanism,
  isCompact,
}: {
  mechanism: ConsensusMechanism;
  isCompact?: boolean;
}) {
  const data = MECHANISMS[mechanism];

  const MetricRow = ({
    icon,
    label,
    value,
    highlight,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    highlight?: boolean;
  }) => (
    <div
      className={cn(
        "flex items-center justify-between p-3 border-b border-border last:border-b-0",
        highlight && "bg-primary/5"
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">{icon}</span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="font-mono text-sm font-semibold text-charcoal">
        {value}
      </span>
    </div>
  );

  if (isCompact) {
    return (
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-card p-3 border-2 border-charcoal">
          <div className="text-xs text-muted-foreground mb-1">TPS</div>
          <div className="font-mono font-bold text-charcoal">{data.metrics.tps}</div>
        </div>
        <div className="bg-card p-3 border-2 border-charcoal">
          <div className="text-xs text-muted-foreground mb-1">Finality</div>
          <div className="font-mono font-bold text-charcoal">{data.metrics.finality}</div>
        </div>
        <div className="bg-card p-3 border-2 border-charcoal">
          <div className="text-xs text-muted-foreground mb-1">Energy</div>
          <div className="font-mono font-bold text-charcoal">{data.metrics.energy}</div>
        </div>
        <div className="bg-card p-3 border-2 border-charcoal">
          <div className="text-xs text-muted-foreground mb-1">Decentralization</div>
          <div className="font-mono font-bold text-charcoal">{data.metrics.decentralization}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border-2 border-charcoal shadow-[3px_3px_0_#1A1A2E]">
      <div
        className="px-4 py-3 border-b-2 border-charcoal"
        style={{ backgroundColor: data.color }}
      >
        <h5 className="font-semibold text-white text-sm">Performance Metrics</h5>
      </div>
      <div>
        <MetricRow
          icon={<Zap className="w-4 h-4" />}
          label="Throughput"
          value={data.metrics.tps}
        />
        <MetricRow
          icon={<Clock className="w-4 h-4" />}
          label="Finality"
          value={data.metrics.finality}
        />
        <MetricRow
          icon={<Leaf className="w-4 h-4" />}
          label="Energy Use"
          value={data.metrics.energy}
        />
        <MetricRow
          icon={<Network className="w-4 h-4" />}
          label="Decentralization"
          value={data.metrics.decentralization}
        />
      </div>
    </div>
  );
}

// Main Widget Component
export function ConsensusMechanismsWidget({ className }: { className?: string }) {
  const [activeMechanism, setActiveMechanism] = useState<ConsensusMechanism>("pow");
  const [animationPhase, setAnimationPhase] = useState(0);
  const [nodes, setNodes] = useState<Node[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Initialize nodes
  useEffect(() => {
    setNodes(generateNodes(activeMechanism, 6));
    setAnimationPhase(0);
  }, [activeMechanism]);

  // Animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev >= 3 ? 0 : prev + 1));
    }, 2000);
    return () => clearInterval(interval);
  }, [activeMechanism]);

  // Scroll observation for section activation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
            const index = sectionRefs.current.indexOf(entry.target as HTMLDivElement);
            const mechanisms: ConsensusMechanism[] = ["pow", "pos", "bft"];
            if (index !== -1) {
              setActiveMechanism(mechanisms[index]);
            }
          }
        });
      },
      { threshold: 0.4 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const setRef = useCallback((index: number) => (el: HTMLDivElement | null) => {
    sectionRefs.current[index] = el;
  }, []);

  const renderVisualization = () => {
    switch (activeMechanism) {
      case "pow":
        return <PoWVisualization nodes={nodes} animationPhase={animationPhase} />;
      case "pos":
        return <PoSVisualization nodes={nodes} animationPhase={animationPhase} />;
      case "bft":
        return <BFTVisualization nodes={nodes} animationPhase={animationPhase} />;
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn("brutalist-card overflow-hidden", className)}
      id="consensus-comparison-widget"
    >
      {/* Header */}
      <div className="bg-primary px-6 py-4 border-b-2 border-charcoal">
        <h4 className="text-white font-semibold">Consensus Mechanisms Comparison</h4>
        <p className="text-white/80 text-sm mt-1">
          Interactive visualization of blockchain consensus protocols
        </p>
      </div>

      {/* Mechanism tabs */}
      <div className="flex border-b-2 border-charcoal">
        {(Object.keys(MECHANISMS) as ConsensusMechanism[]).map((key) => {
          const mech = MECHANISMS[key];
          const isActive = activeMechanism === key;
          return (
            <button
              key={key}
              onClick={() => setActiveMechanism(key)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-3 transition-all cursor-pointer",
                "border-r-2 border-charcoal last:border-r-0",
                isActive
                  ? "bg-charcoal text-white"
                  : "bg-card text-charcoal hover:bg-warm-gray"
              )}
            >
              {mech.icon}
              <span className="font-semibold text-sm">{mech.shortName}</span>
            </button>
          );
        })}
      </div>

      {/* Main content area */}
      <div className="grid lg:grid-cols-3 gap-0">
        {/* Text descriptions - scrollable */}
        <div className="lg:col-span-1 border-r-2 border-charcoal bg-warm-gray max-h-[500px] overflow-y-auto">
          {(Object.keys(MECHANISMS) as ConsensusMechanism[]).map((key, index) => {
            const mech = MECHANISMS[key];
            const isActive = activeMechanism === key;
            return (
              <div
                key={key}
                ref={setRef(index)}
                className={cn(
                  "p-5 border-b-2 border-border last:border-b-0 transition-all duration-300",
                  isActive ? "bg-card" : "bg-transparent"
                )}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={cn(
                      "w-10 h-10 flex items-center justify-center border-2",
                      isActive
                        ? "bg-charcoal text-white border-charcoal"
                        : "bg-card text-charcoal border-charcoal"
                    )}
                  >
                    {mech.icon}
                  </div>
                  <div>
                    <h5 className="font-semibold text-charcoal">{mech.name}</h5>
                    <span className="font-mono text-xs text-slate">{mech.shortName}</span>
                  </div>
                  {isActive && (
                    <ChevronRight className="w-5 h-5 text-primary ml-auto" />
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  {mech.description}
                </p>

                {isActive && (
                  <ul className="space-y-2">
                    {mech.details.map((detail, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-charcoal"
                      >
                        <span className="w-1.5 h-1.5 bg-primary mt-2 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {/* Visualization area */}
        <div className="lg:col-span-2 flex flex-col">
          {/* Main visualization */}
          <div className="flex-1 p-4 min-h-[300px] bg-card">
            {renderVisualization()}
          </div>

          {/* Metrics panel */}
          <div className="p-4 border-t-2 border-charcoal bg-warm-gray">
            <MetricsPanel mechanism={activeMechanism} isCompact />
          </div>
        </div>
      </div>

      {/* Full metrics comparison */}
      <div className="border-t-2 border-charcoal">
        <div className="grid md:grid-cols-3 gap-0">
          {(Object.keys(MECHANISMS) as ConsensusMechanism[]).map((key) => {
            const mech = MECHANISMS[key];
            const isActive = activeMechanism === key;
            return (
              <div
                key={key}
                className={cn(
                  "p-4 border-r-2 border-charcoal last:border-r-0 transition-all",
                  isActive ? "bg-primary/5" : "bg-card"
                )}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-3 h-3"
                    style={{ backgroundColor: mech.color }}
                  />
                  <span className="font-mono text-sm font-semibold text-charcoal">
                    {mech.shortName}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">TPS</span>
                    <span className="font-mono font-semibold text-charcoal">
                      {mech.metrics.tps}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Finality</span>
                    <span className="font-mono font-semibold text-charcoal">
                      {mech.metrics.finality}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Energy</span>
                    <span className="font-mono font-semibold text-charcoal">
                      {mech.metrics.energy}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Decentralization</span>
                    <span className="font-mono font-semibold text-charcoal">
                      {mech.metrics.decentralization}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
