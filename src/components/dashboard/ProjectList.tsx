import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const projects = [
    {
        title: "Develop API Endpoints",
        date: "due date: Nov 26, 2024",
        icon: "bg-blue-100 text-blue-600",
        initial: "DA",
    },
    {
        title: "Onboarding Flow",
        date: "due date: Nov 28, 2024",
        icon: "bg-teal-100 text-teal-600",
        initial: "OF",
    },
    {
        title: "Build Dashboard",
        date: "due date: Nov 30, 2024",
        icon: "bg-orange-100 text-orange-600",
        initial: "BD",
    },
    {
        title: "Optimize Page Load",
        date: "due date: Dec 5, 2024",
        icon: "bg-yellow-100 text-yellow-600",
        initial: "OP",
    },
    {
        title: "Cross-Browser Testing",
        date: "due date: Dec 6, 2024",
        icon: "bg-purple-100 text-purple-600",
        initial: "CB",
    },
];

export function ProjectList() {
    return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm h-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Project</h3>
                <Button variant="outline" size="sm" className="rounded-full text-xs h-8">
                    <Plus className="h-3 w-3 mr-1" /> New
                </Button>
            </div>
            <div className="space-y-6">
                {projects.map((project, i) => (
                    <div key={i} className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-2 rounded-lg -mx-2 transition">
                        <div className="flex items-center gap-3">
                            <div className={cn("h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs", project.icon)}>
                                {/* Visual Icon Placeholder - using initials or SVG if requested, simplified to initials/color blocks for now */}
                                <div className="w-4 h-4 rounded-full bg-current opacity-50" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900 leading-none mb-1">{project.title}</p>
                                <p className="text-xs text-slate-400 font-medium">{project.date}</p>
                            </div>
                        </div>
                        {/* <Button variant="ghost" size="icon" className="text-slate-300">
                <MoreHorizontal className="h-4 w-4" />
            </Button> */}
                    </div>
                ))}
            </div>
        </div>
    );
}
