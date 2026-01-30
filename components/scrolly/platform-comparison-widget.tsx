"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronUp, ChevronDown, BarChart3, TableIcon, Info } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

// Platform data with normalized scores (0-100) for radar chart
const platforms = [
  {
    id: "ethereum",
    name: "Ethereum",
    type: "Public",
    decentralization: 90,
    throughput: 25, // Normalized: ~15-30 TPS -> 25/100
    privacy: 20, // Pseudonymous, all visible
    governanceControl: 15, // Community-driven, decentralized
    tps: "15-30 TPS",
    consensus: "PoS",
    participation: "Permissionless",
    useCases: ["DeFi", "NFTs", "DAOs", "Cryptocurrencies"],
    description: "Leading smart contract platform with largest developer ecosystem",
    color: "#4169E1",
  },
  {
    id: "bitcoin",
    name: "Bitcoin",
    type: "Public",
    decentralization: 95,
    throughput: 10, // ~7 TPS -> 10/100
    privacy: 15,
    governanceControl: 10,
    tps: "5-7 TPS",
    consensus: "PoW",
    participation: "Permissionless",
    useCases: ["Store of Value", "Payments", "Settlement Layer"],
    description: "First and most secure cryptocurrency network",
    color: "#F7931A",
  },
  {
    id: "hyperledger",
    name: "Hyperledger Fabric",
    type: "Private",
    decentralization: 25,
    throughput: 85, // 3,000+ TPS -> 85/100
    privacy: 90, // Confidential channels
    governanceControl: 90,
    tps: "3,000+ TPS",
    consensus: "Raft/Kafka",
    participation: "Permissioned",
    useCases: ["Enterprise Supply Chain", "Healthcare", "Finance"],
    description: "Modular enterprise blockchain with pluggable consensus",
    color: "#2E4CB3",
  },
  {
    id: "quorum",
    name: "Quorum (ConsenSys)",
    type: "Private",
    decentralization: 30,
    throughput: 80,
    privacy: 85,
    governanceControl: 85,
    tps: "1,000+ TPS",
    consensus: "IBFT/Raft",
    participation: "Permissioned",
    useCases: ["Financial Services", "Banking", "Tokenization"],
    description: "Enterprise Ethereum with privacy features",
    color: "#6B8DEF",
  },
  {
    id: "solana",
    name: "Solana",
    type: "Public",
    decentralization: 60,
    throughput: 95, // 65,000 TPS theoretical -> 95/100
    privacy: 20,
    governanceControl: 25,
    tps: "65,000 TPS",
    consensus: "PoH + PoS",
    participation: "Permissionless",
    useCases: ["DeFi", "NFTs", "Gaming", "Payments"],
    description: "High-performance blockchain with Proof of History",
    color: "#14F195",
  },
  {
    id: "corda",
    name: "R3 Corda",
    type: "Private",
    decentralization: 20,
    throughput: 75,
    privacy: 95,
    governanceControl: 95,
    tps: "1,700+ TPS",
    consensus: "Notary Services",
    participation: "Permissioned",
    useCases: ["Trade Finance", "Insurance", "Capital Markets"],
    description: "Purpose-built for regulated financial institutions",
    color: "#EC1D27",
  },
];

// Radar chart data transformation
const radarAxes = [
  { key: "decentralization", label: "Decentralization", fullMark: 100 },
  { key: "throughput", label: "Throughput", fullMark: 100 },
  { key: "privacy", label: "Privacy", fullMark: 100 },
  { key: "governanceControl", label: "Governance", fullMark: 100 },
];

// Comparison table data
const comparisonColumns = [
  { key: "name", label: "Platform", sortable: true },
  { key: "type", label: "Type", sortable: true },
  { key: "tps", label: "Throughput", sortable: false },
  { key: "consensus", label: "Consensus", sortable: true },
  { key: "participation", label: "Participation", sortable: true },
  { key: "privacy", label: "Privacy Score", sortable: true },
];

type SortKey = "name" | "type" | "consensus" | "participation" | "privacy";
type SortDirection = "asc" | "desc";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      axis: string;
    };
    dataKey: string;
    color: string;
  }>;
  label?: string;
}

function CustomRadarTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const axisLabel = label || payload[0]?.payload?.axis || "";

  return (
    <div className="bg-card border-2 border-charcoal p-3 shadow-[4px_4px_0_#1A1A2E]">
      <p className="font-semibold text-charcoal text-sm mb-2">{axisLabel}</p>
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <span
              className="w-3 h-3 inline-block"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-mono font-semibold text-charcoal">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface PlatformDetailCardProps {
  platform: typeof platforms[0];
}

