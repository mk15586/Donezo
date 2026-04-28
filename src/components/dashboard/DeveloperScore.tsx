import React from 'react';
import { Target, Activity, Code2, CheckCircle2 } from 'lucide-react';

export function DeveloperScore() {
    const scoreData = {
        totalScore: 780,
        maxScore: 1000,
        categories: [
            {
                name: "Consistency",
                description: "Regular contributions",
                score: 240,
                max: 300,
                icon: Activity
            },
            {
                name: "Efficiency",
                description: "Timelines met",
                score: 280,
                max: 300,
                icon: Target
            },
            {
                name: "Execution",
                description: "Code runs",
                score: 150,
                max: 200,
                icon: Code2
            },
            {
                name: "Impact",
                description: "Projects completed",
                score: 110,
                max: 200,
                icon: CheckCircle2
            }
        ]
    };

    const percentage = (scoreData.totalScore / scoreData.maxScore) * 100;
    const strokeDasharray = 283; // 2 * pi * 45
    const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;

    return (
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-foreground tracking-tight">Developer Score</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Consistency & Efficiency</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
                {/* Circular Gauge */}
                <div className="relative flex items-center justify-center shrink-0">
                    <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                            cx="64"
                            cy="64"
                            r="45"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            className="text-muted/30"
                        />
                        <circle
                            cx="64"
                            cy="64"
                            r="45"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            className="text-foreground transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-foreground">{scoreData.totalScore}</span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">/ {scoreData.maxScore}</span>
                    </div>
                </div>

                {/* Score Summary */}
                <div className="flex-1 text-center md:text-left">
                    <h4 className="text-xl font-bold text-foreground mb-2">Excellent Standing</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        You're in the top 15% of developers this week. Your consistency and efficiency are driving significant project impact. Keep it up!
                    </p>
                </div>
            </div>

            {/* Category Breakdown */}
            <div className="space-y-5 mt-auto">
                {scoreData.categories.map((category, idx) => (
                    <div key={idx} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2.5">
                                <category.icon className="w-4 h-4 text-muted-foreground" />
                                <div className="flex flex-col">
                                    <span className="font-medium text-foreground leading-none">{category.name}</span>
                                    <span className="text-[10px] text-muted-foreground mt-1">{category.description}</span>
                                </div>
                            </div>
                            <span className="text-muted-foreground font-mono text-xs">
                                <span className="text-foreground font-semibold text-sm">{category.score}</span> / {category.max}
                            </span>
                        </div>
                        <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-foreground rounded-full transition-all duration-1000"
                                style={{ width: `${(category.score / category.max) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
