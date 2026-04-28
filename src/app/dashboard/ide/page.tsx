"use client";

import React, { useState, useEffect } from "react";
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from "react-resizable-panels";
import { FileExplorer } from "@/components/dashboard/ide/FileExplorer";
import { EditorArea } from "@/components/dashboard/ide/EditorArea";
import { TerminalPanel } from "@/components/dashboard/ide/TerminalPanel";
import { FileItem, FileSystemState } from "@/components/dashboard/ide/types";
import { Github, X, GitBranch } from "lucide-react";

const initialFiles: FileItem[] = [
    { id: '1', name: 'src', type: 'folder', parentId: null },
    { id: '2', name: 'components', type: 'folder', parentId: '1' },
    { id: '3', name: 'Button.tsx', type: 'file', parentId: '2', language: 'typescript', content: 'export const Button = () => <button>Click me</button>;' },
    { id: '4', name: 'App.tsx', type: 'file', parentId: '1', language: 'typescript', content: 'import { Button } from "./components/Button";\n\nexport default function App() {\n  return <div><Button /></div>;\n}' },
    { id: '5', name: 'package.json', type: 'file', parentId: null, language: 'json', content: '{\n  "name": "mock-project",\n  "version": "1.0.0"\n}' },
    { id: '6', name: 'README.md', type: 'file', parentId: null, language: 'markdown', content: '# Mock Project\n\nThis is a mock project for the IDE.' },
];

