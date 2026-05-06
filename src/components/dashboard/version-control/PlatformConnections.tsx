"use client";

import { useState, useEffect } from "react";
import { Github, Gitlab, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PlatformConnections() {
    const [isGithubConnected, setIsGithubConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function checkGithub() {
            try {
                const res = await fetch('/api/github/repos');
                if (res.ok) {
                    setIsGithubConnected(true);
                } else {
                    setIsGithubConnected(false);
                }
            } catch (err) {
                setIsGithubConnected(false);
            } finally {
                setIsLoading(false);
            }
        }
        checkGithub();
    }, []);
    return (
        <div className="bg-card border border-border rounded-[24px] p-6 shadow-sm">
            <h3 className="text-lg font-bold text-foreground mb-4">Connected Platforms</h3>
            <div className="space-y-4">
                {/* GitHub */}
                <div className={`flex items-center justify-between p-4 rounded-xl border ${isGithubConnected ? 'border-border bg-muted/20' : 'border-dashed border-border hover:bg-muted/10 transition-colors'}`}>
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isGithubConnected ? 'bg-foreground' : 'border border-border bg-card'}`}>
                            <Github className={`w-5 h-5 ${isGithubConnected ? 'text-background' : 'text-muted-foreground'}`} />
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground text-sm">GitHub</h4>
                            {isLoading ? (
                                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                    <Loader2 className="w-3 h-3 animate-spin" /> Checking...
                                </p>
                            ) : isGithubConnected ? (
                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                    <CheckCircle2 className="w-3 h-3 text-foreground" /> Connected
                                </p>
                            ) : (
                                <p className="text-xs text-muted-foreground mt-0.5">Not connected</p>
                            )}
                        </div>
                    </div>
                    {isLoading ? null : isGithubConnected ? (
                        <Button variant="outline" className="h-8 px-3 text-xs border-border bg-card hover:bg-muted text-foreground cursor-default">
                            Active
                        </Button>
                    ) : (
                        <Button 
                            onClick={() => window.location.href = '/api/github/auth'}
                            className="h-8 px-3 text-xs bg-foreground text-background hover:bg-foreground/90"
                        >
                            Connect
                        </Button>
                    )}
                </div>
                
                {/* GitLab */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-dashed border-border hover:bg-muted/10 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center">
                            <Gitlab className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground text-sm">GitLab</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">Not connected</p>
                        </div>
                    </div>
                    <Button className="h-8 px-3 text-xs bg-foreground text-background hover:bg-foreground/90">
                        Connect
                    </Button>
                </div>
            </div>
        </div>
    );
}
