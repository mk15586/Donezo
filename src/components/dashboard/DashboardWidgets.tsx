import { Button } from "@/components/ui/button";
import { Video, Pause, Bell, CheckCircle2, ListTodo } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export interface ReminderData {
    title: string;
    type: 'Task' | 'Timeline' | 'Meeting';
    time?: string;
}

export function Reminders({ reminders = [] }: { reminders?: ReminderData[] }) {
    return (
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between h-full">
            <div>
                <h3 className="font-semibold text-sm text-foreground mb-2 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-muted-foreground" /> Reminders
                </h3>
                <h4 className="font-semibold text-foreground text-base mb-1 leading-tight">
                    You have {reminders.length} reminder{reminders.length === 1 ? '' : 's'} today
                </h4>
                <div className="text-xs text-muted-foreground font-medium mb-3">
                    {reminders.length > 0 ? "Urgent deadlines incoming" : "You are all caught up!"}
                </div>
            </div>

            <Popover>
                <PopoverTrigger asChild>
                    <Button className="w-full bg-foreground hover:bg-foreground/90 text-background rounded-lg h-9 text-xs">
                        <ListTodo className="h-4 w-4 mr-2" />
                        Open Tab
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                    <div className="px-4 py-3 border-b border-border">
                        <h4 className="font-semibold text-sm">Today&apos;s Reminders</h4>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto p-2 flex flex-col gap-1">
                        {reminders.length > 0 ? (
                            reminders.map((reminder, i) => (
                                <div key={i} className="flex items-start gap-3 p-2 hover:bg-muted/50 rounded-md transition-colors">
                                    <div className="mt-0.5 bg-background border border-border p-1.5 rounded-md">
                                        {reminder.type === 'Meeting' ? <Video className="w-3.5 h-3.5 text-foreground" /> : <CheckCircle2 className="w-3.5 h-3.5 text-foreground" />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-foreground">{reminder.title}</span>
                                        <span className="text-[10px] text-muted-foreground">
                                            {reminder.type === 'Meeting' ? reminder.time : `Due Today - ${reminder.type}`}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-6 text-center text-sm text-muted-foreground">
                                All caught up for today!
                            </div>
                        )}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export function ProjectProgress() {
    return (
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between h-full relative overflow-hidden">
            <h3 className="font-semibold text-base text-foreground mb-4">Project Progress</h3>

            <div className="flex-1 flex flex-col items-center justify-center mt-2">
                <div className="relative w-40 h-20 overflow-hidden mb-2">
                    <div
                        className="absolute top-0 left-0 w-40 h-40 rounded-full border-[16px] border-muted dark:border-slate-800"
                        style={{ borderBottomColor: 'transparent', borderLeftColor: 'transparent', transform: 'rotate(-45deg)' }}
                    />
                    <div
                        className="absolute top-0 left-0 w-40 h-40 rounded-full border-[16px] border-foreground"
                        style={{ borderBottomColor: 'transparent', borderLeftColor: 'transparent', transform: 'rotate(-45deg)', clipPath: 'polygon(0 0, 100% 0, 0 0)' }}
                    />
                    <div
                        className="absolute top-0 left-0 w-40 h-40 rounded-full border-[16px] border-muted-foreground"
                        style={{ borderBottomColor: 'transparent', borderLeftColor: 'transparent', transform: 'rotate(-45deg)', clipPath: 'polygon(0 0, 100% 0, 0 0)' }}
                    />
                </div>

                <div className="text-center -mt-6 relative z-10 bg-card px-4 pt-2">
                    <span className="text-4xl font-bold text-foreground block tabular-nums tracking-tight">0%</span>
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground mt-1 block">Project Ended</span>
                </div>
            </div>

            <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-muted-foreground mt-8 px-2">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-foreground" /> Completed</div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-muted-foreground" /> In Progress</div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-muted border border-border" /> Pending</div>
            </div>
        </div>
    )
}

export function TimeTracker() {
    return (
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm relative overflow-hidden h-full flex flex-col justify-between">
            <h3 className="relative z-10 font-medium text-foreground text-sm">Time Tracker</h3>

            <div className="relative z-10 flex flex-col items-center justify-center flex-1 mt-4">
                <div className="text-3xl sm:text-4xl font-mono font-bold tracking-tight tabular-nums mb-5 text-foreground drop-shadow-md">
                    00:00:00
                </div>
                <div className="flex items-center gap-4">
                    <button className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-foreground text-background flex items-center justify-center hover:scale-105 transition shadow-lg">
                        <Pause className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
                    </button>
                    <button className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-transparent border-2 border-foreground text-foreground flex items-center justify-center hover:scale-105 transition shadow-lg">
                        <div className="h-3 w-3 sm:h-4 sm:w-4 bg-foreground rounded-sm" />
                    </button>
                </div>
            </div>
        </div>
    )
}
