import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Clock, CheckCircle2, Target, Zap } from "lucide-react";

export function MetricsOverview() {
    const metrics = [
        {
            title: "Average Velocity",
            value: "24 pts",
            trend: "+12%",
            isPositive: true,
            icon: Zap,
        },
        {
            title: "Total Hours",
            value: "164h",
            trend: "-4%",
            isPositive: false,
            icon: Clock,
        },
        {
            title: "Tasks Completed",
            value: "1,248",
            trend: "+8%",
            isPositive: true,
            icon: CheckCircle2,
        },
        {
            title: "Focus Score",
            value: "92%",
            trend: "+2%",
            isPositive: true,
            icon: Target,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0">
            {metrics.map((metric, i) => (
                <div key={i} className="rounded-[24px] bg-card border border-border p-6 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 bg-muted text-foreground">
                            <metric.icon className="w-5 h-5" />
                        </div>
                        <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full text-muted-foreground bg-muted/50 border border-border/50">
                            {metric.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {metric.trend}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-3xl font-bold text-foreground mb-1">{metric.value}</h4>
                        <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
