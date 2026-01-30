"use client";

import React from "react"

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Info, ArrowRight, Clock, Shield, Zap, CheckCircle2, AlertTriangle, Lock, Layers, RefreshCw } from "lucide-react";

// ===== TOOLTIP COMPONENT =====
interface TooltipProps {
  term: string;
  definition: string;
  children: React.ReactNode;
}

function Tooltip({ term, definition, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="underline decoration-dotted decoration-primary underline-offset-2 cursor-pointer hover:text-primary transition-colors font-medium"
      >
        {children}
      </button>
      {isVisible && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-charcoal text-white text-xs shadow-lg border-2 border-charcoal">
          <div className="flex items-start gap-2">
            <Info className="w-3 h-3 mt-0.5 flex-shrink-0 text-primary" />
            <div>
              <strong className="block mb-1 text-white text-xs">{term}</strong>
              <span className="text-white/80">{definition}</span>
            </div>
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-6 border-transparent border-t-charcoal" />
        </div>
      )}
    </span>
  );
}

// ===== TAB NAVIGATION =====
type TabType = "state-channels" | "optimistic-rollups" | "zk-rollups";

interface TabButtonProps {
  id: TabType;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

function TabButton({ label, icon, isActive, onClick }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all cursor-pointer border-2",
        isActive
          ? "bg-primary text-white border-primary"
          : "bg-card text-charcoal border-charcoal/20 hover:border-primary hover:bg-primary/5"
      )}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

// ===== ANIMATED TRANSACTION BOX =====
interface TransactionBoxProps {
  index: number;
  isAnimating: boolean;
  delay: number;
  color?: string;
}

function TransactionBox({ index, isAnimating, delay, color = "#4169E1" }: TransactionBoxProps) {
  return (
    <div
      className={cn(
        "w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-xs font-mono text-white font-bold transition-all duration-500",
        isAnimating ? "opacity-100 scale-100" : "opacity-0 scale-50"
      )}
      style={{
        backgroundColor: color,
        transitionDelay: `${delay}ms`,
        boxShadow: isAnimating ? `2px 2px 0 #1A1A2E` : "none",
      }}
    >
      {index}
    </div>
  );
}

