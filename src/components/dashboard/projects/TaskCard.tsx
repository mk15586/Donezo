import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, MessageSquare, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Task {
    id: string;
    title: string;
    description: string;
    priority: "Low" | "Medium" | "High";
    status: "Todo" | "In Progress" | "In Review" | "Done";
    dueDate: string | null;
    startDate?: string | null;
    endDate?: string | null;
    comments: number;
    attachments: number;
    assignees: { name: string; avatar?: string }[];
}

export function TaskCard({ task, onExtendTimeline, innerRef, ...props }: { task: Task; onExtendTimeline?: (id: string) => void; innerRef?: React.Ref<HTMLDivElement>; [key: string]: any }) {
    const priorityColors = {
        Low: "text-muted-foreground border border-border bg-muted/20",
        Medium: "text-muted-foreground border border-border bg-muted/20",
        High: "text-foreground border border-border bg-muted/50",
    };

    const isExpired = () => {
        if (!task.endDate || task.status === "Done") return false;
        const d = new Date(task.endDate + " " + new Date().getFullYear());
        return d.getTime() < new Date().getTime();
    };

    return (
        <div ref={innerRef} {...props} className="rounded-none bg-background border border-border/30 p-5 shadow-none hover:border-foreground/50 transition-all cursor-grab active:cursor-grabbing group flex flex-col gap-4">
            <div className="flex justify-between items-start">
                <span className={cn("text-[10px] font-mono font-bold px-2 py-1 uppercase tracking-widest border", 
                    task.priority === "High" ? "border-red-500/50 text-red-500" :
                    task.priority === "Medium" ? "border-foreground/30 text-foreground/70" :
                    "border-border/50 text-muted-foreground"
                )}>
                    {task.priority}
                </span>
                <div className="flex items-center gap-2">
                    {onExtendTimeline && isExpired() && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onExtendTimeline(task.id); }}
                            className="text-[9px] font-mono font-bold uppercase tracking-widest border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-background px-2 py-1 transition-colors"
                            title="Timeline Expired. Click to Extend (Penalty applies)"
                        >
                            Extend
                        </button>
                    )}
                    <button className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-foreground">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                    </button>
                </div>
            </div>
            
            <div>
                <h4 className="font-bold text-sm text-foreground mb-1 leading-tight group-hover:text-foreground/80 transition-colors uppercase tracking-wide">{task.title}</h4>
                <p className="text-xs font-mono text-muted-foreground/80 line-clamp-2 leading-relaxed">{task.description}</p>
            </div>

            <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/30">
                <div className="flex flex-col gap-1.5 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                    {task.dueDate && (
                        <div className="flex items-center gap-1" title="Due Date">
                            <Clock className="w-3 h-3" />
                            <span>{task.dueDate}</span>
                        </div>
                    )}
                    {(task.startDate || task.endDate) && (
                        <div className="flex items-center gap-1 text-foreground/70" title="Timeline">
                            <span className="w-3 h-3 border border-current rounded-[2px] opacity-60 flex items-center justify-center text-[6px] font-bold">T</span>
                            <span>{task.startDate || 'TBD'} - {task.endDate || 'TBD'}</span>
                        </div>
                    )}
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
