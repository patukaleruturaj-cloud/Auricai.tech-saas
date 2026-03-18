"use server";

import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function deleteGeneration(id: string) {
    const session = await auth();
    if (!session.userId) {
        throw new Error("Unauthorized");
    }

    // Delete the generation matching the ID and the current user
    const { error } = await supabaseAdmin
        .from("generations")
        .delete()
        .eq("id", id)
        .eq("user_id", session.userId);

    if (error) {
        console.error("[history_action] delete error:", error);
        throw new Error("Failed to delete generation");
    }

    return { success: true };
}

export async function updateGenerationStatus(id: string, status: string) {
    const session = await auth();
    if (!session.userId) {
        throw new Error("Unauthorized");
    }

    const { error } = await supabaseAdmin
        .from("generations")
        .update({ 
            status, 
            status_updated_at: new Date().toISOString() 
        })
        .eq("id", id)
        .eq("user_id", session.userId);

    if (error) {
        console.error("[history_action] update status error:", error);
        throw new Error("Failed to update generation status");
    }

    return { success: true };
}
