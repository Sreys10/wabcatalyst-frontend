"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Camera, Plus, Trash2, Upload, ChevronDown, ChevronUp, CheckCircle, AlertCircle } from 'lucide-react';
import { mockProfileData } from '../../data/mockProfile';

const ProfileContent = () => {
    const { data: session } = useSession();
    const [activeSection, setActiveSection] = useState('personal');
    const [profileData, setProfileData] = useState(mockProfileData);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/profile');
                if (res.ok) {
                    const data = await res.json();
                    // Merge with mock data structure to ensure all fields exist
                    setProfileData({ ...mockProfileData, ...data });
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
        <div className="p-8 bg-gray-50 min-h-screen flex flex-col lg:flex-row gap-8">

            {/* Main Form Area */}
            <div className="flex-1 space-y-8">
                <h1 className="text-2xl font-bold text-gray-800" style={{ color: '#000' }}>My Profile</h1>

                {/* 1. Personal Information */}
                <section id="personal" className="bg-white p-6 rounded-3xl shadow-sm scroll-mt-24">
                    <h2 className="text-xl font-semibold text-gray-700 mb-6 flex items-center gap-2" style={{ color: '#000' }}>
                        <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">1</span>
                        Personal Information
                    </h2>

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Profile Photo */}
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-32 h-32 rounded-full bg-gray-100 border-4 border-white shadow-md flex items-center justify-center relative overflow-hidden group cursor-pointer">
                                {session?.user?.image ? (
                                    <img src={session.user.image} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl">👤</span>
                                )}
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="text-white w-8 h-8" />
                                </div>
                            </div>
                            <button className="text-sm text-orange-600 font-medium hover:underline">Change Photo</button>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700" style={{ color: '#000' }}>Location / City</label>
                                <input type="text" defaultValue={profileData.personal.location} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all" placeholder="New York, USA" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">LinkedIn URL</label>
                                <input type="url" defaultValue={profileData.personal.linkedin} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all" placeholder="linkedin.com/in/johndoe" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Portfolio URL</label>
                                <input type="url" defaultValue={profileData.personal.portfolio} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all" placeholder="johndoe.com" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. Professional Summary */}
                <section id="summary" className="bg-white p-6 rounded-3xl shadow-sm scroll-mt-24">
                    <h2 className="text-xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">2</span>
                        Professional Summary
                    </h2>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Short Bio / About Me</label>
                            <textarea defaultValue={profileData.summary.bio} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all min-h-[120px]" placeholder="I am a passionate software engineer with 5 years of experience..." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Preferred Job Titles</label>
                            <input type="text" defaultValue={profileData.summary.jobTitles} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all" placeholder="e.g. Frontend Developer, Full Stack Engineer" />
                            <p className="text-xs text-gray-400">Separate multiple titles with commas</p>
                        </div>
                    </div>
                </section>

                {/* 3. Skills */}
                <section id="skills" className="bg-white p-6 rounded-3xl shadow-sm scroll-mt-24">
                    <h2 className="text-xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">3</span>
                        Skills
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Primary Skills</label>
                            <input type="text" defaultValue={profileData.skills.primary} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all" placeholder="React, TypeScript, Node.js" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Tools & Technologies</label>
                            <input type="text" defaultValue={profileData.skills.tools} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all" placeholder="VS Code, Git, Figma" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Soft Skills</label>
                            <input type="text" defaultValue={profileData.skills.soft} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all" placeholder="Leadership, Communication" />
                        </div>
                    </div>
                </section>

                {/* 4. Work Experience */}
                <section id="experience" className="bg-white p-6 rounded-3xl shadow-sm scroll-mt-24">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">4</span>
                            Work Experience
                        </h2>
                        <button className="flex items-center gap-2 text-sm font-medium text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors">
                            <Plus className="w-4 h-4" /> Add New
                        </button>
                    </div>

                    {profileData.experience.map((exp) => (
                        <div key={exp.id} className="border border-gray-100 rounded-2xl p-5 mb-4 hover:border-orange-100 transition-colors">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <input type="text" defaultValue={exp.title} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm" placeholder="Job Title" />
                                <input type="text" defaultValue={exp.company} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm" placeholder="Company Name" />
                                <div className="flex gap-4">
                                    <input type="text" defaultValue={exp.startDate} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-500" placeholder="Start Date" />
                                    <input type="text" defaultValue={exp.endDate} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-500" placeholder="End Date" />
                                </div>
                                <input type="text" defaultValue={exp.location} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm" placeholder="Location" />
                            </div>
                            <textarea defaultValue={exp.description} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm min-h-[80px]" placeholder="Responsibilities & Achievements..." />
                        </div>
                    ))}
                </section>

                {/* 5. Education */}
                <section id="education" className="bg-white p-6 rounded-3xl shadow-sm scroll-mt-24">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">5</span>
                            Education
                        </h2>
                        <button className="flex items-center gap-2 text-sm font-medium text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors">
                            <Plus className="w-4 h-4" /> Add New
                        </button>
                    </div>
                    {profileData.education.map((edu) => (
                        <div key={edu.id} className="border border-gray-100 rounded-2xl p-5 mb-4 hover:border-orange-100 transition-colors">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" defaultValue={edu.degree} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm" placeholder="Degree / Qualification" />
                                <input type="text" defaultValue={edu.institution} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm" placeholder="University / Institution" />
                                <input type="text" defaultValue={edu.year} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm" placeholder="Year of Passing" />
                                <input type="text" defaultValue={edu.grade} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm" placeholder="CGPA / Percentage" />
                            </div>
                        </div>
                    ))}
                </section>

                {/* 6. Projects */}
                <section id="projects" className="bg-white p-6 rounded-3xl shadow-sm scroll-mt-24">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">6</span>
                            Projects
                        </h2>
                        <button className="flex items-center gap-2 text-sm font-medium text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors">
                            <Plus className="w-4 h-4" /> Add New
                        </button>
                    </div>
                    {profileData.projects.map((proj) => (
                        <div key={proj.id} className="border border-gray-100 rounded-2xl p-5 mb-4 hover:border-orange-100 transition-colors">
                            <div className="space-y-4">
                                <input type="text" defaultValue={proj.title} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm" placeholder="Project Title" />
                                <textarea defaultValue={proj.description} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm min-h-[60px]" placeholder="Description" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" defaultValue={proj.technologies} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm" placeholder="Technologies Used" />
                                    <input type="url" defaultValue={proj.link} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm" placeholder="Project Link (GitHub/Demo)" />
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                {/* 7. Certifications */}
                <section id="certifications" className="bg-white p-6 rounded-3xl shadow-sm scroll-mt-24">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">7</span>
                            Certifications
                        </h2>
                        <button className="flex items-center gap-2 text-sm font-medium text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors">
                            <Plus className="w-4 h-4" /> Add New
                        </button>
                    </div>
                    {profileData.certifications.map((cert) => (
                        <div key={cert.id} className="border border-gray-100 rounded-2xl p-5 mb-4 hover:border-orange-100 transition-colors">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" defaultValue={cert.name} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm" placeholder="Certification Name" />
                                <input type="text" defaultValue={cert.issuer} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm" placeholder="Issuing Organization" />
                            </div>
                        </div>
                    ))}
                </section>

                {/* 8. Job Preferences */}
                <section id="preferences" className="bg-white p-6 rounded-3xl shadow-sm scroll-mt-24">
                    <h2 className="text-xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">8</span>
                        Job Preferences
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Preferred Roles</label>
                            <input type="text" defaultValue={profileData.preferences.roles} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all" placeholder="e.g. Frontend Developer" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Preferred Location</label>
                            <input type="text" defaultValue={profileData.preferences.location} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all" placeholder="e.g. Remote, New York" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Expected Salary</label>
                            <input type="text" defaultValue={profileData.preferences.salary} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all" placeholder="e.g. $100k - $120k" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Notice Period</label>
                            <select defaultValue={profileData.preferences.noticePeriod} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-white">
                                <option>Immediate</option>
                                <option>15 Days</option>
                                <option>30 Days</option>
                                <option>60 Days</option>
                                <option>90 Days</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* 9. Documents */}
                <section id="documents" className="bg-white p-6 rounded-3xl shadow-sm scroll-mt-24">
                    <h2 className="text-xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">9</span>
                        Documents
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-orange-300 hover:bg-orange-50 transition-all cursor-pointer group">
                            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 mb-3 group-hover:bg-white group-hover:scale-110 transition-all">
                                <Upload className="w-6 h-6" />
                            </div>
                            <h4 className="font-medium text-gray-800">Upload Resume</h4>
                            <p className="text-xs text-gray-500 mt-1">PDF or DOCX up to 5MB</p>
                        </div>
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-orange-300 hover:bg-orange-50 transition-all cursor-pointer group">
                            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 mb-3 group-hover:bg-white group-hover:scale-110 transition-all">
                                <Upload className="w-6 h-6" />
                            </div>
                            <h4 className="font-medium text-gray-800">Other Documents</h4>
                            <p className="text-xs text-gray-500 mt-1">Certificates, ID Proofs, etc.</p>
                        </div>
                    </div>
                </section>

                {/* 10. Extra Sections */}
                <section id="extras" className="bg-white p-6 rounded-3xl shadow-sm scroll-mt-24">
                    <h2 className="text-xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">10</span>
                        Extra Sections
                    </h2>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Strengths</label>
                            <input type="text" defaultValue={profileData.extras.strengths} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all" placeholder="e.g. Public Speaking, Leadership" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Hobbies / Interests</label>
                            <label className="text-sm font-medium text-gray-700">Preferred Job Titles</label>
                            <input type="text" defaultValue={profileData.summary.jobTitles} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all" placeholder="e.g. Frontend Developer, Full Stack Engineer" />
                            <p className="text-xs text-gray-400">Separate multiple titles with commas</p>
                        </div>
                    </div>
                </section>

                {/* 3. Skills */}
                <section id="skills" className="bg-white p-6 rounded-3xl shadow-sm scroll-mt-24">
                    <h2 className="text-xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">3</span>
                        Skills
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Primary Skills</label>
                            <input type="text" defaultValue={profileData.skills.primary} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all" placeholder="React, TypeScript, Node.js" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Tools & Technologies</label>
                            <input type="text" defaultValue={profileData.skills.tools} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all" placeholder="VS Code, Git, Figma" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Soft Skills</label>
                            <input type="text" defaultValue={profileData.skills.soft} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all" placeholder="Leadership, Communication" />
                        </div>
                    </div>
                </section>

                {/* 4. Work Experience */}
                <section id="experience" className="bg-white p-6 rounded-3xl shadow-sm scroll-mt-24">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">4</span>
                            Work Experience
                        </h2>
                        <button className="flex items-center gap-2 text-sm font-medium text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors">
                            <Plus className="w-4 h-4" /> Add New
                        </button>
                    </div>

                    {profileData.experience.map((exp) => (
                        <div key={exp.id} className="border border-gray-100 rounded-2xl p-5 mb-4 hover:border-orange-100 transition-colors">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <input type="text" defaultValue={exp.title} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm" placeholder="Job Title" />
                                <input type="text" defaultValue={exp.company} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm" placeholder="Company Name" />
                                <div className="flex gap-4">
                                    <input type="text" defaultValue={exp.startDate} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-500" placeholder="Start Date" />
                                    <input type="text" defaultValue={exp.endDate} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-500" placeholder="End Date" />
                                </div>
                                <input type="text" defaultValue={exp.location} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm" placeholder="Location" />
                            </div>
                            <textarea defaultValue={exp.description} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm min-h-[80px]" placeholder="Responsibilities & Achievements..." />
                        </div>
                    ))}
                </section>

                {/* 5. Education */}
                <section id="education" className="bg-white p-6 rounded-3xl shadow-sm scroll-mt-24">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">5</span>
                            Education
                        </h2>
                        <button className="flex items-center gap-2 text-sm font-medium text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors">
                            <Plus className="w-4 h-4" /> Add New
                        </button>
                    </div>
                    {profileData.education.map((edu) => (
                        <div key={edu.id} className="border border-gray-100 rounded-2xl p-5 mb-4 hover:border-orange-100 transition-colors">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" defaultValue={edu.degree} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm" placeholder="Degree / Qualification" />
                                <input type="text" defaultValue={edu.institution} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm" placeholder="University / Institution" />
                                <input type="text" defaultValue={edu.year} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm" placeholder="Year of Passing" />
                                <input type="text" defaultValue={edu.grade} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm" placeholder="CGPA / Percentage" />
                            </div>
                        </div>
                    ))}
                </section>

                {/* 6. Projects */}
                <section id="projects" className="bg-white p-6 rounded-3xl shadow-sm scroll-mt-24">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">6</span>
                            Projects
                        </h2>
                        <button className="flex items-center gap-2 text-sm font-medium text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors">
                            <Plus className="w-4 h-4" /> Add New
                        </button>
                    </div>
                    {profileData.projects.map((proj) => (
                        <div key={proj.id} className="border border-gray-100 rounded-2xl p-5 mb-4 hover:border-orange-100 transition-colors">
                            <div className="space-y-4">
                                <input type="text" defaultValue={proj.title} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm" placeholder="Project Title" />
                                <textarea defaultValue={proj.description} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm min-h-[60px]" placeholder="Description" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" defaultValue={proj.technologies} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm" placeholder="Technologies Used" />
                                    <input type="url" defaultValue={proj.link} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm" placeholder="Project Link (GitHub/Demo)" />
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                {/* 7. Certifications */}
                <section id="certifications" className="bg-white p-6 rounded-3xl shadow-sm scroll-mt-24">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">7</span>
                            Certifications
                        </h2>
                        <button className="flex items-center gap-2 text-sm font-medium text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors">
                            <Plus className="w-4 h-4" /> Add New
                        </button>
                    </div>
                    {profileData.certifications.map((cert) => (
                        <div key={cert.id} className="border border-gray-100 rounded-2xl p-5 mb-4 hover:border-orange-100 transition-colors">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" defaultValue={cert.name} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm" placeholder="Certification Name" />
                                <input type="text" defaultValue={cert.issuer} className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm" placeholder="Issuing Organization" />
                            </div>
                        </div>
                    ))}
                </section>

                {/* 8. Job Preferences */}
                <section id="preferences" className="bg-white p-6 rounded-3xl shadow-sm scroll-mt-24">
                    <h2 className="text-xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">8</span>
                        Job Preferences
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Preferred Roles</label>
                            <input type="text" defaultValue={profileData.preferences.roles} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all" placeholder="e.g. Frontend Developer" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Preferred Location</label>
                            <input type="text" defaultValue={profileData.preferences.location} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all" placeholder="e.g. Remote, New York" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Expected Salary</label>
                            <input type="text" defaultValue={profileData.preferences.salary} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all" placeholder="e.g. $100k - $120k" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Notice Period</label>
                            <select defaultValue={profileData.preferences.noticePeriod} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all bg-white">
                                <option>Immediate</option>
                                <option>15 Days</option>
                                <option>30 Days</option>
                                <option>60 Days</option>
                                <option>90 Days</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* 9. Documents */}
                <section id="documents" className="bg-white p-6 rounded-3xl shadow-sm scroll-mt-24">
                    <h2 className="text-xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">9</span>
                        Documents
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-orange-300 hover:bg-orange-50 transition-all cursor-pointer group">
                            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 mb-3 group-hover:bg-white group-hover:scale-110 transition-all">
                                <Upload className="w-6 h-6" />
                            </div>
                            <h4 className="font-medium text-gray-800">Upload Resume</h4>
                            <p className="text-xs text-gray-500 mt-1">PDF or DOCX up to 5MB</p>
                        </div>
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-orange-300 hover:bg-orange-50 transition-all cursor-pointer group">
                            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 mb-3 group-hover:bg-white group-hover:scale-110 transition-all">
                                <Upload className="w-6 h-6" />
                            </div>
                            <h4 className="font-medium text-gray-800">Other Documents</h4>
                            <p className="text-xs text-gray-500 mt-1">Certificates, ID Proofs, etc.</p>
                        </div>
                    </div>
                </section>

                {/* 10. Extra Sections */}
                <section id="extras" className="bg-white p-6 rounded-3xl shadow-sm scroll-mt-24">
                    <h2 className="text-xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-sm">10</span>
                        Extra Sections
                    </h2>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Strengths</label>
                            <input type="text" defaultValue={profileData.extras.strengths} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all" placeholder="e.g. Public Speaking, Leadership" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Hobbies / Interests</label>
                            <input type="text" defaultValue={profileData.extras.hobbies} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all" placeholder="e.g. Photography, Hiking" />
                        </div>
                    </div>
                </section>

                <div className="flex justify-end gap-4 pt-4">
                    <button className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                    <button className="px-6 py-3 rounded-xl bg-orange-600 text-white font-medium hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all transform hover:-translate-y-0.5">Save Profile</button>
                </div>

            </div>

            {/* Right Sidebar: Completion Meter & Navigation */}
            <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
                {/* Completion Meter */}
                <div className="bg-white p-6 rounded-3xl shadow-sm sticky top-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-4" style={{ color: '#000' }}>Profile Strength</h3>

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
                        <h4 className="text-sm font-semibold text-gray-700" style={{ color: '#000' }}>Missing Information:</h4>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-sm text-gray-600">
                                <AlertCircle className="w-4 h-4 text-indigo-500" />
                                <span>Add Professional Summary</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-gray-600">
                                <AlertCircle className="w-4 h-4 text-indigo-500" />
                                <span>Upload Resume</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-gray-600">
                                <AlertCircle className="w-4 h-4 text-indigo-500" />
                                <span>Add 2 more Skills</span>
                            </li>
                        </ul>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3" style={{ color: '#000' }}>Quick Navigation</h4>
                        <nav className="space-y-1">
                            {sections.map((section) => (
                                <a
                                    key={section.id}
                                    href={`#${section.id}`}
                                    className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-orange-600 rounded-lg transition-colors"
                                >
                                    {section.label}
                                </a>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ProfileContent;
