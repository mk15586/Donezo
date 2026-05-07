import { SettingsLayout } from "@/components/dashboard/settings/SettingsLayout";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let initialData = {
        firstName: "",
        lastName: "",
        email: user?.email || "",
        avatarUrl: ""
    };

    if (user) {
        const { data: profile } = await supabase.from('users').select('name, avatar_url').eq('id', user.id).single();
        if (profile) {
            const nameParts = profile.name ? profile.name.split(" ") : [];
            initialData.firstName = nameParts[0] || "";
            initialData.lastName = nameParts.slice(1).join(" ") || "";
            initialData.avatarUrl = profile.avatar_url || "";
        }
    }

    return (
        <div className="flex-1 flex flex-col min-h-0 space-y-6 pb-6">
            <SettingsLayout initialData={initialData} />
        </div>
    );
}
