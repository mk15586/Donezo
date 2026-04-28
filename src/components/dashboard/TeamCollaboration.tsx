import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const teamMembers = [
    {
        name: "Alexandra Deff",
        task: "Working on Github Project Repository",
        status: "Completed",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        statusColor: "bg-muted text-foreground hover:bg-muted/80",
    },
    {
        name: "Edwin Adenike",
        task: "Working on Integrate User Authentication System",
        status: "In Progress",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        statusColor: "bg-muted text-foreground hover:bg-muted/80",
    },
    {
        name: "Isaac Oluwatemilorun",
        task: "Working on Develop Search and Filter Functionality",
        status: "Pending",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        statusColor: "bg-muted text-foreground hover:bg-muted/80",
    },
    {
        name: "David Oshodi",
        task: "Working on Responsive Layout for Homepage",
        status: "In Progress",
        avatar: "https://randomuser.me/api/portraits/men/4.jpg",
        statusColor: "bg-muted text-foreground hover:bg-muted/80",
    },
];

export function TeamCollaboration() {
    return (
        <div className="rounded-[24px] border border-border bg-card p-6 shadow-sm h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg text-foreground">Team Collaboration</h3>
                <Button variant="outline" size="sm" className="rounded-full text-xs h-8 border-border bg-transparent hover:bg-muted font-medium text-foreground">
                    + Add Member
                </Button>
            </div>
            <div className="space-y-4">
                {teamMembers.map((member) => (
                    <div key={member.name} className="flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10 border border-border bg-muted">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback className="text-muted-foreground font-medium text-xs">{member.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-semibold text-foreground mb-0.5">{member.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    <span className="text-muted-foreground">Working on</span> <span className="font-medium text-foreground">{member.task.replace("Working on ", "")}</span>
                                </p>
                            </div>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-1 rounded-sm uppercase tracking-wider dark:bg-opacity-20 ${member.statusColor}`}>
                            {member.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
