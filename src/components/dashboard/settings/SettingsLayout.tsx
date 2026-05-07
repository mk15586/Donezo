"use client";

import { useState, useTransition, useRef } from "react";
import { cn } from "@/lib/utils";
import { User, Bell, Shield, CreditCard, Laptop, Save } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { updateProfile, updateAvatar } from "@/app/dashboard/settings/actions";

const navItems = [
    { id: "account", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "appearance", label: "Appearance", icon: Laptop },
];

export interface InitialData {
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string;
}

export function SettingsLayout({ initialData }: { initialData: InitialData }) {
    const [activeTab, setActiveTab] = useState("account");
    const [isPending, startTransition] = useTransition();
    const formRef = useRef<HTMLFormElement>(null);

    const handleSave = () => {
        if (formRef.current) {
            formRef.current.requestSubmit();
        }
    };

    return (
        <div className="flex flex-col flex-1 min-h-0">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shrink-0 mb-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Settings</h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Manage your account preferences and configurations.
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="outline" className="rounded-full h-11 px-6 border-border text-sm shadow-sm font-semibold bg-card text-foreground hover:bg-muted transition-all">
                        Discard
                    </Button>
                    <Button 
                        onClick={handleSave} 
                        disabled={isPending}
                        className="bg-foreground hover:bg-foreground/90 text-background rounded-full h-11 px-6 shadow-md font-semibold transition-all hover:scale-105"
                    >
                        <Save className="h-4 w-4 mr-2" /> 
                        {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 flex-1 min-h-0 pt-4">
            {/* Left Sidebar Navigation */}
            <div className="w-full lg:w-[200px] shrink-0 border-r border-border/30 pr-6">
                <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 no-scrollbar">
                    {navItems.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap lg:whitespace-normal",
                                    isActive 
                                        ? "bg-foreground text-background" 
                                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                )}
                            >
                                <item.icon className={cn("w-4 h-4", isActive ? "text-background" : "text-muted-foreground")} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-6 no-scrollbar max-w-3xl">
                {activeTab === "account" && (
                    <AccountSettings 
                        initialData={initialData} 
                        formRef={formRef} 
                        startTransition={startTransition} 
                    />
                )}
                {activeTab === "notifications" && <NotificationSettings />}
                {["security", "billing", "appearance"].includes(activeTab) && (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground opacity-50">
                        <p className="text-[10px] uppercase tracking-widest font-bold">Configuration Pending</p>
                    </div>
                )}
            </div>
        </div>
        </div>
    );
}

// ----------------------------------------------------------------------
// Sub-Components for Tabs
// ----------------------------------------------------------------------

