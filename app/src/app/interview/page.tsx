
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mic, MicOff, Square, Sparkles, Upload, FileText, Send, User, Bot, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type Message = {
    id: string;
    role: 'user' | 'model';
    content: string;
};

type InterviewState = 'setup' | 'interview' | 'feedback';

const useSpeechSynthesis = () => {
    const [speaking, setSpeaking] = useState(false);
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

    const speak = (text: string) => {
        if (!synth) return;
        synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);
        const voices = synth.getVoices();
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

function SetupStep({ onStart }: { onStart: (data: { resumeText: string, linkedinText: string }) => void }) {
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [resumeText, setResumeText] = useState("");
    const [linkedinUrl, setLinkedinUrl] = useState("");
    const [linkedinText, setLinkedinText] = useState("");
    const [loading, setLoading] = useState(false);

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setResumeFile(file);

        const formData = new FormData();
        formData.append('file', file);

        try {
            setLoading(true);
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            setResumeText(data.text);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

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

                <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">2. LinkedIn Profile (Paste Text)</label>
                    <Textarea
                        placeholder="Paste your LinkedIn Experience / About section here..."
                        className="bg-zinc-950 border-zinc-700 text-white min-h-[100px]"
                        value={linkedinText}
                        onChange={(e) => setLinkedinText(e.target.value)}
                    />
                </div>

                <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 h-12 text-lg font-semibold"
                    onClick={() => onStart({ resumeText, linkedinText })}
                    disabled={(!resumeText && !linkedinText) || loading}
                >
                    {loading ? "Processing..." : "Start Interview Simulation"}
                </Button>
            </CardContent>
        </Card>
    );
}

function LiveInterview({ contextData, onEnd }: { contextData: { resumeText: string, linkedinText: string }, onEnd: (history: Message[]) => void }) {
    const [history, setHistory] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [processing, setProcessing] = useState(false);
    const synth = useSpeechSynthesis();
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        startTurn();
        if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
            // @ts-ignore
            const SpeechRecognition = window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                handleSend(transcript);
                setIsListening(false);
            };
            recognition.onend = () => setIsListening(false);
            recognitionRef.current = recognition;
        }
    }, []);

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
                    history: history,
                    message: userMessage || "",
                    context: contextData
                })
            });
            const data = await res.json();
            if (data.text) {
                const aiMsg = { id: Date.now().toString(), role: 'model' as const, content: data.text };
                setHistory(prev => [...prev, aiMsg]);
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
            <div className="flex-1 min-h-[300px] bg-zinc-900/50 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col items-center justify-center">
                <div className={cn("absolute w-64 h-64 rounded-full blur-[100px] transition-all", synth.speaking ? "bg-purple-600/30 scale-125" : "bg-blue-600/10 scale-100")}></div>
                <Bot className={cn("w-16 h-16 pointer-events-none relative z-10 transition-colors", synth.speaking ? "text-purple-400" : "text-zinc-600")} />
                <p className="relative z-10 mt-8 text-xl font-medium text-white/90 text-center max-w-2xl px-4">
                    {synth.speaking ? history[history.length - 1]?.content : (processing ? "Thinking..." : "Listening...")}
                </p>
            </div>

            <div className="flex items-center gap-4 bg-zinc-900 p-4 rounded-2xl border border-white/10">
                <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend(input)} className="bg-black/50 border-zinc-800 text-white" placeholder="Type..." />
                <Button size="icon" className={cn("rounded-full", isListening ? "bg-red-500 animate-pulse" : "bg-purple-600")} onClick={toggleMic}>
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
                <Button variant="destructive" onClick={() => { synth.stop(); onEnd(history); }}><Square className="w-4 h-4 mr-2" /> End</Button>
            </div>
        </div>
    );
}

function FeedbackView({ history, contextData }: { history: Message[], contextData: { resumeText: string, linkedinText: string } }) {
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/interview/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ history, context: contextData })
        }).then(res => res.json()).then(data => {
            setFeedback(data.feedback);
            setLoading(false);
        });
    }, []);

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in pb-12">
            <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">Interview Complete</h1>
            <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader><CardTitle>AI Assessment</CardTitle></CardHeader>
                <CardContent>
                    {loading ? <div className="animate-pulse h-32 bg-zinc-800 rounded"></div> : <pre className="whitespace-pre-wrap font-sans text-zinc-300">{feedback}</pre>}
                </CardContent>
            </Card>
            <div className="flex justify-center"><Button onClick={() => window.location.reload()} variant="outline">Start New</Button></div>
        </div>
    );
}

export default function InterviewPage() {
    const [state, setState] = useState<InterviewState>('setup');
    const [contextData, setContextData] = useState({ resumeText: "", linkedinText: "" });
    const [finalHistory, setFinalHistory] = useState<Message[]>([]);

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans">
            <div className="max-w-7xl mx-auto">
                {state === 'setup' && <SetupStep onStart={(data) => { setContextData(data); setState('interview'); }} />}
                {state === 'interview' && <LiveInterview contextData={contextData} onEnd={(history) => { setFinalHistory(history); setState('feedback'); }} />}
                {state === 'feedback' && <FeedbackView history={finalHistory} contextData={contextData} />}
            </div>
        </div>
    );
}
