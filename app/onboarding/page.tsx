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

    const [errors, setErrors] = useState<any>({});

    const validateStep = (step) => {
        const newErrors = {};
        let isValid = true;

        if (step === 0) { // Personal
            if (!formData.personal.fullName.trim()) newErrors.fullName = 'Full Name is required';
            if (!formData.personal.phone.trim()) newErrors.phone = 'Phone Number is required';
            if (!formData.personal.location.trim()) newErrors.location = 'Location is required';
        } else if (step === 1) { // Summary
            if (!formData.summary.bio.trim()) newErrors.bio = 'Professional Bio is required';
            if (!formData.summary.jobTitles.trim()) newErrors.jobTitles = 'Target Job Titles are required';
        } else if (step === 2) { // Skills
            if (!formData.skills.primary.trim()) newErrors.primary = 'Primary Skills are required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            if (currentStep < steps.length - 1) {
                setCurrentStep(prev => prev + 1);
            } else {
                handleSubmit();
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
            setErrors({});
        }
    };

    const handleSubmit = async () => {
        if (!validateStep(currentStep)) return;

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
                    <div className="space-y-8 animate-fadeIn">
                        <div className="grid grid-cols-1 gap-8">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-900 dark:text-white">Full Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={formData.personal.fullName}
                                    onChange={(e) => {
                                        handleInputChange('personal', 'fullName', e.target.value);
                                        if (errors.fullName) setErrors(prev => ({ ...prev, fullName: '' }));
                                    }}
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.fullName ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-100 dark:focus:ring-orange-900'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 outline-none transition-all placeholder-gray-400/70 dark:placeholder-gray-500/70`}
                                    placeholder="Your Name"
                                />
                                {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-900 dark:text-white">Email</label>
                                <input
                                    type="email"
                                    value={formData.personal.email || session?.user?.email || ''}
                                    readOnly
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 text-gray-700 dark:text-gray-200 cursor-not-allowed font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-900 dark:text-white">Phone Number <span className="text-red-500">*</span></label>
                                <div className="flex gap-2">
                                    <select
                                        className="w-24 px-2 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 outline-none transition-all"
                                        defaultValue="+1"
                                    >
                                        <option value="+1">🇺🇸 +1</option>
                                        <option value="+44">🇬🇧 +44</option>
                                        <option value="+91">🇮🇳 +91</option>
                                        <option value="+61">🇦🇺 +61</option>
                                        <option value="+81">🇯🇵 +81</option>
                                        <option value="+49">🇩🇪 +49</option>
                                        <option value="+33">🇫🇷 +33</option>
                                        <option value="+86">🇨🇳 +86</option>
                                    </select>
                                    <div className="flex-1">
                                        <input
                                            type="tel"
                                            value={formData.personal.phone}
                                            onChange={(e) => {
                                                handleInputChange('personal', 'phone', e.target.value);
                                                if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                                            }}
                                            className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-100 dark:focus:ring-orange-900'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 outline-none transition-all placeholder-gray-400/70 dark:placeholder-gray-500/70`}
                                            placeholder="123 456 7890"
                                        />
                                        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-900 dark:text-white">Location <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={formData.personal.location}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        const capitalized = val.replace(/\b\w/g, l => l.toUpperCase());
                                        handleInputChange('personal', 'location', capitalized);
                                        if (errors.location) setErrors(prev => ({ ...prev, location: '' }));
                                    }}
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.location ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-100 dark:focus:ring-orange-900'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 outline-none transition-all placeholder-gray-400/70 dark:placeholder-gray-500/70`}
                                    placeholder="City, Country"
                                />
                                {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
                            </div>
                        </div>
                    </div>
                );
            case 1: // Summary
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900 dark:text-white">Professional Bio <span className="text-red-500">*</span></label>
                            <textarea
                                value={formData.summary.bio}
                                onChange={(e) => {
                                    handleInputChange('summary', 'bio', e.target.value);
                                    if (errors.bio) setErrors(prev => ({ ...prev, bio: '' }));
                                }}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.bio ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-100 dark:focus:ring-orange-900'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 outline-none transition-all min-h-[150px] placeholder-gray-400 dark:placeholder-gray-400`}
                                placeholder="Briefly describe your professional background and goals..."
                            />
                            {errors.bio && <p className="text-xs text-red-500 mt-1">{errors.bio}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900 dark:text-white">Target Job Titles <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={formData.summary.jobTitles}
                                onChange={(e) => {
                                    handleInputChange('summary', 'jobTitles', e.target.value);
                                    if (errors.jobTitles) setErrors(prev => ({ ...prev, jobTitles: '' }));
                                }}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.jobTitles ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-100 dark:focus:ring-orange-900'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-400`}
                                placeholder="e.g. Frontend Developer, UI Designer"
                            />
                            {errors.jobTitles && <p className="text-xs text-red-500 mt-1">{errors.jobTitles}</p>}
                        </div>
                    </div>
                );
            case 2: // Skills
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900 dark:text-white">Primary Skills <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={formData.skills.primary}
                                onChange={(e) => {
                                    handleInputChange('skills', 'primary', e.target.value);
                                    if (errors.primary) setErrors(prev => ({ ...prev, primary: '' }));
                                }}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.primary ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-100 dark:focus:ring-orange-900'} bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-400`}
                                placeholder="e.g. React, Node.js, Python"
                            />
                            {errors.primary && <p className="text-xs text-red-500 mt-1">{errors.primary}</p>}
                            <p className="text-xs text-gray-500 dark:text-gray-400">Comma separated</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-900 dark:text-white">Tools & Technologies</label>
                            <input
                                type="text"
                                value={formData.skills.tools}
                                onChange={(e) => handleInputChange('skills', 'tools', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 outline-none transition-all placeholder-gray-400 dark:placeholder-gray-400"
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 md:p-8 font-primary">
            <div className="max-w-[1200px] w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[650px] border border-gray-100 dark:border-gray-700">

                {/* Sidebar / Stepper */}
                <div className="w-full md:w-[30%] bg-gray-900 dark:bg-gray-950 p-8 md:p-10 text-white flex flex-col justify-between shrink-0">
                    <div>
                        <div className="flex items-center gap-3 mb-12">
                            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center font-bold text-2xl text-white">W</div>
                            <span className="text-2xl font-bold tracking-tight text-white">WabCatalyst</span>
                        </div>

                        <div className="space-y-6">
                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                const isActive = index === currentStep;
                                const isCompleted = index < currentStep;

                                return (
                                    <div key={step.id} className={`flex items-center gap-4 transition-all duration-300 ${isActive ? 'opacity-100 translate-x-2' : 'opacity-60 hover:opacity-80'}`}>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${isActive ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30' : isCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-gray-700 text-gray-400 bg-gray-800/50'}`}>
                                            {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <h4 className={`text-base font-medium ${isActive ? 'text-white text-lg' : 'text-gray-400'}`}>{step.title}</h4>
                                            {isActive && <p className="text-xs text-gray-400 mt-0.5">{step.description}</p>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="text-sm text-gray-500 mt-10 font-medium">
                        Step {currentStep + 1} of {steps.length}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8 md:p-10 flex flex-col bg-white dark:bg-gray-800 overflow-y-auto">
                    <div className="flex-1 max-w-4xl mx-auto w-full">
                        <div className="mb-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">{steps[currentStep].title}</h2>
                            <p className="text-lg text-gray-500 dark:text-gray-400">{steps[currentStep].description}</p>
                        </div>

                        <div className="py-2">
                            {renderStepContent()}
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-100 dark:border-gray-700 max-w-4xl mx-auto w-full">
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 0}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-lg transition-colors ${currentStep === 0 ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        >
                            <ChevronLeft className="w-5 h-5" /> Back
                        </button>

                        <div className="flex gap-4">
                            {currentStep < steps.length - 1 && (
                                <button
                                    onClick={handleNext}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-gray-500 dark:text-gray-400 font-medium text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Skip <SkipForward className="w-5 h-5" />
                                </button>
                            )}
                            <button
                                onClick={handleNext}
                                disabled={loading}
                                className="flex items-center gap-2 px-10 py-3.5 bg-gray-900 dark:bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-gray-800 dark:hover:bg-orange-600 transition-all shadow-xl shadow-gray-200 dark:shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {loading ? 'Saving...' : currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                                {!loading && currentStep !== steps.length - 1 && <ChevronRight className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