function AccountSettings({ 
    initialData, 
    formRef, 
    startTransition 
}: { 
    initialData: InitialData; 
    formRef: React.RefObject<HTMLFormElement | null>;
    startTransition: React.TransitionStartFunction;
}) {
    const initials = (initialData.firstName.charAt(0) + initialData.lastName.charAt(0)).toUpperCase() || "US";
    const [avatarUrl, setAvatarUrl] = useState(initialData.avatarUrl || "/avatars/01.png");

    const generateRandomAvatar = () => {
        const seed = Math.random().toString(36).substring(2, 10);
        const newUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
        setAvatarUrl(newUrl);
        startTransition(() => {
            updateAvatar(newUrl);
        });
    };

    const removeAvatar = () => {
        setAvatarUrl("");
        startTransition(() => {
            updateAvatar("");
        });
    };

    return (
        <form 
            ref={formRef} 
            action={(formData) => startTransition(() => { updateProfile(formData); })}
            className="space-y-16 pb-16"
        >
            <input type="hidden" name="avatarUrl" value={avatarUrl} />
            {/* Profile Picture */}
            <section className="space-y-6">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border/30 pb-2">Avatar</h3>
                <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20 border border-border shadow-sm bg-muted/50">
                        {avatarUrl && <AvatarImage src={avatarUrl} />}
                        <AvatarFallback className="text-xl font-bold bg-muted text-foreground">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start gap-1">
                        <button type="button" onClick={generateRandomAvatar} className="text-sm font-semibold text-foreground hover:opacity-70 transition-opacity">Change Avatar</button>
                        <button type="button" onClick={removeAvatar} className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground hover:text-red-500 transition-colors">Remove</button>
                    </div>
                </div>
            </section>

            {/* Personal Details */}
            <section className="space-y-6">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border/30 pb-2">Personal Details</h3>
                
                <div className="rounded-2xl border border-border/50 bg-card/30 overflow-hidden flex flex-col">
                    <div className="flex flex-col sm:flex-row">
                        <div className="flex-1 p-4 border-b sm:border-b-0 sm:border-r border-border/50 focus-within:bg-muted/30 transition-colors">
                            <label htmlFor="firstName" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">First Name</label>
                            <input id="firstName" name="firstName" type="text" defaultValue={initialData.firstName} className="w-full bg-transparent text-sm font-medium text-foreground focus:outline-none" required />
                        </div>
                        <div className="flex-1 p-4 focus-within:bg-muted/30 transition-colors border-b sm:border-b-0 border-border/50">
                            <label htmlFor="lastName" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Last Name</label>
                            <input id="lastName" name="lastName" type="text" defaultValue={initialData.lastName} className="w-full bg-transparent text-sm font-medium text-foreground focus:outline-none" required />
                        </div>
                    </div>
                    <div className="p-4 border-t border-border/50 bg-muted/10">
                        <label htmlFor="email" className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Email Address (Read-only)</label>
                        <input id="email" name="email" type="email" defaultValue={initialData.email} className="w-full bg-transparent text-sm font-medium text-muted-foreground focus:outline-none cursor-not-allowed" readOnly disabled />
                    </div>
                </div>
            </section>

            {/* Danger Zone */}
            <section className="space-y-6">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-red-500/70 border-b border-red-500/10 pb-2">Danger Zone</h3>
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-semibold text-foreground">Delete Account</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">Permanently remove all associated data. This action cannot be undone.</p>
                    </div>
                    <button type="button" className="text-[10px] font-bold uppercase tracking-wider bg-transparent border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-full transition-all">
                        Delete
                    </button>
                </div>
            </section>
        </form>
    );
}

function NotificationSettings() {
    return (
        <div className="space-y-16 pb-16">
            <section className="space-y-6">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border/30 pb-2">Email Preferences</h3>
                
                <div className="rounded-2xl border border-border/50 bg-card/30 overflow-hidden divide-y divide-border/50">
                    <ToggleRow title="Weekly Digest" description="Summary of team velocity." defaultChecked={true} />
                    <ToggleRow title="Mentions" description="When someone tags you." defaultChecked={true} />
                    <ToggleRow title="Task Updates" description="Changes to your assigned tasks." defaultChecked={false} />
                </div>
            </section>

            <section className="space-y-6">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border/30 pb-2">System Alerts</h3>
                
                <div className="rounded-2xl border border-border/50 bg-card/30 overflow-hidden divide-y divide-border/50">
                    <ToggleRow title="Direct Messages" description="Real-time chat alerts." defaultChecked={true} />
                    <ToggleRow title="Security Notices" description="Critical system updates." defaultChecked={true} />
                </div>
            </section>
        </div>
    );
}

// ----------------------------------------------------------------------
// Custom UI Controls
// ----------------------------------------------------------------------

function ToggleRow({ title, description, defaultChecked }: { title: string, description: string, defaultChecked: boolean }) {
    const [checked, setChecked] = useState(defaultChecked);

    return (
        <div className="flex items-center justify-between gap-4 p-4 cursor-pointer hover:bg-muted/20 transition-colors" onClick={() => setChecked(!checked)}>
            <div>
                <h5 className="text-sm font-semibold text-foreground">{title}</h5>
                <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            </div>
            
            {/* Strict Monochrome Toggle */}
            <div className={cn(
                "relative w-9 h-5 rounded-full transition-colors duration-300 ease-in-out shrink-0",
                checked ? "bg-foreground" : "bg-muted-foreground/30"
            )}>
                <div className={cn(
                    "absolute top-1 left-1 bg-background w-3 h-3 rounded-full shadow-sm transition-transform duration-300 ease-in-out",
                    checked ? "translate-x-4" : "translate-x-0"
                )} />
            </div>
        </div>
    );
}
