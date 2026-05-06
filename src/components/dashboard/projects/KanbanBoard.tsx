"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { TaskCard, Task } from "./TaskCard";
import { 
    Sheet, 
    SheetContent, 
    SheetHeader, 
    SheetTitle, 
    SheetDescription, 
    SheetFooter,
    SheetClose 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export function KanbanBoard({ projectId, initialTasks = [] }: { projectId: string, initialTasks?: Task[] }) {
    const supabase = createClient();
    
    const [tasks, setTasks] = useState<Record<string, Task[]>>({
        "To Do": [],
        "In Progress": [],
        "Review": [],
        "Completed": []
    });
    
    const [isBrowser, setIsBrowser] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [nowStr, setNowStr] = useState("");
    
    const [newTask, setNewTask] = useState<Partial<Task>>({
        title: "",
        description: "",
        priority: "Medium",
        startDate: "",
        endDate: "",
        dueDate: ""
    });

    useEffect(() => {
        const frame = requestAnimationFrame(() => setIsBrowser(true));
        const tzOffset = new Date().getTimezoneOffset() * 60000;
        setNowStr(new Date(Date.now() - tzOffset).toISOString().slice(0, 16));
        return () => cancelAnimationFrame(frame);
    }, []);

    useEffect(() => {
        if (initialTasks && initialTasks.length >= 0) {
            const grouped: Record<string, Task[]> = {
                "To Do": [],
                "In Progress": [],
                "Review": [],
                "Completed": []
            };
            initialTasks.forEach(task => {
                if (task.status === "Todo") grouped["To Do"].push(task);
                else if (task.status === "In Progress") grouped["In Progress"].push(task);
                else if (task.status === "In Review") grouped["Review"].push(task);
                else if (task.status === "Done") grouped["Completed"].push(task);
            });
            setTasks(grouped);
        }
    }, [initialTasks]);

    const onDragEnd = async (result: DropResult) => {
        if (!result.destination) return;

        const { source, destination } = result;
        const sourceTasks = [...tasks[source.droppableId]];
        const destTasks = source.droppableId === destination.droppableId ? sourceTasks : [...tasks[destination.droppableId]];
        
        const [removed] = sourceTasks.splice(source.index, 1);
        destTasks.splice(destination.index, 0, removed);

        if (source.droppableId === destination.droppableId) {
            setTasks({
                ...tasks,
                [source.droppableId]: sourceTasks,
            });
        } else {
            setTasks({
                ...tasks,
                [source.droppableId]: sourceTasks,
                [destination.droppableId]: destTasks,
            });

            const statusMap: Record<string, string> = {
                "To Do": "Todo",
                "In Progress": "In Progress",
                "Review": "In Review",
                "Completed": "Done"
            };
            
            const newStatus = statusMap[destination.droppableId];
            const { error } = await supabase
                .from('tasks')
                .update({ status: newStatus })
                .eq('id', removed.id);
                
            if (error) {
                toast.error("Sync Failed", { description: "Could not update task status in database." });
            }
        }
    };

    const handleCreateTask = async () => {
        if (!newTask.title?.trim()) {
            toast.error("Designation Required", { description: "Please provide a task designation." });
            return;
        }
        
        if (newTask.startDate && newTask.endDate && new Date(newTask.endDate) < new Date(newTask.startDate)) {
            toast.error("Invalid Timeline", { description: "Target Horizon cannot be before Commencement." });
            return;
        }

        setIsSubmitting(true);
        
        const insertData = {
            project_id: projectId,
            title: newTask.title.trim(),
            description: newTask.description?.trim() || null,
            priority: newTask.priority || "Medium",
            status: "Todo",
            start_date: newTask.startDate || null,
            end_date: newTask.endDate || null,
            due_date: newTask.endDate || null,
        };

        const { data: insertedTask, error: taskError } = await supabase
            .from('tasks')
            .insert(insertData)
            .select()
            .single();

        if (taskError) {
            toast.error("Failed to Execute", { description: taskError.message });
            setIsSubmitting(false);
            return;
        }

        if (newTask.endDate) {
            let workload = 0;
            if (newTask.startDate && newTask.endDate) {
                const start = new Date(newTask.startDate);
                const end = new Date(newTask.endDate);
                workload = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
            }
            const { error: timelineError } = await supabase
                .from('timeline_nodes')
                .insert({
                    project_id: projectId,
                    title: newTask.title.trim(),
                    description: `Timeline for ${newTask.title.trim()}`,
                    horizon_date: newTask.endDate,
                    workload_days: workload,
                    status: 'Active'
                });
            if (timelineError) {
                console.error("Timeline insertion failed:", timelineError);
            }
        }

        const formattedTask: Task = {
            id: insertedTask.id,
            title: insertedTask.title,
            description: insertedTask.description || "",
            priority: insertedTask.priority as "Low" | "Medium" | "High",
            status: "Todo",
            dueDate: insertedTask.due_date ? new Date(insertedTask.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null,
            startDate: insertedTask.start_date ? new Date(insertedTask.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null,
            endDate: insertedTask.end_date ? new Date(insertedTask.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null,
            comments: 0,
            attachments: 0,
            assignees: []
        };

        setTasks({
            ...tasks,
            "To Do": [formattedTask, ...tasks["To Do"]]
        });
        
        setIsSheetOpen(false);
        setNewTask({ title: "", description: "", priority: "Medium", startDate: "", endDate: "", dueDate: "" });
        setIsSubmitting(false);
        toast.success("Task Provisioned", { className: "bg-foreground text-background rounded-none border-none font-mono uppercase tracking-widest text-xs" });
    };

    const handleExtendTimeline = async (taskId: string) => {
        let foundTask: Task | undefined;
        let foundColumn: string | undefined;
        for (const [column, columnTasks] of Object.entries(tasks)) {
            const task = columnTasks.find(t => t.id === taskId);
            if (task) {
                foundTask = task;
                foundColumn = column;
                break;
            }
        }

        if (!foundTask || !foundColumn) return;

        // Extend by 3 days
        const currentEndDate = foundTask.endDate ? new Date(foundTask.endDate) : new Date();
        const newEndDate = new Date(currentEndDate);
        newEndDate.setDate(newEndDate.getDate() + 3);

        const newEndDateStr = newEndDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        // Update local state
        const updatedTasks = { ...tasks };
        updatedTasks[foundColumn] = updatedTasks[foundColumn].map(t => 
            t.id === taskId ? { ...t, endDate: newEndDateStr, dueDate: newEndDateStr } : t
        );
        setTasks(updatedTasks);

        toast.error("Timeline Extended", { description: "Target horizon has been extended by 3 days. Penalty recorded." });

        // Sync with Supabase
        await supabase
            .from('tasks')
            .update({ 
                end_date: newEndDate.toISOString(),
                due_date: newEndDate.toISOString()
            })
            .eq('id', taskId);

        await supabase
            .from('timeline_nodes')
            .insert({
                project_id: projectId,
                title: `[EXTENSION] ${foundTask.title}`,
                description: `Timeline manually extended for ${foundTask.title}`,
                horizon_date: newEndDate.toISOString(),
                workload_days: 3,
                status: 'Renewed'
            });
    };

    if (!isBrowser) {
        return <div className="flex-1" />;
    }

    const columns = Object.keys(tasks);

    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="h-full pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 h-full w-full">
                        {columns.map((column) => (
                            <div key={column} className="flex flex-col h-full bg-muted/5 border border-border/30 rounded-none p-5 relative group min-w-0">
                                <div className="flex items-center justify-between mb-6 shrink-0 border-b border-border/20 pb-4">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-mono text-sm font-bold uppercase tracking-[0.1em] text-foreground">{column}</h3>
                                        <span className="bg-foreground text-background text-[10px] font-bold px-2 py-0.5 font-mono">
                                            {String(tasks[column].length).padStart(2, '0')}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={() => setIsSheetOpen(true)}
                                        className="w-8 h-8 flex items-center justify-center border border-border/50 text-muted-foreground hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-300"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                
                                <Droppable droppableId={column}>
                                    {(provided, snapshot) => (
                                        <div 
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={`flex-1 min-h-0 overflow-y-auto transition-colors flex flex-col gap-4 no-scrollbar ${snapshot.isDraggingOver ? 'bg-muted/10' : ''}`}
                                        >
                                            {tasks[column].map((task, index) => (
                                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={snapshot.isDragging ? 'opacity-90 scale-[1.02] rotate-1 z-50' : ''}
                                                        >
                                                            <TaskCard task={task} onExtendTimeline={handleExtendTimeline} />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </div>
                </div>
            </DragDropContext>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="sm:max-w-md border-l border-border bg-background p-0">
                    <div className="flex flex-col h-full">
                        <SheetHeader className="p-8 border-b border-border/30">
                            <SheetTitle className="text-3xl font-black uppercase tracking-tighter">New Task</SheetTitle>
                            <SheetDescription className="text-xs font-mono uppercase tracking-widest text-muted-foreground mt-2">
                                Define parameters and allocate timeline
                            </SheetDescription>
                        </SheetHeader>
                        
                        <div className="flex-1 overflow-y-auto p-8 space-y-10">
                            <div className="group relative">
                                <label htmlFor="title" className="block text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3">Designation</label>
                                <input 
                                    id="title" 
                                    placeholder="e.g. Core Implementation" 
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                    className="w-full bg-transparent border-0 border-b-2 border-border/30 pb-3 text-xl font-bold text-foreground placeholder:text-muted-foreground/20 focus:ring-0 focus:border-foreground transition-all rounded-none px-0"
                                />
                            </div>
                            
                            <div className="group relative">
                                <label htmlFor="priority" className="block text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3">Priority Matrix</label>
                                <select
                                    id="priority"
                                    value={newTask.priority}
                                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as "Low" | "Medium" | "High" })}
                                    className="w-full bg-transparent border-0 border-b border-border/30 pb-3 text-sm font-mono text-foreground focus:ring-0 focus:border-foreground transition-colors cursor-pointer appearance-none uppercase tracking-widest"
                                >
                                    <option value="Low" className="bg-background">Low Priority</option>
                                    <option value="Medium" className="bg-background">Medium Priority</option>
                                    <option value="High" className="bg-background">High Priority</option>
                                </select>
                            </div>
                            
                            <div className="group relative">
                                <label htmlFor="description" className="block text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3">Brief (Optional)</label>
                                <textarea 
                                    id="description"
                                    className="w-full bg-transparent border-0 border-b border-border/30 pb-3 text-sm font-medium text-muted-foreground placeholder:text-muted-foreground/20 focus:ring-0 focus:border-foreground transition-colors resize-none min-h-[80px]"
                                    placeholder="Provide operational details..."
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-8">
                                <div className="group relative">
                                    <label htmlFor="start" className="block text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3">Commencement</label>
                                    <input 
                                        id="start" 
                                        type="datetime-local"
                                        min={nowStr}
                                        value={newTask.startDate || ""}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val && new Date(val) < new Date(nowStr)) {
                                                toast.error("Invalid Date", { description: "Commencement cannot be in the past." });
                                                return;
                                            }
                                            setNewTask({ ...newTask, startDate: val });
                                            if (newTask.endDate && new Date(newTask.endDate) < new Date(val)) {
                                                setNewTask((prev) => ({ ...prev, endDate: "", dueDate: "" }));
                                            }
                                        }}
                                        className="w-full bg-transparent border-0 border-b border-border/30 pb-2 text-xs font-mono text-foreground focus:ring-0 focus:border-foreground transition-colors cursor-pointer"
                                    />
                                </div>
                                <div className="group relative">
                                    <label htmlFor="end" className="block text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3">Target Horizon</label>
                                    <input 
                                        id="end" 
                                        type="datetime-local"
                                        min={newTask.startDate || nowStr}
                                        disabled={!newTask.startDate && !newTask.endDate}
                                        value={newTask.endDate || ""}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (!newTask.startDate) {
                                                toast.error("Sequence Error", { description: "You must pick a Commencement date first." });
                                                return;
                                            }
                                            if (val && new Date(val) < new Date(newTask.startDate)) {
                                                toast.error("Invalid Timeline", { description: "Target Horizon cannot be before Commencement." });
                                                return;
                                            }
                                            setNewTask({ ...newTask, endDate: val, dueDate: val });
                                        }}
                                        onClick={(e) => {
                                            if (!newTask.startDate) {
                                                toast.error("Sequence Error", { description: "You must pick a Commencement date before setting a Target Horizon." });
                                            }
                                        }}
                                        className="w-full bg-transparent border-0 border-b border-border/30 pb-2 text-xs font-mono text-foreground focus:ring-0 focus:border-foreground transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <SheetFooter className="p-6 border-t border-border mt-auto flex flex-col gap-3 sm:flex-col sm:space-x-0">
                            <Button 
                                onClick={handleCreateTask} 
                                disabled={isSubmitting}
                                className="w-full rounded-none h-14 bg-foreground text-background font-black uppercase tracking-widest hover:bg-foreground/90 transition-all text-xs"
                            >
                                {isSubmitting ? "Initializing..." : "Authorize Task"}
                            </Button>
                            <SheetClose asChild>
                                <Button variant="ghost" disabled={isSubmitting} className="w-full rounded-none h-12 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground">
                                    Cancel Operation
                                </Button>
                            </SheetClose>
                        </SheetFooter>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}
