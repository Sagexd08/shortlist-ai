'use client';

import React from 'react';
import { AnalysisResult, MissingSkill, Skill } from '@/lib/types';
import { AlertCircle, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

export default function ResultsDashboard({ result }: { result: AnalysisResult }) {
    const scoreColor = result.matchScore >= 80 ? 'text-green-600' : result.matchScore >= 60 ? 'text-amber-600' : 'text-red-600';
    const scoreRingColor = result.matchScore >= 80 ? '#10b981' : result.matchScore >= 60 ? '#f59e0b' : '#ef4444';

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Match Score */}
                <div className="card flex flex-col items-center justify-center text-center p-6 bg-surface shadow-md">
                    <h3 className="text-sm font-medium text-muted uppercase tracking-wider mb-2">Match Score</h3>
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path
                                d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="var(--surface-highlight)"
                                strokeWidth="3"
                            />
                            <path
                                d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke={scoreRingColor}
                                strokeWidth="3"
                                strokeDasharray={`${result.matchScore}, 100`}
                                className="animate-pulse"
                            />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold">
                            {result.matchScore}%
                        </div>
                    </div>
                </div>

                {/* Shortlist Probability */}
                <div className="card flex flex-col justify-between p-6 bg-surface shadow-md border-l-4" style={{ borderLeftColor: 'var(--primary)' }}>
                    <div>
                        <h3 className="text-sm font-medium text-muted uppercase tracking-wider mb-1">Shortlist Probability</h3>
                        <div className="text-4xl font-bold mt-2" style={{ color: 'var(--primary)' }}>
                            {result.shortlistProbability}%
                        </div>
                        <p className="text-xs text-muted mt-2">Estimated based on skill coverage and semantic relevance.</p>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <TrendingUp size={20} className="text-primary" />
                        <span className="text-sm font-medium">Recruiter Intelligence AI</span>
                    </div>
                </div>

                {/* Summary Card */}
                <div className="card p-6 bg-surface shadow-md">
                    <h3 className="text-sm font-medium text-muted uppercase tracking-wider mb-3">AI Summary</h3>
                    <p className="text-sm leading-relaxed italic text-muted">
                        {result.summary}
                    </p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Missing Skills (Critical) */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <AlertTriangle className="text-amber-500" size={20} />
                            Missing Skills
                        </h3>
                        <span className="text-xs font-mono bg-surface-highlight px-2 py-1 rounded">
                            {result.missingSkills.length} Found
                        </span>
                    </div>

                    <div className="bg-surface rounded-lg border p-4 shadow-sm min-h-[200px]">
                        {result.missingSkills.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-muted text-sm">
                                No missing skills detected!
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                {result.missingSkills.map((skill, i) => (
                                    <li key={i} className="flex items-center justify-between p-2 hover:bg-surface-highlight rounded transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <span className={`w-2 h-2 rounded-full ${skill.relevance === 'High' ? 'bg-red-500' : 'bg-amber-400'}`}></span>
                                            <span className="font-medium">{skill.name}</span>
                                        </div>
                                        <span className="text-xs text-muted px-2 py-1 border rounded bg-white dark:bg-black opacity-0 group-hover:opacity-100 transition-opacity">
                                            {skill.category}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Present Skills & Strengths */}
                <div className="space-y-6">

                    {/* Strengths */}
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <CheckCircle2 className="text-green-500" size={20} />
                            Detected Strengths
                        </h3>
                        <div className="bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-900 rounded-lg p-4">
                            <ul className="space-y-2">
                                {result.strengths.map((str, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-green-800 dark:text-green-300">
                                        <span className="mt-1">•</span>
                                        {str}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Present Skills Chips */}
                    <div>
                        <h3 className="text-sm font-semibold mb-3 text-muted">Matched Skills Cloud</h3>
                        <div className="flex flex-wrap gap-2">
                            {result.presentSkills.map((skill, i) => (
                                <span key={i} className="badge badge-secondary cursor-default hover:bg-primary hover:text-white transition-colors">
                                    {skill.name}
                                </span>
                            ))}
                            {result.extraSkills.slice(0, 5).map((skill, i) => (
                                <span key={`ex-${i}`} className="badge badge-outline opacity-75">
                                    {skill.name}
                                </span>
                            ))}
                            {result.extraSkills.length > 5 && (
                                <span className="badge badge-outline">+{result.extraSkills.length - 5} more</span>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
