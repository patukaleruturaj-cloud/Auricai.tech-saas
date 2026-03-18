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

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: "rgba(10, 10, 15, 0.95)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "12px",
                padding: "16px",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
                minWidth: "160px"
            }}>
                <p style={{ 
                    fontSize: "0.75rem", 
                    textTransform: "uppercase", 
                    letterSpacing: "0.05em", 
                    color: "rgba(255,255,255,0.4)", 
                    marginBottom: "12px",
                    fontWeight: 600
                }}>{label}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: entry.color }} />
                                <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)" }}>{entry.name}</span>
                            </div>
                            <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#fff" }}>{entry.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    return null;
};

export const ActivityChart = memo(function ActivityChart({ data }: ActivityChartProps) {
    if (!data || data.length === 0 || data.every(d => d.sent === 0)) {
        return (
            <div className="glass-panel" style={{ padding: "var(--spacing-8)", minHeight: "250px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: "var(--spacing-8)", borderRadius: "20px" }}>
                <p style={{ fontWeight: 600, fontSize: "1.125rem", marginBottom: "0.5rem" }}>No outbound activity yet.</p>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Update the status of your history items to 'Sent' to track trends.</p>
            </div>
        );
    }

    return (
        <div className="glass-panel animate-fade-in" style={{ padding: "24px", marginTop: "var(--spacing-8)", borderRadius: "20px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
            <div style={{ marginBottom: "32px" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: "600", letterSpacing: "-0.01em", color: "#fff" }}>Outbound Performance</h2>
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "4px" }}>Response trend over time</p>
            </div>

            <div style={{ width: "100%", height: "380px" }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={8}>
                        <defs>
                            <linearGradient id="sentGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#1d4ed8" />
                            </linearGradient>
                            <linearGradient id="responsesGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#22c55e" />
                                <stop offset="100%" stopColor="#15803d" />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="0" vertical={false} stroke="rgba(255,255,255,0.03)" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                            dy={15}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
                            allowDecimals={false}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: "rgba(255,255,255,0.02)", radius: 8 }}
                        />
                        <Legend 
                            verticalAlign="top" 
                            align="right" 
                            iconType="circle" 
                            iconSize={8}
                            wrapperStyle={{ paddingTop: "0px", paddingBottom: "30px", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(255,255,255,0.5)" }} 
                        />
                        <Bar
                            dataKey="sent"
                            name="Sent Messages"
                            fill="url(#sentGradient)"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={32}
                            animationDuration={1500}
                        />
                        <Bar
                            dataKey="responses"
                            name="Responses"
                            fill="url(#responsesGradient)"
                            radius={[6, 6, 0, 0]}
                            maxBarSize={32}
                            animationDuration={1500}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
});

export default ActivityChart;
