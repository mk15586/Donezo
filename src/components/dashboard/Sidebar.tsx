"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation"; // Correct hook for app router
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import {
    LayoutDashboard,
    CheckSquare,
    Calendar,
    Target,
    Users,
    Settings,
    HelpCircle,
    LogOut,
    Zap,
    GitBranch,
    Code2,
    ArrowUpRight,
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard",
        },
        {
            label: "Projects",
            icon: CheckSquare,
            href: "/dashboard/projects",
        },
        {
            label: "Timeline",
            icon: Calendar,
            href: "/dashboard/timeline",
        },
        {
            label: "Scores",
            icon: Target,
            href: "/dashboard/scores",
        },
        {
            label: "Collaboration",
            icon: Users,
            href: "/dashboard/collaboration",
        },
        {
            label: "Version Control",
            icon: GitBranch,
            href: "/dashboard/version-control",
        },
        {
            label: "Code Editor",
            icon: Code2,
            href: "/dashboard/ide",
        },
    ];

    const bottomRoutes = [
        {
            label: "Settings",
            icon: Settings,
            href: "/dashboard/settings",
        },
        {
            label: "Help",
            icon: HelpCircle,
            href: "/dashboard/help",
        },
    ];

    return (
        <div className={cn("flex h-full w-[17.5rem] flex-col border-r border-border/20 bg-zinc-50 text-foreground dark:bg-[#0a0a0a]", className)}>
            <div className="border-b border-border/10 px-5 py-6">
                <Link href="/dashboard" className="flex items-center gap-3">
                    <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden border border-border/20 bg-background shadow-sm">
                        <Image
                            src="/DonezoLogo.png"
                            alt="Donezo Logo"
                            fill
                            className="object-contain p-1"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-black uppercase tracking-[0.18em] text-foreground">Donezo</span>
                        <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">Control Center</span>
                    </div>
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5">
                <div className="space-y-8">
                    <div>
                        <h3 className="mb-3 px-2 text-[10px] font-mono font-bold uppercase tracking-[0.28em] text-muted-foreground">Command</h3>
                        <div className="space-y-1.5">
                            {routes.map((route) => {
                                const isActive = pathname === route.href;
                                return (
                                    <Link
                                        key={route.href}
                                        href={route.href}
                                        className={cn(
                                            "group flex items-center justify-between border px-3 py-3 text-sm transition-all duration-300",
                                            isActive
                                                ? "border-foreground bg-foreground text-background shadow-[0_10px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_30px_rgba(255,255,255,0.04)]"
                                                : "border-transparent text-muted-foreground hover:border-border/40 hover:bg-background hover:text-foreground"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <route.icon className={cn("h-4 w-4", isActive ? "text-background" : "text-muted-foreground group-hover:text-foreground")} />
                                            <span className={cn("font-medium tracking-tight", isActive && "font-semibold")}>{route.label}</span>
                                        </div>
                                        <ArrowUpRight className={cn("h-3.5 w-3.5 transition-transform", isActive ? "text-background/70" : "text-transparent group-hover:translate-x-0.5 group-hover:text-muted-foreground")} />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-3 px-2 text-[10px] font-mono font-bold uppercase tracking-[0.28em] text-muted-foreground">System</h3>
                        <div className="space-y-1.5">
                            {bottomRoutes.map((route) => {
                                const isActive = pathname === route.href;
                                return (
                                    <Link
                                        key={route.href}
                                        href={route.href}
                                        className={cn(
                                            "group flex items-center gap-3 border px-3 py-3 text-sm transition-all duration-300",
                                            isActive
                                                ? "border-foreground bg-foreground text-background"
                                                : "border-transparent text-muted-foreground hover:border-border/40 hover:bg-background hover:text-foreground"
                                        )}
                                    >
                                        <route.icon className={cn("h-4 w-4", isActive ? "text-background" : "text-muted-foreground group-hover:text-foreground")} />
                                        {route.label}
                                    </Link>
                                );
                            })}
                            <button onClick={handleLogout} className="w-full flex items-center gap-3 border border-transparent px-3 py-3 text-sm font-medium text-muted-foreground transition-all duration-300 hover:border-border/40 hover:bg-background hover:text-foreground">
                                <LogOut className="h-4 w-4 text-muted-foreground" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-auto border-t border-border/10 p-4">
                <div className="relative overflow-hidden border border-border/20 bg-background p-4 transition-colors duration-300 hover:border-foreground/30">
                    <div className="relative z-10">
                        <div className="mb-4 flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">Field Access</span>
                            <Zap className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <h4 className="mb-2 text-lg font-bold leading-tight tracking-tight text-foreground">Bring Donezo<br />to mobile ops</h4>
                        <p className="mb-4 text-xs leading-relaxed text-muted-foreground">Monitor timelines, unblock projects, and keep command within reach.</p>
                        <button className="w-full border border-foreground bg-foreground px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-background transition-colors hover:bg-foreground/90">
                            Download
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
