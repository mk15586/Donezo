import { TimelineView, TimelineItem } from "@/components/dashboard/timeline/TimelineView";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function TimelinePage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // Get user's projects first
    const { data: memberData } = await supabase.from('project_members').select('project_id').eq('user_id', user.id);
    const projectIds = memberData?.map(m => m.project_id) || [];
    
    let timelineData: any[] = [];
    if (projectIds.length > 0) {
        const { data } = await supabase
            .from('timeline_nodes')
            .select('*')
            .in('project_id', projectIds)
            .order('horizon_date', { ascending: true });
        timelineData = data || [];
    }

    const timelines: TimelineItem[] = (timelineData || []).map((node: any) => {
        const horizonDate = new Date(node.horizon_date);
        const daysRemaining = Math.ceil((horizonDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
        const lastTouchedDate = new Date(node.last_touched_at || node.updated_at || new Date());
        const lastTouchedDaysAgo = Math.max(0, Math.floor((new Date().getTime() - lastTouchedDate.getTime()) / (1000 * 3600 * 24)));

        return {
            id: node.id.substring(0, 8),
            title: node.title,
            description: node.description || "No description provided.",
            remainingTime: daysRemaining > 0 ? `${daysRemaining}d remaining` : `${Math.abs(daysRemaining)}d overdue`,
            status: node.status,
            workload: node.workload_days || 0,
            isExpired: daysRemaining < 0,
            lastTouchedDaysAgo: lastTouchedDaysAgo
        };
    });

    return (
        <div className="flex-1 flex flex-col min-h-0 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Timelines</h2>
                </div>

                <div className="flex items-center space-x-3">
                    <Button className="bg-foreground hover:bg-foreground/90 text-background rounded-full h-11 px-6 shadow-md font-semibold transition-all hover:scale-105">
                        <Plus className="h-4 w-4 mr-2" /> New Timeline
                    </Button>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <TimelineView initialTimelines={timelines} />
            </div>
        </div>
    );
}
