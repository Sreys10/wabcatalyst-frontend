"use client";

import React, { useState } from 'react';
import { Sparkles, X, FileText, CheckCircle, AlertCircle, Loader2, Download, Copy } from 'lucide-react';
import { mockProfileData } from '../../data/mockProfile';
import { generateResumeWithBackend, downloadPDF } from '../../lib/resumeApi';

interface ResumeGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ResumeGeneratorModal: React.FC<ResumeGeneratorModalProps> = ({ isOpen, onClose }) => {
    const [step, setStep] = useState<'confirm' | 'generating' | 'result'>('confirm');
    const [generatedContent, setGeneratedContent] = useState('');
    const [pdfUrl, setPdfUrl] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleGenerate = async () => {
        setStep('generating');
        setError('');

        try {
            const result = await generateResumeWithBackend(mockProfileData, 'basic');

            if (result.success && result.downloadUrl) {
                setPdfUrl(result.downloadUrl);
                setGeneratedContent('Resume generated successfully! Click download to save your PDF.');
                setStep('result');
            } else {
                throw new Error(result.error || 'Failed to generate resume');
            }
        } catch (err: any) {
            setError(err.message || 'Unable to connect to backend service');
            setStep('confirm');
        }
    };

    const handleDownload = () => {
        if (pdfUrl) {
            downloadPDF(pdfUrl, `Resume_${mockProfileData.personal.fullName.replace(/\s+/g, '_')}.pdf`);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedContent);
        alert('Copied to clipboard!');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-200">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-orange-50 dark:bg-orange-900/20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center text-orange-600 dark:text-orange-400">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">AI Resume Generator</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Powered by Google Gemini</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-full transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 flex-1 overflow-y-auto">
                    {step === 'confirm' && (
                        <div className="text-center space-y-6">
                            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400 mb-4">
                                <FileText className="w-10 h-10" />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Use Current Profile Details?</h3>
                                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                                    We will use the information from your <strong>My Profile</strong> section (Experience, Skills, Education) to generate a tailored resume.
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm flex items-center justify-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            <div className="flex justify-center gap-4 pt-4">
                                <button onClick={onClose} className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    Cancel
                                </button>
                                <button onClick={handleGenerate} className="px-6 py-3 rounded-xl bg-orange-600 dark:bg-orange-500 text-white font-medium hover:bg-orange-700 dark:hover:bg-orange-600 shadow-lg shadow-orange-200 dark:shadow-orange-900/50 transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    Generate Resume
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'generating' && (
                        <div className="flex flex-col items-center justify-center py-12 space-y-6">
                            <Loader2 className="w-12 h-12 text-orange-600 dark:text-orange-500 animate-spin" />
                            <div className="text-center space-y-2">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Generating your resume...</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Analyzing your profile and crafting the perfect summary.</p>
                            </div>
                        </div>
                    )}

                    {step === 'result' && (
                        <div className="space-y-6 h-full flex flex-col">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    Resume Generated!
                                </h3>
                                <button onClick={handleDownload} className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors flex items-center gap-2" title="Download PDF">
                                    <Download className="w-4 h-4" />
                                    Download PDF
                                </button>
                            </div>

                            <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-xl p-6 overflow-y-auto border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">
                                {generatedContent}
                            </div>

                            <div className="flex justify-end pt-4">
                                <button onClick={onClose} className="px-6 py-3 rounded-xl bg-gray-800 dark:bg-gray-700 text-white font-medium hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors">
                                    Done
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResumeGeneratorModal;
