"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, Cell } from "recharts";

const data = [
    { name: "S", total: 40, type: "striped" },
    { name: "M", total: 60, type: "solid-primary" },
    { name: "T", total: 50, type: "solid-light" },
    { name: "W", total: 75, type: "solid-dark" },
    { name: "T", total: 45, type: "striped" },
    { name: "F", total: 35, type: "striped" },
    { name: "S", total: 55, type: "striped" },
];

export function ProjectAnalytics() {
    return (
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-foreground">Project Analytics</h3>
                <div className="text-xs font-semibold px-2 py-1 bg-muted rounded-md text-muted-foreground flex items-center gap-1">
                    74% <span className="w-2 h-2 rounded-full bg-foreground" />
                </div>
            </div>
            <div className="flex-1 w-full min-h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <pattern id="diagonalHatch" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                                <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/30 dark:text-muted/50" />
                            </pattern>
                        </defs>
                        <XAxis
                            dataKey="name"
                            stroke="currentColor"
                            className="text-muted-foreground font-medium uppercase tracking-widest"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <Tooltip
                            cursor={{ fill: 'currentColor', opacity: 0.03 }}
                            content={({ active, payload }: any) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="rounded-xl border border-border bg-popover text-popover-foreground p-3 shadow-lg flex flex-col items-center">
                                            <span className="font-bold text-xs mb-1 px-2 py-0.5 bg-muted rounded-full">{payload[0].value}%</span>
                                            <div className="w-1.5 h-1.5 rounded-full bg-border" />
                                        </div>
                                    )
                                }
                                return null
                            }}
                        />
                        <Bar
                            dataKey="total"
                            radius={[100, 100, 100, 100]} // Fully rounded pill shape
                            barSize={38}
                        >
                            {
                                data.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={
                                            entry.type === 'striped' ? 'url(#diagonalHatch)' :
                                            entry.type === 'solid-primary' ? 'var(--foreground)' : 
                                            entry.type === 'solid-light' ? 'var(--border)' : 
                                            'var(--muted-foreground)' // solid-dark
                                        } 
                                    />
                                ))
                            }
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
