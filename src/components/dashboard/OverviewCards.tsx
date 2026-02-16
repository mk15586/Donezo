import { ArrowUpRight, ArrowUp, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatProps {
    title: string;
    value: string | number;
    trend?: string;
    description: string;
    icon?: React.ReactNode;
    className?: string;
    dark?: boolean;
}

function StatCard({ title, value, trend, description, className, dark }: StatProps) {
    return (
        <div className={cn("rounded-2xl p-6 flex flex-col justify-between h-40 shadow-sm transition-all hover:shadow-md", dark ? "bg-[#1e4e3a] text-white" : "bg-white border text-slate-900", className)}>
            <div className="flex justify-between items-start">
                <span className={cn("text-sm font-medium", dark ? "text-green-100" : "text-slate-500")}>{title}</span>
                <div className={cn("p-1.5 rounded-full", dark ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600")}>
                    <ArrowUpRight className="h-4 w-4" />
                </div>
            </div>
            <div>
                <div className="text-4xl font-bold mb-2">{value}</div>
                <div className="flex items-center text-xs">
                    {trend && (
                        <span className={cn("flex items-center px-1.5 py-0.5 rounded mr-2 font-medium", dark ? "bg-white/20 text-white" : "bg-green-100 text-green-700")}>
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {trend}
                        </span>
                    )}
                    <span className={cn(dark ? "text-green-100/80" : "text-slate-400")}>{description}</span>
                </div>
            </div>
        </div>
    )
}

export function OverviewCards() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title="Total Projects"
                value="24"
                trend="5+"
                description="Increased from last month"
                dark
            />
            <StatCard
                title="Ended Projects"
                value="10"
                trend="6+"
                description="Increased from last month"
            />
            <StatCard
                title="Running Projects"
                value="12"
                trend="2+"
                description="Increased from last month"
            />
            <StatCard
                title="Pending Project"
                value="2"
                description="On Discuss"
            />
        </div>
    );
}
