"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, ShieldAlert, Cpu, CheckCircle } from "lucide-react";
import api from "@/lib/api";

export default function DashboardPage() {
    const [healthStatus, setHealthStatus] = useState<any>(null);

    useEffect(() => {
        const checkHealth = async () => {
            try {
                const res = await api.get("/api/health");
                setHealthStatus(res.data);
            } catch (err) {
                setHealthStatus({ status: "down" });
            }
        };
        checkHealth();
        const interval = setInterval(checkHealth, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2 flex items-center gap-4">
                        Live Operations
                        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 backdrop-blur-sm animate-pulse-slow">
                            Java Edition
                        </span>
                    </h1>
                    <p className="text-gray-400 font-medium">Real-time status of the Spring Boot Prioritization Engine.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="glass-dark overflow-hidden group hover:emerald-glow transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 z-10 relative">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-gray-400">Engine API Status</CardTitle>
                        <Activity className={`h-5 w-5 ${healthStatus?.status === 'up' ? 'text-emerald-400 animate-pulse' : 'text-red-500'}`} />
                    </CardHeader>
                    <CardContent className="z-10 relative">
                        <div className="text-3xl font-black text-white tracking-tighter">
                            {healthStatus?.status || "UNKNOWN"}
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-dark overflow-hidden group hover:emerald-glow transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-gray-400">Database</CardTitle>
                        <CheckCircle className={`h-5 w-5 ${healthStatus?.database?.includes('connected') ? 'text-emerald-400' : 'text-red-500'}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white tracking-tighter capitalize">{healthStatus?.database?.split('(')[0] || "Offline"}</div>
                        <p className="text-[10px] text-emerald-500/60 font-bold mt-1 uppercase tracking-widest">Neon Cloud Persistence</p>
                    </CardContent>
                </Card>

                <Card className="glass-dark overflow-hidden group hover:emerald-glow transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-gray-400">AI Circuit Breaker</CardTitle>
                        <Cpu className={`h-5 w-5 ${healthStatus?.ai_circuit?.status?.includes('CLOSED') ? 'text-emerald-400' : 'text-red-500 animate-bounce'}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white tracking-tighter uppercase font-mono">
                            {healthStatus?.ai_circuit?.status?.split(' ')[0] || "UNKNOWN"}
                        </div>
                        <p className="text-[10px] text-emerald-400 font-bold mt-1 uppercase tracking-widest">
                            {healthStatus?.ai_circuit?.status?.includes('OPEN') ? 'Fallback active' : 'AI Routing active'}
                        </p>
                    </CardContent>
                </Card>

                <Card className="glass-dark overflow-hidden group hover:emerald-glow transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-400/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-gray-400">AI Fallbacks Forced</CardTitle>
                        <ShieldAlert className="h-5 w-5 text-emerald-500/50" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white tracking-tighter">
                            {healthStatus?.ai_circuit?.fallbacks_triggered || 0}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 h-[450px]">
                <Card className="col-span-4 glass flex flex-col items-center justify-center p-6 text-center shadow-2xl border-white/5 relative overflow-hidden group">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all duration-700"></div>
                    <Activity className="h-20 w-20 text-emerald-500/20 mb-6 animate-pulse-slow" />
                    <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Live Throughput Monitor</h3>
                    <p className="text-gray-400 max-w-sm font-medium">Event processing metrics and pipeline latency visualized in real-time.</p>
                </Card>

                <Card className="col-span-3 glass-dark p-6 shadow-2xl border-white/5 flex flex-col">
                    <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-xl font-black text-emerald-400 tracking-tight">Recent Decisions</CardTitle>
                        <CardDescription className="text-gray-500 font-medium">Latest classifications made by the engine.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0 flex-1 overflow-y-auto mt-4">
                        <div className="flex flex-col gap-4 text-sm text-gray-500 text-center py-20 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                            <Cpu className="h-10 w-10 text-emerald-500/10 mx-auto" />
                            <p className="font-bold uppercase tracking-widest text-[10px]">No recent decisions in this session</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
