import { SettingsLayout } from "@/components/dashboard/settings/SettingsLayout";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="flex-1 flex flex-col min-h-0 space-y-6 pb-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
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
                    <Button className="bg-[#1e4e3a] hover:bg-[#163c2c] text-white rounded-full h-11 px-6 shadow-md dark:bg-emerald-700 dark:hover:bg-emerald-800 font-semibold transition-all hover:scale-105">
                        <Save className="h-4 w-4 mr-2" /> Save Changes
                    </Button>
                </div>
            </div>

            {/* Split Pane Layout Area */}
            <SettingsLayout />
        </div>
    );
}
