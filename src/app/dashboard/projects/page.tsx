import { ProjectCard, Project } from "@/components/dashboard/projects/ProjectCard";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProjectsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");
    
    // Fetch user's projects from Supabase
    const { data: memberData } = await supabase.from('project_members').select('project_id').eq('user_id', user.id);
    const projectIds = memberData?.map(m => m.project_id) || [];
    
    let projectsData: any[] = [];
    if (projectIds.length > 0) {
        const { data } = await supabase
            .from('projects')
            .select('*')
            .in('id', projectIds)
            .order('created_at', { ascending: false });
        projectsData = data || [];
    }

    // Map database projects to component props
    const projects: Project[] = (projectsData || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description || "",
        status: p.status as "Active" | "On Hold" | "Completed",
        progress: p.progress || 0,
        dueDate: p.due_date ? new Date(p.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No Date',
        members: [] // Placeholder for members until project_members mapping is implemented
    }));

    return (
        <div className="flex-1 flex flex-col min-h-0 space-y-6 pb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Projects</h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Manage your active projects and track overall progress.
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="outline" className="rounded-full h-11 px-4 border-border text-sm shadow-sm font-semibold bg-card text-foreground hover:bg-muted transition-all hidden md:flex">
                        <LayoutGrid className="h-4 w-4 mr-2" /> View
                    </Button>
                    <Button variant="outline" className="rounded-full h-11 px-4 border-border text-sm shadow-sm font-semibold bg-card text-foreground hover:bg-muted transition-all">
                        <Filter className="h-4 w-4 mr-2" /> Filter
                    </Button>
                    <Button asChild className="bg-foreground hover:bg-foreground/90 text-background rounded-full h-11 px-6 shadow-md font-semibold transition-all hover:scale-105">
                        <Link href="/dashboard/projects/new">
                            <Plus className="h-4 w-4 mr-2" /> New Project
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="flex items-center shrink-0">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        className="w-full h-11 pl-10 pr-4 rounded-full border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground transition-all text-foreground placeholder:text-muted-foreground"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 pr-2 no-scrollbar">
                {projects.length === 0 ? (
                    <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/10 p-8 text-center">
                        <div>
                            <h3 className="font-semibold text-foreground">No projects yet</h3>
                            <p className="mt-1 text-sm text-muted-foreground">Start by establishing a new initiative.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {projects.map(project => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
