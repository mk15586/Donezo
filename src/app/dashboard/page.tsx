import { ProjectAnalytics } from "@/components/dashboard/ProjectAnalytics";
import { ProjectList } from "@/components/dashboard/ProjectList";
import { Reminders } from "@/components/dashboard/DashboardWidgets";
import { OverviewCards } from "@/components/dashboard/OverviewCards";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-6 pb-8 h-full flex flex-col">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Plan, prioritize, and accomplish your tasks with ease.
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button className="bg-[#1e4e3a] hover:bg-[#163c2c] text-white rounded-full h-11 px-6 shadow-md dark:bg-emerald-700 dark:hover:bg-emerald-800 font-semibold transition-all hover:scale-105">
                        <Plus className="h-4 w-4 mr-2" /> Add Project
                    </Button>
                    <Button variant="outline" className="rounded-full h-11 px-6 border-border text-sm shadow-sm font-semibold bg-card text-foreground hover:bg-muted transition-all">
                        Import Data
                    </Button>
                </div>
            </div>

            <div className="shrink-0">
                <OverviewCards />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
                {/* Left Column (Analytics) - 7/12 */}
                <div className="lg:col-span-7 flex flex-col min-h-0">
                    <ProjectAnalytics />
                </div>
                
                {/* Right Column (Actions) - 5/12 */}
                <div className="lg:col-span-5 flex flex-col gap-6 min-h-0">
                    <div className="shrink-0">
                        <Reminders />
                    </div>
                    <div className="flex-1 min-h-0">
                        <ProjectList />
                    </div>
                </div>
            </div>
        </div>
    );
}
