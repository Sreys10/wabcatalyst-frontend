import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        personal: {
            fullName: String,
            email: String,
            phone: String,
            location: String,
            linkedin: String,
            portfolio: String,
        },
        summary: {
            bio: String,
            jobTitles: String,
        },
        skills: {
            primary: String,
            tools: String,
            soft: String,
        },
        experience: [
            {
                title: String,
                company: String,
                startDate: String,
                endDate: String,
                location: String,
                description: String,
            },
        ],
        education: [
            {
                degree: String,
                institution: String,
                year: String,
                grade: String,
            },
        ],
        projects: [
            {
                title: String,
                description: String,
                technologies: String,
                link: String,
            },
        ],
        certifications: [
            {
                name: String,
                issuer: String,
            },
        ],
        preferences: {
            roles: String,
            location: String,
            salary: String,
            noticePeriod: String,
        },
        extras: {
            strengths: String,
            hobbies: String,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);
