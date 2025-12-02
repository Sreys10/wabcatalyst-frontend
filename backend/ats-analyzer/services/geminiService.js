const { GoogleGenerativeAI } = require('@google/generative-ai');
const { ATS_ANALYSIS_PROMPT } = require('../prompts/atsAnalysisPrompt');
const { LLM_CONFIG } = require('../config/atsConfig');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyze profile using Gemini AI
 * @param {string} formattedProfile - Formatted profile text
 * @param {string} targetRoles - Target job roles
 * @returns {Promise<Object>} - Parsed ATS analysis result
 */
const analyzeProfile = async (formattedProfile, targetRoles) => {
    try {
        // Get the model
        const model = genAI.getGenerativeModel({
            model: LLM_CONFIG.MODEL,
            generationConfig: {
                temperature: LLM_CONFIG.TEMPERATURE,
                maxOutputTokens: LLM_CONFIG.MAX_TOKENS,
            },
        });

        // Generate the prompt
        const prompt = ATS_ANALYSIS_PROMPT(formattedProfile, targetRoles);

        // Call the API
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse the JSON response
        const parsedResult = parseGeminiResponse(text);

        return parsedResult;
    } catch (error) {
        console.error('Error analyzing profile with Gemini:', error);
        throw new Error(`Gemini AI analysis failed: ${error.message}`);
    }
};

/**
 * Parse Gemini response and extract JSON
 * @param {string} responseText - Raw response from Gemini
 * @returns {Object} - Parsed JSON object
 */
const parseGeminiResponse = (responseText) => {
    try {
        // Remove markdown code blocks if present
        let cleanedText = responseText.trim();

        // Remove ```json and ``` if present
        if (cleanedText.startsWith('```json')) {
            cleanedText = cleanedText.replace(/^```json\n/, '').replace(/\n```$/, '');
        } else if (cleanedText.startsWith('```')) {
            cleanedText = cleanedText.replace(/^```\n/, '').replace(/\n```$/, '');
        }

        // Parse JSON
        const parsed = JSON.parse(cleanedText);

        // Validate structure
        if (!parsed.atsScore || !parsed.suggestions) {
            throw new Error('Invalid response structure from Gemini');
        }

        return parsed;
    } catch (error) {
        console.error('Error parsing Gemini response:', error);
        console.error('Raw response:', responseText);
        throw new Error(`Failed to parse Gemini response: ${error.message}`);
    }
};

/**
 * Retry logic for API calls
 * @param {Function} fn - Function to retry
 * @param {number} retries - Number of retries
 * @returns {Promise<any>} - Result of the function
 */
const retryWithBackoff = async (fn, retries = LLM_CONFIG.MAX_RETRIES) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === retries - 1) throw error;

            // Exponential backoff: 1s, 2s, 4s
            const delay = Math.pow(2, i) * 1000;
            console.log(`Retry attempt ${i + 1} after ${delay}ms`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};

/**
 * Analyze profile with retry logic
 * @param {string} formattedProfile - Formatted profile text
 * @param {string} targetRoles - Target job roles
 * @returns {Promise<Object>} - Parsed ATS analysis result
 */
const analyzeProfileWithRetry = async (formattedProfile, targetRoles) => {
    return retryWithBackoff(() => analyzeProfile(formattedProfile, targetRoles));
};

module.exports = {
    analyzeProfile,
    analyzeProfileWithRetry,
    parseGeminiResponse,
};