export default function IDEPage() {
    const [state, setState] = useState<FileSystemState>({
        files: initialFiles,
        openFiles: [],
        activeFileId: null
    });

    const [isRepoModalOpen, setIsRepoModalOpen] = useState(false);

    const mockRepositories = [
        { id: '1', name: 'donezo-frontend', owner: 'mk15586', branch: 'main' },
        { id: '2', name: 'donezo-backend', owner: 'mk15586', branch: 'develop' },
        { id: '3', name: 'auth-service', owner: 'mk15586', branch: 'main' },
    ];

    const loadRepository = (repo: any) => {
        setIsRepoModalOpen(false);
        const repoFiles: FileItem[] = [
            { id: '1', name: 'src', type: 'folder', parentId: null },
            { id: '2', name: 'README.md', type: 'file', parentId: null, language: 'markdown', content: `# ${repo.name}\n\nRepository: ${repo.owner}/${repo.name}\nBranch: ${repo.branch}` },
            { id: '3', name: 'index.ts', type: 'file', parentId: '1', language: 'typescript', content: `console.log("Hello from ${repo.name}");` },
        ];
        setState(prev => ({
            ...prev,
            files: repoFiles,
            openFiles: [],
            activeFileId: null
        }));
    };

    const handleFileClick = (id: string) => {
        setState(prev => {
            const isOpen = prev.openFiles.includes(id);
            return {
                ...prev,
                openFiles: isOpen ? prev.openFiles : [...prev.openFiles, id],
                activeFileId: id
            };
        });
    };

    const handleCreateFile = (parentId: string | null, type: 'file' | 'folder') => {
        const newId = Date.now().toString();
        const newFile: FileItem = {
            id: newId,
            name: type === 'folder' ? 'New Folder' : 'new_file.ts',
            type,
            parentId,
            language: type === 'file' ? 'typescript' : undefined,
            content: type === 'file' ? '' : undefined
        };
        setState(prev => ({
            ...prev,
            files: [...prev.files, newFile]
        }));
    };

    const handleRename = (id: string, newName: string) => {
        setState(prev => {
            const file = prev.files.find(f => f.id === id);
            if (!file) return prev;
            
            // basic language detection on rename
            let language = file.language;
            if (file.type === 'file') {
                if (newName.endsWith('.ts') || newName.endsWith('.tsx')) language = 'typescript';
                else if (newName.endsWith('.js') || newName.endsWith('.jsx')) language = 'javascript';
                else if (newName.endsWith('.json')) language = 'json';
                else if (newName.endsWith('.md')) language = 'markdown';
                else if (newName.endsWith('.html')) language = 'html';
                else if (newName.endsWith('.css')) language = 'css';
            }

            return {
                ...prev,
                files: prev.files.map(f => f.id === id ? { ...f, name: newName, language } : f)
            };
        });
    };

    const handleDelete = (id: string) => {
        // Recursive delete not fully implemented here for simplicity, 
        // ideally we would delete all children too.
        setState(prev => ({
            ...prev,
            files: prev.files.filter(f => f.id !== id && f.parentId !== id),
            openFiles: prev.openFiles.filter(fid => fid !== id),
            activeFileId: prev.activeFileId === id ? (prev.openFiles.filter(fid => fid !== id)[0] || null) : prev.activeFileId
        }));
    };

    const handleCopy = (id: string) => {
        // Mock copy logic: just store the id in a ref or localstorage if needed
        // For simplicity, we could just duplicate it immediately
        setState(prev => {
            const fileToCopy = prev.files.find(f => f.id === id);
            if (!fileToCopy) return prev;
            const newId = Date.now().toString();
            return {
                ...prev,
                files: [...prev.files, { ...fileToCopy, id: newId, name: `${fileToCopy.name} (copy)` }]
            };
        });
    };

    const handlePaste = (parentId: string | null) => {
        // In a real app, read from clipboard/state.
        // Left unimplemented for this mock.
        console.log("Paste requested at", parentId);
    };

    const handleCloseTab = (id: string) => {
        setState(prev => {
            const newOpenFiles = prev.openFiles.filter(fid => fid !== id);
            return {
                ...prev,
                openFiles: newOpenFiles,
                activeFileId: prev.activeFileId === id ? (newOpenFiles[newOpenFiles.length - 1] || null) : prev.activeFileId
            };
        });
    };

    const handleEditorChange = (id: string, value: string | undefined) => {
        setState(prev => ({
            ...prev,
            files: prev.files.map(f => f.id === id ? { ...f, content: value || '' } : f)
        }));
    };

    // Calculate open files array for EditorArea
    const openFilesData = state.openFiles.map(id => state.files.find(f => f.id === id)).filter(Boolean) as FileItem[];

    return (
        <div className="h-full w-full bg-background overflow-hidden flex flex-col border border-border rounded-xl shadow-sm relative">
            <PanelGroup orientation="vertical">
                {/* Top Section: Explorer & Editor */}
                <Panel defaultSize="75" minSize="30">
                    <PanelGroup orientation="horizontal">
                        {/* Sidebar */}
                        <Panel defaultSize="20" minSize="15" maxSize="40">
                            <FileExplorer 
                                files={state.files}
                                activeFileId={state.activeFileId}
                                onFileClick={handleFileClick}
                                onCreateFile={handleCreateFile}
                                onRename={handleRename}
                                onDelete={handleDelete}
                                onCopy={handleCopy}
                                onPaste={handlePaste}
                                onOpenRepository={() => setIsRepoModalOpen(true)}
                            />
                        </Panel>

                        <PanelResizeHandle className="w-1 bg-border hover:bg-sky-500 transition-colors cursor-col-resize" />

                        {/* Editor */}
                        <Panel defaultSize="80" minSize="30">
                            <EditorArea
                                openFiles={openFilesData}
                                activeFileId={state.activeFileId}
                                onTabClick={(id) => setState(prev => ({ ...prev, activeFileId: id }))}
                                onCloseTab={handleCloseTab}
                                onChange={handleEditorChange}
                            />
                        </Panel>
                    </PanelGroup>
                </Panel>

                <PanelResizeHandle className="h-1 bg-border hover:bg-sky-500 transition-colors cursor-row-resize" />

                {/* Bottom Section: Terminal */}
                <Panel defaultSize="25" minSize="10">
                    <TerminalPanel />
                </Panel>
            </PanelGroup>

            {/* Repository Selection Modal */}
            {isRepoModalOpen && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-card border border-border rounded-xl shadow-lg w-full max-w-md overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                            <div className="flex items-center gap-2">
                                <Github className="w-5 h-5" />
                                <span className="font-semibold">Open Repository</span>
                            </div>
                            <button 
                                onClick={() => setIsRepoModalOpen(false)}
                                className="p-1 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-4 flex flex-col gap-2">
                            <p className="text-sm text-muted-foreground mb-2">Select a repository synced with your platform:</p>
                            {mockRepositories.map(repo => (
                                <button
                                    key={repo.id}
                                    onClick={() => loadRepository(repo)}
                                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-foreground/50 hover:bg-muted/30 transition-all text-left"
                                >
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm text-foreground">{repo.name}</span>
                                        <span className="text-xs text-muted-foreground">{repo.owner}/{repo.name}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded text-xs text-muted-foreground">
                                        <GitBranch className="w-3 h-3" />
                                        {repo.branch}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
