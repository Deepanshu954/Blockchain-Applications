"use client";

import React from "react"

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { X, ChevronRight, Zap, Shield, Brain, Scale, Globe } from "lucide-react";

// Node data structure
interface ResearchNode {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  subtopics: {
    id: string;
    label: string;
    description: string;
  }[];
  connections: string[]; // IDs of connected nodes
}

const researchNodes: ResearchNode[] = [
  {
    id: "web3",
    label: "Web3 Infrastructure",
    description: "Cross-chain interoperability and liquidity solutions across L2 ecosystems",
    icon: <Globe className="w-5 h-5" />,
    color: "#4169E1",
    subtopics: [
      { id: "web3-1", label: "Cross-chain Bridges", description: "Trust-minimized protocols for asset transfer" },
      { id: "web3-2", label: "Liquidity Unification", description: "Solving L2 fragmentation without centralization" },
      { id: "web3-3", label: "Decentralized Storage", description: "IPFS and compute integration" },
    ],
    connections: ["ai", "regulatory"],
  },
  {
    id: "quantum",
    label: "Post-Quantum Cryptography",
    description: "Migration strategies to quantum-resistant algorithms",
    icon: <Shield className="w-5 h-5" />,
    color: "#2E4CB3",
    subtopics: [
      { id: "quantum-1", label: "Lattice-based Signatures", description: "CRYSTALS-Dilithium and FALCON" },
      { id: "quantum-2", label: "Hash-based Signatures", description: "SPHINCS+ stateless signatures" },
      { id: "quantum-3", label: "Migration Pathways", description: "Graceful upgrade without disruption" },
    ],
    connections: ["ai", "web3"],
  },
  {
    id: "ai",
    label: "Blockchain-AI Integration",
    description: "Verifiable and decentralized AI execution on-chain",
    icon: <Brain className="w-5 h-5" />,
    color: "#6B8DEF",
    subtopics: [
      { id: "ai-1", label: "ZKML", description: "Zero-Knowledge Machine Learning proofs" },
      { id: "ai-2", label: "On-chain Inference", description: "Verifiable model execution" },
      { id: "ai-3", label: "AI Security Auditing", description: "Automated smart contract analysis" },
      { id: "ai-4", label: "Consensus Optimization", description: "AI-enhanced protocol efficiency" },
    ],
    connections: ["quantum", "regulatory"],
  },
  {
    id: "regulatory",
    label: "Regulatory Evolution",
    description: "Reconciling immutability with compliance requirements",
    icon: <Scale className="w-5 h-5" />,
    color: "#1A1A2E",
    subtopics: [
      { id: "reg-1", label: "GDPR Compliance", description: "Right to erasure vs immutability" },
      { id: "reg-2", label: "AML/KYC Solutions", description: "Privacy-preserving identity verification" },
      { id: "reg-3", label: "On-chain Compliance", description: "Programmable regulatory enforcement" },
      { id: "reg-4", label: "DAO Governance", description: "Legal frameworks for decentralization" },
    ],
    connections: ["web3", "ai"],
  },
];

// Node positions (normalized 0-1, will be scaled to container)
const nodePositions: Record<string, { x: number; y: number }> = {
  center: { x: 0.5, y: 0.5 },
  web3: { x: 0.2, y: 0.25 },
  quantum: { x: 0.8, y: 0.25 },
  ai: { x: 0.8, y: 0.75 },
  regulatory: { x: 0.2, y: 0.75 },
};

interface FutureResearchWidgetProps {
  className?: string;
}

