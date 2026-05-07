"use client";

import React, { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, Trash2 } from "lucide-react";

import { FileItem } from "./types";

type Log = {
    id: string;
    text: string;
    type: 'input' | 'output' | 'error' | 'system';
};

export function TerminalPanel({ activeFile }: { activeFile?: FileItem }) {
    const [logs, setLogs] = useState<Log[]>([]);
    const [input, setInput] = useState("");
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const handleCommand = (cmd: string) => {
        const trimmed = cmd.trim();
        if (!trimmed) return;

        const newLog: Log = { id: Date.now().toString(), text: `$ ${trimmed}`, type: 'input' };
        setLogs(prev => [...prev, newLog]);

        let output: Log | null = null;
        const args = trimmed.split(' ');
        const mainCmd = args[0].toLowerCase();

        switch (mainCmd) {
            case 'help':
                output = { id: Date.now().toString() + '1', text: 'Available commands: help, clear, echo, date, whoami', type: 'output' };
                break;
            case 'clear':
                setLogs([]);
                return;
            case 'echo':
                output = { id: Date.now().toString() + '1', text: args.slice(1).join(' '), type: 'output' };
                break;
            case 'date':
                output = { id: Date.now().toString() + '1', text: new Date().toString(), type: 'output' };
                break;
            case 'whoami':
                output = { id: Date.now().toString() + '1', text: 'donezo_user', type: 'output' };
                break;
            case 'ls':
                if (activeFile) {
                    output = { id: Date.now().toString() + '1', text: `Currently active:\n${activeFile.name}\n\nNote: This is a virtual filesystem.`, type: 'output' };
                } else {
                    output = { id: Date.now().toString() + '1', text: 'No active files.', type: 'output' };
                }
                break;
            case 'npm':
            case 'git':
                output = { id: Date.now().toString() + '1', text: `Command not supported in virtual terminal: ${mainCmd}`, type: 'error' };
                break;
            case 'node':
            case 'run':
                if (!activeFile || !activeFile.content) {
                    output = { id: Date.now().toString() + '1', text: 'Error: No active file content to run. Open a file first.', type: 'error' };
                } else if (!activeFile.name.endsWith('.js') && !activeFile.name.endsWith('.ts')) {
                    output = { id: Date.now().toString() + '1', text: 'Error: Only Javascript/Typescript files can be executed in this sandbox.', type: 'error' };
                } else {
                    setLogs(prev => [...prev, { id: Date.now().toString() + 'exec', text: `Executing ${activeFile.name}...`, type: 'system' }]);
                    
                    setTimeout(() => {
                        try {
                            const outputBuffer: string[] = [];
                            // Mock console
                            const mockConsole = {
                                log: (...args: any[]) => outputBuffer.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
                                error: (...args: any[]) => outputBuffer.push('[ERROR] ' + args.map(a => String(a)).join(' ')),
                                warn: (...args: any[]) => outputBuffer.push('[WARN] ' + args.map(a => String(a)).join(' ')),
                            };
                            
                            // Remove imports/exports which break new Function
                            const safeCode = activeFile.content!.replace(/^import.*$/gm, '').replace(/^export.*$/gm, '');
                            
                            const fn = new Function('console', safeCode);
                            fn(mockConsole);
                            
                            if (outputBuffer.length === 0) {
                                setLogs(prev => [...prev, { id: Date.now().toString() + 'done', text: `[Execution finished with no output]`, type: 'system' }]);
                            } else {
                                const newLogs = outputBuffer.map((msg, idx) => ({
                                    id: Date.now().toString() + 'out' + idx,
                                    text: msg,
                                    type: msg.startsWith('[ERROR]') ? 'error' as const : 'output' as const
                                }));
                                setLogs(prev => [...prev, ...newLogs]);
                            }
                        } catch (err: any) {
                            setLogs(prev => [...prev, { id: Date.now().toString() + 'err', text: `[ERROR] ${err.message}`, type: 'error' }]);
                        }
                    }, 100);
                    
                    return; // Early return because we handled async logs
                }
                break;
            default:
                output = { id: Date.now().toString() + '1', text: `Command not found: ${mainCmd}`, type: 'error' };
        }

        if (output) {
            setLogs(prev => [...prev, output]);
        }
    };

    return (
        <div className="h-full w-full flex flex-col bg-[#1e1e1e] text-[#cccccc] font-mono text-sm">
            <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-[#3c3c3c]">
                <div className="flex items-center gap-2">
                    <TerminalIcon className="w-4 h-4 text-sky-400" />
                    <span className="font-medium text-xs tracking-wider uppercase text-gray-300">Terminal</span>
                </div>
                <button
                    className="p-1 hover:bg-[#3c3c3c] rounded transition-colors text-gray-400 hover:text-white"
                    onClick={() => setLogs([])}
                    title="Clear Terminal"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {logs.map(log => (
                    <div key={log.id} className={`whitespace-pre-wrap ${
                        log.type === 'error' ? 'text-red-400' :
                        log.type === 'system' ? 'text-sky-400/80' :
                        log.type === 'input' ? 'text-green-400' : 'text-gray-300'
                    }`}>
                        {log.text}
                    </div>
                ))}
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-green-400">$</span>
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                handleCommand(input);
                                setInput("");
                            }
                        }}
                        className="flex-1 bg-transparent outline-none text-[#cccccc]"
                        autoComplete="off"
                        spellCheck="false"
                    />
                </div>
                <div ref={endRef} />
            </div>
        </div>
    );
}
