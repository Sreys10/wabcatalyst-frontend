const { SCORING_WEIGHTS, GRADE_THRESHOLDS, REQUIRED_FIELDS, COMMON_KEYWORDS } = require('../config/atsConfig');

/**
 * Calculate ATS score based on profile data
 * @param {Object} profileData - User profile data
 * @param {Object} llmAnalysis - Analysis from LLM (optional, for hybrid approach)
 * @returns {Object} - Score breakdown and grade
 */
const calculateATSScore = (profileData, llmAnalysis = null) => {
    // If LLM analysis is available, use it as primary source
    if (llmAnalysis && llmAnalysis.atsScore) {
        return {
            total: llmAnalysis.atsScore.total,
            breakdown: llmAnalysis.atsScore.breakdown,
            grade: llmAnalysis.atsScore.grade,
            reasoning: llmAnalysis.atsScore.reasoning,
            source: 'llm',
        };
    }

    // Fallback: Calculate score locally
    const scores = {
        completeness: calculateCompletenessScore(profileData),
        skills: calculateSkillsScore(profileData),
        experience: calculateExperienceScore(profileData),
        education: calculateEducationScore(profileData),
        keywords: calculateKeywordScore(profileData),
    };

    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const grade = getGrade(total);

    return {
        total: Math.round(total),
        breakdown: scores,
        grade,
        reasoning: 'Calculated using rule-based scoring system',
        source: 'local',
    };
};

/**
 * Calculate completeness score (0-25 points)
 */
const calculateCompletenessScore = (profileData) => {
    let score = 0;
    const maxScore = SCORING_WEIGHTS.COMPLETENESS;

    // Personal information (10 points)
    if (profileData.personal) {
        const personalFields = REQUIRED_FIELDS.personal;
        const filledFields = personalFields.filter(field =>
            profileData.personal[field] && profileData.personal[field].trim() !== ''
        ).length;
        score += (filledFields / personalFields.length) * 10;
    }

    // Photo (5 points)
    if (profileData.personal?.photo) {
        score += 5;
    }

    // Professional summary (5 points)
    if (profileData.summary?.bio && profileData.summary.bio.trim().length >= 50) {
        score += 5;
    }

    // Job titles (5 points)
    if (profileData.summary?.jobTitles && profileData.summary.jobTitles.trim() !== '') {
        score += 5;
    }

    return Math.min(score, maxScore);
};

/**
 * Calculate skills score (0-25 points)
 */
const calculateSkillsScore = (profileData) => {
    let score = 0;
    const maxScore = SCORING_WEIGHTS.SKILLS;

    if (!profileData.skills) return 0;

    // Primary skills (10 points)
    if (profileData.skills.primary && profileData.skills.primary.trim() !== '') {
        const skillCount = profileData.skills.primary.split(',').filter(s => s.trim()).length;
        score += Math.min(skillCount * 2, 10);
    }

    // Tools & technologies (8 points)
    if (profileData.skills.tools && profileData.skills.tools.trim() !== '') {
        const toolCount = profileData.skills.tools.split(',').filter(t => t.trim()).length;
        score += Math.min(toolCount * 1.5, 8);
    }

    // Soft skills (4 points)
    if (profileData.skills.soft && profileData.skills.soft.trim() !== '') {
        const softSkillCount = profileData.skills.soft.split(',').filter(s => s.trim()).length;
        score += Math.min(softSkillCount, 4);
    }

    // Bonus: Skills diversity (3 points)
    const hasAllSkillTypes = profileData.skills.primary && profileData.skills.tools && profileData.skills.soft;
    if (hasAllSkillTypes) {
        score += 3;
    }

    return Math.min(score, maxScore);
};

/**
 * Calculate experience score (0-20 points)
 */