// ===== STATE CHANNELS DIAGRAM =====
function StateChannelsDiagram() {
  const [phase, setPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const phases = [
    { label: "Open Channel", description: "Lock funds on-chain" },
    { label: "Off-chain Txns", description: "Instant, free transactions" },
    { label: "Final State", description: "Agree on final balances" },
    { label: "Close Channel", description: "Settle on-chain" },
  ];

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setPhase((p) => (p + 1) % 4);
      }, 2000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="space-y-6">
      {/* Main Diagram */}
      <div className="relative bg-warm-gray p-4 md:p-6 border-2 border-charcoal">
        {/* L1 Layer */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-xs font-mono text-muted-foreground">L1 MAINNET</div>
          <button 
            type="button"
            onClick={togglePlay}
            className="flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer"
          >
            <RefreshCw className={cn("w-3 h-3", isPlaying && "animate-spin")} />
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>

        {/* Participants */}
        <div className="flex items-center justify-between gap-4">
          {/* Alice */}
          <div className="flex flex-col items-center">
            <div className={cn(
              "w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300",
              phase === 0 || phase === 3 ? "bg-primary ring-4 ring-primary/30" : "bg-primary/60"
            )}>
              A
            </div>
            <span className="mt-2 text-xs font-medium">Alice</span>
            <span className="text-xs text-muted-foreground">5 ETH</span>
          </div>

          {/* Channel */}
          <div className="flex-1 relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-charcoal/20 -translate-y-1/2" />
            
            {/* Off-chain zone */}
            <div className={cn(
              "relative mx-4 p-3 md:p-4 bg-card border-2 border-dashed transition-all duration-300",
              phase === 1 || phase === 2 ? "border-primary" : "border-charcoal/30"
            )}>
              <div className="text-center text-xs font-mono text-muted-foreground mb-2">
                OFF-CHAIN CHANNEL
              </div>
              
              {/* Transaction indicators */}
              <div className="flex justify-center gap-2">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-4 h-4 md:w-5 md:h-5 transition-all duration-300 flex items-center justify-center text-[10px] font-mono text-white",
                      phase >= 1 && i <= (phase === 1 ? 2 : 4)
                        ? "bg-emerald-500"
                        : "bg-charcoal/20"
                    )}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    {phase >= 1 && i <= (phase === 1 ? 2 : 4) && "tx"}
                  </div>
                ))}
              </div>
            </div>

            {/* Animated transactions */}
            {phase === 1 && (
              <div className="absolute top-1/2 left-1/4 -translate-y-1/2">
                <div className="w-3 h-3 bg-emerald-500 animate-ping rounded-full" />
              </div>
            )}
          </div>

          {/* Bob */}
          <div className="flex flex-col items-center">
            <div className={cn(
              "w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-white font-bold transition-all duration-300",
              phase === 0 || phase === 3 ? "bg-accent ring-4 ring-accent/30" : "bg-accent/60"
            )}>
              B
            </div>
            <span className="mt-2 text-xs font-medium">Bob</span>
            <span className="text-xs text-muted-foreground">5 ETH</span>
          </div>
        </div>

        {/* On-chain indicators */}
        {(phase === 0 || phase === 3) && (
          <div className="mt-4 flex justify-center">
            <div className="px-3 py-1 bg-primary/10 border border-primary text-xs font-mono text-primary animate-pulse">
              {phase === 0 ? "Opening Transaction..." : "Closing Transaction..."}
            </div>
          </div>
        )}
      </div>

      {/* Phase indicators */}
      <div className="grid grid-cols-4 gap-2">
        {phases.map((p, i) => (
          <button
            key={p.label}
            type="button"
            onClick={() => { setPhase(i); setIsPlaying(false); }}
            className={cn(
              "p-2 md:p-3 text-center transition-all cursor-pointer border-2",
              phase === i
                ? "bg-primary text-white border-primary"
                : "bg-card text-charcoal border-charcoal/20 hover:border-primary/50"
            )}
          >
            <div className="text-[10px] md:text-xs font-semibold">{p.label}</div>
            <div className="text-[9px] md:text-[10px] opacity-70 hidden sm:block">{p.description}</div>
          </button>
        ))}
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-emerald-50 border-2 border-emerald-200">
          <Zap className="w-4 h-4 text-emerald-600 mb-1" />
          <div className="text-xs font-semibold text-emerald-800">Instant</div>
          <div className="text-[10px] text-emerald-600">No block wait</div>
        </div>
        <div className="p-3 bg-emerald-50 border-2 border-emerald-200">
          <span className="text-emerald-600 text-sm font-bold">$0</span>
          <div className="text-xs font-semibold text-emerald-800">Free Off-chain</div>
          <div className="text-[10px] text-emerald-600">Only opening/closing</div>
        </div>
        <div className="p-3 bg-amber-50 border-2 border-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-600 mb-1" />
          <div className="text-xs font-semibold text-amber-800">Limited</div>
          <div className="text-[10px] text-amber-600">Fixed participants</div>
        </div>
      </div>
    </div>
  );
}

