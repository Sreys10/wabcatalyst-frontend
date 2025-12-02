/**
 * Generate improvement suggestions based on profile analysis
 * @param {Object} profileData - User profile data
 * @param {Object} scoreBreakdown - Score breakdown from calculator
 * @param {Object} llmSuggestions - Suggestions from LLM (optional)
 * @returns {Object} - Categorized suggestions
 */
const generateSuggestions = (profileData, scoreBreakdown, llmSuggestions = null) => {
    // If LLM suggestions available, use them as primary source
    if (llmSuggestions) {
        return llmSuggestions;
    }

    // Fallback: Generate rule-based suggestions
    const suggestions = {
        critical: [],
        improvements: [],
        tips: [],
    };

    // Check completeness
    if (scoreBreakdown.completeness < 15) {
        suggestions.critical.push({
            issue: 'Incomplete profile information',
            action: 'Fill in all required fields: name, email, phone, and location',
            impact: 'High',
            priority: 1,
        });
    }

    if (!profileData.personal?.photo) {
        suggestions.critical.push({
            issue: 'Missing professional photo',
            action: 'Upload a professional headshot to increase profile credibility',
            impact: 'High',
            priority: 2,
        });
    }

    if (!profileData.summary?.bio || profileData.summary.bio.length < 50) {
        suggestions.critical.push({
            issue: 'Missing or insufficient professional summary',
            action: 'Add a 50-100 word bio highlighting your expertise and career goals',
            impact: 'High',
            priority: 1,
        });
    }

    // Check skills
    if (scoreBreakdown.skills < 15) {
        suggestions.improvements.push({
            area: 'Skills section',
            suggestion: 'Add more relevant skills. Include at least 5 primary skills, 3 tools, and 3 soft skills',
            impact: 'Medium',
            priority: 2,
        });
    }

    if (!profileData.skills?.soft || profileData.skills.soft.trim() === '') {
        suggestions.improvements.push({
            area: 'Soft skills',
            suggestion: 'Add soft skills like Leadership, Communication, Problem Solving, Teamwork',
            impact: 'Medium',
            priority: 3,
        });
    }

    // Check experience
    if (!profileData.experience || profileData.experience.length === 0) {
        suggestions.critical.push({
            issue: 'No work experience listed',
            action: 'Add at least one work experience entry with detailed description',
            impact: 'High',
            priority: 1,
        });
    } else if (scoreBreakdown.experience < 12) {
        const missingDescriptions = profileData.experience.filter(exp =>
            !exp.description || exp.description.length < 50
        );

        if (missingDescriptions.length > 0) {
            suggestions.improvements.push({
                area: 'Work experience descriptions',
                suggestion: 'Expand your work experience descriptions. Include specific achievements, responsibilities, and quantifiable results',
                impact: 'High',
                priority: 2,
            });
        }
    }

    // Check education
    if (!profileData.education || profileData.education.length === 0) {
        suggestions.improvements.push({
            area: 'Education',
            suggestion: 'Add your educational background to strengthen your profile',
            impact: 'Medium',
            priority: 3,
        });
    }

    if (!profileData.certifications || profileData.certifications.length === 0) {
        suggestions.tips.push({
            area: 'Certifications',
            suggestion: 'Consider adding relevant certifications to demonstrate continuous learning',
            impact: 'Low',
            priority: 4,
        });
    }

    // Check keywords
    if (scoreBreakdown.keywords < 8) {
        suggestions.improvements.push({
            area: 'Keyword optimization',
            suggestion: 'Use action verbs (developed, managed, led, implemented) and include quantifiable achievements in your descriptions',
            impact: 'Medium',
            priority: 2,
        });
    }

    // Check projects
    if (!profileData.projects || profileData.projects.length === 0) {
        suggestions.tips.push({
            area: 'Projects',
            suggestion: 'Add personal or professional projects to showcase your practical skills',
            impact: 'Low',
            priority: 4,
        });
    }

    // General tips
    suggestions.tips.push({
        area: 'Profile optimization',
        suggestion: 'Tailor your profile to match your target job titles. Use industry-specific keywords',
        impact: 'Low',
        priority: 5,
    });

    return suggestions;
};

