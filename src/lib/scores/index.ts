import { Activity, Target, Code2, CheckCircle2 } from "lucide-react";
import { DeveloperScoreData } from "@/components/dashboard/DeveloperScore";

export async function calculateDeveloperScore(userId: string, supabase: any) {
    // 1. Fetch user's projects
    const { data: memberData } = await supabase.from('project_members').select('project_id').eq('user_id', userId);
    const projectIds = memberData?.map((m: any) => m.project_id) || [];

    let tasks: any[] = [];
    let timelineNodes: any[] = [];

    if (projectIds.length > 0) {
        const { data: tasksData } = await supabase.from('tasks').select('*').in('project_id', projectIds);
        tasks = tasksData || [];

        const { data: nodesData } = await supabase.from('timeline_nodes').select('*').in('project_id', projectIds);
        timelineNodes = nodesData || [];
    }

    // 2. Initialize Statistics
    let currentScore = 0;
    let pointsPool = 0;

    let stats = {
        highTasksCompleted: 0,
        mediumTasksCompleted: 0,
        lowTasksCompleted: 0,
        timelineExtensions: 0,
        inactivityDays: 0, // Removed mock
        codePushes: 0, // Removed mock
        collaborations: 0, // Removed mock
        activeProjects: projectIds.length
    };

    // 3. Process Tasks
    if (tasks) {
        tasks.forEach(task => {
            if (task.status === "Done") {
                if (task.priority === "High") { currentScore += 50; stats.highTasksCompleted++; }
                else if (task.priority === "Medium") { currentScore += 30; stats.mediumTasksCompleted++; }
                else { currentScore += 15; stats.lowTasksCompleted++; }
            } else {
                if (task.priority === "High") pointsPool += 50;
                else if (task.priority === "Medium") pointsPool += 30;
                else pointsPool += 15;
            }
        });
    }

    // 4. Process Timeline Extensions
    if (timelineNodes) {
        timelineNodes.forEach(node => {
            if (node.status === "Renewed") {
                stats.timelineExtensions++;
                currentScore -= 15; // Penalty for extension
            }
        });
    }

    // 5. Add GitHub/Collaboration Mocks & Active Projects
    currentScore += (stats.codePushes * 5); // +5 per daily code push
    currentScore -= (stats.inactivityDays * 2); // -2 per inactive day
    currentScore += (stats.collaborations * 10); // +10 per collaboration
    currentScore += (stats.activeProjects * 50); // +50 per active project

    // Cap the score at 0 if it goes negative
    if (currentScore < 0) currentScore = 0;

    // 6. Format DeveloperScoreData for Dashboard Widget
    // Mapping raw scores into logical max categories
    
    // Consistency: based on code pushes and lack of inactivity (max 300)
    let consistencyScore = (stats.codePushes * 10) - (stats.inactivityDays * 10);
    if (consistencyScore < 0) consistencyScore = 0;
    if (consistencyScore > 300) consistencyScore = 300;

    // Efficiency: based on lack of timeline extensions (max 300)
    let efficiencyScore = 300 - (stats.timelineExtensions * 30);
    if (efficiencyScore < 0) efficiencyScore = 0;

    // Execution: based on completed tasks (max 200)
    let executionScore = (stats.highTasksCompleted * 20) + (stats.mediumTasksCompleted * 10) + (stats.lowTasksCompleted * 5);
    if (executionScore > 200) executionScore = 200;

    // Impact: based on collaborations, high priority tasks, and active projects (max 200)
    let impactScore = (stats.collaborations * 10) + (stats.highTasksCompleted * 10) + (stats.activeProjects * 50);
    if (impactScore > 200) impactScore = 200;

    const totalCategoryScore = consistencyScore + efficiencyScore + executionScore + impactScore;

    const developerScoreData: DeveloperScoreData = {
        totalScore: currentScore, // Use the raw calculated currentScore for the big number display, or totalCategoryScore. We'll use currentScore to match Scorecard.
        maxScore: 1000,
        categories: [
            {
                name: "Consistency",
                description: "Regular contributions",
                score: consistencyScore,
                max: 300,
                icon: Activity
            },
            {
                name: "Efficiency",
                description: "Timelines met",
                score: efficiencyScore,
                max: 300,
                icon: Target
            },
            {
                name: "Execution",
                description: "Task completion",
                score: executionScore,
                max: 200,
                icon: Code2
            },
            {
                name: "Impact",
                description: "Team collaboration",
                score: impactScore,
                max: 200,
                icon: CheckCircle2
            }
        ]
    };

    // 7. Persist to developer_scores table
    await supabase.from('developer_scores').upsert({
        user_id: userId,
        consistency_score: consistencyScore,
        efficiency_score: efficiencyScore,
        execution_score: executionScore,
        impact_score: impactScore,
        last_calculated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });

    return {
        stats,
        currentScore,
        pointsPool,
        developerScoreData
    };
}
