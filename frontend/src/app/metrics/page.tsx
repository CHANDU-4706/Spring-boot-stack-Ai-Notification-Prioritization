"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Loader2 } from "lucide-react";
import api from "@/lib/api";

export default function MetricsPage() {
    const [metrics, setMetrics] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const res = await api.get("/api/metrics");
                setMetrics(res.data);
            } catch (err) {
                console.error("Failed to fetch metrics", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMetrics();
        const interval = setInterval(fetchMetrics, 5000); // Live update
        return () => clearInterval(interval);
    }, []);

    if (isLoading && !metrics) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="h-12 w-12 animate-spin text-amber-500" />
            </div>
        );
    }

    const engineData = [
        { name: 'AI LLaMA 3', value: metrics?.aiProcessed || 0 },
        { name: 'Custom Rules', value: metrics?.ruleProcessed || 0 },
        { name: 'Fallback Failsafe', value: metrics?.fallbackProcessed || 0 },
    ];

    const droppedData = [
        { name: 'Duplicate Events', count: metrics?.duplicatesDropped || 0 },
        { name: 'Alert Fatigue', count: metrics?.fatugueDropped || 0 },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-emerald-500/10 pb-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-2 flex items-center gap-4">
                        System Metrics
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 backdrop-blur-md">
                            Java Edition
                        </span>
                    </h1>
                    <p className="text-gray-400 font-medium max-w-2xl">Real-time throughput, classification attribution, and engine optimization telemetry.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="glass-dark border-white/5 shadow-2xl hover:emerald-glow transition-all duration-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70">Total Processed Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-white tracking-tighter">{metrics?.totalProcessed || 0}</div>
                    </CardContent>
                </Card>

                <Card className="glass-dark border-white/5 shadow-2xl hover:emerald-glow transition-all duration-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Events in LATER Queue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-emerald-400 tracking-tighter">{metrics?.laterQueueSize || 0}</div>
                    </CardContent>
                </Card>

                <Card className="glass-dark border-white/5 shadow-2xl hover:emerald-glow transition-all duration-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-teal-500">AI Logic Utilization</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-teal-400 tracking-tighter">
                            {metrics?.totalProcessed > 0 ? Math.round((metrics.aiProcessed / metrics.totalProcessed) * 100) : 0}%
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-dark border-white/5 shadow-2xl hover:emerald-glow transition-all duration-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-gray-500">System Efficiency</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-gray-300 tracking-tighter">99.8%</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-8 md:grid-cols-2 mt-8">
                <Card className="glass shadow-2xl border-white/5 overflow-hidden group">
                    <CardHeader className="bg-emerald-500/5 border-b border-emerald-500/10">
                        <CardTitle className="text-xl font-black text-white tracking-tight">Decision attribution</CardTitle>
                        <CardDescription className="text-emerald-500/60 font-medium">AI vs Custom Rules vs Fallback usage</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] pt-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={engineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(16,185,129,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="#525252" fontSize={10} fontWeight="bold" />
                                <YAxis stroke="#525252" fontSize={10} fontWeight="bold" />
                                <Tooltip
                                    cursor={{ fill: 'rgba(16,185,129,0.05)' }}
                                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.2)', color: '#fff' }}
                                />
                                <Bar dataKey="value" fill="url(#emeraldGradient)" radius={[8, 8, 0, 0]} barSize={40} />
                                <defs>
                                    <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" />
                                        <stop offset="100%" stopColor="#064e3b" />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="glass shadow-2xl border-white/5 overflow-hidden group">
                    <CardHeader className="bg-emerald-500/5 border-b border-emerald-500/10">
                        <CardTitle className="text-xl font-black text-white tracking-tight">Deduplication Impact</CardTitle>
                        <CardDescription className="text-emerald-500/60 font-medium">Events dropped before hitting the pipeline</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] pt-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={droppedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(16,185,129,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="#525252" fontSize={10} fontWeight="bold" />
                                <YAxis stroke="#525252" fontSize={10} fontWeight="bold" />
                                <Tooltip
                                    cursor={{ fill: 'rgba(16,185,129,0.05)' }}
                                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.2)', color: '#fff' }}
                                />
                                <Bar dataKey="count" fill="url(#tealGradient)" radius={[8, 8, 0, 0]} barSize={40} />
                                <defs>
                                    <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#2dd4bf" />
                                        <stop offset="100%" stopColor="#134e4a" />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