function PlatformDetailCard({ platform }: PlatformDetailCardProps) {
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span
          className="w-3 h-3 inline-block"
          style={{ backgroundColor: platform.color }}
        />
        <span className="font-semibold text-charcoal">{platform.name}</span>
        <span
          className={cn(
            "text-xs px-2 py-0.5 font-mono",
            platform.type === "Public"
              ? "bg-primary/10 text-primary"
              : "bg-accent/10 text-accent"
          )}
        >
          {platform.type}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{platform.description}</p>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-muted-foreground">Throughput:</span>
          <span className="ml-1 font-mono font-semibold">{platform.tps}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Consensus:</span>
          <span className="ml-1 font-mono font-semibold">{platform.consensus}</span>
        </div>
      </div>
      <div>
        <span className="text-xs text-muted-foreground">Use Cases:</span>
        <div className="flex flex-wrap gap-1 mt-1">
          {platform.useCases.map((useCase) => (
            <span
              key={useCase}
              className="text-xs px-2 py-0.5 bg-secondary border border-border"
            >
              {useCase}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PlatformComparisonWidget() {
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    "ethereum",
    "hyperledger",
  ]);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);

  // Prepare radar chart data
  const radarData = useMemo(() => {
    return radarAxes.map((axis) => {
      const dataPoint: Record<string, string | number> = { axis: axis.label };
      selectedPlatforms.forEach((platformId) => {
        const platform = platforms.find((p) => p.id === platformId);
        if (platform) {
          dataPoint[platform.name] = platform[axis.key as keyof typeof platform] as number;
        }
      });
      return dataPoint;
    });
  }, [selectedPlatforms]);

  // Sort table data
  const sortedPlatforms = useMemo(() => {
    return [...platforms].sort((a, b) => {
      let aVal: string | number = a[sortKey];
      let bVal: string | number = b[sortKey];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }, [sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) => {
      if (prev.includes(platformId)) {
        if (prev.length > 1) {
          return prev.filter((id) => id !== platformId);
        }
        return prev;
      }
      return [...prev, platformId];
    });
  };

  return (
    <div className="brutalist-card p-6 mt-8">
      {/* Header with view toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h5 className="font-semibold text-charcoal flex items-center gap-2">
            Blockchain Platform Comparison
            <HoverCard openDelay={200}>
              <HoverCardTrigger asChild>
                <button className="text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                  <Info className="w-4 h-4" />
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 p-4 bg-card border-2 border-charcoal shadow-[4px_4px_0_#1A1A2E]">
                <p className="text-sm text-muted-foreground">
                  Compare blockchain platforms across four key dimensions:
                  <strong> Decentralization</strong> (network distribution),
                  <strong> Throughput</strong> (transaction speed),
                  <strong> Privacy</strong> (data confidentiality), and
                  <strong> Governance</strong> (control structure).
                  Scores are normalized 0-100.
                </p>
              </HoverCardContent>
            </HoverCard>
          </h5>
          <p className="text-sm text-muted-foreground mt-1">
            Select platforms to compare trade-offs between public and private architectures
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex border-2 border-charcoal">
          <button
            onClick={() => setViewMode("chart")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors cursor-pointer",
              viewMode === "chart"
                ? "bg-primary text-white"
                : "bg-card text-charcoal hover:bg-secondary"
            )}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Radar Chart</span>
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-l-2 border-charcoal cursor-pointer",
              viewMode === "table"
                ? "bg-primary text-white"
                : "bg-card text-charcoal hover:bg-secondary"
            )}
          >
            <TableIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Table View</span>
          </button>
        </div>
      </div>

      {/* Platform Selection (for chart view) */}
      {viewMode === "chart" && (
        <div className="mb-6">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Select Platforms to Compare
          </span>
          <div className="flex flex-wrap gap-2">
            {platforms.map((platform) => (
              <HoverCard key={platform.id} openDelay={300}>
                <HoverCardTrigger asChild>
                  <button
                    onClick={() => togglePlatform(platform.id)}
                    onMouseEnter={() => setHoveredPlatform(platform.id)}
                    onMouseLeave={() => setHoveredPlatform(null)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 text-sm font-medium border-2 transition-all cursor-pointer",
                      selectedPlatforms.includes(platform.id)
                        ? "border-charcoal bg-card shadow-[2px_2px_0_#1A1A2E]"
                        : "border-border bg-secondary text-muted-foreground hover:border-charcoal"
                    )}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: platform.color }}
                    />
                    {platform.name}
                    <span
                      className={cn(
                        "text-xs px-1.5 py-0.5 font-mono",
                        platform.type === "Public"
                          ? "bg-primary/10 text-primary"
                          : "bg-accent/10 text-accent"
                      )}
                    >
                      {platform.type}
                    </span>
                  </button>
                </HoverCardTrigger>
                <HoverCardContent
                  side="bottom"
                  className="w-72 p-0 bg-card border-2 border-charcoal shadow-[4px_4px_0_#1A1A2E]"
                >
                  <PlatformDetailCard platform={platform} />
                </HoverCardContent>
              </HoverCard>
            ))}
          </div>
        </div>
      )}

      {/* Radar Chart View */}
      {viewMode === "chart" && (
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#E2E1DE" strokeWidth={1} />
              <PolarAngleAxis
                dataKey="axis"
                tick={{
                  fill: "#1A1A2E",
                  fontSize: 12,
                  fontWeight: 600,
                }}
                tickLine={false}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: "#64748B", fontSize: 10 }}
                tickCount={5}
                axisLine={false}
              />
              {selectedPlatforms.map((platformId) => {
                const platform = platforms.find((p) => p.id === platformId);
                if (!platform) return null;
                return (
                  <Radar
                    key={platform.id}
                    name={platform.name}
                    dataKey={platform.name}
                    stroke={platform.color}
                    fill={platform.color}
                    fillOpacity={
                      hoveredPlatform === platform.id
                        ? 0.5
                        : hoveredPlatform
                        ? 0.15
                        : 0.3
                    }
                    strokeWidth={2}
                    animationDuration={500}
                  />
                );
              })}
              <Tooltip content={<CustomRadarTooltip />} />
              <Legend
                wrapperStyle={{
                  paddingTop: "20px",
                }}
                formatter={(value) => (
                  <span className="text-sm font-medium text-charcoal">{value}</span>
                )}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <div className="overflow-x-auto">
          <Table className="academic-table">
            <TableHeader>
              <TableRow>
                {comparisonColumns.map((col) => (
                  <TableHead
                    key={col.key}
                    className={cn(
                      "bg-primary text-white font-semibold",
                      col.sortable && "cursor-pointer hover:bg-primary/90 transition-colors"
                    )}
                    onClick={() =>
                      col.sortable && handleSort(col.key as SortKey)
                    }
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {col.sortable && sortKey === col.key && (
                        sortDirection === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPlatforms.map((platform) => (
                <HoverCard key={platform.id} openDelay={400}>
                  <HoverCardTrigger asChild>
                    <TableRow className="cursor-pointer hover:bg-warm-gray transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: platform.color }}
                          />
                          <span className="font-medium">{platform.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 font-mono",
                            platform.type === "Public"
                              ? "bg-primary/10 text-primary"
                              : "bg-accent/10 text-accent"
                          )}
                        >
                          {platform.type}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {platform.tps}
                      </TableCell>
                      <TableCell>{platform.consensus}</TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5",
                            platform.participation === "Permissionless"
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          )}
                        >
                          {platform.participation}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${platform.privacy}%` }}
                            />
                          </div>
                          <span className="font-mono text-xs">
                            {platform.privacy}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  </HoverCardTrigger>
                  <HoverCardContent
                    side="left"
                    className="w-80 p-0 bg-card border-2 border-charcoal shadow-[4px_4px_0_#1A1A2E]"
                  >
                    <PlatformDetailCard platform={platform} />
                  </HoverCardContent>
                </HoverCard>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Legend / Key Insights */}
      <div className="mt-6 pt-6 border-t-2 border-border">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {radarAxes.map((axis) => (
            <div key={axis.key} className="flex items-start gap-3">
              <span className="w-2 h-2 bg-primary mt-1.5 flex-shrink-0" />
              <div>
                <span className="text-sm font-semibold text-charcoal block">
                  {axis.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {axis.key === "decentralization" &&
                    "Network distribution and validator diversity"}
                  {axis.key === "throughput" &&
                    "Transactions per second capacity"}
                  {axis.key === "privacy" &&
                    "Data confidentiality and transaction visibility"}
                  {axis.key === "governanceControl" &&
                    "Decision-making authority structure"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
