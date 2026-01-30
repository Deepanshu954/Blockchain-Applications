"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Wallet,
    QrCode,
    CheckCircle2,
    UserCircle,
    GraduationCap,
    Building2,
    Shield,
    Fingerprint,
    ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Credential {
    id: string;
    type: string;
    issuer: string;
    date: string;
    icon: typeof GraduationCap;
    status: "verified" | "pending" | "revoked";
    claims: Record<string, string>;
}

const CREDENTIALS: Credential[] = [
    {
        id: "vc-1",
        type: "University Degree",
        issuer: "MIT",
        date: "2023-05-20",
        icon: GraduationCap,
        status: "verified",
        claims: {
            degree: "B.S. Computer Science",
            gpa: "3.8",
            honors: "Summa Cum Laude"
        }
    },
    {
        id: "vc-2",
        type: "Employment Verification",
        issuer: "TechCorp Inc.",
        date: "2024-01-15",
        icon: Building2,
        status: "verified",
        claims: {
            role: "Senior Engineer",
            department: "Blockchain R&D",
            status: "Active"
        }
    },
    {
        id: "vc-3",
        type: "Government ID",
        issuer: "State Dept",
        date: "2022-08-10",
        icon: UserCircle,
        status: "verified",
        claims: {
            citizenship: "USA",
            dob: "1995-04-12",
            id_number: "#########"
        }
    }
];

export function DIDIdentityWallet() {
    const [selectedCred, setSelectedCred] = useState<string | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationResult, setVerificationResult] = useState<boolean | null>(null);

    const activeCred = CREDENTIALS.find(c => c.id === selectedCred);

    const handleVerify = () => {
        if (!activeCred) return;
        setIsVerifying(true);
        setVerificationResult(null);

        // Simulate ZK proof generation and verification
        setTimeout(() => {
            setIsVerifying(false);
            setVerificationResult(true);
            setTimeout(() => setVerificationResult(null), 3000);
        }, 2000);
    };

    return (
        <div className="my-8 grid md:grid-cols-[300px_1fr] gap-6 p-4 border-2 border-foreground bg-background">
            {/* Wallet Sidebar */}
            <div className="border-r-2 border-foreground/10 pr-4">
                <div className="flex items-center gap-3 mb-6 p-3 bg-primary/10 rounded-lg">
                    <Wallet className="h-6 w-6 text-primary" />
                    <div>
                        <h4 className="font-bold text-sm">My Identity Wallet</h4>
                        <p className="text-[10px] font-mono text-muted-foreground">did:ethr:0x123...abc</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2">
                        Credentials
                    </p>
                    {CREDENTIALS.map(cred => {
                        const Icon = cred.icon;
                        return (
                            <button
                                key={cred.id}
                                onClick={() => setSelectedCred(cred.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all",
                                    selectedCred === cred.id
                                        ? "border-primary bg-primary/5"
                                        : "border-transparent hover:bg-secondary/20"
                                )}
                            >
                                <div className="h-8 w-8 rounded-full bg-background border border-border flex items-center justify-center">
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="min-w-0">
                                    <div className="font-bold text-sm truncate">{cred.type}</div>
                                    <div className="text-xs text-muted-foreground truncate">{cred.issuer}</div>
                                </div>
                                {cred.status === "verified" && (
                                    <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto flex-shrink-0" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Credential Detail View */}
            <div className="relative min-h-[400px] flex flex-col">
                {activeCred ? (
                    <>
                        {/* Credential Card */}
                        <motion.div
                            layoutId={activeCred.id}
                            className="relative bg-gradient-to-br from-background to-secondary/20 border-2 border-foreground rounded-xl p-6 shadow-[8px_8px_0_0_rgba(0,0,0,1)]"
                        >
                            <div className="flex items-start justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                                        <activeCred.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl">{activeCred.type}</h3>
                                        <p className="text-muted-foreground flex items-center gap-2">
                                            Issued by <span className="font-bold text-foreground">{activeCred.issuer}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="h-16 w-16 bg-white p-1 rounded">
                                    <QrCode className="h-full w-full" />
                                </div>
                            </div>

                            <div className="space-y-4 font-mono text-sm">
                                {Object.entries(activeCred.claims).map(([key, value]) => (
                                    <div key={key} className="flex justify-between border-b border-dashed border-foreground/20 pb-2">
                                        <span className="text-muted-foreground uppercase">{key}</span>
                                        <span className="font-bold">{value}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Fingerprint className="h-4 w-4" />
                                    <span>Cryptographically Signed</span>
                                </div>
                                <div className="text-xs text-green-600 font-bold bg-green-100 px-2 py-1 rounded">
                                    VERIFIED
                                </div>
                            </div>
                        </motion.div>

                        {/* Verification Simulator */}
                        <div className="mt-8 border-t-2 border-foreground/10 pt-6">
                            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Zero-Knowledge Proof Demo
                            </h4>

                            <div className="bg-secondary/10 border border-border p-4 rounded-lg">
                                <p className="text-sm text-muted-foreground mb-4">
                                    Prove you have a valid credential without revealing personal details (data minimization).
                                </p>

                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={handleVerify}
                                        disabled={isVerifying || verificationResult !== null}
                                        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded font-bold hover:bg-primary/90 disabled:opacity-50"
                                    >
                                        {isVerifying ? "Generating Proof..." : "Verify Credential"}
                                        {!isVerifying && <ArrowRight className="h-4 w-4" />}
                                    </button>

                                    <AnimatePresence>
                                        {verificationResult && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="flex items-center gap-2 text-green-600 font-bold"
                                            >
                                                <CheckCircle2 className="h-5 w-5" />
                                                <span>Proof Verified!</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                        <Wallet className="h-16 w-16 mb-4 opacity-20" />
                        <p className="font-bold">Select a credential</p>
                        <p className="text-sm">View details and generate proofs</p>
                    </div>
                )}
            </div>
        </div>
    );
}
