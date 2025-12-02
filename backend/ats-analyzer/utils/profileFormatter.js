// Profile Formatter - Convert profile data to LLM-friendly format
const formatProfileForAnalysis = (profileData) => {
    if (!profileData) {
        throw new Error('Profile data is required');
    }

    const sections = [];

    // Personal Information
    if (profileData.personal) {
        sections.push('=== PERSONAL INFORMATION ===');
        sections.push(`Name: ${profileData.personal.fullName || 'Not provided'}`);
        sections.push(`Email: ${profileData.personal.email || 'Not provided'}`);
        sections.push(`Phone: ${profileData.personal.phone || 'Not provided'}`);
        sections.push(`Location: ${profileData.personal.location || 'Not provided'}`);
        sections.push(`LinkedIn: ${profileData.personal.linkedin || 'Not provided'}`);
        sections.push(`Portfolio: ${profileData.personal.portfolio || 'Not provided'}`);
        sections.push(`Photo: ${profileData.personal.photo ? 'Uploaded' : 'Not uploaded'}`);
        sections.push('');
    }

    // Professional Summary
    if (profileData.summary) {
        sections.push('=== PROFESSIONAL SUMMARY ===');
        sections.push(`Bio: ${profileData.summary.bio || 'Not provided'}`);
        sections.push(`Target Job Titles: ${profileData.summary.jobTitles || 'Not specified'}`);
        sections.push('');
    }

    // Skills
    if (profileData.skills) {
        sections.push('=== SKILLS ===');
        sections.push(`Primary Skills: ${profileData.skills.primary || 'Not provided'}`);
        sections.push(`Tools & Technologies: ${profileData.skills.tools || 'Not provided'}`);
        sections.push(`Soft Skills: ${profileData.skills.soft || 'Not provided'}`);
        sections.push('');
    }

    // Work Experience
    if (profileData.experience && profileData.experience.length > 0) {
        sections.push('=== WORK EXPERIENCE ===');
        profileData.experience.forEach((exp, index) => {
            sections.push(`Experience ${index + 1}:`);
            sections.push(`  Title: ${exp.title || 'Not provided'}`);
            sections.push(`  Company: ${exp.company || 'Not provided'}`);
            sections.push(`  Duration: ${exp.startDate || 'N/A'} to ${exp.endDate || 'Present'}`);
            sections.push(`  Location: ${exp.location || 'Not provided'}`);
            sections.push(`  Description: ${exp.description || 'Not provided'}`);
            sections.push('');
        });
    } else {
        sections.push('=== WORK EXPERIENCE ===');
        sections.push('No work experience provided');
        sections.push('');
    }

    // Education
    if (profileData.education && profileData.education.length > 0) {
        sections.push('=== EDUCATION ===');
        profileData.education.forEach((edu, index) => {
            sections.push(`Education ${index + 1}:`);
            sections.push(`  Degree: ${edu.degree || 'Not provided'}`);
            sections.push(`  Institution: ${edu.institution || 'Not provided'}`);
            sections.push(`  Year: ${edu.year || 'Not provided'}`);
            sections.push(`  Grade: ${edu.grade || 'Not provided'}`);
            sections.push('');
        });
    } else {
        sections.push('=== EDUCATION ===');
        sections.push('No education provided');
        sections.push('');
    }

    // Projects
    if (profileData.projects && profileData.projects.length > 0) {
        sections.push('=== PROJECTS ===');
        profileData.projects.forEach((proj, index) => {
            sections.push(`Project ${index + 1}:`);
            sections.push(`  Title: ${proj.title || 'Not provided'}`);
            sections.push(`  Description: ${proj.description || 'Not provided'}`);
            sections.push(`  Technologies: ${proj.technologies || 'Not provided'}`);
            sections.push(`  Link: ${proj.link || 'Not provided'}`);
            sections.push('');
        });
    }

    // Certifications
    if (profileData.certifications && profileData.certifications.length > 0) {
        sections.push('=== CERTIFICATIONS ===');
        profileData.certifications.forEach((cert, index) => {
            sections.push(`Certification ${index + 1}:`);
            sections.push(`  Name: ${cert.name || 'Not provided'}`);
            sections.push(`  Issuer: ${cert.issuer || 'Not provided'}`);
            sections.push('');
        });
    }

    // Job Preferences
    if (profileData.preferences) {
        sections.push('=== JOB PREFERENCES ===');
        sections.push(`Job Type: ${profileData.preferences.jobType || 'Not specified'}`);
        sections.push(`Preferred Location: ${profileData.preferences.location || 'Not specified'}`);
        sections.push(`Expected Salary: ${profileData.preferences.salary || 'Not specified'}`);
        sections.push('');
    }

    return sections.join('\n');
};

// Extract target roles from profile
const extractTargetRoles = (profileData) => {
    if (profileData?.summary?.jobTitles) {
        return profileData.summary.jobTitles;
    }
    return 'Not specified';
};

// Validate profile data
const validateProfileData = (profileData) => {
    if (!profileData) {
        return { valid: false, errors: ['Profile data is required'] };
    }

    const errors = [];

    if (!profileData.personal) {
        errors.push('Personal information is missing');
    }

    if (!profileData.summary) {
        errors.push('Professional summary is missing');
    }

    if (!profileData.skills) {
        errors.push('Skills information is missing');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
};

module.exports = {
    formatProfileForAnalysis,
    extractTargetRoles,
    validateProfileData,
};
