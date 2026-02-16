import { OverviewCards } from "@/components/dashboard/OverviewCards";
import { ProjectAnalytics } from "@/components/dashboard/ProjectAnalytics";
import { TeamCollaboration } from "@/components/dashboard/TeamCollaboration";
import { ProjectList } from "@/components/dashboard/ProjectList";
import { Reminders, ProjectProgress, TimeTracker } from "@/components/dashboard/DashboardWidgets";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
                    <p className="text-muted-foreground mt-1">
                        Plan, prioritize, and accomplish your tasks with ease.
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button className="bg-[#1e4e3a] hover:bg-[#163c2c] text-white rounded-xl h-11 px-6 shadow-lg shadow-[#1e4e3a]/20">
                        <Plus className="h-4 w-4 mr-2" /> Add Project
                    </Button>
                    <Button variant="outline" className="rounded-xl h-11 px-6 border-slate-200">
                        Import Data
                    </Button>
                </div>
            </div>

            <OverviewCards />

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                {/* Row 2 */}
                <div className="col-span-1 md:col-span-2">
                    <ProjectAnalytics />
                </div>
                <div className="col-span-1">
                    <Reminders />
                </div>
                <div className="col-span-1 row-span-2 h-full"> {/* Spans 2 rows vertically? Grid auto flow might be tricky, let's keep it simple first */}
                    <ProjectList />
                </div>

                {/* Row 3 -  Actually with CSS grid flow, if ProjectList is roughly height of 2 rows, we need to be careful. 
           Standard grid doesn't auto-pack beautifully without helper libs or specific row spans.
           Let's just place them cell by cell for now or nest them.
           
           Better approach: 3 columns layout.
           Col 1 (Width 2): Analytics, Team Collab
           Col 2 (Width 1): Reminders, Project Progress
           Col 3 (Width 1): Project List, Time Tracker
        */}
            </div>

            {/* Alternative Grid Layout to match image better */}
            <div className="grid gap-6 grid-cols-1 xl:grid-cols-4">
                {/* Left Column (2 cols wide on large screens) */}
                <div className="xl:col-span-2 space-y-6">
                    <ProjectAnalytics />
                    <TeamCollaboration />
                </div>

                {/* Middle Column (1 col wide) */}
                <div className="space-y-6">
                    <div className="h-[200px] xl:h-[280px]"> {/* Height matching Analytics somewhat */}
                        <Reminders />
                    </div>
                    <div className="h-[250px]">
                        <ProjectProgress />
                    </div>
                </div>

                {/* Right Column (1 col wide) */}
                <div className="space-y-6">
                    <div className="min-h-[400px]">
                        <ProjectList />
                    </div>
                    <div className="h-[200px]">
                        <TimeTracker />
                    </div>
                </div>
            </div>

        </div>
    );
}
