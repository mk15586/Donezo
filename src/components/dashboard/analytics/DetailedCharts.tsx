"use client";

import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const productivityData = [
    { name: "1", val: 45 }, { name: "2", val: 52 }, { name: "3", val: 49 },
    { name: "4", val: 63 }, { name: "5", val: 58 }, { name: "6", val: 70 },
    { name: "7", val: 75 }, { name: "8", val: 68 }, { name: "9", val: 82 },
    { name: "10", val: 78 }, { name: "11", val: 85 }, { name: "12", val: 92 },
    { name: "13", val: 88 }, { name: "14", val: 95 }, { name: "15", val: 90 },
];

const taskFlowData = [
    { name: "Mon", created: 12, completed: 8 },
    { name: "Tue", created: 18, completed: 15 },
    { name: "Wed", created: 10, completed: 22 },
    { name: "Thu", created: 15, completed: 14 },
    { name: "Fri", created: 8,  completed: 20 },
];

export function DetailedCharts() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
            {/* Primary Area Chart */}
            <div className="lg:col-span-2 rounded-[24px] bg-card border border-border p-6 shadow-sm flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-8 shrink-0">
                    <div>
                        <h3 className="font-semibold text-lg text-foreground mb-1">Productivity Trend</h3>
                        <p className="text-sm text-muted-foreground">Daily output measured in story points.</p>
                    </div>
                    <select className="bg-muted text-foreground text-xs font-semibold px-3 py-1.5 rounded-lg border-transparent focus:ring-0 outline-none cursor-pointer">
                        <option>This Month</option>
                        <option>Last Month</option>
                    </select>
                </div>
                <div className="flex-1 w-full min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={productivityData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-muted-foreground/10 dark:text-muted/30" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                stroke="currentColor" 
                                className="text-muted-foreground text-[10px] font-medium" 
                                dy={10} 
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                stroke="currentColor" 
                                className="text-muted-foreground text-[10px] font-medium" 
                                dx={-10}
                            />
                            <Tooltip 
                                content={({ active, payload }: any) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="rounded-xl border border-border bg-popover text-popover-foreground p-3 shadow-lg flex flex-col gap-1">
                                                <span className="text-xs text-muted-foreground font-semibold">Day {payload[0].payload.name}</span>
                                                <span className="font-bold text-sm text-primary">{payload[0].value} points</span>
                                            </div>
                                        )
                                    }
                                    return null
                                }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="val" 
                                stroke="var(--primary)" 
                                strokeWidth={3} 
                                fillOpacity={1} 
                                fill="url(#colorVal)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Secondary Bar Chart */}
            <div className="lg:col-span-1 rounded-[24px] bg-card border border-border p-6 shadow-sm flex flex-col min-h-0">
                <div className="mb-8 shrink-0">
                    <h3 className="font-semibold text-lg text-foreground mb-1">Task Flow</h3>
                    <p className="text-sm text-muted-foreground">Created vs Completed</p>
                </div>
                <div className="flex-1 w-full min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={taskFlowData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-muted-foreground/10 dark:text-muted/30" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                stroke="currentColor" 
                                className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider" 
                                dy={10} 
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                stroke="currentColor" 
                                className="text-muted-foreground text-[10px] font-medium"
                                dx={-10}
                            />
                            <Tooltip 
                                cursor={{ fill: 'currentColor', opacity: 0.03 }}
                                content={({ active, payload }: any) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="rounded-xl border border-border bg-popover text-popover-foreground p-3 shadow-lg flex flex-col gap-2">
                                                <div className="flex items-center justify-between gap-4">
                                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Created</span>
                                                    <span className="font-bold text-xs">{payload[0].value}</span>
                                                </div>
                                                <div className="flex items-center justify-between gap-4">
                                                    <span className="text-[10px] font-bold text-primary uppercase">Completed</span>
                                                    <span className="font-bold text-xs">{payload[1].value}</span>
                                                </div>
                                            </div>
                                        )
                                    }
                                    return null
                                }}
                            />
                            <Bar dataKey="created" fill="currentColor" className="text-muted-foreground/20 dark:text-muted/50" radius={[4, 4, 0, 0]} barSize={12} />
                            <Bar dataKey="completed" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={12} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
