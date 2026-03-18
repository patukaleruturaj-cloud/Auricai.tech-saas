import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { MessageSquare, Clock } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import HistoryClient from "./HistoryClient";

export default async function HistoryPage() {
    const session = await auth();
    if (!session.userId) redirect("/sign-in");

    // Query generations by Clerk user_id (TEXT column) — no join needed
    const { data: historyData, error } = await supabaseAdmin
        .from("generations")
        .select("id, prospect_bio, tone, generated_options, subject, follow_up, status, created_at")
        .eq("user_id", session.userId)
        .order("created_at", { ascending: false })
        .limit(50);

    if (error) {
        console.error("[history] query error:", error);
    }

    const history = historyData || [];

    return <HistoryClient initialHistory={history} />;
}