// ===== OPTIMISTIC ROLLUPS DIAGRAM =====
function OptimisticRollupsDiagram() {
  const [phase, setPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [challengeTriggered, setChallengeTriggered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && !challengeTriggered) {
      intervalRef.current = setInterval(() => {
        setPhase((p) => (p + 1) % 5);
      }, 2500);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, challengeTriggered]);

  const triggerChallenge = () => {
    setChallengeTriggered(true);
    setIsPlaying(false);
    setPhase(3);
  };

  const resetDemo = () => {
    setChallengeTriggered(false);
    setPhase(0);
    setIsPlaying(true);
  };

  const phases = [
    { label: "Collect Txns", icon: <Layers className="w-4 h-4" /> },
    { label: "Execute Off-chain", icon: <Zap className="w-4 h-4" /> },
    { label: "Post to L1", icon: <ArrowRight className="w-4 h-4" /> },
    { label: "Challenge Period", icon: <Clock className="w-4 h-4" /> },
    { label: "Finalized", icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Main Diagram */}
      <div className="relative bg-warm-gray p-4 md:p-6 border-2 border-charcoal">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-mono text-muted-foreground">OPTIMISTIC ROLLUP FLOW</div>
          <button 
            type="button"
            onClick={challengeTriggered ? resetDemo : () => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer"
          >
            <RefreshCw className={cn("w-3 h-3", isPlaying && !challengeTriggered && "animate-spin")} />
            {challengeTriggered ? "Reset" : isPlaying ? "Pause" : "Play"}
          </button>
        </div>

        {/* Architecture layers */}
        <div className="space-y-4">
          {/* L2 Layer */}
          <div className="relative p-4 bg-primary/5 border-2 border-primary/30">
            <div className="absolute -top-3 left-3 px-2 bg-warm-gray text-xs font-mono text-primary">
              L2 ROLLUP
            </div>
            
            <div className="flex items-center gap-4">
              {/* Sequencer */}
              <div className={cn(
                "p-3 bg-card border-2 transition-all duration-300",
                phase <= 1 ? "border-primary ring-2 ring-primary/20" : "border-charcoal/20"
              )}>
                <div className="text-xs font-mono text-center mb-2">Sequencer</div>
                <div className="flex flex-wrap gap-1 justify-center max-w-20">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <TransactionBox
                      key={i}
                      index={i}
                      isAnimating={phase >= 0}
                      delay={i * 150}
                      color={phase >= 1 ? "#22C55E" : "#4169E1"}
                    />
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <div className="flex-1 flex items-center">
                <div className={cn(
                  "flex-1 h-1 transition-all duration-500",
                  phase >= 2 ? "bg-emerald-500" : "bg-charcoal/20"
                )} />
                <ArrowRight className={cn(
                  "w-5 h-5 transition-all duration-300",
                  phase >= 2 ? "text-emerald-500" : "text-charcoal/30"
                )} />
              </div>

              {/* State Root */}
              <div className={cn(
                "p-3 bg-card border-2 transition-all duration-300",
                phase >= 2 ? "border-emerald-500" : "border-charcoal/20"
              )}>
                <div className="text-xs font-mono text-center mb-1">State Root</div>
                <div className="w-16 h-8 bg-charcoal/10 flex items-center justify-center">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {phase >= 2 ? "0x7f3..." : "---"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bridge to L1 */}
          <div className="flex justify-center">
            <div className={cn(
              "px-4 py-2 border-2 transition-all duration-300",
              phase >= 2 ? "border-primary bg-primary/10 text-primary" : "border-charcoal/20 text-charcoal/40"
            )}>
              <ArrowRight className="w-4 h-4 rotate-90" />
            </div>
          </div>

          {/* L1 Layer */}
          <div className="relative p-4 bg-charcoal/5 border-2 border-charcoal/30">
            <div className="absolute -top-3 left-3 px-2 bg-warm-gray text-xs font-mono text-charcoal">
              L1 ETHEREUM
            </div>
            
            <div className="flex items-center gap-4">
              {/* Posted Data */}
              <div className={cn(
                "flex-1 p-3 bg-card border-2 transition-all duration-300",
                phase >= 2 ? "border-charcoal" : "border-charcoal/20"
              )}>
                <div className="text-xs font-mono mb-2">Calldata Posted</div>
                <div className={cn(
                  "h-6 bg-charcoal/10 flex items-center px-2 transition-all",
                  phase >= 2 ? "opacity-100" : "opacity-30"
                )}>
                  <span className="text-[10px] font-mono truncate">
                    {phase >= 2 ? "batch_data: [tx1, tx2, tx3...]" : "waiting..."}
                  </span>
                </div>
              </div>

              {/* Challenge Period */}
              <div className={cn(
                "p-3 border-2 transition-all duration-300",
                challengeTriggered ? "bg-red-50 border-red-500" :
                phase === 3 ? "bg-amber-50 border-amber-500 animate-pulse" :
                phase >= 4 ? "bg-emerald-50 border-emerald-500" : "bg-card border-charcoal/20"
              )}>
                <div className="text-xs font-mono text-center mb-1">
                  <Tooltip 
                    term="Challenge Period" 
                    definition="A time window (typically 7 days) where anyone can submit fraud proofs to dispute invalid state transitions"
                  >
                    Challenge Period
                  </Tooltip>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Clock className={cn(
                    "w-4 h-4",
                    challengeTriggered ? "text-red-500" :
                    phase === 3 ? "text-amber-500 animate-spin" :
                    phase >= 4 ? "text-emerald-500" : "text-charcoal/30"
                  )} />
                  <span className={cn(
                    "text-xs font-bold",
                    challengeTriggered ? "text-red-600" :
                    phase === 3 ? "text-amber-600" :
                    phase >= 4 ? "text-emerald-600" : "text-charcoal/30"
                  )}>
                    {challengeTriggered ? "DISPUTED!" : phase === 3 ? "7 days" : phase >= 4 ? "Passed" : "---"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Trigger */}
        {phase >= 3 && !challengeTriggered && (
          <button
            type="button"
            onClick={triggerChallenge}
            className="mt-4 w-full py-2 border-2 border-red-300 bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100 transition-colors cursor-pointer"
          >
            <AlertTriangle className="w-3 h-3 inline mr-1" />
            Simulate Fraud Proof Challenge
          </button>
        )}

        {/* Challenge Result */}
        {challengeTriggered && (
          <div className="mt-4 p-3 bg-red-100 border-2 border-red-500">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-red-600 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-red-800">Fraud Proof Submitted</div>
                <div className="text-[10px] text-red-600">
                  Invalid state transition detected. Batch rolled back, sequencer slashed.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Phase timeline */}
      <div className="flex gap-1">
        {phases.map((p, i) => (
          <button
            key={p.label}
            type="button"
            onClick={() => { setPhase(i); setIsPlaying(false); setChallengeTriggered(false); }}
            className={cn(
              "flex-1 p-2 flex flex-col items-center gap-1 transition-all cursor-pointer border-2",
              phase === i
                ? challengeTriggered && i === 3 ? "bg-red-500 text-white border-red-500" : "bg-primary text-white border-primary"
                : phase > i
                ? "bg-emerald-100 border-emerald-300 text-emerald-700"
                : "bg-card border-charcoal/20 text-charcoal/50"
            )}
          >
            {p.icon}
            <span className="text-[9px] md:text-[10px] font-medium hidden sm:block">{p.label}</span>
          </button>
        ))}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-emerald-50 border-2 border-emerald-200">
          <div className="text-lg font-bold text-emerald-700">10-100x</div>
          <div className="text-[10px] text-emerald-600">Throughput increase</div>
        </div>
        <div className="p-3 bg-amber-50 border-2 border-amber-200">
          <div className="text-lg font-bold text-amber-700">
            <Tooltip term="Finality" definition="The guarantee that a transaction cannot be reversed or altered. Optimistic rollups achieve finality after the challenge period expires.">
              7 days
            </Tooltip>
          </div>
          <div className="text-[10px] text-amber-600">Withdrawal delay</div>
        </div>
        <div className="p-3 bg-primary/5 border-2 border-primary/20">
          <div className="text-lg font-bold text-primary">$186B</div>
          <div className="text-[10px] text-primary/70">Total L2 TVL</div>
        </div>
      </div>
    </div>
  );
}

// ===== ZK ROLLUPS DIAGRAM =====
function ZKRollupsDiagram() {
  const [phase, setPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setPhase((p) => (p + 1) % 4);
      }, 2500);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  const phases = [
    { label: "Batch Txns", description: "Collect transactions" },
    { label: "Generate Proof", description: "Create ZK validity proof" },
    { label: "Verify on L1", description: "Smart contract verification" },
    { label: "Finalized", description: "Instant finality" },
  ];

  return (
    <div className="space-y-6">
      {/* Main Diagram */}
      <div className="relative bg-warm-gray p-4 md:p-6 border-2 border-charcoal">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-mono text-muted-foreground">ZK-ROLLUP ARCHITECTURE</div>
          <button 
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer"
          >
            <RefreshCw className={cn("w-3 h-3", isPlaying && "animate-spin")} />
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>

        <div className="space-y-6">
          {/* L2 Processing */}
          <div className="relative p-4 bg-primary/5 border-2 border-primary/30">
            <div className="absolute -top-3 left-3 px-2 bg-warm-gray text-xs font-mono text-primary">
              L2 ZK-ROLLUP
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {/* Transactions */}
              <div className={cn(
                "p-3 bg-card border-2 transition-all duration-300",
                phase === 0 ? "border-primary ring-2 ring-primary/20" : "border-charcoal/20"
              )}>
                <div className="text-xs font-mono text-center mb-2">Transactions</div>
                <div className="grid grid-cols-3 gap-1 justify-items-center">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <TransactionBox
                      key={i}
                      index={i}
                      isAnimating={phase >= 0}
                      delay={i * 100}
                    />
                  ))}
                </div>
              </div>

              {/* Prover */}
              <div className={cn(
                "p-3 bg-card border-2 flex flex-col items-center justify-center transition-all duration-300",
                phase === 1 ? "border-amber-500 ring-2 ring-amber-200" : "border-charcoal/20"
              )}>
                <Lock className={cn(
                  "w-8 h-8 mb-2 transition-all duration-300",
                  phase === 1 ? "text-amber-500 animate-pulse" : "text-charcoal/30"
                )} />
                <div className="text-xs font-mono text-center">ZK Prover</div>
                {phase === 1 && (
                  <div className="mt-2 text-[10px] text-amber-600 animate-pulse">
                    Generating...
                  </div>
                )}
              </div>

              {/* Proof Output */}
              <div className={cn(
                "p-3 bg-card border-2 transition-all duration-300",
                phase >= 2 ? "border-emerald-500" : "border-charcoal/20"
              )}>
                <div className="text-xs font-mono text-center mb-2">
                  <Tooltip 
                    term="Validity Proof" 
                    definition="A cryptographic proof that guarantees the correctness of state transitions without revealing transaction details"
                  >
                    Validity Proof
                  </Tooltip>
                </div>
                <div className={cn(
                  "p-2 bg-charcoal/5 text-center transition-all duration-300",
                  phase >= 2 ? "opacity-100" : "opacity-30"
                )}>
                  <span className="text-[10px] font-mono">
                    {phase >= 2 ? "π = (A, B, C)" : "---"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bridge */}
          <div className="flex justify-center">
            <div className={cn(
              "px-4 py-2 border-2 flex items-center gap-2 transition-all duration-300",
              phase >= 2 ? "border-emerald-500 bg-emerald-50 text-emerald-600" : "border-charcoal/20 text-charcoal/40"
            )}>
              <ArrowRight className="w-4 h-4 rotate-90" />
              <span className="text-xs font-mono">Submit proof</span>
            </div>
          </div>

          {/* L1 Verification */}
          <div className="relative p-4 bg-charcoal/5 border-2 border-charcoal/30">
            <div className="absolute -top-3 left-3 px-2 bg-warm-gray text-xs font-mono text-charcoal">
              L1 ETHEREUM
            </div>
            
            <div className="flex items-center gap-4">
              {/* Verifier Contract */}
              <div className={cn(
                "flex-1 p-4 bg-card border-2 text-center transition-all duration-300",
                phase === 2 ? "border-primary ring-2 ring-primary/20" : "border-charcoal/20"
              )}>
                <Shield className={cn(
                  "w-8 h-8 mx-auto mb-2 transition-all",
                  phase === 2 ? "text-primary animate-pulse" : "text-charcoal/30"
                )} />
                <div className="text-xs font-mono">Verifier Contract</div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  O(1) verification
                </div>
              </div>

              {/* Arrow */}
              <ArrowRight className={cn(
                "w-6 h-6 transition-all",
                phase >= 3 ? "text-emerald-500" : "text-charcoal/20"
              )} />

              {/* State Update */}
              <div className={cn(
                "flex-1 p-4 bg-card border-2 text-center transition-all duration-300",
                phase >= 3 ? "border-emerald-500 bg-emerald-50" : "border-charcoal/20"
              )}>
                <CheckCircle2 className={cn(
                  "w-8 h-8 mx-auto mb-2 transition-all",
                  phase >= 3 ? "text-emerald-500" : "text-charcoal/30"
                )} />
                <div className="text-xs font-mono">State Updated</div>
                <div className={cn(
                  "text-[10px] mt-1 transition-all",
                  phase >= 3 ? "text-emerald-600 font-semibold" : "text-muted-foreground"
                )}>
                  {phase >= 3 ? "INSTANT FINALITY" : "pending..."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phase timeline */}
      <div className="grid grid-cols-4 gap-2">
        {phases.map((p, i) => (
          <button
            key={p.label}
            type="button"
            onClick={() => { setPhase(i); setIsPlaying(false); }}
            className={cn(
              "p-2 md:p-3 text-center transition-all cursor-pointer border-2",
              phase === i
                ? "bg-primary text-white border-primary"
                : phase > i
                ? "bg-emerald-100 border-emerald-300 text-emerald-700"
                : "bg-card border-charcoal/20 text-charcoal/50"
            )}
          >
            <div className="text-[10px] md:text-xs font-semibold">{p.label}</div>
            <div className="text-[9px] md:text-[10px] opacity-70 hidden sm:block">{p.description}</div>
          </button>
        ))}
      </div>

      {/* Comparison with Optimistic */}
      <div className="p-4 bg-card border-2 border-charcoal">
        <div className="text-xs font-semibold mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          ZK vs Optimistic Rollups
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-[10px] text-muted-foreground mb-1">Finality Time</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-emerald-500 rounded" style={{ width: "30%" }} />
              <span className="text-xs font-mono text-emerald-600">~Hours</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-2 bg-amber-500 rounded" style={{ width: "100%" }} />
              <span className="text-xs font-mono text-amber-600">7 days</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground mb-1">Proof Complexity</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-amber-500 rounded" style={{ width: "90%" }} />
              <span className="text-xs font-mono text-amber-600">High</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-2 bg-emerald-500 rounded" style={{ width: "20%" }} />
              <span className="text-xs font-mono text-emerald-600">Low</span>
            </div>
          </div>
        </div>
        <div className="mt-3 text-[10px] text-muted-foreground">
          <span className="inline-block w-3 h-2 bg-emerald-500 mr-1" /> ZK-Rollup
          <span className="inline-block w-3 h-2 bg-amber-500 ml-3 mr-1" /> Optimistic
        </div>
      </div>

      {/* Key advantages */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-emerald-50 border-2 border-emerald-200">
          <Clock className="w-4 h-4 text-emerald-600 mb-1" />
          <div className="text-xs font-semibold text-emerald-800">Hours</div>
          <div className="text-[10px] text-emerald-600">
            <Tooltip term="Finality" definition="Instant cryptographic certainty vs 7-day optimistic delay">
              Fast finality
            </Tooltip>
          </div>
        </div>
        <div className="p-3 bg-emerald-50 border-2 border-emerald-200">
          <Lock className="w-4 h-4 text-emerald-600 mb-1" />
          <div className="text-xs font-semibold text-emerald-800">Privacy</div>
          <div className="text-[10px] text-emerald-600">Optional ZK privacy</div>
        </div>
        <div className="p-3 bg-amber-50 border-2 border-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-600 mb-1" />
          <div className="text-xs font-semibold text-amber-800">Complex</div>
          <div className="text-[10px] text-amber-600">EVM-equivalence harder</div>
        </div>
      </div>
    </div>
  );
}

