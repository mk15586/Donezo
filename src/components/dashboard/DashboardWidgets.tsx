import { Video, Calendar as CalendarIcon, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Reminders() {
    return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm flex flex-col justify-between h-full">
            <div>
                <h3 className="font-semibold text-lg mb-4">Reminders</h3>
                <div className="mb-1">
                    <h4 className="font-semibold text-slate-900">Meeting with Arc Company</h4>
                    <p className="text-sm text-slate-500 mt-1">Time: 02.00 pm - 04.00 pm</p>
                </div>
            </div>
            <Button className="w-full bg-[#1e4e3a] hover:bg-[#163c2c] text-white mt-4">
                <Video className="h-4 w-4 mr-2" />
                Start Meeting
            </Button>
        </div>
    )
}

export function ProjectProgress() {
    return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm h-full flex flex-col">
            <h3 className="font-semibold text-lg mb-4">Project Progress</h3>
            <div className="flex-1 flex items-center justify-center relative">
                {/* Simple Circular Progress using CSS conics */}
                <div className="relative h-40 w-40 rounded-full bg-slate-100 flex items-center justify-center" style={{ background: 'conic-gradient(#1e4e3a 41%, #f1f5f9 0)' }}>
                    <div className="absolute inset-2 bg-white rounded-full flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-slate-900">41%</span>
                        <span className="text-xs text-slate-400 font-medium">Project Ended</span>
                    </div>
                </div>
            </div>
            <div className="mt-4 flex justify-between text-xs font-medium text-slate-500">
                <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-[#1e4e3a] mr-2" /> Completed</div>
                <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-slate-200 mr-2" /> In Progress</div>
                {/* <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-slate-200/50 mr-2" /> Pending</div> */}
            </div>
        </div>
    )
}


export function TimeTracker() {
    return (
        <div className="rounded-2xl border bg-[#0f291e] p-6 shadow-sm text-white overflow-hidden relative h-full flex flex-col justify-between">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-green-900/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-green-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
                <h3 className="font-medium text-green-100/80 mb-6">Time Tracker</h3>
                <div className="text-4xl font-mono font-bold tracking-widest mb-6 tabular-nums">
                    01:24:08
                </div>
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-white text-[#0f291e] flex items-center justify-center cursor-pointer hover:scale-105 transition">
                        <Pause className="h-4 w-4 fill-current" />
                    </div>
                    <div className="h-10 w-10 rounded-full bg-red-500 text-white flex items-center justify-center cursor-pointer hover:scale-105 transition">
                        <div className="h-3 w-3 bg-white rounded-sm" />
                    </div>
                </div>
            </div>
        </div>
    )
}
