"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from 'recharts';
import { MoreHorizontal, Sparkles, Download, Upload, FileText, Bell, MessageSquare, Clock, Briefcase, Bookmark, BookOpen, Video, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';
import { useTheme } from '@layouts/partials/ThemeProvider';

const DashboardContent = () => {
    const [isComingSoonModalOpen, setIsComingSoonModalOpen] = useState(false);
    const [comingSoonMessage, setComingSoonMessage] = useState('');
    const router = useRouter();

    const { data: session } = useSession();
    const [completionScore, setCompletionScore] = useState(0);
    const [missingSections, setMissingSections] = useState<string[]>([]);
    const [atsScore, setAtsScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [hasResume, setHasResume] = useState(false);
    const [atsReport, setAtsReport] = useState<any>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (session) {
                try {
                    const res = await fetch('/api/profile');
                    if (res.ok) {
                        const profile = await res.json();
                        calculateScores(profile);

                        // Check if resume exists
                        const resumeExists = !!(profile.resumeFileName || profile.resumeFile);
                        setHasResume(resumeExists);

                        // Fetch ATS score from backend if profile is complete enough or resume exists
                        // We'll calculate score locally first to check completion
                        // Note: calculateScores sets state, but we can't access updated state immediately here
                        // So we re-calculate completion score logic briefly or rely on resumeExists

                        // We need to know completion score here to decide whether to fetch ATS
                        // Let's refactor calculateScores to return the score
                        const score = calculateCompletionScore(profile);

                        if (score >= 70 || resumeExists) {
                            fetchATSScore();
                        }
                    }
                } catch (error) {
                    console.error("Error fetching profile for dashboard:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchProfileData();
    }, [session]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert("File size must be less than 5MB");
            return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            const base64String = event.target?.result as string;

            try {
                // Upload to Cloudinary first
                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ file: base64String, folder: 'resumes' })
                });

                if (!uploadRes.ok) {
                    throw new Error('Failed to upload to cloud storage');
                }

                const uploadData = await uploadRes.json();
                const resumeUrl = uploadData.url;

                // Save resume URL to profile
                const res = await fetch('/api/onboarding/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        resumeFile: resumeUrl, // Store URL instead of base64
                        resumeFileName: file.name
                    })
                });

                if (res.ok) {
                    setHasResume(true);
                    // Trigger ATS calculation
                    fetchATSScore();
                } else {
                    console.error("Failed to save resume info");
                }
            } catch (error) {
                console.error("Error uploading resume:", error);
                alert("Failed to upload resume. Please try again.");
            }
        };
        reader.readAsDataURL(file);
    };

    const fetchATSScore = async () => {
        try {
            const res = await fetch('/api/ats/calculate', {
                method: 'POST', // Trigger calculation
            });
            if (res.ok) {
                const data = await res.json();
                if (data.success && data.data) {
                    setAtsScore(data.data.score.total);
                    setAtsReport(data.data); // Store full report data
                }
            }
        } catch (error) {
            console.error("Error fetching ATS score:", error);
        }
    };

    // Helper to calculate score without setting state (for useEffect)
    const calculateCompletionScore = (profile: any) => {
        let filledCount = 0;
        let totalCount = 0;

        const check = (val: any) => {
            totalCount++;
            if (val && val.toString().trim() !== '') filledCount++;
        };

        check(profile.personal?.fullName);
        check(profile.personal?.email);
        check(profile.personal?.phone);
        check(profile.personal?.location);
        check(profile.personal?.photo);
        check(profile.summary?.bio);
        check(profile.summary?.jobTitles);
        check(profile.skills?.primary);
        check(profile.skills?.tools);
        check(profile.skills?.soft);

        // Arrays
        totalCount++; if (profile.experience?.length > 0) filledCount++;
        totalCount++; if (profile.education?.length > 0) filledCount++;
        totalCount++; if (profile.projects?.length > 0) filledCount++;
        totalCount++; if (profile.certifications?.length > 0) filledCount++;

        check(profile.preferences?.jobType);
        check(profile.preferences?.roles);
        check(profile.preferences?.location);

        return totalCount > 0 ? Math.round((filledCount / totalCount) * 100) : 0;
    };

    const calculateScores = (profile: any) => {
        const missingItems: string[] = [];
        const fieldChecks: { [key: string]: boolean } = {};

        // Personal Information
        if (!profile.personal?.fullName || profile.personal.fullName.trim() === '') {
            missingItems.push('Full Name');
            fieldChecks['Full Name'] = false;
        } else fieldChecks['Full Name'] = true;

        if (!profile.personal?.email || profile.personal.email.trim() === '') {
            missingItems.push('Email');
            fieldChecks['Email'] = false;
        } else fieldChecks['Email'] = true;

        if (!profile.personal?.phone || profile.personal.phone.trim() === '') {
            missingItems.push('Phone Number');
            fieldChecks['Phone Number'] = false;
        } else fieldChecks['Phone Number'] = true;

        if (!profile.personal?.location || profile.personal.location.trim() === '') {
            missingItems.push('Location');
            fieldChecks['Location'] = false;
        } else fieldChecks['Location'] = true;

        if (!profile.personal?.photo || profile.personal.photo.trim() === '') {
            missingItems.push('Profile Photo');
            fieldChecks['Profile Photo'] = false;
        } else fieldChecks['Profile Photo'] = true;

        // Summary
        if (!profile.summary?.bio || profile.summary.bio.trim() === '') {
            missingItems.push('Professional Summary/Bio');
            fieldChecks['Professional Summary/Bio'] = false;
        } else fieldChecks['Professional Summary/Bio'] = true;

        if (!profile.summary?.jobTitles || profile.summary.jobTitles.trim() === '') {
            missingItems.push('Job Titles');
            fieldChecks['Job Titles'] = false;
        } else fieldChecks['Job Titles'] = true;

        // Skills
        if (!profile.skills?.primary || profile.skills.primary.trim() === '') {
            missingItems.push('Primary Skills');
            fieldChecks['Primary Skills'] = false;
        } else fieldChecks['Primary Skills'] = true;

        if (!profile.skills?.tools || profile.skills.tools.trim() === '') {
            missingItems.push('Tools & Technologies');
            fieldChecks['Tools & Technologies'] = false;
        } else fieldChecks['Tools & Technologies'] = true;

        if (!profile.skills?.soft || profile.skills.soft.trim() === '') {
            missingItems.push('Soft Skills');
            fieldChecks['Soft Skills'] = false;
        } else fieldChecks['Soft Skills'] = true;

        // Experience
        if (!profile.experience || profile.experience.length === 0) {
            missingItems.push('Work Experience');
            fieldChecks['Work Experience'] = false;
        } else fieldChecks['Work Experience'] = true;

        // Education
        if (!profile.education || profile.education.length === 0) {
            missingItems.push('Education');
            fieldChecks['Education'] = false;
        } else fieldChecks['Education'] = true;

        // Projects
        if (!profile.projects || profile.projects.length === 0) {
            missingItems.push('Projects');
            fieldChecks['Projects'] = false;
        } else fieldChecks['Projects'] = true;

        // Certifications
        if (!profile.certifications || profile.certifications.length === 0) {
            missingItems.push('Certifications');
            fieldChecks['Certifications'] = false;
        } else fieldChecks['Certifications'] = true;

        // Preferences
        if (!profile.preferences?.jobType || profile.preferences.jobType.trim() === '') {
            missingItems.push('Job Type Preference');
            fieldChecks['Job Type Preference'] = false;
        } else fieldChecks['Job Type Preference'] = true;

        if (!profile.preferences?.roles || profile.preferences.roles.trim() === '') {
            missingItems.push('Preferred Roles');
            fieldChecks['Preferred Roles'] = false;
        } else fieldChecks['Preferred Roles'] = true;

        if (!profile.preferences?.location || profile.preferences.location.trim() === '') {
            missingItems.push('Preferred Location');
            fieldChecks['Preferred Location'] = false;
        } else fieldChecks['Preferred Location'] = true;

        // Calculate completion score
        const totalFields = Object.keys(fieldChecks).length;
        const filledFields = Object.values(fieldChecks).filter(Boolean).length;
        const score = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;

        console.log('Profile Completion Debug:', {
            totalFields,
            filledFields,
            score,
            fieldChecks,
            missingItems
        });

        setCompletionScore(score);
        setMissingSections(missingItems);
    };

    const completionData = [
        { name: 'Completed', value: completionScore },
        { name: 'Remaining', value: 100 - completionScore },
    ];

    const strengthData = [
        { name: 'Score', value: atsScore },
        { name: 'Remaining', value: 100 - atsScore },
    ];

    // New Data for Timeline
    const applicationTimelineData = [
        { name: 'Jan', sent: 20, shortlisted: 10, interviews: 5, offers: 1 },
        { name: 'Feb', sent: 35, shortlisted: 15, interviews: 8, offers: 2 },
        { name: 'Mar', sent: 45, shortlisted: 20, interviews: 12, offers: 3 },
        { name: 'Apr', sent: 30, shortlisted: 15, interviews: 8, offers: 1 },
        { name: 'May', sent: 55, shortlisted: 25, interviews: 15, offers: 4 },
        { name: 'Jun', sent: 65, shortlisted: 30, interviews: 18, offers: 5 },
    ];

    const skillsData = [
        { subject: 'React', user: 90, demand: 95, fullMark: 100 },
        { subject: 'TypeScript', user: 85, demand: 90, fullMark: 100 },
        { subject: 'Node.js', user: 80, demand: 85, fullMark: 100 },
        { subject: 'Design', user: 75, demand: 60, fullMark: 100 },
        { subject: 'DevOps', user: 65, demand: 80, fullMark: 100 },
        { subject: 'Testing', user: 70, demand: 75, fullMark: 100 },
    ];

    const COLORS = ['#f97316', '#ffedd5']; // Orange-500, Orange-100
    const STRENGTH_COLORS = ['#f97316', '#ffedd5'];

    const handleComingSoon = (featureName: string) => {
        setComingSoonMessage(featureName);
        setIsComingSoonModalOpen(true);
    };

    const { theme } = useTheme();

    return (
        <div className="p-6 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-full transition-colors duration-200">
            {/* Coming Soon Modal */}
            {isComingSoonModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50" onClick={() => setIsComingSoonModalOpen(false)}>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="text-center">
                            <div className="mb-4 flex justify-center">
                                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                                    <Sparkles className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Coming Soon</h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                {comingSoonMessage} feature is coming soon. We're working hard to bring you this functionality!
                            </p>
                            <button
                                onClick={() => setIsComingSoonModalOpen(false)}
                                className="px-6 py-2 bg-orange-600 dark:bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}! 👋</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Here's what's happening with your job search today.</p>
                </div>

                <div className="flex flex-wrap gap-2 md:gap-3 w-full md:w-auto">
                    <button
                        onClick={() => handleComingSoon('Generate Resume (AI)')}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-600 dark:bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200 dark:shadow-orange-900/50"
                    >
                        <Sparkles className="w-4 h-4" />
                        Generate Resume (AI)
                    </button>
                    <button
                        onClick={() => handleComingSoon('Download')}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Download
                    </button>
                    <button
                        onClick={() => handleComingSoon('Upload')}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <Upload className="w-4 h-4" />
                        Upload
                    </button>
                    <button
                        onClick={() => handleComingSoon('Improve')}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <FileText className="w-4 h-4" />
                        Improve
                    </button>
                </div>
            </div>

            {/* Top Stats Row - Profile Completion & ATS Score Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6">
                {/* Profile Completion Status */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Profile Completion Status</h3>
                        </div>
                        <button
                            onClick={() => router.push('/dashboard/profile')}
                            className="px-4 py-2 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg text-sm font-medium hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors"
                        >
                            View Profile
                        </button>
                    </div>

                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                        {/* Pie Chart */}
                        <div className="relative flex-shrink-0" style={{ width: '256px', height: '256px' }}>
                            {loading ? (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="text-gray-400">Loading...</div>
                                </div>
                            ) : (
                                <>
                                    <ResponsiveContainer width={256} height={256}>
                                        <PieChart>
                                            <Pie
                                                data={completionData}
                                                cx={128}
                                                cy={128}
                                                innerRadius={70}
                                                outerRadius={100}
                                                startAngle={90}
                                                endAngle={-270}
                                                dataKey="value"
                                                stroke="none"
                                                paddingAngle={0}
                                            >
                                                {completionData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={index === 0 ? '#f97316' : '#e5e7eb'}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: '12px',
                                                    border: 'none',
                                                    boxShadow: theme === 'dark' ? '0 4px 6px -1px rgb(0 0 0 / 0.3)' : '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                                    backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
                                                    color: theme === 'dark' ? '#f3f4f6' : '#111827',
                                                    padding: '8px 12px'
                                                }}
                                                formatter={(value: number, name: string) => [`${value}%`, name]}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ zIndex: 10 }}>
                                        <span className="text-4xl font-bold text-gray-800 dark:text-gray-100">{completionScore}%</span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Complete</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Remaining Items List */}
                        <div className="flex-1 w-full min-w-0">
                            {missingSections.length > 0 ? (
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-base font-semibold text-gray-800 dark:text-gray-100">Remaining Items</p>
                                        <span className="text-sm font-medium text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 px-3 py-1 rounded-full">
                                            {missingSections.length} missing
                                        </span>
                                    </div>
                                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                                        {missingSections.filter(item => item && item.trim() !== '').length > 0 ? (
                                            missingSections.filter(item => item && item.trim() !== '').map((item, i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-700 border-2 border-red-200 dark:border-red-800 rounded-lg hover:border-red-300 dark:hover:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-sm"
                                                >
                                                    <div className="w-2.5 h-2.5 bg-red-500 dark:bg-red-400 rounded-full flex-shrink-0"></div>
                                                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{item}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
                                                No remaining items
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center lg:text-left">
                                        Complete these fields to improve your profile strength
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center lg:text-left">
                                    <div className="inline-flex items-center gap-3 px-6 py-4 bg-green-50 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-800 rounded-xl">
                                        <span className="text-3xl">🎉</span>
                                        <div>
                                            <p className="text-base font-semibold text-green-700 dark:text-green-400">Profile Complete!</p>
                                            <p className="text-sm text-green-600 dark:text-green-500 mt-1">You are ready to apply for jobs.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Resume Strength Score */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 transition-colors">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">ATS Score Analysis</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Resume optimization score</p>
                        </div>
                        {(completionScore >= 70 || hasResume) && (
                            <button
                                onClick={() => router.push('/dashboard/ats-report')}
                                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                            >
                                View Full Report
                            </button>
                        )}
                    </div>

                    <div className="relative w-full">
                        {(completionScore >= 70 || hasResume) ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left: Score Circle */}
                                <div className="flex flex-col items-center justify-center p-4">
                                    <div className="relative w-48 h-48">
                                        {/* Circular Progress */}
                                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                                            {/* Background circle */}
                                            <circle
                                                cx="100"
                                                cy="100"
                                                r="85"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="16"
                                                className="text-gray-200 dark:text-gray-700"
                                            />
                                            {/* Progress circle */}
                                            <circle
                                                cx="100"
                                                cy="100"
                                                r="85"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="16"
                                                strokeLinecap="round"
                                                className="text-orange-500 transition-all duration-1000"
                                                strokeDasharray={`${(atsScore / 100) * 534} 534`}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-5xl font-bold text-gray-800 dark:text-white">{atsScore}</span>
                                            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">out of 100</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Stats & Info */}
                                <div className="flex flex-col justify-center space-y-4">
                                    {/* Quick Stats */}
                                    {atsReport && atsReport.score && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 p-4 rounded-xl border border-orange-200 dark:border-orange-800">
                                                <p className="text-xs font-medium text-orange-600 dark:text-orange-400 mb-1">Grade</p>
                                                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{atsReport.score.grade}</p>
                                            </div>
                                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                                                <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">Percentile</p>
                                                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">Top {100 - atsReport.score.percentile}%</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Insights Preview */}
                                    {atsReport && (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Quick Insights</span>
                                            </div>
                                            {atsReport.strengths && atsReport.strengths[0] && (
                                                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                                    <CheckCircle className="w-4 h-4 text-green-700 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                                    <p className="text-xs text-green-900 dark:text-green-100 line-clamp-2">{atsReport.strengths[0]}</p>
                                                </div>
                                            )}
                                            {atsReport.weaknesses && atsReport.weaknesses[0] && (
                                                <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                                                    <AlertTriangle className="w-4 h-4 text-red-700 dark:text-red-400 mt-0.5 flex-shrink-0" />
                                                    <p className="text-xs text-red-900 dark:text-red-100 line-clamp-2">{atsReport.weaknesses[0]}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Complete Profile Message */}
                                    <div className="text-xs text-gray-500 dark:text-gray-400 italic border-l-2 border-orange-500 pl-3">
                                        Complete and well-structured profile. Minor optimizations possible for maximum ATS score.
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center p-8 h-64">
                                <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/20 rounded-full flex items-center justify-center mb-4">
                                    <Upload className="w-10 h-10 text-orange-600 dark:text-orange-400" />
                                </div>
                                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Get Your ATS Score</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
                                    Upload your resume or complete your profile to receive an instant ATS score analysis
                                </p>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-orange-200 dark:shadow-orange-900/20 transform hover:-translate-y-0.5"
                                >
                                    Upload Resume Now
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileUpload}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Analytics & Insights Row - Better Organized */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Job Match Insights */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 transition-colors">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-2">Job Match Insights</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">Primary Skills Strength vs Industry Demand</p>

                    <div className="relative h-64 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillsData}>
                                <PolarGrid stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 10 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Your Skills"
                                    dataKey="user"
                                    stroke="#f97316"
                                    strokeWidth={2}
                                    fill="#f97316"
                                    fillOpacity={theme === 'dark' ? 0.6 : 0.4}
                                />
                                <Radar
                                    name="Industry Demand"
                                    dataKey="demand"
                                    stroke="#6366f1"
                                    strokeWidth={2}
                                    fill="#6366f1"
                                    fillOpacity={theme === 'dark' ? 0.4 : 0.2}
                                />
                                <Legend
                                    iconType="circle"
                                    wrapperStyle={{
                                        fontSize: '12px',
                                        paddingTop: '10px',
                                        color: theme === 'dark' ? '#f3f4f6' : '#111827'
                                    }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: theme === 'dark' ? '0 4px 6px -1px rgb(0 0 0 / 0.3)' : '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                        backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
                                        color: theme === 'dark' ? '#f3f4f6' : '#111827'
                                    }}
                                    itemStyle={{ fontSize: '12px' }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recommended Jobs */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 transition-colors">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-2">Recommended Jobs</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">Based on your skills and profile</p>

                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="text-center">
                            <div className="mb-4 flex justify-center">
                                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                                    <Sparkles className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                                </div>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Coming Soon</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                                We're working on personalized job recommendations based on your profile and skills.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Application Status */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 transition-colors">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-100">Application Status</h3>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="text-center">
                            <div className="mb-4 flex justify-center">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                    <Briefcase className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">No application status yet</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interviews & Messages Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Upcoming Interviews */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 transition-colors">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-4">Upcoming Interviews</h3>
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="text-center">
                            <div className="mb-4 flex justify-center">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                    <Clock className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">No upcoming interviews</p>
                        </div>
                    </div>
                </div>

                {/* Messages & Notifications */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 transition-colors">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-100">Messages & Alerts</h3>
                        <button className="text-gray-400 dark:text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                            <Bell className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="text-center">
                            <div className="mb-4 flex justify-center">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                    <MessageSquare className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">No messages and alerts yet</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Saved Jobs & Career Tools Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Saved Jobs */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 transition-colors">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-100">Saved Jobs</h3>
                        <button className="text-orange-600 dark:text-orange-400 text-xs font-medium hover:underline">View All</button>
                    </div>

                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="text-center">
                            <div className="mb-4 flex justify-center">
                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                    <Bookmark className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">No saved jobs yet</p>
                        </div>
                    </div>
                </div>

                {/* Career Tools */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 transition-colors">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-6">Career Tools</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button className="flex items-center gap-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors text-left group">
                            <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 shadow-sm group-hover:scale-110 transition-transform">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="font-semibold text-gray-800 dark:text-gray-100">Interview Prep</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Practice questions & tips</div>
                            </div>
                        </button>

                        <button className="flex items-center gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-left group">
                            <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-sm group-hover:scale-110 transition-transform">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="font-semibold text-gray-800 dark:text-gray-100">Cover Letter Gen</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">AI-powered writing</div>
                            </div>
                        </button>

                        <button className="flex items-center gap-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors text-left group">
                            <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm group-hover:scale-110 transition-transform">
                                <Video className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="font-semibold text-gray-800 dark:text-gray-100">Mock Interview</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Practice with AI Agent</div>
                            </div>
                        </button>

                        <button className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors text-left group">
                            <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="font-semibold text-gray-800 dark:text-gray-100">Market Insights</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Salary & demand trends</div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardContent;
