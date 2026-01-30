"use client";

import { useState, useEffect, useRef } from "react";
import { useInView, motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Gamepad2,
  Coins,
  Store,
  Repeat,
  Users,
  TrendingUp,
  Wallet,
  ChevronRight,
  Info,
  Zap,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Token flow animation data
interface FlowStep {
  id: string;
  label: string;
  description: string;
  icon: typeof Gamepad2;
  color: string;
}

const flowSteps: FlowStep[] = [
  {
    id: "play",
    label: "Gameplay",
    description: "Players engage in battles, quests, and breeding activities",
    icon: Gamepad2,
    color: "#4169E1",
  },
  {
    id: "earn",
    label: "Earn Tokens",
    description: "SLP (Smooth Love Potion) tokens awarded for victories",
    icon: Coins,
    color: "#16A34A",
  },
  {
    id: "trade",
    label: "Marketplace",
    description: "Trade NFT assets and tokens on decentralized exchanges",
    icon: Store,
    color: "#D97706",
  },
  {
    id: "reinvest",
    label: "Ecosystem",
    description: "Reinvest in breeding, upgrades, or cash out to fiat",
    icon: Repeat,
    color: "#6B8EE8",
  },
];

// Comparative data for P2E games
interface P2EGame {
  name: string;
  blockchain: string;
  peakUsers: string;
  tokenSymbol: string;
  earningPotential: string;
  status: "active" | "declining" | "growing";
}

const p2eGames: P2EGame[] = [
  {
    name: "Axie Infinity",
    blockchain: "Ronin (Ethereum L2)",
    peakUsers: "2.7M daily",
    tokenSymbol: "AXS / SLP",
    earningPotential: "$200-1500/mo (peak)",
    status: "declining",
  },
  {
    name: "The Sandbox",
    blockchain: "Ethereum / Polygon",
    peakUsers: "350K monthly",
    tokenSymbol: "SAND",
    earningPotential: "Variable (land sales)",
    status: "active",
  },
  {
    name: "Decentraland",
    blockchain: "Ethereum / Polygon",
    peakUsers: "300K monthly",
    tokenSymbol: "MANA",
    earningPotential: "Variable (events/land)",
    status: "active",
  },
  {
    name: "Gods Unchained",
    blockchain: "Immutable X",
    peakUsers: "80K daily",
    tokenSymbol: "GODS",
    earningPotential: "$50-500/mo",
    status: "growing",
  },
  {
    name: "Illuvium",
    blockchain: "Immutable X",
    peakUsers: "50K daily",
    tokenSymbol: "ILV",
    earningPotential: "$100-800/mo",
    status: "growing",
  },
];

// Animated token particle
function TokenParticle({
  active,
  delay,
  pathIndex,
}: {
  active: boolean;
  delay: number;
  pathIndex: number;
}) {
  if (!active) return null;

  const paths = [
    "M 80 100 Q 200 80 320 100",
    "M 80 100 Q 200 120 320 100",
  ];

  return (
    <motion.circle
      r="6"
      fill="#4169E1"
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        offsetDistance: ["0%", "100%"],
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        repeatDelay: 1,
        ease: "easeInOut",
      }}
      style={{
        offsetPath: `path("${paths[pathIndex % 2]}")`,
      }}
    />
  );
}

// Flow node component
function FlowNode({
  step,
  isActive,
  onClick,
  index,
}: {
  step: FlowStep;
  isActive: boolean;
  onClick: () => void;
  index: number;
}) {
  const Icon = step.icon;

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center gap-2 p-3 md:p-4 border-2 transition-all duration-300 cursor-pointer group",
        isActive
          ? "border-foreground bg-foreground text-background"
          : "border-foreground/30 bg-background text-foreground hover:border-foreground"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className={cn(
          "flex h-10 w-10 md:h-12 md:w-12 items-center justify-center border-2 transition-colors",
          isActive
            ? "border-background bg-transparent"
            : "border-foreground"
        )}
        style={{ backgroundColor: isActive ? step.color : "transparent" }}
      >
        <Icon className="h-5 w-5 md:h-6 md:w-6" />
      </div>
      <span className="font-mono text-xs md:text-sm font-bold uppercase tracking-wider">
        {step.label}
      </span>
      
      {/* Step number indicator */}
      <div
        className={cn(
          "absolute -top-2 -left-2 flex h-5 w-5 items-center justify-center text-[10px] font-bold font-mono",
          isActive ? "bg-background text-foreground" : "bg-foreground text-background"
        )}
      >
        {index + 1}
      </div>
    </motion.button>
  );
}

