import { getServerSession } from 'next-auth';
import { authOptions } from '@lib/auth';
import connectDB from '@lib/db';
import Profile from '@models/Profile';
import ATSAnalysis from '@models/ATSAnalysis';
import { analyzeProfile } from '../../../../backend/ats-analyzer/index.js';

/**
 * POST /api/ats/calculate
 * Calculate ATS score for user profile
 */
export async function POST(req) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return Response.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Connect to database
        await connectDB();

        // Get user profile
        const profile = await Profile.findOne({ email: session.user.email });
        if (!profile) {
            return Response.json(
                { success: false, error: 'Profile not found' },
                { status: 404 }
            );
        }

        // Check for recent analysis (< 24 hours)
        const existingAnalysis = await ATSAnalysis.getLatestForUser(profile._id);
        if (existingAnalysis && ATSAnalysis.isFresh(existingAnalysis)) {
            return Response.json({
                success: true,
                data: {
                    score: existingAnalysis.score,
                    suggestions: existingAnalysis.suggestions,
                    strengths: existingAnalysis.strengths,
                    weaknesses: existingAnalysis.weaknesses,
                    industryInsights: existingAnalysis.industryInsights,
                    analyzedAt: existingAnalysis.analyzedAt,
                    cached: true,
                },
            });
        }

        // Analyze profile
        const analysisResult = await analyzeProfile(profile, {
            saveSnapshot: true,
        });

        // Save to database
        const atsAnalysis = new ATSAnalysis({
            userId: profile._id,
            score: analysisResult.score,
            suggestions: analysisResult.suggestions,
            strengths: analysisResult.strengths,
            weaknesses: analysisResult.weaknesses,
            industryInsights: analysisResult.industryInsights,
            analyzedAt: analysisResult.analyzedAt,
            profileSnapshot: analysisResult.profileSnapshot,
            source: analysisResult.score.source || 'hybrid',
        });

        await atsAnalysis.save();

        return Response.json({
            success: true,
            data: {
                score: analysisResult.score,
                suggestions: analysisResult.suggestions,
                strengths: analysisResult.strengths,
                weaknesses: analysisResult.weaknesses,
                industryInsights: analysisResult.industryInsights,
                analyzedAt: analysisResult.analyzedAt,
                cached: false,
            },
        });

    } catch (error) {
        console.error('Error calculating ATS score:', error);
        return Response.json(
            {
                success: false,
                error: 'Failed to calculate ATS score',
                details: error.message
            },
            { status: 500 }
        );
    }
}

/**
 * GET /api/ats/calculate
 * Get cached ATS score for current user
 */
export async function GET(req) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return Response.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Connect to database
        await connectDB();

        // Get user profile
        const profile = await Profile.findOne({ email: session.user.email });
        if (!profile) {
            return Response.json(
                { success: false, error: 'Profile not found' },
                { status: 404 }
            );
        }

        // Get latest analysis
        const analysis = await ATSAnalysis.getLatestForUser(profile._id);

        if (!analysis) {
            return Response.json({
                success: true,
                data: null,
                message: 'No analysis found. Please calculate your ATS score.',
            });
        }

        return Response.json({
            success: true,
            data: {
                score: analysis.score,
                suggestions: analysis.suggestions,
                strengths: analysis.strengths,
                weaknesses: analysis.weaknesses,
                industryInsights: analysis.industryInsights,
                analyzedAt: analysis.analyzedAt,
                isFresh: analysis.isFresh(),
            },
        });

    } catch (error) {
        console.error('Error fetching ATS score:', error);
        return Response.json(
            {
                success: false,
                error: 'Failed to fetch ATS score',
                details: error.message
            },
            { status: 500 }
        );
    }
}
