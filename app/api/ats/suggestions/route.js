import { getServerSession } from 'next-auth';
import { authOptions } from '@lib/auth';
import connectDB from '@lib/db';
import Profile from '@models/Profile';
import ATSAnalysis from '@models/ATSAnalysis';

/**
 * GET /api/ats/suggestions
 * Get improvement suggestions for current user
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
                data: {
                    suggestions: {
                        critical: [],
                        improvements: [],
                        tips: [],
                        keywords: [],
                    },
                    message: 'No analysis found. Please calculate your ATS score first.',
                },
            });
        }

        return Response.json({
            success: true,
            data: {
                suggestions: analysis.suggestions,
                score: analysis.score.total,
                analyzedAt: analysis.analyzedAt,
                isFresh: analysis.isFresh(),
            },
        });

    } catch (error) {
        console.error('Error fetching suggestions:', error);
        return Response.json(
            {
                success: false,
                error: 'Failed to fetch suggestions',
                details: error.message
            },
            { status: 500 }
        );
    }
}
