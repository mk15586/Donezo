import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Project {
    id: string;
    name: string;
    description: string;
    status: "Active" | "On Hold" | "Completed";
    progress: number;
    dueDate: string;
    members: { name: string; avatar?: string }[];
}

export function ProjectCard({ project }: { project: Project }) {
    const StatusIcon = 
        project.status === "Completed" ? CheckCircle2 :
        project.status === "On Hold" ? AlertCircle : Circle;

    const statusColors = {
        "Active": "text-foreground",
        "On Hold": "text-muted-foreground",
        "Completed": "text-foreground opacity-70",
    };

    return (
        <Link href={`/dashboard/projects/${project.id}`} className="block">
            <div className="rounded-[24px] bg-card border border-border p-6 shadow-sm hover:shadow-md hover:border-foreground/30 transition-all group flex flex-col gap-4 h-full">
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <h3 className="font-bold text-foreground text-lg mb-1 group-hover:underline underline-offset-4">{project.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                    </div>
                    <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border text-xs font-semibold shrink-0 bg-muted/50", statusColors[project.status])}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {project.status}
                    </div>
                </div>

                <div className="mt-auto space-y-4 pt-4 border-t border-border">
                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="text-foreground">{project.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-foreground rounded-full transition-all duration-500"
                                style={{ width: `${project.progress}%` }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Due {project.dueDate}</span>
                        </div>
                        
                        <div className="flex -space-x-2 overflow-hidden">
                            {project.members.map((member, i) => (
                                <Avatar key={i} className="inline-block h-6 w-6 rounded-full border-2 border-background">
                                    <AvatarImage src={member.avatar} />
                                    <AvatarFallback className="bg-muted text-[10px] font-bold text-foreground">{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
