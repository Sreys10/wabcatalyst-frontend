import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

const Template1 = ({ data }) => {
    const { personal, summary, skills, experience, education, projects, certifications, languages } = data;

    return (
        <div className="w-[210mm] min-h-[297mm] bg-white shadow-lg flex print:shadow-none">
            {/* Left Sidebar - Dark Blue */}
            <div className="w-[35%] bg-[#1a2e3b] text-white p-8 flex flex-col gap-8">
                {/* Contact Info */}
                <div className="space-y-4">
                    {personal.email && (
                        <div className="flex items-center gap-3 text-sm">
                            <Mail className="w-4 h-4 text-gray-300" />
                            <span className="break-all">{personal.email}</span>
                        </div>
                    )}
                    {personal.phone && (
                        <div className="flex items-center gap-3 text-sm">
                            <Phone className="w-4 h-4 text-gray-300" />
                            <span>{personal.phone}</span>
                        </div>
                    )}
                    {personal.location && (
                        <div className="flex items-center gap-3 text-sm">
                            <MapPin className="w-4 h-4 text-gray-300" />
                            <span>{personal.location}</span>
                        </div>
                    )}
                    {personal.portfolio && (
                        <div className="flex items-center gap-3 text-sm">
                            <Globe className="w-4 h-4 text-gray-300" />
                            <a href={personal.portfolio} target="_blank" rel="noopener noreferrer" className="break-all hover:text-blue-300">{personal.portfolio}</a>
                        </div>
                    )}
                    {personal.linkedin && (
                        <div className="flex items-center gap-3 text-sm">
                            <Linkedin className="w-4 h-4 text-gray-300" />
                            <span className="break-all">{personal.linkedin.replace('https://', '')}</span>
                        </div>
                    )}
                </div>

                {/* Hard Skills */}
                <div>
                    <h3 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-gray-600 pb-2 flex items-center gap-2">
                        Hard Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {skills.primary && skills.primary.split(',').map((skill, i) => (
                            <span key={i} className="text-sm bg-[#2c4a5f] px-2 py-1 rounded">{skill.trim()}</span>
                        ))}
                        {skills.tools && skills.tools.split(',').map((skill, i) => (
                            <span key={i} className="text-sm bg-[#2c4a5f] px-2 py-1 rounded">{skill.trim()}</span>
                        ))}
                    </div>
                </div>

                {/* Soft Skills */}
                <div>
                    <h3 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-gray-600 pb-2">
                        Soft Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {skills.soft && skills.soft.split(',').map((skill, i) => (
                            <span key={i} className="text-sm bg-[#2c4a5f] px-2 py-1 rounded">{skill.trim()}</span>
                        ))}
                    </div>
                </div>

                {/* Languages (Mock if not present) */}
                <div>
                    <h3 className="text-lg font-bold uppercase tracking-wider mb-4 border-b border-gray-600 pb-2">
                        Languages
                    </h3>
                    <div className="space-y-2 text-sm">
                        <div>
                            <div className="font-semibold">English</div>
                            <div className="text-gray-400 text-xs">Native or Bilingual Proficiency</div>
                        </div>
                        {/* Add more if available in data */}
                    </div>
                </div>
            </div>

            {/* Main Content - White */}
            <div className="flex-1 p-8 text-gray-800">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-[#1a2e3b] mb-2 uppercase tracking-wide">{personal.fullName}</h1>
                    <h2 className="text-xl text-[#4a90e2] font-medium">{summary.jobTitles ? summary.jobTitles.split(',')[0] : 'Professional'}</h2>
                </div>

                {/* Summary */}
                <div className="mb-8">
                    <p className="text-sm leading-relaxed text-gray-600">
                        {summary.bio}
                    </p>
                </div>

                {/* Experience */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-[#1a2e3b] uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 bg-[#1a2e3b] text-white rounded-full flex items-center justify-center text-xs">💼</span>
                        Work Experience
                    </h3>
                    <div className="space-y-6 border-l-2 border-gray-200 ml-3 pl-6 relative">
                        {experience.map((exp, i) => (
                            <div key={i} className="relative">
                                <div className="absolute -left-[31px] top-1 w-3 h-3 bg-[#4a90e2] rounded-full border-2 border-white"></div>
                                <h4 className="font-bold text-gray-800">{exp.title}</h4>
                                <div className="text-sm text-gray-500 mb-1">{exp.company} | {exp.startDate} - {exp.endDate}</div>
                                <div className="text-xs text-gray-400 mb-2">{exp.location}</div>
                                <p className="text-sm text-gray-600 whitespace-pre-line">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Education */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-[#1a2e3b] uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 bg-[#1a2e3b] text-white rounded-full flex items-center justify-center text-xs">🎓</span>
                        Education
                    </h3>
                    <div className="space-y-4 ml-3">
                        {education.map((edu, i) => (
                            <div key={i}>
                                <h4 className="font-bold text-gray-800">{edu.degree}</h4>
                                <div className="text-sm text-gray-600">{edu.institution}</div>
                                <div className="text-xs text-gray-400">{edu.year} {edu.grade ? `| Grade: ${edu.grade}` : ''}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Certifications */}
                {certifications && certifications.length > 0 && (
                    <div>
                        <h3 className="text-lg font-bold text-[#1a2e3b] uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="w-6 h-6 bg-[#1a2e3b] text-white rounded-full flex items-center justify-center text-xs">📜</span>
                            Certificates
                        </h3>
                        <div className="space-y-3 ml-3">
                            {certifications.map((cert, i) => (
                                <div key={i}>
                                    <h4 className="font-medium text-gray-800">{cert.name}</h4>
                                    <div className="text-xs text-gray-500">{cert.issuer}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Template1;
