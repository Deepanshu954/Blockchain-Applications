"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Ticket,
    Music,
    Crown,
    ScanLine,
    Sparkles,
    History,
    Repeat
} from "lucide-react";
import { cn } from "@/lib/utils";

type NFTState = "minted" | "active" | "used" | "archived";

interface NFTProps {
    id: string;
    name: string;
    image: string; // Using a color gradient for now
    utility: string;
}

export function NFTUtilityLifecycle() {
    const [nftState, setNftState] = useState<NFTState>("minted");
    const [isFlipped, setIsFlipped] = useState(false);

    const nextState = () => {
        const states: NFTState[] = ["minted", "active", "used", "archived"];
        const currentIndex = states.indexOf(nftState);
        const nextIndex = (currentIndex + 1) % states.length;
        setNftState(states[nextIndex]);
        setIsFlipped(false);
    };

    const getStatusColor = () => {
        switch (nftState) {
            case "minted": return "bg-blue-500";
            case "active": return "bg-green-500";
            case "used": return "bg-purple-500";
            case "archived": return "bg-gray-500";
            default: return "bg-gray-500";
        }
    };

    const getStatusText = () => {
        switch (nftState) {
            case "minted": return "Ready for Sale";
            case "active": return "Valid for Entry";
            case "used": return "Benefit Redeemed";
            case "archived": return "Collectible Only";
            default: return "";
        }
    };

    return (
        <div className="my-8 flex flex-col items-center">
            <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
                {/* Interactive NFT Card */}
                <div className="perspective-1000 h-[400px] w-full max-w-[320px] mx-auto relative group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                    <motion.div
                        className="w-full h-full relative preserve-3d transition-all duration-500"
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                    >
                        {/* Front */}
                        <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden shadow-2xl border-4 border-foreground bg-background">
                            {/* Image Area */}
                            <div className="h-2/3 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 flex items-center justify-center relative overflow-hidden">
                                <motion.div
                                    animate={{
                                        rotate: nftState === "active" ? [0, 5, -5, 0] : 0,
                                        scale: nftState === "active" ? 1.05 : 1
                                    }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                >
                                    <Ticket className="h-24 w-24 text-white drop-shadow-lg" />
                                </motion.div>

                                {/* Holographic overlay effect */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-30" />

                                <div className="absolute top-4 right-4 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm">
                                    #0482
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-xl">VIP Concert Access</h3>
                                    <div className={cn("h-3 w-3 rounded-full", getStatusColor())} />
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Lifetime Backstage Pass Series
                                </p>

                                <div className="flex items-center justify-between text-xs font-mono">
                                    <span className="bg-secondary px-2 py-1 rounded">ERC-721</span>
                                    <span className="text-muted-foreground flex items-center gap-1">
                                        <History className="h-3 w-3" />
                                        Click to flip
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Back */}
                        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden shadow-2xl border-4 border-foreground bg-foreground text-background p-6 flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <ScanLine className="h-5 w-5" />
                                    Contract Details
                                </h3>
                                <div className="space-y-4 font-mono text-xs">
                                    <div>
                                        <span className="opacity-60 block">Contract Address</span>
                                        <span className="break-all">0x71C...9A2d</span>
                                    </div>
                                    <div>
                                        <span className="opacity-60 block">Token ID</span>
                                        <span>482</span>
                                    </div>
                                    <div>
                                        <span className="opacity-60 block">Current Owner</span>
                                        <span className="break-all">0xabc...123</span>
                                    </div>
                                    <div>
                                        <span className="opacity-60 block">Metadata State</span>
                                        <span className="font-bold uppercase text-primary-foreground">{nftState}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-background/20 pt-4 text-center text-xs opacity-60">
                                Verified on Ethereum Mainnet
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Controls & Info */}
                <div className="space-y-6">
                    <div className="bg-background border-2 border-foreground p-6 rounded-lg">
                        <h3 className="font-bold text-xl mb-4">Example: Dynamic Utility NFT</h3>
                        <p className="text-muted-foreground text-sm mb-6">
                            Unlike static JPEGs, utility NFTs change state based on real-world actions. Smart contracts automatically update metadata when the ticket is scanned or benefits are claimed.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm font-bold border-b border-border pb-2">
                                <span>Current Status:</span>
                                <span className={cn("px-2 py-1 rounded text-white text-xs", getStatusColor())}>
                                    {getStatusText()}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded">
                                    <Crown className="h-5 w-5 text-yellow-600" />
                                    <span className="text-xs font-medium">VIP Access</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded">
                                    <Music className="h-5 w-5 text-pink-600" />
                                    <span className="text-xs font-medium">Audio Airdrops</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded">
                                    <Sparkles className="h-5 w-5 text-cyan-600" />
                                    <span className="text-xs font-medium">AR Filters</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={nextState}
                            className="mt-8 w-full flex items-center justify-center gap-2 bg-foreground text-background py-3 rounded-lg font-bold hover:opacity-90 transition-opacity"
                        >
                            <Repeat className="h-4 w-4" />
                            Simulate Action (Next State)
                        </button>
                        <p className="text-center text-[10px] text-muted-foreground mt-2">
                            (Simulates scanning ticket at venue gate)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
