"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Info, Check, X, Zap, FileText, Shield, ChevronDown, ChevronUp } from "lucide-react";

// ZKP Types data
const zkpTypes = {
  "ZK-SNARKs": {
    id: "zk-snarks",
    fullName: "Zero-Knowledge Succinct Non-Interactive Arguments of Knowledge",
    color: "#4169E1", // Royal blue
    proofSize: { value: 200, unit: "bytes", score: 95 },
    verificationTime: { value: "O(1)", complexity: "Constant", score: 98 },
    trustedSetup: { required: true, score: 20 },
    description: "Highly compact proofs with constant verification time, but requires a trusted setup ceremony that creates security risks if compromised.",
    useCases: ["Zcash (privacy coins)", "Ethereum zkRollups", "Private DeFi"],
    quantumResistant: false,
  },
  "ZK-STARKs": {
    id: "zk-starks",
    fullName: "Zero-Knowledge Scalable Transparent Arguments of Knowledge",
    color: "#2E4CB3", // Darker blue
    proofSize: { value: 45, unit: "kB", score: 35 },
    verificationTime: { value: "O(log² n)", complexity: "Poly-logarithmic", score: 75 },
    trustedSetup: { required: false, score: 100 },
    description: "Eliminates trusted setup and provides quantum resistance, but produces larger proofs with longer verification times.",
    useCases: ["StarkNet", "dYdX", "Immutable X"],
    quantumResistant: true,
  },
  "Bulletproofs": {
    id: "bulletproofs",
    fullName: "Short Non-Interactive Zero-Knowledge Proofs",
    color: "#1A1A2E", // Charcoal
    proofSize: { value: 1.5, unit: "kB", score: 70 },
    verificationTime: { value: "O(N)", complexity: "Linear", score: 40 },
    trustedSetup: { required: false, score: 100 },
    description: "Compact proofs without trusted setup, but linear verification time limits scalability for complex proofs.",
    useCases: ["Monero (confidential transactions)", "Range proofs", "Private transactions"],
    quantumResistant: false,
  },
};

type ZKPType = keyof typeof zkpTypes;

interface WeightState {
  proofSize: number;
  verificationTime: number;
  trustedSetup: number;
}

