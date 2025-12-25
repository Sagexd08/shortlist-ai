'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ThreeDCardContainer, ThreeDCardBody, ThreeDCardItem } from '@/components/ui/ThreeDCard';
import {
    ArrowRight,
    CheckCircle2,
    Sparkles,
    FileText,
    TrendingUp,
    ShieldCheck,
    BrainCircuit,
    Zap,
    Search,
    Users,
    Activity,
    ChevronRight,
    Play
} from 'lucide-react';

// --- Utility Components ---

const Spotlight = ({ className, fill = "white" }: { className?: string, fill?: string }) => {
    return (
        <svg
            className={cn(
                "animate-spotlight pointer-events-none absolute z-[1]  h-[169%] w-[138%] lg:w-[84%] opacity-0",
                className
            )}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 3787 2842"
            fill="none"
        >
            <g filter="url(#filter0_f_29_215)">
                <ellipse
                    cx="1924.71"
                    cy="273.501"
                    rx="1924.71"
                    ry="273.501"
                    transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
                    fill={fill}
                    fillOpacity="0.21"
                ></ellipse>
            </g>
            <defs>
                <filter
                    id="filter0_f_29_215"
                    x="0.860352"
                    y="0.838989"
                    width="3785.16"
                    height="2840.26"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    ></feBlend>
                    <feGaussianBlur
                        stdDeviation="151"
                        result="effect1_foregroundBlur_29_215"
                    ></feGaussianBlur>
                </filter>
            </defs>
        </svg>
    );
};

const GridBackground = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div className="absolute top-0 left-0 w-full h-[50rem] -z-10 flex items-center justify-center bg-black">
            <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none" />
            {children}
        </div>
    );
};

const FloatingNav = () => {
    const { scrollY } = useScroll();
    const [visible, setVisible] = useState(true);
    const lastScrollY = useRef(0);

    useMotionValue(0);

    useEffect(() => {
        const updateMousePosition = () => {
            const currentScrollY = scrollY.get();
            if (currentScrollY < lastScrollY.current || currentScrollY < 50) {
                setVisible(true);
            } else {
                setVisible(false);
            }
            lastScrollY.current = currentScrollY;
        };

        const unsubscribe = scrollY.on("change", updateMousePosition);
        return () => unsubscribe();
    }, [scrollY]);

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{
                y: visible ? 0 : -100,
                opacity: visible ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
            className="fixed top-6 inset-x-0 max-w-2xl mx-auto z-50 px-6 py-3 rounded-full border border-white/10 bg-black/60 backdrop-blur-md shadow-lg flex items-center justify-between"
        >
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="font-bold text-white tracking-tight">Shortlist.ai</span>
            </div>
            <div className="flex items-center gap-4">
                <Link href="/interview">
                    <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white hover:bg-white/10 rounded-full font-medium">
                        Mock Interview
                    </Button>
                </Link>
                <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">Sign In</Link>
                <Link href="/dashboard">
                    <Button size="sm" className="rounded-full bg-white text-black hover:bg-zinc-200 font-medium px-4">
                        Get Started
                    </Button>
                </Link>
            </div>
        </motion.nav>
    );
};

// --- Main Page Component ---

