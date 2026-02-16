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
            label: "Tasks",
            icon: CheckSquare,
            href: "/dashboard/tasks",
            color: "text-violet-500",
        },
        {
            label: "Calendar",
            icon: Calendar,
            href: "/dashboard/calendar",
            color: "text-pink-700",
        },
        {
            label: "Analytics",
            icon: BarChart3,
            href: "/dashboard/analytics",
            color: "text-orange-700",
        },
        {
            label: "Team",
            icon: Users,
            href: "/dashboard/team",
            color: "text-emerald-500",
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
        <div className={cn("space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white w-64 border-r border-slate-800", className)}>
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <div className="relative h-12 w-12 mr-3 overflow-hidden rounded-lg">
                        <Image
                            src="/DonezoLogo.png"
                            alt="Donezo Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <h1 className="text-2xl font-bold">Donezo</h1>
                </Link>
                <div className="space-y-1">
                    <h3 className="px-3 text-xs font-medium uppercase text-slate-400 mb-2">Menu</h3>
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                pathname === route.href ? "text-white bg-white/10" : "text-slate-400"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="space-y-1 mt-8">
                    <h3 className="px-3 text-xs font-medium uppercase text-slate-400 mb-2">General</h3>
                    {bottomRoutes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                pathname === route.href ? "text-white bg-white/10" : "text-slate-400"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className="h-5 w-5 mr-3 text-slate-400" />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                    <div className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition text-slate-400 mt-2">
                        <div className="flex items-center flex-1">
                            <LogOut className="h-5 w-5 mr-3 text-slate-400" />
                            Logout
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile App Promo Card */}
            <div className="px-3 py-2">
                <div className="bg-gradient-to-br from-green-800 to-black rounded-xl p-4 text-white">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1 bg-white/20 rounded-full"><Zap className="h-3 w-3" /></div>
                    </div>
                    <h4 className="font-semibold text-sm mb-1">Download our Mobile App</h4>
                    <p className="text-xs text-slate-300 mb-3">Get easy in another way</p>
                    <button className="w-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium py-2 rounded-lg transition">Download</button>
                </div>
            </div>
        </div>
    );
}
