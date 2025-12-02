import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@lib/auth";
import connectDB from "@lib/db";
import UserProfile from "@models/UserProfile";
import ExcelJS from "exceljs";

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

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");

    worksheet.columns = [
      { header: "Full Name", key: "fullName", width: 20 },
      { header: "Email", key: "email", width: 25 },
      { header: "Phone", key: "phone", width: 15 },
      { header: "Location", key: "location", width: 20 },
      { header: "Bio", key: "bio", width: 30 },
      { header: "Job Titles", key: "jobTitles", width: 25 },
      { header: "Primary Skills", key: "primarySkills", width: 25 },
      { header: "Tools", key: "tools", width: 25 },
      { header: "Soft Skills", key: "softSkills", width: 25 },
      { header: "Experience", key: "experience", width: 40 },
      { header: "Education", key: "education", width: 40 },
      { header: "Projects", key: "projects", width: 40 },
      { header: "Certifications", key: "certifications", width: 30 },
      { header: "Job Type", key: "jobType", width: 15 },
      { header: "Preferred Roles", key: "preferredRoles", width: 20 },
      { header: "Preferred Location", key: "preferredLocation", width: 20 },
      { header: "Salary", key: "salary", width: 15 },
      { header: "Notice Period", key: "noticePeriod", width: 15 },
      { header: "LinkedIn", key: "linkedin", width: 25 },
      { header: "Portfolio", key: "portfolio", width: 25 },
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    users.forEach((user: any) => {
      worksheet.addRow({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        location: user.location || "",
        bio: user.professionalSummary || user.careerObjective || "",
        jobTitles: user.preferredRoles?.join(", ") || user.preferredJobRole || "",
        primarySkills: user.primarySkills?.join(", ") || "",
        tools: user.toolsAndTechnologies?.join(", ") || "",
        softSkills: user.softSkills?.join(", ") || "",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        experience: user.workExperience?.map((e: any) => `${e.jobTitle} at ${e.companyName}`).join("; ") || "",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        education: user.education?.map((e: any) => `${e.degree} from ${e.institution}`).join("; ") || "",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        projects: user.projects?.map((p: any) => p.projectTitle).join("; ") || "",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        certifications: user.certifications?.map((c: any) => c.title).join("; ") || "",
        jobType: user.preferredJobType?.join(", ") || user.jobType || "",
        preferredRoles: user.preferredRoles?.join(", ") || user.preferredJobRole || "",
        preferredLocation: user.preferredLocations?.join(", ") || user.preferredLocation || "",
        salary: user.expectedSalary || "",
        noticePeriod: user.noticePeriod || "",
        linkedin: user.linkedIn || "",
        portfolio: user.portfolio || "",
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="users.xlsx"',
      },
    });
  } catch (error) {
    console.error("Error exporting users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
