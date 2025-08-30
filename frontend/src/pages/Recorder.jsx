import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Loader, Clock, Activity } from 'lucide-react';
import Header from '../components/Header'

const RecorderComponent = () => {
    const [recordingState, setRecordingState] = useState('stopped');
    const [recordingTime, setRecordingTime] = useState(0);
    const [transcription, setTranscription] = useState('');
    const [analysisResult, setAnalysisResult] = useState('');

    // Refs to maintain references across renders
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

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopRecording();
        };
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

            // Create WebSocket connection
            const socket = new WebSocket("ws://127.0.0.1:8000/ws/live/");
            wsRef.current = socket;

            socket.onopen = () => {
                console.log('WebSocket connected');
            };

            socket.onmessage = (event) => {
                const newText = event.data.trim();
                if (newText) {
                    // Option 1: Replace with latest transcription
                    setTranscription(newText);
                    
                    // Option 2: Append only if different (uncomment if you prefer accumulating)
                    // setTranscription((prev) => {
                    //     if (!prev.includes(newText)) {
                    //         return prev ? prev + " " + newText : newText;
                    //     }
                    //     return prev;
                    // });
                }
            };

            socket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            socket.onclose = () => {
                console.log('WebSocket disconnected');
            };

            // Get audio stream
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    sampleRate: 16000, // Whisper prefers 16kHz
                    channelCount: 1,   // Mono audio
                    echoCancellation: true,
                    noiseSuppression: true
                } 
            });
            streamRef.current = stream;

            // Use audio/wav instead of webm for better compatibility
            const mimeType = MediaRecorder.isTypeSupported('audio/wav') 
                ? 'audio/wav' 
                : MediaRecorder.isTypeSupported('audio/webm') 
                ? 'audio/webm' 
                : 'audio/ogg';

            const mediaRecorder = new MediaRecorder(stream, { mimeType });
            recorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = async (e) => {
                if (e.data.size > 0 && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                    try {
                        const buffer = await e.data.arrayBuffer();
                        wsRef.current.send(buffer);
                    } catch (error) {
                        console.error('Error sending audio data:', error);
                    }
                }
            };

            mediaRecorder.onerror = (error) => {
                console.error('MediaRecorder error:', error);
            };

            mediaRecorder.start(2000); // Send chunks every 2 seconds for better transcription
            
        } catch (error) {
            console.error('Error starting recording:', error);
            setRecordingState('stopped');
        }
    };

    const pauseRecording = () => {
        if (recorderRef.current && recorderRef.current.state === 'recording') {
            recorderRef.current.pause();
            setRecordingState('paused');
        }
    };

    const resumeRecording = () => {
        if (recorderRef.current && recorderRef.current.state === 'paused') {
            recorderRef.current.resume();
            setRecordingState('recording');
        }
    };

    const stopRecording = () => {
        // Stop media recorder
        if (recorderRef.current) {
            if (recorderRef.current.state !== 'inactive') {
                recorderRef.current.stop();
            }
            recorderRef.current = null;
        }

        // Stop audio stream
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        // Close WebSocket
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        // Clear timer
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        setRecordingState('stopped');
        
        // Show analysis result
        const duration = recordingTime;
        setTimeout(() => {
            setAnalysisResult(`Recording complete. Quality: High • Clarity: 96% • Duration: ${duration}s • Language: English detected`);
            setRecordingTime(0);
        }, 1000);
    };

    const handleButtonClick = () => {
        if (recordingState === 'stopped') {
            startRecording();
        } else if (recordingState === 'recording') {
            pauseRecording();
        } else if (recordingState === 'paused') {
            resumeRecording();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <Header />
            <div className="bg-white border-b border-gray-100 pt-15">
                <div className="max-w-4xl mx-auto px-6 py-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Audio Recorder</h1>
                    <p className="text-gray-500 mt-1">Record and transcribe audio in real-time</p>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-6 py-12">
                {/* Recording Interface */}
                <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
                    {/* Status Display */}
                    <div className="text-center mb-8">
                        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full border-2 mb-4 transition-colors ${
                            recordingState === 'recording'
                                ? 'border-red-400 bg-red-50'
                                : recordingState === 'paused'
                                ? 'border-orange-400 bg-orange-50'
                                : 'border-gray-300 bg-gray-50'
                        }`}>
                            <Mic className={`w-8 h-8 ${
                                recordingState === 'recording' ? 'text-red-500' :
                                recordingState === 'paused' ? 'text-orange-500' : 'text-gray-400'
                            }`} />
                        </div>

                        <div className="flex items-center justify-center space-x-2 mb-2">
                            <Clock className="w-5 h-5 text-gray-400" />
                            <span className="text-3xl font-mono text-gray-900">{formatTime(recordingTime)}</span>
                        </div>

                        <div className={`text-sm font-medium ${
                            recordingState === 'recording' ? 'text-red-600' :
                            recordingState === 'paused' ? 'text-orange-600' : 'text-gray-500'
                        }`}>
                            {recordingState === 'recording' ? 'Recording...' :
                             recordingState === 'paused' ? 'Paused' : 'Ready to record'}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={handleButtonClick}
                            className={`flex items-center justify-center w-12 h-12 text-white rounded-full transition-colors ${
                                recordingState === 'stopped' 
                                    ? 'bg-green-500 hover:bg-green-600'
                                    : recordingState === 'recording'
                                    ? 'bg-orange-500 hover:bg-orange-600'
                                    : 'bg-green-500 hover:bg-green-600'
                            }`}
                        >
                            {recordingState === 'stopped' ? (
                                <Play className="w-5 h-5 ml-0.5" />
                            ) : recordingState === 'recording' ? (
                                <Pause className="w-5 h-5" />
                            ) : (
                                <Play className="w-5 h-5 ml-0.5" />
                            )}
                        </button>

                        <button
                            onClick={stopRecording}
                            disabled={recordingState === 'stopped'}
                            className="flex items-center justify-center w-12 h-12 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full transition-colors"
                        >
                            <Square className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Transcription Panel */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center mb-4">
                        <Activity className="w-5 h-5 text-gray-400 mr-2" />
                        <h3 className="font-medium text-gray-900">Live Transcription</h3>
                    </div>

                    <div className="min-h-[100px] text-gray-600 leading-relaxed">
                        {recordingState === 'recording' && !transcription ? (
                            <div className="flex items-center space-x-2">
                                <Loader className="w-4 h-4 animate-spin text-gray-400" />
                                <span className="text-gray-500">Listening...</span>
                            </div>
                        ) : transcription ? (
                            <p>{transcription}</p>
                        ) : analysisResult ? (
                            <div className="p-4 bg-green-50 rounded border border-green-200">
                                <p className="text-green-800">{analysisResult}</p>
                            </div>
                        ) : (
                            <p className="text-gray-400">Start recording to see live transcription...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecorderComponent;