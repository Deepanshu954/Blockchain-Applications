"use client";

import React from "react"

import { useState, useEffect, useRef } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { cn } from "@/lib/utils";
import { TrendingUp, Globe2, Info } from "lucide-react";

// GeoJSON URL for world map
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// DeFi TVL data from 2022 to 2025 (in billions)
const defiTvlData = [
  { year: "2022 Q1", tvl: 180, label: "Q1 2022" },
  { year: "2022 Q2", tvl: 75, label: "Q2 2022" },
  { year: "2022 Q3", tvl: 55, label: "Q3 2022" },
  { year: "2022 Q4", tvl: 42, label: "Q4 2022" },
  { year: "2023 Q1", tvl: 50, label: "Q1 2023" },
  { year: "2023 Q2", tvl: 45, label: "Q2 2023" },
  { year: "2023 Q3", tvl: 40, label: "Q3 2023" },
  { year: "2023 Q4", tvl: 52, label: "Q4 2023" },
  { year: "2024 Q1", tvl: 85, label: "Q1 2024" },
  { year: "2024 Q2", tvl: 95, label: "Q2 2024" },
  { year: "2024 Q3", tvl: 80, label: "Q3 2024" },
  { year: "2024 Q4", tvl: 100, label: "Q4 2024" },
  { year: "2025 Q1", tvl: 112, label: "Q1 2025" },
];

// CBDC data with countries, status, and coordinates
const cbdcData = [
  {
    id: "bahamas",
    country: "The Bahamas",
    name: "Sand Dollar",
    status: "Launched",
    year: 2020,
    coordinates: [-77.35, 25.03] as [number, number],
    details: "World's first retail CBDC. Fully operational across all islands.",
    population: "400K+",
  },
  {
    id: "jamaica",
    country: "Jamaica",
    name: "JAM-DEX",
    status: "Launched",
    year: 2022,
    coordinates: [-77.3, 18.1] as [number, number],
    details: "Launched as legal tender in June 2022.",
    population: "3M+",
  },
  {
    id: "nigeria",
    country: "Nigeria",
    name: "eNaira",
    status: "Launched",
    year: 2021,
    coordinates: [8.68, 9.08] as [number, number],
    details: "Africa's first CBDC. Over 13 million wallet downloads.",
    population: "220M+",
  },
  {
    id: "china",
    country: "China",
    name: "Digital Yuan (e-CNY)",
    status: "Pilot",
    year: 2020,
    coordinates: [104.2, 35.86] as [number, number],
    details: "Extensive pilot program across 26+ cities. $250B+ in transactions.",
    population: "1.4B+",
  },
  {
    id: "sweden",
    country: "Sweden",
    name: "e-Krona",
    status: "Pilot",
    year: 2020,
    coordinates: [18.6, 60.1] as [number, number],
    details: "Extended pilot phase exploring technical solutions.",
    population: "10M+",
  },
  {
    id: "india",
    country: "India",
    name: "Digital Rupee",
    status: "Pilot",
    year: 2022,
    coordinates: [78.96, 20.59] as [number, number],
    details: "Wholesale and retail pilots across major banks.",
    population: "1.4B+",
  },
  {
    id: "eu",
    country: "European Union",
    name: "Digital Euro",
    status: "Development",
    year: 2023,
    coordinates: [10.45, 51.16] as [number, number],
    details: "Preparation phase began October 2023. Expected by 2027.",
    population: "450M+",
  },
  {
    id: "brazil",
    country: "Brazil",
    name: "Drex",
    status: "Pilot",
    year: 2023,
    coordinates: [-51.93, -14.24] as [number, number],
    details: "Pilot launched in 2023 with focus on smart contracts.",
    population: "215M+",
  },
  {
    id: "russia",
    country: "Russia",
    name: "Digital Ruble",
    status: "Pilot",
    year: 2023,
    coordinates: [105.32, 61.52] as [number, number],
    details: "Pilot with 13 banks began August 2023.",
    population: "144M+",
  },
  {
    id: "australia",
    country: "Australia",
    name: "eAUD",
    status: "Research",
    year: 2023,
    coordinates: [133.78, -25.27] as [number, number],
    details: "Research pilot completed. Evaluating next steps.",
    population: "26M+",
  },
];

// Status colors matching the theme
const statusColors: Record<string, { bg: string; text: string; marker: string }> = {
  Launched: { bg: "#22C55E", text: "#166534", marker: "#22C55E" },
  Pilot: { bg: "#4169E1", text: "#1E3A8A", marker: "#4169E1" },
  Development: { bg: "#F59E0B", text: "#92400E", marker: "#F59E0B" },
  Research: { bg: "#64748B", text: "#334155", marker: "#64748B" },
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: { label: string } }>;
}

function ChartTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-charcoal text-white px-3 py-2 text-sm brutalist-border border-charcoal">
        <p className="font-semibold">{payload[0].payload.label}</p>
        <p className="text-royal-blue-light font-mono">
          ${payload[0].value}B TVL
        </p>
      </div>
    );
  }
  return null;
}

interface CBDCTooltipProps {
  cbdc: typeof cbdcData[0] | null;
  position: { x: number; y: number };
}

function CBDCTooltip({ cbdc, position }: CBDCTooltipProps) {
  if (!cbdc) return null;

  const status = statusColors[cbdc.status];

  return (
    <div
      className="absolute z-50 pointer-events-none transition-all duration-150"
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -100%) translateY(-12px)",
      }}
    >
      <div className="bg-card brutalist-border p-4 min-w-[240px] max-w-[280px]">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h6 className="font-bold text-charcoal">{cbdc.country}</h6>
            <p className="text-sm font-mono text-primary">{cbdc.name}</p>
          </div>
          <span
            className="px-2 py-0.5 text-xs font-semibold"
            style={{ backgroundColor: status.bg, color: "#fff" }}
          >
            {cbdc.status}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-2">{cbdc.details}</p>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-muted-foreground">
            Since <strong className="text-charcoal">{cbdc.year}</strong>
          </span>
          <span className="text-muted-foreground">
            Pop: <strong className="text-charcoal">{cbdc.population}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}

