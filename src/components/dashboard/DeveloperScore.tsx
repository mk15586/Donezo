import React from 'react';
import { Target, Activity, Code2, CheckCircle2 } from 'lucide-react';

export interface ScoreCategory {
    name: string;
    description: string;
    score: number;
    max: number;
    icon: React.ElementType;
}

export interface DeveloperScoreData {
    totalScore: number;
    maxScore: number;
    categories: ScoreCategory[];
}

interface DeveloperScoreProps {
    scoreData?: DeveloperScoreData;
}

const defaultScoreData: DeveloperScoreData = {
    totalScore: 0,
    maxScore: 1000,
    categories: [
        {
            name: "Consistency",
            description: "Regular contributions",
            score: 0,
            max: 300,
            icon: Activity
        },
        {
            name: "Efficiency",
            description: "Timelines met",
            score: 0,
            max: 300,
            icon: Target
        },
        {
            name: "Execution",
            description: "Code runs",
            score: 0,
            max: 200,
            icon: Code2
        },
        {
            name: "Impact",
            description: "Projects completed",
            score: 0,
            max: 200,
            icon: CheckCircle2
        }
    ]
};

export function DeveloperScore({ scoreData = defaultScoreData }: DeveloperScoreProps) {
    const percentage = (scoreData.totalScore / scoreData.maxScore) * 100;
    const strokeDasharray = 214; // 2 * pi * 34
    const strokeDashoffset = strokeDasharray - (strokeDasharray * percentage) / 100;
    const isEmpty = scoreData.totalScore === 0;

    return (
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-base font-semibold text-foreground tracking-tight">Developer Score</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Consistency & Efficiency</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-5 mb-4">
                <div className="relative flex items-center justify-center shrink-0">
                    <svg className="w-24 h-24 transform -rotate-90">
                        <circle
                            cx="48"
                            cy="48"
                            r="34"
                            stroke="currentColor"
                            strokeWidth="7"
                            fill="transparent"
                            className="text-muted/30"
                        />
                        <circle
                            cx="48"
                            cy="48"
                            r="34"
                            stroke="currentColor"
                            strokeWidth="7"
                            fill="transparent"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            className={isEmpty ? "text-muted transition-all duration-1000 ease-out" : "text-foreground transition-all duration-1000 ease-out"}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-foreground">{scoreData.totalScore}</span>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">/ {scoreData.maxScore}</span>
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                    {isEmpty ? (
                        <>
                            <h4 className="text-lg font-bold text-foreground mb-1.5">No Score Yet</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Complete tasks, meet deadlines, and contribute consistently to calculate your developer score.
                            </p>
                        </>
                    ) : (
                        <>
                            <h4 className="text-lg font-bold text-foreground mb-1.5">
                                {percentage >= 80 ? "Excellent Standing" : percentage >= 50 ? "Good Standing" : "Needs Improvement"}
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                You&apos;re in the top {100 - percentage}% of developers this week. Your consistency and efficiency are driving significant project impact. Keep it up!
                            </p>
                        </>
                    )}
                </div>
            </div>

            <div className="mt-2 flex flex-1 flex-col divide-y divide-border/30">
                {scoreData.categories.map((category, idx) => (
                    <div key={idx} className="flex flex-1 flex-col justify-center gap-2 py-3 first:pt-0 last:pb-0">
                        <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <category.icon className="w-3.5 h-3.5 text-muted-foreground" />
                                <div className="flex flex-col">
                                    <span className="font-medium text-foreground leading-none">{category.name}</span>
                                    <span className="text-[9px] text-muted-foreground mt-0.5">{category.description}</span>
                                </div>
                            </div>
                            <span className="text-muted-foreground font-mono text-[11px]">
                                <span className="text-foreground font-semibold text-xs">{category.score}</span> / {category.max}
                            </span>
                        </div>
                        <div className="h-1 w-full bg-muted/30 rounded-full overflow-hidden">
                            <div
                                className={isEmpty ? "h-full bg-muted transition-all duration-1000" : "h-full bg-foreground rounded-full transition-all duration-1000"}
                                style={{ width: `${(category.score / category.max) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
