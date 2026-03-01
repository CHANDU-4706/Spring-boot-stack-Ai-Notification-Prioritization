"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Send,
    History,
    Clock,
    Filter,
    BarChart3,
    LogOut,
    Cpu
} from "lucide-react";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Simulator", href: "/simulator", icon: Send },
    { name: "Audit Log", href: "/audit", icon: History },
    { name: "Later Queue", href: "/queue", icon: Clock },
    { name: "Rules Engine", href: "/rules", icon: Filter },
    { name: "Metrics", href: "/metrics", icon: BarChart3 },
];

export function Sidebar() {
    const pathname = usePathname();

    if (pathname === '/login') return null;

    return (
        <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border text-sidebar-foreground shadow-2xl relative z-20">
            <div className="flex h-16 shrink-0 items-center px-6">
                <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center mr-3 shadow-lg shadow-emerald-500/20">
                    <Cpu className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent tracking-tight">
                    CyePro <span className="text-emerald-500">AI</span>
                </h1>
            </div>
            <nav className="flex flex-1 flex-col px-4 py-6 overflow-y-auto">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                        <ul role="list" className="-mx-2 space-y-1.5">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                isActive
                                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_-3px_rgba(16,185,129,0.1)]"
                                                    : "text-gray-400 hover:text-emerald-300 hover:bg-emerald-500/5",
                                                "group flex gap-x-3 rounded-xl p-3 text-sm font-semibold transition-all duration-300"
                                            )}
                                        >
                                            <item.icon
                                                className={cn(
                                                    isActive ? "text-emerald-400" : "text-gray-500 group-hover:text-emerald-400",
                                                    "h-5 w-5 shrink-0 transition-colors duration-300"
                                                )}
                                                aria-hidden="true"
                                            />
                                            {item.name}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </li>
                    <li className="mt-auto px-2">
                        <Link
                            href="/login"
                            className="group flex items-center gap-x-3 rounded-xl p-3 text-sm font-semibold text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 border border-transparent hover:border-red-500/20"
                        >
                            <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
                            <span>Sign out</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
