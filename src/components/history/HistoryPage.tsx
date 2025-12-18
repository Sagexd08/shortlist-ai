'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { History as HistoryIcon, FileText, Calendar, Target, Trash2, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAnalysisStore } from '@/store/analysisStore';
import { cn } from '@/lib/utils'; // Assuming this exists from copy

export default function HistoryPage() {
    const router = useRouter();
    const { history, loadFromHistory, clearHistory, fetchHistory } = useAnalysisStore();

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const handleViewResult = (id: string) => {
        loadFromHistory(id);
        router.push('/');
    };

    const getRecommendationBadge = (rec: string) => {
        const config = {
            strong_fit: { label: 'Strong Fit', class: 'status-success' },
            consider: { label: 'Consider', class: 'status-warning' },
            weak_fit: { label: 'Weak Fit', class: 'status-error' },
        };
        return config[rec as keyof typeof config] || config.consider;
    };

    return (
        <div className="p-6 lg:p-8 space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <HistoryIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Analysis History</h1>
                        <p className="text-muted-foreground">View past resume screenings</p>
                    </div>
                </div>

                {history.length > 0 && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={clearHistory}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear All
                    </Button>
                )}
            </motion.div>

            {/* History List */}
            {history.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-12 text-center"
                >
                    <div className="w-16 h-16 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">No analyses yet</h3>
                    <p className="text-muted-foreground mb-6">
                        Your resume analysis history will appear here
                    </p>
                    <Button onClick={() => router.push('/')}>
                        Start First Analysis
                    </Button>
                </motion.div>
            ) : (
                <div className="space-y-3 stagger-children">
                    {history.map((item) => {
                        const badge = getRecommendationBadge(item.recommendation);

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass-card p-4 hover:border-primary/30 transition-colors"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 min-w-0 flex-1">
                                        <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center shrink-0">
                                            <FileText className="w-6 h-6 text-muted-foreground" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-medium text-foreground truncate">
                                                    {item.resumeName}
                                                </h3>
                                                <span className={cn("px-2 py-0.5 rounded text-xs font-medium", badge.class)}>
                                                    {badge.label}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground truncate">
                                                {item.jobTitle}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 shrink-0">
                                        {/* Match Score */}
                                        <div className="text-right hidden sm:block">
                                            <div className="flex items-center gap-1.5 text-sm">
                                                <Target className="w-4 h-4 text-primary" />
                                                <span className="font-mono font-medium text-foreground">
                                                    {item.matchScore}%
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">Match</p>
                                        </div>

                                        {/* Date */}
                                        <div className="text-right hidden md:block">
                                            <div className="flex items-center gap-1.5 text-sm">
                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-foreground">
                                                    {new Date(item.timestamp).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(item.timestamp).toLocaleTimeString()}
                                            </p>
                                        </div>

                                        {/* View Button */}
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleViewResult(item.id)}
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            View
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
