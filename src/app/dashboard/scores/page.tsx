import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Scorecard } from "@/components/dashboard/scores/Scorecard";
import { calculateDeveloperScore } from "@/lib/scores";

export default async function ScoresPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { stats, currentScore, pointsPool } = await calculateDeveloperScore(user.id, supabase);

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
