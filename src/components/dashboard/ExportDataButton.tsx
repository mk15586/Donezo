"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportDataButtonProps {
    data: any;
}

export function ExportDataButton({ data }: ExportDataButtonProps) {
    const handleExport = () => {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `donezo-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <Button 
            onClick={handleExport} 
            variant="outline" 
            className="rounded-full h-11 px-6 border-border text-sm shadow-sm font-semibold bg-card text-foreground hover:bg-muted transition-all"
        >
            <Download className="h-4 w-4 mr-2" /> Export Data
        </Button>
    );
}
