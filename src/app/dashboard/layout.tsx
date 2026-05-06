import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    let userName = "Operator";
    let userEmail = user?.email || "";
    let userAvatar = "";

    if (user) {
        const { data: profile } = await supabase.from('users').select('name, avatar_url').eq('id', user.id).single();
        if (profile) {
            userName = profile.name;
            userAvatar = profile.avatar_url;
        }
    }

    return (
        <div className="flex h-screen bg-background text-foreground">
            <Sidebar className="hidden md:flex border-r-0" />
            <div className="flex flex-1 flex-col overflow-hidden bg-[linear-gradient(180deg,rgba(0,0,0,0.02),transparent_20%)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent_20%)]">
                <Header userName={userName} userEmail={userEmail} userAvatar={userAvatar} />
                <main className="flex flex-1 flex-col min-h-0 overflow-y-auto px-4 py-4 md:px-6 md:py-5 lg:px-8 lg:py-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
