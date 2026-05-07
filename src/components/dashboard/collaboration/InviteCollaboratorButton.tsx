"use client";

import { useState, useEffect } from "react";
import { UserPlus, Search, Github, Loader2, FolderGit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

export function InviteCollaboratorButton() {
    const [searchQuery, setSearchQuery] = useState("");
    const [githubUsers, setGithubUsers] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [invitedUsers, setInvitedUsers] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    
    // Project selection
    const [projects, setProjects] = useState<any[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string>("");
    const supabase = createClient();

    useEffect(() => {
        if (isOpen) {
            fetchProjects();
        } else {
            setSearchQuery("");
            setGithubUsers([]);
            setSelectedProjectId("");
        }
    }, [isOpen]);

    const fetchProjects = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch projects the user is a member of
        const { data, error } = await supabase
            .from('projects')
            .select(`
                id, 
                name,
                project_members!inner(user_id)
            `)
            .eq('project_members.user_id', user.id);

        if (data) {
            setProjects(data);
            if (data.length > 0) {
                setSelectedProjectId(data[0].id);
            }
        }
    };

    useEffect(() => {
        if (!isOpen || !searchQuery.trim() || searchQuery.length < 3) {
            setGithubUsers([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await fetch(`/api/github/search-users?q=${encodeURIComponent(searchQuery)}`);
                if (res.ok) {
                    const data = await res.json();
                    setGithubUsers(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, isOpen]);

    const handleInvite = async (user: any) => {
        if (!selectedProjectId) {
            toast.error("Select a project", { description: "Please select a project to invite this user to." });
            return;
        }

        try {
            const res = await fetch('/api/github/invite-collaborator', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    project_id: selectedProjectId,
                    github_username: user.name,
                    avatar_url: user.avatar_url
                })
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || 'Failed to send invite');
            }

            setInvitedUsers(prev => [...prev, user.name]);
            toast.success("Invitation Sent", {
                description: `${user.name} has been invited to collaborate.`,
                icon: <Github className="w-4 h-4" />
            });
            
            // Reload page to show new collaborator
            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (err: any) {
            toast.error("Invite Failed", { description: err.message });
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button className="bg-foreground hover:bg-foreground/90 text-background rounded-full h-11 px-6 shadow-md font-semibold transition-all hover:scale-105">
                    <UserPlus className="h-4 w-4 mr-2" /> Invite Collaborator
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[380px] p-0 rounded-[24px] border-border shadow-xl">
                <div className="p-4 border-b border-border/50 flex flex-col gap-4 bg-muted/10 rounded-t-[24px]">
                    <div className="flex items-center gap-2">
                        <Github className="w-5 h-5" />
                        <h4 className="font-bold">Invite via GitHub</h4>
                    </div>

                    {/* Project Selection */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                            <FolderGit2 className="w-3 h-3" /> Target Project
                        </label>
                        <select 
                            value={selectedProjectId}
                            onChange={(e) => setSelectedProjectId(e.target.value)}
                            className="w-full bg-background border border-border py-2 px-3 text-sm font-semibold rounded-xl focus:ring-0 focus:border-foreground transition-colors cursor-pointer appearance-none"
                        >
                            {projects.length === 0 ? (
                                <option disabled value="">No projects available</option>
                            ) : (
                                projects.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))
                            )}
                        </select>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search GitHub global network..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-background border border-border py-2.5 pl-9 pr-4 text-sm font-medium rounded-xl focus:ring-0 focus:border-foreground transition-colors"
                        />
                    </div>
                </div>

                <div className="max-h-[320px] overflow-y-auto p-2 space-y-1 no-scrollbar">
                    {isSearching ? (
                        <div className="py-8 flex flex-col items-center justify-center text-muted-foreground gap-3">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="text-xs font-mono uppercase tracking-widest">Searching...</span>
                        </div>
                    ) : githubUsers.length > 0 ? (
                        githubUsers.map((user) => {
                            const isInvited = invitedUsers.includes(user.name);
                            return (
                                <div key={user.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <img src={user.avatar_url} alt={user.name} className="w-10 h-10 rounded-full border border-border" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold">{user.name}</span>
                                            <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">GitHub User</span>
                                        </div>
                                    </div>
                                    <Button 
                                        variant={isInvited ? "outline" : "default"}
                                        size="sm"
                                        disabled={isInvited || !selectedProjectId}
                                        onClick={() => handleInvite(user)}
                                        className={isInvited ? "text-muted-foreground" : "bg-foreground text-background font-bold"}
                                    >
                                        {isInvited ? "Invited" : "Invite"}
                                    </Button>
                                </div>
                            )
                        })
                    ) : searchQuery.length >= 3 ? (
                        <div className="py-8 text-center text-sm text-muted-foreground font-mono">
                            No users found.
                        </div>
                    ) : (
                        <div className="py-8 text-center text-sm text-muted-foreground font-mono opacity-50">
                            Type a username to search
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
