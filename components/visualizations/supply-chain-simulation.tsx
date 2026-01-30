"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  Tractor,
  Factory,
  Truck,
  Store,
  User,
  Check,
  Clock,
  Hash,
  ArrowRight,
  Zap,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";

// Types
interface Transaction {
  id: string;
  stage: string;
  timestamp: string;
  hash: string;
  data: {
    location: string;
    temperature?: string;
    handler: string;
    action: string;
  };
  blockNumber: number;
}

interface Stage {
  id: string;
  name: string;
  location: string;
  icon: typeof Tractor;
  description: string;
  coordinates: { x: number; y: number };
  handler: string;
  action: string;
  temperature?: string;
}

// Supply chain stages data
const STAGES: Stage[] = [
  {
    id: "harvest",
    name: "Harvest",
    location: "Salinas Valley, CA",
    icon: Tractor,
    description: "Organic romaine lettuce harvested from certified farm",
    coordinates: { x: 10, y: 55 },
    handler: "Green Acres Farm",
    action: "Harvest & Initial Scan",
    temperature: "34°F",
  },
  {
    id: "processing",
    name: "Processing",
    location: "Fresno, CA",
    icon: Factory,
    description: "Washed, inspected, and packaged for distribution",
    coordinates: { x: 30, y: 35 },
    handler: "FreshPack Inc.",
    action: "Quality Inspection",
    temperature: "36°F",
  },
  {
    id: "shipping",
    name: "Distribution",
    location: "Phoenix, AZ",
    icon: Truck,
    description: "Cold chain logistics with IoT temperature monitoring",
    coordinates: { x: 55, y: 60 },
    handler: "ColdChain Logistics",
    action: "Transit Checkpoint",
    temperature: "35°F",
  },
  {
    id: "retail",
    name: "Retail",
    location: "Bentonville, AR",
    icon: Store,
    description: "Received at Walmart distribution center",
    coordinates: { x: 78, y: 45 },
    handler: "Walmart DC #4523",
    action: "Inventory Receipt",
    temperature: "34°F",
  },
  {
    id: "consumer",
    name: "Consumer",
    location: "Little Rock, AR",
    icon: User,
    description: "Customer scans QR code for full provenance",
    coordinates: { x: 90, y: 55 },
    handler: "End Consumer",
    action: "Provenance Query",
  },
];

