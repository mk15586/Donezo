"use client";

import { Input } from "@/components/ui/input";
import { Search, Bell, Mail, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MailPopover } from "@/components/dashboard/MailPopover";
import { NotificationPopover } from "@/components/dashboard/NotificationPopover";

import { ThemeToggle } from "@/components/ThemeToggle";

export function Header({ userName = "Totok Michael", userEmail = "Lead Operator", userAvatar }: { userName?: string, userEmail?: string, userAvatar?: string }) {
    return (
        <div className="border-b border-border/10 bg-white/95 backdrop-blur-xl dark:bg-background/80">
            <div className="flex min-h-16 items-center gap-3 px-4 py-2 md:px-5 lg:px-6">
                <div className="flex min-w-0 flex-1 items-center gap-4">
                    {/* Mobile Sidebar Trigger */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-none border border-border/20 bg-background md:hidden">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-[17.5rem] border-r-0 bg-transparent text-white">
                            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                            <Sidebar className="w-full border-r-0" />
                        </SheetContent>
                    </Sheet>

                    <div className="hidden shrink-0 flex-col lg:flex">
                        <span className="text-[10px] font-mono uppercase tracking-[0.26em] text-muted-foreground">Operations</span>
                        <span className="text-sm font-semibold tracking-tight text-foreground">Workspace Control</span>
                    </div>

                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search projects, tasks, activity"
                            className="h-10 w-full rounded-none border-border/20 bg-background pl-10 pr-4 text-sm shadow-none placeholder:text-muted-foreground/70 focus-visible:border-foreground focus-visible:ring-0"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                    <ThemeToggle />
                    <MailPopover />
                    <NotificationPopover />

                    <div className="flex items-center gap-3 border-l border-border/10 pl-3">
                        <Avatar className="rounded-none border border-border/20" size="lg">
                            {userAvatar ? (
                                <AvatarImage src={userAvatar} />
                            ) : (
                                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${userName}`} />
                            )}
                            <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="hidden md:block">
                            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">{userEmail || "Operator"}</p>
                            <p className="text-sm font-semibold tracking-tight truncate max-w-[150px]">{userName}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
