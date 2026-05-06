import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DashboardProject {
    title: string;
    date: string;
    status: string;
    priority: string;
}

interface ProjectListProps {
    projects: DashboardProject[];
}

const getStatusColor = (status: string) => {
    switch (status) {
        case "Active":
        case "In Progress": return "bg-foreground";
        case "Review": return "bg-muted-foreground";
        case "To Do": return "bg-border";
        default: return "bg-muted";
    }
};

const getPriorityStyle = (priority: string) => {
    switch (priority) {
        case "High": return "text-foreground bg-foreground/5 border-foreground/10 font-bold";
        case "Medium": return "text-muted-foreground bg-muted/50 border-border font-medium";
        case "Low": return "text-muted-foreground/50 bg-transparent border-transparent font-normal";
        default: return "text-muted-foreground/50 bg-transparent border-transparent font-normal";
    }
};

export function ProjectList({ projects = [] }: ProjectListProps) {
    return (
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm h-full flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-4 shrink-0">
                <h3 className="font-semibold text-sm text-foreground">Recent Projects</h3>
                {projects.length > 0 && (
                    <Button variant="outline" size="sm" className="rounded-full text-xs h-7 px-3 border-border bg-transparent hover:bg-muted font-medium text-foreground">
                        View All
                    </Button>
                )}
            </div>

            {projects.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center border border-dashed border-border rounded-xl bg-muted/10">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
                        <Plus className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <h4 className="font-medium text-foreground text-sm mb-1">No Projects Found</h4>
                    <p className="text-xs text-muted-foreground mb-4 max-w-[200px]">Get started by creating your first project and inviting your team.</p>
                    <Button className="h-8 px-4 text-xs rounded-full">Create Project</Button>
                </div>
            ) : (
                <div className="flex-1 space-y-1 overflow-y-auto min-h-0 pr-1 custom-scrollbar">
                    {projects.map((project, i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-transparent hover:border-border hover:bg-muted/30 transition-all group cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className={cn("w-2 h-2 rounded-full shrink-0", getStatusColor(project.status))} />
                                <div>
                                    <span className="text-sm font-medium text-foreground block group-hover:text-primary transition-colors">{project.title}</span>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-xs text-muted-foreground">{project.date}</span>
                                        <span className="text-[10px] text-muted-foreground">â€¢</span>
                                        <span className="text-[10px] text-muted-foreground">{project.status}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {project.priority && (
                                    <span className={cn("text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border", getPriorityStyle(project.priority))}>
                                        {project.priority}
                                    </span>
                                )}
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
