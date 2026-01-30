"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Vote,
    Lock,
    FileCheck2,
    Fingerprint,
    Blocks,
    CheckCircle2,
    ShieldCheck,
    UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
    {
        id: "auth",
        title: "Authentication",
        icon: UserCheck,
        description: "Voter identity verified via Zero-Knowledge Proof (ZKP)"
    },
    {
        id: "cast",
        title: "Cast Vote",
        icon: Vote,
        description: "Selection encrypted with homomorphic encryption"
    },
    {
        id: "record",
        title: "Record",
        icon: Blocks,
        description: "Vote hashed and added to immutable ledger"
    },
    {
        id: "verify",
        title: "Verify",
        icon: FileCheck2,
        description: "Voter receives receipt to verify inclusion"
    }
];

const CANDIDATES = [
    { id: "opt-a", name: "Proposal A", color: "bg-blue-500" },
    { id: "opt-b", name: "Proposal B", color: "bg-purple-500" },
    { id: "opt-c", name: "Abstain", color: "bg-gray-500" }
];

export function SecureVotingSystem() {
    const [activeStep, setActiveStep] = useState(0);
    const [selectedVote, setSelectedVote] = useState<string | null>(null);
    const [isVoting, setIsVoting] = useState(false);
    const [voteHash, setVoteHash] = useState<string | null>(null);

    const handleVote = () => {
        if (!selectedVote) return;
        setIsVoting(true);

        // Simulate flow
        setTimeout(() => setActiveStep(1), 1000); // Authenticated
        setTimeout(() => setActiveStep(2), 2500); // Cast
        setTimeout(() => {
            setActiveStep(3); // Recorded
            setVoteHash("0x" + Math.random().toString(16).substr(2, 64)); // Mock Hash
        }, 4500);
        setTimeout(() => {
            setActiveStep(4); // Verified
            setIsVoting(false);
        }, 6000);
    };

    const reset = () => {
        setActiveStep(0);
        setSelectedVote(null);
        setVoteHash(null);
    };

    return (
        <div className="my-8 border-2 border-foreground bg-background rounded-xl overflow-hidden">
            {/* Header */}
            <div className="bg-primary p-6 text-primary-foreground">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6" />
                    Secure E-Voting Protocol
                </h3>
                <p className="opacity-80 text-sm mt-1">End-to-End Verifiable & Anonymous</p>
            </div>

            <div className="p-6">
                {/* Progress Stepper */}
                <div className="flex justify-between items-center mb-12 relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-secondary -z-10" />
                    <motion.div
                        className="absolute top-1/2 left-0 h-1 bg-primary -z-10"
                        initial={{ width: "0%" }}
                        animate={{ width: `${(activeStep / (STEPS.length)) * 100}%` }}
                    />

                    {STEPS.map((step, i) => {
                        const Icon = step.icon;
                        const isActive = i <= activeStep;
                        const isCurrent = i === activeStep;

                        return (
                            <div key={step.id} className="flex flex-col items-center gap-2 bg-background p-2">
                                <motion.div
                                    className={cn(
                                        "h-12 w-12 rounded-full border-2 flex items-center justify-center transition-colors",
                                        isActive ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground text-muted-foreground",
                                        isCurrent && "ring-4 ring-primary/20"
                                    )}
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <Icon className="h-6 w-6" />
                                </motion.div>
                                <div className="text-center w-24">
                                    <p className={cn("text-xs font-bold uppercase", isActive ? "text-primary" : "text-muted-foreground")}>
                                        {step.title}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Dynamic Content Area */}
                <div className="min-h-[300px] flex items-center justify-center bg-secondary/10 rounded-xl border border-dashed border-border p-8 relative">
                    <AnimatePresence mode="wait">
                        {activeStep === 0 && (
                            <motion.div
                                key="step-0"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="w-full max-w-md text-center"
                            >
                                <h4 className="text-lg font-bold mb-6">Select your choice</h4>
                                <div className="grid gap-3 mb-6">
                                    {CANDIDATES.map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setSelectedVote(opt.id)}
                                            className={cn(
                                                "p-4 rounded-lg border-2 text-left transition-all hover:translate-x-1",
                                                selectedVote === opt.id
                                                    ? "border-primary bg-primary/5 shadow-md"
                                                    : "border-border bg-background hover:bg-secondary/50"
                                            )}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold">{opt.name}</span>
                                                {selectedVote === opt.id && <CheckCircle2 className="h-5 w-5 text-primary" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={handleVote}
                                    disabled={!selectedVote}
                                    className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-bold disabled:opacity-50 hover:opacity-90 transition-opacity"
                                >
                                    Initiate Secure Vote
                                </button>
                            </motion.div>
                        )}

                        {activeStep > 0 && activeStep < 4 && (
                            <motion.div
                                key="processing"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="inline-block mb-4"
                                >
                                    <Lock className="h-16 w-16 text-primary" />
                                </motion.div>
                                <h4 className="text-xl font-bold mb-2">
                                    {STEPS[activeStep - 1]?.description || "Processing..."}
                                </h4>
                                <p className="text-muted-foreground font-mono text-sm">
                                    {activeStep === 2 ? "Encrypting vote data..." : "Hashing block #402,193..."}
                                </p>
                            </motion.div>
                        )}

                        {activeStep === 4 && (
                            <motion.div
                                key="success"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-center w-full max-w-lg"
                            >
                                <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Fingerprint className="h-10 w-10 text-green-600" />
                                </div>
                                <h4 className="text-2xl font-bold text-green-700 mb-2">Vote Verified!</h4>
                                <p className="text-muted-foreground mb-6">
                                    Your vote has been permanently recorded on the blockchain.
                                </p>

                                <div className="bg-background border border-border p-4 rounded-lg text-left mb-6 font-mono text-xs break-all">
                                    <p className="text-muted-foreground mb-1 uppercase tracking-wider text-[10px]">Transaction Hash</p>
                                    <p>{voteHash}</p>
                                </div>

                                <button
                                    onClick={reset}
                                    className="text-primary font-bold hover:underline"
                                >
                                    Start New Vote
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
