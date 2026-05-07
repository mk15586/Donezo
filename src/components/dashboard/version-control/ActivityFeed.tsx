import { createClient } from '@/lib/supabase/server';
import { GitCommit, GitPullRequest, MessageSquare, ArrowRight, GitBranch, Github } from "lucide-react";

function formatTimeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export async function ActivityFeed() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let activities: any[] = [];
    let isConnected = false;

    if (user) {
        const { data: userData } = await supabase
            .from('users')
            .select('github_token')
            .eq('id', user.id)
            .single();

        if (userData?.github_token) {
            isConnected = true;
            try {
                // Get the user's GitHub username first
                const userRes = await fetch('https://api.github.com/user', {
                    headers: {
                        Authorization: `Bearer ${userData.github_token}`,
                        Accept: 'application/vnd.github.v3+json',
                    },
                    next: { revalidate: 60 } // Cache for 60 seconds
                });

                if (userRes.ok) {
                    const ghUser = await userRes.json();
                    
                    // Fetch recent events
                    const eventsRes = await fetch(`https://api.github.com/users/${ghUser.login}/events?per_page=15`, {
                        headers: {
                            Authorization: `Bearer ${userData.github_token}`,
                            Accept: 'application/vnd.github.v3+json',
                        },
                        next: { revalidate: 30 } // Refresh every 30 seconds
                    });

                    if (eventsRes.ok) {
                        const events = await eventsRes.json();
                        
                        activities = events
                            .filter((e: any) => ['PushEvent', 'PullRequestEvent', 'IssueCommentEvent', 'CreateEvent'].includes(e.type))
                            .map((e: any) => {
                                let type = "push";
                                let icon = GitCommit;
                                let message = "";
                                let hash, number, target;

                                if (e.type === 'PushEvent') {
                                    type = "push";
                                    icon = GitCommit;
                                    message = e.payload.commits?.[0]?.message || "Pushed commits";
                                    hash = e.payload.commits?.[0]?.sha?.substring(0, 7);
                                    target = e.payload.ref?.replace('refs/heads/', '');
                                } else if (e.type === 'PullRequestEvent') {
                                    type = "pr";
                                    icon = GitPullRequest;
                                    message = `${e.payload.action} PR: ${e.payload.pull_request?.title}`;
                                    number = `#${e.payload.pull_request?.number}`;
                                } else if (e.type === 'IssueCommentEvent') {
                                    type = "comment";
                                    icon = MessageSquare;
                                    message = e.payload.comment?.body?.substring(0, 50) + (e.payload.comment?.body?.length > 50 ? '...' : '');
                                    number = `#${e.payload.issue?.number}`;
                                } else if (e.type === 'CreateEvent') {
                                    type = "create";
                                    icon = GitBranch;
                                    message = `Created ${e.payload.ref_type} ${e.payload.ref || ''}`;
                                }

                                return {
                                    id: e.id,
                                    type,
                                    repo: e.repo.name,
                                    message,
                                    user: e.actor.login,
                                    time: formatTimeAgo(e.created_at),
                                    hash,
                                    number,
                                    target,
                                    icon
                                };
                            });
                    }
                }
            } catch (err) {
                console.error("Error fetching GitHub activity:", err);
            }
        }
    }

    return (
        <div className="bg-card border border-border rounded-[24px] p-6 shadow-sm flex flex-col h-full min-h-[400px]">
            <div className="flex items-center justify-between mb-6 shrink-0">
                <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
                {isConnected && (
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-background bg-foreground px-2 py-1 rounded-md uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        Live
                    </span>
                )}
            </div>
            
            <div className="flex-1 overflow-y-auto pr-4 space-y-6 relative no-scrollbar">
                {/* Timeline line */}
                <div className="absolute left-4 top-2 bottom-0 w-px bg-border -z-10" />

                {!isConnected ? (
                    <div className="flex flex-col h-full min-h-[240px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/10 p-6 text-center">
                        <Github className="w-8 h-8 text-muted-foreground mb-3 opacity-50" />
                        <h4 className="font-semibold text-foreground mb-1">GitHub Not Connected</h4>
                        <p className="text-xs text-muted-foreground max-w-xs">Connect your GitHub account to see a live feed of your latest commits, PRs, and branch updates.</p>
                    </div>
                ) : activities.length === 0 ? (
                    <div className="flex h-full min-h-[240px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/10 p-6 text-center">
                        <p className="text-sm text-muted-foreground">No recent GitHub activity found.</p>
                    </div>
                ) : activities.map((activity) => (
                    <div key={activity.id} className="flex gap-4 relative z-0">
                        <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                            <activity.icon className="w-4 h-4 text-foreground" />
                        </div>
                        <div className="flex-1 pb-1">
                            <div className="flex items-center justify-between gap-2 mb-1">
                                <p className="text-sm text-foreground">
                                    <span className="font-semibold">{activity.user}</span>
                                    {activity.type === "push" && " pushed to "}
                                    {activity.type === "pr" && " pull request activity in "}
                                    {activity.type === "comment" && " commented on "}
                                    {activity.type === "create" && " in "}
                                    <span className="font-bold text-foreground bg-muted/50 px-1.5 py-0.5 rounded-md text-xs ml-1 hover:underline cursor-pointer">
                                        {activity.repo}
                                    </span>
                                </p>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap shrink-0">
                                    {activity.time}
                                </span>
                            </div>
                            
                            <div className="bg-muted/20 border border-border rounded-xl p-3 mt-2 hover:bg-muted/30 transition-colors cursor-pointer group">
                                <p className="text-sm text-foreground font-medium flex items-center gap-2">
                                    <span className="truncate max-w-[400px]">{activity.message}</span>
                                    <ArrowRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
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
                                        <span className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                            <GitBranch className="w-3 h-3" />
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
