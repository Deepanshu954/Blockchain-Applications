"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface TOCItem {
  id: string;
  number: string;
  title: string;
  subsections?: { id: string; title: string }[];
}

const tocItems: TOCItem[] = [
  { id: "abstract", number: "0", title: "Abstract" },
  {
    id: "introduction",
    number: "1",
    title: "Introduction",
    subsections: [
      { id: "motivation", title: "Motivation" },
      { id: "research-objectives", title: "Research Objectives" },
      { id: "paper-organization", title: "Paper Organization" },
    ],
  },
  {
    id: "background",
    number: "2",
    title: "Background & Related Work",
    subsections: [
      { id: "distributed-systems", title: "Distributed Systems" },
      { id: "byzantine-fault-tolerance", title: "Byzantine Fault Tolerance" },
      { id: "comparison-databases", title: "Comparison with Traditional Databases" },
    ],
  },
  {
    id: "architecture",
    number: "3",
    title: "Blockchain Architecture & Technical Foundations",
    subsections: [
      { id: "consensus-mechanisms", title: "Consensus Mechanisms" },
      { id: "cryptography", title: "Cryptography" },
      { id: "smart-contracts", title: "Smart Contracts & Virtual Machines" },
    ],
  },
  {
    id: "platforms",
    number: "4",
    title: "Blockchain Platforms & Frameworks",
    subsections: [
      { id: "public-private", title: "Public vs Private Blockchains" },
      { id: "ethereum", title: "Ethereum Architecture" },
      { id: "hyperledger", title: "Hyperledger Frameworks" },
    ],
  },
  {
    id: "applications",
    number: "5",
    title: "Applications of Blockchain",
    subsections: [
      { id: "financial-services", title: "Financial Services" },
      { id: "supply-chain", title: "Supply Chain Management" },
      { id: "healthcare", title: "Healthcare Systems" },
      { id: "identity", title: "Identity Management" },
      { id: "iot-energy", title: "IoT & Energy Systems" },
    ],
  },
  {
    id: "case-studies",
    number: "6",
    title: "Case Studies",
    subsections: [
      { id: "walmart", title: "Walmart Food Traceability" },
      { id: "maersk", title: "Maersk TradeLens" },
      { id: "jpmorgan", title: "JPMorgan Kinexys" },
    ],
  },
  {
    id: "security",
    number: "7",
    title: "Security, Privacy & Regulatory Challenges",
    subsections: [
      { id: "attacks", title: "Attacks & Vulnerabilities" },
      { id: "privacy-techniques", title: "Privacy Techniques" },
      { id: "legal-compliance", title: "Legal & Compliance Issues" },
    ],
  },
  {
    id: "scalability",
    number: "8",
    title: "Scalability & Performance Optimization",
    subsections: [
      { id: "layer-2", title: "Layer 2 Solutions" },
      { id: "sharding", title: "Sharding Approaches" },
      { id: "interoperability", title: "Interoperability Protocols" },
    ],
  },
  {
    id: "future",
    number: "9",
    title: "Future Research Directions",
    subsections: [
      { id: "web3", title: "Web3 Infrastructure" },
      { id: "post-quantum", title: "Post-Quantum Cryptography" },
      { id: "blockchain-ai", title: "Blockchain-AI Integration" },
    ],
  },
  { id: "conclusion", number: "10", title: "Conclusion" },
  { id: "references", number: "11", title: "References" },
];

export function TableOfContents() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleNavClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-card brutalist-border p-6 md:p-8">
      <h3 className="text-charcoal mb-6 flex items-center gap-3">
        <span className="w-3 h-3 bg-primary" />
        Table of Contents
      </h3>
      <nav>
        <ul className="space-y-1">
          {tocItems.map((item) => (
            <li key={item.id}>
              <div className="flex items-center">
                {item.subsections && (
                  <button
                    type="button"
                    onClick={() => toggleExpand(item.id)}
                    className="p-1 mr-1 hover:bg-muted rounded cursor-pointer"
                    aria-label={expandedItems.has(item.id) ? "Collapse" : "Expand"}
                  >
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 transition-transform",
                        expandedItems.has(item.id) && "rotate-90"
                      )}
                    />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    "flex-1 text-left py-2 px-3 hover:bg-muted transition-colors group flex items-baseline gap-3 cursor-pointer",
                    !item.subsections && "ml-6"
                  )}
                >
                  <span className="font-mono text-xs text-muted-foreground w-6">
                    {item.number}.
                  </span>
                  <span className="group-hover:text-primary transition-colors">
                    {item.title}
                  </span>
                </button>
              </div>
              {item.subsections && expandedItems.has(item.id) && (
                <ul className="ml-10 mt-1 space-y-1 border-l-2 border-muted pl-4">
                  {item.subsections.map((sub) => (
                    <li key={sub.id}>
                      <button
                        type="button"
                        onClick={() => handleNavClick(sub.id)}
                        className="w-full text-left py-1.5 px-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 transition-colors cursor-pointer"
                      >
                        {sub.title}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
