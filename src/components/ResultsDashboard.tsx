'use client';

import React, { useState } from 'react';
import { AnalysisResult } from '@/lib/types';
import { AlertCircle, CheckCircle2, TrendingUp, AlertTriangle, Copy, ShieldCheck, ChevronDown, ChevronUp, Briefcase, Code2, Users } from 'lucide-react';

export default function ResultsDashboard({ result }: { result: AnalysisResult }) {
    const [expandedSummary, setExpandedSummary] = useState(false);

    // Defensive checks to prevent crashes if result is malformed
    const missingSkills = result?.missingSkills || [];
    const matches = result?.presentSkills || [];
    const presentSkills = result?.presentSkills || [];
    const extraSkills = result?.extraSkills || [];
    const strengths = result?.strengths || [];
    const score = result?.matchScore || 0;

    const scoreColor = score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--warning)' : 'var(--error)';

    const getRelevanceColor = (rel: string) => {
        switch (rel) {
            case 'High': return 'bg-red-500';
            case 'Medium': return 'bg-orange-400';
            default: return 'bg-yellow-300';
        }
    };

    const copySummary = () => {
        navigator.clipboard.writeText(result.summary);
        // Could add toast here
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700 pb-12">

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Match Score */}
                <div className="card glass flex flex-col items-center justify-center text-center relative overflow-hidden transition-all hover:scale-[1.02]">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-foreground to-transparent opacity-20"></div>
                    <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-4">Relevance Score</h3>
                    <div className="relative w-36 h-36 flex items-center justify-center group cursor-default">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path
                                d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="var(--surface-highlight)"
                                strokeWidth="2.5"
                            />
                            <path
                                d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke={scoreColor}
                                strokeWidth="2.5"
                                strokeDasharray={`${score}, 100`}
                                strokeLinecap="round"
                                className="animate-pulse"
                                style={{ transition: 'stroke-dasharray 1s ease-out' }}
                            />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                            <span className="text-4xl font-extrabold tracking-tighter transition-transform group-hover:scale-110" style={{ color: scoreColor }}>{score}%</span>
                            <span className="text-[10px] uppercase font-semibold text-muted mt-1">Match</span>
                        </div>
                    </div>
                </div>

                {/* Shortlist Probability */}
                <div className="card glass flex flex-col justify-between relative overflow-hidden group hover:border-primary/50 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div>
                        <div className="flex justify-between items-start">
                            <h3 className="text-xs font-bold text-muted uppercase tracking-widest">Shortlist Probability</h3>
                            <ShieldCheck size={18} className="text-primary opacity-50 block transition-transform group-hover:rotate-12" />
                        </div>

                        <div className="text-5xl font-extrabold mt-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                            {result.shortlistProbability}%
                        </div>
                        <p className="text-xs text-muted mt-3 font-medium">
                            Modeled on hiring heuristics & keyword density.
                        </p>
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary">
                        <TrendingUp size={16} />
                        <span>AI Prediction Confidence: High</span>
                    </div>
                </div>

                {/* Summary Card */}
                <div className="card glass flex flex-col relative">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-bold text-muted uppercase tracking-widest">Executive Summary</h3>
                        <button onClick={copySummary} className="text-muted hover:text-foreground transition-colors p-1 hover:bg-surface-highlight rounded" title="Copy Summary">
                            <Copy size={14} />
                        </button>
                    </div>

                    <div className="flex-grow">
                        <div className={`relative overflow-hidden transition-all duration-300 ${expandedSummary ? 'max-h-96' : 'max-h-24'}`}>
                            <p className="text-sm leading-relaxed text-foreground/90 font-medium italic border-l-2 border-primary/30 pl-4 py-1">
                                "{result.summary}"
                            </p>
                            {!expandedSummary && (
                                <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-surface to-transparent"></div>
                            )}
                        </div>
                        <button
                            onClick={() => setExpandedSummary(!expandedSummary)}
                            className="w-full text-center text-xs text-primary mt-2 flex items-center justify-center gap-1 hover:underline"
                        >
                            {expandedSummary ? <><ChevronUp size={12} /> Show Less</> : <><ChevronDown size={12} /> Read More</>}
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Analysis Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Missing Skills Column */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-border">
                        <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
                            <div className="p-1.5 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-yellow-600 dark:text-yellow-400 shadow-sm">
                                <AlertTriangle size={18} />
                            </div>
                            Gap Analysis
                        </h3>
                        <span className="badge badge-outline bg-surface text-xs font-mono shadow-sm">
                            {missingSkills.length} Missing
                        </span>
                    </div>

                    <div className="space-y-3">
                        {missingSkills.length === 0 ? (
                            <div className="card bg-green-50/50 dark:bg-green-900/10 border-0 flex flex-col items-center justify-center py-12 text-center">
                                <CheckCircle2 size={48} className="text-green-500 mb-2 opacity-80" />
                                <p className="text-green-700 dark:text-green-300 font-medium">Perfect Skill Match!</p>
                            </div>
                        ) : (
                            missingSkills.map((skill, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border hover:border-warning/50 hover:shadow-md transition-all group cursor-default">
                                    <div className="flex items-center gap-3">
                                        <span className={`w-2 h-2 rounded-full ring-2 ring-opacity-30 ${getRelevanceColor(skill.relevance)} ring-${skill.relevance === 'High' ? 'red' : 'yellow'}-400`}></span>
                                        <span className="font-semibold text-sm group-hover:text-foreground transition-colors">{skill.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] uppercase font-bold text-muted tracking-wider hidden sm:block">{skill.category}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm ${skill.relevance === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>
                                            {skill.relevance}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Strengths & Present Skills */}
                <div className="space-y-6">

                    {/* Key Strengths */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-bold flex items-center gap-2 text-foreground pb-2 border-b border-border">
                            <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400 shadow-sm">
                                <CheckCircle2 size={18} />
                            </div>
                            Candidate Strengths
                        </h3>
                        <div className="grid gap-3">
                            {strengths.map((str, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 bg-surface-highlight/50 rounded-lg hover:bg-surface-highlight transition-colors">
                                    <CheckCircle2 size={16} className="text-success mt-0.5 shrink-0" />
                                    <span className="text-sm font-medium">{str}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cloud */}
                    <div className="bg-surface border border-border rounded-lg p-6 shadow-sm">
                        <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Code2 size={14} /> Detected Skillset
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {presentSkills.map((skill, i) => (
                                <span key={i} className="badge bg-secondary/30 text-foreground hover:bg-primary hover:text-white transition-all cursor-default border border-border hover:border-transparent hover:scale-105 hover:shadow-md py-1.5 px-3">
                                    {skill.name}
                                </span>
                            ))}
                            {extraSkills.slice(0, 8).map((skill, i) => (
                                <span key={`ex-${i}`} className="badge badge-outline bg-transparent opacity-60 hover:opacity-100 transition-opacity hover:bg-surface-highlight">
                                    {skill.name}
                                </span>
                            ))}
                            {extraSkills.length > 8 && (
                                <span className="text-xs text-muted self-center ml-2">+{extraSkills.length - 8} more</span>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
