import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileAudio, Video, CheckCircle, Loader, Activity, Sparkles, X, Copy, CheckCircle2, FileText, ArrowUpRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    "https://gqmtydfkomvcftbqosjg.supabase.co",
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxbXR5ZGZrb212Y2Z0YnFvc2pnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MzA4NTUsImV4cCI6MjA3MjMwNjg1NX0.5djSRXHXBPNIFnalfA056kXqm4pAAAR45diCZdjFxI4'
);

const UploadComponent = () => {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);
    const wsRef = useRef(null);

    useEffect(() => {
        return () => {
            if (wsRef.current) wsRef.current.close();
        };
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(analysisResult);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const showError = (message) => {
        setError(message);
        setTimeout(() => setError(''), 5000);
    };

    const handleFileSelect = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploadedFile(file);
        setAnalysisResult('');
        setError('');
        setIsUploading(true);
        setUploadProgress(10);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('http://127.0.0.1:8000/upload/', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            if (result.error) throw new Error(result.error);

            const filePath = result.path;
            setUploadProgress(50);

            const roomName = "testroom";
            wsRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/transcription/${roomName}/?supabase_path=${encodeURIComponent(filePath)}`);

            wsRef.current.onopen = () => {
                console.log("WebSocket connected");
            };

            wsRef.current.onmessage = (event) => {
                let data = null;
                try {
                    data = JSON.parse(event.data);
                } catch (err) {
                    return;
                }

                if (data.text) {
                    setAnalysisResult(prev => prev + (prev ? " " : "") + data.text);
                }

                if (data.progress !== undefined) {
                    setUploadProgress(Math.max(50, data.progress));
                    if (data.progress === 100) {
                        setIsUploading(false);
                    }
                }

                if (data.error) {
                    showError(data.error);
                    setIsUploading(false);
                }
            };

            wsRef.current.onclose = () => setIsUploading(false);
            wsRef.current.onerror = () => {
                showError("WebSocket connection error");
                setIsUploading(false);
            };

        } catch (err) {
            showError(err.message);
            setIsUploading(false);
        }
    };

    const handleReset = () => {
        setUploadedFile(null);
        setAnalysisResult('');
        setUploadProgress(0);
        setError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
    };

    return (
        <div className="min-h-screen bg-black text-zinc-500 flex flex-col selection:bg-indigo-500/30">
            <Header />

            <main className="flex-grow flex flex-col items-center justify-center relative overflow-hidden px-6 py-12">
                {/* Background Glow Effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-500/5 blur-[120px] pointer-events-none" />

                <div className="w-full max-w-3xl relative z-10">
                    <header className="mb-10">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-600">Local Intelligence</span>
                        </div>
                        <h1 className="text-xl md:text-2xl font-medium text-zinc-100 tracking-tight">
                            Media <span className="text-indigo-500">Asset</span> Transcriber
                        </h1>
                    </header>

                    {/* Upload Dropzone */}
                    <div className="group relative mb-8">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition duration-500 blur" />
                        <div 
                            className={`relative border border-zinc-900 rounded-xl p-12 text-center transition-all bg-zinc-950/50 backdrop-blur-sm ${!isUploading ? 'cursor-pointer hover:border-zinc-700' : ''}`}
                            onClick={() => !isUploading && fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="audio/*,video/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            
                            {!uploadedFile ? (
                                <>
                                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                                        <Upload className="w-5 h-5 text-zinc-400" />
                                    </div>
                                    <h3 className="text-sm font-medium text-zinc-200 mb-1">Upload Media File</h3>
                                    <p className="text-[11px] text-zinc-600 uppercase tracking-widest font-bold mb-4">Click to browse neural input</p>
                                    <div className="flex items-center justify-center space-x-6 text-[10px] text-zinc-500 uppercase tracking-tighter font-mono">
                                        <div className="flex items-center space-x-1"><FileAudio className="w-3 h-3" /><span>Audio</span></div>
                                        <div className="flex items-center space-x-1"><Video className="w-3 h-3" /><span>Video</span></div>
                                    </div>
                                </>
                            ) : (
                                <div className="animate-in fade-in duration-500">
                                    <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
                                        {isUploading ? <Loader className="w-5 h-5 text-indigo-400 animate-spin" /> : <CheckCircle className="w-5 h-5 text-indigo-400" />}
                                    </div>
                                    <h3 className="text-sm font-medium text-zinc-200 mb-1 truncate px-10">{uploadedFile.name}</h3>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-4">
                                        {isUploading ? `Analyzing Stream: ${uploadProgress}%` : 'Analysis Complete'}
                                    </p>
                                    {!isUploading && (
                                        <button onClick={(e) => { e.stopPropagation(); handleReset(); }} className="text-indigo-400 text-[10px] uppercase font-bold tracking-[0.2em] hover:text-indigo-300 transition-colors">
                                            Clear Buffer & Reset
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 flex items-center gap-2 px-1">
                            <div className="w-1 h-1 rounded-full bg-red-500" />
                            <span className="text-[11px] text-red-400 uppercase tracking-widest">{error}</span>
                        </div>
                    )}

                    {/* Transcript Output View */}
                    {(analysisResult || isUploading) && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden flex flex-col max-h-[400px]">
                            <div className="px-4 py-2 border-b border-zinc-900 bg-zinc-900/30 flex justify-between items-center">
                                <div className="flex gap-1.5 items-center">
                                    <Activity className="w-3 h-3 text-indigo-500 mr-1" />
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-600">Neural Feed</span>
                                </div>
                                {analysisResult && (
                                    <button
                                        onClick={copyToClipboard}
                                        className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5 text-zinc-500 hover:text-indigo-400 transition-colors"
                                    >
                                        {copied ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                        {copied ? 'Copied' : 'Copy Text'}
                                    </button>
                                )}
                            </div>
                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                {isUploading && !analysisResult ? (
                                    <div className="flex items-center space-x-2 opacity-50">
                                        <div className="w-1 h-1 rounded-full bg-indigo-500 animate-pulse" />
                                        <span className="text-[11px] uppercase tracking-widest">Synthesizing layers...</span>
                                    </div>
                                ) : (
                                    <p className="text-[13px] leading-relaxed text-zinc-400 font-serif italic whitespace-pre-wrap">
                                        "{analysisResult}"
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Page Meta Info */}
                    <div className="mt-12 flex items-center justify-between border-t border-zinc-900 pt-6">
                        <div className="flex gap-8">
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-600 mb-1">Status</p>
                                <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-tighter">
                                    {isUploading ? 'Computing' : 'System Idle'}
                                </p>
                            </div>
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-600 mb-1">Sync</p>
                                <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-tighter">Real-time</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] uppercase tracking-widest text-zinc-700">Echo-Note Node v2.0</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/40" />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
            `}</style>
        </div>
    );
};

export default UploadComponent;