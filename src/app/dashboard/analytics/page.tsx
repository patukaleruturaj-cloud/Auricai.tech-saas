import { BarChart3, TrendingUp, Users, Clock, Database, Send, MailOpen, Activity } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { getWallet } from "@/lib/credits";
import ActivityChart from "./ActivityChart";

export default async function AnalyticsPage() {
    const session = await auth();
    if (!session.userId) redirect("/sign-in");

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Use Promise.all for parallel fetching
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const [
        { data: stats },
        creditState,
        { count: weekCount },
        { count: monthCount },
        { data: allDatesData }
    ] = await Promise.all([
        supabase.from("user_stats").select("*").eq("user_id", session.userId).single(),
        getWallet(session.userId),
        supabase.from("generations").select('*', { count: 'exact', head: true }).eq("user_id", session.userId).gte("created_at", oneWeekAgo.toISOString()),
        supabase.from("generations").select('*', { count: 'exact', head: true }).eq("user_id", session.userId).gte("created_at", oneMonthAgo.toISOString()),
        supabase.from("generations").select("created_at, status, status_updated_at").eq("user_id", session.userId)
    ]);

    const totalGenerations = stats?.total_generations || 0;
    const lastGeneratedAt = stats?.last_generated_at
        ? new Date(stats.last_generated_at).toLocaleDateString()
        : "Never";

    const messagesRemaining = creditState?.credits_remaining ?? creditState?.monthly_limit ?? 10;

    // Generate the last 30 days for continuous chart X-axis
    const chartDataMap = new Map<string, { sent: number, responses: number }>();
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        chartDataMap.set(dateStr, { sent: 0, responses: 0 });
    }

    let messagesSent = 0;
    let responses = 0;
    let hasData = false;

    if (allDatesData && allDatesData.length > 0) {
        hasData = true;
        allDatesData.forEach(item => {
            const status = item.status || 'not_sent';

            if (status !== 'not_sent') {
                messagesSent++;
                if (status === 'responded') responses++;

                if (item.status_updated_at) {
                    const dateObj = new Date(item.status_updated_at);
                    const dateStr = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                    
                    if (chartDataMap.has(dateStr)) {
                        chartDataMap.get(dateStr)!.sent += 1;
                        if (status === 'responded') {
                            chartDataMap.get(dateStr)!.responses += 1;
                        }
                    }
                }
            }
        });
    }

    const responseRate = messagesSent > 0 ? ((responses / messagesSent) * 100).toFixed(1) + "%" : "—";
    const chartData = hasData ? Array.from(chartDataMap.entries()).map(([date, counts]) => ({ date, ...counts })) : [];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-6)" }}>
            {/* Responsive grid styles for analytics cards */}
            <style dangerouslySetInnerHTML={{
                __html: `
                /* 1-col on mobile → 3-col on 640px+ */
                .analytics-top-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: var(--spacing-4);
                }
                @media (min-width: 480px) {
                    .analytics-top-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                @media (min-width: 640px) {
                    .analytics-top-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }
                /* 1-col on mobile → 2-col on 560px+ */
                .analytics-bottom-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: var(--spacing-4);
                }
                @media (min-width: 560px) {
                    .analytics-bottom-grid {
                        grid-template-columns: 1fr 1fr;
                    }
                }
                /* Fluid stat number */
                .analytics-stat-num {
                    font-size: clamp(1.75rem, 5vw, 2.5rem);
                    font-weight: 700;
                }
            `}} />
            <div>
                <h1 style={{ fontSize: "clamp(1.5rem, 5vw, 2rem)", fontWeight: "700", marginBottom: "var(--spacing-2)" }}>Analytics & Performance</h1>
                <p style={{ color: "var(--text-secondary)" }}>Track your outbound messaging volume.</p>
            </div>

            <div className="analytics-top-grid">
                {/* Total Generations */}
                <div className="glass-panel animate-fade-in" style={{ padding: "var(--spacing-6)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", marginBottom: "var(--spacing-4)" }}>
                        <BarChart3 size={18} color="var(--accent-blue)" /> <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>Total Generated</span>
                    </div>
                    <p className="analytics-stat-num">{totalGenerations}</p>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                        All time generations
                    </p>
                </div>

                {/* Messages Remaining */}
                <div className="glass-panel animate-fade-in" style={{ padding: "var(--spacing-6)", animationDelay: "100ms" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", marginBottom: "var(--spacing-4)" }}>
                        <Database size={18} color="var(--accent-violet)" /> <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>Messages Remaining</span>
                    </div>
                    <p className="analytics-stat-num">{messagesRemaining}</p>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                        Current billing cycle
                    </p>
                </div>

                {/* Last Generated */}
                <div className="glass-panel animate-fade-in" style={{ padding: "var(--spacing-6)", animationDelay: "200ms" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", marginBottom: "var(--spacing-4)" }}>
                        <Clock size={18} /> <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>Last Generated</span>
                    </div>
                    <p style={{ fontSize: "clamp(1.25rem, 4vw, 1.5rem)", fontWeight: "700", minHeight: "3rem", display: "flex", alignItems: "center" }}>{lastGeneratedAt}</p>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                        Most recent activity
                    </p>
                </div>
            </div>

            <div className="analytics-bottom-grid" style={{ marginTop: "var(--spacing-2)" }}>
                <div className="glass-panel animate-fade-in" style={{ padding: "var(--spacing-6)", animationDelay: "300ms", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "4px" }}>Generations This Week</p>
                        <p style={{ fontSize: "2rem", fontWeight: "700" }}>{weekCount || 0}</p>
                    </div>
                    <TrendingUp size={32} opacity={0.2} color="var(--accent-blue)" />
                </div>
                <div className="glass-panel animate-fade-in" style={{ padding: "var(--spacing-6)", animationDelay: "400ms", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "4px" }}>Generations This Month</p>
                        <p style={{ fontSize: "2rem", fontWeight: "700" }}>{monthCount || 0}</p>
                    </div>
                    <TrendingUp size={32} opacity={0.2} color="var(--accent-violet)" />
                </div>
            </div>

            <div style={{ marginTop: "var(--spacing-6)", paddingTop: "var(--spacing-6)", borderTop: "1px solid var(--border-subtle)" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "var(--spacing-2)" }}>Outbound Performance</h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "var(--spacing-4)" }}>Track your conversation success directly.</p>
                
                <div className="analytics-top-grid">
                    <div className="glass-panel animate-fade-in" style={{ padding: "var(--spacing-6)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", marginBottom: "var(--spacing-4)" }}>
                            <Send size={18} color="var(--accent-blue)" /> <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>Messages Sent</span>
                        </div>
                        <p className="analytics-stat-num">{messagesSent}</p>
                        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                            Total outbound messages
                        </p>
                    </div>

                    <div className="glass-panel animate-fade-in" style={{ padding: "var(--spacing-6)", animationDelay: "100ms" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", marginBottom: "var(--spacing-4)" }}>
                            <MailOpen size={18} color="#16a34a" /> <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>Responses</span>
                        </div>
                        <p className="analytics-stat-num">{responses}</p>
                        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                            Prospect replies
                        </p>
                    </div>

                    <div className="glass-panel animate-fade-in" style={{ padding: "var(--spacing-6)", animationDelay: "200ms" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", marginBottom: "var(--spacing-4)" }}>
                            <Activity size={18} color="var(--accent-violet)" /> <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>Response Rate</span>
                        </div>
                        <p className="analytics-stat-num">{responseRate}</p>
                        <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                            Conversion percentage
                        </p>
                    </div>
                </div>
            </div>

            <ActivityChart data={chartData} />
        </div>
    );
}
