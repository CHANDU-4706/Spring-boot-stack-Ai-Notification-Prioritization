"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function QueuePage() {
    const [queue, setQueue] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    const fetchQueue = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get("http://localhost:8082/api/queue");
            setQueue(res.data.data);
        } catch (err) {
            console.error("Failed to fetch LATER queue", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setMounted(true);
        fetchQueue();
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
                        Deferred Queue
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 backdrop-blur-md">
                            Java Edition
                        </span>
                    </h1>
                    <p className="text-gray-400 font-medium max-w-2xl">Events designated 'LATER' awaiting background scheduled processing via the Spring Boot Task Scheduler.</p>
                </div>
                <Button
                    onClick={fetchQueue}
                    variant="outline"
                    className="rounded-xl border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40"
                >
                    <Clock className="w-4 h-4 mr-2" /> Refresh
                </Button>
            </div>

            <Card className="glass-dark border-white/5 overflow-hidden">
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center p-20 gap-4">
                            <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
                            <p className="text-xs font-bold uppercase tracking-widest text-emerald-500/40">Querying Scheduler...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-400 border-collapse">
                                <thead>
                                    <tr className="bg-emerald-500/5 border-b border-emerald-500/10">
                                        <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-emerald-400/70">Event ID</th>
                                        <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-emerald-400/70">Ingestion</th>
                                        <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-emerald-400/70">Scheduled Release</th>
                                        <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-emerald-400/70">Status</th>
                                        <th className="px-6 py-5 font-bold uppercase tracking-widest text-[10px] text-emerald-400/70">Classification Reason</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {queue.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-24">
                                                <div className="flex flex-col items-center gap-2 opacity-20">
                                                    <CheckCircle className="h-16 w-16 text-emerald-500" />
                                                    <p className="font-bold uppercase tracking-widest text-xs">Queue is currently clear</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : queue.map((event: any) => (
                                        <tr key={event.id} className="group border-b border-emerald-500/5 hover:bg-emerald-500/5 transition-all duration-300">
                                            <td className="px-6 py-4 font-mono text-[10px] text-emerald-400/60 group-hover:text-emerald-400">
                                                {event.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500 group-hover:text-emerald-100">
                                                {formatDate(event.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 text-emerald-400 font-bold">
                                                {event.expiresAt ? formatDate(event.expiresAt) : 'Next Flush'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 rounded-lg text-[10px] font-black tracking-tighter uppercase border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                                                    {event.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-medium text-gray-500 group-hover:text-gray-300 italic">
                                                {event.classification_reason || 'AI Judgment'}
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
