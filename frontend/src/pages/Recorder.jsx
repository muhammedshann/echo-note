import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Loader, Clock, Activity, Sparkles, X, Terminal, Radio } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const RecorderComponent = () => {
    const [recordingState, setRecordingState] = useState('stopped');
    const [recordingTime, setRecordingTime] = useState(0);
    const [transcription, setTranscription] = useState('');
    const [analysisResult, setAnalysisResult] = useState('');

    const wsRef = useRef(null);
    const recorderRef = useRef(null);
    const streamRef = useRef(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (recordingState === 'recording') {
            intervalRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [recordingState]);

    useEffect(() => {
        return () => stopRecording();
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const startRecording = async () => {
        try {
            setRecordingState('recording');
            setTranscription('');
            setAnalysisResult('');

            const socket = new WebSocket("ws://127.0.0.1:8000/ws/live/");
            wsRef.current = socket;

            socket.onmessage = (event) => {
                const newText = event.data.trim();
                if (newText) setTranscription(newText);
            };

            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    sampleRate: 16000,
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true
                } 
            });
            streamRef.current = stream;

            const mimeType = MediaRecorder.isTypeSupported('audio/wav') ? 'audio/wav' : 'audio/webm';
            const mediaRecorder = new MediaRecorder(stream, { mimeType });
            recorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = async (e) => {
                if (e.data.size > 0 && wsRef.current?.readyState === WebSocket.OPEN) {
                    const buffer = await e.data.arrayBuffer();
                    wsRef.current.send(buffer);
                }
            };

            mediaRecorder.start(2000);
            
        } catch (error) {
            setRecordingState('stopped');
        }
    };

    const pauseRecording = () => {
        if (recorderRef.current?.state === 'recording') {
            recorderRef.current.pause();
            setRecordingState('paused');
        }
    };

    const resumeRecording = () => {
        if (recorderRef.current?.state === 'paused') {
            recorderRef.current.resume();
            setRecordingState('recording');
        }
    };

    const stopRecording = () => {
        if (recorderRef.current?.state !== 'inactive') recorderRef.current?.stop();
        streamRef.current?.getTracks().forEach(track => track.stop());
        wsRef.current?.close();
        if (intervalRef.current) clearInterval(intervalRef.current);

        const duration = recordingTime;
        setRecordingState('stopped');
        
        setTimeout(() => {
            setAnalysisResult(`Recording secured. Quality: High-Fidelity • Duration: ${duration}s • Signal: Optimized`);
            setRecordingTime(0);
        }, 100);
    };

    const handleButtonClick = () => {
        if (recordingState === 'stopped') startRecording();
        else if (recordingState === 'recording') pauseRecording();
        else if (recordingState === 'paused') resumeRecording();
    };

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-500 flex flex-col selection:bg-indigo-500/30">
            <Header />

            <main className="flex-grow flex flex-col items-center justify-center relative overflow-hidden px-6 py-12">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-500/5 blur-[120px] pointer-events-none" />

                <div className="w-full max-w-3xl relative z-10">
                    <header className="mb-10">
                        <div className="flex items-center gap-2 mb-2">
                            <Radio className={`w-3.5 h-3.5 ${recordingState === 'recording' ? 'text-red-500 animate-pulse' : 'text-zinc-600'}`} />
                            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-600">Neural Capture</span>
                        </div>
                        <h1 className="text-xl md:text-2xl font-medium text-zinc-100 tracking-tight">
                            Voice <span className="text-indigo-500">Live</span> Processor
                        </h1>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Control Panel */}
                        <div className="md:col-span-5 bg-zinc-950/50 border border-zinc-900 rounded-2xl p-8 flex flex-col items-center justify-center relative group">
                            <div className="absolute inset-0 bg-indigo-500/0 group-hover:bg-indigo-500/[0.02] transition-colors rounded-2xl pointer-events-none" />
                            
                            {/* Recording Sphere */}
                            <div className={`relative w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-700 ${
                                recordingState === 'recording' ? 'bg-indigo-500/10 border border-indigo-500/20' : 'bg-zinc-900 border border-zinc-800'
                            }`}>
                                {recordingState === 'recording' && (
                                    <div className="absolute inset-0 rounded-full border border-indigo-500/50 animate-ping opacity-20" />
                                )}
                                <Mic className={`w-8 h-8 transition-colors ${
                                    recordingState === 'recording' ? 'text-indigo-400' : 'text-zinc-700'
                                }`} />
                            </div>

                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-3.5 h-3.5 text-zinc-600" />
                                <span className="text-3xl font-mono text-zinc-100 tracking-tighter">{formatTime(recordingTime)}</span>
                            </div>

                            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-600 mb-8">
                                {recordingState === 'recording' ? 'System Active' : recordingState === 'paused' ? 'Paused' : 'Awaiting Input'}
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleButtonClick}
                                    className={`w-12 h-12 flex items-center justify-center rounded-xl border transition-all active:scale-95 ${
                                        recordingState === 'recording' 
                                        ? 'bg-zinc-100 border-white text-black' 
                                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                                    }`}
                                >
                                    {recordingState === 'recording' ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                                </button>

                                <button
                                    onClick={stopRecording}
                                    disabled={recordingState === 'stopped'}
                                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white disabled:opacity-20 transition-all active:scale-95"
                                >
                                    <Square className="w-4 h-4 fill-current" />
                                </button>
                            </div>
                        </div>

                        {/* Transcription Panel */}
                        <div className="md:col-span-7 bg-zinc-950 border border-zinc-900 rounded-2xl flex flex-col h-[320px]">
                            <div className="px-5 py-3 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/30">
                                <div className="flex items-center gap-2">
                                    <Activity className="w-3.5 h-3.5 text-indigo-500" />
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-600">Live Synthesis</span>
                                </div>
                                <Terminal className="w-3.5 h-3.5 text-zinc-800" />
                            </div>

                            <div className="p-6 flex-grow overflow-y-auto custom-scrollbar">
                                {recordingState === 'recording' && !transcription ? (
                                    <div className="flex items-center gap-2 text-indigo-400/50">
                                        <Loader className="w-3 h-3 animate-spin" />
                                        <span className="text-[11px] uppercase tracking-widest font-bold">Listening...</span>
                                    </div>
                                ) : transcription ? (
                                    <p className="text-[13px] leading-relaxed text-zinc-300 font-serif italic animate-in fade-in duration-500">
                                        "{transcription}"
                                    </p>
                                ) : analysisResult ? (
                                    <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-lg">
                                        <p className="text-[11px] text-indigo-400 font-mono leading-relaxed">{analysisResult}</p>
                                    </div>
                                ) : (
                                    <p className="text-[11px] text-zinc-700 uppercase tracking-widest font-bold text-center mt-20">
                                        Initialize stream to begin...
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-12 flex items-center justify-between border-t border-zinc-900 pt-6">
                        <div className="flex gap-8">
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-600 mb-1">Status</p>
                                <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-tighter">
                                    {recordingState === 'recording' ? 'Streaming' : 'Ready'}
                                </p>
                            </div>
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-600 mb-1">Latency</p>
                                <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-tighter">0.12ms</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-700">
                            <span className="text-[9px] uppercase tracking-widest">Echo-Note v2.4</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/30" />
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

export default RecorderComponent;