import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface OverviewCardsProps {
    stats: {
        total: number;
        ended: number;
        running: number;
        pending: number;
    }
}

export function OverviewCards({ stats }: OverviewCardsProps) {
    const cards = [
        {
            title: "Total Projects",
            value: stats.total.toString(),
            subtext: "Increased from last month",
            subtextIcon: "â–²",
            isPrimary: true,
        },
        {
            title: "Ended Projects",
            value: stats.ended.toString(),
            subtext: "Increased from last month",
            subtextIcon: "â–²",
            isPrimary: false,
        },
        {
            title: "Running Projects",
            value: stats.running.toString(),
            subtext: "Increased from last month",
            subtextIcon: "â–²",
            isPrimary: false,
        },
        {
            title: "Pending Project",
            value: stats.pending.toString(),
            subtext: "On Discuss",
            subtextIcon: "",
            isPrimary: false,
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, i) => (
                <div
                    key={i}
                    className={cn(
                        "rounded-xl p-3 flex flex-col justify-between relative overflow-hidden transition-all duration-300",
                        card.isPrimary
                            ? "bg-foreground text-background border border-transparent shadow-md"
                            : "bg-card border border-border shadow-sm hover:border-foreground/20 hover:shadow-md"
                    )}
                >
                    <div className="flex justify-between items-start mb-4">
                        <span className={cn(
                            "text-sm font-semibold",
                            card.isPrimary ? "text-background/90" : "text-foreground"
                        )}>
                            {card.title}
                        </span>
                        <div className={cn(
                            "w-7 h-7 rounded-full flex items-center justify-center border",
                            card.isPrimary
                                ? "bg-background/10 border-background/20 text-background"
                                : "bg-muted border-border text-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                        )}>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                    </div>
                    <div>
                        <div className="mb-1.5 text-2xl font-bold tracking-tight tabular-nums">
                            {card.value}
                        </div>
                        <div className={cn(
                            "text-[11px] font-medium flex items-center gap-1.5",
                            card.isPrimary ? "text-background/80" : "text-muted-foreground"
                        )}>
                            {card.subtextIcon && (
                                <span className={cn(
                                    "px-1 rounded-sm text-[10px]",
                                    card.isPrimary ? "bg-background/20 text-background" : "bg-muted text-foreground border border-border"
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
