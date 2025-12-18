'use client';

import React, { useState, useEffect } from 'react';
import UploadZone from '@/components/UploadZone';
import JobDescriptionInput from '@/components/JobDescriptionInput';
import ResultsDashboard from '@/components/ResultsDashboard';
import { AnalysisResult } from '@/lib/types';
import {
  Loader2, ArrowRight, BrainCircuit, Scan, ShieldCheck,
  Search, Cpu, CheckCircle2, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADING_STEPS = [
  { id: 'parse', label: 'PARSING DOCUMENT STRUCTURE', icon: Scan },
  { id: 'extract', label: 'EXTRACTING MULTI-DIMENSIONAL SKILLS', icon: Cpu },
  { id: 'semantic', label: 'COMPUTING SEMANTIC ALIGNMENT', icon: Search },
  { id: 'score', label: 'PREDICTING SHORTLIST PROBABILITY', icon: ShieldCheck },
];

export default function Home() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [resumeText, setResumeText] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [jd, setJd] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleUploadComplete = (id: string, text: string, name: string) => {
    setResumeId(id);
    setResumeText(text);
    setFileName(name);
    if (step === 1) setStep(2);
  };

  const handleReset = () => {
    setResumeId(null);
    setResumeText(null);
    setFileName(null);
    setResult(null);
    setStep(1);
    setLoadingStep(0);
  };

  const handleAnalyze = async () => {
    if (!resumeId || !resumeText || !jd) return;

    setLoading(true);
    setLoadingStep(0);

    // Simulated progress steps for better UX
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 800);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeId,
          text: resumeText,
          jdText: jd,
          originalName: fileName
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");

      // Artificial delay to show the final step logic
      setTimeout(() => {
        setResult(data);
        setStep(3);
        setLoading(false);
        clearInterval(interval);
      }, 1200);

    } catch (e: any) {
      console.error(e);
      alert(e.message || "Analysis failed. Please try again.");
      setLoading(false);
      clearInterval(interval);
    }
  };

  return (
    <div className="min-h-full flex flex-col items-center max-w-7xl mx-auto px-4 relative">

      {/* BACKGROUND TEXTURE */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <AnimatePresence mode="wait">
        {step !== 3 && (
          <motion.div
            key="hero"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full text-center space-y-6 pt-12 mb-16 relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary mb-2 shadow-xl shadow-primary/5">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </div>
              SaaS Enterprise Grade Recruitment AI
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground flex flex-col items-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-accent">Shortlist.ai</span>
              <span className="text-2xl md:text-3xl font-bold text-muted -mt-2">Instant Human-Level Screening</span>
            </h1>
            <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed font-medium">
              Eliminate candidate noise. Our serverless intelligence engine parses, matches, and ranks talent using high-fidelity NLP.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full space-y-8 relative z-10">

        {/* Step 1 & 2 Container */}
        <AnimatePresence mode="wait">
          {!loading && step !== 3 && (
            <motion.div
              key="inputs"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`grid grid-cols-1 md:grid-cols-2 gap-8`}
            >
              {/* Left Column: Resume */}
              <div className="space-y-4">
                <h2 className="text-sm font-black text-muted uppercase tracking-widest flex items-center gap-2">
                  <div className="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">1</div>
                  Ingest Candidate Protocol
                </h2>
                <UploadZone onUploadComplete={handleUploadComplete} onReset={handleReset} />

                {resumeText && (
                  <div className="p-4 bg-surface-highlight border rounded-lg text-xs flex items-center justify-between border-dashed">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-success/20 text-success rounded">
                        <CheckCircle2 size={12} />
                      </div>
                      <span className="font-bold text-muted uppercase tracking-tighter">DATA EXTRACTION SUCCESSFUL</span>
                    </div>
                    <span className="font-black text-primary">{resumeText.split(/\s+/).length} TOKENS</span>
                  </div>
                )}
              </div>

              {/* Right Column: JD */}
              <div className={`space-y-4 transition-all duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
                <h2 className="text-sm font-black text-muted uppercase tracking-widest flex items-center gap-2">
                  <div className="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">2</div>
                  Target Requirements Vector
                </h2>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative h-[250px]">
                    <JobDescriptionInput value={jd} onChange={setJd} disabled={step < 2} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full flex flex-col items-center justify-center py-24 space-y-12"
            >
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 rounded-full border-4 border-primary/10 border-t-primary animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <BrainCircuit size={48} className="text-primary animate-pulse" />
                </div>
              </div>

              <div className="w-full max-w-sm space-y-4">
                {LOADING_STEPS.map((s, i) => {
                  const Icon = s.icon;
                  const isDone = loadingStep > i;
                  const isCurrent = loadingStep === i;
                  return (
                    <div key={s.id} className={`flex items-center gap-4 transition-all duration-300 ${isDone ? 'opacity-40 grayscale' : isCurrent ? 'opacity-100 scale-105' : 'opacity-20'}`}>
                      <div className={`p-2 rounded-lg ${isDone || isCurrent ? 'bg-primary/10 text-primary' : 'bg-surface border'}`}>
                        {isDone ? <CheckCircle2 size={16} /> : <Icon size={16} className={isCurrent ? 'animate-pulse' : ''} />}
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest">
                        {s.label}
                        {isCurrent && <span className="ml-2 animate-bounce inline-block">...</span>}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 3 && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 pt-8 border-t border-border mt-8">
                <div>
                  <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                    <Zap size={28} className="text-warning fill-warning/20" />
                    INTELLIGENCE ANALYSIS
                  </h2>
                  <p className="text-muted font-bold text-sm uppercase tracking-widest mt-1">
                    TARGET: {result.originalFileName} • REF: {result.id}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleReset} className="btn btn-outline font-black text-xs px-6 py-2 uppercase tracking-widest hover:bg-error hover:text-white hover:border-error">
                    TERMINATE & RESET
                  </button>
                </div>
              </div>
              <ResultsDashboard result={result} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Bar */}
        {step === 2 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center pt-8"
          >
            <button
              onClick={handleAnalyze}
              disabled={!jd.trim()}
              className="btn btn-primary text-sm px-12 py-4 rounded-xl shadow-2xl shadow-primary/40 flex items-center gap-3 group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="font-black uppercase tracking-widest">INITIATE DEEP ANALYSIS</span>
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              <BrainCircuit className="absolute -right-4 -bottom-4 opacity-10 scale-[3] pointer-events-none" />
            </button>
          </motion.div>
        )}

      </div>

    </div>
  );
}
