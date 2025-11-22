"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ChevronRight, ChevronLeft, Check, User, BookOpen, Briefcase, Award, FileText, Star, SkipForward } from 'lucide-react';

const Onboarding = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        personal: {
            fullName: session?.user?.name || '',
            email: session?.user?.email || '',
            phone: '',
            location: '',
            linkedin: '',
            portfolio: '',
        },
        summary: { bio: '', jobTitles: '' },
        skills: { primary: '', tools: '', soft: '' },
        experience: [],
        education: [],
        projects: [],
    });

    const steps = [
        { id: 'personal', title: 'Personal Info', icon: User, description: 'Let\'s start with the basics' },
        { id: 'summary', title: 'Summary', icon: FileText, description: 'Tell us about yourself' },
        { id: 'skills', title: 'Skills', icon: Star, description: 'What are you good at?' },
        { id: 'experience', title: 'Experience', icon: Briefcase, description: 'Your work history' },
        { id: 'education', title: 'Education', icon: BookOpen, description: 'Your academic background' },
        { id: 'projects', title: 'Projects', icon: Award, description: 'Showcase your work' },
    ];

    const handleInputChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/dashboard');
            } else {
                console.error('Failed to save profile');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Personal
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium !text-black">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.personal.fullName}
                                    onChange={(e) => handleInputChange('personal', 'fullName', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 !text-black focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium !text-black">Email</label>
                                <input
                                    type="email"
                                    value={formData.personal.email}
                                    readOnly
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 !text-black cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium !text-black">Phone Number</label>
                                <input
                                    type="tel"
                                    value={formData.personal.phone}
                                    onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 !text-black focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                                    placeholder="+1 234 567 890"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium !text-black">Location</label>
                                <input
                                    type="text"
                                    value={formData.personal.location}
                                    onChange={(e) => handleInputChange('personal', 'location', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 !text-black focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                                    placeholder="City, Country"
                                />
                            </div>
                        </div>
                    </div>
                );
            case 1: // Summary
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="space-y-2">
                            <label className="text-sm font-medium !text-black">Professional Bio</label>
                            <textarea
                                value={formData.summary.bio}
                                onChange={(e) => handleInputChange('summary', 'bio', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 !text-black focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all min-h-[150px]"
                                placeholder="Briefly describe your professional background and goals..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium !text-black">Target Job Titles</label>
                            <input
                                type="text"
                                value={formData.summary.jobTitles}
                                onChange={(e) => handleInputChange('summary', 'jobTitles', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 !text-black focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                                placeholder="e.g. Frontend Developer, UI Designer"
                            />
                        </div>
                    </div>
                );
            case 2: // Skills
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="space-y-2">
                            <label className="text-sm font-medium !text-black">Primary Skills</label>
                            <input
                                type="text"
                                value={formData.skills.primary}
                                onChange={(e) => handleInputChange('skills', 'primary', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 !text-black focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                                placeholder="e.g. React, Node.js, Python"
                            />
                            <p className="text-xs text-gray-500">Comma separated</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium !text-black">Tools & Technologies</label>
                            <input
                                type="text"
                                value={formData.skills.tools}
                                onChange={(e) => handleInputChange('skills', 'tools', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 !text-black focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                                placeholder="e.g. VS Code, Git, Figma"
                            />
                        </div>
                    </div>
                );
            // Simplified for brevity - Experience, Education, Projects can be added similarly or skipped
            default:
                return (
                    <div className="text-center py-12 animate-fadeIn">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">You're all set!</h3>
                        <p className="text-gray-500">We have collected the essentials. You can add more details later from your profile.</p>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">

                {/* Sidebar / Stepper */}
                <div className="w-full md:w-80 bg-gray-900 p-8 text-white flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-12">
                            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center font-bold text-xl">W</div>
                            <span className="text-xl font-bold tracking-tight">WabCatalyst</span>
                        </div>

                        <div className="space-y-6">
                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                const isActive = index === currentStep;
                                const isCompleted = index < currentStep;

                                return (
                                    <div key={step.id} className={`flex items-center gap-4 transition-all ${isActive ? 'opacity-100 translate-x-2' : 'opacity-50'}`}>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${isActive ? 'bg-orange-500 border-orange-500 text-white' : isCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-gray-600 text-gray-400'}`}>
                                            {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <h4 className={`font-medium ${isActive ? 'text-white' : 'text-gray-400'}`}>{step.title}</h4>
                                            {isActive && <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="text-xs text-gray-500 mt-8">
                        Step {currentStep + 1} of {steps.length}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8 md:p-12 flex flex-col">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{steps[currentStep].title}</h2>
                        <p className="text-gray-500 mb-8">{steps[currentStep].description}</p>

                        {renderStepContent()}
                    </div>

                    <div className="flex items-center justify-between mt-8 pt-8 border-t border-gray-100">
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 0}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-colors ${currentStep === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <ChevronLeft className="w-4 h-4" /> Back
                        </button>

                        <div className="flex gap-3">
                            {currentStep < steps.length - 1 && (
                                <button
                                    onClick={handleNext}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-gray-500 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Skip <SkipForward className="w-4 h-4" />
                                </button>
                            )}
                            <button
                                onClick={handleNext}
                                disabled={loading}
                                className="flex items-center gap-2 px-8 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
                            >
                                {loading ? 'Saving...' : currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                                {!loading && currentStep !== steps.length - 1 && <ChevronRight className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
