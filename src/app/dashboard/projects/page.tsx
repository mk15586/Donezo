import { ProjectCard, Project } from "@/components/dashboard/projects/ProjectCard";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter, LayoutGrid } from "lucide-react";

const projects: Project[] = [
    {
        id: "donezo-dashboard",
        name: "Donezo Dashboard Redesign",
        description: "Complete overhaul of the existing dashboard to match the new Quiet Luxury aesthetic.",
        status: "Active",
        progress: 75,
        dueDate: "Nov 30, 2026",
        members: [{ name: "Alice" }, { name: "Bob" }, { name: "Charlie" }]
    },
    {
        id: "auth-service-v2",
        name: "Authentication Service V2",
        description: "Migrating the legacy auth service to use NextAuth with JWT and OAuth providers.",
        status: "Active",
        progress: 40,
        dueDate: "Dec 15, 2026",
        members: [{ name: "Dave" }, { name: "Eve" }]
    },
    {
        id: "marketing-site",
        name: "Marketing Website Launch",
        description: "Building the new landing page and blog for the upcoming product launch.",
        status: "Completed",
        progress: 100,
        dueDate: "Oct 01, 2026",
        members: [{ name: "Alice" }, { name: "Fiona" }]
    },
    {
        id: "mobile-app-beta",
        name: "Mobile App Beta",
        description: "Developing the React Native companion app for iOS and Android.",
        status: "On Hold",
        progress: 20,
        dueDate: "Feb 28, 2027",
        members: [{ name: "Bob" }, { name: "George" }]
    }
];

export default function ProjectsPage() {
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
                    <Button className="bg-foreground hover:bg-foreground/90 text-background rounded-full h-11 px-6 shadow-md font-semibold transition-all hover:scale-105">
                        <Plus className="h-4 w-4 mr-2" /> New Project
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
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {projects.map(project => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            </div>
        </div>
    );
}
