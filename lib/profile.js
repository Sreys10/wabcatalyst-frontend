import mongoose from "mongoose";
import crypto from "crypto";

const stringArrayFields = [
  "primarySkills",
  "secondarySkills",
  "softSkills",
  "toolsAndTechnologies",
  "strengths",
  "hobbies",
  "awards",
  "volunteering",
  "publications",
];

export function toUserObjectId(sessionUser = {}) {
  const candidate = sessionUser.id || sessionUser.email || crypto.randomUUID();

  if (mongoose.Types.ObjectId.isValid(candidate)) {
    return new mongoose.Types.ObjectId(candidate);
  }

  const hash = crypto
    .createHash("md5")
    .update(candidate)
    .digest("hex")
    .slice(0, 24);

  return new mongoose.Types.ObjectId(hash);
}

const toStringArray = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }

  return [];
};

export function sanitizeProfilePayload(payload = {}) {
  const cleaned = { ...payload };

  stringArrayFields.forEach((field) => {
    cleaned[field] = toStringArray(payload[field]);
  });

  cleaned.workExperience = Array.isArray(payload.workExperience)
    ? payload.workExperience.map((entry) => ({
        ...entry,
        responsibilities: toStringArray(entry?.responsibilities),
        achievements: toStringArray(entry?.achievements),
      }))
    : [];

  cleaned.education = Array.isArray(payload.education) ? payload.education : [];
  cleaned.projects = Array.isArray(payload.projects) ? payload.projects : [];
  cleaned.certifications = Array.isArray(payload.certifications)
    ? payload.certifications
    : [];
  cleaned.languages = Array.isArray(payload.languages) ? payload.languages : [];

  return cleaned;
}






