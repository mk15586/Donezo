import { DepartmentStats } from "@/components/dashboard/team/DepartmentStats";
import { MemberCard, Member } from "@/components/dashboard/team/MemberCard";
import { Button } from "@/components/ui/button";
import { UserPlus, Search, Filter } from "lucide-react";

// Helper to generate random sparkline data
const generateSparkline = () => Array.from({ length: 7 }, () => ({ val: Math.floor(Math.random() * 20) + 5 }));

const teamMembers: Member[] = [
    {
        id: "1", name: "Alexandra Deff", role: "Lead Product Designer", status: "Online", currentTask: "Reviewing dashboard layouts", sparklineData: generateSparkline(),
    },
    {
        id: "2", name: "Edwin Adenike", role: "Senior Frontend Engineer", status: "In a meeting", currentTask: "Client Sync", sparklineData: generateSparkline(),
    },
    {
        id: "3", name: "Isaac Oluwatemilorun", role: "Backend Developer", status: "Online", currentTask: "Optimizing database queries", sparklineData: generateSparkline(),
    },
    {
        id: "4", name: "David Oshodi", role: "Fullstack Engineer", status: "Offline", currentTask: "Resolved API issues", sparklineData: generateSparkline(),
    },
    {
        id: "5", name: "Sarah Jenkins", role: "UX Researcher", status: "Online", currentTask: "Conducting user interviews", sparklineData: generateSparkline(),
    },
    {
        id: "6", name: "Marcus Chen", role: "DevOps Engineer", status: "Online", currentTask: "Monitoring deployment", sparklineData: generateSparkline(),
    },
    {
        id: "7", name: "Emily Watson", role: "Product Manager", status: "In a meeting", currentTask: "Roadmap planning", sparklineData: generateSparkline(),
    },
    {
        id: "8", name: "James Wilson", role: "Frontend Engineer", status: "Offline", currentTask: "Updated React components", sparklineData: generateSparkline(),
    },
];

export default function TeamPage() {
    return (
        <div className="flex-1 flex flex-col min-h-0 space-y-6 pb-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Team Directory</h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Manage roles, monitor velocity, and collaborate.
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="outline" className="rounded-full h-11 px-4 border-border text-sm shadow-sm font-semibold bg-card text-foreground hover:bg-muted transition-all">
                        <Filter className="h-4 w-4 mr-2" /> Filter Roles
                    </Button>
                    <Button className="bg-[#1e4e3a] hover:bg-[#163c2c] text-white rounded-full h-11 px-6 shadow-md dark:bg-emerald-700 dark:hover:bg-emerald-800 font-semibold transition-all hover:scale-105">
                        <UserPlus className="h-4 w-4 mr-2" /> Invite Member
                    </Button>
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto min-h-0 space-y-8 pr-2 no-scrollbar">
                
                <section>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 px-1">Department Overview</h3>
                    <DepartmentStats />
                </section>

                <section>
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Team Roster</h3>
                        <div className="relative max-w-xs w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                            <input 
                                type="text" 
                                placeholder="Search members..." 
                                className="w-full h-9 pl-9 pr-4 rounded-full border border-border bg-card text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground"
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {teamMembers.map((member) => (
                            <MemberCard key={member.id} member={member} />
                        ))}
                    </div>
                </section>
                
            </div>
        </div>
    );
}
