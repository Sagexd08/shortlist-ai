
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mic, MicOff, Square, Sparkles, Upload, FileText, Send, User, Bot, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Types ---
type Message = {
    id: string;
    role: 'user' | 'model';
    content: string;
};

type InterviewState = 'setup' | 'interview' | 'feedback';

// --- Speech Hooks (Simplified for this page) ---
const useSpeechSynthesis = () => {
    const [speaking, setSpeaking] = useState(false);
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

    const speak = (text: string) => {
        if (!synth) return;

        // Cancel current speech
        synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);

        // Try to select a good voice
        const voices = synth.getVoices();
        // Prefer a natural sounding one if available (e.g., Google US English)
        const preferredVoice = voices.find(v => v.name.includes('Google US English')) || voices.find(v => v.lang === 'en-US');
        if (preferredVoice) utterance.voice = preferredVoice;

        synth.speak(utterance);
    };

    const stop = () => {
        if (synth) {
            synth.cancel();
            setSpeaking(false);
        }
    };

    return { speak, stop, speaking };
};

// --- Components ---

function SetupStep({
    onStart
}: {
    onStart: (data: { resumeText: string, linkedinText: string }) => void
}) {
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [resumeText, setResumeText] = useState("");
    const [linkedinUrl, setLinkedinUrl] = useState("");
    const [linkedinText, setLinkedinText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setResumeFile(file);

        // Auto-upload/parse
        const formData = new FormData();
        formData.append('file', file);

        try {
            setLoading(true);
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            setResumeText(data.text);
        } catch (err) {
            setError("Failed to parse resume. Please paste text manually if needed.");
        } finally {
            setLoading(false);
        }
    };

    const handleLinkedinFetch = async () => {
        if (!linkedinUrl) return;
        setLoading(true);
        setError("");

        try {
            const res = await fetch('/api/scrape/linkedin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: linkedinUrl })
            });
            const data = await res.json();

            if (data.manualActionRequired || !data.scrapedContent) {
                setError("Could not automatically scrape LinkedIn (Auth Wall). Please paste your profile details below.");
                // We keep the URL but focus the text area
            } else {
                setLinkedinText(data.scrapedContent);
            }
        } catch (err) {
            setError("Failed to fetch LinkedIn. Please paste details manually.");
        } finally {
            setLoading(false);
        }
    };

    const canStart = resumeText.length > 50; // Simple validation

    return (
        <Card className="w-full max-w-2xl mx-auto bg-zinc-900 border-zinc-800 text-white shadow-2xl">
            <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <Sparkles className="text-purple-500" />
                    Interview Setup
                </CardTitle>
                <CardDescription className="text-zinc-400">
                    Provide your details so the AI can tailor the interview to you.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Resume Section */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">1. Upload Resume</label>
                    <div className="flex items-center gap-4 p-4 border border-dashed border-zinc-700 rounded-lg bg-zinc-950/50 hover:bg-zinc-900/50 transition-colors">
                        <Upload className="text-zinc-500" />
                        <div className="flex-1">
                            <input
                                type="file"
                                onChange={handleResumeUpload}
                                accept=".pdf,.doc,.docx"
                                className="w-full bg-transparent text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600 cursor-pointer"
                            />
                        </div>
                        {resumeFile && <FileText className="text-green-500" />}
                    </div>
                </div>

                {/* LinkedIn Section */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">2. LinkedIn Profile</label>
                    <div className="flex gap-2">
                        <Input
                            placeholder="https://linkedin.com/in/username"
                            className="bg-zinc-950 border-zinc-700 text-white"
                            value={linkedinUrl}
                            onChange={(e) => setLinkedinUrl(e.target.value)}
                        />
                        <Button
                            onClick={handleLinkedinFetch}
                            disabled={loading || !linkedinUrl}
                            variant="outline"
                            className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                        >
                            Fetch
                        </Button>
                    </div>
                    {error && (
                        <div className="text-amber-500 text-sm flex items-center gap-2 bg-amber-500/10 p-2 rounded">
                            <AlertCircle className="w-4 h-4" /> {error}
                        </div>
                    )}
                    <Textarea
                        placeholder="Or paste your LinkedIn Experience / About section here..."
                        className="bg-zinc-950 border-zinc-700 text-white min-h-[100px]"
                        value={linkedinText}
                        onChange={(e) => setLinkedinText(e.target.value)}
                    />
                </div>

                <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 h-12 text-lg font-semibold"
                    onClick={() => onStart({ resumeText, linkedinText })}
                    disabled={!canStart || loading}
                >
                    {loading ? "Processing..." : "Start Interview Simulation"}
                </Button>
            </CardContent>
        </Card>
    );
}

