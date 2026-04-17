import { CalendarView } from "@/components/dashboard/calendar/CalendarView";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from "lucide-react";

export default function CalendarPage() {
    return (
        <div className="flex-1 flex flex-col min-h-0 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">November 2024</h2>
                    <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-1 shadow-sm">
                        <button className="p-1.5 hover:bg-muted rounded-md text-muted-foreground transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                        <button className="px-3 py-1.5 text-sm font-semibold hover:bg-muted rounded-md text-foreground transition-colors">Today</button>
                        <button className="p-1.5 hover:bg-muted rounded-md text-muted-foreground transition-colors"><ChevronRight className="w-5 h-5" /></button>
                    </div>
                </div>
                
                <div className="flex items-center space-x-3">
                    <div className="bg-card border border-border rounded-full p-1 shadow-sm hidden md:flex items-center text-sm font-semibold">
                        <button className="px-4 py-1.5 bg-primary/10 text-primary dark:bg-emerald-500/20 dark:text-emerald-400 rounded-full transition-all">Month</button>
                        <button className="px-4 py-1.5 text-muted-foreground hover:text-foreground rounded-full transition-all">Week</button>
                    </div>
                    <Button className="bg-[#1e4e3a] hover:bg-[#163c2c] text-white rounded-full h-11 px-6 shadow-md dark:bg-emerald-700 dark:hover:bg-emerald-800 font-semibold transition-all hover:scale-105">
                        <Plus className="h-4 w-4 mr-2" /> New Event
                    </Button>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <CalendarView />
            </div>
        </div>
    );
}
