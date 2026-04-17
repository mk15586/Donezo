import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, MessageSquare, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Task {
    id: string;
    title: string;
    description: string;
    priority: "Low" | "Medium" | "High";
    dueDate: string;
    comments: number;
    attachments: number;
    assignees: { name: string; avatar?: string }[];
}

export function TaskCard({ task, innerRef, ...props }: { task: Task; innerRef?: React.Ref<HTMLDivElement>; [key: string]: any }) {
    const priorityColors = {
        Low: "text-muted-foreground border border-border bg-muted/20",
        Medium: "text-muted-foreground border border-border bg-muted/20",
        High: "text-foreground border border-border bg-muted/50",
    };

    return (
        <div ref={innerRef} {...props} className="rounded-[16px] bg-card border border-border p-3.5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-grab active:cursor-grabbing group flex flex-col gap-3">
            <div className="flex justify-between items-start">
                <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider", priorityColors[task.priority])}>
                    {task.priority}
                </span>
                <button className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-foreground">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                </button>
            </div>
            
            <div>
                <h4 className="font-semibold text-sm text-foreground mb-0.5 leading-tight group-hover:text-primary transition-colors">{task.title}</h4>
                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{task.description}</p>
            </div>

            <div className="mt-auto flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
                    <div className="flex items-center gap-1" title="Due Date">
                        <Clock className="w-3 h-3" />
                        <span>{task.dueDate}</span>
                    </div>
                    {(task.comments > 0 || task.attachments > 0) && (
                        <div className="flex items-center gap-1.5">
                            {task.comments > 0 && (
                                <div className="flex items-center gap-0.5">
                                    <MessageSquare className="w-3 h-3" />
                                    <span>{task.comments}</span>
                                </div>
                            )}
                            {task.attachments > 0 && (
                                <div className="flex items-center gap-0.5">
                                    <Paperclip className="w-3 h-3" />
                                    <span>{task.attachments}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                
                <div className="flex -space-x-1.5 overflow-hidden">
                    {task.assignees.map((assignee, i) => (
                        <Avatar key={i} className="inline-block h-5 w-5 rounded-full border border-background">
                            <AvatarImage src={assignee.avatar} />
                            <AvatarFallback className="bg-muted text-[8px] font-medium text-foreground">{assignee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    ))}
                </div>
            </div>
        </div>
    );
}