function LiveInterview({
    contextData,
    onEnd
}: {
    contextData: { resumeText: string, linkedinText: string },
    onEnd: (history: Message[]) => void
}) {
    const [history, setHistory] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [processing, setProcessing] = useState(false);

    // Hooks
    const scrollRef = useRef<HTMLDivElement>(null);
    const synth = useSpeechSynthesis();

    // Recognition Ref for persistent access
    const recognitionRef = useRef<any>(null);

    // Initial Start
    useEffect(() => {
        startTurn();
        // Setup Speech Recognition
        if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
            // @ts-ignore
            const SpeechRecognition = window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                handleSend(transcript); // Auto-send on speech end
                setIsListening(false);
            };

            recognition.onerror = (event: any) => {
                console.error("Speech Error", event);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }
    }, []);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    const startTurn = async (userMessage?: string) => {
        setProcessing(true);

        let newHistory = [...history];
        if (userMessage) {
            newHistory.push({ id: Date.now().toString(), role: 'user', content: userMessage });
            setHistory(newHistory);
        }

        try {
            const res = await fetch('/api/interview/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    history: history.map(h => ({ role: h.role, content: h.content })),
                    message: userMessage || "",
                    context: {
                        resumeText: contextData.resumeText,
                        linkedinText: contextData.linkedinText
                    }
                })
            });

            const data = await res.json();

            if (data.text) {
                const aiMsg = { id: Date.now().toString(), role: 'model' as const, content: data.text };
                setHistory(prev => [...prev, aiMsg]);

                // Speak response
                synth.speak(data.text);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setProcessing(false);
        }
    };

    const handleSend = (text: string) => {
        if (!text.trim()) return;
        setInput("");
        startTurn(text);
    };

    const toggleMic = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] max-w-5xl mx-auto gap-6 p-4">

            {/* Visualizer / Avatar Area */}
            <div className="flex-1 min-h-[300px] bg-zinc-900/50 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col items-center justify-center">

                {/* Background Glow */}
                <div className={cn(
                    "absolute w-64 h-64 rounded-full blur-[100px] transition-all duration-1000",
                    synth.speaking ? "bg-purple-600/30 scale-125" : "bg-blue-600/10 scale-100"
                )} />

                {/* Avatar Circle */}
                <motion.div
                    animate={{
                        scale: synth.speaking ? [1, 1.1, 1] : 1,
                        boxShadow: synth.speaking
                            ? "0 0 50px rgba(168,85,247,0.5)"
                            : "0 0 20px rgba(255,255,255,0.1)"
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-32 h-32 rounded-full bg-zinc-950 border-4 border-white/20 flex items-center justify-center relative z-10"
                >
                    <Bot className={cn(
                        "w-16 h-16 transition-colors",
                        synth.speaking ? "text-purple-400" : "text-zinc-600"
                    )} />
                </motion.div>

                <div className="mt-8 text-center max-w-2xl px-4 z-10">
                    <AnimatePresence mode="wait">
                        {synth.speaking ? (
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                key="speaking-text"
                                className="text-xl font-medium text-white/90"
                            >
                                {history[history.length - 1]?.content}
                            </motion.p>
                        ) : (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                key="waiting-text"
                                className="text-zinc-500"
                            >
                                {processing ? "Thinking..." : "Listening..."}
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 bg-zinc-900 p-4 rounded-2xl border border-white/10">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                    placeholder="Type your answer..."
                    className="bg-black/50 border-zinc-800 text-white"
                />

                <Button
                    size="icon"
                    className={cn(
                        "rounded-full w-12 h-12 transition-all",
                        isListening ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-purple-600 hover:bg-purple-700"
                    )}
                    onClick={toggleMic}
                >
                    {isListening ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
                </Button>

                <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full w-12 h-12 hover:bg-zinc-800"
                    onClick={() => handleSend(input)}
                >
                    <Send className="w-5 h-5 text-zinc-400" />
                </Button>

                <div className="h-8 w-px bg-white/10 mx-2" />

                <Button
                    variant="destructive"
                    onClick={() => {
                        synth.stop();
                        onEnd(history);
                    }}
                >
                    <Square className="w-4 h-4 mr-2" /> End Interview
                </Button>
            </div>
        </div>
    );
}

function FeedbackView({ history, contextData }: { history: Message[], contextData: { resumeText: string, linkedinText: string } }) {
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const res = await fetch('/api/interview/feedback', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ history, context: contextData })
                });
                const data = await res.json();
                setFeedback(data.feedback);
            } catch (e) {
                console.error(e);
                setFeedback("Failed to load feedback analysis.");
            } finally {
                setLoading(false);
            }
        };
        fetchFeedback();
    }, []);

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                    Interview Complete
                </h1>
                <p className="text-zinc-400">
                    Here is a summary of your session.
                </p>
            </div>

            <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader>
                    <CardTitle>AI Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {loading ? (
                        <div className="space-y-4 animate-pulse">
                            <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
                            <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
                            <div className="h-32 bg-zinc-800 rounded w-full"></div>
                        </div>
                    ) : (
                        <div className="prose prose-invert prose-green max-w-none">
                            <pre className="whitespace-pre-wrap font-sans text-sm md:text-base leading-relaxed text-zinc-300">
                                {feedback}
                            </pre>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader>
                    <CardTitle>Transcript</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {history.map((msg, i) => (
                        <div key={i} className={cn(
                            "p-4 rounded-lg",
                            msg.role === 'user' ? "bg-zinc-950 ml-12 border border-zinc-800" : "bg-purple-900/10 mr-12 border border-purple-500/20"
                        )}>
                            <div className="text-xs font-bold uppercase mb-2 text-zinc-500">{msg.role}</div>
                            <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <div className="flex justify-center">
                <Button onClick={() => window.location.reload()} variant="outline">Start New Interview</Button>
            </div>
        </div>
    );
}

export default function InterviewPage() {
    const [state, setState] = useState<InterviewState>('setup');
    const [contextData, setContextData] = useState({ resumeText: "", linkedinText: "" });
    const [finalHistory, setFinalHistory] = useState<Message[]>([]);

    const startInterview = (data: { resumeText: string, linkedinText: string }) => {
        setContextData(data);
        setState('interview');
    };

    const endInterview = (history: Message[]) => {
        setFinalHistory(history);
        setState('feedback');
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans">
            <div className="max-w-7xl mx-auto">
                {state === 'setup' && <SetupStep onStart={startInterview} />}
                {state === 'interview' && <LiveInterview contextData={contextData} onEnd={endInterview} />}
                {state === 'feedback' && <FeedbackView history={finalHistory} contextData={contextData} />}
            </div>
        </div>
    );
}
