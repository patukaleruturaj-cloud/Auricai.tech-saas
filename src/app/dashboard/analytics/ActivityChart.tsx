"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface ChartDataPoint {
    date: string;
    count: number;
}

interface ActivityChartProps {
    data: ChartDataPoint[];
}

export default function ActivityChart({ data }: ActivityChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="glass-panel" style={{ padding: "var(--spacing-8)", minHeight: "250px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: "var(--spacing-4)" }}>
                <p style={{ fontWeight: 600, fontSize: "1.125rem", marginBottom: "0.5rem" }}>No generation activity yet.</p>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Start generating openers to see your activity trends.</p>
            </div>
        );
    }

    return (
        <div className="glass-panel" style={{ padding: "var(--spacing-6)", marginTop: "var(--spacing-4)" }}>
            <div style={{ marginBottom: "var(--spacing-6)" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "4px" }}>Generation Activity</h2>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Track your outreach generation trends.</p>
            </div>

            <div style={{ width: "100%", height: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
                            allowDecimals={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(15,15,15,0.9)",
                                border: "1px solid var(--border-subtle)",
                                borderRadius: "8px",
                                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
                                color: "var(--text-primary)"
                            }}
                            itemStyle={{ color: "var(--accent-blue)", fontWeight: "600" }}
                            cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="count"
                            name="Generations"
                            stroke="var(--accent-blue)"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorCount)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
