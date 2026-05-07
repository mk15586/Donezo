"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RotateCw, Calendar, Loader2 } from "lucide-react";

interface TimelineRenewModalProps {
    nodeId: string | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function TimelineRenewModal({ nodeId, isOpen, onClose, onSuccess }: TimelineRenewModalProps) {
    const [startDate, setStartDate] = useState("");
    const [horizonDate, setHorizonDate] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Default minimum datetime string to prevent past selection
    const tzOffset = new Date().getTimezoneOffset() * 60000;
    const nowStr = new Date(Date.now() - tzOffset).toISOString().slice(0, 16);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!startDate || !horizonDate) {
            toast.error("Validation Error", { description: "Both dates are required." });
            return;
        }

        if (new Date(horizonDate) <= new Date(startDate)) {
            toast.error("Validation Error", { description: "Target Horizon must be after Commencement Date." });
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch('/api/timeline/renew', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nodeId, startDate, horizonDate })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to renew timeline');
            }

            toast.success("Timeline Renewed", {
                description: `Penalty load: -${data.data.penalty_points} points.`,
                className: "bg-red-500/10 text-red-500 border-red-500/50"
            });
            
            onSuccess();
            onClose();
        } catch (err: any) {
            toast.error("Renewal Failed", { description: err.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px] rounded-[24px] border-border bg-background p-0 overflow-hidden">
                <div className="p-6 bg-red-500/5 border-b border-red-500/10 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4 text-red-500 border border-red-500/20">
                        <RotateCw className="w-6 h-6" />
                    </div>
                    <DialogTitle className="text-xl font-black uppercase tracking-tighter">Emergency Renewal</DialogTitle>
                    <p className="text-xs text-muted-foreground mt-2 font-mono max-w-[280px]">
                        Allocating additional time will incur a permanent penalty to your developer score.
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                <Calendar className="w-3 h-3" /> New Commencement
                            </label>
                            <input
                                type="datetime-local"
                                value={startDate}
                                min={nowStr}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full bg-muted/30 border border-border/50 py-2.5 px-3 text-sm font-mono rounded-xl focus:ring-0 focus:border-foreground transition-colors cursor-pointer"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                <Calendar className="w-3 h-3" /> New Target Horizon
                            </label>
                            <input
                                type="datetime-local"
                                value={horizonDate}
                                min={startDate || nowStr}
                                disabled={!startDate}
                                onChange={(e) => setHorizonDate(e.target.value)}
                                className="w-full bg-muted/30 border border-border/50 py-2.5 px-3 text-sm font-mono rounded-xl focus:ring-0 focus:border-foreground transition-colors cursor-pointer disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl" disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold" disabled={isSubmitting || !startDate || !horizonDate}>
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Accept Penalty"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
