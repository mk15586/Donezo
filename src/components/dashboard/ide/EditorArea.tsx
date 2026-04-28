"use client";

import React from "react";
import Editor from "@monaco-editor/react";
import { FileItem } from "./types";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorAreaProps {
    openFiles: FileItem[];
    activeFileId: string | null;
    onTabClick: (id: string) => void;
    onCloseTab: (id: string) => void;
    onChange: (id: string, value: string | undefined) => void;
}

export function EditorArea({
    openFiles,
    activeFileId,
    onTabClick,
    onCloseTab,
    onChange
}: EditorAreaProps) {
    const activeFile = openFiles.find(f => f.id === activeFileId);

    if (openFiles.length === 0) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-background text-muted-foreground border-b border-border">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"></path><path d="m6 8-4 4 4 4"></path><path d="m14.5 4-5 16"></path></svg>
                    </div>
                    <p className="font-medium">No file is open</p>
                    <p className="text-xs opacity-60 mt-1">Select a file from the explorer</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col bg-background border-b border-border">
            {/* Tabs */}
            <div className="flex overflow-x-auto bg-card border-b border-border scrollbar-hide">
                {openFiles.map(file => {
                    const isActive = file.id === activeFileId;
                    return (
                        <div
                            key={file.id}
                            className={cn(
                                "group flex items-center gap-2 px-3 py-2 min-w-[120px] max-w-[200px] border-r border-border cursor-pointer transition-colors text-sm",
                                isActive ? "bg-background text-foreground" : "text-muted-foreground hover:bg-muted"
                            )}
                            onClick={() => onTabClick(file.id)}
                        >
                            <span className="truncate flex-1 select-none">{file.name}</span>
                            <button
                                className={cn(
                                    "p-0.5 rounded-md hover:bg-muted-foreground/20 transition-opacity",
                                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                )}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onCloseTab(file.id);
                                }}
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 relative">
                {activeFile && (
                    <Editor
                        height="100%"
                        language={activeFile.language || "javascript"}
                        theme="vs-dark" // "Quiet luxury" matches well with vs-dark out of the box, or we could customize
                        value={activeFile.content || ""}
                        onChange={(value) => onChange(activeFile.id, value)}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 14,
                            lineHeight: 24,
                            padding: { top: 16 },
                            fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                            scrollBeyondLastLine: false,
                            smoothScrolling: true,
                            cursorBlinking: "smooth",
                            cursorSmoothCaretAnimation: "on",
                            formatOnPaste: true,
                        }}
                    />
                )}
            </div>
        </div>
    );
}
