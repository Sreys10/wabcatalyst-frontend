// Main ATS Analyzer Entry Point
const { formatProfileForAnalysis, extractTargetRoles, validateProfileData } = require('./utils/profileFormatter');
const { analyzeProfileWithRetry } = require('./services/geminiService');
const { calculateATSScore, calculatePercentile } = require('./services/atsCalculator');
const {
    generateSuggestions,
    generateKeywordRecommendations,
    identifyStrengths,
    identifyWeaknesses
} = require('./services/suggestionGenerator');

/**
 * Main function to analyze profile and calculate ATS score
 * @param {Object} profileData - User profile data
 * @param {Object} options - Analysis options
 * @returns {Promise<Object>} - Complete ATS analysis
 */
const analyzeProfile = async (profileData, options = {}) => {
    try {
        // Validate profile data
        const validation = validateProfileData(profileData);
        if (!validation.valid) {
            throw new Error(`Invalid profile data: ${validation.errors.join(', ')}`);
        }

        // Format profile for LLM
        const formattedProfile = formatProfileForAnalysis(profileData);
        const targetRoles = extractTargetRoles(profileData);

        let llmAnalysis = null;
        let scoreResult = null;
        let suggestions = null;

        // Try LLM analysis first (if not disabled)
        if (!options.skipLLM) {
            try {
                llmAnalysis = await analyzeProfileWithRetry(formattedProfile, targetRoles);

                // Use LLM results
                scoreResult = {
                    total: llmAnalysis.atsScore.total,
                    breakdown: llmAnalysis.atsScore.breakdown,
                    grade: llmAnalysis.atsScore.grade,
                    percentile: calculatePercentile(llmAnalysis.atsScore.total),
                    reasoning: llmAnalysis.atsScore.reasoning || 'AI-powered analysis',
                    source: 'llm',
                };

                suggestions = llmAnalysis.suggestions;

            } catch (llmError) {
                console.error('LLM analysis failed, falling back to local calculation:', llmError);
                // Fall through to local calculation
            }
        }

        // Fallback to local calculation if LLM failed or was skipped
        if (!scoreResult) {
            scoreResult = calculateATSScore(profileData);
            scoreResult.percentile = calculatePercentile(scoreResult.total);

            suggestions = generateSuggestions(profileData, scoreResult.breakdown);
            suggestions.keywords = generateKeywordRecommendations(targetRoles);
        }

        // Identify strengths and weaknesses
        const strengths = llmAnalysis?.strengths || identifyStrengths(profileData, scoreResult.breakdown);
        const weaknesses = llmAnalysis?.weaknesses || identifyWeaknesses(profileData, scoreResult.breakdown);
        const industryInsights = llmAnalysis?.industryInsights || 'Complete your profile to receive personalized industry insights.';

        // Compile final result
        const result = {
            score: scoreResult,
            suggestions,
            strengths,
            weaknesses,
            industryInsights,
            analyzedAt: new Date(),
            profileSnapshot: options.saveSnapshot ? profileData : null,
        };

        return result;

    } catch (error) {
        console.error('Error in analyzeProfile:', error);
        throw error;
    }
};

/**
 * Quick score calculation (local only, no LLM)
 * @param {Object} profileData - User profile data
 * @returns {Object} - Basic score information
 */
const quickScore = (profileData) => {
    try {
        const validation = validateProfileData(profileData);
        if (!validation.valid) {
            throw new Error(`Invalid profile data: ${validation.errors.join(', ')}`);
        }

        const scoreResult = calculateATSScore(profileData);
        scoreResult.percentile = calculatePercentile(scoreResult.total);

        return {
            score: scoreResult,
            analyzedAt: new Date(),
        };
    } catch (error) {
        console.error('Error in quickScore:', error);
        throw error;
    }
};

module.exports = {
    analyzeProfile,
    quickScore,
};
