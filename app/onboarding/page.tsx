"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
    ChevronRight,
    ChevronLeft,
    Check,
    User,
    Briefcase,
    Star,
    FileText,
    Upload,
    MapPin,
    GraduationCap,
    Clock,
    DollarSign,
    Calendar
} from 'lucide-react';

const Onboarding = () => {
    const router = useRouter();
    const { data: session, update } = useSession();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        // Step 1: Basic Details
        fullName: '',
        countryCode: '+1', // Default
        phone: '',
        location: '',
        highestQualification: '',
        yearsOfExperience: '',
        employmentStatus: '',

        // Step 2: Job Preferences
        preferredRoles: [],
        preferredJobType: [],
        preferredLocations: [],
        expectedSalary: '',
        noticePeriod: '',

        // Step 3: Skills
        primarySkills: [],
        secondarySkills: [],
        tools: [],

        // Step 4: Resume
        resumeFile: null, // Will store file object or URL string
        resumeFileName: '' // Store file name for display
    });

    const countryCodes = [
        { code: '+1', flag: '🇺🇸', name: 'USA' },
        { code: '+44', flag: '🇬🇧', name: 'UK' },
        { code: '+91', flag: '🇮🇳', name: 'India' },
        { code: '+1', flag: '🇨🇦', name: 'Canada' },
        { code: '+61', flag: '🇦🇺', name: 'Australia' },
        { code: '+49', flag: '🇩🇪', name: 'Germany' },
        { code: '+33', flag: '🇫🇷', name: 'France' },
        { code: '+81', flag: '🇯🇵', name: 'Japan' },
        { code: '+86', flag: '🇨🇳', name: 'China' },
        { code: '+971', flag: '🇦🇪', name: 'UAE' },
    ];

    useEffect(() => {
        if (session?.user) {
            setFormData(prev => ({
                ...prev,
                fullName: session.user.name || '',
                // We could pre-fill other fields if we had them
            }));
        }
    }, [session]);

    const steps = [
        { id: 'basic', title: 'Basic Details', icon: User, description: 'Tell us about yourself' },
        { id: 'preferences', title: 'Job Preferences', icon: Briefcase, description: 'What are you looking for?' },
        { id: 'skills', title: 'Skills & Expertise', icon: Star, description: 'Showcase your strengths' },
        { id: 'resume', title: 'Resume Upload', icon: FileText, description: 'Upload your CV' },
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleArrayChange = (field, value, action = 'add') => {
        setFormData(prev => {
            const currentArray = prev[field] || [];
            if (action === 'add') {
                if (!currentArray.includes(value)) return { ...prev, [field]: [...currentArray, value] };
            } else if (action === 'remove') {
                return { ...prev, [field]: currentArray.filter(item => item !== value) };
            }
            return prev;
        });
    };

    const saveData = async (isFinal = false) => {
        setIsSaving(true);
        try {
            // Combine country code and phone for saving
            const payload = {
                ...formData,
                phone: `${formData.countryCode} ${formData.phone}`,
                isFinalStep: isFinal
            };
            // In a real app, we'd handle file upload separately (e.g., upload to S3 first)
            // For now, we'll just send the text data.

            const res = await fetch('/api/onboarding/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Failed to save');

            if (isFinal) {
                await update(); // Refresh session to update onboardingCompleted
                router.push('/dashboard');
            }
        } catch (error) {
            console.error("Save error:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleNext = async () => {
        if (currentStep < steps.length - 1) {
            await saveData(false);
            setCurrentStep(prev => prev + 1);
        } else {
            await saveData(true);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1);
    };

    // --- Render Steps ---

    const renderStep1 = () => (
        <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600"
                            placeholder="Your full name"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Phone Number</label>
                    <div className="flex gap-2">
                        <select
                            value={formData.countryCode}
                            onChange={(e) => handleInputChange('countryCode', e.target.value)}
                            className="w-28 px-2 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none text-center"
                        >
                            {countryCodes.map((c, idx) => (
                                <option key={idx} value={c.code}>
                                    {c.flag} {c.code}
                                </option>
                            ))}
                        </select>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600"
                            placeholder="123 456 7890"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Location</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600"
                            placeholder="City, Country"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Highest Qualification</label>
                    <div className="relative">
                        <GraduationCap className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        <select
                            value={formData.highestQualification}
                            onChange={(e) => handleInputChange('highestQualification', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none placeholder-gray-300 dark:placeholder-gray-600"
                        >
                            <option value="">Select Qualification</option>
                            <option value="High School">High School</option>
                            <option value="Bachelors">Bachelor's Degree</option>
                            <option value="Masters">Master's Degree</option>
                            <option value="PhD">PhD</option>
                            <option value="Diploma">Diploma</option>
                        </select>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Years of Experience</label>
                    <div className="relative">
                        <Clock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={formData.yearsOfExperience}
                            onChange={(e) => handleInputChange('yearsOfExperience', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600"
                            placeholder="e.g. 2 years"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Employment Status</label>
                    <select
                        value={formData.employmentStatus}
                        onChange={(e) => handleInputChange('employmentStatus', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600"
                    >
                        <option value="">Select Status</option>
                        <option value="Employed">Employed</option>
                        <option value="Unemployed">Unemployed</option>
                        <option value="Fresher">Fresher</option>
                        <option value="Student">Student</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Preferred Roles</label>
                <input
                    type="text"
                    placeholder="Type and press Enter to add (e.g. Frontend Developer)"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            const val = e.currentTarget.value.trim();
                            if (val) {
                                handleArrayChange('preferredRoles', val, 'add');
                                e.currentTarget.value = '';
                            }
                        }
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                    {formData.preferredRoles.map((role, idx) => (
                        <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm flex items-center gap-1">
                            {role}
                            <button onClick={() => handleArrayChange('preferredRoles', role, 'remove')} className="hover:text-orange-900">×</button>
                        </span>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Preferred Job Type</label>
                <div className="flex gap-4">
                    {['Onsite', 'Remote', 'Hybrid'].map(type => (
                        <label key={type} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.preferredJobType.includes(type)}
                                onChange={(e) => {
                                    if (e.target.checked) handleArrayChange('preferredJobType', type, 'add');
                                    else handleArrayChange('preferredJobType', type, 'remove');
                                }}
                                className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                            />
                            <span className="text-gray-700 dark:text-gray-300">{type}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Expected Salary</label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={formData.expectedSalary}
                            onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600"
                            placeholder="e.g. 50k - 70k"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Notice Period</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        <select
                            value={formData.noticePeriod}
                            onChange={(e) => handleInputChange('noticePeriod', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none placeholder-gray-300 dark:placeholder-gray-600"
                        >
                            <option value="">Select Period</option>
                            <option value="Immediate">Immediate</option>
                            <option value="15 Days">15 Days</option>
                            <option value="30 Days">30 Days</option>
                            <option value="60 Days">60 Days</option>
                            <option value="90 Days">90 Days</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Primary Skills</label>
                <input
                    type="text"
                    placeholder="Type and press Enter (e.g. React, Python)"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            const val = e.currentTarget.value.trim();
                            if (val) {
                                handleArrayChange('primarySkills', val, 'add');
                                e.currentTarget.value = '';
                            }
                        }
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                    {formData.primarySkills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
                            {skill}
                            <button onClick={() => handleArrayChange('primarySkills', skill, 'remove')} className="hover:text-blue-900">×</button>
                        </span>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tools & Technologies</label>
                <input
                    type="text"
                    placeholder="Type and press Enter (e.g. VS Code, Jira)"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            const val = e.currentTarget.value.trim();
                            if (val) {
                                handleArrayChange('tools', val, 'add');
                                e.currentTarget.value = '';
                            }
                        }
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-orange-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tools.map((tool, idx) => (
                        <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
                            {tool}
                            <button onClick={() => handleArrayChange('tools', tool, 'remove')} className="hover:text-green-900">×</button>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );

    const fileInputRef = React.useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                alert("File size should be less than 2MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, resumeFile: reader.result, resumeFileName: file.name }));
            };
            reader.readAsDataURL(file);
        }
    };

    const renderStep4 = () => (
        <div className="space-y-6 animate-fadeIn text-center py-10">
            <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-10 flex flex-col items-center justify-center hover:border-orange-500 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-800/50"
            >
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Upload your Resume</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
                    Drag and drop your resume here, or click to browse. Supported formats: PDF, DOCX (Max 2MB)
                </p>
                {formData.resumeFileName ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg">
                        <FileText className="w-4 h-4" />
                        <span className="font-medium">{formData.resumeFileName}</span>
                    </div>
                ) : (
                    <button className="px-6 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                        Browse Files
                    </button>
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                />
            </div>

            <button
                onClick={() => handleNext()}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium"
            >
                {formData.resumeFile ? "Continue" : "Skip for now"}
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 md:p-8 font-primary">
            <div className="max-w-[1000px] w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col min-h-[600px] border border-gray-100 dark:border-gray-700">

                {/* Header / Progress */}
                <div className="bg-white dark:bg-gray-800 p-8 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Setup your Profile</h1>
                        <p className="text-gray-500 dark:text-gray-400">Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}</p>
                    </div>

                    {/* Stepper Indicators */}
                    <div className="flex items-center gap-2">
                        {steps.map((step, idx) => (
                            <div key={step.id} className="flex items-center">
                                <div className={`w-3 h-3 rounded-full transition-all ${idx === currentStep ? 'bg-orange-500 scale-125' : idx < currentStep ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                                {idx < steps.length - 1 && <div className={`w-8 h-1 mx-1 rounded-full ${idx < currentStep ? 'bg-green-500' : 'bg-gray-100 dark:bg-gray-700'}`} />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-8 md:p-12 overflow-y-auto">
                    <div className="max-w-3xl mx-auto">
                        {currentStep === 0 && renderStep1()}
                        {currentStep === 1 && renderStep2()}
                        {currentStep === 2 && renderStep3()}
                        {currentStep === 3 && renderStep4()}
                    </div>
                </div>

                {/* Footer / Actions */}
                <div className="p-8 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${currentStep === 0 ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    >
                        <ChevronLeft className="w-5 h-5" /> Back
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-8 py-3 bg-gray-900 dark:bg-orange-500 text-white rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        {isSaving ? 'Saving...' : currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                        {!isSaving && <ChevronRight className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
