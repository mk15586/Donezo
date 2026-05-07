"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated" };
    }

    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const avatarUrl = formData.get("avatarUrl") as string;
    
    // Validate inputs
    if (!firstName || !lastName) {
        return { error: "First and last name are required" };
    }

    const fullName = `${firstName} ${lastName}`;

    // Update in users table
    const { error: profileError } = await supabase
        .from("users")
        .update({ name: fullName, avatar_url: avatarUrl })
        .eq("id", user.id);

    if (profileError) {
        return { error: profileError.message };
    }

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");

    return { success: true };
}

export async function updateAvatar(avatarUrl: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated" };
    }

    const { error: profileError } = await supabase
        .from("users")
        .update({ avatar_url: avatarUrl })
        .eq("id", user.id);

    if (profileError) {
        return { error: profileError.message };
    }

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard", "layout");

    return { success: true };
}


