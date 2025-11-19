"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

const steps = [
  { id: "personal", title: "Personal Information" },
  { id: "summary", title: "Career Summary" },
  { id: "skills", title: "Skills" },
  { id: "experience", title: "Work Experience" },
  { id: "education", title: "Education" },
  { id: "projects", title: "Projects" },
  { id: "certifications", title: "Certifications" },
  { id: "languages", title: "Languages" },
  { id: "preferences", title: "Job Preferences" },
  { id: "additional", title: "Additional" },
];

const getEmptyExperience = () => ({
  jobTitle: "",
  companyName: "",
  employmentType: "",
  startDate: "",
  endDate: "",
  isCurrentJob: false,
  location: "",
  responsibilities: [],
  achievements: [],
});

const getEmptyEducation = () => ({
  degree: "",
  institution: "",
  startYear: "",
  endYear: "",
  cgpaOrPercentage: "",
  specialization: "",
});

const getEmptyProject = () => ({
  projectTitle: "",
  description: "",
  role: "",
  technologiesUsed: [],
  projectLink: "",
});

const getEmptyCertification = () => ({
  title: "",
  issuer: "",
  completionYear: "",
  certificateLink: "",
});

const getEmptyLanguage = () => ({
  languageName: "",
  proficiency: "Intermediate",
});

const initialFormState = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  linkedIn: "",
  portfolio: "",
  github: "",
  profileImage: "",
  careerObjective: "",
  professionalSummary: "",
  primarySkills: [],
  secondarySkills: [],
  softSkills: [],
  toolsAndTechnologies: [],
  workExperience: [getEmptyExperience()],
  education: [getEmptyEducation()],
  projects: [getEmptyProject()],
  certifications: [getEmptyCertification()],
  languages: [getEmptyLanguage()],
  preferredJobRole: "",
  preferredLocation: "",
  jobType: "Remote",
  expectedSalary: "",
  yearsOfExperience: "",
  noticePeriod: "",
  strengths: [],
  hobbies: [],
  awards: [],
  volunteering: [],
  publications: [],
};

const multiValueFields = [
  { field: "primarySkills", label: "Primary Skills", placeholder: "Add a primary skill" },
  { field: "secondarySkills", label: "Secondary Skills", placeholder: "Add a secondary skill" },
  { field: "softSkills", label: "Soft Skills", placeholder: "Add a soft skill" },
  {
    field: "toolsAndTechnologies",
    label: "Tools & Technologies",
    placeholder: "Add a tool or technology",
  },
  { field: "strengths", label: "Strengths", placeholder: "Add a strength" },
  { field: "hobbies", label: "Hobbies", placeholder: "Add a hobby" },
  { field: "awards", label: "Awards", placeholder: "Add an award" },
  { field: "volunteering", label: "Volunteering", placeholder: "Add volunteering detail" },
  { field: "publications", label: "Publications", placeholder: "Add a publication" },
];

// Dropdown options
const DEGREE_OPTIONS = [
  "High School",
  "Diploma",
  "Associate Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "MBA",
  "PhD",
  "Doctorate",
  "Post Graduate Diploma",
  "Certificate",
  "Other",
];

const EMPLOYMENT_TYPE_OPTIONS = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance",
  "Temporary",
  "Volunteer",
  "Other",
];

const YEARS_OF_EXPERIENCE_OPTIONS = [
  "0-1 years",
  "1-2 years",
  "2-3 years",
  "3-5 years",
  "5-7 years",
  "7-10 years",
  "10-15 years",
  "15+ years",
];

const NOTICE_PERIOD_OPTIONS = [
  "Immediate",
  "1 week",
  "2 weeks",
  "1 month",
  "2 months",
  "3 months",
  "Negotiable",
];

