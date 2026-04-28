import { GitCommit, GitPullRequest, MessageSquare, ArrowRight } from "lucide-react";

const activities = [
    {
        id: 1,
        type: "push",
        repo: "donezo-dashboard",
        message: "Refactor sidebar navigation to use App Router",
        user: "alexdesign",
        time: "2 hours ago",
        hash: "a1b2c3d",
        icon: GitCommit,
    },
    {
        id: 2,
        type: "pr",
        repo: "donezo-api",
        message: "Feature: Add version control webhooks",
        user: "sarahdev",
        time: "4 hours ago",
        number: "#42",
        icon: GitPullRequest,
    },
    {
        id: 3,
        type: "comment",
        repo: "donezo-api",
        message: "Approved these changes. Looks good to me.",
        user: "alexdesign",
        time: "5 hours ago",
        target: "PR #42",
        icon: MessageSquare,
    },
    {
        id: 4,
        type: "push",
        repo: "marketing-site",
        message: "Update hero section copy",
        user: "johndoe",
        time: "1 day ago",
        hash: "9f8e7d6",
        icon: GitCommit,
    },
];

export function ActivityFeed() {
    return (
        <div className="bg-card border border-border rounded-[24px] p-6 shadow-sm flex flex-col h-full min-h-[400px]">
            <div className="flex items-center justify-between mb-6 shrink-0">
                <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
                <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-md">Live</span>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-4 space-y-6 relative no-scrollbar">
                {/* Timeline line */}
                <div className="absolute left-4 top-2 bottom-0 w-px bg-border -z-10" />

                {activities.map((activity) => (
                    <div key={activity.id} className="flex gap-4 relative z-0">
                        <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                            <activity.icon className="w-4 h-4 text-foreground" />
                        </div>
                        <div className="flex-1 pb-1">
                            <div className="flex items-center justify-between gap-2 mb-1">
                                <p className="text-sm text-foreground">
                                    <span className="font-semibold">{activity.user}</span>
                                    {activity.type === "push" && " pushed to "}
                                    {activity.type === "pr" && " opened pull request "}
                                    {activity.type === "comment" && " commented on "}
                                    <span className="font-bold text-foreground bg-muted/50 px-1.5 py-0.5 rounded-md text-xs ml-1">
                                        {activity.repo}
                                    </span>
                                </p>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap shrink-0">
                                    {activity.time}
                                </span>
                            </div>
                            
                            <div className="bg-muted/20 border border-border rounded-xl p-3 mt-2 hover:bg-muted/30 transition-colors cursor-pointer group">
                                <p className="text-sm text-foreground font-medium flex items-center gap-2">
                                    {activity.message}
                                    <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    {activity.hash && (
                                        <span className="text-[11px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                            {activity.hash}
                                        </span>
                                    )}
                                    {activity.number && (
                                        <span className="text-[11px] font-bold text-foreground bg-muted px-1.5 py-0.5 rounded">
                                            {activity.number}
                                        </span>
                                    )}
                                    {activity.target && (
                                        <span className="text-[11px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                            {activity.target}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