// ===== MAIN WIDGET =====
export function Layer2SolutionsWidget() {
  const [activeTab, setActiveTab] = useState<TabType>("optimistic-rollups");
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "brutalist-card p-4 md:p-6 transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h5 className="font-semibold text-charcoal flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            Layer 2 Solutions Architecture
          </h5>
          <p className="text-sm text-muted-foreground mt-1">
            Interactive diagrams showing transaction flow for each L2 approach
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        <TabButton
          id="state-channels"
          label="State Channels"
          icon={<ArrowRight className="w-4 h-4" />}
          isActive={activeTab === "state-channels"}
          onClick={() => setActiveTab("state-channels")}
        />
        <TabButton
          id="optimistic-rollups"
          label="Optimistic Rollups"
          icon={<Clock className="w-4 h-4" />}
          isActive={activeTab === "optimistic-rollups"}
          onClick={() => setActiveTab("optimistic-rollups")}
        />
        <TabButton
          id="zk-rollups"
          label="ZK-Rollups"
          icon={<Lock className="w-4 h-4" />}
          isActive={activeTab === "zk-rollups"}
          onClick={() => setActiveTab("zk-rollups")}
        />
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        {activeTab === "state-channels" && <StateChannelsDiagram />}
        {activeTab === "optimistic-rollups" && <OptimisticRollupsDiagram />}
        {activeTab === "zk-rollups" && <ZKRollupsDiagram />}
      </div>

      {/* Description based on active tab */}
      <div className="mt-6 p-4 bg-warm-gray border-l-4 border-primary">
        {activeTab === "state-channels" && (
          <p className="text-sm text-charcoal">
            <strong>State Channels</strong> enable instant, feeless transactions between fixed participants by moving activity off-chain. Funds are locked in a multisig contract, transactions occur privately, and only the final state is settled on-chain. Ideal for repeated interactions like payment channels or gaming.
          </p>
        )}
        {activeTab === "optimistic-rollups" && (
          <p className="text-sm text-charcoal">
            <strong>Optimistic Rollups</strong> execute transactions off-chain and post compressed data to L1, &quot;optimistically&quot; assuming validity. A 7-day challenge period allows anyone to submit <Tooltip term="Fraud Proof" definition="A cryptographic proof demonstrating that a state transition was invalid, triggering rollback and sequencer penalties">fraud proofs</Tooltip> if invalid states are detected. This approach powers Arbitrum and Optimism with $186B+ TVL.
          </p>
        )}
        {activeTab === "zk-rollups" && (
          <p className="text-sm text-charcoal">
            <strong>ZK-Rollups</strong> generate cryptographic <Tooltip term="Validity Proof" definition="A zero-knowledge proof that mathematically guarantees correct execution without revealing transaction details">validity proofs</Tooltip> for each batch, enabling instant <Tooltip term="Finality" definition="The guarantee that a transaction is permanently confirmed and cannot be reversed">finality</Tooltip> once verified on L1. While computationally intensive to generate proofs, verification is O(1) constant time. Leading implementations include zkSync and StarkNet.
          </p>
        )}
      </div>
    </div>
  );
}
