import { GitBranch, Star, MoreHorizontal, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const repositories = [
    { name: "donezo-dashboard", branch: "main", updated: "2 hours ago", status: "syncing", starred: true },
    { name: "donezo-api", branch: "develop", updated: "5 hours ago", status: "synced", starred: true },
    { name: "marketing-site", branch: "main", updated: "1 day ago", status: "synced", starred: false },
    { name: "mobile-app-react-native", branch: "feature/auth", updated: "3 days ago", status: "synced", starred: false },
];

export function RepositoryList() {
    return (
        <div className="bg-card border border-border rounded-[24px] p-6 shadow-sm flex flex-col h-full min-h-[300px]">
            <div className="flex items-center justify-between mb-6 shrink-0">
                <h3 className="text-lg font-bold text-foreground">Tracked Repositories</h3>
                <button className="text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 no-scrollbar">
                {repositories.map((repo, i) => (
                    <div key={i} className="group p-4 rounded-xl border border-border hover:bg-muted/30 transition-all flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-foreground group-hover:text-background transition-colors">
                                <GitBranch className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="font-semibold text-foreground text-sm group-hover:underline">{repo.name}</h4>
                                    {repo.starred && <Star className="w-3 h-3 fill-foreground text-foreground" />}
                                </div>
                                <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground mt-1">
                                    <span className="flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded-md">
                                        <GitBranch className="w-3 h-3" /> {repo.branch}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {repo.updated}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                                <div className={cn("w-2 h-2 rounded-full", repo.status === "syncing" ? "bg-foreground animate-pulse" : "bg-muted-foreground")} />
                                <span className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider hidden sm:inline-block">
                                    {repo.status}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