// Animated arrow connector
function ArrowConnector({ active, index }: { active: boolean; index: number }) {
  return (
    <div className="hidden md:flex items-center justify-center w-8 lg:w-12">
      <motion.div
        className="relative"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.15 + 0.1 }}
      >
        <ChevronRight
          className={cn(
            "h-6 w-6 transition-colors duration-300",
            active ? "text-primary" : "text-foreground/30"
          )}
        />
        {active && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <ChevronRight className="h-6 w-6 text-primary" />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

// Key metric display
function KeyMetric({
  value,
  label,
  icon: Icon,
  delay,
}: {
  value: string;
  label: string;
  icon: typeof Users;
  delay: number;
}) {
  return (
    <motion.div
      className="flex items-center gap-3 border-2 border-foreground p-3 bg-background"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <div className="flex h-10 w-10 items-center justify-center bg-primary">
        <Icon className="h-5 w-5 text-primary-foreground" />
      </div>
      <div>
        <div className="font-mono text-xl md:text-2xl font-black">{value}</div>
        <div className="text-xs text-muted-foreground uppercase tracking-wider">
          {label}
        </div>
      </div>
    </motion.div>
  );
}

// Status badge component
function StatusBadge({ status }: { status: P2EGame["status"] }) {
  const config = {
    active: { bg: "bg-[#525252]", text: "text-white", label: "Active" },
    declining: { bg: "bg-[#D97706]", text: "text-white", label: "Declining" },
    growing: { bg: "bg-[#16A34A]", text: "text-white", label: "Growing" },
  };

  const { bg, text, label } = config[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider",
        bg,
        text
      )}
    >
      {label}
    </span>
  );
}

