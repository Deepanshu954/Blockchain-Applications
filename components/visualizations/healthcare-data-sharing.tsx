"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Stethoscope,
    FileText,
    ShieldCheck,
    Lock,
    Unlock,
    Share2,
    Database,
    Building
} from "lucide-react";
import { cn } from "@/lib/utils";

// Entities involved in data sharing
const ENTITIES = [
    {
        id: "patient",
        name: "Patient",
        icon: User,
        color: "#4169E1", // Royal Blue
        role: "Data Owner",
        description: "Controls access keys"
    },
    {
        id: "doctor",
        name: "Doctor",
        icon: Stethoscope,
        color: "#16A34A", // Green
        role: "Provider",
        description: "Updates medical records"
    },
    {
        id: "researcher",
        name: "Research Inst.",
        icon: Database,
        color: "#D97706", // Amber
        role: "requester",
        description: "Requests anonymized data"
    },
    {
        id: "insurer",
        name: "Insurer",
        icon: Building,
        color: "#9333EA", // Purple
        role: "requester",
        description: "Verifies claims"
    }
];

// Data records
const RECORDS = [
    { id: "rec1", name: "Blood Test Results", date: "2024-03-15", access: ["doctor"] },
    { id: "rec2", name: "Vaccination History", date: "2023-11-20", access: ["doctor", "researcher"] },
    { id: "rec3", name: "Diagnosis Report", date: "2024-02-10", access: ["doctor", "insurer"] }
];

export function HealthcareDataSharing() {
    const [selectedRecord, setSelectedRecord] = useState(RECORDS[0].id);
    const [permissions, setPermissions] = useState<Record<string, string[]>>({
        rec1: ["doctor"],
        rec2: ["doctor", "researcher"],
        rec3: ["doctor", "insurer"]
    });
    const [auditLog, setAuditLog] = useState<string[]>([
        "Initial permissions set for Blood Test Results",
        "Smart Contract deployed on private ledger"
    ]);

    const togglePermission = (recordId: string, entityId: string) => {
        if (entityId === "patient") return; // Patient always has access

        setPermissions(prev => {
            const currentAccess = prev[recordId] || [];
            const hasAccess = currentAccess.includes(entityId);

            let newAccess;
            if (hasAccess) {
                newAccess = currentAccess.filter(id => id !== entityId);
                addLog(`Revoked access for ${ENTITIES.find(e => e.id === entityId)?.name}`);
            } else {
                newAccess = [...currentAccess, entityId];
                addLog(`Granted access to ${ENTITIES.find(e => e.id === entityId)?.name}`);
            }

            return { ...prev, [recordId]: newAccess };
        });
    };

    const addLog = (action: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setAuditLog(prev => [`[${timestamp}] ${action}`, ...prev.slice(0, 4)]);
    };

    const activeRecord = RECORDS.find(r => r.id === selectedRecord) || RECORDS[0];

    return (
        <div className="my-8 border-2 border-primary/20 bg-background rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-primary/5 p-4 border-b border-primary/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Patient-Centric Data Sharing</h3>
                        <p className="text-xs text-muted-foreground">Permissioned Blockchain Access Control</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono bg-background px-3 py-1 rounded border border-border">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    HIPAA Compliant
                </div>
            </div>

            <div className="grid md:grid-cols-[1fr_300px] h-[500px]">
                {/* Main Interface */}
                <div className="p-6 overflow-y-auto">
                    <div className="mb-6">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
                            Select Medical Record
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {RECORDS.map(record => (
                                <button
                                    key={record.id}
                                    onClick={() => setSelectedRecord(record.id)}
                                    className={cn(
                                        "px-4 py-3 rounded-lg border-2 text-left transition-all",
                                        selectedRecord === record.id
                                            ? "border-primary bg-primary/5"
                                            : "border-border hover:border-primary/50"
                                    )}
                                >
                                    <div className="flex items-center gap-2 font-bold">
                                        <FileText className="h-4 w-4" />
                                        {record.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1 font-mono">
                                        {record.date}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-secondary/20 rounded-xl p-6 border-2 border-dashed border-border">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="font-bold flex items-center gap-2">
                                <Lock className="h-4 w-4 text-primary" />
                                Access Permissions
                            </h4>
                            <span className="text-xs text-muted-foreground">
                                Click entity to toggle access
                            </span>
                        </div>

                        <div className="flex justify-center items-center gap-4 md:gap-8 flex-wrap">
                            {/* Patient (Center) */}
                            <div className="relative z-10">
                                <div className="h-20 w-20 bg-primary rounded-full flex flex-col items-center justify-center text-primary-foreground shadow-lg border-4 border-background">
                                    <User className="h-8 w-8 mb-1" />
                                    <span className="text-[10px] font-bold">YOU</span>
                                </div>
                            </div>

                            {/* Other Entities */}
                            {ENTITIES.filter(e => e.id !== "patient").map(entity => {
                                const hasAccess = permissions[selectedRecord]?.includes(entity.id);
                                const Icon = entity.icon;

                                return (
                                    <motion.button
                                        key={entity.id}
                                        onClick={() => togglePermission(selectedRecord, entity.id)}
                                        className={cn(
                                            "relative flex flex-col items-center p-4 rounded-xl border-2 transition-all w-28",
                                            hasAccess
                                                ? "border-primary bg-primary/5"
                                                : "border-border opacity-60 hover:opacity-100"
                                        )}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <div className={cn(
                                            "absolute top-2 right-2 h-2 w-2 rounded-full",
                                            hasAccess ? "bg-green-500" : "bg-red-500"
                                        )} />

                                        <div className={cn(
                                            "h-10 w-10 rounded-full flex items-center justify-center mb-2 transition-colors",
                                            hasAccess ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                                        )}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <span className="text-xs font-bold text-center">{entity.name}</span>
                                        <span className="text-[10px] text-muted-foreground text-center mt-1">
                                            {hasAccess ? "Access Granted" : "Access Denied"}
                                        </span>

                                        {/* Connection Line Animation (Simplified) */}
                                        {hasAccess && (
                                            <motion.div
                                                className="absolute inset-x-0 bottom-0 h-1 bg-primary/20"
                                                layoutId={`line-${entity.id}`}
                                            />
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Audit Log Panel */}
                <div className="border-l border-border bg-muted/10 p-4 font-mono text-xs">
                    <div className="mb-4 flex items-center gap-2 text-muted-foreground">
                        <Database className="h-4 w-4" />
                        <span className="uppercase tracking-wider font-bold">Immutable Log</span>
                    </div>
                    <div className="space-y-3">
                        <AnimatePresence>
                            {auditLog.map((log, i) => (
                                <motion.div
                                    key={`${i}-${log}`}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-2 border-l-2 border-primary bg-background shadow-sm"
                                >
                                    {log}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
