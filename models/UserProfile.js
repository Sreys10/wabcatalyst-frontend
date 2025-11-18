import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema(
  {
    jobTitle: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    employmentType: { type: String, trim: true },
    startDate: { type: String, required: true, trim: true },
    endDate: { type: String, trim: true },
    isCurrentJob: { type: Boolean, default: false },
    location: { type: String, trim: true },
    responsibilities: [{ type: String, trim: true }],
    achievements: [{ type: String, trim: true }],
  },
  { _id: false }
);

const EducationSchema = new mongoose.Schema(
  {
    degree: { type: String, required: true, trim: true },
    institution: { type: String, required: true, trim: true },
    startYear: { type: String, trim: true },
    endYear: { type: String, trim: true },
    cgpaOrPercentage: { type: String, trim: true },
    specialization: { type: String, trim: true },
  },
  { _id: false }
);

const ProjectSchema = new mongoose.Schema(
  {
    projectTitle: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    role: { type: String, trim: true },
    technologiesUsed: [{ type: String, trim: true }],
    projectLink: { type: String, trim: true },
  },
  { _id: false }
);

const CertificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    issuer: { type: String, trim: true },
    completionYear: { type: String, trim: true },
    certificateLink: { type: String, trim: true },
  },
  { _id: false }
);

const LanguageSchema = new mongoose.Schema(
  {
    languageName: { type: String, required: true, trim: true },
    proficiency: {
      type: String,
      enum: ["Basic", "Intermediate", "Fluent"],
      default: "Intermediate",
    },
  },
  { _id: false }
);

const UserProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    legacyUserId: { type: String, trim: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    location: { type: String, trim: true },
    linkedIn: { type: String, trim: true },
    portfolio: { type: String, trim: true },
    github: { type: String, trim: true },
    profileImage: { type: String, trim: true },
    careerObjective: { type: String, trim: true },
    professionalSummary: { type: String, trim: true },
    primarySkills: [{ type: String, trim: true }],
    secondarySkills: [{ type: String, trim: true }],
    softSkills: [{ type: String, trim: true }],
    toolsAndTechnologies: [{ type: String, trim: true }],
    workExperience: [ExperienceSchema],
    education: [EducationSchema],
    projects: [ProjectSchema],
    certifications: [CertificationSchema],
    languages: [LanguageSchema],
    preferredJobRole: { type: String, trim: true },
    preferredLocation: { type: String, trim: true },
    jobType: {
      type: String,
      enum: ["Remote", "Onsite", "Hybrid", ""],
      default: "",
    },
    expectedSalary: { type: String, trim: true },
    yearsOfExperience: { type: String, trim: true },
    noticePeriod: { type: String, trim: true },
    strengths: [{ type: String, trim: true }],
    hobbies: [{ type: String, trim: true }],
    awards: [{ type: String, trim: true }],
    volunteering: [{ type: String, trim: true }],
    publications: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

export default mongoose.models.UserProfile ||
  mongoose.model("UserProfile", UserProfileSchema);

