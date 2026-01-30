"use client";

import React from "react"

import { useState, useMemo, useRef, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Shield,
  Wifi,
  WifiOff,
  Lock,
  Unlock,
  Cpu,
  Building2,
  Users,
  Calendar,
  MapPin,
  Info,
} from "lucide-react";

// CBDC Status Types
type CBDCStatus = "launched" | "pilot" | "research" | "inactive";

interface CountryData {
  name: string;
  iso: string;
  status: CBDCStatus;
  cbdcName?: string;
  launchDate?: string;
  population?: string;
  details?: string;
  consensus?: string;
  privacyModel?: string;
  offlineCapable?: boolean;
}

interface TimelineEvent {
  id: string;
  year: number;
  month: number;
  title: string;
  country: string;
  description: string;
  icon: "launch" | "pilot" | "research";
  technicalSpecs: {
    consensus: string;
    privacyModel: string;
    offlineCapable: boolean;
    platform: string;
    scalability: string;
  };
}

// Comprehensive CBDC data based on actual central bank research
const cbdcData: CountryData[] = [
  // Launched
  { name: "Bahamas", iso: "BHS", status: "launched", cbdcName: "Sand Dollar", launchDate: "Oct 2020", population: "400K", details: "World's first CBDC launch", consensus: "Permissioned DLT", privacyModel: "Tiered KYC", offlineCapable: true },
  { name: "Nigeria", iso: "NGA", status: "launched", cbdcName: "eNaira", launchDate: "Oct 2021", population: "220M", details: "Africa's first CBDC", consensus: "Hyperledger Fabric", privacyModel: "Full KYC", offlineCapable: false },
  { name: "Jamaica", iso: "JAM", status: "launched", cbdcName: "JAM-DEX", launchDate: "Jun 2022", population: "3M", details: "Caribbean region leader", consensus: "Permissioned DLT", privacyModel: "Tiered Privacy", offlineCapable: true },
  { name: "Eastern Caribbean", iso: "ATG", status: "launched", cbdcName: "DCash", launchDate: "Mar 2021", population: "600K", details: "Multi-nation CBDC", consensus: "Permissioned DLT", privacyModel: "Tiered KYC", offlineCapable: true },
  
  // Pilot Programs
  { name: "China", iso: "CHN", status: "pilot", cbdcName: "e-CNY (Digital Yuan)", launchDate: "2019 (pilot)", population: "1.4B", details: "Largest pilot program globally, testing in 26 cities", consensus: "Centralized with DLT elements", privacyModel: "Managed Anonymity", offlineCapable: true },
  { name: "India", iso: "IND", status: "pilot", cbdcName: "Digital Rupee", launchDate: "Dec 2022 (pilot)", population: "1.4B", details: "Testing retail and wholesale variants", consensus: "Permissioned DLT", privacyModel: "Tiered KYC", offlineCapable: true },
  { name: "Russia", iso: "RUS", status: "pilot", cbdcName: "Digital Ruble", launchDate: "Aug 2023 (pilot)", population: "144M", details: "Testing with major banks", consensus: "Hybrid Architecture", privacyModel: "Full KYC", offlineCapable: true },
  { name: "Sweden", iso: "SWE", status: "pilot", cbdcName: "e-Krona", launchDate: "2020 (pilot)", population: "10M", details: "Testing cashless society transition", consensus: "R3 Corda", privacyModel: "Privacy-Preserving", offlineCapable: true },
  { name: "South Korea", iso: "KOR", status: "pilot", cbdcName: "Digital Won", launchDate: "2021 (pilot)", population: "52M", details: "Focus on cross-border payments", consensus: "Permissioned DLT", privacyModel: "Privacy-Enhanced", offlineCapable: true },
  { name: "Thailand", iso: "THA", status: "pilot", cbdcName: "Digital Baht", launchDate: "2022 (pilot)", population: "70M", details: "Project mBridge participant", consensus: "Permissioned DLT", privacyModel: "Tiered Privacy", offlineCapable: false },
  { name: "Saudi Arabia", iso: "SAU", status: "pilot", cbdcName: "Project Aber", launchDate: "2019 (pilot)", population: "35M", details: "Joint pilot with UAE", consensus: "Hyperledger Fabric", privacyModel: "Institutional Privacy", offlineCapable: false },
  { name: "United Arab Emirates", iso: "ARE", status: "pilot", cbdcName: "Digital Dirham", launchDate: "2019 (pilot)", population: "10M", details: "Focus on wholesale CBDC", consensus: "Hyperledger Fabric", privacyModel: "Wholesale Privacy", offlineCapable: false },
  { name: "South Africa", iso: "ZAF", status: "pilot", cbdcName: "Project Khokha", launchDate: "2018 (pilot)", population: "60M", details: "Wholesale interbank settlement", consensus: "Quorum", privacyModel: "Institutional", offlineCapable: false },
  { name: "Singapore", iso: "SGP", status: "pilot", cbdcName: "Project Ubin/Orchid", launchDate: "2016 (pilot)", population: "6M", details: "Multi-phase wholesale CBDC", consensus: "Multiple tested", privacyModel: "Privacy-Preserving", offlineCapable: false },
  { name: "Hong Kong", iso: "HKG", status: "pilot", cbdcName: "e-HKD", launchDate: "2022 (pilot)", population: "7.5M", details: "Retail CBDC exploration", consensus: "Permissioned DLT", privacyModel: "Tiered KYC", offlineCapable: true },
  { name: "Kazakhstan", iso: "KAZ", status: "pilot", cbdcName: "Digital Tenge", launchDate: "2023 (pilot)", population: "19M", details: "Testing programmable money", consensus: "Permissioned DLT", privacyModel: "Hybrid", offlineCapable: true },
  { name: "Iran", iso: "IRN", status: "pilot", cbdcName: "Crypto-Rial", launchDate: "2022 (pilot)", population: "88M", details: "Sanctions evasion concerns", consensus: "Permissioned", privacyModel: "Full KYC", offlineCapable: false },
  { name: "Brazil", iso: "BRA", status: "pilot", cbdcName: "DREX (Digital Real)", launchDate: "2024 (pilot)", population: "215M", details: "Testing with financial institutions", consensus: "Hyperledger Besu", privacyModel: "Privacy-Preserving", offlineCapable: false },
  { name: "Australia", iso: "AUS", status: "pilot", cbdcName: "eAUD", launchDate: "2023 (pilot)", population: "26M", details: "Testing with industry partners", consensus: "Permissioned DLT", privacyModel: "Tiered Privacy", offlineCapable: false },

  // Active Research
  { name: "United States", iso: "USA", status: "research", details: "Extensive research through Fed, MIT Digital Currency Initiative", population: "335M" },
  { name: "European Union", iso: "DEU", status: "research", cbdcName: "Digital Euro", details: "ECB investigation phase ongoing", population: "450M" },
  { name: "France", iso: "FRA", status: "research", details: "Part of Digital Euro project", population: "68M" },
  { name: "Italy", iso: "ITA", status: "research", details: "Part of Digital Euro project", population: "59M" },
  { name: "Spain", iso: "ESP", status: "research", details: "Part of Digital Euro project", population: "47M" },
  { name: "Netherlands", iso: "NLD", status: "research", details: "Part of Digital Euro project", population: "17M" },
  { name: "Belgium", iso: "BEL", status: "research", details: "Part of Digital Euro project", population: "12M" },
  { name: "Austria", iso: "AUT", status: "research", details: "Part of Digital Euro project", population: "9M" },
  { name: "Portugal", iso: "PRT", status: "research", details: "Part of Digital Euro project", population: "10M" },
  { name: "Greece", iso: "GRC", status: "research", details: "Part of Digital Euro project", population: "10M" },
  { name: "Ireland", iso: "IRL", status: "research", details: "Part of Digital Euro project", population: "5M" },
  { name: "Finland", iso: "FIN", status: "research", details: "Part of Digital Euro project", population: "5.5M" },
  { name: "United Kingdom", iso: "GBR", status: "research", cbdcName: "Digital Pound (Britcoin)", details: "Bank of England design phase", population: "67M" },
  { name: "Japan", iso: "JPN", status: "research", cbdcName: "Digital Yen", details: "BoJ conducting experiments", population: "125M" },
  { name: "Canada", iso: "CAN", status: "research", details: "Bank of Canada contingency planning", population: "40M" },
  { name: "Switzerland", iso: "CHE", status: "research", cbdcName: "Wholesale CBDC", details: "SNB Project Helvetia", population: "9M" },
  { name: "Norway", iso: "NOR", status: "research", details: "Norges Bank testing phases", population: "5.5M" },
  { name: "Denmark", iso: "DNK", status: "research", details: "Danmarks Nationalbank research", population: "6M" },
  { name: "Israel", iso: "ISR", status: "research", cbdcName: "Digital Shekel", details: "Bank of Israel pilot preparation", population: "9.5M" },
  { name: "Turkey", iso: "TUR", status: "research", cbdcName: "Digital Lira", details: "CBRT research ongoing", population: "85M" },
  { name: "Indonesia", iso: "IDN", status: "research", cbdcName: "Digital Rupiah", details: "Bank Indonesia research", population: "275M" },
  { name: "Malaysia", iso: "MYS", status: "research", details: "Bank Negara exploration", population: "33M" },
  { name: "Philippines", iso: "PHL", status: "research", details: "BSP wholesale CBDC study", population: "115M" },
  { name: "Vietnam", iso: "VNM", status: "research", details: "SBV initial research", population: "100M" },
  { name: "Pakistan", iso: "PAK", status: "research", details: "SBP feasibility study", population: "230M" },
  { name: "Bangladesh", iso: "BGD", status: "research", details: "Bangladesh Bank exploration", population: "170M" },
  { name: "Egypt", iso: "EGY", status: "research", details: "CBE research phase", population: "105M" },
  { name: "Kenya", iso: "KEN", status: "research", details: "CBK exploring options", population: "55M" },
  { name: "Ghana", iso: "GHA", status: "research", cbdcName: "e-Cedi", details: "Bank of Ghana pilot planned", population: "33M" },
  { name: "Morocco", iso: "MAR", status: "research", details: "Bank Al-Maghrib study", population: "37M" },
  { name: "Mexico", iso: "MEX", status: "research", details: "Banxico research ongoing", population: "130M" },
  { name: "Argentina", iso: "ARG", status: "research", details: "BCRA initial exploration", population: "46M" },
  { name: "Colombia", iso: "COL", status: "research", details: "BanRep feasibility study", population: "52M" },
  { name: "Chile", iso: "CHL", status: "research", details: "BCCh research phase", population: "19M" },
  { name: "Peru", iso: "PER", status: "research", details: "BCRP exploration", population: "34M" },
  { name: "New Zealand", iso: "NZL", status: "research", details: "RBNZ future of money project", population: "5M" },
  { name: "Poland", iso: "POL", status: "research", details: "NBP research ongoing", population: "38M" },
  { name: "Czech Republic", iso: "CZE", status: "research", details: "CNB exploration", population: "10.5M" },
  { name: "Romania", iso: "ROU", status: "research", details: "BNR initial research", population: "19M" },
  { name: "Hungary", iso: "HUN", status: "research", details: "MNB research phase", population: "10M" },
  { name: "Ukraine", iso: "UKR", status: "research", cbdcName: "e-Hryvnia", details: "NBU pilot project", population: "43M" },
];

