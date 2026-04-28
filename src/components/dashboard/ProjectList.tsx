import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const projects = [
    {
        title: "Develop API Endpoints",
        date: "Nov 26",
        status: "In Progress",
        priority: "High",
    },
    {
        title: "Onboarding Flow",
        date: "Nov 28",
        status: "Review",
        priority: "Medium",
    },
    {
        title: "Build Dashboard",
        date: "Nov 30",
        status: "In Progress",
        priority: "High",
    },
    {
        title: "Optimize Page Load",
        date: "Dec 5",
        status: "To Do",
        priority: "Low",
    },
    {
        title: "Cross-Browser Testing",
        date: "Dec 6",
        status: "To Do",
        priority: "Medium",
    },
];

const getStatusColor = (status: string) => {
    switch (status) {
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
        default: return "";
    }
};

export function ProjectList() {
    return (
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm h-full flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-4 shrink-0">
                <h3 className="font-semibold text-sm text-foreground">Recent Projects</h3>
                <Button variant="outline" size="sm" className="rounded-full text-xs h-7 px-3 border-border bg-transparent hover:bg-muted font-medium text-foreground">
                    View All
                </Button>
            </div>
            <div className="flex-1 space-y-1 overflow-y-auto min-h-0 pr-1 custom-scrollbar">
                {projects.map((project, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-transparent hover:border-border hover:bg-muted/30 transition-all group cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className={cn("w-2 h-2 rounded-full shrink-0", getStatusColor(project.status))} />
                            <div>
                                <span className="text-sm font-medium text-foreground block group-hover:text-primary transition-colors">{project.title}</span>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs text-muted-foreground">{project.date}</span>
                                    <span className="text-[10px] text-muted-foreground">•</span>
                                    <span className="text-[10px] text-muted-foreground">{project.status}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={cn("text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border", getPriorityStyle(project.priority))}>
                                {project.priority}
                            </span>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
