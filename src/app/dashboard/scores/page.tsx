import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Scorecard } from "@/components/dashboard/scores/Scorecard";

export default async function ScoresPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // Fetch user's projects first
    const { data: memberData } = await supabase.from('project_members').select('project_id').eq('user_id', user.id);
    const projectIds = memberData?.map(m => m.project_id) || [];
    
    let tasks: any[] = [];
    let timelineNodes: any[] = [];
    
    if (projectIds.length > 0) {
        const { data: tasksData } = await supabase.from('tasks').select('*').in('project_id', projectIds);
        tasks = tasksData || [];
        
        const { data: nodesData } = await supabase.from('timeline_nodes').select('*').in('project_id', projectIds);
        timelineNodes = nodesData || [];
    }
    
    // Developer Score Calculation
    let currentScore = 0;
    let pointsPool = 0;
    
    let stats = {
        highTasksCompleted: 0,
        mediumTasksCompleted: 0,
        lowTasksCompleted: 0,
        timelineExtensions: 0,
        inactivityDays: 0, // Mocked for now until GitHub is wired
        codePushes: 0, // Mocked
        collaborations: 0 // Mocked
    };

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

    if (timelineNodes) {
        // Find nodes that are "Renewed" to count as extensions
        timelineNodes.forEach(node => {
            if (node.status === "Renewed") {
                stats.timelineExtensions++;
                currentScore -= 15; // Penalty for extension
            }
        });
    }

    // Add mocked stats for GitHub (for now)
    stats.codePushes = 24; 
    currentScore += (stats.codePushes * 5); // +5 per daily code push
    
    stats.inactivityDays = 2;
    currentScore -= (stats.inactivityDays * 2); // -2 per inactive day
    
    stats.collaborations = 14;
    currentScore += (stats.collaborations * 10); // +10 per collaboration

    // Cap the score at 0 if it goes negative
    if (currentScore < 0) currentScore = 0;

    return (
        <div className="flex-1 overflow-y-auto bg-background p-4 lg:p-6">
            <div className="mb-4 max-w-5xl">
                <h2 className="text-4xl font-black uppercase tracking-tighter text-foreground mb-2">Developer Scores</h2>
                <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground">Performance Matrices & Operational Tracking</p>
            </div>
            
            <Scorecard currentScore={currentScore} pointsPool={pointsPool} stats={stats} />
        </div>
    );
}