// Timeline events
const timelineEvents: TimelineEvent[] = [
  {
    id: "sand-dollar",
    year: 2020,
    month: 10,
    title: "Sand Dollar Launch",
    country: "Bahamas",
    description: "World's first retail CBDC goes live, serving 400,000 citizens across 700 islands with offline payment capability.",
    icon: "launch",
    technicalSpecs: {
      consensus: "Permissioned NZIA DLT",
      privacyModel: "Tiered KYC with wallet limits",
      offlineCapable: true,
      platform: "NZIA Cortex",
      scalability: "Low volume, island-scale",
    },
  },
  {
    id: "dcash",
    year: 2021,
    month: 3,
    title: "DCash Pilot",
    country: "Eastern Caribbean",
    description: "Multi-nation CBDC pilot launches across 8 countries, demonstrating cross-border CBDC interoperability.",
    icon: "pilot",
    technicalSpecs: {
      consensus: "Permissioned DLT",
      privacyModel: "Tiered wallet system",
      offlineCapable: true,
      platform: "Bitt Inc. Platform",
      scalability: "Regional scale",
    },
  },
  {
    id: "e-cny",
    year: 2021,
    month: 6,
    title: "e-CNY Expansion",
    country: "China",
    description: "Digital Yuan pilot expands to 26 cities with 260M users, testing programmable money and smart contracts.",
    icon: "pilot",
    technicalSpecs: {
      consensus: "Centralized with DLT features",
      privacyModel: "Managed Anonymity (小额匿名, 大额追踪)",
      offlineCapable: true,
      platform: "PBoC Custom Infrastructure",
      scalability: "Billion-user scale design",
    },
  },
  {
    id: "e-naira",
    year: 2021,
    month: 10,
    title: "eNaira Launch",
    country: "Nigeria",
    description: "Africa's first CBDC launches to serve 220M population, targeting financial inclusion for 36M unbanked.",
    icon: "launch",
    technicalSpecs: {
      consensus: "Hyperledger Fabric",
      privacyModel: "Full KYC Required",
      offlineCapable: false,
      platform: "Bitt Inc. Platform",
      scalability: "National scale",
    },
  },
  {
    id: "digital-rupee",
    year: 2022,
    month: 12,
    title: "Digital Rupee Pilot",
    country: "India",
    description: "RBI launches wholesale and retail CBDC pilots with major banks, testing both government and consumer use cases.",
    icon: "pilot",
    technicalSpecs: {
      consensus: "Permissioned Blockchain",
      privacyModel: "Tiered KYC System",
      offlineCapable: true,
      platform: "RBI Custom DLT",
      scalability: "1.4B population target",
    },
  },
  {
    id: "jam-dex",
    year: 2022,
    month: 6,
    title: "JAM-DEX Launch",
    country: "Jamaica",
    description: "Bank of Jamaica launches JAM-DEX as legal tender, achieving 95% merchant acceptance in pilot areas.",
    icon: "launch",
    technicalSpecs: {
      consensus: "Permissioned DLT",
      privacyModel: "Tiered Privacy Levels",
      offlineCapable: true,
      platform: "eCurrency Mint",
      scalability: "National scale",
    },
  },
  {
    id: "digital-ruble",
    year: 2023,
    month: 8,
    title: "Digital Ruble Pilot",
    country: "Russia",
    description: "CBR begins real-transaction pilot with 13 banks, testing programmable payments and government disbursements.",
    icon: "pilot",
    technicalSpecs: {
      consensus: "Hybrid Architecture",
      privacyModel: "Full KYC with Transaction Limits",
      offlineCapable: true,
      platform: "CBR Custom Platform",
      scalability: "National scale",
    },
  },
  {
    id: "drex",
    year: 2024,
    month: 3,
    title: "DREX Pilot Launch",
    country: "Brazil",
    description: "Central Bank of Brazil launches DREX pilot with privacy-preserving smart contracts for tokenized assets.",
    icon: "pilot",
    technicalSpecs: {
      consensus: "Hyperledger Besu",
      privacyModel: "Zero-Knowledge Proofs",
      offlineCapable: false,
      platform: "Hyperledger Besu + ZK",
      scalability: "215M population target",
    },
  },
];

