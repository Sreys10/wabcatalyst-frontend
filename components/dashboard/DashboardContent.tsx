"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from 'recharts';
import { MoreHorizontal, Sparkles, Download, Upload, FileText, Bell, MessageSquare, Clock, Briefcase, Bookmark, BookOpen, Video, TrendingUp } from 'lucide-react';
import ResumeGeneratorModal from './ResumeGeneratorModal';

const DashboardContent = () => {
    const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

    const { data: session } = useSession();
    const [completionScore, setCompletionScore] = useState(0);
    const [atsScore, setAtsScore] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (session) {
                try {
                    const res = await fetch('/api/profile');
                    if (res.ok) {
                        const profile = await res.json();
                        calculateScores(profile);
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

    const calculateScores = (profile: any) => {
        let filledFields = 0;
        let totalFields = 0;

        // Helper to check object fields
        const checkFields = (obj: any) => {
            if (!obj) return;
            Object.values(obj).forEach(val => {
                totalFields++;
                if (val && val.toString().trim() !== '') filledFields++;
            });
        };

        // Check sections
        checkFields(profile.personal);
        checkFields(profile.summary);
        checkFields(profile.skills);
        checkFields(profile.preferences);

        // Check arrays (count as 1 field each if not empty)
        totalFields += 4; // experience, education, projects, certifications
        if (profile.experience?.length > 0) filledFields++;
        if (profile.education?.length > 0) filledFields++;
        if (profile.projects?.length > 0) filledFields++;
        if (profile.certifications?.length > 0) filledFields++;

        const score = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
        setCompletionScore(score);

        // Simple heuristic for ATS score: slightly lower than completion, boosted by specific sections
        let calculatedAts = Math.round(score * 0.9);
        if (profile.experience?.length > 0) calculatedAts += 5;
        if (profile.skills?.primary) calculatedAts += 5;
        setAtsScore(Math.min(100, calculatedAts));
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

    return (
        <div className="p-8 bg-gray-50 min-h-full">
            <ResumeGeneratorModal isOpen={isResumeModalOpen} onClose={() => setIsResumeModalOpen(false)} />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}! 👋</h1>
                    <p className="text-gray-500 text-sm mt-1">Here's what's happening with your job search today.</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => setIsResumeModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-xl text-sm font-medium hover:bg-orange-700 transition-colors shadow-sm shadow-orange-200"
                    >
                        <Sparkles className="w-4 h-4" />
                        Generate Resume (AI)
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                        <Download className="w-4 h-4" />
                        Download
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                        <Upload className="w-4 h-4" />
                        Upload
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                        <FileText className="w-4 h-4" />
                        Improve
                    </button>
                </div>
            </div>

            {/* Top Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Profile Completion Status */}
                <div className="bg-white p-6 rounded-3xl shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-lg font-semibold !text-black" style={{ color: '#000' }}>Profile Completion Status</h3>
                            <div className="text-3xl font-bold !text-black mt-2" style={{ color: '#000' }}>{completionScore}%</div>
                        </div>
                        <button className="px-4 py-2 bg-orange-50 text-orange-600 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors">
                            View Resume
                        </button>
                    </div>

                    <div className="relative h-64 w-full flex items-center justify-center" style={{ minHeight: '256px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={completionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    startAngle={90}
                                    endAngle={-270}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {completionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Resume Strength Score */}
                <div className="bg-white p-6 rounded-3xl shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-lg font-semibold !text-black" style={{ color: '#000' }}>Resume Strength score/ATS score</h3>
                            <div className="text-xl font-medium text-orange-500 mt-2 border border-orange-200 rounded px-2 py-1 inline-block">Score:- {atsScore}/100</div>
                        </div>
                        <button className="px-4 py-2 bg-orange-50 text-orange-600 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors">
                            View Report
                        </button>
                    </div>

                    <div className="relative h-64 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={strengthData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    startAngle={90}
                                    endAngle={-270}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {strengthData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={STRENGTH_COLORS[index % STRENGTH_COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Job Match Insights (Replaces Your Rating) */}
                <div className="bg-white p-6 rounded-3xl shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Job Match Insights</h3>
                    <p className="text-xs text-gray-400 mb-6">Primary Skills Strength vs Industry Demand</p>

                    <div className="relative h-64 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsData}>
                                <PolarGrid stroke="#e5e7eb" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Your Skills"
                                    dataKey="user"
                                    stroke="#f97316"
                                    strokeWidth={2}
                                    fill="#f97316"
                                    fillOpacity={0.4}
                                />
                                <Radar
                                    name="Industry Demand"
                                    dataKey="demand"
                                    stroke="#6366f1"
                                    strokeWidth={2}
                                    fill="#6366f1"
                                    fillOpacity={0.2}
                                />
                                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontSize: '12px' }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recommended Jobs List (Replaces Most Ordered Food) */}
                <div className="bg-white p-6 rounded-3xl shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Recommended Jobs</h3>
                    <p className="text-xs text-gray-400 mb-6">Based on your skills and profile</p>

                    <div className="space-y-6">
                        {[
                            { role: 'Frontend Developer', match: '86% Match', icon: '💻' },
                            { role: 'HR Executive', match: '72% Match', icon: '👥' },
                            { role: 'Data Analyst', match: '65% Match', icon: '📊' },
                        ].map((job, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-xl text-orange-600">
                                        {job.icon}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-700">{job.role}</div>
                                        <div className="text-xs text-orange-500 font-semibold">{job.match}</div>
                                    </div>
                                </div>
                                <button className="px-3 py-1.5 bg-orange-600 text-white text-xs font-medium rounded-lg hover:bg-orange-700 transition-colors">
                                    Apply
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Application Status Timeline (Replaces Order Chart) */}
                <div className="bg-white p-6 rounded-3xl shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700">Application Status</h3>
                            <div className="text-3xl font-bold text-gray-900 mt-1">250</div>
                            <div className="text-xs text-green-500 mt-1 flex items-center">
                                <span className="mr-1">↑ 12%</span>
                                <span className="text-gray-400">vs last month</span>
                            </div>
                        </div>
                        <button className="px-3 py-1 bg-orange-50 text-orange-600 rounded text-xs font-medium">View Report</button>
                    </div>

                    <p className="text-xs text-gray-400 mb-4">Timeline: Jan - Jun 2025</p>

                    <div className="h-40 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={applicationTimelineData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} dy={10} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ fontSize: '12px' }}
                                />
                                <Line type="monotone" dataKey="sent" name="Sent" stroke="#f97316" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 4 }} />
                                <Line type="monotone" dataKey="shortlisted" name="Shortlisted" stroke="#a855f7" strokeWidth={2} dot={{ r: 2 }} />
                                <Line type="monotone" dataKey="interviews" name="Interviews" stroke="#6366f1" strokeWidth={2} dot={{ r: 2 }} />
                                <Line type="monotone" dataKey="offers" name="Offers" stroke="#10b981" strokeWidth={2} dot={{ r: 2 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 mt-4 text-[10px] text-gray-500">
                        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> Sent</div>
                        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Shortlisted</div>
                        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Interviews</div>
                        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Offers</div>
                    </div>
                </div>
            </div>

            {/* Bottom Grid: Interviews & Messages */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                {/* Upcoming Interviews */}
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Upcoming Interviews</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs text-gray-400 border-b border-gray-100">
                                    <th className="py-3 font-medium">Company</th>
                                    <th className="py-3 font-medium">Role</th>
                                    <th className="py-3 font-medium">Date / Time</th>
                                    <th className="py-3 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {[
                                    { company: 'Google', role: 'Frontend Engineer', date: '24 Nov 2025, 10:00 AM', link: '#' },
                                    { company: 'Microsoft', role: 'UX Designer', date: '26 Nov 2025, 2:00 PM', link: '#' },
                                    { company: 'Spotify', role: 'Product Manager', date: '28 Nov 2025, 11:30 AM', link: '#' },
                                ].map((interview, index) => (
                                    <tr key={index} className="border-b border-gray-50 last:border-none hover:bg-gray-50 transition-colors">
                                        <td className="py-4 font-medium text-gray-800">{interview.company}</td>
                                        <td className="py-4 text-gray-600">{interview.role}</td>
                                        <td className="py-4 text-gray-500">{interview.date}</td>
                                        <td className="py-4">
                                            <a href={interview.link} className="inline-flex items-center px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-xs font-medium hover:bg-orange-100 transition-colors">
                                                Join Meeting
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Messages & Notifications */}
                <div className="bg-white p-6 rounded-3xl shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-700">Messages & Alerts</h3>
                        <button className="text-gray-400 hover:text-orange-600 transition-colors">
                            <Bell className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-2">
                        {[
                            { type: 'message', title: 'Recruiter at Google', desc: 'Hey, are you available for a quick call?', time: '10m ago', icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50' },
                            { type: 'reminder', title: 'Interview in 1 hour', desc: 'Prepare for your role at Microsoft', time: '1h', icon: Clock, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                            { type: 'alert', title: 'New Job Alert', desc: 'Senior React Dev at Netflix', time: '2h ago', icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-50' },
                            { type: 'message', title: 'Sarah from Spotify', desc: 'Your application has been viewed', time: '1d ago', icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                                <div className={`w-10 h-10 rounded-full ${item.bg} flex items-center justify-center ${item.color} shrink-0`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex justify-between items-start w-full">
                                        <h4 className="text-sm font-semibold text-gray-800">{item.title}</h4>
                                        <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{item.time}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 py-2 text-xs font-medium text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                        View All Notifications
                    </button>
                </div>
            </div>

            {/* Bottom Row: Saved Jobs & Career Tools */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                {/* Saved Jobs */}
                <div className="bg-white p-6 rounded-3xl shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-700">Saved Jobs</h3>
                        <button className="text-orange-600 text-xs font-medium hover:underline">View All</button>
                    </div>

                    <div className="space-y-4">
                        {[
                            { role: 'Senior React Developer', company: 'Netflix', location: 'Remote', posted: '2d ago' },
                            { role: 'Product Designer', company: 'Airbnb', location: 'San Francisco', posted: '5d ago' },
                            { role: 'Full Stack Engineer', company: 'Stripe', location: 'New York', posted: '1w ago' },
                        ].map((job, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors group cursor-pointer">
                                <div>
                                    <div className="text-sm font-semibold text-gray-800 group-hover:text-orange-700">{job.role}</div>
                                    <div className="text-xs text-gray-500">{job.company} • {job.location}</div>
                                </div>
                                <button className="text-gray-400 hover:text-orange-600">
                                    <Bookmark className="w-4 h-4 fill-current" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Career Tools */}
                <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-700 mb-6">Career Tools</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button className="flex items-center gap-4 p-4 bg-orange-50 rounded-2xl hover:bg-orange-100 transition-colors text-left group">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-orange-600 shadow-sm group-hover:scale-110 transition-transform">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="font-semibold text-gray-800">Interview Prep</div>
                                <div className="text-xs text-gray-500 mt-1">Practice questions & tips</div>
                            </div>
                        </button>

                        <button className="flex items-center gap-4 p-4 bg-purple-50 rounded-2xl hover:bg-purple-100 transition-colors text-left group">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-purple-600 shadow-sm group-hover:scale-110 transition-transform">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="font-semibold text-gray-800">Cover Letter Gen</div>
                                <div className="text-xs text-gray-500 mt-1">AI-powered writing</div>
                            </div>
                        </button>

                        <button className="flex items-center gap-4 p-4 bg-indigo-50 rounded-2xl hover:bg-indigo-100 transition-colors text-left group">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                                <Video className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="font-semibold text-gray-800">Mock Interview</div>
                                <div className="text-xs text-gray-500 mt-1">Practice with AI Agent</div>
                            </div>
                        </button>

                        <button className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl hover:bg-emerald-100 transition-colors text-left group">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="font-semibold text-gray-800">Market Insights</div>
                                <div className="text-xs text-gray-500 mt-1">Salary & demand trends</div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardContent;

