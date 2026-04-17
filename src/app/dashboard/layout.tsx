import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-background">
            <Sidebar className="hidden md:flex border-r border-border" />
            <div className="flex flex-1 flex-col overflow-hidden bg-muted/10">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 flex flex-col min-h-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