// Generate mock hash
function generateHash(): string {
  const chars = "0123456789abcdef";
  let hash = "0x";
  for (let i = 0; i < 16; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

// Format timestamp
function formatTimestamp(index: number): string {
  const baseDate = new Date("2024-01-15T06:00:00Z");
  const hours = [0, 4, 18, 26, 28][index] || 0;
  baseDate.setHours(baseDate.getHours() + hours);
  return baseDate.toISOString().replace("T", " ").substring(0, 19) + " UTC";
}

// Stage Node Component
function StageNode({
  stage,
  isActive,
  isCompleted,
  index,
}: {
  stage: Stage;
  isActive: boolean;
  isCompleted: boolean;
  index: number;
}) {
  const Icon = stage.icon;

  return (
    <motion.div
      className="absolute flex flex-col items-center"
      style={{
        left: `${stage.coordinates.x}%`,
        top: `${stage.coordinates.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: isActive ? 1.1 : 1,
      }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      {/* Node Circle */}
      <motion.div
        className={cn(
          "relative flex h-12 w-12 items-center justify-center border-2 md:h-14 md:w-14",
          isCompleted
            ? "border-[#16A34A] bg-[#16A34A]"
            : isActive
              ? "border-primary bg-primary"
              : "border-foreground/30 bg-background"
        )}
        animate={
          isActive
            ? {
              boxShadow: [
                "0 0 0 0 rgba(65, 105, 225, 0.4)",
                "0 0 0 12px rgba(65, 105, 225, 0)",
              ],
            }
            : {}
        }
        transition={
          isActive
            ? {
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
            }
            : {}
        }
      >
        {isCompleted ? (
          <Check className="h-6 w-6 text-white" />
        ) : (
          <Icon
            className={cn(
              "h-6 w-6",
              isActive ? "text-primary-foreground" : "text-foreground/50"
            )}
          />
        )}
      </motion.div>

      {/* Label */}
      <div
        className={cn(
          "mt-2 text-center",
          index % 2 === 0 ? "" : "md:-mt-20 md:mb-2"
        )}
      >
        <p
          className={cn(
            "text-xs font-bold uppercase tracking-wider md:text-sm",
            isActive || isCompleted ? "text-foreground" : "text-foreground/50"
          )}
        >
          {stage.name}
        </p>
        <p
          className={cn(
            "text-[10px] md:text-xs font-mono",
            isActive || isCompleted
              ? "text-muted-foreground"
              : "text-muted-foreground/50"
          )}
        >
          {stage.location}
        </p>
      </div>
    </motion.div>
  );
}

// Connection Path Component
function ConnectionPath({
  from,
  to,
  isActive,
  index,
}: {
  from: Stage;
  to: Stage;
  isActive: boolean;
  index: number;
}) {
  return (
    <svg
      className="absolute inset-0 h-full w-full pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <motion.line
        x1={`${from.coordinates.x}%`}
        y1={`${from.coordinates.y}%`}
        x2={`${to.coordinates.x}%`}
        y2={`${to.coordinates.y}%`}
        stroke={isActive ? "#4169E1" : "#E8E8E3"}
        strokeWidth={isActive ? 3 : 2}
        strokeDasharray={isActive ? "0" : "8 4"}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: index * 0.2 }}
      />
    </svg>
  );
}

// Ledger Entry Component
function LedgerEntry({
  transaction,
  isLatest,
}: {
  transaction: Transaction;
  isLatest: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "border-2 border-foreground p-3 md:p-4 mb-2 transition-colors duration-300",
        isLatest ? "bg-primary/10 border-primary" : "bg-background"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-6 w-6 items-center justify-center text-xs font-mono font-bold",
              isLatest
                ? "bg-primary text-primary-foreground"
                : "bg-foreground text-background"
            )}
          >
            {transaction.blockNumber}
          </div>
          <span className="font-bold text-sm">{transaction.stage}</span>
        </div>
        {isLatest && (
          <span className="text-[10px] font-mono uppercase tracking-wider text-primary animate-pulse">
            New
          </span>
        )}
      </div>

      <div className="mt-2 grid gap-1 text-xs md:text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-3 w-3 shrink-0" />
          <span className="font-mono text-[10px] md:text-xs truncate">
            {transaction.timestamp}
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Hash className="h-3 w-3 shrink-0" />
          <span className="font-mono text-[10px] md:text-xs truncate">
            {transaction.hash}
          </span>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-foreground/10 text-xs">
        <div className="grid grid-cols-2 gap-1">
          <span className="text-muted-foreground">Handler:</span>
          <span className="font-medium truncate">{transaction.data.handler}</span>
          <span className="text-muted-foreground">Location:</span>
          <span className="font-medium truncate">{transaction.data.location}</span>
          {transaction.data.temperature && (
            <>
              <span className="text-muted-foreground">Temp:</span>
              <span className="font-medium text-[#16A34A]">
                {transaction.data.temperature}
              </span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Time Comparison Component
function TimeComparison({ isVisible }: { isVisible: boolean }) {
  const [traditionalTime, setTraditionalTime] = useState(0);
  const [blockchainTime, setBlockchainTime] = useState(0);

  useEffect(() => {
    if (isVisible) {
      // Animate traditional time (7 days = 604800 seconds, we'll show in days)
      const traditionalInterval = setInterval(() => {
        setTraditionalTime((prev) => {
          if (prev >= 7) {
            clearInterval(traditionalInterval);
            return 7;
          }
          return prev + 0.1;
        });
      }, 50);

      // Animate blockchain time (2.2 seconds)
      const blockchainInterval = setInterval(() => {
        setBlockchainTime((prev) => {
          if (prev >= 2.2) {
            clearInterval(blockchainInterval);
            return 2.2;
          }
          return prev + 0.1;
        });
      }, 20);

      return () => {
        clearInterval(traditionalInterval);
        clearInterval(blockchainInterval);
      };
    }
  }, [isVisible]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      className="mt-8 grid gap-4 md:grid-cols-2"
    >
      {/* Traditional */}
      <div className="border-2 border-foreground/30 p-4 md:p-6 bg-secondary/30">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-[#D97706]" />
          <h4 className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
            Traditional Traceability
          </h4>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-4xl md:text-5xl font-black text-foreground/70">
            {traditionalTime.toFixed(1)}
          </span>
          <span className="text-lg font-bold text-muted-foreground">days</span>
        </div>
        <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
          <li>Manual record retrieval</li>
          <li>Multiple phone calls & emails</li>
          <li>Paper trail verification</li>
        </ul>
      </div>

      {/* Blockchain */}
      <div className="border-2 border-primary bg-primary/5 p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="h-5 w-5 text-[#16A34A]" />
          <h4 className="font-mono text-sm uppercase tracking-wider text-primary">
            Blockchain Traceability
          </h4>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-4xl md:text-5xl font-black text-primary">
            {blockchainTime.toFixed(1)}
          </span>
          <span className="text-lg font-bold text-primary/70">seconds</span>
        </div>
        <ul className="mt-4 space-y-1 text-sm text-foreground">
          <li className="flex items-center gap-2">
            <Check className="h-3 w-3 text-[#16A34A]" />
            Instant query response
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-3 w-3 text-[#16A34A]" />
            Immutable audit trail
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-3 w-3 text-[#16A34A]" />
            Complete chain of custody
          </li>
        </ul>
      </div>
    </motion.div>
  );
}

// Progress Indicator
function ProgressIndicator({
  currentStage,
  totalStages,
}: {
  currentStage: number;
  totalStages: number;
}) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
        Journey Progress
      </span>
      <div className="flex-1 h-1 bg-secondary">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: "0%" }}
          animate={{ width: `${((currentStage + 1) / totalStages) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <span className="text-xs font-mono text-primary">
        {currentStage + 1}/{totalStages}
      </span>
    </div>
  );
}

// Main Component
export function SupplyChainSimulation() {
  const [activeStage, setActiveStage] = useState(-1);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.4 });

  // Stage refs for scroll tracking
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const addTransaction = useCallback((stageIndex: number) => {
    const stage = STAGES[stageIndex];
    const newTransaction: Transaction = {
      id: `tx-${stageIndex}`,
      stage: stage.name,
      timestamp: formatTimestamp(stageIndex),
      hash: generateHash(),
      data: {
        location: stage.location,
        temperature: stage.temperature,
        handler: stage.handler,
        action: stage.action,
      },
      blockNumber: stageIndex + 1,
    };

    setTransactions((prev) => {
      // Avoid duplicates
      if (prev.some((tx) => tx.id === newTransaction.id)) {
        return prev;
      }
      return [...prev, newTransaction];
    });
  }, []);

  // Handle scroll within the component's stage descriptions
  useEffect(() => {
    if (!isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = stageRefs.current.indexOf(
              entry.target as HTMLDivElement
            );
            if (index !== -1 && index > activeStage) {
              setActiveStage(index);
              addTransaction(index);

              if (index === STAGES.length - 1) {
                setTimeout(() => setIsComplete(true), 500);
              }
            }
          }
        });
      },
      { threshold: 0.5, rootMargin: "-20% 0px -20% 0px" }
    );

    stageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [isInView, activeStage, addTransaction]);

  // Auto-start when in view
  useEffect(() => {
    if (isInView && activeStage === -1) {
      const timer = setTimeout(() => {
        setActiveStage(0);
        addTransaction(0);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isInView, activeStage, addTransaction]);

  return (
    <div ref={containerRef} className="my-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center border-2 border-foreground bg-primary">
          <Zap className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h4 className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
            Interactive Simulation
          </h4>
          <p className="font-bold">Farm to Consumer Journey</p>
        </div>
      </div>

      <ProgressIndicator
        currentStage={Math.max(0, activeStage)}
        totalStages={STAGES.length}
      />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left: Map Visualization */}
        <div className="border-2 border-foreground bg-secondary/20 p-4 md:p-6">
          {/* Visual Map */}
          <div className="relative h-48 md:h-64 mb-6">
            {/* Grid background */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(10,10,10,0.05) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(10,10,10,0.05) 1px, transparent 1px)
                `,
                backgroundSize: "20px 20px",
              }}
            />

            {/* Connection lines */}
            {STAGES.slice(0, -1).map((stage, index) => (
              <ConnectionPath
                key={`path-${index}`}
                from={stage}
                to={STAGES[index + 1]}
                isActive={index < activeStage}
                index={index}
              />
            ))}

            {/* Stage nodes */}
            {STAGES.map((stage, index) => (
              <StageNode
                key={stage.id}
                stage={stage}
                isActive={index === activeStage}
                isCompleted={index < activeStage}
                index={index}
              />
            ))}
          </div>

          {/* Stage Descriptions - Scroll triggers */}
          <div className="space-y-4">
            {STAGES.map((stage, index) => {
              const Icon = stage.icon;
              const isActive = index === activeStage;
              const isCompleted = index < activeStage;

              return (
                <div
                  key={stage.id}
                  ref={(el) => {
                    stageRefs.current[index] = el;
                  }}
                  className={cn(
                    "p-4 border-2 transition-all duration-300 cursor-pointer",
                    isActive
                      ? "border-primary bg-primary/5"
                      : isCompleted
                        ? "border-[#16A34A]/50 bg-[#16A34A]/5"
                        : "border-foreground/20 bg-background hover:border-foreground/40"
                  )}
                  onClick={() => {
                    if (index <= activeStage + 1) {
                      setActiveStage(index);
                      if (!transactions.some((tx) => tx.id === `tx-${index}`)) {
                        addTransaction(index);
                      }
                      if (index === STAGES.length - 1) {
                        setTimeout(() => setIsComplete(true), 500);
                      }
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center border-2",
                        isActive
                          ? "border-primary bg-primary text-primary-foreground"
                          : isCompleted
                            ? "border-[#16A34A] bg-[#16A34A] text-white"
                            : "border-foreground/30 bg-background text-foreground/50"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h5
                          className={cn(
                            "font-bold",
                            isActive || isCompleted
                              ? "text-foreground"
                              : "text-foreground/50"
                          )}
                        >
                          {stage.name}
                        </h5>
                        <span
                          className={cn(
                            "text-xs font-mono",
                            isActive
                              ? "text-primary"
                              : isCompleted
                                ? "text-[#16A34A]"
                                : "text-muted-foreground"
                          )}
                        >
                          {stage.location}
                        </span>
                      </div>
                      <p
                        className={cn(
                          "text-sm mt-1",
                          isActive || isCompleted
                            ? "text-muted-foreground"
                            : "text-muted-foreground/50"
                        )}
                      >
                        {stage.description}
                      </p>
                      {(isActive || isCompleted) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-2 flex items-center gap-4 text-xs"
                        >
                          <span className="flex items-center gap-1">
                            <span className="text-muted-foreground">
                              Handler:
                            </span>
                            <span className="font-medium">{stage.handler}</span>
                          </span>
                          {stage.temperature && (
                            <span className="flex items-center gap-1">
                              <span className="text-muted-foreground">
                                Temp:
                              </span>
                              <span className="font-medium text-[#16A34A]">
                                {stage.temperature}
                              </span>
                            </span>
                          )}
                        </motion.div>
                      )}
                    </div>
                    {isActive && (
                      <ArrowRight className="h-4 w-4 text-primary animate-pulse shrink-0" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Blockchain Ledger */}
        <div className="border-2 border-foreground bg-background">
          <div className="border-b-2 border-foreground bg-foreground px-4 py-3">
            <h4 className="font-mono text-sm uppercase tracking-wider text-background">
              Blockchain Ledger
            </h4>
            <p className="text-xs text-background/70 mt-1">
              Hyperledger Fabric Network
            </p>
          </div>

          <div className="p-4 max-h-[500px] overflow-y-auto">
            <AnimatePresence>
              {transactions.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8 text-muted-foreground"
                >
                  <Hash className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Awaiting transactions...</p>
                  <p className="text-xs mt-1">
                    Click stages or scroll to begin
                  </p>
                </motion.div>
              ) : (
                transactions.map((tx, index) => (
                  <LedgerEntry
                    key={tx.id}
                    transaction={tx}
                    isLatest={index === transactions.length - 1}
                  />
                ))
              )}
            </AnimatePresence>

            {isComplete && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-[#16A34A]/10 border-2 border-[#16A34A]"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#16A34A]" />
                  <span className="font-bold text-sm text-[#16A34A]">
                    Chain Complete
                  </span>
                </div>
                <p className="text-xs mt-1 text-muted-foreground">
                  Full provenance verified in{" "}
                  <span className="font-mono font-bold text-[#16A34A]">
                    2.2 seconds
                  </span>
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Time Comparison - Shows when complete */}
      <TimeComparison isVisible={isComplete} />

      {/* Walmart Case Study Note */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-4 border-l-4 border-primary bg-secondary/30"
        >
          <p className="text-sm">
            <span className="font-bold">Walmart Case Study:</span> Using
            Hyperledger Fabric, Walmart reduced food traceability time from{" "}
            <span className="font-mono font-bold">7 days</span> to{" "}
            <span className="font-mono font-bold text-primary">2.2 seconds</span>
            . The system now tracks over 25 products from 5 suppliers, with
            plans to require all fresh leafy greens suppliers to adopt
            blockchain tracing.
          </p>
        </motion.div>
      )}
    </div>
  );
}
