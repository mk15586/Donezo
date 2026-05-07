"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TimelineItem } from "./TimelineView";
import { cn } from "@/lib/utils";
import { Network, ArrowDown, Activity, AlertTriangle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

interface TimelineInspectModalProps {
    nodeId: string | null;
    allNodes: TimelineItem[];
    isOpen: boolean;
    onClose: () => void;
}

export function TimelineInspectModal({ nodeId, allNodes, isOpen, onClose }: TimelineInspectModalProps) {
    if (!nodeId || !isOpen) return null;

    // 1. Find the target node
    const targetNode = allNodes.find(n => n.id === nodeId);
    if (!targetNode) return null;

    // 2. Walk up to find root
    let rootNode = targetNode;
    let safeguard = 0;
    while (rootNode.parentId && safeguard < 100) {
        const parent = allNodes.find(n => n.id === rootNode.parentId);
        if (parent) {
            rootNode = parent;
        } else {
            break;
        }
        safeguard++;
    }

    // 3. Walk down to build the tree chain (assuming linear renewals for simplicity, but handling branching visually)
    const buildTree = (node: TimelineItem): any => {
        const children = allNodes.filter(n => n.parentId === node.id).sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime());
        return {
            ...node,
            children: children.map(buildTree)
        };
    };

    const tree = buildTree(rootNode);

    // 4. Calculate total penalty
    let totalPenalty = 0;
    const calculatePenalty = (node: any) => {
        totalPenalty += (node.penaltyPoints || 0);
        node.children.forEach(calculatePenalty);
    };
    calculatePenalty(tree);

    // Recursive component to render tree nodes
    const TreeNode = ({ node, isRoot = false, isLast = false }: { node: any, isRoot?: boolean, isLast?: boolean }) => {
        const isFailed = node.status === 'Failed' || node.isExpired;
        const isRenewed = node.status === 'Renewed';
        const isTarget = node.id === nodeId;

        return (
            <div className="flex flex-col items-center relative w-full">
                {/* Node Box */}
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={cn(
                        "relative w-[85%] sm:w-[320px] p-4 rounded-[16px] border-2 shadow-xl backdrop-blur-sm z-10 transition-all",
                        isTarget ? "ring-4 ring-foreground/20 scale-105" : "",
                        isRoot ? "bg-card border-foreground/50" : 
                        isFailed ? "bg-red-500/5 border-red-500/50" : 
                        isRenewed ? "bg-muted border-border/50 opacity-80" : "bg-card border-border"
                    )}
                >
                    {/* Status Badge */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-background border-2 shadow-sm whitespace-nowrap">
                        <span className={cn(
                            isFailed ? "text-red-500" :
                            isRenewed ? "text-muted-foreground" : "text-foreground"
                        )}>
                            {isRoot && !isRenewed ? "ROOT GENESIS" : node.status}
                        </span>
                    </div>

                    {/* Penalty Bubble (if any) */}
                    {node.penaltyPoints > 0 && (
                        <div className="absolute -right-3 -top-3 w-8 h-8 rounded-full bg-red-500 border-2 border-background flex items-center justify-center text-[10px] font-black text-white shadow-lg rotate-12">
                            -{node.penaltyPoints}
                        </div>
                    )}

                    <div className="mt-2 text-center">
                        <h4 className={cn("font-bold text-sm truncate", isRenewed && "line-through decoration-muted-foreground/50")}>{node.title}</h4>
                        <div className="flex items-center justify-center gap-4 mt-3 text-xs font-mono text-muted-foreground">
                            <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> {node.workload}d</span>
                            <span className="opacity-50">|</span>
                            <span className="flex items-center gap-1">ID: {node.id.substring(0,4)}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Connection Line & Children */}
                {node.children.length > 0 && (
                    <div className="flex flex-col items-center w-full relative">
                        <div className="w-[2px] h-10 bg-gradient-to-b from-border to-red-500/50 my-2 relative">
                            <ArrowDown className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-4 h-4 text-red-500/50" />
                        </div>
                        <div className="flex gap-6 mt-4 w-full justify-center">
                            {node.children.map((child: any, i: number) => (
                                <TreeNode key={child.id} node={child} isLast={i === node.children.length - 1} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[600px] h-[85vh] sm:h-[80vh] rounded-[24px] border-border bg-background/95 backdrop-blur-xl p-0 flex flex-col overflow-hidden">
                <div className="p-6 border-b border-border/50 flex items-center justify-between bg-card shrink-0 z-20 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center text-background shadow-md">
                            <Network className="w-5 h-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-black uppercase tracking-tighter">Lineage Tree</DialogTitle>
                            <p className="text-xs text-muted-foreground font-mono tracking-wider">Node: {targetNode.id}</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Accumulated Load</span>
                        <div className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono font-black border",
                            totalPenalty > 0 ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-green-500/10 text-green-500 border-green-500/20"
                        )}>
                            {totalPenalty > 0 ? <AlertTriangle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                            {totalPenalty > 0 ? `-${totalPenalty} PTS` : 'OPTIMAL'}
                        </div>
                    </div>
                </div>

                {/* Tree Visual Area */}
                <div className="flex-1 overflow-y-auto overflow-x-auto p-12 bg-muted/5 relative flex justify-center custom-scrollbar">
                    {/* Background Grid Pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
                    
                    <div className="min-w-fit flex flex-col items-center">
                        <TreeNode node={tree} isRoot={true} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
