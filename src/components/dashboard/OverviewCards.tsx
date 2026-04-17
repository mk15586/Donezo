import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const cards = [
    {
        title: "Total Projects",
        value: "24",
        subtext: "Increased from last month",
        subtextIcon: "▲",
        isPrimary: true,
    },
    {
        title: "Ended Projects",
        value: "10",
        subtext: "Increased from last month",
        subtextIcon: "▲",
        isPrimary: false,
    },
    {
        title: "Running Projects",
        value: "12",
        subtext: "Increased from last month",
        subtextIcon: "▲",
        isPrimary: false,
    },
    {
        title: "Pending Project",
        value: "2",
        subtext: "On Discuss",
        subtextIcon: "",
        isPrimary: false,
    },
];

export function OverviewCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, i) => (
                <div
                    key={i}
                    className={cn(
                        "rounded-[24px] p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300",
                        card.isPrimary
                            ? "bg-[#1e4e3a] text-white dark:bg-emerald-900 border border-transparent shadow-md"
                            : "bg-card border border-border shadow-sm hover:border-primary/20 hover:shadow-md"
                    )}
                >
                    <div className="flex justify-between items-start mb-6">
                        <span className={cn(
                            "font-semibold text-base",
                            card.isPrimary ? "text-white/90" : "text-foreground"
                        )}>
                            {card.title}
                        </span>
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center border",
                            card.isPrimary
                                ? "bg-white/10 border-white/20 text-white"
                                : "bg-muted border-border text-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                        )}>
                            <ArrowUpRight className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <div className="text-5xl font-bold tracking-tight mb-4 tabular-nums">
                            {card.value}
                        </div>
                        <div className={cn(
                            "text-xs font-medium flex items-center gap-1.5",
                            card.isPrimary ? "text-green-200" : "text-muted-foreground"
                        )}>
                            {card.subtextIcon && (
                                <span className={cn(
                                    "px-1 rounded-sm text-[10px]",
                                    card.isPrimary ? "bg-white/20 text-white" : "bg-muted text-foreground border border-border"
                                )}>
                                    {card.subtextIcon}
                                </span>
                            )}
                            {card.subtext}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
