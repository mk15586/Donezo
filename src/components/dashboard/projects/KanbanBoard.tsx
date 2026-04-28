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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mock Data
const initialTasks: Record<string, Task[]> = {
    "To Do": [
        {
            id: "1",
            title: "Design System Implementation",
            description: "Create the core UI components including buttons, inputs, and modals using Tailwind CSS.",
            priority: "High",
            dueDate: "Nov 25",
            startDate: "Nov 20",
            endDate: "Nov 25",
            comments: 3,
            attachments: 1,
            assignees: [{ name: "Alice" }, { name: "Bob" }],
        },
        {
            id: "2",
            title: "User Authentication API",
            description: "Set up JWT based authentication endpoints for login and registration.",
            priority: "Medium",
            dueDate: "Nov 26",
            startDate: "Nov 22",
            endDate: "Nov 26",
            comments: 0,
            attachments: 0,
            assignees: [{ name: "Charlie" }],
        },
    ],
    "In Progress": [
        {
            id: "3",
            title: "Dashboard Layout Restructure",
            description: "Migrate the current dashboard to a masonry grid layout and update semantic colors.",
            priority: "High",
            dueDate: "Today",
            startDate: "Nov 15",
            endDate: "Nov 20",
            comments: 5,
            attachments: 2,
            assignees: [{ name: "Alice" }, { name: "Dave" }],
        },
    ],
    "Review": [
        {
            id: "4",
            title: "Cross-Browser Testing",
            description: "Ensure the application works seamlessly on Chrome, Safari, and Firefox.",
            priority: "Low",
            dueDate: "Nov 20",
            startDate: "Nov 18",
            endDate: "Nov 20",
            comments: 1,
            attachments: 0,
            assignees: [{ name: "Eve" }],
        },
    ],
    "Completed": [
        {
            id: "5",
            title: "Initial Setup & Git Repository",
            description: "Initialize Next.js project and set up the GitHub repository.",
            priority: "Medium",
            dueDate: "Nov 15",
            startDate: "Nov 10",
            endDate: "Nov 15",
            comments: 0,
            attachments: 0,
            assignees: [{ name: "Charlie" }],
        },
    ]
};

export function KanbanBoard({ projectId }: { projectId: string }) {
    const [tasks, setTasks] = useState(initialTasks);
    const [isBrowser, setIsBrowser] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [newTask, setNewTask] = useState<Partial<Task>>({
        title: "",
        description: "",
        priority: "Medium",
        startDate: "",
        endDate: "",
        dueDate: ""
    });

    useEffect(() => {
        setIsBrowser(true);
    }, []);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const { source, destination } = result;

        if (source.droppableId === destination.droppableId) {
            const columnTasks = [...tasks[source.droppableId]];
            const [removed] = columnTasks.splice(source.index, 1);
            columnTasks.splice(destination.index, 0, removed);

            setTasks({
                ...tasks,
                [source.droppableId]: columnTasks,
            });
        } else {
            const sourceTasks = [...tasks[source.droppableId]];
            const destTasks = [...tasks[destination.droppableId]];
            const [removed] = sourceTasks.splice(source.index, 1);
            destTasks.splice(destination.index, 0, removed);

            setTasks({
                ...tasks,
                [source.droppableId]: sourceTasks,
                [destination.droppableId]: destTasks,
            });
        }
    };

    const handleCreateTask = () => {
        const task: Task = {
            id: Math.random().toString(36).substr(2, 9),
            title: newTask.title || "Untitled Task",
            description: newTask.description || "",
            priority: newTask.priority as any || "Medium",
            dueDate: newTask.dueDate || "TBD",
            startDate: newTask.startDate,
            endDate: newTask.endDate,
            comments: 0,
            attachments: 0,
            assignees: [{ name: "You" }],
        };

        setTasks({
            ...tasks,
            "To Do": [task, ...tasks["To Do"]]
        });
        setIsSheetOpen(false);
        setNewTask({ title: "", description: "", priority: "Medium", startDate: "", endDate: "", dueDate: "" });
    };

    if (!isBrowser) {
        return <div className="flex-1" />;
    }

    const columns = Object.keys(tasks);

    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="h-full overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-8 sm:px-8">
                    <div className="flex gap-4 lg:gap-6 h-full w-full">
                        {columns.map((column) => (
                            <div key={column} className="flex-1 min-w-[280px] flex flex-col gap-4 h-full">
                                <div className="flex items-center justify-between px-1 shrink-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-foreground">{column}</h3>
                                        <span className="bg-muted text-muted-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                                            {tasks[column].length}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={() => setIsSheetOpen(true)}
                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                    </button>
                                </div>
                                
                                <Droppable droppableId={column}>
                                    {(provided, snapshot) => (
                                        <div 
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={`flex-1 min-h-0 overflow-y-auto rounded-[24px] border border-dashed p-3 transition-colors flex flex-col gap-3 ${snapshot.isDraggingOver ? 'bg-muted/50 dark:bg-muted/20 border-primary/30' : 'bg-muted/30 dark:bg-muted/10 border-transparent hover:border-border'}`}
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
                                                            <TaskCard task={task} />
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
                <SheetContent className="sm:max-w-md">
                    <SheetHeader>
                        <SheetTitle>Create New Task</SheetTitle>
                        <SheetDescription>
                            Add a new task to your project and assign a timeline.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-6 py-6">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Task Title</Label>
                            <Input 
                                id="title" 
                                placeholder="e.g. Design API" 
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea 
                                id="description"
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="What needs to be done?"
                                value={newTask.description}
                                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="start">Start Date</Label>
                                <Input 
                                    id="start" 
                                    placeholder="Nov 20" 
                                    value={newTask.startDate}
                                    onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="end">End Date</Label>
                                <Input 
                                    id="end" 
                                    placeholder="Nov 25" 
                                    value={newTask.endDate}
                                    onChange={(e) => setNewTask({ ...newTask, endDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="due">Due Date</Label>
                            <Input 
                                id="due" 
                                placeholder="Nov 25" 
                                value={newTask.dueDate}
                                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                            />
                        </div>
                    </div>
                    <SheetFooter>
                        <SheetClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </SheetClose>
                        <Button onClick={handleCreateTask}>Create Task</Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </>
    );
}
