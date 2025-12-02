"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useReactToPrint } from 'react-to-print';
import { Loader2, Printer, Download, LayoutTemplate, Server, CheckCircle, XCircle } from 'lucide-react';
import Template1 from './Template1';
import Template2 from './Template2';
import { mockProfileData } from '../../data/mockProfile';
import { generateResumeWithBackend, downloadPDF } from '../../lib/resumeApi';

const ResumeBuilder = () => {
    const { data: session } = useSession();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [profileData, setProfileData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedTemplate, setSelectedTemplate] = useState(1);
    const componentRef = useRef<HTMLDivElement>(null);

    // Backend generation states
    const [backendLoading, setBackendLoading] = useState(false);
    const [backendMessage, setBackendMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Resume_${profileData?.personal?.fullName?.replace(/\s+/g, '_') || 'User'}`,
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/profile');
                if (res.ok) {
                    const data = await res.json();
                    // Merge with mock data to ensure structure
                    setProfileData({ ...mockProfileData, ...data });
                } else {
                    setProfileData(mockProfileData);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                setProfileData(mockProfileData);
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            fetchProfile();
        } else {
            // Fallback for dev/testing without session
            setProfileData(mockProfileData);
            setLoading(false);
        }
    }, [session]);

    const handleBackendGenerate = async () => {
        setBackendLoading(true);
        setBackendMessage(null);

        try {
            const result = await generateResumeWithBackend(profileData, 'basic');

            if (result.success && result.downloadUrl) {
                setBackendMessage({ type: 'success', text: 'Resume generated successfully!' });
                // Auto-download the PDF
                setTimeout(() => {
                    downloadPDF(result.downloadUrl!, `Resume_${profileData?.personal?.fullName?.replace(/\s+/g, '_') || 'User'}.pdf`);
                }, 500);
            } else {
                setBackendMessage({
                    type: 'error',
                    text: result.error || 'Failed to generate resume. Please try again.'
                });
            }
        } catch (error) {
            setBackendMessage({
                type: 'error',
                text: 'Unable to connect to backend service. Please ensure it is running.'
            });
        } finally {
            setBackendLoading(false);
            // Clear message after 5 seconds
            setTimeout(() => setBackendMessage(null), 5000);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="w-8 h-8 animate-spin text-orange-600" /></div>;
    }

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Toolbar */}
            <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <LayoutTemplate className="w-6 h-6 text-orange-600" />
                        Resume Builder
                    </h1>
                    <div className="h-6 w-px bg-gray-300 mx-2"></div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSelectedTemplate(1)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedTemplate === 1 ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            Modern Dark
                        </button>
                        <button
                            onClick={() => setSelectedTemplate(2)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedTemplate === 2 ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            Minimalist
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleBackendGenerate}
                        disabled={backendLoading}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {backendLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Server className="w-4 h-4" />
                                Generate PDF (Backend)
                            </>
                        )}
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-orange-600 text-white px-6 py-2.5 rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 font-medium"
                    >
                        <Download className="w-4 h-4" />
                        Download PDF
                    </button>
                </div>
            </div>

            {/* Notification Banner */}
            {backendMessage && (
                <div className={`px-8 py-3 flex items-center gap-3 ${backendMessage.type === 'success' ? 'bg-green-50 border-b border-green-200' : 'bg-red-50 border-b border-red-200'}`}>
                    {backendMessage.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${backendMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                        {backendMessage.text}
                    </span>
                </div>
            )}

            {/* Preview Area */}
            <div className="flex-1 overflow-auto p-8 flex justify-center bg-gray-100">
                <div className="scale-[0.8] origin-top shadow-2xl">
                    <div ref={componentRef}>
                        {selectedTemplate === 1 ? (
                            <Template1 data={profileData} />
                        ) : (
                            <Template2 data={profileData} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilder;
