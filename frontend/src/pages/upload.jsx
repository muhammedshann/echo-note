import React, { useState, useRef } from 'react';
import { Upload, FileAudio, Video, CheckCircle, Loader, Activity } from 'lucide-react';
import Header from '../components/Header';

const UploadComponent = () => {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState('');

    const fileInputRef = useRef(null);

    const simulateUpload = (file) => {
        setIsUploading(true);
        setUploadProgress(0);

        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);
                    setTimeout(() => {
                        setAnalysisResult(
                            `File "${file.name}" processed successfully. 
              Type: ${file.type.split('/')[0]} • 
              Size: ${Math.round(file.size / 1024)}KB • 
              Duration: Estimated 2:34 • 
              Quality: High`
                        );
                    }, 500);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            setUploadedFile(file);
            setAnalysisResult('');
            simulateUpload(file);
        }
    };

    const handleReset = () => {
        setUploadedFile(null);
        setUploadProgress(0);
        setAnalysisResult('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Global Header */}
            <Header />

            {/* Page Content */}
            <main className="pt-16">
                {/* Page Title */}
                <div className="bg-white border-b border-gray-100">
                    <div className="max-w-4xl mx-auto px-6 py-6">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Media Upload
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Upload and analyze audio or video files
                        </p>
                    </div>
                </div>

                {/* Main Body */}
                <div className="max-w-2xl mx-auto px-6 py-12">
                    {/* Upload Interface */}
                    <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
                        {!uploadedFile ? (
                            <div
                                className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center hover:border-teal-300 hover:bg-teal-50/50 transition-colors cursor-pointer group"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className="mb-4">
                                    <Upload className="w-12 h-12 text-gray-400 group-hover:text-teal-500 mx-auto transition-colors" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Upload Media File
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    Click to browse or drag and drop
                                </p>
                                <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
                                    <div className="flex items-center space-x-1">
                                        <FileAudio className="w-4 h-4" />
                                        <span>Audio</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Video className="w-4 h-4" />
                                        <span>Video</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center">
                                <div className="mb-4">
                                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    File Uploaded
                                </h3>
                                <p className="text-gray-600 mb-6">{uploadedFile.name}</p>

                                {isUploading && (
                                    <div className="mb-6">
                                        <div className="bg-gray-200 rounded-full h-2 mb-2">
                                            <div
                                                className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                        <p className="text-sm text-teal-600">
                                            Processing... {uploadProgress}%
                                        </p>
                                    </div>
                                )}

                                <button
                                    onClick={handleReset}
                                    className="text-teal-600 hover:text-teal-700 text-sm font-medium transition-colors"
                                >
                                    Upload another file
                                </button>
                            </div>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="audio/*,video/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </div>

                    {/* Analysis Panel */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center mb-4">
                            <Activity className="w-5 h-5 text-gray-400 mr-2" />
                            <h3 className="font-medium text-gray-900">File Analysis</h3>
                        </div>

                        <div className="min-h-[100px] text-gray-600 leading-relaxed">
                            {isUploading ? (
                                <div className="flex items-center space-x-2">
                                    <Loader className="w-4 h-4 animate-spin text-gray-400" />
                                    <span className="text-gray-500">Analyzing file...</span>
                                </div>
                            ) : analysisResult ? (
                                <div className="p-4 bg-teal-50 rounded border border-teal-200">
                                    <p className="text-teal-800">{analysisResult}</p>
                                </div>
                            ) : (
                                <p className="text-gray-400">
                                    Upload a file to see analysis results...
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UploadComponent;