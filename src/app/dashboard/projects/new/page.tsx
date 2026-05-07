"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Trash2, ArrowRight, Github, Users, Search } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface Subtask {
    id: string;
    title: string;
}

interface Objective {
    id: string;
    title: string;
    startDateTime?: string;
    dueDateTime?: string;
    priority?: 'Low' | 'Medium' | 'High';
    subtasks: Subtask[];
}

// Dynamic users are fetched below
export default function NewProjectPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const supabase = createClient();

    // Form State - Identity
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [projectCode, setProjectCode] = useState("");

    // Form State - Objectives
    const [objectives, setObjectives] = useState<Objective[]>([]);
    const [newObjTitle, setNewObjTitle] = useState("");
    const [newObjStart, setNewObjStart] = useState("");
    const [newObjDue, setNewObjDue] = useState("");
    const [newObjPriority, setNewObjPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

    // Form State - Integrations & Team
    const [githubSync, setGithubSync] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    interface DBUser {
        id: string;
        name: string;
        role: string;
    }
    const [availableUsers, setAvailableUsers] = useState<DBUser[]>([]);
    const [invitedUsers, setInvitedUsers] = useState<DBUser[]>([]);
    const [githubUsers, setGithubUsers] = useState<DBUser[]>([]);
    const [isSearchingGithub, setIsSearchingGithub] = useState(false);

    const [scrolled, setScrolled] = useState(0);
    const [nowStr, setNowStr] = useState("");

    useEffect(() => {
        const handleScroll = () => {
            const el = document.getElementById("scroll-container");
            if (el) {
                const max = el.scrollHeight - el.clientHeight;
                setScrolled((el.scrollTop / max) * 100);
            }
        };
        const el = document.getElementById("scroll-container");
        if (el) el.addEventListener("scroll", handleScroll);

        // Setup minimum datetime string for validation
        const tzOffset = new Date().getTimezoneOffset() * 60000;
        setNowStr(new Date(Date.now() - tzOffset).toISOString().slice(0, 16));

        return () => {
            if (el) el.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Fetch available users
    useEffect(() => {
        async function fetchUsers() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from('users')
                .select('id, name, role')
                .neq('id', user.id);

            if (data) {
                setAvailableUsers(data);
            }
        }
        fetchUsers();
    }, []);

    // Search GitHub Users Debounced
    useEffect(() => {
        if (!searchQuery.trim() || searchQuery.length < 3) {
            setGithubUsers([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearchingGithub(true);
            try {
                const res = await fetch(`/api/github/search-users?q=${encodeURIComponent(searchQuery)}`);
                if (res.ok) {
                    const data = await res.json();
                    setGithubUsers(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsSearchingGithub(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Auto-generate project code
    useEffect(() => {
        if (name) {
            const words = name.trim().split(/\s+/);
            if (words.length > 1) {
                setProjectCode(words.map(w => w[0]).join('').substring(0, 4).toUpperCase());
            } else {
                const noVowels = name.replace(/[aeiouAEIOU]/g, '');
                if (noVowels.length >= 3) {
                    setProjectCode(noVowels.substring(0, 3).toUpperCase());
                } else {
                    setProjectCode(name.substring(0, 3).toUpperCase());
                }
            }
        } else {
            setProjectCode("");
        }
    }, [name]);

    const handleAddObjective = (e?: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {
        if (e && 'key' in e && e.key !== 'Enter') return;
        if (e) e.preventDefault();

        if (newObjTitle.trim() === "") return;

        if (newObjStart && newObjDue && new Date(newObjDue) < new Date(newObjStart)) {
            toast.error("Invalid Timeline", { description: "Target Horizon cannot be before Commencement." });
            return;
        }

        setObjectives([{
            id: Math.random().toString(36).substring(7),
            title: newObjTitle.trim(),
            startDateTime: newObjStart,
            dueDateTime: newObjDue,
            priority: newObjPriority,
            subtasks: []
        }, ...objectives]);

        setNewObjTitle("");
        setNewObjStart("");
        setNewObjDue("");
        setNewObjPriority("Medium");
    };

    const handleRemoveObjective = (id: string) => {
        setObjectives(objectives.filter(o => o.id !== id));
    };

    const handleAddSubtask = (objectiveId: string, title: string) => {
        setObjectives(objectives.map(obj => {
            if (obj.id === objectiveId) {
                return {
                    ...obj,
                    subtasks: [...obj.subtasks, { id: Math.random().toString(36).substring(7), title }]
                };
            }
            return obj;
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Naming Required", { description: "A project must have a designation." });
            return;
        }

        setIsSubmitting(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            toast.error("Authentication Error", { description: "You must be logged in to provision a project." });
            setIsSubmitting(false);
            return;
        }

        try {
            const { data: projectData, error: projectError } = await supabase
                .from('projects')
                .insert({
                    name: name.trim(),
                    description: description.trim(),
                    status: 'Active',
                    project_code: projectCode,
                    github_sync: githubSync
                })
                .select()
                .single();

            if (projectError) throw projectError;

            const projectId = projectData.id;

            // Insert into project_members to grant the creator access
            // Filter out GitHub users (they have IDs starting with 'github_')
            const validInvitedUsers = invitedUsers.filter(u => !u.id.startsWith('github_'));
            
            const membersToInsert = [
                { project_id: projectId, user_id: user.id },
                ...validInvitedUsers.map(u => ({ project_id: projectId, user_id: u.id }))
            ];

            const { error: memberError } = await supabase
                .from('project_members')
                .insert(membersToInsert);

            if (memberError) throw memberError;

            const finalObjectives = [...objectives];

            // Auto-commit any objective currently typed in the input fields but not yet added
            if (newObjTitle.trim() !== "") {
                if (newObjStart && newObjDue && new Date(newObjDue) < new Date(newObjStart)) {
                    toast.error("Invalid Timeline", { description: "Target Horizon cannot be before Commencement." });
                    setIsSubmitting(false);
                    return;
                }
                finalObjectives.push({
                    id: Math.random().toString(36).substring(7),
                    title: newObjTitle.trim(),
                    startDateTime: newObjStart,
                    dueDateTime: newObjDue,
                    priority: newObjPriority,
                    subtasks: []
                });
            }

            if (finalObjectives.length > 0) {
                // 1. Insert into Tasks
                const tasksToInsert = finalObjectives.map(obj => ({
                    project_id: projectId,
                    title: obj.title,
                    start_date: obj.startDateTime || null,
                    end_date: obj.dueDateTime || null,
                    due_date: obj.dueDateTime || null,
                    status: 'Todo',
                    priority: obj.priority || 'Medium',
                    created_by: user.id
                }));

                const { error: tasksError } = await supabase
                    .from('tasks')
                    .insert(tasksToInsert);

                if (tasksError) throw tasksError;

                // 2. Insert into Timeline Nodes (if they have a target horizon)
                const timelineNodesToInsert = finalObjectives
                    .filter(obj => obj.dueDateTime)
                    .map(obj => {
                        let workload = 0;
                        if (obj.startDateTime && obj.dueDateTime) {
                            const start = new Date(obj.startDateTime);
                            const end = new Date(obj.dueDateTime);
                            workload = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));
                        }
                        return {
                            project_id: projectId,
                            title: obj.title,
                            description: obj.subtasks.length > 0 ? `Subtasks: ${obj.subtasks.map(s => s.title).join(', ')}` : `Timeline for ${obj.title}`,
                            horizon_date: obj.dueDateTime,
                            workload_days: workload,
                            status: 'Active'
                        };
                    });

                if (timelineNodesToInsert.length > 0) {
                    const { error: timelineError } = await supabase
                        .from('timeline_nodes')
                        .insert(timelineNodesToInsert);

                    if (timelineError) throw timelineError;
                }
            }

            toast.success("Project Established", {
                description: "Workspace successfully provisioned and online.",
                className: "bg-foreground text-background border-none rounded-none font-mono uppercase tracking-widest text-xs"
            });

            router.push("/dashboard/projects");
        } catch (err: any) {
            toast.error("Protocol Failed", { description: err.message || "Could not establish project." });
            setIsSubmitting(false);
        }
    };

    const formatDateTime = (dateStr: string) => {
        if (!dateStr) return 'TBD';
        const d = new Date(dateStr);
        return d.toLocaleString('en-US', {
            month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex bg-background text-foreground overflow-hidden selection:bg-foreground selection:text-background">

            {/* Left Editorial Sidebar */}
            <div className="hidden lg:flex w-1/3 xl:w-[30%] border-r border-border/10 flex-col justify-between p-10 xl:p-12 relative bg-zinc-50 dark:bg-[#0a0a0a]">
                <div className="z-10">
                    <Link
                        href="/dashboard/projects"
                        className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors mb-24 group"
                    >
                        <span className="h-8 w-8 rounded-full border border-border/50 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-500">
                            <ArrowLeft className="w-3 h-3" strokeWidth={3} />
                        </span>
                        Cancel
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h1 className="text-5xl xl:text-6xl font-black tracking-tighter leading-[0.92] mb-6">
                            New<br />
                            <span className="text-muted-foreground/30">Project</span>
                        </h1>
                        <p className="text-base text-muted-foreground max-w-xs font-medium leading-relaxed">
                            Define the parameters and mobilize your team for the next major endeavor.
                        </p>
                    </motion.div>
                </div>

                {/* Progress Tracker */}
                <div className="space-y-4 z-10">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-bold">Progress</span>
                        <span className="text-[10px] font-mono tracking-widest">{Math.round(scrolled)}%</span>
                    </div>
                    <div className="w-full h-0.5 bg-border/40 relative overflow-hidden">
                        <motion.div
                            className="absolute top-0 left-0 bottom-0 bg-foreground"
                            style={{ width: `${Math.max(5, scrolled)}%` }}
                            transition={{ ease: "easeOut", duration: 0.2 }}
                        />
                    </div>
                </div>

                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 p-10 xl:p-12 opacity-[0.03] pointer-events-none">
                    <Plus className="w-56 h-56 xl:w-64 xl:h-64" />
                </div>
            </div>

            {/* Right Scrolling Form Area */}
            <div
                id="scroll-container"
                className="w-full lg:w-2/3 xl:w-[70%] h-full overflow-y-auto scroll-smooth relative"
            >
                {/* Mobile Header */}
                <div className="lg:hidden p-6 border-b border-border/10 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-xl z-20">
                    <Link href="/dashboard/projects" className="text-xs font-bold uppercase tracking-widest">
                        Cancel
                    </Link>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold">New Project</span>
                </div>

                <div className="max-w-4xl mx-auto px-6 py-10 lg:px-20 lg:py-24 flex flex-col gap-24">

                    {/* Section 01: Core Identity */}
                    <section className="space-y-12">
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">01</span>
                            <div className="h-px bg-border/40 flex-1" />
                            <span className="text-xs font-mono uppercase tracking-[0.2em] font-bold">Identity</span>
                        </div>

                        <div className="space-y-10">
                            <div className="relative group">
                                <label className="block text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3">Project Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. FoodMine"
                                    className="w-full bg-transparent border-0 border-b border-border/30 pb-3 text-3xl lg:text-5xl font-bold tracking-tight text-foreground placeholder:text-muted-foreground/20 focus:ring-0 focus:border-foreground transition-colors"
                                />
                            </div>

                            <div className="relative group">
                                <label className="block text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Briefly describe the endgame..."
                                    className="w-full bg-transparent border-0 border-b border-border/30 pb-3 text-lg lg:text-xl font-medium text-muted-foreground placeholder:text-muted-foreground/20 focus:ring-0 focus:border-foreground transition-colors resize-none min-h-[84px]"
                                />
                            </div>

                            <div className="pt-2">
                                <div className="relative group w-full md:w-1/2">
                                    <label className="block text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3">Project Code (Auto-generated)</label>
                                    <input
                                        type="text"
                                        value={projectCode}
                                        onChange={(e) => setProjectCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 5))}
                                        placeholder="e.g. FDM"
                                        className="w-full bg-transparent border-0 border-b border-border/30 pb-3 text-xl font-mono text-foreground placeholder:text-muted-foreground/20 focus:ring-0 focus:border-foreground transition-colors uppercase"
                                    />
                                    <p className="text-[10px] text-muted-foreground mt-2 font-mono">Used as a prefix for tasks and issues.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 02: Objectives */}
                    <section className="space-y-12">
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">02</span>
                            <div className="h-px bg-border/40 flex-1" />
                            <span className="text-xs font-mono uppercase tracking-[0.2em] font-bold">Objectives</span>
                        </div>

                        <div>
                            <div className="relative group mb-8">
                                <label className="block text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground mb-3">Task Name</label>
                                <input
                                    type="text"
                                    value={newObjTitle}
                                    onChange={(e) => setNewObjTitle(e.target.value)}
                                    onKeyDown={handleAddObjective}
                                    placeholder="Define a primary task... (Press Enter)"
                                    className="w-full bg-transparent border-0 border-b-2 border-border/50 pb-3 text-xl font-medium text-foreground placeholder:text-muted-foreground/30 focus:ring-0 focus:border-foreground transition-all pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleAddObjective()}
                                    className="absolute right-0 bottom-3 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <Plus className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                                <div className="group">
                                    <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-2">Priority</label>
                                    <select
                                        value={newObjPriority}
                                        onChange={(e) => setNewObjPriority(e.target.value as 'Low' | 'Medium' | 'High')}
                                        className="w-full bg-transparent border-0 border-b border-border/30 pb-2 text-sm font-mono text-foreground focus:ring-0 focus:border-foreground transition-colors cursor-pointer"
                                    >
                                        <option value="Low" className="bg-background text-foreground">Low</option>
                                        <option value="Medium" className="bg-background text-foreground">Medium</option>
                                        <option value="High" className="bg-background text-foreground">High</option>
                                    </select>
                                </div>
                                <div className="group">
                                    <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-2">Commencement (Optional)</label>
                                    <input
                                        type="datetime-local"
                                        value={newObjStart}
                                        min={nowStr}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val && new Date(val) < new Date(nowStr)) {
                                                toast.error("Invalid Date", { description: "Commencement cannot be in the past." });
                                                return;
                                            }
                                            setNewObjStart(val);
                                            // Reset end date if it's now invalid
                                            if (newObjDue && new Date(newObjDue) < new Date(val)) {
                                                setNewObjDue("");
                                            }
                                        }}
                                        className="w-full bg-transparent border-0 border-b border-border/30 pb-2 text-sm font-mono text-foreground focus:ring-0 focus:border-foreground transition-colors cursor-pointer"
                                    />
                                </div>
                                <div className="group">
                                    <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-2">Target Horizon (Optional)</label>
                                    <input
                                        type="datetime-local"
                                        value={newObjDue}
                                        min={newObjStart || nowStr}
                                        disabled={!newObjStart && newObjDue === ""}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (!newObjStart) {
                                                toast.error("Sequence Error", { description: "You must pick a Commencement date first." });
                                                return;
                                            }
                                            if (val && new Date(val) < new Date(newObjStart)) {
                                                toast.error("Invalid Timeline", { description: "Target Horizon cannot be before Commencement." });
                                                return;
                                            }
                                            setNewObjDue(val);
                                        }}
                                        onClick={(e) => {
                                            if (!newObjStart) {
                                                toast.error("Sequence Error", { description: "You must pick a Commencement date before setting a Target Horizon." });
                                            }
                                        }}
                                        className="w-full bg-transparent border-0 border-b border-border/30 pb-2 text-sm font-mono text-foreground focus:ring-0 focus:border-foreground transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 min-h-[180px]">
                                <AnimatePresence mode="popLayout">
                                    {objectives.length === 0 ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="py-12 border border-dashed border-border/30 text-center flex flex-col items-center justify-center text-muted-foreground/50"
                                        >
                                            <p className="font-mono text-xs uppercase tracking-widest">No objectives defined.</p>
                                        </motion.div>
                                    ) : (
                                        objectives.map((obj, i) => (
                                            <motion.div
                                                key={obj.id}
                                                layout
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.3 }}
                                                className="group flex flex-col p-6 bg-muted/5 border border-border/20 hover:border-foreground/30 transition-colors relative"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveObjective(obj.id)}
                                                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500 transition-all p-2 bg-background border border-border/50 rounded-full"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>

                                                <div className="flex flex-col gap-2 w-full pr-10">
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-xs font-mono text-muted-foreground/40">{String(i + 1).padStart(2, '0')}</span>
                                                        <span className="text-lg font-bold text-foreground">{obj.title}</span>
                                                        {obj.priority && (
                                                            <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-sm border ${obj.priority === 'High' ? 'border-red-500/50 text-red-500' :
                                                                    obj.priority === 'Low' ? 'border-blue-500/50 text-blue-500' :
                                                                        'border-border/50 text-muted-foreground'
                                                                }`}>
                                                                {obj.priority}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {(obj.startDateTime || obj.dueDateTime) && (
                                                        <div className="flex items-center gap-3 pl-8">
                                                            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest bg-muted/30 px-2 py-1 rounded-sm">
                                                                {formatDateTime(obj.startDateTime || '')} &rarr; {formatDateTime(obj.dueDateTime || '')}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Subtasks */}
                                                    <div className="pl-8 mt-4 space-y-3">
                                                        {obj.subtasks.map(st => (
                                                            <div key={st.id} className="flex items-center gap-3 text-sm text-foreground">
                                                                <div className="w-1.5 h-1.5 bg-foreground/40 rounded-full" />
                                                                <span className="font-medium">{st.title}</span>
                                                            </div>
                                                        ))}
                                                        <div className="flex items-center gap-3 mt-2">
                                                            <div className="w-1.5 h-1.5 bg-border rounded-full" />
                                                            <input
                                                                type="text"
                                                                placeholder="Add a subtask... (Press Enter)"
                                                                className="text-sm bg-transparent border-b border-border/30 pb-1 focus:ring-0 focus:border-foreground transition-colors w-2/3 md:w-1/2 placeholder:text-muted-foreground/40"
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        e.preventDefault();
                                                                        const val = (e.target as HTMLInputElement).value;
                                                                        if (val.trim()) {
                                                                            handleAddSubtask(obj.id, val);
                                                                            (e.target as HTMLInputElement).value = '';
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </section>

                    {/* Section 03: Integrations & Team */}
                    <section className="space-y-12">
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">03</span>
                            <div className="h-px bg-border/40 flex-1" />
                            <span className="text-xs font-mono uppercase tracking-[0.2em] font-bold">Integrations & Team</span>
                        </div>

                        <div className="space-y-10">
                            {/* GitHub Sync */}
                            <div className="p-6 border border-border/20 flex items-center justify-between group hover:border-foreground/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <Github className="w-8 h-8" />
                                    <div>
                                        <h3 className="text-sm font-bold uppercase tracking-widest">GitHub Repository Sync</h3>
                                        <p className="text-xs text-muted-foreground mt-1">Automatically link commits and synchronize pull requests.</p>
                                    </div>
                                </div>
                                <label className="relative flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={githubSync}
                                        onChange={(e) => setGithubSync(e.target.checked)}
                                    />
                                    <div className="w-11 h-6 bg-muted/50 peer-focus:outline-none rounded-none border border-border/50 peer peer-checked:after:translate-x-full peer-checked:after:border-background after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-muted-foreground after:border-border after:border after:rounded-none after:h-5 after:w-5 after:transition-all peer-checked:bg-foreground peer-checked:after:bg-background"></div>
                                </label>
                            </div>

                            {/* Collaborators */}
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        Collaborators
                                    </h3>
                                    <span className="text-xs font-mono text-muted-foreground bg-muted/30 px-2 py-1">{invitedUsers.length} Invited</span>
                                </div>

                                <div className="border border-border/20 p-6 bg-muted/5">
                                    <div className="relative mb-6">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="text"
                                            placeholder="Search team members by name or handle..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-background border border-border/30 py-3 pl-12 pr-4 text-sm focus:ring-0 focus:border-foreground transition-colors"
                                        />
                                    </div>

                                    <div className="space-y-1 max-h-60 overflow-y-auto pr-2">
                                        {/* Local Donezo Users */}
                                        {availableUsers.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.role.toLowerCase().includes(searchQuery.toLowerCase())).map(user => {
                                            const isInvited = invitedUsers.some(u => u.id === user.id);
                                            return (
                                                <div key={user.id} className="flex items-center justify-between p-4 hover:bg-muted/10 transition-colors border border-transparent hover:border-border/20">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-foreground text-background flex items-center justify-center text-sm font-black uppercase shrink-0">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold">{user.name}</span>
                                                            <span className="text-xs text-muted-foreground mt-0.5 font-mono">{user.role}</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (isInvited) {
                                                                setInvitedUsers(invitedUsers.filter(u => u.id !== user.id));
                                                            } else {
                                                                setInvitedUsers([...invitedUsers, user]);
                                                            }
                                                        }}
                                                        className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${isInvited
                                                                ? 'bg-muted/50 text-muted-foreground hover:bg-red-500/10 hover:text-red-500'
                                                                : 'bg-foreground text-background hover:bg-foreground/90 hover:scale-105'
                                                            }`}
                                                    >
                                                        {isInvited ? 'Remove' : 'Invite'}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                        
                                        {/* GitHub Users */}
                                        {githubUsers.map((user: any) => {
                                            const isInvited = invitedUsers.some(u => u.id === user.id);
                                            return (
                                                <div key={user.id} className="flex items-center justify-between p-4 hover:bg-muted/10 transition-colors border border-transparent hover:border-border/20">
                                                    <div className="flex items-center gap-4">
                                                        <img src={user.avatar_url} alt={user.name} className="w-10 h-10 object-cover bg-muted shrink-0" />
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold flex items-center gap-2">
                                                                {user.name}
                                                                <Github className="w-3 h-3 text-muted-foreground" />
                                                            </span>
                                                            <span className="text-xs text-muted-foreground mt-0.5 font-mono">{user.role}</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (isInvited) {
                                                                setInvitedUsers(invitedUsers.filter(u => u.id !== user.id));
                                                            } else {
                                                                setInvitedUsers([...invitedUsers, user]);
                                                            }
                                                        }}
                                                        className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${isInvited
                                                                ? 'bg-muted/50 text-muted-foreground hover:bg-red-500/10 hover:text-red-500'
                                                                : 'bg-foreground text-background hover:bg-foreground/90 hover:scale-105'
                                                            }`}
                                                    >
                                                        {isInvited ? 'Remove' : 'Invite'}
                                                    </button>
                                                </div>
                                            );
                                        })}

                                        {isSearchingGithub && (
                                            <div className="py-4 text-center text-xs text-muted-foreground font-mono animate-pulse">
                                                Searching GitHub global network...
                                            </div>
                                        )}

                                        {availableUsers.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.role.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && githubUsers.length === 0 && !isSearchingGithub && (
                                            <div className="py-8 text-center text-sm text-muted-foreground font-mono">
                                                No collaborators found. Type a GitHub username!
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Final Action */}
                    <section className="pt-8 pb-24">
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !name.trim()}
                            className="w-full group relative flex items-center justify-between p-6 border border-foreground bg-background hover:bg-foreground hover:text-background transition-all duration-500 disabled:opacity-50 disabled:hover:bg-background disabled:hover:text-foreground disabled:cursor-not-allowed"
                        >
                            <span className="text-2xl lg:text-[1.75rem] font-black tracking-tighter uppercase">
                                {isSubmitting ? 'Initializing...' : 'Create Project'}
                            </span>
                            <div className="w-14 h-14 rounded-full border border-current flex items-center justify-center group-hover:bg-background group-hover:text-foreground transition-colors duration-500">
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                                )}
                            </div>
                        </button>
                    </section>

                </div>
            </div>
        </div>
    );
}

