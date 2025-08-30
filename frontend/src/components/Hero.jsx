import { Link } from 'react-router-dom';
import voiceImg from '../media/voiceimg.webp'
import { ArrowRight, Play, Zap, Brain ,Radio, Upload } from "lucide-react";


const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-white to-purple-100"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Hero Content */}
                    <div className="text-center lg:text-left animate-fade-in">
                        {/* Badge */}
                        <div className="inline-flex items-center space-x-2 bg-white/70 backdrop-blur-md rounded-lg px-4 py-2 mb-8 shadow">
                            <Zap className="h-4 w-4 text-indigo-600" />
                            <span className="text-sm font-medium text-gray-700">
                                AI-Powered Transcription
                            </span>
                        </div>

                        {/* Main Headline */}
                        <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
                            Your AI Meeting{" "}
                            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                                Summarizer
                            </span>
                        </h1>

                        {/* Subtext */}
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                            Transform your meetings with AI-powered transcription and intelligent
                            summarization. Capture every word, understand every insight, and never
                            miss a beat.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <Link
                                to="/live-recording/"
                                className="px-6 py-3 rounded-lg font-semibold bg-indigo-600 text-white shadow hover:bg-indigo-700 transition flex items-center justify-center"
                            >
                            <Radio className="h-6 w-6 text-red-500 mr-2" />
                                Live transcription
                                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <button className="px-6 py-3 rounded-lg font-semibold border border-gray-300 bg-white/60 backdrop-blur-md text-gray-700 shadow hover:bg-gray-100 transition">
                                <Link 
                                    to="/upload/" 
                                    className="flex items-center justify-center space-x-2"
                                >
                                    <Upload className="h-6 w-6 text-blue-500" />
                                    <span>Upload</span>
                                </Link>
                            </button>

                        </div>

                        {/* Stats */}
                        <div className="flex flex-col sm:flex-row gap-8 text-center lg:text-left">
                            <div>
                                <div className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">99.8%</div>
                                <div className="text-sm text-gray-500">Accuracy Rate</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">50K+</div>
                                <div className="text-sm text-gray-500">Hours Transcribed</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">10x</div>
                                <div className="text-sm text-gray-500">Faster Summaries</div>
                            </div>
                        </div>
                    </div>

                    {/* Hero Visual */}
                    <div className="relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
                        <div className="bg-white/70 backdrop-blur-md rounded-xl p-8 shadow-lg relative">
                            <img
                                src={voiceImg}
                                alt="AI transcription visualization"
                                className="w-full rounded-xl shadow-md"
                            />

                            {/* Floating icons */}
                            <div className="absolute -top-4 -right-4 bg-white/80 p-3 rounded-lg shadow animate-pulse">
                                <Brain className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div className="absolute -bottom-4 -left-4 bg-white/80 p-3 rounded-lg shadow">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs font-medium">Live Processing</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>

    );
};

export default Hero;