export function FutureResearchWidget({ className }: FutureResearchWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 });
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [expandedNode, setExpandedNode] = useState<string | null>(null);
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null);
  const [animationPhase, setAnimationPhase] = useState(0);

  // Resize observer
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: Math.max(500, rect.height) });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Animate background particles
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Calculate actual positions
  const getPosition = useCallback(
    (id: string) => {
      const pos = nodePositions[id];
      return {
        x: pos.x * dimensions.width,
        y: pos.y * dimensions.height,
      };
    },
    [dimensions]
  );

  // Generate connection paths
  const generateConnectionPath = useCallback(
    (from: string, to: string) => {
      const fromPos = getPosition(from);
      const toPos = getPosition(to);

      // Create curved path
      const midX = (fromPos.x + toPos.x) / 2;
      const midY = (fromPos.y + toPos.y) / 2;
      const controlOffset = 30;

      // Add slight curve
      const dx = toPos.x - fromPos.x;
      const dy = toPos.y - fromPos.y;
      const perpX = -dy / Math.sqrt(dx * dx + dy * dy) * controlOffset;
      const perpY = dx / Math.sqrt(dx * dx + dy * dy) * controlOffset;

      return `M ${fromPos.x} ${fromPos.y} Q ${midX + perpX} ${midY + perpY} ${toPos.x} ${toPos.y}`;
    },
    [getPosition]
  );

  // Get all unique connections
  const connections = researchNodes.flatMap((node) =>
    node.connections.map((target) => ({
      from: node.id,
      to: target,
      id: [node.id, target].sort().join("-"),
    }))
  ).filter((conn, index, self) => 
    self.findIndex((c) => c.id === conn.id) === index
  );

  const handleNodeClick = (nodeId: string) => {
    if (expandedNode === nodeId) {
      setExpandedNode(null);
    } else {
      setExpandedNode(nodeId);
    }
    setActiveNode(nodeId);
  };

  const selectedNodeData = expandedNode
    ? researchNodes.find((n) => n.id === expandedNode)
    : null;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full min-h-[500px] brutalist-card overflow-hidden",
        className
      )}
      style={{ height: "auto", minHeight: "500px" }}
    >
      {/* Animated geometric background */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ minHeight: "500px" }}
      >
        <defs>
          <pattern
            id="grid-pattern"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="var(--royal-blue)"
              strokeWidth="0.5"
              opacity="0.1"
            />
          </pattern>
          <linearGradient id="connection-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--royal-blue)" stopOpacity="0.6" />
            <stop offset="50%" stopColor="var(--royal-blue-light)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--royal-blue)" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        
        {/* Animated floating geometric shapes */}
        {[...Array(6)].map((_, i) => {
          const baseX = ((i * 150) % dimensions.width) + 50;
          const baseY = ((i * 80) % dimensions.height) + 30;
          const offsetX = Math.sin((animationPhase + i * 60) * (Math.PI / 180)) * 10;
          const offsetY = Math.cos((animationPhase + i * 60) * (Math.PI / 180)) * 10;
          const rotation = animationPhase + i * 30;
          
          return (
            <g key={i} transform={`translate(${baseX + offsetX}, ${baseY + offsetY})`}>
              {i % 3 === 0 && (
                <rect
                  width="20"
                  height="20"
                  fill="none"
                  stroke="var(--royal-blue)"
                  strokeWidth="1"
                  opacity="0.15"
                  transform={`rotate(${rotation})`}
                />
              )}
              {i % 3 === 1 && (
                <polygon
                  points="0,-12 10,6 -10,6"
                  fill="none"
                  stroke="var(--royal-blue)"
                  strokeWidth="1"
                  opacity="0.15"
                  transform={`rotate(${rotation})`}
                />
              )}
              {i % 3 === 2 && (
                <circle
                  r="10"
                  fill="none"
                  stroke="var(--royal-blue)"
                  strokeWidth="1"
                  opacity="0.15"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Connection lines SVG */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ minHeight: "500px" }}
      >
        {/* Connections between nodes */}
        {connections.map((conn) => {
          const isActive =
            activeNode === conn.from ||
            activeNode === conn.to ||
            hoveredConnection === conn.id;

          return (
            <g key={conn.id}>
              <path
                d={generateConnectionPath(conn.from, conn.to)}
                fill="none"
                stroke={isActive ? "var(--royal-blue)" : "var(--royal-blue)"}
                strokeWidth={isActive ? "3" : "1.5"}
                strokeDasharray={isActive ? "none" : "6,4"}
                opacity={isActive ? 0.8 : 0.3}
                className="transition-all duration-300"
              />
              {/* Animated pulse along connection */}
              {isActive && (
                <circle r="4" fill="var(--royal-blue-light)">
                  <animateMotion
                    dur="2s"
                    repeatCount="indefinite"
                    path={generateConnectionPath(conn.from, conn.to)}
                  />
                </circle>
              )}
            </g>
          );
        })}

        {/* Connection lines to center */}
        {researchNodes.map((node) => {
          const pos = getPosition(node.id);
          const centerPos = getPosition("center");
          const isActive = activeNode === node.id;

          return (
            <line
              key={`center-${node.id}`}
              x1={centerPos.x}
              y1={centerPos.y}
              x2={pos.x}
              y2={pos.y}
              stroke={node.color}
              strokeWidth={isActive ? "2" : "1"}
              strokeDasharray="4,4"
              opacity={isActive ? 0.6 : 0.2}
              className="transition-all duration-300"
            />
          );
        })}
      </svg>

      {/* Center node */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
        style={{
          left: getPosition("center").x,
          top: getPosition("center").y,
        }}
      >
        <div className="relative">
          {/* Pulsing ring */}
          <div
            className="absolute inset-0 rounded-full bg-primary/20 animate-ping"
            style={{ animationDuration: "3s" }}
          />
          <div className="relative w-32 h-32 rounded-full bg-primary flex flex-col items-center justify-center text-white shadow-lg brutalist-shadow cursor-default">
            <Zap className="w-8 h-8 mb-1" />
            <span className="text-xs font-bold text-center leading-tight px-2">
              Future of
              <br />
              Blockchain
            </span>
          </div>
        </div>
      </div>

      {/* Research direction nodes */}
      {researchNodes.map((node) => {
        const pos = getPosition(node.id);
        const isActive = activeNode === node.id;
        const isExpanded = expandedNode === node.id;

        return (
          <div
            key={node.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
            style={{
              left: pos.x,
              top: pos.y,
            }}
          >
            <button
              onClick={() => handleNodeClick(node.id)}
              onMouseEnter={() => setActiveNode(node.id)}
              onMouseLeave={() => !expandedNode && setActiveNode(null)}
              className={cn(
                "relative group transition-all duration-300 cursor-pointer",
                isActive && "scale-110"
              )}
            >
              {/* Node circle */}
              <div
                className={cn(
                  "w-20 h-20 md:w-24 md:h-24 rounded-full flex flex-col items-center justify-center text-white transition-all duration-300",
                  isExpanded && "ring-4 ring-white ring-offset-2"
                )}
                style={{
                  backgroundColor: node.color,
                  boxShadow: isActive
                    ? `0 0 20px ${node.color}80, 4px 4px 0 var(--charcoal)`
                    : "4px 4px 0 var(--charcoal)",
                }}
              >
                {node.icon}
                <span className="text-[10px] md:text-xs font-semibold text-center leading-tight mt-1 px-1">
                  {node.label.split(" ").slice(0, 2).join(" ")}
                </span>
              </div>

              {/* Hover tooltip */}
              <div
                className={cn(
                  "absolute left-1/2 -translate-x-1/2 -bottom-2 translate-y-full w-48 p-3 bg-card text-charcoal border-2 border-charcoal text-xs opacity-0 pointer-events-none transition-opacity duration-200 z-30",
                  isActive && !isExpanded && "opacity-100"
                )}
              >
                <p className="font-semibold mb-1">{node.label}</p>
                <p className="text-muted-foreground">{node.description}</p>
                <div className="flex items-center gap-1 mt-2 text-primary text-[10px]">
                  <span>Click to explore</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </button>
          </div>
        );
      })}

      {/* Expanded node panel */}
      {selectedNodeData && (
        <div className="absolute inset-x-4 bottom-4 md:inset-x-8 md:bottom-8 z-30">
          <div className="bg-card border-2 border-charcoal shadow-lg p-4 md:p-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: selectedNodeData.color }}
                >
                  {selectedNodeData.icon}
                </div>
                <div>
                  <h5 className="font-bold text-charcoal">
                    {selectedNodeData.label}
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    {selectedNodeData.description}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setExpandedNode(null);
                  setActiveNode(null);
                }}
                className="p-1 hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {selectedNodeData.subtopics.map((subtopic) => (
                <div
                  key={subtopic.id}
                  className="p-3 bg-warm-gray border border-border hover:border-primary transition-colors group cursor-default"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: selectedNodeData.color }}
                    />
                    <span className="text-sm font-semibold text-charcoal group-hover:text-primary transition-colors">
                      {subtopic.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {subtopic.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Connections info */}
            <div className="mt-4 pt-4 border-t border-border">
              <span className="text-xs text-muted-foreground">
                Connected to:{" "}
              </span>
              {selectedNodeData.connections.map((connId, idx) => {
                const connNode = researchNodes.find((n) => n.id === connId);
                return (
                  <button
                    key={connId}
                    onClick={() => handleNodeClick(connId)}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer"
                    onMouseEnter={() =>
                      setHoveredConnection(
                        [selectedNodeData.id, connId].sort().join("-")
                      )
                    }
                    onMouseLeave={() => setHoveredConnection(null)}
                  >
                    {connNode?.label}
                    {idx < selectedNodeData.connections.length - 1 && (
                      <span className="text-muted-foreground mx-1">|</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm border border-border p-3 text-xs">
        <p className="font-semibold text-charcoal mb-2">Research Areas</p>
        <div className="space-y-1">
          {researchNodes.map((node) => (
            <div key={node.id} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: node.color }}
              />
              <span className="text-muted-foreground">{node.label}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-muted-foreground">
          Click nodes to explore subtopics
        </p>
      </div>
    </div>
  );
}
