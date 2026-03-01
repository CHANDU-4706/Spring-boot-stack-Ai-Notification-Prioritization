"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2, Plus, Loader2, Filter } from "lucide-react";
import api from "@/lib/api";

export default function RulesPage() {
    const [rules, setRules] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // New Rule Form State
    const [isAdding, setIsAdding] = useState(false);
    const [ruleName, setRuleName] = useState("");
    const [condition, setCondition] = useState("");
    const [action, setAction] = useState("LATER");

    const fetchRules = async () => {
        setIsLoading(true);
        try {
            const res = await api.get("/api/rules");
            setRules(res.data);
        } catch (err) {
            console.error("Failed to fetch rules", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRules();
    }, []);

    const handleCreateRule = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post("/api/rules", {
                rule_name: ruleName,
                condition: condition,
                action: action
            });
            setIsAdding(false);
            setRuleName("");
            setCondition("");
            fetchRules();
        } catch (err) {
            console.error("Failed to create rule", err);
            alert("Failed to create rule. Check syntax.");
        }
    };

    const handleToggle = async (id: string, currentStatus: boolean) => {
        try {
            await api.patch(`/api/rules/${id}/toggle`, { is_active: !currentStatus });
            fetchRules();
        } catch (err) {
            console.error("Failed to toggle rule", err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this rule?")) return;
        try {
            await api.delete(`/api/rules/${id}`);
            fetchRules();
        } catch (err) {
            console.error("Failed to delete rule", err);
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-emerald-500/10 pb-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-2 flex items-center gap-4">
                        Rules Manager
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 backdrop-blur-md">
                            Java Edition
                        </span>
                    </h1>
                    <p className="text-gray-400 font-medium max-w-2xl">Define custom classification bypass rules using Java-based expression syntax to override AI logic.</p>
                </div>
                <Button onClick={() => setIsAdding(!isAdding)} className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black uppercase tracking-wider text-xs shadow-lg shadow-emerald-500/20">
                    <Plus className="w-4 h-4 mr-2" /> {isAdding ? 'Cancel' : 'New Rule'}
                </Button>
            </div>

            {isAdding && (
                <Card className="glass-dark border-emerald-500/30 shadow-2xl overflow-hidden animate-in slide-in-from-top duration-500">
                    <CardHeader className="bg-emerald-500/5">
                        <CardTitle className="text-xl font-black text-white">Create Custom Rule</CardTitle>
                        <CardDescription className="text-emerald-500/60 font-medium tracking-tight">Rules use Java expression syntax against the event object fields.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleCreateRule}>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70 ml-1">Rule Name</label>
                                <Input required placeholder="e.g., Marketing Emails to LATER" className="bg-emerald-500/5 border-emerald-500/10 focus:border-emerald-500/40 rounded-xl" value={ruleName} onChange={e => setRuleName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70 ml-1">Condition (e.g. source == &#39;MARKETING&#39;)</label>
                                <Input required placeholder="e.g., source == 'MARKETING'" className="bg-emerald-500/5 border-emerald-500/10 font-mono text-emerald-400 rounded-xl" value={condition} onChange={e => setCondition(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70 ml-1">Action</label>
                                <select
                                    className="w-full flex h-12 items-center justify-between rounded-xl border border-emerald-500/10 bg-emerald-500/5 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                    value={action}
                                    onChange={e => setAction(e.target.value)}
                                >
                                    <option value="NOW">Deliver NOW (Bypass AI)</option>
                                    <option value="LATER">Defer for LATER</option>
                                    <option value="DROPPED">DROP Event (Silently discard)</option>
                                </select>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-3 border-t border-emerald-500/10 bg-emerald-500/5 py-4">
                            <Button type="button" variant="ghost" className="text-gray-400 hover:text-white" onClick={() => setIsAdding(false)}>Cancel</Button>
                            <Button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black uppercase tracking-wider text-xs rounded-xl shadow-lg shadow-emerald-500/20">Save Rule</Button>
                        </CardFooter>
                    </form>
                </Card>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                    <div className="col-span-full flex flex-col items-center justify-center p-20 gap-4">
                        <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/40">Fetching Policies...</p>
                    </div>
                ) : rules.length === 0 ? (
                    <div className="col-span-full text-center py-24 glass border-white/5 rounded-2xl flex flex-col items-center gap-4 group">
                        <Filter className="h-16 w-16 text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors duration-500" />
                        <div>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No custom rules found</p>
                            <p className="text-[10px] text-gray-600 font-medium mt-1">AI prioritization is active for all signals.</p>
                        </div>
                    </div>
                ) : rules.map((rule: any) => (
                    <Card key={rule.id} className={`glass-dark border-white/5 shadow-2xl transition-all duration-500 hover:emerald-glow ${!rule.is_active ? 'opacity-40 grayscale' : ''}`}>
                        <CardHeader className="pb-4 border-b border-emerald-500/10">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-base font-black text-white leading-tight tracking-tight pr-4">
                                    {rule.rule_name}
                                </CardTitle>
                                <Switch
                                    checked={rule.is_active}
                                    className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-emerald-950 transition-all shadow-lg"
                                    onCheckedChange={() => handleToggle(rule.id, rule.is_active)}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div>
                                <p className="text-[10px] text-emerald-500/70 uppercase font-black tracking-widest mb-2 ml-1">Filter Logic</p>
                                <code className="text-[11px] block bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10 text-emerald-400 font-mono break-all leading-relaxed">
                                    {rule.condition}
                                </code>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-[10px] text-emerald-500/70 uppercase font-black tracking-widest ml-1">Enforcement</p>
                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-tighter uppercase border
                                    ${rule.action === 'NOW' ? 'bg-red-500/10 text-red-500 border-red-500/20' : rule.action === 'LATER' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-gray-400 border-white/10'}
                                `}>
                                    {rule.action}
                                </span>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0 justify-end border-t border-emerald-500/5 pb-2">
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all rounded-lg" onClick={() => handleDelete(rule.id)}>
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
