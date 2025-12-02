import mongoose from 'mongoose';

const ATSAnalysisSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        score: {
            total: {
                type: Number,
                required: true,
                min: 0,
                max: 100,
            },
            breakdown: {
                completeness: { type: Number, min: 0, max: 25 },
                skills: { type: Number, min: 0, max: 25 },
                experience: { type: Number, min: 0, max: 20 },
                education: { type: Number, min: 0, max: 15 },
                keywords: { type: Number, min: 0, max: 15 },
            },
            grade: {
                type: String,
                enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'],
            },
            percentile: {
                type: Number,
                min: 0,
                max: 100,
            },
            reasoning: String,
        },
        suggestions: {
            critical: [
                {
                    issue: String,
                    action: String,
                    impact: String,
                    priority: Number,
                },
            ],
            improvements: [
                {
                    area: String,
                    suggestion: String,
                    impact: String,
                    priority: Number,
                },
            ],
            tips: [
                {
                    area: String,
                    suggestion: String,
                    impact: String,
                    priority: Number,
                },
            ],
            keywords: [String],
        },
        strengths: [String],
        weaknesses: [String],
        industryInsights: String,
        analyzedAt: {
            type: Date,
            default: Date.now,
            index: true,
        },
        profileSnapshot: {
            type: mongoose.Schema.Types.Mixed,
            // Stores the profile version that was analyzed
        },
        source: {
            type: String,
            enum: ['llm', 'local', 'hybrid'],
            default: 'hybrid',
        },
        expiresAt: {
            type: Date,
            default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient queries
ATSAnalysisSchema.index({ userId: 1, analyzedAt: -1 });

// TTL index to auto-delete old analyses
ATSAnalysisSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method to get latest analysis for a user
ATSAnalysisSchema.statics.getLatestForUser = async function (userId) {
    return this.findOne({ userId })
        .sort({ analyzedAt: -1 })
        .exec();
};

// Static method to check if analysis is fresh (< 24 hours)
ATSAnalysisSchema.statics.isFresh = function (analysis) {
    if (!analysis) return false;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return analysis.analyzedAt > twentyFourHoursAgo;
};

// Instance method to check if this analysis is fresh
ATSAnalysisSchema.methods.isFresh = function () {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.analyzedAt > twentyFourHoursAgo;
};

export default mongoose.models.ATSAnalysis || mongoose.model('ATSAnalysis', ATSAnalysisSchema);
