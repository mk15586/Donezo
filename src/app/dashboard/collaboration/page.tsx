import { ProjectStats } from "@/components/dashboard/collaboration/ProjectStats";
import { CollaboratorCard, Collaborator } from "@/components/dashboard/collaboration/CollaboratorCard";
import { Button } from "@/components/ui/button";
import { UserPlus, Search, Filter } from "lucide-react";

// Helper to generate random sparkline data
const generateSparkline = () => Array.from({ length: 7 }, () => ({ val: Math.floor(Math.random() * 10) + 1 }));

const collaborators: Collaborator[] = [
    {
        id: "1", name: "Alexandra Deff", role: "Co-maintainer", status: "Active", recentCommit: "fix: resolve hydration errors", sparklineData: generateSparkline(),
    },
    {
        id: "2", name: "Edwin Adenike", role: "Contributor", status: "Idle", recentCommit: "feat: add oauth providers", sparklineData: generateSparkline(),
    },
    {
        id: "3", name: "Isaac Oluwatemilorun", role: "Core Developer", status: "Active", recentCommit: "perf: optimize database queries", sparklineData: generateSparkline(),
    },
    {
        id: "4", name: "David Oshodi", role: "Contributor", status: "Offline", recentCommit: "docs: update readme", sparklineData: generateSparkline(),
    },
    {
        id: "5", name: "Sarah Jenkins", role: "Designer", status: "Active", recentCommit: "design: update figma tokens", sparklineData: generateSparkline(),
    },
    {
        id: "6", name: "Marcus Chen", role: "DevOps", status: "Active", recentCommit: "ci: fix github actions workflow", sparklineData: generateSparkline(),
    },
    {
        id: "7", name: "Emily Watson", role: "Project Lead", status: "Idle", recentCommit: "chore: bump dependencies", sparklineData: generateSparkline(),
    },
    {
        id: "8", name: "James Wilson", role: "Contributor", status: "Offline", recentCommit: "fix: edge case in auth middleware", sparklineData: generateSparkline(),
    },
];

export default function CollaborationPage() {
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
                    <Button className="bg-foreground hover:bg-foreground/90 text-background rounded-full h-11 px-6 shadow-md font-semibold transition-all hover:scale-105">
                        <UserPlus className="h-4 w-4 mr-2" /> Invite Collaborator
                    </Button>
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {collaborators.map((collaborator) => (
                            <CollaboratorCard key={collaborator.id} collaborator={collaborator} />
                        ))}
                    </div>
                </section>
                
            </div>
        </div>
    );
}
