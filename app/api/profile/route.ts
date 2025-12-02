import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import UserProfile from "@/models/UserProfile";
import User from "@/models/User";

export async function GET(req: Request) {
    try {
        await connectDB();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const session: any = await getServerSession(authOptions as any);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Find user profile by userId
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const userProfile = await (UserProfile as any).findOne({ userId: session.user.id });

        if (!userProfile) {
            // If no profile exists, return empty structure or 404. 
            // Since we want to allow editing, returning a default structure might be better, 
            // but the frontend handles mock data merge.
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        // Map UserProfile to frontend structure
        const mappedProfile = {
            personal: {
                fullName: userProfile.fullName || "",
                email: userProfile.email || "",
                phone: userProfile.phone || "",
                location: userProfile.location || "",
                linkedin: userProfile.linkedIn || "",
                portfolio: userProfile.portfolio || "",
                photo: userProfile.profileImage || "",
            },
            summary: {
                bio: userProfile.professionalSummary || "",
                jobTitles: userProfile.preferredRoles?.join(", ") || "",
            },
            skills: {
                primary: userProfile.primarySkills?.join(", ") || "",
                tools: userProfile.toolsAndTechnologies?.join(", ") || "",
                soft: userProfile.softSkills?.join(", ") || "",
            },
            experience: userProfile.workExperience?.map((exp: any) => ({
                id: exp._id || Math.random(), // Frontend needs ID
                title: exp.jobTitle || "",
                company: exp.companyName || "",
                startDate: exp.startDate || "",
                endDate: exp.endDate || "",
                location: exp.location || "",
                description: exp.responsibilities?.join("\n") || "", // Join array to string for textarea
            })) || [],
            education: userProfile.education?.map((edu: any) => ({
                id: edu._id || Math.random(),
                degree: edu.degree || "",
                institution: edu.institution || "",
                year: edu.endYear || "", // Map endYear to year
                grade: edu.cgpaOrPercentage || "",
            })) || [],
            projects: userProfile.projects?.map((proj: any) => ({
                id: proj._id || Math.random(),
                title: proj.projectTitle || "",
                description: proj.description || "",
                technologies: proj.technologiesUsed?.join(", ") || "",
                link: proj.projectLink || "",
            })) || [],
            certifications: userProfile.certifications?.map((cert: any) => ({
                id: cert._id || Math.random(),
                name: cert.title || "",
                issuer: cert.issuer || "",
            })) || [],
            preferences: {
                jobType: userProfile.preferredJobType?.join(", ") || "",
                roles: userProfile.preferredRoles?.join(", ") || "",
                location: userProfile.preferredLocations?.join(", ") || "",
                salary: userProfile.expectedSalary || "",
                noticePeriod: userProfile.noticePeriod || "",
            },
        };

        return NextResponse.json(mappedProfile);
    } catch (error) {
        console.error("Profile GET Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const session: any = await getServerSession(authOptions as any);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();

        // Map frontend structure back to UserProfile
        const userProfileData = {
            fullName: data.personal?.fullName,
            email: data.personal?.email,
            phone: data.personal?.phone,
            location: data.personal?.location,
            linkedIn: data.personal?.linkedin,
            portfolio: data.personal?.portfolio,
            profileImage: data.personal?.photo,

            professionalSummary: data.summary?.bio,
            preferredRoles: data.summary?.jobTitles?.split(",").map((s: string) => s.trim()).filter(Boolean),

            primarySkills: data.skills?.primary?.split(",").map((s: string) => s.trim()).filter(Boolean),
            toolsAndTechnologies: data.skills?.tools?.split(",").map((s: string) => s.trim()).filter(Boolean),
            softSkills: data.skills?.soft?.split(",").map((s: string) => s.trim()).filter(Boolean),

            workExperience: data.experience?.map((exp: any) => ({
                jobTitle: exp.title,
                companyName: exp.company,
                startDate: exp.startDate,
                endDate: exp.endDate,
                location: exp.location,
                responsibilities: exp.description?.split("\n").filter(Boolean),
            })),

            education: data.education?.map((edu: any) => ({
                degree: edu.degree,
                institution: edu.institution,
                endYear: edu.year,
                cgpaOrPercentage: edu.grade,
            })),

            projects: data.projects?.map((proj: any) => ({
                projectTitle: proj.title,
                description: proj.description,
                technologiesUsed: proj.technologies?.split(",").map((s: string) => s.trim()).filter(Boolean),
                projectLink: proj.link,
            })),

            certifications: data.certifications?.map((cert: any) => ({
                title: cert.name,
                issuer: cert.issuer,
            })),

            // Update preferences as well
            preferredJobType: data.preferences?.jobType?.split(",").map((s: string) => s.trim()).filter(Boolean),
            preferredLocations: data.preferences?.location?.split(",").map((s: string) => s.trim()).filter(Boolean),
            expectedSalary: data.preferences?.salary,
            noticePeriod: data.preferences?.noticePeriod,
        };

        // Upsert UserProfile
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const profile = await (UserProfile as any).findOneAndUpdate(
            { userId: session.user.id },
            {
                userId: session.user.id,
                ...userProfileData
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        return NextResponse.json({ success: true, profile });
    } catch (error) {
        console.error("Profile POST Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
