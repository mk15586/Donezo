import { TimelineView } from "@/components/dashboard/timeline/TimelineView";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function TimelinePage() {
    return (
        <div className="flex-1 flex flex-col min-h-0 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Timelines</h2>
                </div>
                
                <div className="flex items-center space-x-3">
                    <Button className="bg-foreground hover:bg-foreground/90 text-background rounded-full h-11 px-6 shadow-md font-semibold transition-all hover:scale-105">
                        <Plus className="h-4 w-4 mr-2" /> New Timeline
                    </Button>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <TimelineView />
            </div>
        </div>
    );
}