/**
 * Generate keyword recommendations based on target roles
 * @param {string} targetRoles - Target job titles
 * @returns {Array<string>} - Recommended keywords
 */
const generateKeywordRecommendations = (targetRoles) => {
    const keywords = [];

    if (!targetRoles) {
        return [
            'developed', 'managed', 'led', 'implemented', 'designed',
            'created', 'improved', 'optimized', 'achieved', 'delivered',
        ];
    }

    const rolesLower = targetRoles.toLowerCase();

    // Developer keywords
    if (rolesLower.includes('developer') || rolesLower.includes('engineer')) {
        keywords.push('developed', 'implemented', 'designed', 'built', 'deployed', 'optimized', 'debugged', 'tested');
    }

    // Manager keywords
    if (rolesLower.includes('manager') || rolesLower.includes('lead')) {
        keywords.push('managed', 'led', 'coordinated', 'supervised', 'mentored', 'strategized', 'planned');
    }

    // Designer keywords
    if (rolesLower.includes('designer') || rolesLower.includes('ux') || rolesLower.includes('ui')) {
        keywords.push('designed', 'created', 'prototyped', 'wireframed', 'collaborated', 'researched');
    }

    // Analyst keywords
    if (rolesLower.includes('analyst') || rolesLower.includes('data')) {
        keywords.push('analyzed', 'evaluated', 'researched', 'reported', 'visualized', 'interpreted');
    }

    // Sales keywords
    if (rolesLower.includes('sales') || rolesLower.includes('business development')) {
        keywords.push('achieved', 'exceeded', 'negotiated', 'closed', 'generated', 'prospected');
    }

    // Default keywords if none matched
    if (keywords.length === 0) {
        keywords.push('developed', 'managed', 'led', 'implemented', 'achieved', 'delivered');
    }

    return [...new Set(keywords)]; // Remove duplicates
};

/**
 * Identify strengths from profile
 * @param {Object} profileData - User profile data
 * @param {Object} scoreBreakdown - Score breakdown
 * @returns {Array<string>} - List of strengths
 */
const identifyStrengths = (profileData, scoreBreakdown) => {
    const strengths = [];

    if (scoreBreakdown.completeness >= 20) {
        strengths.push('Complete and well-structured profile');
    }

    if (scoreBreakdown.skills >= 20) {
        strengths.push('Strong and diverse skill set');
    }

    if (scoreBreakdown.experience >= 15) {
        strengths.push('Solid work experience with detailed descriptions');
    }

    if (scoreBreakdown.education >= 12) {
        strengths.push('Good educational background and certifications');
    }

    if (scoreBreakdown.keywords >= 12) {
        strengths.push('Well-optimized with relevant keywords');
    }

    if (profileData.projects && profileData.projects.length >= 2) {
        strengths.push('Demonstrates practical skills through projects');
    }

    if (strengths.length === 0) {
        strengths.push('Profile has been created and is ready for improvement');
    }

    return strengths;
};

/**
 * Identify weaknesses from profile
 * @param {Object} profileData - User profile data
 * @param {Object} scoreBreakdown - Score breakdown
 * @returns {Array<string>} - List of weaknesses
 */
const identifyWeaknesses = (profileData, scoreBreakdown) => {
    const weaknesses = [];

    if (scoreBreakdown.completeness < 15) {
        weaknesses.push('Incomplete profile information');
    }

    if (scoreBreakdown.skills < 15) {
        weaknesses.push('Limited skills listed');
    }

    if (scoreBreakdown.experience < 12) {
        weaknesses.push('Work experience needs more detail');
    }

    if (scoreBreakdown.education < 10) {
        weaknesses.push('Educational background could be expanded');
    }

    if (scoreBreakdown.keywords < 8) {
        weaknesses.push('Lacks keyword optimization for ATS');
    }

    if (!profileData.projects || profileData.projects.length === 0) {
        weaknesses.push('No projects listed to showcase skills');
    }

    if (weaknesses.length === 0) {
        weaknesses.push('Minor optimizations possible for maximum ATS score');
    }

    return weaknesses;
};

module.exports = {
    generateSuggestions,
    generateKeywordRecommendations,
    identifyStrengths,
    identifyWeaknesses,
};
