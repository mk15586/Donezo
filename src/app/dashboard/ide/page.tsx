"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from "react-resizable-panels";
import { FileExplorer } from "@/components/dashboard/ide/FileExplorer";
import { EditorArea } from "@/components/dashboard/ide/EditorArea";
import { TerminalPanel } from "@/components/dashboard/ide/TerminalPanel";
import { FileItem, FileSystemState } from "@/components/dashboard/ide/types";
import { Github, X, GitBranch } from "lucide-react";
import { toast } from "sonner";

const initialFiles: FileItem[] = [
];

export default function IDEPage() {
    const [state, setState] = useState<FileSystemState>({
        files: initialFiles,
        openFiles: [],
        activeFileId: null
    });

    const [isRepoModalOpen, setIsRepoModalOpen] = useState(false);
    const [repositories, setRepositories] = useState<{ id: string; name: string; owner: string; branch: string; description: string }[]>([]);
    const [isLoadingRepos, setIsLoadingRepos] = useState(false);
    const [githubUsername, setGithubUsername] = useState<string | null>(null);
    const [manualUsernameInput, setManualUsernameInput] = useState("");
    const [activeRepo, setActiveRepo] = useState<{ owner: string, name: string, branch: string } | null>(null);

    // 1. Fetch GitHub Username on Mount
    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.user_metadata?.preferred_username) {
                setGithubUsername(user.user_metadata.preferred_username);
            } else if (user?.user_metadata?.user_name) {
                setGithubUsername(user.user_metadata.user_name);
            }
        };
        fetchUser();
    }, []);

    const fetchRepositoriesForUser = (usernameToFetch: string) => {
        setIsLoadingRepos(true);
        fetch(`https://api.github.com/users/${usernameToFetch}/repos?sort=updated&per_page=30`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const formattedRepos = data.map(r => ({
                        id: r.id.toString(),
                        name: r.name,
                        owner: r.owner.login,
                        branch: r.default_branch,
                        description: r.description || "No description"
                    }));
                    setRepositories(formattedRepos);
                    setGithubUsername(usernameToFetch); // Save it for later use
                } else if (data.message) {
                    console.error("GitHub API Error:", data.message);
                }
            })
            .catch(err => console.error("Failed to fetch repos", err))
            .finally(() => setIsLoadingRepos(false));
    };

    // 2. Fetch Repositories when Modal Opens (if username is known)
    useEffect(() => {
        if (isRepoModalOpen && githubUsername && repositories.length === 0) {
            fetchRepositoriesForUser(githubUsername);
        }
    }, [isRepoModalOpen, githubUsername]);

    const loadRepository = async (repo: { name: string; owner: string; branch: string }) => {
        setIsRepoModalOpen(false);
        setActiveRepo({ owner: repo.owner, name: repo.name, branch: repo.branch });
        
        // Wipe existing state to show loading (optional, but good UX)
        setState(prev => ({ ...prev, files: [], openFiles: [], activeFileId: null }));

        try {
            // 3. Fetch Repository Tree
            const res = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.name}/git/trees/${repo.branch}?recursive=1`);
            const data = await res.json();
            
            if (data.tree) {
                const repoFiles: FileItem[] = [];
                
                // Map flat paths to hierarchical FileItems
                data.tree.forEach((node: any) => {
                    const parts = node.path.split('/');
                    const name = parts.pop();
                    const parentPath = parts.length > 0 ? parts.join('/') : null;
                    
                    let language = undefined;
                    if (node.type === 'blob') {
                        if (name.endsWith('.ts') || name.endsWith('.tsx')) language = 'typescript';
                        else if (name.endsWith('.js') || name.endsWith('.jsx')) language = 'javascript';
                        else if (name.endsWith('.json')) language = 'json';
                        else if (name.endsWith('.md')) language = 'markdown';
                        else if (name.endsWith('.html')) language = 'html';
                        else if (name.endsWith('.css')) language = 'css';
                    }

                    repoFiles.push({
                        id: node.path, // Using the full path as the unique ID!
                        name: name,
                        type: node.type === 'tree' ? 'folder' : 'file',
                        parentId: parentPath,
                        language
                    });
                });

                setState(prev => ({
                    ...prev,
                    files: repoFiles,
                    openFiles: [],
                    activeFileId: null
                }));
            }
        } catch (err) {
            console.error("Failed to fetch repository tree", err);
        }
    };

    const handleFileClick = async (id: string) => {
        setState(prev => {
            const isOpen = prev.openFiles.includes(id);
            return {
                ...prev,
                openFiles: isOpen ? prev.openFiles : [...prev.openFiles, id],
                activeFileId: id
            };
        });

        // 4. Lazy-load file content
        const file = state.files.find(f => f.id === id);
        if (file && file.type === 'file' && file.content === undefined && activeRepo) {
            try {
                const res = await fetch(`https://api.github.com/repos/${activeRepo.owner}/${activeRepo.name}/contents/${id}`);
                const data = await res.json();
                
                if (data.content) {
                    // Base64 decode safely
                    const content = decodeURIComponent(escape(window.atob(data.content)));
                    
                    setState(prev => ({
                        ...prev,
                        files: prev.files.map(f => f.id === id ? { ...f, content } : f)
                    }));
                }
            } catch (err) {
                console.error("Failed to fetch file content", err);
            }
        }
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

    const handleSave = (id: string, value: string | undefined) => {
        // Here we would typically push the commit to GitHub if we had a write-access OAuth token.
        // For now, we save it in the local state and notify the user.
        handleEditorChange(id, value);
        toast.success("File saved locally", {
            description: "GitHub write access is required to push commits to the repository."
        });
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
                            {activeRepo && (
                                <div className="absolute top-0 right-0 z-10 p-2">
                                    <div className="flex items-center gap-2 bg-[#2d2d2d] px-3 py-1.5 rounded-md border border-[#3c3c3c]">
                                        <Github className="w-3.5 h-3.5 text-sky-400" />
                                        <span className="font-medium text-xs tracking-wider uppercase text-gray-300">
                                            {activeRepo.owner}/{activeRepo.name}
                                        </span>
                                    </div>
                                </div>
                            )}
                            <EditorArea
                                openFiles={openFilesData}
                                activeFileId={state.activeFileId}
                                onTabClick={(id) => setState(prev => ({ ...prev, activeFileId: id }))}
                                onCloseTab={handleCloseTab}
                                onChange={handleEditorChange}
                                onSave={handleSave}
                            />
                        </Panel>
                    </PanelGroup>
                </Panel>

                <PanelResizeHandle className="h-1 bg-border hover:bg-sky-500 transition-colors cursor-row-resize" />

                {/* Bottom Section: Terminal */}
                <Panel defaultSize="25" minSize="10">
                    <TerminalPanel activeFile={openFilesData.find(f => f.id === state.activeFileId)} />
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
                            <p className="text-sm text-muted-foreground mb-2">
                                {githubUsername 
                                    ? `Select a repository synced from `
                                    : `Enter a GitHub username to load repositories:`
                                }
                                {githubUsername && <span className="font-bold text-foreground">{githubUsername}</span>}
                            </p>
                            
                            {!githubUsername && repositories.length === 0 && !isLoadingRepos && (
                                <div className="flex gap-2 mb-4">
                                    <input 
                                        type="text" 
                                        placeholder="e.g. torvalds"
                                        value={manualUsernameInput}
                                        onChange={(e) => setManualUsernameInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && manualUsernameInput && fetchRepositoriesForUser(manualUsernameInput)}
                                        className="flex-1 bg-background border border-border rounded-md px-3 py-1.5 text-sm outline-none focus:border-foreground transition-colors"
                                    />
                                    <button 
                                        onClick={() => manualUsernameInput && fetchRepositoriesForUser(manualUsernameInput)}
                                        className="bg-foreground text-background px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-foreground/90 transition-colors"
                                    >
                                        Fetch
                                    </button>
                                </div>
                            )}

                            {isLoadingRepos ? (
                                <div className="rounded-lg border border-dashed border-border bg-muted/10 p-6 text-center text-sm text-muted-foreground animate-pulse">
                                    Fetching your repositories...
                                </div>
                            ) : repositories.length === 0 ? (
                                <div className="rounded-lg border border-dashed border-border bg-muted/10 p-6 text-center text-sm text-muted-foreground">
                                    No synced repositories yet.
                                </div>
                            ) : repositories.map(repo => (
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
