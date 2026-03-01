"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldAlert, Clock, Trash, Cpu, Send, Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";

export default function SimulatorPage() {
    const [formData, setFormData] = useState({
        user_id: "user_123",
        event_type: "LOGIN_ATTEMPT",
        message: "New login from unknown IP address in Moscow",
        source: "SECURITY",
        priority_hint: "high",
        channel: "email"
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setResult(null);
        try {
            const response = await axios.post("http://localhost:8082/api/events", formData);
            setResult(response.data);
        } catch (error: any) {
            setResult({ error: error.response?.data?.error || error.response?.data?.message || error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const loadPreset = (type: string) => {
        switch (type) {
            case "SECURITY_NOW":
                setFormData({ ...formData, event_type: "SECURITY_ALERT", message: "Multiple failed login attempts detected", source: "SECURITY", priority_hint: "critical" });
                break;
            case "MARKETING_NEVER":
                setFormData({ ...formData, event_type: "PROMO", message: "Get 20% off your next purchase using code SAVE20", source: "MARKETING", priority_hint: "low" });
                break;
            case "UPDATE_LATER":
                setFormData({ ...formData, event_type: "SYSTEM_UPDATE", message: "Your weekly analytics report is ready to view", source: "SYSTEM", priority_hint: "normal" });
                break;
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-emerald-500/10 pb-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-2 flex items-center gap-4">
                        Event Simulator
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 backdrop-blur-md">
                            Java Edition
                        </span>
                    </h1>
                    <p className="text-gray-400 font-medium max-w-2xl">Inject raw notification events directly into the Spring Boot Pipeline to test real-time AI classification and routing logic.</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="rounded-xl border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all font-bold text-xs uppercase tracking-widest" onClick={() => loadPreset("SECURITY_NOW")}>
                    <ShieldAlert className="w-4 h-4 mr-2" /> Critical Security
                </Button>
                <Button variant="outline" className="rounded-xl border-emerald-500/20 bg-emerald-500/5 text-teal-400 hover:bg-teal-500/20 hover:border-teal-500/40 transition-all font-bold text-xs uppercase tracking-widest" onClick={() => loadPreset("UPDATE_LATER")}>
                    <Clock className="w-4 h-4 mr-2" /> Weekly Update
                </Button>
                <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest" onClick={() => loadPreset("MARKETING_NEVER")}>
                    <Trash className="w-4 h-4 mr-2" /> Promo Spam
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="glass-dark border-white/5 shadow-2xl overflow-hidden hover:emerald-glow transition-all duration-500">
                    <CardHeader className="bg-emerald-500/5 border-b border-emerald-500/10">
                        <CardTitle className="text-xl font-black tracking-tight text-white">Event Payload</CardTitle>
                        <CardDescription className="text-emerald-500/60 font-medium">Configure the data sent to the Spring Boot API</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form id="simulator-form" onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70 ml-1">User ID</label>
                                    <Input className="bg-emerald-500/5 border-emerald-500/10 focus:border-emerald-500/40 rounded-xl" value={formData.user_id} onChange={(e) => setFormData({ ...formData, user_id: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70 ml-1">Event Type</label>
                                    <Input className="bg-emerald-500/5 border-emerald-500/10 focus:border-emerald-500/40 rounded-xl uppercase font-bold" value={formData.event_type} onChange={(e) => setFormData({ ...formData, event_type: e.target.value })} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70 ml-1">Message / Content</label>
                                <textarea
                                    className="w-full flex min-h-[100px] rounded-xl border border-emerald-500/10 bg-emerald-500/5 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 transition-all placeholder:text-emerald-500/20"
                                    value={formData.message}
                                    placeholder="Enter notification message payload..."
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70 ml-1">Source</label>
                                    <Input className="bg-emerald-500/5 border-emerald-500/10 focus:border-emerald-500/40 rounded-xl" value={formData.source} onChange={(e) => setFormData({ ...formData, source: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70 ml-1">Priority Hint</label>
                                    <Input className="bg-emerald-500/5 border-emerald-500/10 focus:border-emerald-500/40 rounded-xl" value={formData.priority_hint} onChange={(e) => setFormData({ ...formData, priority_hint: e.target.value })} />
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="bg-emerald-500/5 border-t border-emerald-500/10 p-6">
                        <Button form="simulator-form" type="submit" disabled={isSubmitting} className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black uppercase tracking-wider text-xs rounded-xl w-full py-6 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                            <Send className="w-4 h-4 mr-2" />
                            {isSubmitting ? "Dispatching..." : "Dispatch to Engine"}
                        </Button>
                    </CardFooter>
                </Card>

                <div className="space-y-6">
                    <Card className="glass border-white/5 shadow-2xl h-full flex flex-col relative overflow-hidden group">
                        <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <CardHeader className="bg-white/5 border-b border-white/5 backdrop-blur-sm z-10">
                            <CardTitle className="text-xl font-black flex items-center justify-between text-white tracking-tight">
                                API Response
                                {result && !result.error && <CheckCircle2 className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-0 relative overflow-hidden bg-black/40 z-10">
                            {!result && !isSubmitting && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 gap-4">
                                    <Cpu className="w-16 h-16 opacity-10 animate-pulse-slow" />
                                    <p className="font-bold uppercase tracking-widest text-[10px]">Awaiting payload dispatch...</p>
                                </div>
                            )}
                            {isSubmitting && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-emerald-400 gap-4 backdrop-blur-sm">
                                    <Loader2 className="w-10 h-10 animate-spin" />
                                    <p className="font-black uppercase tracking-widest text-xs animate-pulse">Engine classifying...</p>
                                </div>
                            )}
                            {result && (
                                <div className="h-full overflow-auto custom-scrollbar">
                                    <pre className="p-8 text-xs font-mono text-emerald-400 leading-relaxed selection:bg-emerald-500/30">
                                        {JSON.stringify(result, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