const COMMON_SKILLS = [
  // Technical Skills
  "JavaScript", "Python", "Java", "C++", "C#", "React", "Node.js", "Angular", "Vue.js",
  "TypeScript", "HTML", "CSS", "SQL", "MongoDB", "PostgreSQL", "AWS", "Docker", "Kubernetes",
  "Git", "GitHub", "CI/CD", "REST API", "GraphQL", "Microservices", "Agile", "Scrum",
  // Soft Skills
  "Communication", "Leadership", "Teamwork", "Problem Solving", "Time Management",
  "Critical Thinking", "Adaptability", "Creativity", "Collaboration", "Project Management",
];

const SPECIALIZATION_OPTIONS = [
  "Computer Science", "Software Engineering", "Information Technology", "Data Science",
  "Machine Learning", "Artificial Intelligence", "Cybersecurity", "Web Development",
  "Mobile Development", "Cloud Computing", "DevOps", "Database Administration",
  "Network Engineering", "Business Administration", "Finance", "Marketing",
  "Human Resources", "Operations", "Supply Chain", "Engineering", "Mechanical Engineering",
  "Electrical Engineering", "Civil Engineering", "Chemical Engineering", "Other",
];

const localStorageKey = "profileDraft";

function StepIndicator({ current }) {
  const progress = ((current + 1) / steps.length) * 100;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between text-sm font-medium text-gray-600 dark:text-gray-400">
        <span>
          Step {current + 1} of {steps.length}
        </span>
        <span>{steps[current].title}</span>
      </div>
      <div className="mt-3 h-2 rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="h-2 rounded-full bg-orange-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function MultiValueInput({ label, values, onRemove, onAdd, placeholder, suggestions = [] }) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const handleInputChange = (value) => {
    setInput(value);
    if (value.trim() && suggestions.length > 0) {
      const filtered = suggestions.filter(
        (suggestion) =>
          suggestion.toLowerCase().includes(value.toLowerCase()) &&
          !values.includes(suggestion)
      );
      setFilteredSuggestions(filtered.slice(0, 5));
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      if (!input.trim()) return;
      onAdd(input.trim());
      setInput("");
      setShowSuggestions(false);
    } else if (event.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onAdd(suggestion);
    setInput("");
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-2 relative">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</label>
      <div className="relative">
        <div className="flex flex-wrap gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 shadow-sm">
          {values.map((value, index) => (
            <span
              key={`${value}-${index}`}
              className="inline-flex items-center gap-2 rounded-full bg-orange-100 dark:bg-orange-900/30 px-3 py-1 text-sm text-orange-700 dark:text-orange-300"
            >
              {value}
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="text-xs text-orange-500 dark:text-orange-400 transition hover:text-orange-700 dark:hover:text-orange-200"
              >
                ✕
              </button>
            </span>
          ))}
          <input
            type="text"
            value={input}
            onChange={(event) => handleInputChange(event.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (input.trim() && suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            onBlur={() => {
              // Delay to allow click on suggestion
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            placeholder={placeholder}
            className="flex-1 border-none bg-transparent text-sm text-gray-900 dark:text-gray-100 focus:outline-none"
          />
        </div>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">Press Enter to add • Type to see suggestions</p>
    </div>
  );
}

function SectionCard({ title, description, children }) {
  return (
    <section className="rounded-3xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-black/5 dark:ring-gray-700/50">
      <div className="mb-6 space-y-1">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
        {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

export default function ProfileCreatePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormState);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedDraft = window.localStorage.getItem(localStorageKey);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch {
        window.localStorage.removeItem(localStorageKey);
      }
    }
  }, []);

  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        email: session.user.email || prev.email,
        fullName: prev.fullName || session.user.name || "",
      }));
    }
  }, [session]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(localStorageKey, JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfileImageChange = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, profileImage: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleExperienceChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.workExperience];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, workExperience: updated };
    });
  };

  const handleEducationChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: updated };
    });
  };

  const handleProjectChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.projects];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, projects: updated };
    });
  };

  const handleCertificationChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.certifications];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, certifications: updated };
    });
  };

  const handleLanguageChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.languages];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, languages: updated };
    });
  };

  const getFactory = (field) => {
    switch (field) {
      case "workExperience":
        return getEmptyExperience;
      case "education":
        return getEmptyEducation;
      case "projects":
        return getEmptyProject;
      case "certifications":
        return getEmptyCertification;
      case "languages":
        return getEmptyLanguage;
      default:
        return () => ({});
    }
  };

  const addEntry = (field, factory) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], factory()],
    }));
  };

  const removeEntry = (field, index) => {
    setFormData((prev) => {
      const updated = prev[field].filter((_, idx) => idx !== index);
      if (updated.length === 0) {
        const factory = getFactory(field);
        return { ...prev, [field]: [factory()] };
      }
      return { ...prev, [field]: updated };
    });
  };

  const updateMultiField = (field, updater) => {
    setFormData((prev) => ({ ...prev, [field]: updater(prev[field]) }));
  };

  const handleArrayAdd = (field, value) => {
    updateMultiField(field, (current) => {
      if (!value || current.includes(value)) return current;
      return [...current, value];
    });
  };

  const handleArrayRemove = (field, index) => {
    updateMultiField(field, (current) => current.filter((_, idx) => idx !== index));
  };

  const validateStep = () => {
    switch (steps[currentStep].id) {
      case "personal":
        if (!formData.fullName.trim() || !formData.phone.trim()) {
          return "Please complete required personal information.";
        }
        return "";
      case "summary":
        if (!formData.careerObjective.trim()) {
          return "Career objective is required.";
        }
        return "";
      case "skills":
        if (formData.primarySkills.length === 0) {
          return "Add at least one primary skill.";
        }
        return "";
      case "education":
        if (
          formData.education.some(
            (item) => item.degree.trim() && item.institution.trim()
          )
        ) {
          return "";
        }
        return "Please provide at least one education entry.";
      case "languages":
        if (formData.languages.every((item) => !item.languageName.trim())) {
          return "Add at least one language.";
        }
        return "";
      case "preferences":
        if (!formData.preferredJobRole.trim() || !formData.jobType.trim()) {
          return "Job role and job type are required.";
        }
        return "";
      default:
        return "";
    }
  };

  const handleNext = () => {
    const validationMessage = validateStep();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }
    setError("");
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setError("");
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    const validationMessage = validateStep();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = { ...formData, email: session?.user?.email || formData.email };
      let response = await fetch("/api/profile/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 409) {
        response = await fetch("/api/profile/update", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) {
        const { error: message } = await response.json();
        throw new Error(message || "Unable to save profile.");
      }

      setSuccess(true);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(localStorageKey);
      }
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderArrayTextarea = (label, value, onChange, placeholder) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</label>
      <textarea
        value={value.join("\n")}
        onChange={(event) =>
          onChange(event.target.value.split("\n").map((item) => item.trim()).filter(Boolean))
        }
        rows={4}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
      />
      <p className="text-xs text-gray-500 dark:text-gray-400">Separate each entry on a new line.</p>
    </div>
  );

  const renderExperienceSection = () => (
    <SectionCard
      title="Work Experience"
      description="Add detailed information about each role you have held."
    >
      {formData.workExperience.map((experience, index) => (
        <div key={`experience-${index}`} className="rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between pb-4">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Experience {index + 1}
            </p>
            {formData.workExperience.length > 1 && (
              <button
                type="button"
                onClick={() => removeEntry("workExperience", index)}
                className="text-sm text-red-500 hover:text-red-600"
              >
                Remove
              </button>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Job Title</label>
              <input
                type="text"
                value={experience.jobTitle}
                onChange={(event) =>
                  handleExperienceChange(index, "jobTitle", event.target.value)
                }
                className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Company Name</label>
              <input
                type="text"
                value={experience.companyName}
                onChange={(event) =>
                  handleExperienceChange(index, "companyName", event.target.value)
                }
                className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Employment Type</label>
              <select
                value={experience.employmentType}
                onChange={(event) =>
                  handleExperienceChange(index, "employmentType", event.target.value)
                }
                className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
              >
                <option value="">Select employment type</option>
                {EMPLOYMENT_TYPE_OPTIONS.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Start Date</label>
                <input
                  type="month"
                  value={experience.startDate}
                  onChange={(event) =>
                    handleExperienceChange(index, "startDate", event.target.value)
                  }
                  className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">End Date</label>
                <input
                  type="month"
                  value={experience.endDate}
                  onChange={(event) =>
                    handleExperienceChange(index, "endDate", event.target.value)
                  }
                  disabled={experience.isCurrentJob}
                  className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-700"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Location</label>
              <input
                type="text"
                value={experience.location}
                onChange={(event) =>
                  handleExperienceChange(index, "location", event.target.value)
                }
                placeholder="City, Country"
                className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id={`current-job-${index}`}
                type="checkbox"
                checked={experience.isCurrentJob}
                onChange={(event) =>
                  handleExperienceChange(index, "isCurrentJob", event.target.checked)
                }
                className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-orange-500 focus:ring-orange-400"
              />
              <label
                htmlFor={`current-job-${index}`}
                className="text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                This is my current job
              </label>
            </div>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {renderArrayTextarea(
              "Key Responsibilities",
              experience.responsibilities,
              (value) => handleExperienceChange(index, "responsibilities", value),
              "Describe your core responsibilities."
            )}
            {renderArrayTextarea(
              "Key Achievements",
              experience.achievements,
              (value) => handleExperienceChange(index, "achievements", value),
              "Highlight measurable achievements."
            )}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addEntry("workExperience", getEmptyExperience)}
        className="w-full rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 px-4 py-3 text-sm font-semibold text-orange-600 dark:text-orange-400 transition hover:border-orange-400 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
      >
        + Add Another Experience
      </button>
    </SectionCard>
  );

  const renderEducationSection = () => (
    <SectionCard title="Education" description="Add your academic background.">
      {formData.education.map((item, index) => (
        <div key={`education-${index}`} className="rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between pb-4">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Education {index + 1}</p>
            {formData.education.length > 1 && (
              <button
                type="button"
                onClick={() => removeEntry("education", index)}
                className="text-sm text-red-500 hover:text-red-600"
              >
                Remove
              </button>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Degree</label>
              <select
                value={item.degree}
                onChange={(event) => handleEducationChange(index, "degree", event.target.value)}
                className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
              >
                <option value="">Select a degree</option>
                {DEGREE_OPTIONS.map((degree) => (
                  <option key={degree} value={degree}>
                    {degree}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Institution</label>
              <input
                type="text"
                value={item.institution}
                onChange={(event) =>
                  handleEducationChange(index, "institution", event.target.value)
                }
                className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Start Year</label>
              <input
                type="text"
                value={item.startYear}
                onChange={(event) =>
                  handleEducationChange(index, "startYear", event.target.value)
                }
                placeholder="e.g. 2018"
                className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">End Year</label>
              <input
                type="text"
                value={item.endYear}
                onChange={(event) => handleEducationChange(index, "endYear", event.target.value)}
                placeholder="e.g. 2022"
                className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
              />
            </div>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">CGPA / Percentage</label>
              <input
                type="text"
                value={item.cgpaOrPercentage}
                onChange={(event) =>
                  handleEducationChange(index, "cgpaOrPercentage", event.target.value)
                }
                className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Specialization</label>
              <select
                value={item.specialization}
                onChange={(event) =>
                  handleEducationChange(index, "specialization", event.target.value)
                }
                className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
              >
                <option value="">Select specialization</option>
                {SPECIALIZATION_OPTIONS.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addEntry("education", getEmptyEducation)}
        className="w-full rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 px-4 py-3 text-sm font-semibold text-orange-600 dark:text-orange-400 transition hover:border-orange-400 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
      >
        + Add Another Education
      </button>
    </SectionCard>
  );

  const renderProjectsSection = () => (
    <SectionCard title="Projects" description="Highlight the projects you’re proud of.">
      {formData.projects.map((project, index) => (
        <div key={`project-${index}`} className="rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between pb-4">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Project {index + 1}</p>
            {formData.projects.length > 1 && (
              <button
                type="button"
                onClick={() => removeEntry("projects", index)}
                className="text-sm text-red-500 hover:text-red-600"
              >
                Remove
              </button>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Project Title</label>
              <input
                type="text"
                value={project.projectTitle}
                onChange={(event) =>
                  handleProjectChange(index, "projectTitle", event.target.value)
                }
                className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Role</label>
              <input
                type="text"
                value={project.role}
                onChange={(event) => handleProjectChange(index, "role", event.target.value)}
                className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              rows={3}
              value={project.description}
              onChange={(event) =>
                handleProjectChange(index, "description", event.target.value)
              }
              className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
            />
          </div>
          <div className="mt-4">
            {renderArrayTextarea(
              "Technologies Used",
              project.technologiesUsed,
              (value) => handleProjectChange(index, "technologiesUsed", value),
              "Add each technology on a new line."
            )}
          </div>
          <div className="mt-4">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Project Link</label>
            <input
              type="url"
              value={project.projectLink}
              onChange={(event) =>
                handleProjectChange(index, "projectLink", event.target.value)
              }
              placeholder="https://"
              className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addEntry("projects", getEmptyProject)}
        className="w-full rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 px-4 py-3 text-sm font-semibold text-orange-600 dark:text-orange-400 transition hover:border-orange-400 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
      >
        + Add Another Project
      </button>
    </SectionCard>
  );

  const renderCertificationsSection = () => (
    <SectionCard title="Certifications" description="Showcase any certifications.">
      {formData.certifications.map((certification, index) => (
        <div key={`cert-${index}`} className="rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between pb-4">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Certification {index + 1}
            </p>
            {formData.certifications.length > 1 && (
              <button
                type="button"
                onClick={() => removeEntry("certifications", index)}
                className="text-sm text-red-500 hover:text-red-600"
              >
                Remove
              </button>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Title</label>
              <input
                type="text"
                value={certification.title}
                onChange={(event) =>
                  handleCertificationChange(index, "title", event.target.value)
                }
                className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Issuer</label>
              <input
                type="text"
                value={certification.issuer}
                onChange={(event) =>
                  handleCertificationChange(index, "issuer", event.target.value)
                }
                className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Completion Year</label>
              <input
                type="text"
                value={certification.completionYear}
                onChange={(event) =>
                  handleCertificationChange(index, "completionYear", event.target.value)
                }
                placeholder="e.g. 2024"
                className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Certificate Link</label>
              <input
                type="url"
                value={certification.certificateLink}
                onChange={(event) =>
                  handleCertificationChange(index, "certificateLink", event.target.value)
                }
                placeholder="https://"
                className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
              />
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addEntry("certifications", getEmptyCertification)}
        className="w-full rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 px-4 py-3 text-sm font-semibold text-orange-600 dark:text-orange-400 transition hover:border-orange-400 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
      >
        + Add Another Certification
      </button>
    </SectionCard>
  );

  const renderLanguagesSection = () => (
    <SectionCard title="Languages" description="List the languages you know.">
      {formData.languages.map((language, index) => (
        <div key={`language-${index}`} className="rounded-2xl border border-gray-100 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between pb-4">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Language {index + 1}</p>
            {formData.languages.length > 1 && (
              <button
                type="button"
                onClick={() => removeEntry("languages", index)}
                className="text-sm text-red-500 hover:text-red-600"
              >
                Remove
              </button>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Language</label>
              <input
                type="text"
                value={language.languageName}
                onChange={(event) =>
                  handleLanguageChange(index, "languageName", event.target.value)
                }
                className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Proficiency</label>
              <select
                value={language.proficiency}
                onChange={(event) =>
                  handleLanguageChange(index, "proficiency", event.target.value)
                }
                className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
              >
                <option value="Basic">Basic</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Fluent">Fluent</option>
              </select>
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addEntry("languages", getEmptyLanguage)}
        className="w-full rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 px-4 py-3 text-sm font-semibold text-orange-600 dark:text-orange-400 transition hover:border-orange-400 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
      >
        + Add Another Language
      </button>
    </SectionCard>
  );

  const renderAdditionalSection = () => (
    <SectionCard title="Additional Information" description="Anything else you would like us to know.">
      {multiValueFields
        .filter((field) =>
          ["strengths", "hobbies", "awards", "volunteering", "publications"].includes(
            field.field
          )
        )
        .map(({ field, label, placeholder }) => (
          <MultiValueInput
            key={field}
            label={label}
            values={formData[field]}
            placeholder={placeholder}
            onAdd={(value) => handleArrayAdd(field, value)}
            onRemove={(index) => handleArrayRemove(field, index)}
          />
        ))}
    </SectionCard>
  );

  const renderSkillsSection = () => (
    <SectionCard title="Skills" description="Add your skills across categories.">
      {multiValueFields
        .filter((field) =>
          ["primarySkills", "secondarySkills", "softSkills", "toolsAndTechnologies"].includes(
            field.field
          )
        )
        .map(({ field, label, placeholder }) => (
          <MultiValueInput
            key={field}
            label={label}
            values={formData[field]}
            placeholder={placeholder}
            suggestions={COMMON_SKILLS}
            onAdd={(value) => handleArrayAdd(field, value)}
            onRemove={(index) => handleArrayRemove(field, index)}
          />
        ))}
    </SectionCard>
  );

  const renderPersonalSection = () => (
    <SectionCard
      title="Personal Information"
      description="Tell us about yourself. We will use this to personalize your resume."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Full Name *</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(event) => handleInputChange("fullName", event.target.value)}
            className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email *</label>
          <input
            type="email"
            value={formData.email}
            readOnly
            className="mt-1 w-full cursor-not-allowed rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Prefilled from your account.</p>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Phone *</label>
          <input
            type="text"
            value={formData.phone}
            onChange={(event) => handleInputChange("phone", event.target.value)}
            className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(event) => handleInputChange("location", event.target.value)}
            placeholder="City, Country"
            className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">LinkedIn</label>
          <input
            type="url"
            value={formData.linkedIn}
            onChange={(event) => handleInputChange("linkedIn", event.target.value)}
            placeholder="https://linkedin.com/in/username"
            className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Portfolio</label>
          <input
            type="url"
            value={formData.portfolio}
            onChange={(event) => handleInputChange("portfolio", event.target.value)}
            placeholder="https://your-portfolio.com"
            className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">GitHub</label>
          <input
            type="url"
            value={formData.github}
            onChange={(event) => handleInputChange("github", event.target.value)}
            placeholder="https://github.com/username"
            className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Profile Image</label>
        <div className="mt-2 flex items-center gap-4">
          {formData.profileImage && (
            <Image
              src={formData.profileImage}
              alt="Profile preview"
              width={64}
              height={64}
              className="h-16 w-16 rounded-full object-cover shadow"
              unoptimized
            />
          )}
          <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 transition hover:border-orange-400 hover:text-orange-600 dark:hover:text-orange-400">
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={(event) => handleProfileImageChange(event.target.files?.[0])}
              className="hidden"
            />
          </label>
          {formData.profileImage && (
            <button
              type="button"
              onClick={() => handleInputChange("profileImage", "")}
              className="text-sm text-red-500 hover:text-red-600"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </SectionCard>
  );

  const renderSummarySection = () => (
    <SectionCard
      title="Career Summary"
      description="Describe your goals and what makes you unique."
    >
      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Career Objective *</label>
          <textarea
            rows={4}
            value={formData.careerObjective}
            onChange={(event) => handleInputChange("careerObjective", event.target.value)}
            placeholder="Share your career goals and what you're looking for."
            className="mt-2 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Professional Summary</label>
          <textarea
            rows={5}
            value={formData.professionalSummary}
            onChange={(event) =>
              handleInputChange("professionalSummary", event.target.value)
            }
            placeholder="Highlight key achievements, experience, and impact."
            className="mt-2 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
          />
        </div>
      </div>
    </SectionCard>
  );

  const renderPreferencesSection = () => (
    <SectionCard title="Job Preferences" description="Help us match you with the right roles.">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Preferred Job Role *</label>
          <input
            type="text"
            value={formData.preferredJobRole}
            onChange={(event) => handleInputChange("preferredJobRole", event.target.value)}
            className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Preferred Location</label>
          <input
            type="text"
            value={formData.preferredLocation}
            onChange={(event) => handleInputChange("preferredLocation", event.target.value)}
            placeholder="Remote, Bengaluru, etc."
            className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Job Type *</label>
          <select
            value={formData.jobType}
            onChange={(event) => handleInputChange("jobType", event.target.value)}
            className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
          >
            <option value="Remote">Remote</option>
            <option value="Onsite">Onsite</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Expected Salary</label>
          <input
            type="text"
            value={formData.expectedSalary}
            onChange={(event) => handleInputChange("expectedSalary", event.target.value)}
            placeholder="e.g. 15 LPA"
            className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Years of Experience</label>
          <select
            value={formData.yearsOfExperience}
            onChange={(event) => handleInputChange("yearsOfExperience", event.target.value)}
            className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
          >
            <option value="">Select years of experience</option>
            {YEARS_OF_EXPERIENCE_OPTIONS.map((years) => (
              <option key={years} value={years}>
                {years}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Notice Period</label>
          <select
            value={formData.noticePeriod}
            onChange={(event) => handleInputChange("noticePeriod", event.target.value)}
            className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900"
          >
            <option value="">Select notice period</option>
            {NOTICE_PERIOD_OPTIONS.map((period) => (
              <option key={period} value={period}>
                {period}
              </option>
            ))}
          </select>
        </div>
      </div>
    </SectionCard>
  );

  const renderCurrentStep = () => {
    const current = steps[currentStep].id;

    if (current === "personal") return renderPersonalSection();
    if (current === "summary") return renderSummarySection();
    if (current === "skills") return renderSkillsSection();
    if (current === "experience") return renderExperienceSection();
    if (current === "education") return renderEducationSection();
    if (current === "projects") return renderProjectsSection();
    if (current === "certifications") return renderCertificationsSection();
    if (current === "languages") return renderLanguagesSection();
    if (current === "preferences") return renderPreferencesSection();
    return renderAdditionalSection();
  };

  const actionButtons = (
    <div className="flex flex-col gap-3 pt-6 sm:flex-row sm:justify-between">
      <button
        type="button"
        onClick={handleBack}
        disabled={currentStep === 0}
        className="rounded-2xl border border-gray-300 dark:border-gray-600 px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300 transition hover:border-gray-400 dark:hover:border-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Back
      </button>
      {currentStep === steps.length - 1 ? (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:from-orange-600 hover:to-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Finish & Save Profile"}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleNext}
          className="rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:from-orange-600 hover:to-amber-600"
        >
          Next Step
        </button>
      )}
    </div>
  );

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-amber-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <div className="rounded-3xl bg-white dark:bg-gray-800 p-12 shadow-xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
              ✓
            </div>
            <h1 className="mt-6 text-3xl font-semibold text-gray-900 dark:text-gray-100">
              Profile Completed Successfully!
            </h1>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Your professional profile is now saved. We will use this data to generate an AI-powered
              resume tailored for you.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:from-orange-600 hover:to-amber-600"
              >
                Go to Dashboard
              </button>
              <button
                type="button"
                onClick={() => router.push("/profile/create")}
                className="rounded-2xl border border-gray-200 dark:border-gray-600 px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 transition hover:border-gray-300 dark:hover:border-gray-500"
              >
                Edit Profile Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-orange-500 dark:text-orange-400">
            Create Your Professional Profile
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-gray-900 dark:text-gray-100">
            Let us craft the perfect story for your AI resume
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Provide detailed information about your experience and preferences. You can save and
            return anytime—your progress is auto-saved.
          </p>
        </div>
        <StepIndicator current={currentStep} />
        {error && (
          <div className="mb-6 rounded-2xl border border-red-100 dark:border-red-900 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}
        <div className="space-y-6">
          {renderCurrentStep()}
          {actionButtons}
        </div>
      </div>
    </div>
  );
}

