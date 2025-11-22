import { GoogleGenerativeAI } from "@google/generative-ai";
import PDFDocument from "pdfkit";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const body = await req.json();
        const { personalInfo, education, experience, skills } = body;

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "Gemini API Key not configured" },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Construct the prompt for Gemini
        const prompt = `
      You are a professional resume writer. I will provide you with a user's details.
      Your task is to:
      1. Write a professional summary (max 3 sentences).
      2. Polish the work experience descriptions to be more impactful and result-oriented (use action verbs).
      3. Suggest a list of 5-7 relevant technical or soft skills based on the experience if the provided skills are sparse, otherwise polish the provided skills.

      User Details:
      Name: ${personalInfo.fullName}
      Job Title: ${personalInfo.jobTitle}
      Experience: ${JSON.stringify(experience)}
      Skills: ${skills}

      Return the response in JSON format with the following structure:
      {
        "summary": "...",
        "polishedExperience": [
          { "company": "...", "role": "...", "duration": "...", "description": "..." }
        ],
        "refinedSkills": ["...", "..."]
      }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up the response text to ensure it's valid JSON
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const aiData = JSON.parse(cleanedText);

        // Create PDF
        const doc = new PDFDocument();
        const chunks = [];

        doc.on("data", (chunk) => chunks.push(chunk));

        // PDF Content Generation
        doc.fontSize(20).text(personalInfo.fullName, { align: "center" });
        doc.fontSize(12).text(`${personalInfo.email} | ${personalInfo.phone}`, { align: "center" });
        doc.moveDown();

        doc.fontSize(16).text("Professional Summary");
        doc.fontSize(12).text(aiData.summary);
        doc.moveDown();

        doc.fontSize(16).text("Experience");
        aiData.polishedExperience.forEach((exp) => {
            doc.fontSize(14).text(`${exp.role} at ${exp.company}`);
            doc.fontSize(12).text(exp.duration);
            doc.fontSize(12).text(exp.description);
            doc.moveDown(0.5);
        });
        doc.moveDown();

        doc.fontSize(16).text("Education");
        education.forEach((edu) => {
            doc.fontSize(14).text(`${edu.degree}`);
            doc.fontSize(12).text(`${edu.school}, ${edu.year}`);
            doc.moveDown(0.5);
        });
        doc.moveDown();

        doc.fontSize(16).text("Skills");
        doc.fontSize(12).text(aiData.refinedSkills.join(", "));

        doc.end();

        const pdfBuffer = await new Promise((resolve) => {
            doc.on("end", () => resolve(Buffer.concat(chunks)));
        });

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": 'attachment; filename="resume.pdf"',
            },
        });

    } catch (error) {
        console.error("Error generating resume:", error);
        return NextResponse.json(
            { error: "Failed to generate resume" },
            { status: 500 }
        );
    }
}
