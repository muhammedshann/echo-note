import React, { useState } from 'react';
import { Download, Play, Clock, Eye, User, Link as LinkIcon, ArrowUpRight, Youtube, CheckCircle2, Copy, FileText } from 'lucide-react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const YouTubeDownloader = () => {
    const [videoUrl, setVideoUrl] = useState('');
    const [videoData, setVideoData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [downloadingVideo, setDownloadingVideo] = useState(false); // NEW STATE
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const download_video = async () => {
        if (!videoUrl) return;
        setLoading(true);
        try {
            const result = await axios.post("http://localhost:8000/api/download-youtube/", {
                url: videoUrl.trim()
            });
            setVideoData(prev => ({ ...prev, transcript: result.data.text }));
        } catch (err) {
            showError(err.response?.data?.error || "Connection Refused");
        } finally {
            setLoading(false);
        }
    };

    // NEW FUNCTION: Handle MP4 Download
    const handleVideoDownload = async () => {
        if (!videoUrl) return;
        setDownloadingVideo(true);
        try {
            const result = await axios.post("http://localhost:8000/api/download-mp4/", {
                url: videoUrl.trim()
            });

            if (result.data.download_url) {
                // Create a hidden link and click it to force the download dialog
                const link = document.createElement('a');
                link.href = result.data.download_url;
                link.setAttribute('download', `${result.data.title || 'video'}.mp4`);
                link.target = "_blank"; // Safety fallback
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                showError(result.data.error || "Neural Extraction Failed");
            }
        } catch (err) {
            showError("Connection lost");
        } finally {
            setDownloadingVideo(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(videoData.transcript);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const extractVideoId = (url) => {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    const showError = (message) => {
        setError(message);
        setTimeout(() => setError(''), 5000);
    };

    const fetchVideoInfo = async () => {
        if (!videoUrl.trim()) return showError('URL Required');
        const videoId = extractVideoId(videoUrl);
        if (!videoId) return showError('Invalid Identifier');

        setLoading(true);
        setVideoData(null);
        setError('');

        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            const mockData = {
                title: "Advanced System Architecture & Neural Design",
                channel: "Core Engineering",
                duration: "24:12",
                views: "842K",
                thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
                transcript: null
            };
            setVideoData(mockData);
        } catch (err) {
            showError('Metadata Fetch Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-zinc-500 flex flex-col selection:bg-indigo-500/30">
            <Header />

            <main className="flex-grow flex flex-col items-center justify-center relative overflow-hidden px-6 py-12">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-500/5 blur-[120px] pointer-events-none" />

                <div className="w-full max-w-3xl relative z-10">
                    <header className="mb-10">
                        <div className="flex items-center gap-2 mb-2">
                            <Youtube className="w-3.5 h-3.5 text-red-500" />
                            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-600">Media Extraction</span>
                        </div>
                        <h1 className="text-xl md:text-2xl font-medium text-zinc-100 tracking-tight">
                            youtube <span className="text-indigo-500">Video</span> Processor
                        </h1>
                    </header>

                    <div className="group relative mb-8">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition duration-500 blur" />
                        <div className="relative flex items-center bg-zinc-950 border border-zinc-900 rounded-lg p-1 transition-colors group-focus-within:border-zinc-700">
                            <div className="pl-4 pr-2">
                                <LinkIcon className="w-3.5 h-3.5 text-zinc-600" />
                            </div>
                            <input
                                type="text"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && fetchVideoInfo()}
                                placeholder="Paste source identifier..."
                                className="bg-transparent border-none focus:ring-0 text-sm text-zinc-200 w-full placeholder:text-zinc-700 py-2"
                            />
                            <button
                                onClick={fetchVideoInfo}
                                disabled={loading}
                                className="bg-zinc-100 hover:bg-white text-black px-4 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? <div className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : 'Analyze'}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 flex items-center gap-2 px-1">
                            <div className="w-1 h-1 rounded-full bg-red-500" />
                            <span className="text-[11px] text-red-400 uppercase tracking-widest">{error}</span>
                        </div>
                    )}

                    {videoData && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {/* Metadata Card */}
                            <div className="bg-zinc-950/50 border border-zinc-900 rounded-xl overflow-hidden mb-6">
                                <div className="flex flex-col md:flex-row">
                                    <div className="w-full md:w-56 aspect-video relative bg-zinc-900 border-r border-zinc-900">
                                        <img src={videoData.thumbnail} className="w-full h-full object-cover opacity-70" alt="" />
                                        <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-zinc-400 border border-white/5">
                                            {videoData.duration}
                                        </div>
                                    </div>
                                    <div className="p-5 flex-grow flex flex-col justify-center">
                                        <h2 className="text-sm font-semibold text-zinc-100 mb-2">{videoData.title}</h2>
                                        <div className="flex gap-4 items-center">
                                            <div className="flex items-center gap-1.5 text-zinc-500">
                                                <User className="w-3 h-3" />
                                                <span className="text-[11px]">{videoData.channel}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-zinc-500">
                                                <Eye className="w-3 h-3" />
                                                <span className="text-[11px]">{videoData.views}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Conditional Display: Action Button or Transcript Viewer */}
                            {!videoData.transcript ? (
                                <button
                                    onClick={download_video}
                                    disabled={loading}
                                    className="w-full flex items-center justify-between p-5 rounded-lg bg-indigo-600/10 border border-indigo-500/20 hover:bg-indigo-600/20 transition-all group active:scale-[0.99]"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-500/20 rounded-md text-indigo-400 group-hover:scale-110 transition-transform">
                                            <FileText className="w-4 h-4" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[11px] font-bold text-indigo-100 uppercase tracking-[0.2em]">Generate Transcript</p>
                                            <p className="text-[10px] text-indigo-400/60 font-mono">Process neural text layer</p>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                                </button>
                            ) : (
                                <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden flex flex-col max-h-[400px]">
                                    <div className="px-4 py-2 border-b border-zinc-900 bg-zinc-900/30 flex justify-between items-center">
                                        <div className="flex gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-zinc-800" />
                                            <div className="w-2 h-2 rounded-full bg-zinc-800" />
                                            <div className="w-2 h-2 rounded-full bg-zinc-800" />
                                        </div>
                                        <button
                                            onClick={copyToClipboard}
                                            className="text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5 text-zinc-500 hover:text-indigo-400 transition-colors"
                                        >
                                            {copied ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                            {copied ? 'Copied' : 'Copy Text'}
                                        </button>
                                    </div>
                                    <div className="p-6 overflow-y-auto custom-scrollbar">
                                        <p className="text-[13px] leading-relaxed text-zinc-400 font-serif italic">
                                            "{videoData.transcript}"
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* NEW: Download Source MP4 Button */}
                            <button
                                onClick={handleVideoDownload}
                                disabled={downloadingVideo}
                                className="mt-4 w-full flex items-center justify-center gap-2 p-4 rounded-lg bg-zinc-950 border border-zinc-900 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all group active:scale-[0.99]"
                            >
                                {downloadingVideo ? (
                                    <div className="w-4 h-4 border-2 border-zinc-600 border-t-zinc-200 rounded-full animate-spin" />
                                ) : (
                                    <Download className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                                )}
                                <span className="text-[11px] font-bold text-zinc-400 group-hover:text-zinc-200 uppercase tracking-widest">
                                    {downloadingVideo ? 'Extracting Asset...' : 'Download Source MP4'}
                                </span>
                            </button>
                        </div>
                    )}

                    <div className="mt-12 flex items-center justify-between border-t border-zinc-900 pt-6">
                        <div className="flex gap-8">
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-600 mb-1">Status</p>
                                <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-tighter">Ready</p>
                            </div>
                            <div>
                                <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-600 mb-1">Access</p>
                                <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-tighter">Universal</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] uppercase tracking-widest text-zinc-700">Studio Core v1.2</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/40" />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default YouTubeDownloader;