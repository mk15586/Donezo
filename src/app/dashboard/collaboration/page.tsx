import { ProjectStats } from "@/components/dashboard/collaboration/ProjectStats";
import { CollaboratorCard, Collaborator } from "@/components/dashboard/collaboration/CollaboratorCard";
import { Button } from "@/components/ui/button";
import { UserPlus, Search, Filter } from "lucide-react";

const collaborators: Collaborator[] = [
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
