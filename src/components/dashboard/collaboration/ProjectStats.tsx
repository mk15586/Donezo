import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const projects: {
    name: string;
    collaborators: number;
    activity: string;
    color: string;
    members: string[];
}[] = [
];

export function ProjectStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
            {projects.length === 0 ? (
                <div className="md:col-span-3 rounded-xl border border-dashed border-border bg-muted/10 p-8 text-center">
                    <h3 className="font-semibold text-foreground">No shared projects yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Shared project stats will appear here once backend data is connected.</p>
                </div>
            ) : projects.map((project) => (
                <div key={project.name} className="rounded-[24px] bg-card border border-border p-5 shadow-sm hover:border-foreground/30 transition-colors group cursor-pointer flex flex-col justify-between h-32">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className={cn("w-2.5 h-2.5 rounded-full", project.color)} />
                            <h4 className="font-semibold text-sm text-foreground">{project.name}</h4>
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground px-2 py-0.5 bg-muted rounded-full">
                            Activity: {project.activity}
                        </span>
                    </div>

                    <div className="flex items-end justify-between">
                        <div className="flex -space-x-2 overflow-hidden">
                            {project.members.slice(0, 4).map((member, i) => (
                                <Avatar key={i} className="inline-block h-8 w-8 rounded-full border-2 border-background">
                                    <AvatarFallback className="bg-muted text-xs font-medium text-foreground">{member}</AvatarFallback>
                                </Avatar>
                            ))}
                        </div>
                        <span className="text-2xl font-bold text-foreground group-hover:text-foreground/80 transition-colors">
                            {project.collaborators}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
