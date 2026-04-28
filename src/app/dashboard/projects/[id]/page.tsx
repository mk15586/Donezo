import { KanbanBoard } from "@/components/dashboard/projects/KanbanBoard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Settings2, Users } from "lucide-react";
import Link from "next/link";

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const projectName = id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return (
        <div className="flex-1 flex flex-col min-h-0 space-y-6 pb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/projects">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">{projectName}</h2>
                        <div className="flex items-center gap-3 mt-1 text-xs font-medium text-muted-foreground">
                            <span className="flex items-center gap-1"><Users className="h-3 w-3" /> 4 Members</span>
                            <span>•</span>
                            <span>Active Project</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="outline" className="rounded-full h-11 px-4 border-border text-sm shadow-sm font-semibold bg-card text-foreground hover:bg-muted transition-all">
                        <Settings2 className="h-4 w-4 mr-2" /> Project Settings
                    </Button>
                    <Button className="bg-foreground hover:bg-foreground/90 text-background rounded-full h-11 px-6 shadow-md font-semibold transition-all hover:scale-105">
                        <Plus className="h-4 w-4 mr-2" /> New Task
                    </Button>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <KanbanBoard projectId={id} />
            </div>
        </div>
    );
}
