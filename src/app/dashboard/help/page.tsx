import { HelpCenter } from "@/components/dashboard/help/HelpCenter";

export default function HelpPage() {
    return (
        <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto no-scrollbar pr-2">
                <HelpCenter />
            </div>
        </div>
    );
}
