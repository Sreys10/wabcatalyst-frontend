// ATS Analyzer Configuration
module.exports = {
    // Scoring weights (total: 100)
    SCORING_WEIGHTS: {
        COMPLETENESS: 25,
        SKILLS: 25,
        EXPERIENCE: 20,
        EDUCATION: 15,
        KEYWORDS: 15,
    },

    // Cache settings
    CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours in milliseconds

    // LLM settings
    LLM_CONFIG: {
        MODEL: 'gemini-1.5-flash', // Use flash for cost efficiency
        TEMPERATURE: 0.3, // Low temperature for consistent scoring
        MAX_TOKENS: 2000,
        MAX_RETRIES: 3,
    },

    // Rate limiting
    RATE_LIMIT: {
        MAX_REQUESTS_PER_DAY: 10,
        WINDOW_MS: 24 * 60 * 60 * 1000, // 24 hours
    },

    // Scoring thresholds
    GRADE_THRESHOLDS: {
        A_PLUS: 95,
        A: 90,
        B_PLUS: 85,
        B: 80,
        C_PLUS: 75,
        C: 70,
        D: 60,
    },

    // Required fields for completeness
    REQUIRED_FIELDS: {
        personal: ['fullName', 'email', 'phone', 'location'],
        summary: ['bio', 'jobTitles'],
        skills: ['primary'],
        experience: 1, // Minimum entries
        education: 1,
    },

    // Industry keywords (can be expanded)
    COMMON_KEYWORDS: [
        'developed', 'managed', 'led', 'implemented', 'designed',
        'created', 'improved', 'optimized', 'achieved', 'delivered',
        'collaborated', 'coordinated', 'analyzed', 'built', 'launched',
    ],
};
