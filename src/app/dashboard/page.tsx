import { ProjectList } from "@/components/dashboard/ProjectList";
import { Reminders, ReminderData } from "@/components/dashboard/DashboardWidgets";
import { OverviewCards } from "@/components/dashboard/OverviewCards";
import { DashboardAnimationWrapper, DashboardAnimationItem } from "@/components/dashboard/DashboardAnimationWrapper";
import { ExportDataButton } from "@/components/dashboard/ExportDataButton";
import { DeveloperScore } from "@/components/dashboard/DeveloperScore";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { calculateDeveloperScore } from "@/lib/scores";

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login");
    }

    const { data: memberData } = await supabase.from('project_members').select('project_id').eq('user_id', user.id);
    const projectIds = memberData?.map(m => m.project_id) || [];

    let projectsData: any[] = [];
    let tasksData: any[] = [];

    if (projectIds.length > 0) {
        const { data: pData } = await supabase.from('projects')
            .select('*')
            .in('id', projectIds)
            .order('created_at', { ascending: false });
        projectsData = pData || [];

        const { data: tData } = await supabase.from('tasks')
            .select('*')
            .in('project_id', projectIds)
            .order('due_date', { ascending: true })
            .limit(5);
        tasksData = tData || [];
    }

    const projects = projectsData || [];
    const tasks = tasksData || [];

    const stats = {
        total: projects.length,
        ended: projects.filter((p: any) => p.status === 'Completed').length,
        running: projects.filter((p: any) => p.status === 'Active').length,
        pending: projects.filter((p: any) => p.status === 'On Hold').length
    };

    const dashboardProjects = projects.map((p: any) => ({
        title: p.name,
        date: p.due_date ? new Date(p.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No Date',
        status: p.status,
        priority: 'High'
    }));

    const reminders: ReminderData[] = tasks.map((t: any) => ({
        title: t.title,
        type: 'Task',
        time: t.due_date ? new Date(t.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : undefined
    }));
    const { developerScoreData } = await calculateDeveloperScore(user.id, supabase);

    const exportPayload = {
        generatedAt: new Date().toISOString(),
        overviewStats: stats,
        developerScore: {
            ...developerScoreData,
            categories: developerScoreData.categories.map(({ icon, ...rest }) => rest)
        },
        projects: projects,
        tasks: tasks
    };

    return (
        <DashboardAnimationWrapper>
            <DashboardAnimationItem className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Plan, prioritize, and accomplish your tasks with ease.
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button asChild className="bg-foreground hover:bg-foreground/90 text-background rounded-full h-11 px-6 shadow-md font-semibold transition-all hover:scale-105">
                        <Link href="/dashboard/projects/new">
                            <Plus className="h-4 w-4 mr-2" /> Add Project
                        </Link>
                    </Button>
                    <ExportDataButton data={exportPayload} />
                </div>
            </DashboardAnimationItem>

            <DashboardAnimationItem className="shrink-0">
                <OverviewCards stats={stats} />
            </DashboardAnimationItem>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:grid-rows-[auto_auto]">
                <DashboardAnimationItem className="lg:col-span-7 lg:row-span-2 lg:h-full">
                    <DeveloperScore scoreData={developerScoreData} />
                </DashboardAnimationItem>

                <DashboardAnimationItem className="lg:col-span-5">
                    <Reminders reminders={reminders} />
                </DashboardAnimationItem>

                <DashboardAnimationItem className="lg:col-span-5">
                    <ProjectList projects={dashboardProjects} />
                </DashboardAnimationItem>
            </div>
        </DashboardAnimationWrapper>
    );
}