const calculateExperienceScore = (profileData) => {
    let score = 0;
    const maxScore = SCORING_WEIGHTS.EXPERIENCE;

    if (!profileData.experience || profileData.experience.length === 0) {
        return 0;
    }

    // Has experience entries (8 points)
    const experienceCount = profileData.experience.length;
    score += Math.min(experienceCount * 4, 8);

    // Quality of descriptions (6 points)
    const descriptionsScore = profileData.experience.reduce((sum, exp) => {
        if (exp.description && exp.description.trim().length > 50) {
            return sum + 2;
        }
        return sum;
    }, 0);
    score += Math.min(descriptionsScore, 6);

    // Complete entries (4 points)
    const completeEntries = profileData.experience.filter(exp =>
        exp.title && exp.company && exp.startDate && exp.description
    ).length;
    score += Math.min(completeEntries * 2, 4);

    // Career progression (2 points)
    if (experienceCount >= 2) {
        score += 2;
    }

    return Math.min(score, maxScore);
};

/**
 * Calculate education score (0-15 points)
 */
const calculateEducationScore = (profileData) => {
    let score = 0;
    const maxScore = SCORING_WEIGHTS.EDUCATION;

    // Education entries (8 points)
    if (profileData.education && profileData.education.length > 0) {
        score += Math.min(profileData.education.length * 4, 8);
    }

    // Certifications (5 points)
    if (profileData.certifications && profileData.certifications.length > 0) {
        score += Math.min(profileData.certifications.length * 2.5, 5);
    }

    // Projects (2 points - shows continuous learning)
    if (profileData.projects && profileData.projects.length > 0) {
        score += 2;
    }

    return Math.min(score, maxScore);
};

/**
 * Calculate keyword optimization score (0-15 points)
 */
const calculateKeywordScore = (profileData) => {
    let score = 0;
    const maxScore = SCORING_WEIGHTS.KEYWORDS;

    // Combine all text fields
    const allText = [
        profileData.summary?.bio || '',
        ...(profileData.experience || []).map(exp => exp.description || ''),
        ...(profileData.projects || []).map(proj => proj.description || ''),
    ].join(' ').toLowerCase();

    // Check for action verbs (6 points)
    const actionVerbsFound = COMMON_KEYWORDS.filter(keyword =>
        allText.includes(keyword.toLowerCase())
    ).length;
    score += Math.min(actionVerbsFound * 0.5, 6);

    // Check for quantifiable achievements (3 points)
    const hasNumbers = /\d+/.test(allText);
    const hasPercentage = /%/.test(allText);
    if (hasNumbers) score += 1.5;
    if (hasPercentage) score += 1.5;

    // Industry keywords in skills (4 points)
    if (profileData.skills?.primary) {
        const skillKeywords = profileData.skills.primary.split(',').length;
        score += Math.min(skillKeywords * 0.5, 4);
    }

    // Bio quality (2 points)
    if (profileData.summary?.bio && profileData.summary.bio.length >= 100) {
        score += 2;
    }

    return Math.min(score, maxScore);
};

/**
 * Get letter grade based on score
 */
const getGrade = (score) => {
    if (score >= GRADE_THRESHOLDS.A_PLUS) return 'A+';
    if (score >= GRADE_THRESHOLDS.A) return 'A';
    if (score >= GRADE_THRESHOLDS.B_PLUS) return 'B+';
    if (score >= GRADE_THRESHOLDS.B) return 'B';
    if (score >= GRADE_THRESHOLDS.C_PLUS) return 'C+';
    if (score >= GRADE_THRESHOLDS.C) return 'C';
    if (score >= GRADE_THRESHOLDS.D) return 'D';
    return 'F';
};

/**
 * Calculate percentile (simplified)
 */
const calculatePercentile = (score) => {
    // Simplified percentile calculation
    // In production, this would compare against database of all scores
    return Math.min(Math.round(score), 100);
};

module.exports = {
    calculateATSScore,
    calculateCompletenessScore,
    calculateSkillsScore,
    calculateExperienceScore,
    calculateEducationScore,
    calculateKeywordScore,
    getGrade,
    calculatePercentile,
};