export default function LandingPage() {
    return (
        <div className="bg-black min-h-screen text-white overflow-x-hidden selection:bg-indigo-500/30 font-sans">
            <FloatingNav />
            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
            <GridBackground />

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 container mx-auto px-4 text-center perspective-[2000px]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-medium mb-8 hover:bg-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer group"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    V2.0 Now Live
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </motion.div>

                <h1 className="text-5xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500 mb-6 max-w-5xl mx-auto z-10 relative">
                    Resume screening <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">reimagined with AI.</span>
                </h1>

                <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Stop drowning in resumes. Our semantic engine ranks candidates instantly, highlighting skill gaps and top performers with 99% accuracy.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                    <Link href="/dashboard">
                        <Button size="lg" className="h-12 px-8 text-base rounded-full bg-white text-black hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                            Start Free Trial <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                    <Button variant="outline" size="lg" className="h-12 px-8 text-base rounded-full border-zinc-800 bg-black/50 text-white hover:bg-zinc-900 hover:text-white backdrop-blur-sm">
                        <Play className="w-4 h-4 mr-2" /> Watch Demo
                    </Button>
                </div>

                {/* 3D DASHBOARD PREVIEW */}
                <div className="relative w-full max-w-6xl mx-auto h-[400px] md:h-[600px] flex items-center justify-center z-20">
                    <ThreeDCardContainer containerClassName="w-full h-full" className="w-full h-full">
                        <ThreeDCardBody className="bg-zinc-950 rounded-xl p-2 border border-white/10 w-full h-full relative group shadow-2xl shadow-indigo-500/20">
                            {/* Main Dashboard Image */}
                            <ThreeDCardItem
                                translateZ="50"
                                className="w-full h-full rounded-lg overflow-hidden bg-zinc-900 relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent z-10" />
                                {/* Mock UI Elements */}
                                <div className="absolute top-0 left-0 right-0 h-10 border-b border-white/5 flex items-center px-4 gap-2 bg-zinc-950/50 backdrop-blur-sm z-20">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/20" />
                                    <div className="ml-4 w-64 h-6 rounded-md bg-white/5 hidden sm:block" />
                                </div>

                                <div className="absolute top-10 left-0 bottom-0 w-64 border-r border-white/5 hidden md:block z-20 bg-zinc-900/50">
                                    <div className="space-y-4 pt-4 px-4">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="h-8 rounded mx-auto bg-white/5 w-full animate-pulse-subtle" />
                                        ))}
                                    </div>
                                </div>

                                <div className="absolute top-10 left-0 md:left-64 right-0 bottom-0 p-6 z-20 overflow-hidden">
                                    <div className="grid grid-cols-3 gap-4 mb-8">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-32 rounded-xl bg-white/5 border border-white/5" />
                                        ))}
                                    </div>
                                    <div className="space-y-3">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} className="h-16 rounded-xl bg-white/5 border border-white/5 w-full flex items-center px-4 gap-4">
                                                <div className="w-8 h-8 rounded-full bg-white/10" />
                                                <div className="flex-1 h-2 rounded bg-white/10 max-w-[200px]" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </ThreeDCardItem>

                            {/* Floating Badge 1 */}
                            <ThreeDCardItem
                                translateZ="100"
                                className="absolute -top-10 -right-4 md:right-10 md:top-10 p-4 bg-zinc-900/90 backdrop-blur-xl border border-indigo-500/30 rounded-2xl shadow-xl shadow-indigo-500/20"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-400">Match Accuracy</p>
                                        <p className="text-lg font-bold text-white">99.4%</p>
                                    </div>
                                </div>
                            </ThreeDCardItem>

                            {/* Floating Badge 2 */}
                            <ThreeDCardItem
                                translateZ="80"
                                className="absolute bottom-20 -left-4 md:left-10 p-4 bg-zinc-900/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-xl shadow-purple-500/20"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                                        <Zap className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-400">Processing Time</p>
                                        <p className="text-lg font-bold text-white">&lt; 1.2s</p>
                                    </div>
                                </div>
                            </ThreeDCardItem>
                        </ThreeDCardBody>
                    </ThreeDCardContainer>
                </div>
            </section>

            {/* FEATURES BENTO GRID */}
            <section className="py-24 md:py-32 relative z-20 bg-black">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                            Everything you need to scale.
                        </h2>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                            Powerful features designed for high-growth teams. Stop managing spreadsheets and start hiring talent.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {/* Large Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="md:col-span-2 row-span-2 rounded-3xl border border-white/10 bg-zinc-900/30 p-8 relative overflow-hidden group hover:border-white/20 transition-colors"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6">
                                    <BrainCircuit className="w-6 h-6 text-purple-400" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">Semantic Intelligence</h3>
                                <p className="text-zinc-400 mb-8 max-w-md">
                                    Our AI goes beyond keywords. It understands skills, experiences, and context just like a human recruiter, but 100x faster. It can infer 'Node.js' expertise even if the candidate only mentions 'Express' or 'Nest'.
                                </p>
                                <div className="h-48 w-full bg-zinc-950/50 rounded-xl border border-white/5 relative overflow-hidden">
                                    {/* Abstract Viz */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-20 animate-pulse" />
                                            <div className="w-24 h-24 rounded-full border border-purple-500/30 flex items-center justify-center">
                                                <div className="w-16 h-16 rounded-full border border-purple-500/50 flex items-center justify-center">
                                                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Small Card 1 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="rounded-3xl border border-white/10 bg-zinc-900/30 p-8 relative overflow-hidden group hover:border-white/20 transition-colors"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                                <Zap className="w-5 h-5 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Instant Ranking</h3>
                            <p className="text-sm text-zinc-400">
                                Upload 1000 resumes and get a ranked list of the top 10 candidates in under 60 seconds.
                            </p>
                        </motion.div>

                        {/* Small Card 2 */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="rounded-3xl border border-white/10 bg-zinc-900/30 p-8 relative overflow-hidden group hover:border-white/20 transition-colors"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                                <ShieldCheck className="w-5 h-5 text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Bias-Free</h3>
                            <p className="text-sm text-zinc-400">
                                Customizable blind screening options to remove names, schools, and gender markers.
                            </p>
                        </motion.div>

                        {/* Wide Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="md:col-span-3 rounded-3xl border border-white/10 bg-zinc-900/30 p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group hover:border-white/20 transition-colors"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="flex-1 space-y-4">
                                <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center mb-4">
                                    <TrendingUp className="w-5 h-5 text-pink-400" />
                                </div>
                                <h3 className="text-2xl font-bold">Data-Driven Insights</h3>
                                <p className="text-zinc-400">
                                    Get detailed analytics on your candidate pipeline. Understand where your best candidates are coming from and what skills they possess.
                                </p>
                            </div>
                            <div className="flex-1 w-full h-32 md:h-auto bg-zinc-950/50 rounded-xl border border-white/5 flex items-end justify-center px-8 relative">
                                {/* Bar chart viz */}
                                <div className="flex items-end gap-3 w-full h-full pb-4 justify-around">
                                    <div className="w-8 h-[40%] bg-zinc-800 rounded-t-sm" />
                                    <div className="w-8 h-[70%] bg-zinc-700 rounded-t-sm" />
                                    <div className="w-8 h-[50%] bg-zinc-800 rounded-t-sm" />
                                    <div className="w-8 h-[90%] bg-purple-500 rounded-t-sm shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                                    <div className="w-8 h-[60%] bg-zinc-800 rounded-t-sm" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* MARQUEE SECTION */}
            <section className="py-10 border-y border-white/5 bg-black/50 overflow-hidden">
                <div className="flex gap-16 animate-shimmer whitespace-nowrap opacity-50">
                    {/* Just repeating text for effect, in real app usage logos */}
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="flex items-center gap-2 text-xl font-bold text-zinc-600 uppercase tracking-widest">
                            <Sparkles className="w-5 h-5" /> Trusted by Industry Leaders
                        </div>
                    ))}
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={`d-${i}`} className="flex items-center gap-2 text-xl font-bold text-zinc-600 uppercase tracking-widest">
                            <Sparkles className="w-5 h-5" /> Trusted by Industry Leaders
                        </div>
                    ))}
                </div>
            </section>

            {/* HOW IT WORKS SECTION */}
            <section id="how-it-works" className="py-32 relative bg-zinc-950">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 mb-4">
                            From Chaos to Clarity in 3 Steps
                        </h2>
                        <p className="text-zinc-400 text-lg">
                            Streamline your entire screening process without changing your workflow.
                        </p>
                    </div>

                    <div className="relative max-w-4xl mx-auto">
                        {/* Connecting Line */}
                        <div className="absolute left-[50%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-500/50 to-transparent hidden md:block" />

                        <div className="space-y-24">
                            {/* Step 1 */}
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                className="flex flex-col md:flex-row items-center gap-8 relative"
                            >
                                <div className="flex-1 text-right order-2 md:order-1">
                                    <h3 className="text-2xl font-bold text-white mb-2">Upload Resumes</h3>
                                    <p className="text-zinc-400">
                                        Drag and drop PDF or DOCX files. We handle bulk uploads of up to 50 resumes at once.
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-purple-500/50 z-10 flex items-center justify-center text-purple-400 font-bold text-xl shadow-[0_0_20px_rgba(168,85,247,0.3)] order-1 md:order-2">1</div>
                                <div className="flex-1 order-3">
                                    <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 aspect-video flex items-center justify-center relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors" />
                                        <FileText className="w-12 h-12 text-zinc-600 group-hover:text-purple-400 transition-colors duration-500" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Step 2 */}
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                className="flex flex-col md:flex-row items-center gap-8 relative"
                            >
                                <div className="flex-1 order-3 md:order-1">
                                    <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 aspect-video flex items-center justify-center relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
                                        <BrainCircuit className="w-12 h-12 text-zinc-600 group-hover:text-blue-400 transition-colors duration-500 animate-pulse" />
                                    </div>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-blue-500/50 z-10 flex items-center justify-center text-blue-400 font-bold text-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] order-1 md:order-2">2</div>
                                <div className="flex-1 text-left order-2 md:order-3">
                                    <h3 className="text-2xl font-bold text-white mb-2">AI Analysis</h3>
                                    <p className="text-zinc-400">
                                        The engine extracts skills, experience, and education, comparing them against your job description with semantic matching.
                                    </p>
                                </div>
                            </motion.div>

                            {/* Step 3 */}
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                className="flex flex-col md:flex-row items-center gap-8 relative"
                            >
                                <div className="flex-1 text-right order-2 md:order-1">
                                    <h3 className="text-2xl font-bold text-white mb-2">Instant Shortlist</h3>
                                    <p className="text-zinc-400">
                                        Get a ranked list of candidates with detailed insights. Identify top talent in seconds, not days.
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-green-500/50 z-10 flex items-center justify-center text-green-400 font-bold text-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] order-1 md:order-2">3</div>
                                <div className="flex-1 order-3">
                                    <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5 aspect-video flex items-center justify-center relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-colors" />
                                        <CheckCircle2 className="w-12 h-12 text-zinc-600 group-hover:text-green-400 transition-colors duration-500" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black" />

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto space-y-8"
                    >
                        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
                            Ready to make your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">next great hire?</span>
                        </h2>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                            Join thousands of forward-thinking recruiters. Start for free today, no credit card required.
                        </p>
                        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/dashboard">
                                <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-white text-black hover:bg-zinc-200">
                                    Get Started Now
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button size="lg" variant="ghost" className="h-14 px-10 text-lg rounded-full text-zinc-400 hover:text-white hover:bg-white/5">
                                    Contact Sales
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -z-10" />
            </section>

            {/* FOOTER */}
            <footer className="border-t border-white/10 bg-black pt-16 pb-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                        <div className="col-span-2 md:col-span-1 space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-white flex items-center justify-center">
                                    <Sparkles className="w-3 h-3 text-black" />
                                </div>
                                <span className="font-bold text-lg">Shortlist.ai</span>
                            </div>
                            <p className="text-sm text-zinc-500">
                                The future of recruitment is here. Fast, fair, and intelligent.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-semibold text-zinc-300">Product</h4>
                            <ul className="space-y-2 text-sm text-zinc-500">
                                <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">API</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-semibold text-zinc-300">Company</h4>
                            <ul className="space-y-2 text-sm text-zinc-500">
                                <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-semibold text-zinc-300">Legal</h4>
                            <ul className="space-y-2 text-sm text-zinc-500">
                                <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-600">
                        <div>&copy; {new Date().getFullYear()} Shortlist.ai Inc.</div>
                        <div className="flex gap-6">
                            <Sparkles className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
                            <Users className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
                            <Search className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