export function P2EEconomicsVisualizer({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const [activeStep, setActiveStep] = useState<string>("play");
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);

  // Auto-animate through steps
  useEffect(() => {
    if (!isInView || !isAnimating) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => {
        const currentIndex = flowSteps.findIndex((s) => s.id === prev);
        const nextIndex = (currentIndex + 1) % flowSteps.length;
        return flowSteps[nextIndex].id;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isInView, isAnimating]);

  // Start animation when in view
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setIsAnimating(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  const activeStepData = flowSteps.find((s) => s.id === activeStep);

  return (
    <TooltipProvider>
      <div
        ref={ref}
        className={cn(
          "my-8 border-2 border-foreground bg-background overflow-hidden",
          className
        )}
      >
        {/* Header */}
        <div className="border-b-2 border-foreground bg-foreground px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center bg-primary">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h4 className="font-mono text-sm md:text-base font-bold uppercase tracking-wider text-background">
                  Play-to-Earn Economic Model
                </h4>
                <p className="text-xs text-background/60 hidden sm:block">
                  Interactive tokenomics flow visualization
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsAnimating(!isAnimating)}
              className={cn(
                "px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border-2 transition-colors cursor-pointer",
                isAnimating
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-background border-background hover:bg-background hover:text-foreground"
              )}
            >
              {isAnimating ? "Pause" : "Animate"}
            </button>
          </div>
        </div>

        {/* Key Metrics Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 border-b-2 border-foreground bg-secondary/30">
          <KeyMetric
            value="2.7M"
            label="Peak Daily Users"
            icon={Users}
            delay={0.2}
          />
          <KeyMetric
            value="$9.2B"
            label="Peak Market Cap"
            icon={TrendingUp}
            delay={0.3}
          />
          <KeyMetric
            value="$1.3B"
            label="NFT Sales Volume"
            icon={Wallet}
            delay={0.4}
          />
          <KeyMetric
            value="2021"
            label="Peak Activity Year"
            icon={Gamepad2}
            delay={0.5}
          />
        </div>

        <Tabs defaultValue="flow" className="w-full">
          <div className="border-b-2 border-foreground px-4 py-2">
            <TabsList className="h-auto gap-0 p-0 bg-transparent">
              <TabsTrigger
                value="flow"
                className="px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider data-[state=active]:bg-foreground data-[state=active]:text-background border-2 border-foreground data-[state=inactive]:bg-transparent rounded-none cursor-pointer"
              >
                Token Flow
              </TabsTrigger>
              <TabsTrigger
                value="compare"
                className="px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider data-[state=active]:bg-foreground data-[state=active]:text-background border-2 border-l-0 border-foreground data-[state=inactive]:bg-transparent rounded-none cursor-pointer"
              >
                Compare Games
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="flow" className="mt-0">
            {/* Flow Diagram */}
            <div className="p-4 md:p-6">
              {/* Flow Steps */}
              <div className="flex flex-wrap md:flex-nowrap items-center justify-center gap-2 md:gap-0">
                {flowSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <FlowNode
                      step={step}
                      isActive={activeStep === step.id}
                      onClick={() => {
                        setActiveStep(step.id);
                        setIsAnimating(false);
                      }}
                      index={index}
                    />
                    {index < flowSteps.length - 1 && (
                      <ArrowConnector
                        active={
                          flowSteps.findIndex((s) => s.id === activeStep) > index
                        }
                        index={index}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Active Step Description */}
              <AnimatePresence mode="wait">
                {activeStepData && (
                  <motion.div
                    key={activeStepData.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 p-4 border-2 border-foreground bg-secondary/20"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center"
                        style={{ backgroundColor: activeStepData.color }}
                      >
                        <Info className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h5 className="font-mono text-sm font-bold uppercase tracking-wider">
                          {activeStepData.label}
                        </h5>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {activeStepData.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Axie Infinity Specific Example */}
              <div className="mt-6 grid md:grid-cols-3 gap-4">
                <div className="border-2 border-foreground p-4">
                  <h5 className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Token: SLP
                  </h5>
                  <p className="text-sm">
                    Earned through gameplay battles. Used for breeding new Axies.
                    Can be traded on exchanges for fiat currency.
                  </p>
                </div>
                <div className="border-2 border-foreground p-4">
                  <h5 className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Token: AXS
                  </h5>
                  <p className="text-sm">
                    Governance token. Staking rewards available. Required for
                    breeding alongside SLP. Voting rights on platform decisions.
                  </p>
                </div>
                <div className="border-2 border-foreground p-4">
                  <h5 className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    NFTs: Axies
                  </h5>
                  <p className="text-sm">
                    Unique digital creatures owned by players. Tradeable on
                    marketplace. Each has distinct traits affecting battle stats.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="compare" className="mt-0">
            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-foreground bg-foreground text-background">
                    <th className="px-4 py-3 text-left font-mono text-xs font-bold uppercase tracking-wider">
                      Game
                    </th>
                    <th className="px-4 py-3 text-left font-mono text-xs font-bold uppercase tracking-wider">
                      Blockchain
                    </th>
                    <th className="px-4 py-3 text-left font-mono text-xs font-bold uppercase tracking-wider">
                      Peak Users
                    </th>
                    <th className="px-4 py-3 text-left font-mono text-xs font-bold uppercase tracking-wider">
                      Token
                    </th>
                    <th className="px-4 py-3 text-left font-mono text-xs font-bold uppercase tracking-wider">
                      Earning Potential
                    </th>
                    <th className="px-4 py-3 text-left font-mono text-xs font-bold uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {p2eGames.map((game, index) => (
                    <motion.tr
                      key={game.name}
                      className={cn(
                        "border-b border-foreground/20 transition-colors cursor-pointer",
                        hoveredGame === game.name
                          ? "bg-primary/10"
                          : index % 2 === 0
                          ? "bg-background"
                          : "bg-secondary/20"
                      )}
                      onMouseEnter={() => setHoveredGame(game.name)}
                      onMouseLeave={() => setHoveredGame(null)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <td className="px-4 py-3 font-bold">{game.name}</td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {game.blockchain}
                      </td>
                      <td className="px-4 py-3 font-mono">{game.peakUsers}</td>
                      <td className="px-4 py-3">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-foreground text-background text-xs font-mono cursor-help">
                              {game.tokenSymbol}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="bg-foreground text-background border-none">
                            <p className="text-xs">
                              Primary token(s) for {game.name}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {game.earningPotential}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={game.status} />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="p-4 border-t-2 border-foreground bg-secondary/20">
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <span className="font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  Status:
                </span>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 bg-[#16A34A]" />
                  <span>Growing</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 bg-[#525252]" />
                  <span>Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 bg-[#D97706]" />
                  <span>Declining</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer note */}
        <div className="border-t-2 border-foreground bg-secondary/30 px-4 py-2">
          <p className="text-[10px] font-mono text-muted-foreground">
            Data reflects peak historical values. Earnings vary based on market conditions, gameplay skill, and token prices.
          </p>
        </div>
      </div>
    </TooltipProvider>
  );
}
