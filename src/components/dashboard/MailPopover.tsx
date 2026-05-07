"use client";

import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const SAMPLE_MESSAGES = [
    {
        id: 1,
        sender: "System Admin",
        subject: "Project Invite: Nexus Rebuild",
        preview: "You have been invited to join the Nexus Rebuild project team.",
        time: "10m ago",
        unread: true,
    },
    {
        id: 2,
        sender: "Sarah Jenkins",
        subject: "Re: API Documentation",
        preview: "I left a comment on the latest PR. The endpoints look good but...",
        time: "2h ago",
        unread: true,
    },
    {
        id: 3,
        sender: "GitHub Actions",
        subject: "Build Failed: donezo-core",
        preview: "Workflow 'Production Build' failed on branch main.",
        time: "1d ago",
        unread: false,
    }
];

export function MailPopover() {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hidden rounded-none border border-border/20 bg-background sm:flex">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {/* Unread indicator dot */}
                    <div className="absolute right-[8px] top-[8px] h-1.5 w-1.5 rounded-full bg-black dark:bg-white" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0 rounded-none border border-border/30 shadow-xl bg-card">
                <div className="flex items-center justify-between border-b border-border/20 p-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-foreground">Inbox</span>
                    <span className="text-xs text-muted-foreground">{SAMPLE_MESSAGES.filter(m => m.unread).length} unread</span>
                </div>
                <div className="flex flex-col divide-y divide-border/10 max-h-[400px] overflow-y-auto no-scrollbar">
                    {SAMPLE_MESSAGES.length === 0 ? (
                        <div className="p-6 text-center text-xs text-muted-foreground">No new messages</div>
                    ) : (
                        SAMPLE_MESSAGES.map(msg => (
                            <div key={msg.id} className="flex flex-col gap-1 p-4 hover:bg-muted/30 cursor-pointer transition-colors relative group">
                                {msg.unread && (
                                    <div className="absolute left-2 top-5 h-1.5 w-1.5 rounded-full bg-black dark:bg-white" />
                                )}
                                <div className="flex items-center justify-between pl-3">
                                    <span className={`text-sm font-semibold tracking-tight ${msg.unread ? 'text-foreground' : 'text-foreground/70'}`}>{msg.sender}</span>
                                    <span className="text-[10px] text-muted-foreground font-mono">{msg.time}</span>
                                </div>
                                <div className="pl-3">
                                    <p className={`text-xs ${msg.unread ? 'text-foreground' : 'text-foreground/70'}`}>{msg.subject}</p>
                                    <p className="text-xs text-muted-foreground truncate">{msg.preview}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="p-2 border-t border-border/20 bg-muted/10">
                    <Button variant="ghost" className="w-full text-xs h-8 rounded-none font-mono tracking-widest uppercase">View All Mail</Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
