"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, MessageSquare, Calendar } from "lucide-react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

export interface Member {
    id: string;
    name: string;
    role: string;
    avatar?: string;
    status: "Online" | "In a meeting" | "Offline";
    currentTask: string;
    sparklineData: { val: number }[];
}

export function MemberCard({ member }: { member: Member }) {
    const isOnline = member.status === "Online";
    const isBusy = member.status === "In a meeting";

    return (
        <div className="rounded-[24px] bg-card border border-border p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col gap-4">
            {/* Header: Avatar + Info */}
            <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                    <Avatar className="h-14 w-14 border border-border bg-muted">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="text-muted-foreground font-semibold">{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className={cn(
                        "absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-background",
                        isOnline ? "bg-emerald-500" : isBusy ? "bg-orange-500" : "bg-muted-foreground"
                    )} />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-foreground truncate">{member.name}</h4>
                    <p className="text-xs font-medium text-primary dark:text-emerald-500 truncate mb-1.5">{member.role}</p>
                    <p className="text-[10px] text-muted-foreground truncate">
                        {isOnline ? "Currently: " : "Last seen: "} 
                        <span className="font-medium text-foreground opacity-80">{member.currentTask}</span>
                    </p>
                </div>
            </div>

            {/* Sparkline Analytics */}
            <div className="mt-2 p-3 rounded-[16px] bg-muted/30 dark:bg-muted/10 border border-transparent group-hover:border-border transition-colors">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Velocity (7d)</span>
                    <span className="text-xs font-semibold text-foreground">
                        {member.sparklineData.reduce((acc, curr) => acc + curr.val, 0)} pts
                    </span>
                </div>
                <div className="h-8 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={member.sparklineData}>
                            <Line 
                                type="monotone" 
                                dataKey="val" 
                                stroke={isOnline ? "var(--primary)" : "#94a3b8"} 
                                strokeWidth={2} 
                                dot={false} 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-auto pt-2 flex items-center justify-between gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground text-foreground transition-colors text-xs font-semibold">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Message
                </button>
                <div className="flex gap-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-muted hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors">
                        <Mail className="w-3.5 h-3.5" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-muted hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors">
                        <Calendar className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