// Geographic data URL
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Country name to ISO mapping for react-simple-maps
const countryNameToData: Record<string, CountryData> = {};
cbdcData.forEach((c) => {
  countryNameToData[c.name] = c;
});

// Map country names from topojson to our data
const geoNameMapping: Record<string, string> = {
  "United States of America": "United States",
  "Republic of Korea": "South Korea",
  "Dem. Rep. Korea": "North Korea",
  "Czechia": "Czech Republic",
  "Russia": "Russia",
  "China": "China",
  "India": "India",
  "Brazil": "Brazil",
  "Germany": "European Union",
  "France": "France",
  "Italy": "Italy",
  "Spain": "Spain",
  "Netherlands": "Netherlands",
  "Belgium": "Belgium",
  "Austria": "Austria",
  "Portugal": "Portugal",
  "Greece": "Greece",
  "Ireland": "Ireland",
  "Finland": "Finland",
  "United Kingdom": "United Kingdom",
  "Japan": "Japan",
  "Canada": "Canada",
  "Australia": "Australia",
  "Switzerland": "Switzerland",
  "Norway": "Norway",
  "Sweden": "Sweden",
  "Denmark": "Denmark",
  "Israel": "Israel",
  "Turkey": "Turkey",
  "S. Korea": "South Korea",
  "Thailand": "Thailand",
  "Saudi Arabia": "Saudi Arabia",
  "United Arab Emirates": "United Arab Emirates",
  "South Africa": "South Africa",
  "Singapore": "Singapore",
  "Indonesia": "Indonesia",
  "Malaysia": "Malaysia",
  "Philippines": "Philippines",
  "Vietnam": "Vietnam",
  "Pakistan": "Pakistan",
  "Bangladesh": "Bangladesh",
  "Egypt": "Egypt",
  "Kenya": "Kenya",
  "Ghana": "Ghana",
  "Morocco": "Morocco",
  "Mexico": "Mexico",
  "Argentina": "Argentina",
  "Colombia": "Colombia",
  "Chile": "Chile",
  "Peru": "Peru",
  "New Zealand": "New Zealand",
  "Poland": "Poland",
  "Romania": "Romania",
  "Hungary": "Hungary",
  "Ukraine": "Ukraine",
  "Nigeria": "Nigeria",
  "Jamaica": "Jamaica",
  "Bahamas": "Bahamas",
  "Hong Kong": "Hong Kong",
  "Kazakhstan": "Kazakhstan",
  "Iran": "Iran",
};

