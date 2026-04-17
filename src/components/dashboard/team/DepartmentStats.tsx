import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const departments = [
    {
        name: "Engineering",
        headcount: 12,
        velocity: "+15%",
        color: "bg-blue-500",
        members: ["E1", "E2", "E3", "E4", "E5"],
    },
    {
        name: "Design",
        headcount: 5,
        velocity: "+8%",
        color: "bg-orange-500",
        members: ["D1", "D2", "D3"],
    },
    {
        name: "Product",
        headcount: 4,
        velocity: "+4%",
        color: "bg-emerald-500",
        members: ["P1", "P2"],
    },
];

export function DepartmentStats() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
            {departments.map((dept) => (
                <div key={dept.name} className="rounded-[24px] bg-card border border-border p-5 shadow-sm hover:border-primary/30 transition-colors group cursor-pointer flex flex-col justify-between h-32">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className={cn("w-2.5 h-2.5 rounded-full", dept.color)} />
                            <h4 className="font-semibold text-sm text-foreground">{dept.name}</h4>
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground px-2 py-0.5 bg-muted rounded-full">
                            Velocity {dept.velocity}
                        </span>
                    </div>

                    <div className="flex items-end justify-between">
                        <div className="flex -space-x-2 overflow-hidden">
                            {dept.members.slice(0, 4).map((member, i) => (
                                <Avatar key={i} className="inline-block h-8 w-8 rounded-full border-2 border-background">
                                    <AvatarFallback className="bg-muted text-xs font-medium text-foreground">{member}</AvatarFallback>
                                </Avatar>
                            ))}
                            {dept.headcount > 4 && (
                                <div className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground z-10">
                                    +{dept.headcount - 4}
                                </div>
                            )}
                        </div>
                        <span className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                            {dept.headcount}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
