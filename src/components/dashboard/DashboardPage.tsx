import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResumeUpload } from '@/components/dashboard/ResumeUpload';
import { JobDescriptionInput } from '@/components/dashboard/JobDescriptionInput';
import { AnalysisProgress } from '@/components/dashboard/AnalysisProgress';
import { ResultsDashboard } from '@/components/results/ResultsDashboard';
import { useAnalysisStore } from '@/store/analysisStore';

export default function DashboardPage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [resumeText, setResumeText] = useState('');
    const [jobDescription, setJobDescription] = useState('');

    const {
        currentStep,
        currentResult,
        isAnalyzing,
        startAnalysis,
        reset
    } = useAnalysisStore();

    const canAnalyze = selectedFile && jobDescription.trim().length > 50;

    const handleFileSelect = (file: File, text: string) => {
        setSelectedFile(file);
        setResumeText(text);
    };

    const handleClearFile = () => {
        setSelectedFile(null);
        setResumeText('');
    };

    const handleAnalyze = () => {
        if (selectedFile && jobDescription) {
            startAnalysis(selectedFile.name, resumeText, jobDescription);
        }
    };

    const handleReset = () => {
        reset();
        setSelectedFile(null);
        setResumeText('');
        setJobDescription('');
    };

    // Show results if analysis is complete
    if (currentResult && currentStep === 'complete') {
        return <ResultsDashboard result={currentResult} onReset={handleReset} />;
    }

    // Show progress if analyzing
    if (isAnalyzing) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <AnalysisProgress currentStep={currentStep} />
            </div>
        );
    }

    // Show upload form
    return (
        <div className="min-h-screen p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm">
                        <Sparkles className="w-4 h-4" />
                        <span>AI-Powered Resume Intelligence</span>
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
                        Screen Candidates
                        <span className="gradient-text"> Instantly</span>
                    </h1>

                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Upload a resume and paste a job description to get AI-driven insights
                        on candidate fit, skill gaps, and hiring recommendations in seconds.
                    </p>
                </motion.div>

                {/* Upload Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 lg:p-8 space-y-6"
                >
                    <div className="grid lg:grid-cols-2 gap-6">
                        <ResumeUpload
                            onFileSelect={handleFileSelect}
                            selectedFile={selectedFile}
                            onClear={handleClearFile}
                        />
                        <JobDescriptionInput
                            value={jobDescription}
                            onChange={setJobDescription}
                        />
                    </div>

                    {/* Action Button */}
                    <div className="flex flex-col items-center gap-4 pt-4 border-t border-border">
                        <Button
                            size="lg"
                            disabled={!canAnalyze}
                            onClick={handleAnalyze}
                            className="px-8 py-6 text-lg font-semibold gap-2 glow-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Zap className="w-5 h-5" />
                            Analyze Resume
                        </Button>

                        <AnimatePresence>
                            {!canAnalyze && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="text-sm text-muted-foreground"
                                >
                                    {!selectedFile
                                        ? 'Upload a resume to continue'
                                        : 'Add a job description (min 50 characters)'}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
                >
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-success" />
                        ATS-grade accuracy
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        &lt;2s analysis time
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-warning" />
                        Demo mode — data not stored
                    </span>
                </motion.div>
            </div>
        </div>
    );
}
