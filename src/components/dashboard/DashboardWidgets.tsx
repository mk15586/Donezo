import { Button } from "@/components/ui/button";
import { CalendarIcon, Video, Pause } from "lucide-react";

export function Reminders() {
    return (
        <div className="rounded-[24px] border border-border bg-card p-6 shadow-sm flex flex-col justify-between h-full">
            <div>
                <h3 className="font-semibold text-lg text-foreground mb-6">Reminders</h3>
                <h4 className="font-semibold text-primary text-xl dark:text-emerald-500 mb-1 leading-tight">Meeting with Arc Company</h4>
                <div className="text-xs text-muted-foreground font-medium mb-6">
                    Time : 02.00 pm - 04.00 pm
                </div>
            </div>
            <Button className="w-full bg-[#1e4e3a] hover:bg-[#163c2c] text-white rounded-xl h-11 dark:bg-emerald-700 dark:hover:bg-emerald-800">
                <Video className="h-4 w-4 mr-2" />
                Start Meeting
            </Button>
        </div>
    )
}

export function ProjectProgress() {
    return (
        <div className="rounded-[24px] border border-border bg-card p-6 shadow-sm flex flex-col justify-between h-full relative overflow-hidden">
            <h3 className="font-semibold text-lg text-foreground mb-6">Project Progress</h3>
            
            <div className="flex-1 flex flex-col items-center justify-center mt-4">
                {/* Semi-circle Donut Chart Implementation */}
                <div className="relative w-48 h-24 overflow-hidden mb-2">
                    <div 
                        className="absolute top-0 left-0 w-48 h-48 rounded-full border-[20px] border-muted dark:border-slate-800"
                        style={{ borderBottomColor: 'transparent', borderLeftColor: 'transparent', transform: 'rotate(-45deg)' }}
                    />
                    <div 
                        className="absolute top-0 left-0 w-48 h-48 rounded-full border-[20px] border-[#1e4e3a] dark:border-emerald-600"
                        style={{ borderBottomColor: 'transparent', borderLeftColor: 'transparent', transform: 'rotate(-45deg)', clipPath: 'polygon(0 0, 100% 0, 100% 41%, 0 41%)' }}
                    />
                     <div 
                        className="absolute top-0 left-0 w-48 h-48 rounded-full border-[20px] border-[#4ade80]"
                        style={{ borderBottomColor: 'transparent', borderLeftColor: 'transparent', transform: 'rotate(-45deg)', clipPath: 'polygon(0 41%, 100% 41%, 100% 60%, 0 60%)' }}
                    />
                </div>
                
                <div className="text-center -mt-8 relative z-10 bg-card px-4 pt-2">
                    <span className="text-5xl font-bold text-foreground block tabular-nums tracking-tight">41%</span>
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground mt-1 block">Project Ended</span>
                </div>
            </div>

            <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-muted-foreground mt-8 px-2">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#1e4e3a] dark:bg-emerald-600" /> Completed</div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-[#4ade80]" /> In Progress</div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-muted dark:bg-slate-800" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, currentColor 2px, currentColor 4px)'}} /> Pending</div>
            </div>
        </div>
    )
}

export function TimeTracker() {
    return (
        <div className="rounded-[24px] border border-transparent bg-[#113022] p-6 shadow-sm text-white relative overflow-hidden h-full flex flex-col justify-between dark:bg-emerald-950 dark:border-emerald-900">
            {/* Sleek CSS-based wavy background using radial gradients instead of images */}
            <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'radial-gradient(ellipse at 100% 0%, rgba(74,222,128,0.4) 0%, transparent 50%), radial-gradient(ellipse at 0% 100%, rgba(74,222,128,0.2) 0%, transparent 50%)' }} />
            <div className="absolute -right-20 -top-20 w-64 h-64 border border-white/10 rounded-full" />
            <div className="absolute -right-10 -top-10 w-48 h-48 border border-white/5 rounded-full" />
            <div className="absolute -left-20 -bottom-20 w-64 h-64 border border-white/10 rounded-full" />
            
            <h3 className="relative z-10 font-medium text-green-100/70 text-sm">Time Tracker</h3>
            
            <div className="relative z-10 flex flex-col items-center justify-center flex-1 mt-4">
                <div className="text-4xl sm:text-5xl font-mono font-bold tracking-tight tabular-nums mb-6 text-white drop-shadow-md">
                    01:24:08
                </div>
                <div className="flex items-center gap-4">
                    <button className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white text-[#113022] flex items-center justify-center hover:scale-105 transition shadow-lg dark:text-emerald-900">
                        <Pause className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
                    </button>
                    <button className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-105 transition shadow-lg border-2 border-transparent">
                        <div className="h-3 w-3 sm:h-4 sm:w-4 bg-white rounded-sm" />
                    </button>
                </div>
            </div>
        </div>
    )
}
