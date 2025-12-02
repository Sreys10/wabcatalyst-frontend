"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Camera, Plus, Trash2, Upload, ChevronDown, ChevronUp, CheckCircle, AlertCircle, X } from 'lucide-react';

const initialProfileData = {
    personal: {
        fullName: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        portfolio: "",
        photo: "",
    },
    summary: {
        bio: "",
        jobTitles: "",
    },
    skills: {
        primary: "",
        tools: "",
        soft: "",
    },
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    preferences: {
        jobType: "",
        roles: "",
        location: "",
        salary: "",
        noticePeriod: "",
    },
    documents: [],
    extras: {
        strengths: "",
        hobbies: "",
    },
};

const ProfileContent = () => {
    const { data: session, update } = useSession();
    const [activeSection, setActiveSection] = useState('personal');
    const [profileData, setProfileData] = useState(initialProfileData);
    const [loading, setLoading] = useState(true);

    // Autocomplete states
    const [showJobTitleDropdown, setShowJobTitleDropdown] = useState(false);
    const [showPrimarySkillsDropdown, setShowPrimarySkillsDropdown] = useState(false);
    const [showToolsDropdown, setShowToolsDropdown] = useState(false);
    const [showSoftSkillsDropdown, setShowSoftSkillsDropdown] = useState(false);
    const [bioText, setBioText] = useState('');

    const jobTitleRef = useRef<HTMLDivElement>(null);
    const primarySkillsRef = useRef<HTMLDivElement>(null);
    const toolsRef = useRef<HTMLDivElement>(null);
    const softSkillsRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const jobTitles = [
        "Software Developer", "Full Stack Developer", "Backend Developer", "Frontend Developer",
        "Mobile App Developer", "DevOps Engineer", "Cloud Engineer", "Data Analyst", "Data Scientist",
        "Machine Learning Engineer", "AI Engineer", "QA Tester", "UI/UX Designer", "System Administrator",
        "Sales Executive", "Sales Manager", "Business Development Executive", "Business Development Manager",
        "Inside Sales Representative", "Key Account Manager", "Relationship Manager", "Territory Sales Manager",
        "Sales Consultant", "Bank Clerk", "Bank Officer", "Relationship Manager (Banking)", "Loan Officer",
        "Credit Analyst", "Financial Advisor", "Investment Banking Analyst", "Branch Manager"
    ];

    const skillsList = [
        "Python", "Java", "JavaScript", "HTML", "CSS", "React", "Node.js", "SQL", "MongoDB",
        "Git & GitHub", "Docker", "Kubernetes", "Cloud Computing", "Data Analysis", "Machine Learning",
        "TensorFlow", "Power BI", "Tableau", "Linux", "Cybersecurity Basics", "Lead Generation",
        "Negotiation", "Prospecting", "CRM Tools", "Cold Calling", "Market Research", "Customer Engagement",
        "Presentation Skills", "Sales Strategy", "Relationship Building", "Financial Analysis",
        "Accounting Basics", "Tally ERP", "Risk Assessment", "Loan Processing", "Credit Evaluation",
        "Investment Planning", "MS Excel", "Compliance & KYC", "Cash Handling", "Communication Skills",
        "Teamwork", "Problem Solving", "Time Management", "Leadership", "Critical Thinking",
        "Adaptability", "Project Management", "Decision Making", "Attention to Detail"
    ];

    const degrees = [
        "High School (10th)", "Higher Secondary (12th)", "Diploma (Any Stream)", "Diploma in Computer Engineering",
        "Diploma in Mechanical Engineering", "Diploma in Electrical Engineering", "B.Tech / B.E.",
        "B.Tech in Computer Science", "B.Tech in Information Technology", "B.Tech in Electronics & Communication",
        "B.Tech in Mechanical Engineering", "B.Tech in Civil Engineering", "BCA", "B.Sc Computer Science",
        "B.Sc Information Technology", "B.Com", "BBA", "BA", "BMS", "BAF", "BBI", "B.Pharm", "B.Arch",
        "M.Tech / M.E.", "MCA", "M.Sc Computer Science", "M.Sc Data Science", "MBA", "M.Com", "MA", "PhD",
        "Doctorate", "PGDM", "Certification Course", "Professional Course", "ITI Certification", "No Formal Education"
    ];

    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' } | null>(null);
    const [saving, setSaving] = useState(false);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleInputChange = (section: string, field: string, value: string) => {
        setProfileData(prev => ({
            ...prev,
            [section]: {
                ...prev[section as keyof typeof prev],
                [field]: value
            }
        }));
    };

    const handleArrayInputChange = (section: string, index: number, field: string, value: string) => {
        setProfileData(prev => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const sectionArray = [...(prev[section as keyof typeof prev] as any[])];
            sectionArray[index] = {
                ...sectionArray[index],
                [field]: value
            };
            return {
                ...prev,
                [section]: sectionArray
            };
        });
    };

    const handleAddNew = (section: string) => {
        setProfileData(prev => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const sectionArray = [...(prev[section as keyof typeof prev] as any[])];
            const newId = sectionArray.length > 0 ? Math.max(...sectionArray.map((item: any) => item.id || 0)) + 1 : 1;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let newItem: any = { id: newId };
            if (section === 'experience') {
                newItem = { ...newItem, title: '', company: '', startDate: '', endDate: '', location: '', description: '' };
            } else if (section === 'education') {
                newItem = { ...newItem, degree: '', institution: '', year: '', grade: '' };
            } else if (section === 'projects') {
                newItem = { ...newItem, title: '', description: '', technologies: '', link: '' };
            } else if (section === 'certifications') {
                newItem = { ...newItem, name: '', issuer: '' };
            }

            return {
                ...prev,
                [section]: [...sectionArray, newItem]
            };
        });
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileData(prev => ({
                    ...prev,
                    personal: {
                        ...prev.personal,
                        photo: reader.result as string
                    }
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (sectionName?: string) => {
        setSaving(true);
        try {
            // Update profileData with the separate state values before saving
            const updatedProfileData = {
                ...profileData,
                summary: {
                    ...profileData.summary,
                    bio: bioText,
                    jobTitles: (document.querySelector('input[placeholder*="Frontend Developer"]') as HTMLInputElement)?.value || profileData.summary.jobTitles
                },
                skills: {
                    ...profileData.skills,
                    primary: (document.querySelector('input[placeholder*="React, TypeScript"]') as HTMLInputElement)?.value || profileData.skills.primary,
                    tools: (document.querySelector('input[placeholder*="VS Code, Git"]') as HTMLInputElement)?.value || profileData.skills.tools,
                    soft: (document.querySelector('input[placeholder*="Leadership, Communication"]') as HTMLInputElement)?.value || profileData.skills.soft
                }
            };

            const res = await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProfileData)
            });

            if (res.ok) {
                showToast('Profile saved successfully!', 'success');
                // Update session if photo was changed
                if (sectionName === 'personal' && updatedProfileData.personal.photo) {
                    await update({ image: updatedProfileData.personal.photo });
                }
            } else {
                showToast('Failed to save profile.', 'error');
            }
        } catch (error) {
            console.error("Error saving profile:", error);
            showToast('An error occurred while saving.', 'error');
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/profile');
                if (res.ok) {
                    const data = await res.json();
                    // Merge with initial data structure to ensure all fields exist
                    const mergedData = { ...initialProfileData, ...data };
                    setProfileData(mergedData);

                    // Sync local states
                    if (mergedData.summary?.bio) setBioText(mergedData.summary.bio);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            fetchProfile();
        }
    }, [session]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (jobTitleRef.current && !jobTitleRef.current.contains(event.target as Node)) {
                setShowJobTitleDropdown(false);
            }
            if (primarySkillsRef.current && !primarySkillsRef.current.contains(event.target as Node)) {
                setShowPrimarySkillsDropdown(false);
            }
            if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
                setShowToolsDropdown(false);
            }
            if (softSkillsRef.current && !softSkillsRef.current.contains(event.target as Node)) {
                setShowSoftSkillsDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Mock Data / State (Simplified for UI demonstration)
    const [completionScore, setCompletionScore] = useState(45);

    const sections = [
        { id: 'personal', label: 'Personal Information' },
        { id: 'summary', label: 'Professional Summary' },
        { id: 'skills', label: 'Skills' },
        { id: 'experience', label: 'Work Experience' },
        { id: 'education', label: 'Education' },
        { id: 'projects', label: 'Projects' },
        { id: 'certifications', label: 'Certifications' },
        { id: 'preferences', label: 'Job Preferences' },
        { id: 'documents', label: 'Documents' },
        { id: 'extras', label: 'Extra Sections' },
    ];

    if (loading) {
        return <div className="p-8 flex justify-center items-center min-h-screen">Loading profile...</div>;
    }

    return (
        <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col lg:flex-row gap-8 transition-colors duration-200">

            {/* Main Form Area */}
            <div className="flex-1 space-y-8">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">My Profile</h1>

                {/* 1. Personal Information */}
                <section id="personal" className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm dark:shadow-gray-900/50 scroll-mt-24 transition-colors">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">1</span>
                            Personal Information
                        </h2>
                        <button
                            type="button"
                            onClick={() => handleSave('personal')}
                            disabled={saving}
                            className="px-4 py-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm font-medium hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Profile Photo */}
                        <div className="flex flex-col items-center gap-3">
                            <div
                                className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-md flex items-center justify-center relative overflow-hidden group cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {profileData.personal.photo || session?.user?.image ? (
                                    <img src={profileData.personal.photo || session?.user?.image || ''} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl">👤</span>
                                )}
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="text-white w-8 h-8" />
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-sm text-orange-600 font-medium hover:underline"
                            >
                                Change Photo
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handlePhotoChange}
                                className="hidden"
                                accept="image/*"
                            />
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location / City</label>
                                <input
                                    type="text"
                                    value={profileData.personal.location}
                                    onChange={(e) => handleInputChange('personal', 'location', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 outline-none transition-all capitalize placeholder-gray-300 dark:placeholder-gray-500"
                                    style={{ textTransform: 'capitalize' }}
                                    placeholder="New York, USA"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">LinkedIn URL</label>
                                <input
                                    type="url"
                                    value={profileData.personal.linkedin}
                                    onChange={(e) => handleInputChange('personal', 'linkedin', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 outline-none transition-all placeholder-gray-300 dark:placeholder-gray-500"
                                    placeholder="linkedin.com/in/johndoe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Portfolio URL</label>
                                <input
                                    type="url"
                                    value={profileData.personal.portfolio}
                                    onChange={(e) => handleInputChange('personal', 'portfolio', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 outline-none transition-all placeholder-gray-300 dark:placeholder-gray-500"
                                    placeholder="johndoe.com"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Professional Summary */}
                <section id="summary" className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm dark:shadow-gray-900/50 scroll-mt-24 transition-colors">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">2</span>
                            Professional Summary
                        </h2>
                        <button
                            type="button"
                            onClick={() => handleSave('summary')}
                            disabled={saving}
                            className="px-4 py-2 rounded-lg bg-orange-50 text-orange-600 text-sm font-medium hover:bg-orange-100 transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Short Bio / About Me</label>
                            <div className="relative">
                                <textarea
                                    value={bioText}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        // Auto-capitalize first letter
                                        const capitalized = val.charAt(0).toUpperCase() + val.slice(1);
                                        setBioText(capitalized);
                                    }}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 outline-none transition-all min-h-[120px] placeholder-gray-300 dark:placeholder-gray-500"
                                    placeholder="I am a passionate software engineer with 5 years of experience..."
                                />
                                <div className={`text-xs text-right mt-1 ${bioText.split(/\s+/).filter(w => w).length < 50 ? 'text-red-500' : 'text-green-600'}`}>
                                    {bioText.split(/\s+/).filter(w => w).length} / 50 words minimum
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2" ref={jobTitleRef}>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Job Titles</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    defaultValue={profileData.summary.jobTitles}
                                    onFocus={() => setShowJobTitleDropdown(true)}
                                    onChange={(e) => {
                                        e.target.value = e.target.value;
                                        setShowJobTitleDropdown(true);
                                    }}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 outline-none transition-all placeholder-gray-300 dark:placeholder-gray-500"
                                    placeholder="e.g. Frontend Developer, Full Stack Engineer"
                                />
                                {showJobTitleDropdown && (
                                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                        {jobTitles.map((title, index) => (
                                            <div
                                                key={index}
                                                onClick={() => {
                                                    const input = document.querySelector('input[placeholder*="Frontend Developer"]') as HTMLInputElement;
                                                    if (input) {
                                                        const current = input.value.split(',').map(t => t.trim()).filter(t => t);
                                                        if (!current.includes(title)) {
                                                            input.value = current.length > 0 ? `${input.value}, ${title}` : title;
                                                        }
                                                    }
                                                    setShowJobTitleDropdown(false);
                                                }}
                                                className="px-4 py-2.5 hover:bg-orange-50 dark:hover:bg-gray-700 cursor-pointer transition-colors text-sm text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400"
                                            >
                                                {title}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-gray-400">Click to select from dropdown or type custom titles</p>
                        </div>
                    </div>
                </section>

                {/* 3. Skills */}
                <section id="skills" className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm dark:shadow-gray-900/50 scroll-mt-24 transition-colors">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">3</span>
                            Skills
                        </h2>
                        <button
                            type="button"
                            onClick={() => handleSave('skills')}
                            disabled={saving}
                            className="px-4 py-2 rounded-lg bg-orange-50 text-orange-600 text-sm font-medium hover:bg-orange-100 transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Primary Skills */}
                        <div className="space-y-2" ref={primarySkillsRef}>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Primary Skills</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    defaultValue={profileData.skills.primary}
                                    onFocus={() => setShowPrimarySkillsDropdown(true)}
                                    onChange={(e) => {
                                        e.target.value = e.target.value;
                                        setShowPrimarySkillsDropdown(true);
                                    }}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 outline-none transition-all placeholder-gray-300 dark:placeholder-gray-500"
                                    placeholder="React, TypeScript, Node.js"
                                />
                                {showPrimarySkillsDropdown && (
                                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                        {skillsList.map((skill, index) => (
                                            <div
                                                key={index}
                                                onClick={() => {
                                                    const input = document.querySelector('input[placeholder*="React, TypeScript"]') as HTMLInputElement;
                                                    if (input) {
                                                        const current = input.value.split(',').map(t => t.trim()).filter(t => t);
                                                        if (!current.includes(skill)) {
                                                            input.value = current.length > 0 ? `${input.value}, ${skill}` : skill;
                                                        }
                                                    }
                                                    setShowPrimarySkillsDropdown(false);
                                                }}
                                                className="px-4 py-2.5 hover:bg-orange-50 dark:hover:bg-gray-700 cursor-pointer transition-colors text-sm text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400"
                                            >
                                                {skill}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tools & Technologies */}
                        <div className="space-y-2" ref={toolsRef}>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tools & Technologies</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    defaultValue={profileData.skills.tools}
                                    onFocus={() => setShowToolsDropdown(true)}
                                    onChange={(e) => {
                                        e.target.value = e.target.value;
                                        setShowToolsDropdown(true);
                                    }}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 outline-none transition-all placeholder-gray-300 dark:placeholder-gray-500"
                                    placeholder="VS Code, Git, Figma"
                                />
                                {showToolsDropdown && (
                                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                        {skillsList.map((skill, index) => (
                                            <div
                                                key={index}
                                                onClick={() => {
                                                    const input = document.querySelector('input[placeholder*="VS Code, Git"]') as HTMLInputElement;
                                                    if (input) {
                                                        const current = input.value.split(',').map(t => t.trim()).filter(t => t);
                                                        if (!current.includes(skill)) {
                                                            input.value = current.length > 0 ? `${input.value}, ${skill}` : skill;
                                                        }
                                                    }
                                                    setShowToolsDropdown(false);
                                                }}
                                                className="px-4 py-2.5 hover:bg-orange-50 dark:hover:bg-gray-700 cursor-pointer transition-colors text-sm text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400"
                                            >
                                                {skill}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Soft Skills */}
                        <div className="space-y-2" ref={softSkillsRef}>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Soft Skills</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    defaultValue={profileData.skills.soft}
                                    onFocus={() => setShowSoftSkillsDropdown(true)}
                                    onChange={(e) => {
                                        e.target.value = e.target.value;
                                        setShowSoftSkillsDropdown(true);
                                    }}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 outline-none transition-all placeholder-gray-300 dark:placeholder-gray-500"
                                    placeholder="Leadership, Communication"
                                />
                                {showSoftSkillsDropdown && (
                                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                        {skillsList.map((skill, index) => (
                                            <div
                                                key={index}
                                                onClick={() => {
                                                    const input = document.querySelector('input[placeholder*="Leadership, Communication"]') as HTMLInputElement;
                                                    if (input) {
                                                        const current = input.value.split(',').map(t => t.trim()).filter(t => t);
                                                        if (!current.includes(skill)) {
                                                            input.value = current.length > 0 ? `${input.value}, ${skill}` : skill;
                                                        }
                                                    }
                                                    setShowSoftSkillsDropdown(false);
                                                }}
                                                className="px-4 py-2.5 hover:bg-orange-50 dark:hover:bg-gray-700 cursor-pointer transition-colors text-sm text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400"
                                            >
                                                {skill}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Work Experience */}
                <section id="experience" className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm dark:shadow-gray-900/50 scroll-mt-24 transition-colors">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">4</span>
                            Work Experience
                        </h2>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => handleSave('experience')}
                                disabled={saving}
                                className="px-4 py-2 rounded-lg bg-orange-50 text-orange-600 text-sm font-medium hover:bg-orange-100 transition-colors disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                            <button
                                type="button"
                                onClick={() => handleAddNew('experience')}
                                className="flex items-center gap-2 text-sm font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4" /> Add New
                            </button>
                        </div>
                    </div>

                    {profileData.experience.map((exp, index) => (
                        <div key={exp.id} className="border border-gray-100 rounded-2xl p-5 mb-4 hover:border-orange-100 transition-colors">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={exp.title}
                                        onChange={(e) => handleArrayInputChange('experience', index, 'title', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm placeholder-gray-300 dark:placeholder-gray-500"
                                        placeholder="Job Title"
                                        onFocus={() => {
                                            // Close other dropdowns
                                            setShowJobTitleDropdown(false);
                                            // We can reuse the same state or create a new one. 
                                            // For simplicity, let's use a local way to track which index is active if we want per-row dropdowns.
                                            // But since we only have one global 'showJobTitleDropdown' state, let's add a state to track active index.
                                            // However, to keep it simple and consistent with the user request "add again the dropdown list", 
                                            // I will implement a specific dropdown for this input.
                                            // Let's use a new state variable for this or reuse the existing list but manage visibility per row.
                                            // For now, I'll implement a simple dropdown that appears when focused, using the existing jobTitles list.
                                            const dropdown = document.getElementById(`job-title-dropdown-${index}`);
                                            if (dropdown) dropdown.classList.remove('hidden');
                                        }}
                                        onBlur={() => {
                                            // Delay hiding to allow click event on dropdown items
                                            setTimeout(() => {
                                                const dropdown = document.getElementById(`job-title-dropdown-${index}`);
                                                if (dropdown) dropdown.classList.add('hidden');
                                            }, 200);
                                        }}
                                    />
                                    <div id={`job-title-dropdown-${index}`} className="hidden absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                        {jobTitles.map((title, i) => (
                                            <div
                                                key={i}
                                                onMouseDown={() => handleArrayInputChange('experience', index, 'title', title)}
                                                className="px-4 py-2.5 hover:bg-orange-50 dark:hover:bg-gray-700 cursor-pointer transition-colors text-sm text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400"
                                            >
                                                {title}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    value={exp.company}
                                    onChange={(e) => handleArrayInputChange('experience', index, 'company', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm placeholder-gray-300 dark:placeholder-gray-500"
                                    placeholder="Company Name"
                                />
                                <div className="flex gap-4">
                                    <input
                                        type="date"
                                        value={exp.startDate}
                                        onChange={(e) => handleArrayInputChange('experience', index, 'startDate', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm text-gray-500 dark:text-gray-300 placeholder-gray-300 dark:placeholder-gray-500"
                                        placeholder="Start Date"
                                    />
                                    <input
                                        type="date"
                                        value={exp.endDate}
                                        onChange={(e) => handleArrayInputChange('experience', index, 'endDate', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm text-gray-500 dark:text-gray-300 placeholder-gray-300 dark:placeholder-gray-500"
                                        placeholder="End Date"
                                    />
                                </div>
                                <input
                                    type="text"
                                    value={exp.location}
                                    onChange={(e) => handleArrayInputChange('experience', index, 'location', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm placeholder-gray-300 dark:placeholder-gray-500"
                                    placeholder="Location"
                                />
                            </div>
                            <textarea
                                value={exp.description}
                                onChange={(e) => handleArrayInputChange('experience', index, 'description', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm min-h-[80px] placeholder-gray-300 dark:placeholder-gray-500"
                                placeholder="Responsibilities & Achievements..."
                            />
                        </div>
                    ))}
                </section>

                {/* 5. Education */}
                <section id="education" className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm dark:shadow-gray-900/50 scroll-mt-24 transition-colors">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">5</span>
                            Education
                        </h2>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => handleSave('education')}
                                disabled={saving}
                                className="px-4 py-2 rounded-lg bg-orange-50 text-orange-600 text-sm font-medium hover:bg-orange-100 transition-colors disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                            <button
                                type="button"
                                onClick={() => handleAddNew('education')}
                                className="flex items-center gap-2 text-sm font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4" /> Add New
                            </button>
                        </div>
                    </div>
                    {profileData.education.map((edu, index) => (
                        <div key={edu.id} className="border border-gray-100 rounded-2xl p-5 mb-4 hover:border-orange-100 transition-colors">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={edu.degree}
                                        onChange={(e) => handleArrayInputChange('education', index, 'degree', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm placeholder-gray-300 dark:placeholder-gray-500"
                                        placeholder="Degree / Qualification"
                                        onFocus={() => {
                                            const dropdown = document.getElementById(`degree-dropdown-${index}`);
                                            if (dropdown) dropdown.classList.remove('hidden');
                                        }}
                                        onBlur={() => {
                                            setTimeout(() => {
                                                const dropdown = document.getElementById(`degree-dropdown-${index}`);
                                                if (dropdown) dropdown.classList.add('hidden');
                                            }, 200);
                                        }}
                                    />
                                    <div id={`degree-dropdown-${index}`} className="hidden absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                        {degrees.filter(d => d.toLowerCase().includes((edu.degree || '').toLowerCase())).map((degree, i) => (
                                            <div
                                                key={i}
                                                onMouseDown={() => handleArrayInputChange('education', index, 'degree', degree)}
                                                className="px-4 py-2.5 hover:bg-orange-50 dark:hover:bg-gray-700 cursor-pointer transition-colors text-sm text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400"
                                            >
                                                {degree}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    value={edu.institution}
                                    onChange={(e) => handleArrayInputChange('education', index, 'institution', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm placeholder-gray-300 dark:placeholder-gray-500"
                                    placeholder="University / Institution"
                                />
                                <input
                                    type="text"
                                    value={edu.year}
                                    onChange={(e) => handleArrayInputChange('education', index, 'year', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm placeholder-gray-300 dark:placeholder-gray-500"
                                    placeholder="Year of Passing"
                                />
                                <input
                                    type="text"
                                    value={edu.grade}
                                    onChange={(e) => handleArrayInputChange('education', index, 'grade', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm placeholder-gray-300 dark:placeholder-gray-500"
                                    placeholder="CGPA / Percentage"
                                />
                            </div>
                        </div>
                    ))}
                </section>

                {/* 6. Projects */}
                <section id="projects" className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm dark:shadow-gray-900/50 scroll-mt-24 transition-colors">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">6</span>
                            Projects
                        </h2>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => handleSave('projects')}
                                disabled={saving}
                                className="px-4 py-2 rounded-lg bg-orange-50 text-orange-600 text-sm font-medium hover:bg-orange-100 transition-colors disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                            <button
                                type="button"
                                onClick={() => handleAddNew('projects')}
                                className="flex items-center gap-2 text-sm font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4" /> Add New
                            </button>
                        </div>
                    </div>
                    {profileData.projects.map((proj, index) => (
                        <div key={proj.id} className="border border-gray-100 rounded-2xl p-5 mb-4 hover:border-orange-100 transition-colors">
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    value={proj.title}
                                    onChange={(e) => handleArrayInputChange('projects', index, 'title', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm placeholder-gray-300 dark:placeholder-gray-500"
                                    placeholder="Project Title"
                                />
                                <textarea
                                    value={proj.description}
                                    onChange={(e) => handleArrayInputChange('projects', index, 'description', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm min-h-[60px] placeholder-gray-300 dark:placeholder-gray-500"
                                    placeholder="Description"
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        value={proj.technologies}
                                        onChange={(e) => handleArrayInputChange('projects', index, 'technologies', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm placeholder-gray-300 dark:placeholder-gray-500"
                                        placeholder="Technologies Used"
                                    />
                                    <input
                                        type="url"
                                        value={proj.link}
                                        onChange={(e) => handleArrayInputChange('projects', index, 'link', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm placeholder-gray-300 dark:placeholder-gray-500"
                                        placeholder="Project Link (GitHub/Demo)"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                {/* 7. Certifications */}
                <section id="certifications" className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm dark:shadow-gray-900/50 scroll-mt-24 transition-colors">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">7</span>
                            Certifications
                        </h2>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => handleSave('certifications')}
                                disabled={saving}
                                className="px-4 py-2 rounded-lg bg-orange-50 text-orange-600 text-sm font-medium hover:bg-orange-100 transition-colors disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                            <button
                                type="button"
                                onClick={() => handleAddNew('certifications')}
                                className="flex items-center gap-2 text-sm font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4" /> Add New
                            </button>
                        </div>
                    </div>
                    {profileData.certifications.map((cert, index) => (
                        <div key={cert.id} className="border border-gray-100 rounded-2xl p-5 mb-4 hover:border-orange-100 transition-colors">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    value={cert.name}
                                    onChange={(e) => handleArrayInputChange('certifications', index, 'name', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm placeholder-gray-300 dark:placeholder-gray-500"
                                    placeholder="Certification Name"
                                />
                                <input
                                    type="text"
                                    value={cert.issuer}
                                    onChange={(e) => handleArrayInputChange('certifications', index, 'issuer', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm placeholder-gray-300 dark:placeholder-gray-500"
                                    placeholder="Issuing Organization"
                                />
                            </div>
                        </div>
                    ))}
                </section>

                {/* 8. Job Preferences */}
                <section id="preferences" className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm dark:shadow-gray-900/50 scroll-mt-24 transition-colors">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">8</span>
                            Job Preferences
                        </h2>
                        <button
                            type="button"
                            onClick={() => handleSave('preferences')}
                            disabled={saving}
                            className="px-4 py-2 rounded-lg bg-orange-50 text-orange-600 text-sm font-medium hover:bg-orange-100 transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Job Type</label>
                            <select
                                value={profileData.preferences.jobType}
                                onChange={(e) => handleInputChange('preferences', 'jobType', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm"
                            >
                                <option>Full-time</option>
                                <option>Part-time</option>
                                <option>Contract</option>
                                <option>Freelance</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Preferred Location</label>
                            <input
                                type="text"
                                value={profileData.preferences.location}
                                onChange={(e) => handleInputChange('preferences', 'location', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm placeholder-gray-300 dark:placeholder-gray-500"
                                placeholder="e.g. Remote, New York"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Expected Salary</label>
                            <input
                                type="text"
                                value={profileData.preferences.salary}
                                onChange={(e) => handleInputChange('preferences', 'salary', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm placeholder-gray-300 dark:placeholder-gray-500"
                                placeholder="e.g. $80k - $100k"
                            />
                        </div>
                    </div>
                </section>

                {/* 9. Documents */}
                <section id="documents" className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm dark:shadow-gray-900/50 scroll-mt-24 transition-colors">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">9</span>
                            Documents
                        </h2>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => handleSave('documents')}
                                disabled={saving}
                                className="px-4 py-2 rounded-lg bg-orange-50 text-orange-600 text-sm font-medium hover:bg-orange-100 transition-colors disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                            <button className="flex items-center gap-2 text-sm font-medium text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors">
                                <Upload className="w-4 h-4" /> Upload
                            </button>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {profileData.documents.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-xl hover:border-orange-100 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500 font-bold text-xs">PDF</div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{doc.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{doc.type} • Added {doc.date}</p>
                                    </div>
                                </div>
                                <button className="text-gray-400 hover:text-red-500 transition-colors">
                                    <span className="sr-only">Delete</span>
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 10. Extra Sections */}
                <section id="extra" className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm dark:shadow-gray-900/50 scroll-mt-24 transition-colors">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">10</span>
                            Add Section
                        </h2>
                        <button
                            type="button"
                            onClick={() => handleSave('extra')}
                            disabled={saving}
                            className="px-4 py-2 rounded-lg bg-orange-50 text-orange-600 text-sm font-medium hover:bg-orange-100 transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['Languages', 'Volunteering', 'Awards', 'Publications'].map((item) => (
                            <button key={item} className="p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-gray-700 transition-all flex flex-col items-center justify-center gap-2">
                                <Plus className="w-5 h-5" />
                                <span className="text-sm font-medium">{item}</span>
                            </button>
                        ))}
                    </div>
                </section>

                <div className="flex justify-end gap-4 pt-4">
                    <button className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                    <button
                        type="button"
                        onClick={() => handleSave()}
                        className="px-6 py-3 rounded-xl bg-orange-600 text-white font-medium hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all transform hover:-translate-y-0.5"
                    >
                        Save Profile
                    </button>
                </div>

            </div>

            {/* Right Sidebar: Completion Meter & Navigation */}
            <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
                {/* Completion Meter */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm dark:shadow-gray-900/50 sticky top-8 transition-colors">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Profile Strength</h3>

                    <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                            <div>
                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-orange-600 bg-orange-200">
                                    {completionScore}% Completed
                                </span>
                            </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-orange-100">
                            <div style={{ width: `${completionScore}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-orange-600 transition-all duration-500"></div>
                        </div>
                    </div>

                    <div className="space-y-3 mt-6">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Missing Information:</h4>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <AlertCircle className="w-4 h-4 text-indigo-500" />
                                <span>Add Professional Summary</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <AlertCircle className="w-4 h-4 text-indigo-500" />
                                <span>Upload Resume</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <AlertCircle className="w-4 h-4 text-indigo-500" />
                                <span>Add 2 more Skills</span>
                            </li>
                        </ul>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Quick Navigation</h4>
                        <nav className="space-y-1">
                            {sections.map((section) => (
                                <a
                                    key={section.id}
                                    href={`#${section.id}`}
                                    className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-orange-600 dark:hover:text-orange-400 rounded-lg transition-colors"
                                >
                                    {section.label}
                                </a>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            {toast && (
                <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-fade-in-up ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                    {toast.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                    <span className="font-medium">{toast.message}</span>
                </div>
            )}

        </div>
    );
};

export default ProfileContent;
