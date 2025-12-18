'use client';

import React, { useEffect, useState } from 'react';
import { AnalysisResult } from '@/lib/types';
import { Loader2, Calendar, FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
    const [history, setHistory] = useState<AnalysisResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/history')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setHistory(data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Analysis History</h1>
                <span className="badge badge-secondary">{history.length} Scans</span>
            </div>

            <div className="grid gap-4">
                {history.length === 0 ? (
                    <div className="card text-center p-12 space-y-4">
                        <div className="bg-surface-highlight inline-block p-4 rounded-full">
                            <FileText size={32} className="text-muted" />
                        </div>
                        <h3 className="text-lg font-medium">No Analysis Records</h3>
                        <p className="text-muted">Upload a resume to get started!</p>
                        <Link href="/" className="btn btn-primary mt-4">New Scan</Link>
                    </div>
                ) : (
                    history.map((item) => (
                        <div key={item.id} className="card p-5 group hover:border-primary/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">

                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-semibold text-lg">{item.originalFileName || "Untitled Resume"}</h3>
                                    <span className={`px-2 py-0.5 rounded textxs font-bold ${item.matchScore >= 80 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {item.matchScore}% Match
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted">
                                    <Calendar size={14} />
                                    {new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString()}
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                {/* Mini Stats */}
                                <div className="hidden md:flex gap-8 text-center">
                                    <div>
                                        <div className="text-xs text-muted font-semibold uppercase">Shortlist Prob</div>
                                        <div className="font-bold text-primary">{item.shortlistProbability}%</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted font-semibold uppercase">Skills</div>
                                        <div className="font-bold">{item.presentSkills?.length || 0}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-muted font-semibold uppercase">Gaps</div>
                                        <div className="font-bold text-red-500">{item.missingSkills?.length || 0}</div>
                                    </div>
                                </div>

                                <button
                                    className="btn btn-outline p-2 rounded-full hover:bg-primary hover:text-white"
                                    onClick={() => alert('View Details coming soon in Part 2!')}
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>

                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
