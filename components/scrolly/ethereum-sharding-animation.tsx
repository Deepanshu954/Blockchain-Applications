"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Play, Pause, RotateCcw, Info } from "lucide-react";

interface Transaction {
  id: string;
  shardId: number;
  progress: number;
  color: string;
  isCrossShard?: boolean;
  targetShard?: number;
}

interface ShardData {
  id: number;
  transactions: number;
  tps: number;
  status: "active" | "syncing" | "idle";
}

const SHARD_COUNT = 8; // Simplified representation of 64 shards
const TRANSACTION_COLORS = [
  "#4169E1", // Royal blue
  "#2E4CB3", // Dark royal blue
  "#6B8DEF", // Light royal blue
  "#1A1A2E", // Charcoal
];

export function EthereumShardingAnimation() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [shards, setShards] = useState<ShardData[]>([]);

  const [selectedShard, setSelectedShard] = useState<number | null>(null);
  const [beaconPulse, setBeaconPulse] = useState(false);
  const [samplingActive, setSamplingActive] = useState(false);
  const [samplingNodes, setSamplingNodes] = useState<number[]>([]);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Initialize shards
  useEffect(() => {
    const initialShards: ShardData[] = Array.from(
      { length: SHARD_COUNT },
      (_, i) => ({
        id: i,
        transactions: 0,
        tps: Math.floor(Math.random() * 3000) + 2000,
        status: "active" as const,
      })
    );
    setShards(initialShards);
  }, []);

  // Generate new transaction
  const generateTransaction = useCallback(() => {
    const isCrossShard = Math.random() > 0.7;
    const shardId = Math.floor(Math.random() * SHARD_COUNT);
    const targetShard = isCrossShard
      ? (shardId + Math.floor(Math.random() * (SHARD_COUNT - 1)) + 1) %
        SHARD_COUNT
      : undefined;

    return {
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      shardId,
      progress: 0,
      color:
        TRANSACTION_COLORS[Math.floor(Math.random() * TRANSACTION_COLORS.length)],
      isCrossShard,
      targetShard,
    };
  }, []);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;

    const animate = (timestamp: number) => {
      if (timestamp - lastTimeRef.current > 50) {
        lastTimeRef.current = timestamp;

        // Add new transactions periodically
        if (Math.random() > 0.6) {
          setTransactions((prev) => {
            if (prev.length < 24) {
              return [...prev, generateTransaction()];
            }
            return prev;
          });
        }

        // Update transaction progress
        setTransactions((prev) =>
          prev
            .map((tx) => ({
              ...tx,
              progress: tx.progress + (tx.isCrossShard ? 1.5 : 2.5),
            }))
            .filter((tx) => tx.progress < 100)
        );

        // Update shard data
        setShards((prev) =>
          prev.map((shard) => ({
            ...shard,
            tps: Math.floor(shard.tps + (Math.random() - 0.5) * 200),
            transactions: shard.transactions + (Math.random() > 0.5 ? 1 : 0),
          }))
        );

        // Beacon chain pulse
        if (Math.random() > 0.95) {
          setBeaconPulse(true);
          setTimeout(() => setBeaconPulse(false), 300);
        }

        // Data availability sampling simulation
        if (Math.random() > 0.97) {
          setSamplingActive(true);
          const nodes = Array.from({ length: 5 }, () =>
            Math.floor(Math.random() * SHARD_COUNT)
          );
          setSamplingNodes(nodes);
          setTimeout(() => {
            setSamplingActive(false);
            setSamplingNodes([]);
          }, 800);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, generateTransaction]);

  // Calculate total TPS during render instead of in effect
  const totalTps = shards.reduce((sum, shard) => sum + shard.tps, 0);
  const totalTpsValue = totalTps; // Declare the variable before using it

  const reset = () => {
    setTransactions([]);
    setShards((prev) =>
      prev.map((shard) => ({
        ...shard,
        transactions: 0,
        tps: Math.floor(Math.random() * 3000) + 2000,
      }))
    );
    setSelectedShard(null);
  };

  // Calculate positions for shards in a circle
  const getShardPosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const radius = 38; // percentage
    return {
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle),
    };
  };

  return (
    <TooltipProvider>
      <div className="brutalist-card overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b-2 border-charcoal bg-warm-gray flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h5 className="font-semibold text-charcoal">
              Ethereum Danksharding Architecture
            </h5>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                  <Info className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-charcoal text-white border-charcoal">
                <p className="text-sm">
                  Danksharding partitions Ethereum into 64 shards, each
                  processing transactions in parallel. The Beacon Chain
                  coordinates all shards and enables cross-shard communication.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 bg-primary text-white hover:bg-primary/90 transition-colors cursor-pointer"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={reset}
              className="p-2 bg-charcoal text-white hover:bg-charcoal/90 transition-colors cursor-pointer"
              aria-label="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main visualization */}
        <div className="relative h-[420px] bg-cream">
          {/* Background grid pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(var(--charcoal) 1px, transparent 1px),
                linear-gradient(90deg, var(--charcoal) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          />

          {/* SVG Layer for connections */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            {/* Connection lines from beacon to shards */}
            {shards.map((_, index) => {
              const pos = getShardPosition(index, SHARD_COUNT);
              return (
                <line
                  key={`line-${index}`}
                  x1="50"
                  y1="50"
                  x2={pos.x}
                  y2={pos.y}
                  stroke={
                    samplingActive && samplingNodes.includes(index)
                      ? "#4169E1"
                      : "#E2E1DE"
                  }
                  strokeWidth={
                    samplingActive && samplingNodes.includes(index) ? 0.4 : 0.2
                  }
                  strokeDasharray={
                    samplingActive && samplingNodes.includes(index)
                      ? "none"
                      : "1,1"
                  }
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Cross-shard transaction lines */}
            {transactions
              .filter((tx) => tx.isCrossShard && tx.targetShard !== undefined)
              .map((tx) => {
                const startPos = getShardPosition(tx.shardId, SHARD_COUNT);
                const endPos = getShardPosition(tx.targetShard!, SHARD_COUNT);
                const progress = tx.progress / 100;

                const currentX = startPos.x + (endPos.x - startPos.x) * progress;
                const currentY = startPos.y + (endPos.y - startPos.y) * progress;

                return (
                  <g key={tx.id}>
                    <line
                      x1={startPos.x}
                      y1={startPos.y}
                      x2={endPos.x}
                      y2={endPos.y}
                      stroke="#4169E1"
                      strokeWidth="0.15"
                      strokeOpacity="0.3"
                    />
                    <circle
                      cx={currentX}
                      cy={currentY}
                      r="1"
                      fill={tx.color}
                      className="drop-shadow-sm"
                    >
                      <animate
                        attributeName="opacity"
                        values="1;0.6;1"
                        dur="0.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                );
              })}
          </svg>

          {/* Beacon Chain (Center) */}
          <div
            className={cn(
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
              "w-20 h-20 md:w-24 md:h-24 rounded-full",
              "bg-primary border-4 border-charcoal",
              "flex flex-col items-center justify-center",
              "shadow-[4px_4px_0_#1A1A2E]",
              "transition-all duration-300",
              beaconPulse && "scale-110 shadow-[6px_6px_0_#1A1A2E]"
            )}
          >
            <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-wide">
              Beacon
            </span>
            <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-wide">
              Chain
            </span>
            {beaconPulse && (
              <div className="absolute inset-0 rounded-full border-2 border-white animate-ping" />
            )}
          </div>

          {/* Shard nodes */}
          {shards.map((shard, index) => {
            const pos = getShardPosition(index, SHARD_COUNT);
            const isSelected = selectedShard === shard.id;
            const isSampling = samplingActive && samplingNodes.includes(index);

            // Count transactions for this shard
            const shardTxCount = transactions.filter(
              (tx) => tx.shardId === shard.id && !tx.isCrossShard
            ).length;

            return (
              <Tooltip key={shard.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() =>
                      setSelectedShard(isSelected ? null : shard.id)
                    }
                    className={cn(
                      "absolute w-12 h-12 md:w-14 md:h-14 -translate-x-1/2 -translate-y-1/2",
                      "bg-card border-2 border-charcoal cursor-pointer",
                      "flex flex-col items-center justify-center",
                      "transition-all duration-200",
                      "hover:bg-warm-gray",
                      isSelected && "bg-primary/10 border-primary",
                      isSampling && "ring-2 ring-primary ring-offset-2"
                    )}
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      boxShadow: isSelected
                        ? "3px 3px 0 #4169E1"
                        : "2px 2px 0 #1A1A2E",
                    }}
                  >
                    <span className="text-[10px] font-mono font-semibold text-muted-foreground">
                      S{shard.id}
                    </span>
                    <span className="text-xs font-bold text-charcoal">
                      {Math.floor(shard.tps / 100) / 10}k
                    </span>

                    {/* Transaction indicators */}
                    {shardTxCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[8px] font-bold flex items-center justify-center">
                        {shardTxCount}
                      </div>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-charcoal text-white border-charcoal">
                  <div className="text-sm">
                    <p className="font-semibold">Shard {shard.id}</p>
                    <p>
                      TPS: ~{shard.tps.toLocaleString()}
                    </p>
                    <p>Status: {shard.status}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}

          {/* Transaction particles (non-cross-shard) */}
          {transactions
            .filter((tx) => !tx.isCrossShard)
            .map((tx) => {
              const shardPos = getShardPosition(tx.shardId, SHARD_COUNT);
              const angle = (tx.progress / 100) * Math.PI * 2;
              const orbitRadius = 4;
              const x = shardPos.x + Math.cos(angle) * orbitRadius;
              const y = shardPos.y + Math.sin(angle) * orbitRadius;

              return (
                <div
                  key={tx.id}
                  className="absolute w-2 h-2 rounded-full transition-opacity"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    backgroundColor: tx.color,
                    transform: "translate(-50%, -50%)",
                    opacity: 1 - tx.progress / 100,
                  }}
                />
              );
            })}

          {/* Data Availability Sampling indicator */}
          {samplingActive && (
            <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-primary text-white text-xs font-mono animate-pulse">
              DAS Active - Sampling {samplingNodes.length} nodes
            </div>
          )}
        </div>

        {/* Stats bar */}
        <div className="p-4 border-t-2 border-charcoal bg-card">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Total TPS
              </p>
                <p className="text-xl font-bold text-primary">
                  {totalTps > 100000 ? "100k+" : `~${Math.floor(totalTps / 1000)}k`}
                </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Active Shards
              </p>
              <p className="text-xl font-bold text-charcoal">
                {SHARD_COUNT}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  / 64
                </span>
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Pending TXs
              </p>
              <p className="text-xl font-bold text-charcoal">
                {transactions.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Cross-Shard
              </p>
              <p className="text-xl font-bold text-charcoal">
                {transactions.filter((tx) => tx.isCrossShard).length}
              </p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="p-4 border-t-2 border-charcoal bg-warm-gray">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">Beacon Chain</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-card border border-charcoal" />
              <span className="text-muted-foreground">Shard Chain</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary/60" />
              <span className="text-muted-foreground">Transaction</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0.5 bg-primary" />
              <span className="text-muted-foreground">Cross-Shard TX</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 ring-2 ring-primary ring-offset-1 bg-transparent" />
              <span className="text-muted-foreground">DAS Sample</span>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
