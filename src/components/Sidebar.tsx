'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, History, Settings, FileText, Menu, X,
    BrainCircuit, Zap, BarChart3, Database, Shield, Github
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/history')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setHistory(data.slice(0, 5));
            })
            .catch(console.error);
    }, [pathname]); // Refresh on navigation

    const navItems = [
        { name: 'ANALYZER', href: '/', icon: LayoutDashboard },
        { name: 'ARCHIVE', href: '/history', icon: History },
    ];

    return (
        <>
            {/* Mobile Toggle */}
            <button
                className="md:hidden fixed top-4 right-4 z-50 p-3 bg-surface border-2 border-primary/20 rounded-xl shadow-2xl glass text-primary"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Container */}
            <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-surface/80 border-r border-border transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] glass
        md:translate-x-0 md:static md:h-screen
        ${isOpen ? 'translate-x-0 shadow-[0_0_50px_rgba(0,0,0,0.5)]' : '-translate-x-full'}
      `}>
                <div className="flex flex-col h-full overflow-hidden">

                    {/* Logo Area */}
                    <div className="h-24 flex items-center gap-3 px-8 border-b border-border/50 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
                            <BrainCircuit size={24} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-xl tracking-tighter text-foreground uppercase">Shortlist.ai</span>
                            <span className="text-[10px] font-bold text-primary tracking-[0.2em] -mt-1 opacity-80">v2.0 ENTERPRISE</span>
                        </div>
                    </div>

                    {/* Nav Links */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-10">

                        <nav className="space-y-2">
                            <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-4 ml-2">Main Navigation</h3>
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black transition-all group relative overflow-hidden
                      ${isActive
                                                ? 'bg-primary text-white shadow-xl shadow-primary/30'
                                                : 'text-muted hover:bg-surface-highlight hover:text-foreground'
                                            }
                    `}
                                    >
                                        <Icon size={18} className={isActive ? 'animate-pulse' : 'group-hover:text-primary transition-colors'} />
                                        <span className="tracking-widest">{item.name}</span>
                                        {isActive && (
                                            <motion.div layoutId="nav-active" className="absolute left-0 w-1 h-2/3 bg-white rounded-r-full" />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* QUICK HISTORY */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2">Recent Protocols</h3>
                            <div className="space-y-2">
                                {history.length > 0 ? history.map((h, i) => (
                                    <Link
                                        key={h.id}
                                        href={`/history#${h.id}`}
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-highlight group transition-all border border-transparent hover:border-border"
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${h.matchScore >= 80 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                                            {h.matchScore}
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[11px] font-bold truncate group-hover:text-primary transition-colors">{h.originalFileName}</span>
                                            <span className="text-[9px] text-muted font-bold uppercase">{new Date(h.timestamp).toLocaleDateString()}</span>
                                        </div>
                                    </Link>
                                )) : (
                                    <div className="p-4 rounded-xl border border-dashed border-border text-center">
                                        <p className="text-[10px] font-black text-muted uppercase">Waiting for Data...</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* INTEL STACK */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-2">Intelligence Stack</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-3 rounded-xl bg-surface-highlight/50 border border-border flex flex-col items-center gap-2 group cursor-pointer hover:bg-primary/5 transition-colors">
                                    <BarChart3 size={16} className="text-primary group-hover:scale-110 transition-transform" />
                                    <span className="text-[9px] font-black tracking-tighter">ANALYTICS</span>
                                </div>
                                <div className="p-3 rounded-xl bg-surface-highlight/50 border border-border flex flex-col items-center gap-2 group cursor-pointer hover:bg-accent/5 transition-colors">
                                    <Database size={16} className="text-accent group-hover:scale-110 transition-transform" />
                                    <span className="text-[9px] font-black tracking-tighter">DATA LAK</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Bottom actions */}
                    <div className="p-6 border-t border-border/50 space-y-4">
                        <Link
                            href="https://github.com/Sagexd08/shortlist-ai"
                            target="_blank"
                            className="flex items-center gap-3 p-3 rounded-xl bg-foreground text-background font-black text-[10px] tracking-[0.1em] hover:opacity-90 transition-opacity"
                        >
                            <Github size={16} />
                            <span>SOURCE CODE V2</span>
                            <div className="ml-auto flex items-center gap-1 bg-background/20 px-1 rounded">
                                <div className="w-1 h-1 bg-success rounded-full animate-ping"></div>
                                <span>LIVE</span>
                            </div>
                        </Link>
                    </div>

                </div>
            </aside>

            {/* Mobile Overlay */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-background/80 backdrop-blur-md z-30 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
