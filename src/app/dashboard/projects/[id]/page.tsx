import { KanbanBoard } from "@/components/dashboard/projects/KanbanBoard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings2, Users } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Task } from "@/components/dashboard/projects/TaskCard";

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // Verify ownership
    const { data: memberData } = await supabase.from('project_members').select('*').eq('project_id', id).eq('user_id', user.id).single();
    if (!memberData) redirect("/dashboard/projects");

    // Fetch project
    const { data: project } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

    if (!project) {
        redirect("/dashboard/projects");
    }

    // Fetch tasks
    const { data: tasksData } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false });

    // Fetch project members count
    const { count: membersCount } = await supabase
        .from('project_members')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', id);

    // Default values if project not found
    const projectName = project?.name || id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    const projectDescription = project?.description || "No description provided.";
    const totalTasks = tasksData ? tasksData.length : 0;
    const totalMembers = membersCount || 1;

    // Map tasksData to Task interface
    const initialTasks: Task[] = (tasksData || []).map(t => ({
        id: t.id,
        title: t.title,
        description: t.description || "",
        priority: t.priority as "Low" | "Medium" | "High",
        status: t.status as "Todo" | "In Progress" | "In Review" | "Done",
        dueDate: t.due_date ? new Date(t.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null,
        startDate: t.start_date ? new Date(t.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null,
        endDate: t.end_date ? new Date(t.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null,
        comments: 0,
        attachments: 0,
        assignees: [] // Placeholder until we map assignees
    }));

    return (
        <div className="flex-1 flex flex-col min-h-0 space-y-6 pb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/projects">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-muted">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">{projectName}</h2>
                        <div className="flex items-center gap-3 mt-1 text-xs font-medium text-muted-foreground">
                            <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {totalMembers} {totalMembers === 1 ? 'Member' : 'Members'}</span>
                            <span>•</span>
                            <span>{project?.status || "Active Project"}</span>
                            <span>•</span>
                            <span>{totalTasks} Tasks</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="outline" className="rounded-full h-11 px-4 border-border text-sm shadow-sm font-semibold bg-card text-foreground hover:bg-muted transition-all">
                        <Settings2 className="h-4 w-4 mr-2" /> Project Settings
                    </Button>
                    {/* The "New Task" button is integrated inside the KanbanBoard header. */}
                </div>
            </div>

            <div className="px-4 md:px-0 shrink-0">
                <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
                    {projectDescription}
                </p>
            </div>

            <div className="flex-1 min-h-0">
                <KanbanBoard projectId={id} initialTasks={initialTasks} />
            </div>
        </div>
    );
}
