import { ProjectStats } from "@/components/dashboard/collaboration/ProjectStats";
import { CollaboratorCard, Collaborator } from "@/components/dashboard/collaboration/CollaboratorCard";
import { InviteCollaboratorButton } from "@/components/dashboard/collaboration/InviteCollaboratorButton";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function CollaborationPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let collaborators: Collaborator[] = [];

    if (user) {
        // Fetch projects the user has access to
        const { data: projects } = await supabase
            .from('project_members')
            .select('project_id')
            .eq('user_id', user.id);

        if (projects && projects.length > 0) {
            const projectIds = projects.map(p => p.project_id);

            // Fetch GitHub collaborators for these projects
            const { data: githubCollabs } = await supabase
                .from('project_github_collaborators')
                .select(`
                    id,
                    github_username,
                    avatar_url,
                    status,
                    projects(name)
                `)
                .in('project_id', projectIds)
                .order('invited_at', { ascending: false });

            if (githubCollabs) {
                collaborators = githubCollabs.map(collab => ({
                    id: collab.id,
                    name: collab.github_username,
                    role: 'GitHub Contributor',
                    avatar: collab.avatar_url,
                    status: collab.status === 'Invite Pending' ? 'Idle' : 'Active',
                    inviteStatus: collab.status,
                    projectName: Array.isArray(collab.projects as any) ? (collab.projects as any)[0]?.name : (collab.projects as any)?.name || 'Unknown Project',
                    recentCommit: 'Awaiting first push',
                    sparklineData: [
                        { val: 0 }, { val: 0 }, { val: 0 }, { val: 0 }, { val: 0 }, { val: 0 }, { val: 0 }
                    ]
                }));
            }
        }
    }

    return (
        <div className="flex-1 flex flex-col min-h-0 space-y-6 pb-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Network</h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Manage shared projects, monitor contributions, and collaborate.
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="outline" className="rounded-full h-11 px-4 border-border text-sm shadow-sm font-semibold bg-card text-foreground hover:bg-muted transition-all">
                        <Filter className="h-4 w-4 mr-2" /> Filter Access
                    </Button>
                    <InviteCollaboratorButton />
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto min-h-0 space-y-8 pr-2 no-scrollbar">
                
                <section>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 px-1">Shared Projects</h3>
                    <ProjectStats />
                </section>

                <section>
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Mutual Collaborators</h3>
                        <div className="relative max-w-xs w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                            <input 
                                type="text" 
                                placeholder="Search network..." 
                                className="w-full h-9 pl-9 pr-4 rounded-full border border-border bg-card text-xs font-medium focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground placeholder:text-muted-foreground"
                            />
                        </div>
                    </div>
                    
                    {collaborators.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-border bg-muted/10 p-8 text-center">
                            <h3 className="font-semibold text-foreground">No collaborators yet</h3>
                            <p className="mt-1 text-sm text-muted-foreground">Collaboration data can be loaded from the backend later.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {collaborators.map((collaborator) => (
                                <CollaboratorCard key={collaborator.id} collaborator={collaborator} />
                            ))}
                        </div>
                    )}
                </section>
                
            </div>
        </div>
    );
}
