import { MetricsOverview } from "@/components/dashboard/analytics/MetricsOverview";
import { DetailedCharts } from "@/components/dashboard/analytics/DetailedCharts";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Download } from "lucide-react";

export default function AnalyticsPage() {
    return (
        <div className="flex-1 flex flex-col min-h-0 space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Analytics</h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Detailed insights and performance metrics.
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="outline" className="rounded-full h-11 px-4 border-border text-sm shadow-sm font-semibold bg-card text-foreground hover:bg-muted transition-all">
                        <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" /> 
                        Last 30 Days
                    </Button>
                    <Button className="bg-foreground hover:bg-foreground/90 text-background rounded-full h-11 px-6 shadow-md font-semibold transition-all hover:scale-105">
                        <Download className="h-4 w-4 mr-2" /> Export PDF
                    </Button>
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto min-h-0 space-y-6 pb-6 pr-2 no-scrollbar">
                <MetricsOverview />
                <DetailedCharts />
            </div>
        </div>
    );
}
