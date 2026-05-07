"use client";

import { Trophy, Target, Zap, Clock, GitCommit, CheckCircle2, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScorecardProps {
    currentScore: number;
    pointsPool: number;
    stats: {
        highTasksCompleted: number;
        mediumTasksCompleted: number;
        lowTasksCompleted: number;
        timelineExtensions: number;
        inactivityDays: number;
        codePushes: number;
        collaborations: number;
        activeProjects: number;
    };
}

export function Scorecard({ currentScore, pointsPool, stats }: ScorecardProps) {
    const totalTasksCompleted = stats.highTasksCompleted + stats.mediumTasksCompleted + stats.lowTasksCompleted;

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 max-w-7xl">
            {/* Main Score Display */}
            <div className="xl:col-span-2 space-y-5">
                <div className="border border-border/40 bg-card p-6 relative group">
                    <div className="flex flex-col justify-between h-full">
                        <div className="flex items-start justify-between border-b border-border/30 pb-4 mb-4">
                            <div>
                                <h3 className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-1">Performance Index</h3>
                                <p className="text-xs text-foreground/70">Cumulative developer yield and operational efficiency</p>
                            </div>
                            <div className="flex items-center gap-2 px-2 py-1 bg-muted/30 border border-border/50 text-[9px] font-mono uppercase tracking-widest text-foreground">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                Live Sync
                            </div>
                        </div>

                        <div className="flex items-baseline gap-4 mb-6">
                            <span className="text-6xl md:text-8xl font-light leading-none tracking-tighter text-foreground">{currentScore}</span>
                            <div className="flex flex-col">
                                <span className="text-lg font-light text-muted-foreground tracking-widest">PTS</span>
                                <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.3em] mt-1 border-t border-border/30 pt-1">Global Standing</span>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-t border-l border-border/30">
                            <div className="p-3 border-r border-b border-border/30 bg-muted/10 hover:bg-muted/20 transition-colors">
                                <p className="text-[8px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-1">Available Pool</p>
                                <p className="text-lg font-light text-foreground">+{pointsPool}</p>
                            </div>
                            <div className="p-3 border-r border-b border-border/30 bg-muted/10 hover:bg-muted/20 transition-colors">
                                <p className="text-[8px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-1">Extensions</p>
                                <p className="text-lg font-light text-red-500">-{stats.timelineExtensions * 15}</p>
                            </div>
                            <div className="p-3 border-r border-b border-border/30 bg-muted/10 hover:bg-muted/20 transition-colors">
                                <p className="text-[8px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-1">Inactivity</p>
                                <p className="text-lg font-light text-red-500">-{stats.inactivityDays * 2}</p>
                            </div>
                            <div className="p-3 border-r border-b border-border/30 bg-muted/10 hover:bg-muted/20 transition-colors">
                                <p className="text-[8px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-1">Code Pushes</p>
                                <p className="text-lg font-light text-foreground">+{stats.codePushes * 5}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Operations Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="bg-background border border-border p-5 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground" />
                                <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Task Completion Yield</h4>
                            </div>
                            <div className="space-y-3 font-mono text-xs">
                                <div className="flex justify-between items-center border-b border-border/50 pb-1.5">
                                    <span className="text-foreground/70">High Priority <span className="text-muted-foreground text-[10px]">(x50)</span></span>
                                    <span className="font-bold text-foreground">+{stats.highTasksCompleted * 50}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-border/50 pb-1.5">
                                    <span className="text-foreground/70">Medium Priority <span className="text-muted-foreground text-[10px]">(x30)</span></span>
                                    <span className="font-bold text-foreground">+{stats.mediumTasksCompleted * 30}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-border/50 pb-1.5">
                                    <span className="text-foreground/70">Low Priority <span className="text-muted-foreground text-[10px]">(x15)</span></span>
                                    <span className="font-bold text-foreground">+{stats.lowTasksCompleted * 15}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-border/50 pb-1.5">
                                    <span className="text-foreground/70">Active Projects <span className="text-muted-foreground text-[10px]">(x50)</span></span>
                                    <span className="font-bold text-foreground">+{stats.activeProjects * 50}</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-border flex justify-between items-end">
                            <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">Total Tasks</span>
                            <span className="text-2xl font-black">{totalTasksCompleted}</span>
                        </div>
                    </div>

                    <div className="bg-background border border-border p-5 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <AlertTriangle className="w-3.5 h-3.5 text-muted-foreground" />
                                <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Deduction Matrices</h4>
                            </div>
                            <div className="space-y-3 font-mono text-xs">
                                <div className="flex justify-between items-center border-b border-border/50 pb-1.5">
                                    <span className="text-foreground/70">Timeline Extensions <span className="text-muted-foreground text-[10px]">(-15)</span></span>
                                    <span className="font-bold text-red-500">-{stats.timelineExtensions * 15}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-border/50 pb-1.5">
                                    <span className="text-foreground/70">Inactivity Days <span className="text-muted-foreground text-[10px]">(-2)</span></span>
                                    <span className="font-bold text-red-500">-{stats.inactivityDays * 2}</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-border flex justify-between items-end">
                            <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground">Total Deductions</span>
                            <span className="text-2xl font-black text-red-500">
                                -{(stats.timelineExtensions * 15) + (stats.inactivityDays * 2)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-5">
                <div className="bg-muted/5 border border-border p-5">
                    <h4 className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Velocity Metrics</h4>
                    
                    <div className="space-y-5">
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
                                    <GitCommit className="w-3.5 h-3.5" /> Code Pushes
                                </span>
                                <span className="font-mono text-[10px] font-bold text-green-500 flex items-center gap-1">
                                    <TrendingUp className="w-2.5 h-2.5" /> +{stats.codePushes * 5} pts
                                </span>
                            </div>
                            <div className="h-1.5 bg-muted w-full overflow-hidden">
                                <div className="h-full bg-foreground w-3/4"></div>
                            </div>
                            <p className="mt-1.5 text-[9px] font-mono text-muted-foreground uppercase tracking-widest">{stats.codePushes} recorded pushes</p>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
                                    <Target className="w-3.5 h-3.5" /> Collaborations
                                </span>
                                <span className="font-mono text-[10px] font-bold text-green-500 flex items-center gap-1">
                                    <TrendingUp className="w-2.5 h-2.5" /> +{stats.collaborations * 10} pts
                                </span>
                            </div>
                            <div className="h-1.5 bg-muted w-full overflow-hidden">
                                <div className="h-full bg-foreground w-1/2"></div>
                            </div>
                            <p className="mt-1.5 text-[9px] font-mono text-muted-foreground uppercase tracking-widest">{stats.collaborations} team interactions</p>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground">
                                    <Clock className="w-3.5 h-3.5" /> Extensions
                                </span>
                                <span className="font-mono text-[10px] font-bold text-red-500 flex items-center gap-1">
                                    <TrendingDown className="w-2.5 h-2.5" /> -{stats.timelineExtensions * 15} pts
                                </span>
                            </div>
                            <div className="h-1.5 bg-muted w-full overflow-hidden">
                                <div className={cn("h-full", stats.timelineExtensions > 0 ? "bg-red-500 w-1/4" : "bg-muted w-0")}></div>
                            </div>
                            <p className="mt-1.5 text-[9px] font-mono text-muted-foreground uppercase tracking-widest">{stats.timelineExtensions} timeline extensions</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-background border border-border p-5">
                    <h4 className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">Integrations Required</h4>
                    <p className="text-[10px] text-muted-foreground mb-4 leading-relaxed">
                        To activate live tracking for Daily Code Pushes and Inactivity Penalties, Github OAuth synchronization must be finalized.
                    </p>
                    <button className="w-full h-8 bg-muted/50 hover:bg-foreground hover:text-background border border-border text-[10px] font-mono uppercase tracking-widest transition-colors font-bold text-foreground">
                        Configure Github
                    </button>
                </div>
            </div>
        </div>
    );
}
