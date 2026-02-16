import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const teamMembers = [
    {
        name: "Alexandra Deff",
        task: "Working on Github Project Repository",
        status: "Completed",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg",
        statusColor: "bg-green-100 text-green-700 hover:bg-green-100",
    },
    {
        name: "Edwin Adenike",
        task: "Working on Integrate User Authentication System",
        status: "In Progress",
        avatar: "https://randomuser.me/api/portraits/men/2.jpg",
        statusColor: "bg-orange-100 text-orange-700 hover:bg-orange-100",
    },
    {
        name: "Isaac Oluwatemilorun",
        task: "Working on Develop Search and Filter Functionality",
        status: "Pending",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        statusColor: "bg-red-100 text-red-700 hover:bg-red-100",
    },
    {
        name: "David Oshodi",
        task: "Working on Responsive Layout for Homepage",
        status: "In Progress",
        avatar: "https://randomuser.me/api/portraits/men/4.jpg",
        statusColor: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
    },
];

export function TeamCollaboration() {
    return (
        <div className="col-span-2 rounded-2xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Team Collaboration</h3>
                <Button variant="outline" size="sm" className="rounded-full text-xs h-8">+ Add Member</Button>
            </div>
            <div className="space-y-6">
                {teamMembers.map((member) => (
                    <div key={member.name} className="flex items-start justify-between group">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback>{member.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-semibold text-slate-900">{member.name}</p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    <span className="text-slate-400 font-normal">Working on</span> <span className="font-medium text-slate-700">{member.task.replace("Working on ", "")}</span>
                                </p>
                            </div>
                        </div>
                        <Badge variant="secondary" className={`text-[10px] font-medium px-2 py-0.5 pointer-events-none ${member.statusColor}`}>
                            {member.status}
                        </Badge>
                    </div>
                ))}
            </div>
        </div>
    );
}
