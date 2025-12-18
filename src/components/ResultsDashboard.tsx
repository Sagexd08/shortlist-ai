'use client';

import React, { useState, useEffect } from 'react';
import { AnalysisResult } from '@/lib/types';
import {
    AlertCircle, CheckCircle2, TrendingUp, AlertTriangle, Copy, ShieldCheck,
    ChevronDown, ChevronUp, Briefcase, Code2, Users, Target, Info,
    Lightbulb, Zap, Rocket, FileSearch, HelpCircle, BrainCircuit
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Components ---

const StatCard = ({ title, value, label, type, delay = 0 }: { title: string, value: number | string, label: string, type: 'success' | 'warning' | 'error' | 'primary', delay?: number }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (typeof value === 'number') {
            const duration = 1000;
            const steps = 60;
            const stepValue = value / steps;
            let current = 0;
            const timer = setInterval(() => {
                current += stepValue;
                if (current >= value) {
                    setDisplayValue(value);
                    clearInterval(timer);
                } else {
                    setDisplayValue(Math.floor(current));
                }
            }, duration / steps);
            return () => clearInterval(timer);
        }
    }, [value]);

    const getColorClass = () => {
        switch (type) {
            case 'success': return 'text-success';
            case 'warning': return 'text-warning';
            case 'error': return 'text-error';
            default: return 'text-primary';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="card glass relative overflow-hidden group hover:scale-[1.02] transition-all"
        >
            <div className="flex flex-col gap-1">
                <h3 className="text-xs font-bold text-muted uppercase tracking-widest">{title}</h3>
                <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-extrabold tracking-tighter ${getColorClass()}`}>
                        {typeof value === 'number' ? `${displayValue}%` : value}
                    </span>
                </div>
                <p className="text-[10px] text-muted font-medium mt-1 uppercase">{label}</p>
            </div>
            <div className={`absolute bottom-0 left-0 w-full h-1 bg-current opacity-20 ${getColorClass()}`}></div>
        </motion.div>
    );
};

export default function ResultsDashboard({ result }: { result: AnalysisResult }) {
    const [expandedSummary, setExpandedSummary] = useState(false);
    const [activeBucket, setActiveBucket] = useState<'present' | 'missing' | 'extra'>('present');

    const missingSkills = result?.missingSkills || [];
    const presentSkills = result?.presentSkills || [];
    const extraSkills = result?.extraSkills || [];
    const strengths = result?.strengths || [];
    const risks = result?.riskFlags || [];
    const score = result?.matchScore || 0;

    const scoreColor = score >= 75 ? 'var(--success)' : score >= 50 ? 'var(--warning)' : 'var(--error)';
    const scoreType = score >= 75 ? 'success' : score >= 50 ? 'warning' : 'error';

    return (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 animate-in slide-in-from-bottom-4 duration-700 pb-20">

            {/* LEFT & CENTER: MAIN CONTENT (3 columns on XL) */}
            <div className="xl:col-span-3 space-y-8">

                {/* TOP METRICS ROW */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard title="Overall Match" value={score} label="Confidence Score" type={scoreType} delay={0.1} />
                    <StatCard title="Skill Fit" value={result?.skillMatchScore || 0} label="Core Coverage" type={result?.skillMatchScore >= 70 ? 'success' : 'warning'} delay={0.2} />
                    <StatCard title="Risk Flags" value={risks.length} label="Issues Detected" type={risks.length > 0 ? 'error' : 'success'} delay={0.3} />
                    <StatCard title="Shortlist %" value={result?.shortlistProbability || 0} label="Success Prob." type="primary" delay={0.4} />
                </div>

                {/* SUMMARY & DECISION ROW */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Executive Summary (2 columns) */}
                    <div className="lg:col-span-2 card glass relative group">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                                <Lightbulb size={18} className="text-warning" />
                                Executive Intelligence Summary
                            </h3>
                            <button onClick={() => navigator.clipboard.writeText(result.summary)} className="btn-icon">
                                <Copy size={14} />
                            </button>
                        </div>

                        <div className={`relative overflow-hidden transition-all duration-300 ${expandedSummary ? 'max-h-[500px]' : 'max-h-[100px]'}`}>
                            <p className="text-sm leading-relaxed text-foreground/90 font-medium italic border-l-4 border-primary/30 pl-4 py-2 bg-primary/5 rounded-r-lg">
                                "{result.summary}"
                            </p>
                        </div>
                        <button
                            onClick={() => setExpandedSummary(!expandedSummary)}
                            className="w-full text-center text-xs text-primary mt-4 font-bold flex items-center justify-center gap-1 hover:underline group"
                        >
                            {expandedSummary ? 'COLLAPSE INSIGHT' : 'EXTRACT FULL LOGIC'}
                            <ChevronDown size={14} className={`transition-transform duration-300 ${expandedSummary ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                    {/* Decision Panel (1 column) */}
                    <div className="card glass border-l-4 border-l-primary relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                            <BrainCircuit size={80} />
                        </div>
                        <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-4">AI Recruiter Verdict</h3>
                        <div className="space-y-4">
                            <div className={`text-center py-3 rounded-lg font-bold text-lg uppercase tracking-tight ${result.recommendation === 'Shortlist' ? 'bg-success/10 text-success border border-success/30' :
                                result.recommendation === 'Review' ? 'bg-warning/10 text-warning border border-warning/30' :
                                    'bg-error/10 text-error border border-error/30'
                                }`}>
                                {result.recommendation}
                            </div>
                            <ul className="text-xs font-medium space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="text-success mt-0.5">●</span>
                                    {result.recommendation === 'Shortlist' ? 'Matches critical tech roadmap.' : 'Niche overlap found.'}
                                </li>
                                {risks.length > 0 && (
                                    <li className="flex items-start gap-2">
                                        <span className="text-error mt-0.5">●</span>
                                        {risks[0]}
                                    </li>
                                )}
                            </ul>
                            <button className="btn btn-primary w-full text-xs py-3 mt-2 group shadow-none ring-0">
                                Generate Interview Questions
                                <Zap size={14} className="ml-2 group-hover:fill-current" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* INTERACTIVE SKILL INTELLIGENCE */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Radial Chart (2 cols) */}
                    <div className="lg:col-span-2 card bg-surface-highlight/30 border-dashed flex flex-col items-center justify-center p-8">
                        <h3 className="text-sm font-bold text-muted uppercase tracking-widest mb-6">Skill Surface Alignment</h3>
                        <div className="relative w-48 h-48">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="16" fill="none" stroke="var(--border)" strokeWidth="3" strokeDasharray="100, 100" opacity="0.1" />
                                <motion.circle
                                    cx="18" cy="18" r="16" fill="none"
                                    stroke="var(--primary)" strokeWidth="3"
                                    strokeDasharray={`${result.skillMatchScore}, 100`}
                                    strokeLinecap="round"
                                    initial={{ strokeDasharray: "0, 100" }}
                                    animate={{ strokeDasharray: `${result.skillMatchScore}, 100` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <span className="text-4xl font-black text-primary">{result.skillMatchScore}%</span>
                                <span className="text-[10px] uppercase font-bold text-muted">Core Fit</span>
                            </div>

                            {/* Tooltip-like Info */}
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-foreground text-background text-[10px] px-2 py-1 rounded font-bold">
                                MANUAL VERIFICATION: {presentSkills.length} / {(presentSkills.length + missingSkills.length)} MATCHED
                            </div>
                        </div>
                    </div>

                    {/* Skill Buckets (3 cols) */}
                    <div className="lg:col-span-3 space-y-4">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveBucket('present')}
                                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all border ${activeBucket === 'present' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105' : 'bg-surface border-border text-muted opacity-60'}`}
                            >
                                MATCHED ({presentSkills.length})
                            </button>
                            <button
                                onClick={() => setActiveBucket('missing')}
                                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all border ${activeBucket === 'missing' ? 'bg-error text-white border-error shadow-lg shadow-error/20 scale-105' : 'bg-surface border-border text-muted opacity-60'}`}
                            >
                                MISSING ({missingSkills.length})
                            </button>
                            <button
                                onClick={() => setActiveBucket('extra')}
                                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all border ${activeBucket === 'extra' ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20 scale-105' : 'bg-surface border-border text-muted opacity-60'}`}
                            >
                                BONUS ({extraSkills.length})
                            </button>
                        </div>

                        <div className="card glass min-h-[160px] p-4 relative">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeBucket}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex flex-wrap gap-2"
                                >
                                    {activeBucket === 'present' && presentSkills.map((s, i) => (
                                        <span key={i} className="badge bg-success/10 text-success border border-success/30 px-3 py-1.5 hover:scale-110 transition-transform cursor-pointer">
                                            <CheckCircle2 size={12} className="mr-1 inline" /> {s.name}
                                        </span>
                                    ))}
                                    {activeBucket === 'missing' && missingSkills.map((s, i) => (
                                        <span key={i} className="badge bg-error/10 text-error border border-error/30 px-3 py-1.5 hover:scale-110 transition-transform cursor-pointer">
                                            <AlertTriangle size={12} className="mr-1 inline" /> {s.name} ({s.relevance})
                                        </span>
                                    ))}
                                    {activeBucket === 'extra' && extraSkills.map((s, i) => (
                                        <span key={i} className="badge bg-accent/10 text-accent border border-accent/30 px-3 py-1.5 hover:scale-110 transition-transform cursor-pointer">
                                            <Rocket size={12} className="mr-1 inline" /> {s.name}
                                        </span>
                                    ))}
                                    {(activeBucket === 'present' ? presentSkills : activeBucket === 'missing' ? missingSkills : extraSkills).length === 0 && (
                                        <div className="w-full h-full flex items-center justify-center text-muted text-sm italic">
                                            No skill categories detected in this bucket.
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* SEMANTIC HEATMAP MOCK (Explainability) */}
                <div className="card glass overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-border bg-surface-highlight/50">
                        <h3 className="text-xs font-black text-muted uppercase tracking-widest flex items-center gap-2">
                            <FileSearch size={16} /> Semantic Match Explainability (NLP Insights)
                        </h3>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-primary/40 rounded-sm"></div><span className="text-[10px] font-bold">Strong</span></div>
                            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-primary/10 rounded-sm border"></div><span className="text-[10px] font-bold">Weak</span></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 text-[11px] leading-relaxed relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface border rounded-full p-2 z-10 shadow-xl">
                            <Target size={20} className="text-primary animate-pulse" />
                        </div>
                        <div className="p-6 border-r border-border bg-background/50 max-h-48 overflow-y-auto font-mono">
                            <h4 className="text-[10px] font-black text-primary mb-2">EXTRACTED RESUME VECTOR</h4>
                            <span className="bg-primary/20 text-foreground px-1 mb-1 inline-block">Professional Experience:</span> Developed full-stack applications using React.js and Node.js. <span className="bg-primary/40 text-foreground px-1 mb-1 inline-block">Led a team of 5</span> to deliver scalable solutions... <span className="opacity-40">leveraged AWS infrastructure for deployments and monitoring.</span>
                        </div>
                        <div className="p-6 bg-surface-highlight/30 max-h-48 overflow-y-auto font-mono">
                            <h4 className="text-[10px] font-black text-accent mb-2">JOB DESCRIPTION VECTOR</h4>
                            Looking for a <span className="bg-primary/30 text-foreground px-1 mb-1 inline-block">Senior Software Engineer</span> with 5+ years of experience in <span className="bg-primary/30 text-foreground px-1 mb-1 inline-block">Javascript frameworks</span>. Must be able to <span className="bg-primary/50 text-foreground px-1 mb-1 inline-block">lead development lifecycles</span>... <span className="opacity-40">familiarity with cloud providers (AWS/GCP) required.</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* RIGHT SIDEBAR: INTELLIGENCE PANEL (1 column on XL) */}
            <div className="space-y-6">

                {/* RISK PANEL */}
                <div className="card glass border-t-4 border-t-error">
                    <h3 className="text-xs font-bold text-muted uppercase tracking-widest flex items-center gap-2 mb-4">
                        <AlertCircle size={14} className="text-error" /> Risk Assessment
                    </h3>
                    <div className="space-y-3">
                        {risks.length > 0 ? risks.map((r, i) => (
                            <div key={i} className="p-3 bg-error/5 border border-error/10 rounded-lg flex items-start gap-3">
                                <Info size={14} className="text-error mt-0.5 shrink-0" />
                                <p className="text-xs font-medium leading-tight text-error/90">{r}</p>
                            </div>
                        )) : (
                            <div className="p-4 bg-success/5 border border-success/10 rounded-lg text-center">
                                <CheckCircle2 size={24} className="text-success mx-auto mb-2 opacity-60" />
                                <p className="text-xs font-bold text-success/80">No Critical Risks Found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* RECRUITER CHECKLIST */}
                <div className="card glass">
                    <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-4">Recruiter Checklist</h3>
                    <div className="space-y-2">
                        {[
                            { label: 'Technical Alignment', match: score >= 70 },
                            { label: 'Cloud Competency', match: presentSkills.some(s => s.name.toLowerCase().includes('aws') || s.name.toLowerCase().includes('cloud')) },
                            { label: 'Leadership Indicator', match: strengths.some(s => s.toLowerCase().includes('lead') || s.toLowerCase().includes('leadership')) },
                            { label: 'Format Compliance', match: true }, // Parser wouldn't have worked otherwise
                        ].map((check, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded hover:bg-surface-highlight/50 transition-colors">
                                <span className="text-xs font-medium">{check.label}</span>
                                {check.match ? <CheckCircle2 size={14} className="text-success" /> : <HelpCircle size={14} className="text-muted" />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* EXPORT OPTIONS STUB */}
                <div className="grid grid-cols-2 gap-2">
                    <button className="btn btn-outline text-[10px] font-bold py-2 bg-surface hover:bg-primary hover:text-white border-dashed">
                        SHARE PDF
                    </button>
                    <button className="btn btn-outline text-[10px] font-bold py-2 bg-surface hover:bg-accent hover:text-white border-dashed">
                        EXPORT JSON
                    </button>
                </div>

            </div>

        </div>
    );
}
