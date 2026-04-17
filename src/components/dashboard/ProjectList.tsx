import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

// Simplified data to match the visual reference
const projects = [
    {
        title: "Develop API Endpoints",
        date: "Due date: Nov 26, 2024",
        iconColor: "text-blue-500",
        iconBg: "bg-blue-500/10",
        icon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line></svg>
        )
    },
    {
        title: "Onboarding Flow",
        date: "Due date: Nov 28, 2024",
        iconColor: "text-emerald-500",
        iconBg: "bg-emerald-500/10",
        icon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
        )
    },
    {
        title: "Build Dashboard",
        date: "Due date: Nov 30, 2024",
        iconColor: "text-orange-400",
        iconBg: "bg-orange-400/10",
        icon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        )
    },
    {
        title: "Optimize Page Load",
        date: "Due date: Dec 5, 2024",
        iconColor: "text-yellow-500",
        iconBg: "bg-yellow-500/10",
        icon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        )
    },
    {
        title: "Cross-Browser Testing",
        date: "Due date: Dec 6, 2024",
        iconColor: "text-purple-500",
        iconBg: "bg-purple-500/10",
        icon: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
        )
    },
];

export function ProjectList() {
    return (
        <div className="rounded-[24px] border border-border bg-card p-6 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <h3 className="font-semibold text-lg text-foreground">Project</h3>
                <Button variant="outline" size="sm" className="rounded-full text-xs h-8 px-3 border-border bg-transparent hover:bg-muted font-medium text-foreground">
                    + New
                </Button>
            </div>
            <div className="flex-1 space-y-6">
                {projects.map((project, i) => (
                    <div key={i} className="flex items-center gap-4 group cursor-pointer">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", project.iconBg, project.iconColor)}>
                            {project.icon}
                        </div>
                        <div>
                            <span className="text-sm font-semibold text-foreground block mb-0.5 group-hover:text-primary transition-colors">{project.title}</span>
                            <span className="text-xs text-muted-foreground">{project.date}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
