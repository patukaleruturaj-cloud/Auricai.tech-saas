"use client";
import { memo } from "react";

import {
    AreaChart,
    Area,
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
                minWidth: "160px",
                animation: "fadeIn 0.15s ease-out"
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
                                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: entry.color === "url(#responseLine)" ? "#22c55e" : entry.color }} />
                                <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", transition: "color 0.15s ease" }}>{entry.name}</span>
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

    // High-End Insight Calculation
    const totalSent = data.reduce((acc, curr) => acc + curr.sent, 0);
    const totalResponses = data.reduce((acc, curr) => acc + curr.responses, 0);
    const avgResponseRate = totalSent > 0 ? ((totalResponses / totalSent) * 100).toFixed(1) : "0.0";

    return (
        <div className="glass-panel animate-fade-in" style={{ padding: "24px", marginTop: "var(--spacing-8)", borderRadius: "20px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", gap: "16px", flexWrap: "wrap" }}>
                <div>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: "600", letterSpacing: "-0.01em", color: "#fff" }}>Outbound Performance</h2>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "4px" }}>Response trend over time</p>
                </div>
                {totalSent > 0 && (
                    <div style={{ 
                        background: "rgba(34, 197, 94, 0.1)", 
                        border: "1px solid rgba(34, 197, 94, 0.2)",
                        color: "#4ade80",
                        padding: "6px 14px",
                        borderRadius: "20px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        letterSpacing: "0.02em",
                        boxShadow: "0 0 15px rgba(34, 197, 94, 0.1)"
                    }}>
                        Avg: {avgResponseRate}% Response Rate
                    </div>
                )}
            </div>

            <div style={{ width: "100%", height: "380px" }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="sentGradientArea" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="responsesGradientArea" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="responseLine" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#22c55e" />
                                <stop offset="100%" stopColor="#16a34a" />
                            </linearGradient>
                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
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
                            cursor={{ stroke: "rgba(255,255,255,0.05)", strokeWidth: 1.5, strokeDasharray: "4 4" }}
                        />
                        <Legend 
                            verticalAlign="top" 
                            align="right" 
                            iconType="circle" 
                            iconSize={8}
                            wrapperStyle={{ paddingTop: "0px", paddingBottom: "30px", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(255,255,255,0.5)" }} 
                        />
                        <Area
                            type="monotone"
                            dataKey="sent"
                            name="Sent Messages"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            strokeOpacity={0.6}
                            fill="url(#sentGradientArea)"
                            animationDuration={1500}
                            activeDot={{ r: 4, fill: "#3b82f6", stroke: "rgba(59,130,246,0.3)", strokeWidth: 4 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="responses"
                            name="Responses"
                            stroke="url(#responseLine)"
                            strokeWidth={3}
                            fill="url(#responsesGradientArea)"
                            animationDuration={1500}
                            activeDot={{ r: 6, fill: "#4ade80", stroke: "#16a34a", strokeWidth: 2, style: { filter: "url(#glow)" } }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
});

export default ActivityChart;
