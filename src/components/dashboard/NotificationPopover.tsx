"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface NotificationData {
    id: string;
    title: string;
    message: string;
    time: string;
    timestamp: number;
    type: "project" | "task_expiring" | "task_expired";
}

export function NotificationPopover() {
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [hasUnread, setHasUnread] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchNotifications() {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch member projects
            const { data: memberData } = await supabase.from('project_members').select('project_id').eq('user_id', user.id);
            const projectIds = memberData?.map(m => m.project_id) || [];

            let generatedNotifications: NotificationData[] = [];
            const now = new Date();
            const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

            if (projectIds.length > 0) {
                // Fetch recent projects
                const { data: projects } = await supabase.from('projects')
                    .select('*')
                    .in('id', projectIds)
                    .gte('created_at', twentyFourHoursAgo.toISOString());
                
                if (projects) {
                    projects.forEach(p => {
                        generatedNotifications.push({
                            id: `proj-${p.id}`,
                            title: "New Project Created",
                            message: `Project "${p.name}" was recently created.`,
                            time: "Recent",
                            timestamp: new Date(p.created_at).getTime(),
                            type: "project"
                        });
                    });
                }

                // Fetch tasks expiring soon or expired
                const { data: tasks } = await supabase.from('tasks')
                    .select('*')
                    .in('project_id', projectIds)
                    .neq('status', 'Done');
                
                if (tasks) {
                    tasks.forEach(t => {
                        if (!t.due_date) return;
                        const dueDate = new Date(t.due_date);
                        if (dueDate < now) {
                            generatedNotifications.push({
                                id: `task-exp-${t.id}`,
                                title: "Task Expired",
                                message: `Task "${t.title}" is overdue.`,
                                time: "Overdue",
                                timestamp: now.getTime(), // Use now so it always shows up as recent unread until clicked
                                type: "task_expired"
                            });
                        } else if (dueDate <= twentyFourHoursFromNow) {
                            generatedNotifications.push({
                                id: `task-soon-${t.id}`,
                                title: "Task Expiring Soon",
                                message: `Task "${t.title}" is due within 24 hours.`,
                                time: "Soon",
                                timestamp: now.getTime(), // Use now so it triggers unread
                                type: "task_expiring"
                            });
                        }
                    });
                }
            }

            // Sort by most recent timestamp
            generatedNotifications.sort((a, b) => b.timestamp - a.timestamp);
            setNotifications(generatedNotifications);

            // Manage read/unread state based on local storage
            const lastSeenStr = localStorage.getItem("donezo_last_seen_notifications");
            const lastSeen = lastSeenStr ? parseInt(lastSeenStr) : 0;
            
            const highestTimestamp = generatedNotifications.length > 0 ? Math.max(...generatedNotifications.map(n => n.timestamp)) : 0;
            
            if (highestTimestamp > lastSeen && generatedNotifications.length > 0) {
                setHasUnread(true);
            }
            
            setLoading(false);
        }

        fetchNotifications();
        
        // Setup a simple polling interval to check for new notifications every 5 mins
        const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const handleOpenChange = (open: boolean) => {
        if (open && hasUnread) {
            setHasUnread(false);
            localStorage.setItem("donezo_last_seen_notifications", Date.now().toString());
        }
    };

    return (
        <Popover onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-none border border-border/20 bg-background">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    {hasUnread && (
                        <div className="absolute right-[8px] top-[8px] h-1.5 w-1.5 rounded-full bg-black dark:bg-white animate-pulse" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0 rounded-none border border-border/30 shadow-xl bg-card">
                <div className="flex items-center justify-between border-b border-border/20 p-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-foreground">Notifications</span>
                    <span className="text-xs text-muted-foreground">{notifications.length} alerts</span>
                </div>
                <div className="flex flex-col divide-y divide-border/10 max-h-[400px] overflow-y-auto no-scrollbar">
                    {loading ? (
                        <div className="p-6 text-center text-xs text-muted-foreground animate-pulse">Syncing alerts...</div>
                    ) : notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-muted-foreground">No recent notifications</div>
                    ) : (
                        notifications.map(n => (
                            <div key={n.id} className="flex flex-col gap-1 p-4 hover:bg-muted/30 transition-colors">
                                <div className="flex items-center justify-between">
                                    <span className={`text-sm font-semibold tracking-tight text-foreground`}>{n.title}</span>
                                    <span className="text-[10px] text-muted-foreground font-mono">{n.time}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">{n.message}</p>
                            </div>
                        ))
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
