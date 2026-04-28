import { PlatformConnections } from "@/components/dashboard/version-control/PlatformConnections";
import { RepositoryList } from "@/components/dashboard/version-control/RepositoryList";
import { ActivityFeed } from "@/components/dashboard/version-control/ActivityFeed";
import { Button } from "@/components/ui/button";
import { RefreshCw, Settings2 } from "lucide-react";

export default function VersionControlPage() {
    return (
        <div className="flex-1 flex flex-col min-h-0 space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shrink-0">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Version Control</h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Track repositories, commits, and pull requests across platforms.
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="outline" className="rounded-full h-11 px-4 border-border text-sm shadow-sm font-semibold bg-card text-foreground hover:bg-muted transition-all">
                        <Settings2 className="h-4 w-4 mr-2 text-muted-foreground" /> 
                        Manage Integration
                    </Button>
                    <Button className="bg-foreground hover:bg-foreground/90 text-background rounded-full h-11 px-6 shadow-md font-semibold transition-all hover:scale-105">
                        <RefreshCw className="h-4 w-4 mr-2" /> Sync Now
                    </Button>
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto min-h-0 space-y-6 pb-6 pr-2 no-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-6 flex flex-col">
                        <PlatformConnections />
                        <div className="flex-1 min-h-[400px]">
                            <RepositoryList />
                        </div>
                    </div>
                    <div className="lg:col-span-2 min-h-[600px]">
                        <ActivityFeed />
                    </div>
                </div>
            </div>
        </div>
    );
}
