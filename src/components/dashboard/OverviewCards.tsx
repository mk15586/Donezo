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
                        "rounded-xl p-4 flex flex-col justify-between relative overflow-hidden transition-all duration-300",
                        card.isPrimary
                            ? "bg-foreground text-background border border-transparent shadow-md"
                            : "bg-card border border-border shadow-sm hover:border-foreground/20 hover:shadow-md"
                    )}
                >
                    <div className="flex justify-between items-start mb-6">
                        <span className={cn(
                            "font-semibold text-base",
                            card.isPrimary ? "text-background/90" : "text-foreground"
                        )}>
                            {card.title}
                        </span>
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center border",
                            card.isPrimary
                                ? "bg-background/10 border-background/20 text-background"
                                : "bg-muted border-border text-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                        )}>
                            <ArrowUpRight className="w-4 h-4" />
                        </div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold tracking-tight mb-2 tabular-nums">
                            {card.value}
                        </div>
                        <div className={cn(
                            "text-xs font-medium flex items-center gap-1.5",
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
