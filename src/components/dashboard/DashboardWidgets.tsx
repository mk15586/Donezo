import { Button } from "@/components/ui/button";
import { CalendarIcon, Video, Pause } from "lucide-react";

export function Reminders() {
    return (
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between h-full">
            <div>
                <h3 className="font-semibold text-sm text-foreground mb-2">Reminders</h3>
                <h4 className="font-semibold text-foreground text-base mb-1 leading-tight">Meeting with Arc Company</h4>
                <div className="text-xs text-muted-foreground font-medium mb-3">
                    Time : 02.00 pm - 04.00 pm
                </div>
            </div>
            <Button className="w-full bg-foreground hover:bg-foreground/90 text-background rounded-lg h-9 text-xs">
                <Video className="h-4 w-4 mr-2" />
                Start Meeting
            </Button>
        </div>
    )
}

export function ProjectProgress() {
    return (
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col justify-between h-full relative overflow-hidden">
            <h3 className="font-semibold text-base text-foreground mb-4">Project Progress</h3>
            
            <div className="flex-1 flex flex-col items-center justify-center mt-2">
                {/* Semi-circle Donut Chart Implementation */}
                <div className="relative w-40 h-20 overflow-hidden mb-2">
                    <div 
                        className="absolute top-0 left-0 w-40 h-40 rounded-full border-[16px] border-muted dark:border-slate-800"
                        style={{ borderBottomColor: 'transparent', borderLeftColor: 'transparent', transform: 'rotate(-45deg)' }}
                    />
                    <div 
                        className="absolute top-0 left-0 w-40 h-40 rounded-full border-[16px] border-foreground"
                        style={{ borderBottomColor: 'transparent', borderLeftColor: 'transparent', transform: 'rotate(-45deg)', clipPath: 'polygon(0 0, 100% 0, 100% 41%, 0 41%)' }}
                    />
                     <div 
                        className="absolute top-0 left-0 w-40 h-40 rounded-full border-[16px] border-muted-foreground"
                        style={{ borderBottomColor: 'transparent', borderLeftColor: 'transparent', transform: 'rotate(-45deg)', clipPath: 'polygon(0 41%, 100% 41%, 100% 60%, 0 60%)' }}
                    />
                </div>
                
                <div className="text-center -mt-6 relative z-10 bg-card px-4 pt-2">
                    <span className="text-4xl font-bold text-foreground block tabular-nums tracking-tight">41%</span>
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
                    01:24:08
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