export function ZKPComparisonWidget({ className }: { className?: string }) {
  const [weights, setWeights] = useState<WeightState>({
    proofSize: 33,
    verificationTime: 33,
    trustedSetup: 34,
  });
  const [expandedCard, setExpandedCard] = useState<ZKPType | null>(null);
  const [hoveredAxis, setHoveredAxis] = useState<string | null>(null);

  // Calculate weighted scores for each ZKP type
  const scores = useMemo(() => {
    const totalWeight = weights.proofSize + weights.verificationTime + weights.trustedSetup;
    const normalizedWeights = {
      proofSize: weights.proofSize / totalWeight,
      verificationTime: weights.verificationTime / totalWeight,
      trustedSetup: weights.trustedSetup / totalWeight,
    };

    return Object.entries(zkpTypes).map(([name, data]) => ({
      name: name as ZKPType,
      score: Math.round(
        data.proofSize.score * normalizedWeights.proofSize +
        data.verificationTime.score * normalizedWeights.verificationTime +
        data.trustedSetup.score * normalizedWeights.trustedSetup
      ),
      data,
    })).sort((a, b) => b.score - a.score);
  }, [weights]);

  const bestChoice = scores[0];

  const handleWeightChange = (axis: keyof WeightState, value: number[]) => {
    setWeights(prev => ({ ...prev, [axis]: value[0] }));
  };

  const axisInfo = {
    proofSize: {
      label: "Proof Size",
      icon: <FileText className="w-4 h-4" />,
      description: "Smaller proofs reduce on-chain storage costs and bandwidth. Critical for L1 verification costs.",
      tooltip: "The size of the cryptographic proof in bytes or kilobytes"
    },
    verificationTime: {
      label: "Verification Time",
      icon: <Zap className="w-4 h-4" />,
      description: "Faster verification enables higher throughput. Essential for scalable L2 solutions.",
      tooltip: "Time complexity for verifying a proof"
    },
    trustedSetup: {
      label: "No Trusted Setup",
      icon: <Shield className="w-4 h-4" />,
      description: "Avoiding trusted setup eliminates ceremony risks and enables transparency.",
      tooltip: "Whether the system requires a trusted setup ceremony"
    },
  };

  return (
    <div
      id="zkp-widget"
      className={cn(
        "brutalist-card overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="bg-primary p-5 border-b-2 border-charcoal">
        <h5 className="font-bold text-white text-lg mb-1">Zero-Knowledge Proof Comparison</h5>
        <p className="text-sm text-white/80">
          Adjust the importance sliders to see which ZKP technology best fits your requirements
        </p>
      </div>

      <div className="p-6">
        {/* Importance Sliders */}
        <div className="grid gap-6 mb-8">
          {(Object.keys(axisInfo) as Array<keyof typeof axisInfo>).map((axis) => (
            <div
              key={axis}
              className="group"
              onMouseEnter={() => setHoveredAxis(axis)}
              onMouseLeave={() => setHoveredAxis(null)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-primary">{axisInfo[axis].icon}</span>
                  <span className="font-semibold text-charcoal text-sm">
                    {axisInfo[axis].label}
                  </span>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    title={axisInfo[axis].tooltip}
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="font-mono text-sm text-primary font-semibold bg-primary/10 px-2 py-0.5 border border-primary/20">
                  {weights[axis]}%
                </span>
              </div>
              <Slider
                value={[weights[axis]]}
                onValueChange={(value) => handleWeightChange(axis, value)}
                max={100}
                min={0}
                step={1}
                className="cursor-pointer"
              />
              {hoveredAxis === axis && (
                <p className="mt-2 text-xs text-muted-foreground animate-in fade-in slide-in-from-top-1 duration-200">
                  {axisInfo[axis].description}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Recommendation Banner */}
        <div
          className="p-4 mb-6 border-2 border-charcoal transition-colors duration-300"
          style={{ backgroundColor: `${bestChoice.data.color}15` }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 flex-shrink-0"
              style={{ backgroundColor: bestChoice.data.color }}
            />
            <div className="flex-1">
              <span className="text-sm text-muted-foreground">Recommended for your priorities:</span>
              <span className="ml-2 font-bold text-charcoal">{bestChoice.name}</span>
            </div>
            <div
              className="px-3 py-1 font-mono text-sm font-bold text-white"
              style={{ backgroundColor: bestChoice.data.color }}
            >
              {bestChoice.score}%
            </div>
          </div>
        </div>

        {/* ZKP Cards */}
        <div className="space-y-3">
          {scores.map(({ name, score, data }, index) => {
            const isExpanded = expandedCard === name;
            const isRecommended = index === 0;

            return (
              <div
                key={name}
                className={cn(
                  "border-2 border-charcoal bg-card transition-all duration-200",
                  isRecommended && "shadow-[4px_4px_0_#1A1A2E]",
                )}
              >
                {/* Card Header */}
                <button
                  type="button"
                  onClick={() => setExpandedCard(isExpanded ? null : name)}
                  className="w-full p-4 flex items-center gap-4 cursor-pointer hover:bg-warm-gray/50 transition-colors"
                >
                  {/* Rank & Color */}
                  <div className="flex items-center gap-3">
                    <span
                      className="w-8 h-8 flex items-center justify-center font-bold text-white text-sm"
                      style={{ backgroundColor: data.color }}
                    >
                      {index + 1}
                    </span>
                  </div>

                  {/* Name & Score Bar */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-charcoal">{name}</span>
                      <span className="font-mono text-sm text-charcoal">{score}%</span>
                    </div>
                    <div className="h-2 bg-warm-gray border border-border overflow-hidden">
                      <div
                        className="h-full transition-all duration-500 ease-out"
                        style={{
                          width: `${score}%`,
                          backgroundColor: data.color,
                        }}
                      />
                    </div>
                  </div>

                  {/* Expand Icon */}
                  <div className="text-muted-foreground">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-border animate-in slide-in-from-top-2 duration-200">
                    <p className="text-sm text-muted-foreground mt-4 mb-4">
                      {data.description}
                    </p>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="p-3 bg-warm-gray border border-border">
                        <div className="flex items-center gap-1.5 mb-1">
                          <FileText className="w-3.5 h-3.5 text-primary" />
                          <span className="text-xs text-muted-foreground">Proof Size</span>
                        </div>
                        <div className="font-mono font-bold text-charcoal">
                          {data.proofSize.value} {data.proofSize.unit}
                        </div>
                      </div>
                      <div className="p-3 bg-warm-gray border border-border">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Zap className="w-3.5 h-3.5 text-primary" />
                          <span className="text-xs text-muted-foreground">Verification</span>
                        </div>
                        <div className="font-mono font-bold text-charcoal">
                          {data.verificationTime.value}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {data.verificationTime.complexity}
                        </div>
                      </div>
                      <div className="p-3 bg-warm-gray border border-border">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Shield className="w-3.5 h-3.5 text-primary" />
                          <span className="text-xs text-muted-foreground">Trusted Setup</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {data.trustedSetup.required ? (
                            <>
                              <X className="w-4 h-4 text-red-500" />
                              <span className="font-semibold text-red-600 text-sm">Required</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4 text-green-600" />
                              <span className="font-semibold text-green-600 text-sm">Not Required</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Use Cases */}
                    <div className="mb-4">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                        Primary Use Cases
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {data.useCases.map((useCase) => (
                          <span
                            key={useCase}
                            className="px-2 py-1 text-xs bg-card border border-charcoal text-charcoal"
                          >
                            {useCase}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Quantum Resistance Badge */}
                    <div className="flex items-center gap-2">
                      {data.quantumResistant ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 border border-green-300">
                          <Shield className="w-3 h-3" />
                          Quantum Resistant
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-300">
                          <Shield className="w-3 h-3" />
                          Not Quantum Resistant
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Triangular Trade-off Visualization */}
        <div className="mt-8 p-4 bg-warm-gray border-2 border-charcoal">
          <h6 className="font-semibold text-charcoal text-sm mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-primary" />
            Trade-off Visualization
          </h6>
          <TriangularPlot scores={scores} weights={weights} />
        </div>
      </div>
    </div>
  );
}

// Triangular/Radar visualization component
function TriangularPlot({
  scores,
  weights,
}: {
  scores: Array<{ name: ZKPType; score: number; data: typeof zkpTypes[ZKPType] }>;
  weights: WeightState;
}) {
  const size = 240;
  const center = size / 2;
  const radius = size * 0.4;

  // Three vertices of the triangle (top, bottom-left, bottom-right)
  const vertices = [
    { x: center, y: center - radius, label: "Proof Size" },
    { x: center - radius * 0.866, y: center + radius * 0.5, label: "Verification" },
    { x: center + radius * 0.866, y: center + radius * 0.5, label: "No Setup" },
  ];

  // Calculate point position based on weights
  const getPointForZKP = (data: typeof zkpTypes[ZKPType]) => {
    const scores = [
      data.proofSize.score / 100,
      data.verificationTime.score / 100,
      data.trustedSetup.score / 100,
    ];

    const avgRadius = radius * 0.85;
    let x = center;
    let y = center;

    vertices.forEach((vertex, i) => {
      const weight = scores[i];
      x += (vertex.x - center) * weight * 0.8;
      y += (vertex.y - center) * weight * 0.8;
    });

    return { x, y };
  };

  return (
    <div className="flex justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Background triangle */}
        <polygon
          points={vertices.map(v => `${v.x},${v.y}`).join(' ')}
          fill="transparent"
          stroke="#E2E1DE"
          strokeWidth="2"
        />

        {/* Inner guide triangles */}
        {[0.33, 0.66].map((scale) => (
          <polygon
            key={scale}
            points={vertices.map(v => {
              const x = center + (v.x - center) * scale;
              const y = center + (v.y - center) * scale;
              return `${x},${y}`;
            }).join(' ')}
            fill="transparent"
            stroke="#E2E1DE"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}

        {/* Axis lines */}
        {vertices.map((vertex, i) => (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={vertex.x}
            y2={vertex.y}
            stroke="#E2E1DE"
            strokeWidth="1"
          />
        ))}

        {/* ZKP Points */}
        {scores.map(({ name, data }) => {
          const point = getPointForZKP(data);
          return (
            <g key={name}>
              <circle
                cx={point.x}
                cy={point.y}
                r={10}
                fill={data.color}
                stroke="#1A1A2E"
                strokeWidth="2"
              />
              <text
                x={point.x}
                y={point.y + 24}
                textAnchor="middle"
                className="text-[10px] font-semibold fill-charcoal"
              >
                {name.replace("ZK-", "")}
              </text>
            </g>
          );
        })}

        {/* Vertex Labels */}
        {vertices.map((vertex, i) => {
          const offset = 20;
          const labelX = vertex.x + (vertex.x - center) * 0.15;
          const labelY = vertex.y + (vertex.y - center) * 0.15 + (i === 0 ? -5 : 10);
          return (
            <text
              key={i}
              x={labelX}
              y={labelY}
              textAnchor="middle"
              className="text-[11px] font-semibold fill-primary"
            >
              {vertex.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
