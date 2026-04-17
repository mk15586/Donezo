import { KanbanBoard } from "@/components/dashboard/tasks/KanbanBoard";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter, SlidersHorizontal } from "lucide-react";

export default function TasksPage() {
    return (
        <div className="flex-1 flex flex-col min-h-0 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Tasks</h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Manage your workflow and track project progress.
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="outline" className="rounded-full h-11 px-4 border-border text-sm shadow-sm font-semibold bg-card text-foreground hover:bg-muted transition-all hidden md:flex">
                        <SlidersHorizontal className="h-4 w-4 mr-2" /> View Options
                    </Button>
                    <Button variant="outline" className="rounded-full h-11 px-4 border-border text-sm shadow-sm font-semibold bg-card text-foreground hover:bg-muted transition-all">
                        <Filter className="h-4 w-4 mr-2" /> Filter
                    </Button>
                    <Button className="bg-[#1e4e3a] hover:bg-[#163c2c] text-white rounded-full h-11 px-6 shadow-md dark:bg-emerald-700 dark:hover:bg-emerald-800 font-semibold transition-all hover:scale-105">
                        <Plus className="h-4 w-4 mr-2" /> New Task
                    </Button>
                </div>
            </div>

            <div className="flex items-center shrink-0">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input 
                        type="text" 
                        placeholder="Search tasks..." 
                        className="w-full h-11 pl-10 pr-4 rounded-full border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
                    />
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <KanbanBoard />
            </div>
        </div>
    );
}
