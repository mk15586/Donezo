"use client";

import React, { useState } from "react";
import { FileItem } from "./types";
import {
    Folder,
    FileCode2,
    FileJson,
    FileText,
    FileImage,
    ChevronRight,
    ChevronDown,
    MoreVertical,
    FilePlus,
    FolderPlus,
    Copy,
    Trash2,
    Edit2,
    Scissors,
    ClipboardPaste,
    Github
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FileExplorerProps {
    files: FileItem[];
    activeFileId: string | null;
    onFileClick: (id: string) => void;
    onCreateFile: (parentId: string | null, type: 'file' | 'folder') => void;
    onRename: (id: string, newName: string) => void;
    onDelete: (id: string) => void;
    onCopy: (id: string) => void;
    onPaste: (parentId: string | null) => void;
    onOpenRepository: () => void;
}

export function FileExplorer({
    files,
    activeFileId,
    onFileClick,
    onCreateFile,
    onRename,
    onDelete,
    onCopy,
    onPaste,
    onOpenRepository
}: FileExplorerProps) {
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));
    const [contextMenuId, setContextMenuId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");

    const toggleFolder = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setExpandedFolders(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const getFileIcon = (name: string, type: 'file' | 'folder', isOpen: boolean) => {
        if (type === 'folder') {
            return isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />;
        }
        if (name.endsWith('.ts') || name.endsWith('.tsx') || name.endsWith('.js')) return <FileCode2 className="w-4 h-4 text-muted-foreground" />;
        if (name.endsWith('.json')) return <FileJson className="w-4 h-4 text-muted-foreground" />;
        if (name.endsWith('.png') || name.endsWith('.svg')) return <FileImage className="w-4 h-4 text-muted-foreground" />;
        return <FileText className="w-4 h-4 text-muted-foreground" />;
    };

    const renderTree = (parentId: string | null, depth: number = 0) => {
        const children = files.filter(f => f.parentId === parentId).sort((a, b) => {
            if (a.type === b.type) return a.name.localeCompare(b.name);
            return a.type === 'folder' ? -1 : 1;
        });

        return children.map(file => {
            const isExpanded = expandedFolders.has(file.id);
            const isActive = activeFileId === file.id;
            const isEditing = editingId === file.id;

            return (
                <div key={file.id}>
                    <div
                        className={cn(
                            "flex items-center justify-between group px-2 py-1 cursor-pointer text-sm transition-colors",
                            isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        )}
                        style={{ paddingLeft: `${depth * 12 + 8}px` }}
                        onClick={() => {
                            if (file.type === 'folder') {
                                setExpandedFolders(prev => {
                                    const next = new Set(prev);
                                    if (next.has(file.id)) next.delete(file.id);
                                    else next.add(file.id);
                                    return next;
                                });
                            } else {
                                onFileClick(file.id);
                            }
                        }}
                    >
                        <div className="flex items-center gap-2 flex-1 overflow-hidden">
                            {getFileIcon(file.name, file.type, isExpanded)}
                            {isEditing ? (
                                <input
                                    autoFocus
                                    className="bg-background text-foreground border border-border rounded px-1 w-full text-xs"
                                    value={editValue}
                                    onChange={e => setEditValue(e.target.value)}
                                    onBlur={() => {
                                        if (editValue.trim() && editValue !== file.name) onRename(file.id, editValue);
                                        setEditingId(null);
                                    }}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            if (editValue.trim() && editValue !== file.name) onRename(file.id, editValue);
                                            setEditingId(null);
                                        }
                                        if (e.key === 'Escape') setEditingId(null);
                                    }}
                                />
                            ) : (
                                <span className="truncate">{file.name}</span>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="relative">
                            <button
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-background rounded"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setContextMenuId(contextMenuId === file.id ? null : file.id);
                                }}
                            >
                                <MoreVertical className="w-3 h-3" />
                            </button>

                            {/* Dropdown Menu */}
                            {contextMenuId === file.id && (
                                <div className="absolute right-0 top-full mt-1 w-36 bg-popover border border-border rounded-md shadow-md z-50 py-1"
                                     onClick={e => e.stopPropagation()}
                                >
                                    {file.type === 'folder' && (
                                        <>
                                            <button className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-muted text-left"
                                                onClick={() => { onCreateFile(file.id, 'file'); setContextMenuId(null); }}>
                                                <FilePlus className="w-3 h-3" /> New File
                                            </button>
                                            <button className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-muted text-left"
                                                onClick={() => { onCreateFile(file.id, 'folder'); setContextMenuId(null); }}>
                                                <FolderPlus className="w-3 h-3" /> New Folder
                                            </button>
                                            <div className="h-px bg-border my-1" />
                                        </>
                                    )}
                                    <button className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-muted text-left"
                                        onClick={() => {
                                            setEditingId(file.id);
                                            setEditValue(file.name);
                                            setContextMenuId(null);
                                        }}>
                                        <Edit2 className="w-3 h-3" /> Rename
                                    </button>
                                    <button className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-muted text-left"
                                        onClick={() => { onCopy(file.id); setContextMenuId(null); }}>
                                        <Copy className="w-3 h-3" /> Copy
                                    </button>
                                    {file.type === 'folder' && (
                                        <button className="flex items-center gap-2 w-full px-3 py-1.5 text-xs hover:bg-muted text-left"
                                            onClick={() => { onPaste(file.id); setContextMenuId(null); }}>
                                            <ClipboardPaste className="w-3 h-3" /> Paste
                                        </button>
                                    )}
                                    <div className="h-px bg-border my-1" />
                                    <button className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-red-500 hover:bg-red-500/10 text-left"
                                        onClick={() => { onDelete(file.id); setContextMenuId(null); }}>
                                        <Trash2 className="w-3 h-3" /> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    {file.type === 'folder' && isExpanded && (
                        <div>{renderTree(file.id, depth + 1)}</div>
                    )}
                </div>
            );
        });
    };

    return (
        <div className="h-full w-full flex flex-col bg-card border-r border-border text-foreground text-sm" onClick={() => setContextMenuId(null)}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="font-semibold tracking-tight">EXPLORER</span>
                <div className="flex items-center gap-1">
                    <button className="p-1 text-muted-foreground hover:text-foreground rounded hover:bg-muted transition-colors" onClick={() => onCreateFile(null, 'file')} title="New File">
                        <FilePlus className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-muted-foreground hover:text-foreground rounded hover:bg-muted transition-colors" onClick={() => onCreateFile(null, 'folder')} title="New Folder">
                        <FolderPlus className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-muted-foreground hover:text-foreground rounded hover:bg-muted transition-colors" onClick={() => onPaste(null)} title="Paste here">
                        <ClipboardPaste className="w-4 h-4" />
                    </button>
                </div>
            </div>
            
            <div className="px-3 py-2 border-b border-border bg-muted/20">
                <button 
                    onClick={onOpenRepository}
                    className="w-full flex items-center justify-center gap-2 py-1.5 px-3 text-xs font-medium bg-foreground text-background rounded-md hover:opacity-90 transition-opacity"
                >
                    <Github className="w-3.5 h-3.5" />
                    Open Repository
                </button>
            </div>

            <div className="flex-1 overflow-y-auto py-2">
                {renderTree(null)}
            </div>
        </div>
    );
}
