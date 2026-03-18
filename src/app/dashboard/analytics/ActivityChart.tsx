"use client";
import { memo } from "react";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";

interface ChartDataPoint {
    date: string;
    sent: number;
    responses: number;
}

interface ActivityChartProps {
    data: ChartDataPoint[];
}

export const ActivityChart = memo(function ActivityChart({ data }: ActivityChartProps) {
    if (!data || data.length === 0 || data.every(d => d.sent === 0)) {
        return (
            <div className="glass-panel" style={{ padding: "var(--spacing-8)", minHeight: "250px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: "var(--spacing-4)" }}>
                <p style={{ fontWeight: 600, fontSize: "1.125rem", marginBottom: "0.5rem" }}>No outbound activity yet.</p>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Update the status of your history items to 'Sent' to track trends.</p>
            </div>
        );
    }

    return (
        <div className="glass-panel" style={{ padding: "var(--spacing-6)", marginTop: "var(--spacing-4)" }}>
            <div style={{ marginBottom: "var(--spacing-6)" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "4px" }}>Outbound Tracker</h2>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Visualize Sent vs Responses over the last 30 days.</p>
            </div>

            <div style={{ width: "100%", height: "350px" }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                                backgroundColor: "rgba(15,15,15,0.95)",
                                border: "1px solid var(--border-subtle)",
                                borderRadius: "8px",
                                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
                                color: "var(--text-primary)",
                                fontSize: "0.875rem"
                            }}
                            cursor={{ fill: "rgba(255,255,255,0.03)" }}
                        />
                        <Legend 
                            verticalAlign="top" 
                            align="right" 
                            iconType="circle" 
                            wrapperStyle={{ paddingBottom: "20px", fontSize: "0.875rem" }} 
                        />
                        <Bar
                            dataKey="sent"
                            name="Sent Messages"
                            fill="#3b82f6"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={40}
                            animationDuration={1500}
                        />
                        <Bar
                            dataKey="responses"
                            name="Responses"
                            fill="#16a34a"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={40}
                            animationDuration={1500}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
});

export default ActivityChart;

