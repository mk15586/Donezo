"use client";

import { useState, useEffect } from "react";
import { GitBranch, Star, MoreHorizontal, Clock, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function RepositoryList() {
    const [repositories, setRepositories] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isTracking, setIsTracking] = useState<string | null>(null);

    useEffect(() => {
        async function fetchRepos() {
            try {
                const res = await fetch('/api/github/repos');
                if (res.ok) {
                    const data = await res.json();
                    setRepositories(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchRepos();
    }, []);

    const handleTrackRepo = async (repoFullName: string) => {
        setIsTracking(repoFullName);
        try {
            const res = await fetch('/api/github/setup-webhook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ repoFullName })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Webhook Established", { description: `Now tracking ${repoFullName}` });
            } else {
                toast.error("Tracking Failed", { description: data.error || data.message || "Could not setup webhook" });
            }
        } catch (error) {
            toast.error("Tracking Failed", { description: "An error occurred" });
        } finally {
            setIsTracking(null);
        }
    };
    return (
        <div className="bg-card border border-border rounded-[24px] p-6 shadow-sm flex flex-col h-full min-h-[300px]">
            <div className="flex items-center justify-between mb-6 shrink-0">
                <h3 className="text-lg font-bold text-foreground">Tracked Repositories</h3>
                <button className="text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 no-scrollbar">
                {isLoading ? (
                    <div className="flex h-full min-h-[180px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/10 p-6 text-center">
                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                ) : repositories.length === 0 ? (
                    <div className="flex h-full min-h-[180px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/10 p-6 text-center">
                        <p className="text-sm text-muted-foreground">No repositories connected or found.</p>
                    </div>
                ) : repositories.map((repo, i) => (
                    <div key={repo.id} className="group p-4 rounded-xl border border-border hover:bg-muted/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start sm:items-center gap-4">
                            <div className="w-10 h-10 shrink-0 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                                <GitBranch className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-semibold text-foreground text-sm truncate hover:underline cursor-pointer" onClick={() => window.open(repo.html_url, '_blank')}>
                                        {repo.full_name}
                                    </h4>
                                    {repo.private && <span className="text-[9px] uppercase tracking-wider font-bold bg-muted px-1.5 py-0.5 rounded-sm">Private</span>}
                                </div>
                                <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground mt-1 flex-wrap">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> Updated {new Date(repo.updated_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center shrink-0">
                            <button 
                                onClick={() => handleTrackRepo(repo.full_name)}
                                disabled={isTracking === repo.full_name}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-card border border-border hover:bg-foreground hover:text-background transition-colors rounded-md disabled:opacity-50"
                            >
                                {isTracking === repo.full_name ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                                Track
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
