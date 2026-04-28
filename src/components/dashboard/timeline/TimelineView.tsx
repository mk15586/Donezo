"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Clock, RotateCw, Activity, ArrowRight, AlertTriangle, Check, CircleDot, Terminal } from "lucide-react";

type TimelineStatus = 'Active' | 'Failed' | 'Completed' | 'Renewed';

interface TimelineItem {
    id: string;
    title: string;
    description: string;
    remainingTime: string;
    status: TimelineStatus;
    workload: number;
    isExpired: boolean;
    lastTouchedDaysAgo: number;
}

const initialTimelines: TimelineItem[] = [
    {
        id: "1",
        title: "Frontend MVP Sprint",
        description: "Core dashboard layout, navigation, and primary UI components.",
        remainingTime: "5d left",
        status: "Active",
        workload: 14,
        isExpired: false,
        lastTouchedDaysAgo: 6,
    },
    {
        id: "2",
        title: "Backend API Integration",
        description: "Connecting authentication and project data endpoints to the frontend.",
        remainingTime: "0d left",
        status: "Failed",
        workload: 18,
        isExpired: true,
        lastTouchedDaysAgo: 2,
    },
    {
        id: "3",
        title: "Database Optimization",
        description: "Query indexing and migration from SQLite to PostgreSQL.",
        remainingTime: "Delivered",
        status: "Completed",
        workload: 22,
        isExpired: false,
        lastTouchedDaysAgo: 0,
    },
    {
        id: "4",
        title: "Landing Page Redesign",
        description: "Marketing site overhaul for the V2 launch campaign.",
        remainingTime: "+7d extended",
        status: "Renewed",
        workload: 28,
        isExpired: false,
        lastTouchedDaysAgo: 1,
    }
];

