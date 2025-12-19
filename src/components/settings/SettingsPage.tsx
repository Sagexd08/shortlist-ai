'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnalysisSettings } from './AnalysisSettings';
import { DataSettings } from './DataSettings';

type SettingsTab = 'analysis' | 'data';

export function SettingsPage() {
    const [activeTab, setActiveTab] = useState<SettingsTab>('analysis');

    const tabs = [
        { id: 'analysis', label: 'Analysis Logic', icon: Settings },
        { id: 'data', label: 'Data Management', icon: Database },
    ];

    return (
        <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                <p className="text-muted-foreground mt-2">
                    Configure your AI analysis parameters and manage your data.
                </p>
            </motion.div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <nav className="w-full md:w-64 flex-shrink-0 space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as SettingsTab)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                                activeTab === tab.id
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </nav>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'analysis' && <AnalysisSettings />}
                            {activeTab === 'data' && <DataSettings />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
