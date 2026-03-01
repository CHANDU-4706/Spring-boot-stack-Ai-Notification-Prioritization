"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, History as HistoryIcon } from "lucide-react";
import axios from "axios";

export default function AuditLogPage() {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [mounted, setMounted] = useState(false);

    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get("http://localhost:8082/api/audit-logs");
            setLogs(res.data.data);
        } catch (err) {
            console.error("Failed to fetch audit logs:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setMounted(true);
        fetchLogs();
    }, []);

    const formatDate = (dateStr: string) => {
        if (!mounted) return "";
        return new Date(dateStr).toLocaleString();
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-emerald-500/10 pb-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-2 flex items-center gap-4">
                        Audit Logs
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 backdrop-blur-md">
                            Java Edition
                        </span>
                    </h1>
                    <p className="text-gray-400 font-medium max-w-2xl">
                        A secure, immutable record of every classification decision and routing event within the engine.
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="relative w-64 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                        <input
                            className="w-full pl-10 pr-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all"
                            placeholder="Filter by event or rule..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button
                        onClick={fetchLogs}
                        variant="outline"
                        className="rounded-xl border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40"
                    >
                        Refresh
                    </Button>
                </div>
            </div>

            <Card className="glass-dark border-white/5 overflow-hidden">
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center p-20 gap-4">
                            <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
                            <p className="text-xs font-bold uppercase tracking-widest text-emerald-500/40">Synchronizing Ledger...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-400 border-collapse">
                                <thead>
                                    <tr className="bg-emerald-500/5 border-b border-emerald-500/10">
                                        <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-emerald-400/70">Timestamp</th>
                                        <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-emerald-400/70">Event ID</th>
                                        <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-emerald-400/70">Decision</th>
                                        <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-emerald-400/70">Engine Used</th>
                                        <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-emerald-400/70 hidden md:table-cell">Reasoning</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-20">
                                                <div className="flex flex-col items-center gap-2 opacity-20">
                                                    <HistoryIcon className="h-12 w-12" />
                                                    <p className="font-bold uppercase tracking-widest text-xs">No entries recorded</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : logs.map((log: any) => (
                                        <tr key={log.id || log.event_id} className="group border-b border-emerald-500/5 hover:bg-emerald-500/5 transition-all duration-300">
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500 group-hover:text-emerald-100 font-medium">
                                                {formatDate(log.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-[10px] text-emerald-400/60 group-hover:text-emerald-400">
                                                {log.eventId || log.event_id}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-tighter uppercase border
                                                    ${log.decision === 'NOW' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                        log.decision === 'LATER' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                            'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}
                                                >
                                                    {log.decision}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[10px] font-bold bg-white/5 px-2 py-1 rounded text-gray-500 uppercase tracking-wider group-hover:text-gray-300">
                                                    {log.engineUsed || log.engine_used}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell text-xs leading-relaxed text-gray-500 group-hover:text-gray-300 max-w-xs truncate" title={log.reason}>
                                                {log.reason}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
