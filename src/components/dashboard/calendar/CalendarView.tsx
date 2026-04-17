import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, MoreHorizontal, Clock, Plus } from "lucide-react";

// Mock Data
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// A basic 35-day grid for a standard month view (5 weeks)
const calendarDays = Array.from({ length: 35 }, (_, i) => {
    const day = i - 2; // Offset to simulate a month starting on Wednesday
    const isCurrentMonth = day > 0 && day <= 30;
    const date = isCurrentMonth ? day : (day <= 0 ? 31 + day : day - 30);
    return {
        date,
        isCurrentMonth,
        isToday: day === 15,
        events: getMockEvents(day)
    };
});

function getMockEvents(day: number) {
    if (day === 4) return [{ title: "Sprint Planning", time: "10:00 AM", type: "blue" }];
    if (day === 12) return [{ title: "Design Review", time: "2:00 PM", type: "orange" }, { title: "Sync", time: "4:00 PM", type: "green" }];
    if (day === 15) return [{ title: "Client Presentation", time: "11:30 AM", type: "red" }];
    if (day === 22) return [{ title: "Team Lunch", time: "1:00 PM", type: "emerald" }];
    if (day === 28) return [{ title: "Retrospective", time: "3:00 PM", type: "purple" }];
    return [];
}

const eventColors = {
    blue: "bg-muted/30 text-foreground border-border hover:bg-muted transition-colors",
    orange: "bg-muted/30 text-foreground border-border hover:bg-muted transition-colors",
    green: "bg-muted/30 text-foreground border-border hover:bg-muted transition-colors",
    red: "bg-muted/30 text-foreground border-border hover:bg-muted transition-colors",
    emerald: "bg-muted/30 text-foreground border-border hover:bg-muted transition-colors",
    purple: "bg-muted/30 text-foreground border-border hover:bg-muted transition-colors",
};

export function CalendarView() {
    return (
        <div className="flex h-full gap-6">
            {/* Left Sidebar - Context & Mini Calendar */}
            <div className="w-[280px] shrink-0 hidden xl:flex flex-col gap-6">
                {/* Mini Calendar UI */}
                <div className="rounded-[24px] bg-card border border-border p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-sm text-foreground">November 2024</h4>
                        <div className="flex gap-1">
                            <button className="p-1 hover:bg-muted rounded-md text-muted-foreground"><ChevronLeft className="w-4 h-4" /></button>
                            <button className="p-1 hover:bg-muted rounded-md text-muted-foreground"><ChevronRight className="w-4 h-4" /></button>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {["S","M","T","W","T","F","S"].map((d, i) => <div key={i} className="text-[10px] font-bold text-muted-foreground">{d}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center">
                        {Array.from({ length: 35 }).map((_, i) => (
                            <div key={i} className={cn("text-xs py-1.5 rounded-full cursor-pointer hover:bg-muted text-foreground transition-colors", i === 16 ? "bg-primary text-primary-foreground hover:bg-primary font-bold" : "")}>
                                {(i % 30) + 1}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Events */}
                <div className="rounded-[24px] bg-card border border-border p-5 shadow-sm flex-1 min-h-0 flex flex-col">
                    <div className="flex items-center justify-between mb-4 shrink-0">
                        <h4 className="font-semibold text-sm text-foreground">Upcoming</h4>
                        <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="w-4 h-4" /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                        {[
                            { title: "Design Review", time: "Today, 2:00 PM", color: "orange" },
                            { title: "Client Presentation", time: "Tomorrow, 11:30 AM", color: "red" },
                            { title: "Team Lunch", time: "Fri, 1:00 PM", color: "emerald" },
                        ].map((event, i) => (
                            <div key={i} className="flex gap-3 group cursor-pointer">
                                <div className={cn("w-2 rounded-full shrink-0", eventColors[event.color as keyof typeof eventColors].split(' ')[0])} />
                                <div>
                                    <h5 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{event.title}</h5>
                                    <div className="flex items-center text-[10px] font-medium text-muted-foreground mt-0.5">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {event.time}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Calendar Grid */}
            <div className="flex-1 bg-card rounded-[24px] border border-border shadow-sm overflow-hidden flex flex-col min-h-0">
                {/* Days Header */}
                <div className="grid grid-cols-7 border-b border-border bg-muted/30 shrink-0">
                    {daysOfWeek.map((day) => (
                        <div key={day} className="py-3 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider border-r border-border last:border-r-0">
                            {day}
                        </div>
                    ))}
                </div>
                
                {/* Calendar Cells */}
                <div className="flex-1 grid grid-cols-7 grid-rows-5 overflow-y-auto">
                    {calendarDays.map((day, i) => (
                        <div 
                            key={i} 
                            className={cn(
                                "border-r border-b border-border p-2 min-h-[100px] flex flex-col gap-1 hover:bg-muted/10 transition-colors group relative cursor-pointer",
                                !day.isCurrentMonth && "bg-muted/20 opacity-50",
                                i % 7 === 6 && "border-r-0", // Remove right border for last column
                                i >= 28 && "border-b-0" // Remove bottom border for last row
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <span className={cn(
                                    "text-sm font-semibold h-7 w-7 flex items-center justify-center rounded-full", 
                                    day.isToday ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground group-hover:bg-muted"
                                )}>
                                    {day.date}
                                </span>
                                <button className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:bg-muted rounded-full transition-all">
                                    <Plus className="w-3 h-3" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-1.5 mt-1 pr-1 no-scrollbar">
                                {day.events.map((event, eventIdx) => (
                                    <div 
                                        key={eventIdx} 
                                        className={cn(
                                            "text-[10px] font-bold px-2 py-1.5 rounded-md border truncate cursor-pointer transition-transform hover:scale-[1.02]",
                                            eventColors[event.type as keyof typeof eventColors]
                                        )}
                                        title={`${event.title} at ${event.time}`}
                                    >
                                        <div className="truncate">{event.title}</div>
                                        <div className="font-medium opacity-80 mt-0.5">{event.time}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
