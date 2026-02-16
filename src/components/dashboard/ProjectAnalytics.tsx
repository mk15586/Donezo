"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, Tooltip } from "recharts";

const data = [
    { name: "S", total: 45 },
    { name: "M", total: 80 },
    { name: "T", total: 100 }, // Highlighted in image
    { name: "W", total: 60 },
    { name: "T", total: 40 },
    { name: "F", total: 30 },
    { name: "S", total: 55 },
];

export function ProjectAnalytics() {
    return (
        <div className="col-span-2 rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-6">
                <h3 className="font-semibold text-lg">Project Analytics</h3>
            </div>
            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            content={({ active, payload }: any) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                                            <div className="grid grid-cols-2 gap-2">
                                                <span className="font-bold text-muted-foreground">Tasks</span>
                                                <span className="font-medium">{payload[0].value}</span>
                                            </div>
                                        </div>
                                    )
                                }
                                return null
                            }}
                        />
                        <Bar
                            dataKey="total"
                            fill="currentColor"
                            radius={[4, 4, 4, 4]}
                            className="fill-[#1e4e3a]"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
