"use client";

import { Input } from "@/components/ui/input";
import { Search, Bell, Mail, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/dashboard/Sidebar";

export function Header() {
    return (
        <div className="border-b">
            <div className="flex h-16 items-center px-4 md:px-6">
                <div className="flex items-center gap-4 flex-1">
                    {/* Mobile Sidebar Trigger */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-64 border-r-0 bg-transparent text-white">
                            <Sidebar className="w-full border-r-0" />
                        </SheetContent>
                    </Sheet>

                    {/* Search Bar */}
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search task"
                            className="pl-8 bg-muted/50 border-none w-full md:w-[300px] rounded-xl"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Mail className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Bell className="h-5 w-5" />
                    </Button>

                    <div className="flex items-center gap-3 pl-2 border-l">
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>TM</AvatarFallback>
                        </Avatar>
                        <div className="hidden md:block">
                            <p className="text-sm font-medium">Totok Michael</p>
                            <p className="text-xs text-muted-foreground">tmichael20@mail.com</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