export function TimelineView() {
    const [timelines, setTimelines] = useState<TimelineItem[]>(initialTimelines);

    const handleRenew = (id: string) => {
        setTimelines(prev => prev.map(t => {
            if (t.id === id) {
                return {
                    ...t,
                    status: 'Renewed',
                    remainingTime: "+7d extended",
                    isExpired: false,
                    lastTouchedDaysAgo: 0
                };
            }
            return t;
        }));
    };

    const getSystemLog = (timeline: TimelineItem) => {
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit' });
        const prefix = `[SYS_${timestamp}]`;
        
        if (timeline.status === 'Failed') return `${prefix} ERR_DEADLINE_EXCEEDED: Blockers detected. Renewal required.`;
        if (timeline.status === 'Completed') return `${prefix} OK_DELIVERY_SUCCESS: Consistency metrics optimal.`;
        if (timeline.status === 'Renewed') return `${prefix} INFO_TIMELINE_EXTENDED: Additional buffer allocated.`;
        
        if (timeline.lastTouchedDaysAgo >= 5) return `${prefix} WARN_IDLE_STATE: No commits in ${timeline.lastTouchedDaysAgo} days. Action required.`;
        if (timeline.lastTouchedDaysAgo === 0) return `${prefix} INFO_ACTIVE: Syncing local changes. Momentum stable.`;
        return `${prefix} INFO_IDLE: Last heartbeat ${timeline.lastTouchedDaysAgo} days ago.`;
    };

    return (
        <div className="flex flex-col h-full overflow-hidden font-sans">
            <div className="flex-1 overflow-y-auto pr-4 pb-12 relative no-scrollbar">
                
                {/* Continuous Timeline Line */}
                <div className="absolute left-[27px] top-4 bottom-0 w-[2px] bg-border/40 hidden md:block" />

                <div className="flex flex-col gap-8 md:gap-12 relative z-10 pt-4">
                    {timelines.map((timeline, index) => {
                        const isFailed = timeline.status === 'Failed';
                        const isCompleted = timeline.status === 'Completed';
                        
                        return (
                            <div key={timeline.id} className="flex flex-col md:flex-row gap-6 md:gap-10 group">
                                
                                {/* Left Node (Hidden on mobile) */}
                                <div className="hidden md:flex flex-col items-center shrink-0 w-[56px] relative">
                                    <div className={cn(
                                        "w-[14px] h-[14px] rounded-full border-2 bg-background z-10 flex items-center justify-center mt-1.5 transition-colors duration-300",
                                        isFailed ? "border-red-500 bg-red-500/10" :
                                        isCompleted ? "border-muted-foreground bg-muted" :
                                        "border-foreground"
                                    )}>
                                        {isCompleted && <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />}
                                    </div>
                                    <div className="text-[10px] font-mono text-muted-foreground mt-4 tracking-widest rotate-180" style={{ writingMode: 'vertical-rl' }}>
                                        TMLN-{timeline.id.padStart(3, '0')}
                                    </div>
                                </div>

                                {/* Main Card */}
                                <div className={cn(
                                    "flex-1 border-y border-r border-border/50 bg-background/50 hover:bg-background transition-colors duration-300",
                                    isFailed ? "border-l-2 border-l-red-500" :
                                    isCompleted ? "border-l-2 border-l-muted opacity-60 grayscale-[0.5]" :
                                    "border-l-2 border-l-foreground"
                                )}>
                                    <div className="flex flex-col lg:flex-row">
                                        
                                        {/* Content Area */}
                                        <div className="flex-1 p-5 md:p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border/50">
                                            <div>
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className={cn("text-lg font-bold tracking-tight", isCompleted && "line-through decoration-muted-foreground/50")}>
                                                        {timeline.title}
                                                    </h4>
                                                    <div className={cn(
                                                        "px-2 py-0.5 text-[10px] font-mono font-bold tracking-widest uppercase",
                                                        isFailed ? "bg-red-500/10 text-red-500" :
                                                        isCompleted ? "bg-muted text-muted-foreground" :
                                                        "bg-foreground text-background"
                                                    )}>
                                                        {timeline.status}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-muted-foreground/90 max-w-xl">
                                                    {timeline.description}
                                                </p>
                                            </div>

                                            {/* System Log */}
                                            <div className="mt-6 pt-4 border-t border-border/30">
                                                <div className="flex items-start gap-2 text-muted-foreground">
                                                    <Terminal className="w-3.5 h-3.5 mt-[1px] shrink-0 opacity-50" />
                                                    <span className={cn(
                                                        "text-[11px] font-mono leading-relaxed",
                                                        isFailed ? "text-red-400/80" : "text-muted-foreground/80"
                                                    )}>
                                                        {getSystemLog(timeline)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Data & Actions Area */}
                                        <div className="w-full lg:w-[260px] shrink-0 flex flex-col bg-muted/10">
                                            {/* Metrics Grid */}
                                            <div className="grid grid-cols-2 divide-x divide-border/50 border-b border-border/50">
                                                <div className="p-4 flex flex-col gap-1">
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                                        <Clock className="w-3 h-3" /> Horizon
                                                    </span>
                                                    <span className={cn("font-mono text-sm font-semibold", isFailed ? "text-red-500" : "text-foreground")}>
                                                        {timeline.remainingTime}
                                                    </span>
                                                </div>
                                                <div className="p-4 flex flex-col gap-1">
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                                        <Activity className="w-3 h-3" /> Input
                                                    </span>
                                                    <span className="font-mono text-sm font-semibold text-foreground">
                                                        {timeline.workload} days
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex-1 flex flex-col justify-end p-4">
                                                {(timeline.status === 'Failed' || timeline.isExpired) ? (
                                                    <button 
                                                        onClick={() => handleRenew(timeline.id)}
                                                        className="group flex items-center justify-between w-full p-2.5 text-xs font-bold bg-background border border-border hover:border-foreground transition-colors"
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <RotateCw className="w-3.5 h-3.5" /> Renew Allocation
                                                        </span>
                                                        <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                                    </button>
                                                ) : (
                                                    <button className="group flex items-center justify-between w-full p-2.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
                                                        <span className="flex items-center gap-2">
                                                            Inspect Node
                                                        </span>
                                                        <ArrowRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {timelines.length === 0 && (
                        <div className="p-12 text-center border-y border-border/50 text-muted-foreground font-mono text-sm">
                            [SYS] No active timeline nodes detected.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
