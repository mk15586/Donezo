"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"; // Correct hook for app router
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    CheckSquare,
    Calendar,
    BarChart3,
    Users,
    Settings,
    HelpCircle,
    LogOut,
    Zap,
    GitBranch,
    Code2,
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();

    const routes = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard",
            color: "text-sky-500",
        },
        {
            label: "Projects",
            icon: CheckSquare,
            href: "/dashboard/projects",
            color: "text-violet-500",
        },
        {
            label: "Timeline",
            icon: Calendar,
            href: "/dashboard/timeline",
            color: "text-pink-700",
        },
        {
            label: "Analytics",
            icon: BarChart3,
            href: "/dashboard/analytics",
            color: "text-orange-700",
        },
        {
            label: "Collaboration",
            icon: Users,
            href: "/dashboard/collaboration",
            color: "text-emerald-500",
        },
        {
            label: "Version Control",
            icon: GitBranch,
            href: "/dashboard/version-control",
            color: "text-slate-500",
        },
        {
            label: "Code Editor",
            icon: Code2,
            href: "/dashboard/ide",
            color: "text-foreground", // using monochrome for new items
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
        <div className={cn("flex flex-col h-full bg-card border-r border-border w-56", className)}>
            <div className="p-5">
                <Link href="/dashboard" className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-white shadow-sm flex items-center justify-center dark:bg-slate-800">
                        <Image
                            src="/DonezoLogo.png"
                            alt="Donezo Logo"
                            fill
                            className="object-contain p-1"
                        />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-foreground">Donezo</span>
                </Link>
            </div>

            <div className="flex-1 px-4 overflow-y-auto">
                <div className="space-y-6">
                    <div>
                        <h3 className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Main Menu</h3>
                        <div className="space-y-1">
                            {routes.map((route) => {
                                const isActive = pathname === route.href;
                                return (
                                    <Link
                                        key={route.href}
                                        href={route.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                            isActive
                                                ? "bg-muted text-foreground"
                                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                        )}
                                    >
                                        <route.icon className={cn("h-5 w-5", isActive ? "text-foreground" : "text-muted-foreground")} />
                                        {route.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <h3 className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Settings</h3>
                        <div className="space-y-1">
                            {bottomRoutes.map((route) => {
                                const isActive = pathname === route.href;
                                return (
                                    <Link
                                        key={route.href}
                                        href={route.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                            isActive
                                                ? "bg-muted text-foreground"
                                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                        )}
                                    >
                                        <route.icon className={cn("h-5 w-5", isActive ? "text-foreground" : "text-muted-foreground")} />
                                        {route.label}
                                    </Link>
                                );
                            })}
                            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors">
                                <LogOut className="h-5 w-5 text-muted-foreground" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile App Promo - Matching Image */}
            <div className="p-4 mt-auto">
                <div className="bg-card border border-border rounded-[20px] p-4 shadow-sm relative overflow-hidden group cursor-pointer">
                    <div className="relative z-10">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mb-3 text-muted-foreground">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m8 12 4 4 4-4"></path><path d="M12 8v8"></path></svg>
                        </div>
                        <h4 className="font-semibold text-foreground mb-1 leading-tight">Download our<br/>Mobile App</h4>
                        <p className="text-[10px] text-muted-foreground mb-4">Get easy in another way</p>
                        <button className="w-full py-2 bg-foreground text-background text-xs font-semibold rounded-xl transition-colors hover:opacity-90">
                            Download
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
