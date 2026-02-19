import React from 'react';
import { Link } from 'react-router-dom';
import { Radio, Upload, Youtube, ArrowUpRight } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const HomePage = () => {
    const actions = [
        {
            title: "Live Stream",
            desc: "Real-time voice-to-text conversion.",
            icon: <Radio className="w-5 h-5 text-red-500" />,
            link: "/live-recording/",
            border: "hover:border-red-500/30"
        },
        {
            title: "Local Upload",
            desc: "Process existing audio/video files.",
            icon: <Upload className="w-5 h-5 text-blue-500" />,
            link: "/upload/",
            border: "hover:border-blue-500/30"
        },
        {
            title: "YouTube AI",
            desc: "Summarize content via video URL.",
            icon: <Youtube className="w-5 h-5 text-zinc-400" />,
            link: "/youtube/",
            border: "hover:border-indigo-500/30"
        }
    ];

    return (
        <div className="min-h-screen bg-black text-zinc-400 flex flex-col">
            <Header />

            <main className="flex-grow flex flex-col justify-center relative overflow-hidden">
                {/* Subtle Radial Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] pointer-events-none" />

                <div className="container mx-auto px-6 py-12 relative z-10">
                    <section className="max-w-xl mb-12">
                        <h1 className="text-2xl md:text-3xl font-medium text-zinc-100 mb-3 tracking-tight">
                            Select Workflow
                        </h1>
                        <p className="text-sm text-zinc-500 leading-relaxed max-w-sm">
                            High-fidelity transcription and intelligent analysis for your professional audio needs.
                        </p>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {actions.map((item, index) => (
                            <Link 
                                key={index} 
                                to={item.link}
                                className={`group p-5 rounded-xl bg-zinc-950/50 border border-zinc-900 transition-all duration-300 
                                    active:scale-[0.98] ${item.border} hover:bg-zinc-900/40`}
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div className="p-2 rounded-lg bg-black border border-zinc-800 group-hover:border-zinc-700 transition-colors">
                                        {item.icon}
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                                </div>
                                
                                <h2 className="text-sm font-semibold text-zinc-200 mb-1">
                                    {item.title}
                                </h2>
                                
                                <p className="text-[12px] text-zinc-500 leading-snug">
                                    {item.desc}
                                </p>
                            </Link>
                        ))}
                    </div>

                    {/* Minimal Stats Bar */}
                    <div className="mt-16 flex gap-10 items-center border-l border-zinc-900 pl-6">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 mb-1">Accuracy</p>
                            <p className="text-sm font-mono text-zinc-300">99.8%</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 mb-1">Latency</p>
                            <p className="text-sm font-mono text-zinc-300">&lt;200ms</p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default HomePage;