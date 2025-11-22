"use server";

import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { getServerSession } from "next-auth";
import { authOptions } from "@lib/auth";
import connectDB from "@lib/db";
import UserProfile from "@models/UserProfile";
import { toUserObjectId } from "@lib/profile";

const formatList = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) {
    return "Not provided";
  }
  return items.filter(Boolean).join(", ");
};

const buildPdfBuffer = (profile, userEmail) =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", (err) => reject(err));

    doc
      .fontSize(24)
      .fillColor("#111827")
      .text(profile.fullName || userEmail, { align: "left" });

    doc
      .moveDown(0.5)
      .fontSize(11)
      .fillColor("#6B7280")
      .text(
        [profile.email || userEmail, profile.phone, profile.location]
          .filter(Boolean)
          .join(" • ")
      );

    const addSection = (title) => {
      doc.moveDown().fontSize(14).fillColor("#EF4444").text(title.toUpperCase(), {
        underline: true,
      });
      doc.moveDown(0.3);
      doc.fontSize(11).fillColor("#111827");
    };

    if (profile.careerObjective) {
      addSection("Career Objective");
      doc.text(profile.careerObjective);
    }

    if (profile.primarySkills?.length) {
      addSection("Core Skills");
      doc.text(formatList(profile.primarySkills));
    }

    if (profile.workExperience?.length) {
      addSection("Professional Experience");
      profile.workExperience.forEach((exp) => {
        doc.font("Helvetica-Bold").text(`${exp.jobTitle} • ${exp.companyName}`);
        doc
          .font("Helvetica")
          .text(`${exp.startDate} – ${exp.isCurrentJob ? "Present" : exp.endDate}`);
        if (exp.responsibilities?.length) {
          exp.responsibilities.forEach((item) => doc.list([item]));
        }
        doc.moveDown(0.5);
      });
    }

    if (profile.education?.length) {
      addSection("Education");
      profile.education.forEach((edu) => {
        doc.font("Helvetica-Bold").text(`${edu.degree} • ${edu.institution}`);
        doc
          .font("Helvetica")
          .text(`${edu.startYear} – ${edu.endYear} • ${edu.specialization || ""}`);
        doc.moveDown(0.5);
      });
    }

    if (profile.projects?.length) {
      addSection("Projects");
      profile.projects.slice(0, 3).forEach((project) => {
        doc.font("Helvetica-Bold").text(project.projectTitle);
        doc.font("Helvetica").text(project.description || "Description coming soon.");
        if (project.technologiesUsed?.length) {
          doc.font("Helvetica-Oblique").text(`Tech: ${formatList(project.technologiesUsed)}`);
        }
        doc.moveDown(0.5);
      });
    }

    doc.end();
  });

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const userObjectId = toUserObjectId(session.user);
  const profile = await UserProfile.findOne({ userId: userObjectId }).lean();

  if (!profile) {
    return NextResponse.json(
      { message: "Please complete your profile before generating a resume." },
      { status: 400 }
    );
  }

  try {
    const pdfBuffer = await buildPdfBuffer(profile, session.user.email);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=${profile.fullName || "resume"}.pdf`,
      },
    });
  } catch (error) {
    console.error("Resume generation failed:", error);
    return NextResponse.json(
      { message: "Unable to generate resume. Please try again later." },
      { status: 500 }
    );
  }
}


