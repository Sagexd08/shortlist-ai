'use client';

import React, { useState } from 'react';
import UploadZone from '@/components/UploadZone';
import JobDescriptionInput from '@/components/JobDescriptionInput';
import ResultsDashboard from '@/components/ResultsDashboard';
import { AnalysisResult } from '@/lib/types';
import { Loader2, ArrowRight } from 'lucide-react';

export default function Home() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [resumeText, setResumeText] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [jd, setJd] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleUploadComplete = (id: string, text: string, name: string) => {
    setResumeId(id);
    setResumeText(text);
    setFileName(name);
    // Auto advance to JD step if not there
    if (step === 1) setStep(2);
  };

  const handleReset = () => {
    setResumeId(null);
    setResumeText(null);
    setFileName(null);
    setResult(null);
    setStep(1);
  };

  const handleAnalyze = async () => {
    if (!resumeId || !resumeText || !jd) return;

    setLoading(true);
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

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setResult(data);
      setStep(3);
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center py-12 px-4">

      {/* Header */}
      <div className="w-full max-w-4xl mb-12 text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
          Resume Intelligence AI
        </h1>
        <p className="text-muted text-lg">Serverless ATS Screener & Skill Gap Analyzer</p>
      </div>

      <div className="w-full max-w-5xl space-y-8">

        {/* Step 1 & 2 Container */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 ${step === 3 ? 'hidden' : ''}`}>

          {/* Left Column: Resume */}
          <div className="space-y-4 animate-in fade-in duration-500">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
              Upload Resume
            </h2>
            <UploadZone onUploadComplete={handleUploadComplete} onReset={handleReset} />

            {/* Resume Preview Snippet (Optional - simple word count or check) */}
            {resumeText && (
              <div className="p-3 bg-green-50 text-green-700 rounded text-xs flex items-center gap-2">
                <span>✓ Extracted {resumeText.split(/\s+/).length} words</span>
              </div>
            )}
          </div>

          {/* Right Column: JD */}
          <div className={`space-y-4 transition-opacity duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
              Job Requirements
            </h2>
            <JobDescriptionInput value={jd} onChange={setJd} disabled={step < 2} />
          </div>

        </div>

        {/* Action Bar */}
        {step === 2 && (
          <div className="flex justify-center pt-4 animate-in fade-in slide-in-from-bottom-4">
            <button
              onClick={handleAnalyze}
              disabled={loading || !jd.trim()}
              className="btn btn-primary text-lg px-8 py-3 rounded-full shadow-lg shadow-blue-500/20 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  Analyze Skill Gap <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        )}

        {/* Step 3: Results */}
        {step === 3 && result && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Analysis Results</h2>
              <button onClick={() => { setStep(2); setResult(null); }} className="btn btn-outline text-sm">
                New Analysis
              </button>
            </div>
            <ResultsDashboard result={result} />
          </div>
        )}

      </div>

    </main>
  );
}
