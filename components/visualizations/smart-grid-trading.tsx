"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Zap,
    Home,
    Sun,
    Battery,
    ArrowRightLeft,
    TrendingUp,
    Leaf
} from "lucide-react";
import { cn } from "@/lib/utils";

interface House {
    id: number;
    type: "consumer" | "prosumer";
    name: string;
    production: number; // kW
    consumption: number; // kW
    battery: number; // %
}

export function SmartGridTrading() {
    const [houses, setHouses] = useState<House[]>([
        { id: 1, type: "prosumer", name: "Solar House A", production: 5.2, consumption: 2.1, battery: 80 },
        { id: 2, type: "consumer", name: "House B", production: 0, consumption: 3.5, battery: 20 },
        { id: 3, type: "prosumer", name: "Solar House C", production: 4.8, consumption: 1.9, battery: 95 },
        { id: 4, type: "consumer", name: "House D", production: 0, consumption: 2.8, battery: 0 },
    ]);

    const [transactions, setTransactions] = useState<{ from: number, to: number, amount: number }[]>([]);

    // Simulation loop
    useEffect(() => {
        const interval = setInterval(() => {
            // Simulate fluctuation
            setHouses(prev => prev.map(h => ({
                ...h,
                production: h.type === "prosumer" ? Math.max(0, h.production + (Math.random() - 0.5)) : 0,
                consumption: Math.max(0.5, h.consumption + (Math.random() - 0.5)),
                battery: Math.min(100, Math.max(0, h.battery + (h.production > h.consumption ? 1 : -1)))
            })));

            // Simulate trading
            const sellers = houses.filter(h => h.production > h.consumption);
            const buyers = houses.filter(h => h.consumption > h.production);

            if (sellers.length > 0 && buyers.length > 0) {
                const seller = sellers[Math.floor(Math.random() * sellers.length)];
                const buyer = buyers[Math.floor(Math.random() * buyers.length)];
                setTransactions(prev => [
                    { from: seller.id, to: buyer.id, amount: Number((Math.random() * 0.5).toFixed(2)) },
                    ...prev.slice(0, 4)
                ]);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [houses]);

    return (
        <div className="my-8 border-2 border-foreground bg-[#FDFBF7] p-6 rounded-xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="font-bold text-xl flex items-center gap-2">
                        <Zap className="h-6 w-6 text-yellow-500" />
                        P2P Microgrid Market
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">Automatic energy matching via Smart Contracts</p>
                </div>
                <div className="text-right">
                    <div className="font-mono text-2xl font-bold text-green-600">
                        $0.12<span className="text-sm text-muted-foreground">/kWh</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Current Market Rate</div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Visual Grid */}
                <div className="relative aspect-square md:aspect-video bg-white border-2 border-dashed border-border rounded-xl p-8 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-12 w-full max-w-md">
                        {houses.map(house => (
                            <motion.div
                                key={house.id}
                                layout
                                className={cn(
                                    "relative p-4 rounded-xl border-2 flex flex-col items-center gap-2 shadow-sm",
                                    house.type === "prosumer" ? "border-green-500 bg-green-50" : "border-blue-500 bg-blue-50"
                                )}
                            >
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-xs font-bold border border-border rounded-full">
                                    {house.name}
                                </div>

                                {house.type === "prosumer" ? (
                                    <Sun className="h-8 w-8 text-yellow-500" />
                                ) : (
                                    <Home className="h-8 w-8 text-blue-500" />
                                )}

                                <div className="w-full space-y-1 text-xs font-mono">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Prod:</span>
                                        <span className="font-bold">{house.production.toFixed(1)} kW</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Cons:</span>
                                        <span className="font-bold">{house.consumption.toFixed(1)} kW</span>
                                    </div>
                                </div>

                                {house.type === "prosumer" && (
                                    <div className="flex items-center gap-1 text-[10px] bg-white px-2 rounded-full border border-green-200">
                                        <Battery className="h-3 w-3 text-green-600" />
                                        <span>{house.battery}%</span>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Transaction Animations */}
                    {transactions.map((tx, i) => (
                        <motion.div
                            key={`${tx.from}-${tx.to}-${i}`}
                            initial={{ opacity: 1, scale: 0 }}
                            animate={{ opacity: 0, scale: 1.5 }}
                            transition={{ duration: 1 }}
                            className="absolute text-green-600 font-bold font-mono text-sm pointer-events-none"
                        >
                            +{tx.amount} kW
                        </motion.div>
                    ))}
                </div>

                {/* Dashboard Stats */}
                <div className="space-y-6">
                    <div className="p-4 bg-green-100 rounded-lg border border-green-200">
                        <div className="flex items-center gap-3 mb-2">
                            <Leaf className="h-5 w-5 text-green-700" />
                            <h4 className="font-bold text-green-900">Community Impact</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-2xl font-bold text-green-800">85%</div>
                                <div className="text-xs text-green-700">Self-Sufficiency</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-green-800">1.2t</div>
                                <div className="text-xs text-green-700">CO2 Saved</div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                            Live Transactions
                        </h4>
                        <div className="space-y-2">
                            {transactions.slice(0, 5).map((tx, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center justify-between p-3 bg-white border border-border rounded-lg text-sm"
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-blue-600">House {tx.from}</span>
                                        <ArrowRightLeft className="h-3 w-3 text-muted-foreground" />
                                        <span className="font-bold text-green-600">House {tx.to}</span>
                                    </div>
                                    <div className="font-mono font-bold">
                                        {tx.amount} kWh
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
