import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

const Template2 = ({ data }) => {
    const { personal, summary, skills, experience, education, projects, certifications } = data;

    return (
        <div className="w-[210mm] min-h-[297mm] bg-white p-12 text-gray-800 shadow-lg print:shadow-none">
            {/* Header */}
            <div className="border-b-4 border-green-700 pb-6 mb-8">
                <h1 className="text-5xl font-bold text-gray-900 mb-2 uppercase tracking-tight">{personal.fullName}</h1>
                <h2 className="text-xl text-green-700 font-semibold mb-4">{summary.jobTitles ? summary.jobTitles.split(',')[0] : 'Professional'}</h2>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 font-medium">
                    {personal.email && (
                        <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4 text-green-700" />
                            <span>{personal.email}</span>
                        </div>
                    )}
                    {personal.phone && (
                        <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4 text-green-700" />
                            <span>{personal.phone}</span>
                        </div>
                    )}
                    {personal.location && (
                        <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-green-700" />
                            <span>{personal.location}</span>
                        </div>
                    )}
                    {personal.linkedin && (
                        <div className="flex items-center gap-1">
                            <Linkedin className="w-4 h-4 text-green-700" />
                            <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-green-700">LinkedIn</a>
                        </div>
                    )}
                </div>
            </div>

            {/* Summary */}
            <div className="mb-8">
                <h3 className="text-lg font-bold uppercase border-b-2 border-gray-200 mb-3 pb-1">Summary</h3>
                <p className="text-sm leading-relaxed text-gray-700">
                    {summary.bio}
                </p>
            </div>

            {/* Skills */}
            <div className="mb-8">
                <h3 className="text-lg font-bold uppercase border-b-2 border-gray-200 mb-3 pb-1">Skills</h3>
                <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                    {skills.primary && (
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-900 mb-1">Core Competencies</span>
                            <span className="text-gray-700">{skills.primary}</span>
                        </div>
                    )}
                    {skills.tools && (
                        <div className="flex flex-col">
                            <span className="font-bold text-gray-900 mb-1">Tools & Software</span>
                            <span className="text-gray-700">{skills.tools}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Experience */}
            <div className="mb-8">
                <h3 className="text-lg font-bold uppercase border-b-2 border-gray-200 mb-4 pb-1">Experience</h3>
                <div className="space-y-6">
                    {experience.map((exp, i) => (
                        <div key={i}>
                            <div className="flex justify-between items-baseline mb-1">
                                <h4 className="text-lg font-bold text-gray-800">{exp.title}</h4>
                                <span className="text-sm font-medium text-green-700">{exp.company}</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mb-2">
                                <span>{exp.startDate} - {exp.endDate}</span>
                                <span>{exp.location}</span>
                            </div>
                            <p className="text-sm text-gray-700 whitespace-pre-line">{exp.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Education */}
            <div className="mb-8">
                <h3 className="text-lg font-bold uppercase border-b-2 border-gray-200 mb-4 pb-1">Education</h3>
                <div className="space-y-4">
                    {education.map((edu, i) => (
                        <div key={i}>
                            <h4 className="font-bold text-gray-800">{edu.degree}</h4>
                            <div className="text-green-700 font-medium text-sm">{edu.institution}</div>
                            <div className="text-xs text-gray-500">{edu.year}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Projects & Certifications Grid */}
            <div className="grid grid-cols-2 gap-8">
                {projects && projects.length > 0 && (
                    <div>
                        <h3 className="text-lg font-bold uppercase border-b-2 border-gray-200 mb-3 pb-1">Projects</h3>
                        <div className="space-y-3">
                            {projects.map((proj, i) => (
                                <div key={i}>
                                    <h4 className="font-bold text-sm text-gray-800">{proj.title}</h4>
                                    <p className="text-xs text-gray-600 line-clamp-2">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {certifications && certifications.length > 0 && (
                    <div>
                        <h3 className="text-lg font-bold uppercase border-b-2 border-gray-200 mb-3 pb-1">Certifications</h3>
                        <div className="space-y-3">
                            {certifications.map((cert, i) => (
                                <div key={i}>
                                    <h4 className="font-bold text-sm text-gray-800">{cert.name}</h4>
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

export default Template2;