export function DeFiGrowthAndCBDCMapWidget({ className }: { className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedData, setAnimatedData] = useState<typeof defiTvlData>([]);
  const [hoveredCbdc, setHoveredCbdc] = useState<typeof cbdcData[0] | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState<"chart" | "map">("chart");
  const containerRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Intersection observer for visibility
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

  // Animate chart data on visibility
  useEffect(() => {
    if (isVisible) {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < defiTvlData.length) {
          setAnimatedData(defiTvlData.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 120);

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const handleMarkerHover = (cbdc: typeof cbdcData[0], event: React.MouseEvent) => {
    if (mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    }
    setHoveredCbdc(cbdc);
  };

  // Calculate statistics
  const launchedCount = cbdcData.filter((c) => c.status === "Launched").length;
  const pilotCount = cbdcData.filter((c) => c.status === "Pilot").length;
  const totalPopulation = "3.9B+";

  return (
    <div
      ref={containerRef}
      className={cn(
        "brutalist-card overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 md:p-6 border-b-2 border-charcoal bg-card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h5 className="font-bold text-charcoal flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              DeFi Growth & CBDC Global Adoption
            </h5>
            <p className="text-sm text-muted-foreground mt-1">
              Decentralized finance total value locked and central bank digital currency initiatives
            </p>
          </div>
          {/* Tab switcher for mobile */}
          <div className="flex md:hidden border-2 border-charcoal">
            <button
              onClick={() => setActiveTab("chart")}
              className={cn(
                "px-4 py-2 text-sm font-semibold transition-colors cursor-pointer",
                activeTab === "chart"
                  ? "bg-primary text-white"
                  : "bg-card text-charcoal hover:bg-warm-gray"
              )}
            >
              DeFi TVL
            </button>
            <button
              onClick={() => setActiveTab("map")}
              className={cn(
                "px-4 py-2 text-sm font-semibold border-l-2 border-charcoal transition-colors cursor-pointer",
                activeTab === "map"
                  ? "bg-primary text-white"
                  : "bg-card text-charcoal hover:bg-warm-gray"
              )}
            >
              CBDC Map
            </button>
          </div>
        </div>
      </div>

      {/* Content panels */}
      <div className="grid md:grid-cols-2">
        {/* Left Panel: DeFi TVL Chart */}
        <div
          className={cn(
            "p-4 md:p-6 border-r-0 md:border-r-2 border-charcoal bg-card",
            activeTab !== "chart" && "hidden md:block"
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                Total Value Locked
              </p>
              <p className="text-3xl font-bold text-charcoal">
                $112B
                <span className="text-sm font-normal text-green-600 ml-2">
                  +21.3% YTD
                </span>
              </p>
            </div>
            <div className="relative group">
              <Info className="w-4 h-4 text-muted-foreground cursor-pointer" />
              <div className="absolute right-0 top-6 z-10 hidden group-hover:block bg-charcoal text-white text-xs p-2 w-48 brutalist-border border-charcoal">
                DeFi TVL represents the total value of crypto assets deposited in decentralized protocols.
              </div>
            </div>
          </div>

          <div className="h-[280px] md:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={animatedData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="tvlGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4169E1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4169E1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 10, fill: "#64748B" }}
                  tickLine={false}
                  axisLine={{ stroke: "#E2E1DE" }}
                  interval={2}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#64748B" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}B`}
                  domain={[0, 200]}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ fill: "rgba(65, 105, 225, 0.1)" }}
                />
                <ReferenceLine
                  y={24}
                  stroke="#22C55E"
                  strokeDasharray="4 4"
                  label={{
                    value: "21.3% Share",
                    position: "right",
                    fontSize: 10,
                    fill: "#22C55E",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="tvl"
                  stroke="#4169E1"
                  strokeWidth={2}
                  fill="url(#tvlGradient)"
                  animationDuration={300}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Chart legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-primary" />
              <span className="text-muted-foreground">DeFi TVL (Billions USD)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-0.5 border-t-2 border-dashed border-green-500" />
              <span className="text-muted-foreground">21.3% Market Share</span>
            </div>
          </div>
        </div>

        {/* Right Panel: CBDC World Map */}
        <div
          ref={mapContainerRef}
          className={cn(
            "relative p-4 md:p-6 bg-warm-gray",
            activeTab !== "map" && "hidden md:block"
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                CBDC Initiatives
              </p>
              <p className="text-xl font-bold text-charcoal">
                {cbdcData.length} Countries
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  covering {totalPopulation} people
                </span>
              </p>
            </div>
            <Globe2 className="w-5 h-5 text-primary" />
          </div>

          {/* Map */}
          <div className="h-[280px] md:h-[280px] border-2 border-charcoal bg-card overflow-hidden">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 100,
                center: [10, 30],
              }}
              style={{ width: "100%", height: "100%" }}
            >
              <ZoomableGroup zoom={1} center={[10, 30]}>
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill="#E2E1DE"
                        stroke="#FAF9F6"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none" },
                          hover: { outline: "none", fill: "#D1D5DB" },
                          pressed: { outline: "none" },
                        }}
                      />
                    ))
                  }
                </Geographies>

                {/* CBDC Markers */}
                {cbdcData.map((cbdc) => (
                  <Marker
                    key={cbdc.id}
                    coordinates={cbdc.coordinates}
                    onMouseEnter={(e) => handleMarkerHover(cbdc, e as unknown as React.MouseEvent)}
                    onMouseLeave={() => setHoveredCbdc(null)}
                  >
                    <circle
                      r={6}
                      fill={statusColors[cbdc.status].marker}
                      stroke="#1A1A2E"
                      strokeWidth={1.5}
                      style={{ cursor: "pointer" }}
                      className="transition-transform hover:scale-150"
                    />
                    {cbdc.status === "Launched" && (
                      <circle
                        r={10}
                        fill="none"
                        stroke={statusColors[cbdc.status].marker}
                        strokeWidth={1}
                        opacity={0.5}
                      />
                    )}
                  </Marker>
                ))}
              </ZoomableGroup>
            </ComposableMap>
          </div>

          {/* CBDC Tooltip */}
          <CBDCTooltip cbdc={hoveredCbdc} position={tooltipPosition} />

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            {Object.entries(statusColors).map(([status, colors]) => {
              const count = cbdcData.filter((c) => c.status === status).length;
              return (
                <div key={status} className="flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded-full border border-charcoal"
                    style={{ backgroundColor: colors.marker }}
                  />
                  <span className="text-muted-foreground">
                    {status} ({count})
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-t-2 border-charcoal">
        <div className="p-3 md:p-4 text-center border-r-2 border-charcoal bg-card">
          <p className="text-lg md:text-xl font-bold text-primary">$112B</p>
          <p className="text-xs text-muted-foreground">Current DeFi TVL</p>
        </div>
        <div className="p-3 md:p-4 text-center md:border-r-2 border-charcoal bg-card">
          <p className="text-lg md:text-xl font-bold text-green-600">{launchedCount}</p>
          <p className="text-xs text-muted-foreground">CBDCs Launched</p>
        </div>
        <div className="p-3 md:p-4 text-center border-r-2 border-t-2 md:border-t-0 border-charcoal bg-card">
          <p className="text-lg md:text-xl font-bold text-primary">{pilotCount}</p>
          <p className="text-xs text-muted-foreground">In Pilot Phase</p>
        </div>
        <div className="p-3 md:p-4 text-center border-t-2 md:border-t-0 border-charcoal bg-card">
          <p className="text-lg md:text-xl font-bold text-charcoal">{totalPopulation}</p>
          <p className="text-xs text-muted-foreground">Population Covered</p>
        </div>
      </div>
    </div>
  );
}
