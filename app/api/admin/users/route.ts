import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@lib/auth";
import connectDB from "@lib/db";
import UserProfile from "@models/UserProfile";

export async function GET() {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const session: any = await getServerSession(authOptions);

        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const users = await (UserProfile as any).find({}).lean();
        console.log("Fetched users count:", users.length);
        if (users.length > 0) {
            console.log("Sample user raw:", JSON.stringify(users[0], null, 2));
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedUsers = users.map((user: any) => ({
            _id: user._id,
            personal: {
                fullName: user.fullName || "",
                email: user.email || "",
                phone: user.phone || "",
                location: user.location || "",
                linkedin: user.linkedIn || "",
                portfolio: user.portfolio || "",
                photo: user.profileImage || ""
            },
            summary: {
                bio: user.professionalSummary || user.careerObjective || "",
                jobTitles: user.preferredRoles?.join(", ") || user.preferredJobRole || ""
            },
            skills: {
                primary: user.primarySkills?.join(", ") || "",
                tools: user.toolsAndTechnologies?.join(", ") || "",
                soft: user.softSkills?.join(", ") || ""
            },
            experience: user.workExperience?.map((exp: any) => ({
                title: exp.jobTitle,
                company: exp.companyName,
                startDate: exp.startDate,
                endDate: exp.endDate,
                location: exp.location,
                description: exp.responsibilities?.join(". ")
            })) || [],
            education: user.education?.map((edu: any) => ({
                degree: edu.degree,
                institution: edu.institution,
                year: edu.endYear,
                grade: edu.cgpaOrPercentage
            })) || [],
            projects: user.projects?.map((proj: any) => ({
                title: proj.projectTitle,
                description: proj.description,
                technologies: proj.technologiesUsed?.join(", "),
                link: proj.projectLink
            })) || [],
            certifications: user.certifications?.map((cert: any) => ({
                name: cert.title,
                issuer: cert.issuer
            })) || [],
            preferences: {
                jobType: user.preferredJobType?.join(", ") || user.jobType || "",
                roles: user.preferredRoles?.join(", ") || user.preferredJobRole || "",
                location: user.preferredLocations?.join(", ") || user.preferredLocation || "",
                salary: user.expectedSalary || "",
                noticePeriod: user.noticePeriod || ""
            }
        }));

        return NextResponse.json(formattedUsers);
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
