import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/db';
import UserProfile from '@/models/UserProfile';
import ATSAnalysis from '@/models/ATSAnalysis';
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
        const profile = await UserProfile.findOne({ email: session.user.email });
        if (!profile) {
            return Response.json(
                { success: false, error: 'Profile not found' },
                { status: 404 }
            );
        }

        // Check for recent analysis (< 24 hours)
        const existingAnalysis = await ATSAnalysis.getLatestForUser(profile.userId);
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

        // Map UserProfile to the structure expected by analyzeProfile
        const mappedProfile = {
            personal: {
                fullName: profile.fullName,
                email: profile.email,
                phone: profile.phone,
                location: profile.location,
                linkedin: profile.linkedIn,
                portfolio: profile.portfolio,
                photo: profile.profileImage,
            },
            summary: {
                bio: profile.professionalSummary,
                jobTitles: profile.preferredRoles?.join(', '),
            },
            skills: {
                primary: profile.primarySkills?.join(', '),
                tools: profile.toolsAndTechnologies?.join(', '),
                soft: profile.softSkills?.join(', '),
            },
            experience: profile.workExperience?.map(exp => ({
                title: exp.jobTitle,
                company: exp.companyName,
                startDate: exp.startDate,
                endDate: exp.endDate,
                location: exp.location,
                description: exp.responsibilities?.join('\n'),
            })),
            education: profile.education?.map(edu => ({
                degree: edu.degree,
                institution: edu.institution,
                year: edu.endYear,
                grade: edu.cgpaOrPercentage,
            })),
            projects: profile.projects?.map(proj => ({
                title: proj.projectTitle,
                description: proj.description,
                technologies: proj.technologiesUsed?.join(', '),
                link: proj.projectLink,
            })),
            certifications: profile.certifications?.map(cert => ({
                name: cert.title,
                issuer: cert.issuer,
            })),
            preferences: {
                jobType: profile.preferredJobType?.join(', '),
                location: profile.preferredLocations?.join(', '),
                salary: profile.expectedSalary,
            },
        };

        // Analyze profile
        const analysisResult = await analyzeProfile(mappedProfile, {
            saveSnapshot: true,
        });

        // Save to database
        const atsAnalysis = new ATSAnalysis({
            userId: profile.userId,
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
        const profile = await UserProfile.findOne({ email: session.user.email });
        if (!profile) {
            return Response.json(
                { success: false, error: 'Profile not found' },
                { status: 404 }
            );
        }

        // Get latest analysis
        const analysis = await ATSAnalysis.getLatestForUser(profile.userId);

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