function getCountryData(geoName: string): CountryData | undefined {
  const mappedName = geoNameMapping[geoName] || geoName;
  return countryNameToData[mappedName];
}

// Status colors matching the brutalist theme
const statusColors: Record<CBDCStatus, string> = {
  launched: "#16A34A",
  pilot: "#4169E1",
  research: "#D97706",
  inactive: "#E8E8E3",
};

const statusLabels: Record<CBDCStatus, string> = {
  launched: "Launched",
  pilot: "Pilot Program",
  research: "Active Research",
  inactive: "No Activity",
};

// Country Detail Popup Component
function CountryPopup({
  country,
  onClose,
  position,
}: {
  country: CountryData;
  onClose: () => void;
  position: { x: number; y: number };
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute z-50 w-80 border-2 border-foreground bg-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      style={{
        left: Math.min(position.x, window.innerWidth - 340),
        top: position.y + 10,
      }}
    >
      <div className="flex items-center justify-between border-b-2 border-foreground bg-primary px-4 py-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary-foreground" />
          <span className="font-mono text-sm font-bold uppercase text-primary-foreground">
            {country.name}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-primary-foreground transition-colors hover:text-primary-foreground/80 cursor-pointer"
          aria-label="Close popup"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <span
            className="inline-block h-3 w-3"
            style={{ backgroundColor: statusColors[country.status] }}
          />
          <span className="font-mono text-xs uppercase tracking-wider">
            {statusLabels[country.status]}
          </span>
        </div>

        {country.cbdcName && (
          <div className="mb-3">
            <span className="font-mono text-xs text-muted-foreground">CBDC Name</span>
            <p className="font-bold">{country.cbdcName}</p>
          </div>
        )}

        {country.launchDate && (
          <div className="mb-3 flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{country.launchDate}</span>
          </div>
        )}

        {country.population && (
          <div className="mb-3 flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{country.population} population</span>
          </div>
        )}

        {country.details && (
          <p className="mt-3 text-sm text-muted-foreground">{country.details}</p>
        )}

        {(country.consensus || country.privacyModel || country.offlineCapable !== undefined) && (
          <div className="mt-4 border-t border-foreground/20 pt-3">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Technical Specs
            </span>
            <div className="mt-2 grid gap-2">
              {country.consensus && (
                <div className="flex items-center gap-2 text-xs">
                  <Cpu className="h-3 w-3 text-primary" />
                  <span>{country.consensus}</span>
                </div>
              )}
              {country.privacyModel && (
                <div className="flex items-center gap-2 text-xs">
                  <Lock className="h-3 w-3 text-primary" />
                  <span>{country.privacyModel}</span>
                </div>
              )}
              {country.offlineCapable !== undefined && (
                <div className="flex items-center gap-2 text-xs">
                  {country.offlineCapable ? (
                    <>
                      <WifiOff className="h-3 w-3 text-sentiment-good" />
                      <span>Offline Capable</span>
                    </>
                  ) : (
                    <>
                      <Wifi className="h-3 w-3 text-muted-foreground" />
                      <span>Online Only</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Timeline Node Component
function TimelineNode({
  event,
  isExpanded,
  onToggle,
}: {
  event: TimelineEvent;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const iconBgColor =
    event.icon === "launch"
      ? "#16A34A"
      : event.icon === "pilot"
        ? "#4169E1"
        : "#D97706";

  return (
    <div className="flex-shrink-0 w-72 md:w-80">
      <button
        onClick={onToggle}
        className={cn(
          "w-full border-2 border-foreground bg-background text-left transition-all cursor-pointer",
          isExpanded
            ? "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            : "shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        )}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{ backgroundColor: iconBgColor }}
        >
          <div className="flex h-8 w-8 items-center justify-center bg-white/20">
            {event.icon === "launch" ? (
              <Shield className="h-4 w-4 text-white" />
            ) : event.icon === "pilot" ? (
              <Building2 className="h-4 w-4 text-white" />
            ) : (
              <Info className="h-4 w-4 text-white" />
            )}
          </div>
          <div>
            <div className="font-mono text-xs text-white/80">
              {event.month}/{event.year}
            </div>
            <div className="font-bold text-white">{event.country}</div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h4 className="mb-2 font-bold">{event.title}</h4>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {event.description}
          </p>
        </div>
      </button>

      {/* Expanded Technical Specs */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-2 border-t-0 border-foreground bg-secondary p-4">
              <div className="mb-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Technical Architecture
              </div>

              <div className="grid gap-3">
                <div className="flex items-start gap-2">
                  <Cpu className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">Consensus</div>
                    <div className="text-sm font-medium">
                      {event.technicalSpecs.consensus}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  {event.technicalSpecs.privacyModel.includes("Zero") ? (
                    <Lock className="mt-0.5 h-4 w-4 text-sentiment-good" />
                  ) : (
                    <Unlock className="mt-0.5 h-4 w-4 text-primary" />
                  )}
                  <div>
                    <div className="text-xs text-muted-foreground">Privacy Model</div>
                    <div className="text-sm font-medium">
                      {event.technicalSpecs.privacyModel}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  {event.technicalSpecs.offlineCapable ? (
                    <WifiOff className="mt-0.5 h-4 w-4 text-sentiment-good" />
                  ) : (
                    <Wifi className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  )}
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Offline Capability
                    </div>
                    <div className="text-sm font-medium">
                      {event.technicalSpecs.offlineCapable
                        ? "Supported"
                        : "Not Supported"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Building2 className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">Platform</div>
                    <div className="text-sm font-medium">
                      {event.technicalSpecs.platform}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Users className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">Scalability</div>
                    <div className="text-sm font-medium">
                      {event.technicalSpecs.scalability}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Main Component
export function CBDCAdoptionMap() {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<CBDCStatus | "all">("all");
  const timelineRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Calculate stats
  const stats = useMemo(() => {
    const launched = cbdcData.filter((c) => c.status === "launched").length;
    const pilot = cbdcData.filter((c) => c.status === "pilot").length;
    const research = cbdcData.filter((c) => c.status === "research").length;
    const total = launched + pilot + research;
    return { launched, pilot, research, total };
  }, []);

  // Handle map click
  const handleCountryClick = (
    geo: { properties: { name: string } },
    event: React.MouseEvent
  ) => {
    const countryData = getCountryData(geo.properties.name);
    if (countryData) {
      setSelectedCountry(countryData);
      setPopupPosition({ x: event.clientX, y: event.clientY });
    }
  };

  // Handle timeline scroll
  const updateScrollButtons = () => {
    if (timelineRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = timelineRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const timeline = timelineRef.current;
    if (timeline) {
      timeline.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons();
      return () => timeline.removeEventListener("scroll", updateScrollButtons);
    }
  }, []);

  const scrollTimeline = (direction: "left" | "right") => {
    if (timelineRef.current) {
      const scrollAmount = 320;
      timelineRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Filter countries for map
  const filteredCountries = useMemo(() => {
    if (activeFilter === "all") return cbdcData;
    return cbdcData.filter((c) => c.status === activeFilter);
  }, [activeFilter]);

  const filteredCountryNames = useMemo(() => {
    return new Set(filteredCountries.map((c) => c.name));
  }, [filteredCountries]);

  return (
    <div className="my-8 border-2 border-foreground bg-background">
      {/* Header */}
      <div className="border-b-2 border-foreground bg-primary px-4 py-4 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-bold text-primary-foreground md:text-xl">
              Global CBDC Adoption
            </h3>
            <p className="mt-1 font-mono text-xs text-primary-foreground/80">
              86% of central banks actively exploring digital currencies
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-4 md:gap-6">
            <div className="text-center">
              <div className="font-mono text-2xl font-bold text-primary-foreground">
                {stats.launched}
              </div>
              <div className="font-mono text-xs text-primary-foreground/70">
                Launched
              </div>
            </div>
            <div className="text-center">
              <div className="font-mono text-2xl font-bold text-primary-foreground">
                {stats.pilot}
              </div>
              <div className="font-mono text-xs text-primary-foreground/70">
                Pilots
              </div>
            </div>
            <div className="text-center">
              <div className="font-mono text-2xl font-bold text-primary-foreground">
                {stats.research}
              </div>
              <div className="font-mono text-xs text-primary-foreground/70">
                Research
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 border-b-2 border-foreground p-3 md:p-4">
        <button
          onClick={() => setActiveFilter("all")}
          className={cn(
            "border-2 border-foreground px-3 py-1 font-mono text-xs uppercase transition-all cursor-pointer",
            activeFilter === "all"
              ? "bg-foreground text-background"
              : "bg-background hover:bg-secondary"
          )}
        >
          All ({stats.total})
        </button>
        {(["launched", "pilot", "research"] as CBDCStatus[]).map((status) => (
          <button
            key={status}
            onClick={() => setActiveFilter(status)}
            className={cn(
              "flex items-center gap-2 border-2 border-foreground px-3 py-1 font-mono text-xs uppercase transition-all cursor-pointer",
              activeFilter === status
                ? "bg-foreground text-background"
                : "bg-background hover:bg-secondary"
            )}
          >
            <span
              className="h-2 w-2"
              style={{ backgroundColor: statusColors[status] }}
            />
            {statusLabels[status]} (
            {status === "launched"
              ? stats.launched
              : status === "pilot"
                ? stats.pilot
                : stats.research}
            )
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="relative bg-secondary/30 p-4">
        <div className="aspect-[2/1] w-full overflow-hidden border-2 border-foreground bg-background">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 120,
              center: [0, 30],
            }}
            style={{ width: "100%", height: "100%" }}
          >
            <ZoomableGroup center={[0, 20]} zoom={1}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const countryData = getCountryData(geo.properties.name);
                    const isFiltered =
                      activeFilter === "all" ||
                      (countryData && filteredCountryNames.has(countryData.name));

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onClick={(e) => handleCountryClick(geo, e)}
                        style={{
                          default: {
                            fill: countryData && isFiltered
                              ? statusColors[countryData.status]
                              : "#E8E8E3",
                            stroke: "#0A0A0A",
                            strokeWidth: 0.5,
                            outline: "none",
                            cursor: countryData ? "pointer" : "default",
                            opacity: isFiltered ? 1 : 0.3,
                          },
                          hover: {
                            fill: countryData && isFiltered
                              ? statusColors[countryData.status]
                              : "#E8E8E3",
                            stroke: "#0A0A0A",
                            strokeWidth: countryData ? 1.5 : 0.5,
                            outline: "none",
                            cursor: countryData ? "pointer" : "default",
                            opacity: isFiltered ? 1 : 0.3,
                          },
                          pressed: {
                            fill: countryData && isFiltered
                              ? statusColors[countryData.status]
                              : "#E8E8E3",
                            stroke: "#0A0A0A",
                            strokeWidth: 1.5,
                            outline: "none",
                          },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap justify-center gap-4 md:gap-6">
          {(["launched", "pilot", "research", "inactive"] as CBDCStatus[]).map(
            (status) => (
              <div key={status} className="flex items-center gap-2">
                <span
                  className="h-4 w-4 border border-foreground"
                  style={{ backgroundColor: statusColors[status] }}
                />
                <span className="font-mono text-xs">{statusLabels[status]}</span>
              </div>
            )
          )}
        </div>

        {/* Country Popup */}
        <AnimatePresence>
          {selectedCountry && (
            <CountryPopup
              country={selectedCountry}
              onClose={() => setSelectedCountry(null)}
              position={popupPosition}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Timeline Section */}
      <div className="border-t-2 border-foreground">
        <div className="flex items-center justify-between border-b-2 border-foreground bg-muted px-4 py-3 md:px-6">
          <div>
            <h4 className="font-bold">CBDC Implementation Timeline</h4>
            <p className="font-mono text-xs text-muted-foreground">
              Click cards to view technical architecture details
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scrollTimeline("left")}
              disabled={!canScrollLeft}
              className={cn(
                "flex h-8 w-8 items-center justify-center border-2 border-foreground transition-all cursor-pointer",
                canScrollLeft
                  ? "bg-background hover:bg-secondary"
                  : "bg-muted opacity-50 cursor-not-allowed"
              )}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollTimeline("right")}
              disabled={!canScrollRight}
              className={cn(
                "flex h-8 w-8 items-center justify-center border-2 border-foreground transition-all cursor-pointer",
                canScrollRight
                  ? "bg-background hover:bg-secondary"
                  : "bg-muted opacity-50 cursor-not-allowed"
              )}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Timeline Scroll Container */}
        <div
          ref={timelineRef}
          className="flex gap-4 overflow-x-auto p-4 md:p-6 scrollbar-thin"
          style={{ scrollbarWidth: "thin" }}
        >
          {/* Timeline Line */}
          <div className="absolute left-0 right-0 top-1/2 hidden h-0.5 bg-foreground/20 md:block" />

          {timelineEvents.map((event) => (
            <TimelineNode
              key={event.id}
              event={event}
              isExpanded={expandedEvent === event.id}
              onToggle={() =>
                setExpandedEvent(expandedEvent === event.id ? null : event.id)
              }
            />
          ))}
        </div>
      </div>

      {/* Footer Note */}
      <div className="border-t-2 border-foreground bg-muted px-4 py-3">
        <p className="font-mono text-xs text-muted-foreground">
          Data sourced from Atlantic Council CBDC Tracker, BIS, and central bank publications. Last updated 2024.
        </p>
      </div>
    </div>
  );
}
