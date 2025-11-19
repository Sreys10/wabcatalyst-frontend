import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@lib/auth";
import connectDB from "@lib/db";
import UserProfile from "@models/UserProfile";
import { toUserObjectId } from "@lib/profile";

const completionChecklist = [
  "fullName",
  "phone",
  "careerObjective",
  "primarySkills",
  "workExperience",
  "education",
  "projects",
  "languages",
  "preferredJobRole",
  "jobType",
];

const formatDate = (value) => {
  if (!value) return "Not updated yet";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not updated yet";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const computeCompletion = (profile) => {
  if (!profile) return 0;
  const total = completionChecklist.length;
  const filled = completionChecklist.filter((field) => {
    const value = profile[field];
    if (Array.isArray(value)) {
      return value.some((item) => !!item && String(item).trim().length > 0);
    }
    return !!value && String(value).trim().length > 0;
  }).length;
  return Math.round((filled / total) * 100);
};

const buildNextSteps = (profile) => {
  return [
    {
      label: "Complete your professional profile",
      done: !!profile,
    },
    {
      label: "Add at least 2 projects",
      done: (profile?.projects?.length || 0) >= 2,
    },
    {
      label: "Document recent experience",
      done: (profile?.workExperience?.length || 0) >= 1,
    },
    {
      label: "List your primary skills",
      done: (profile?.primarySkills?.length || 0) >= 3,
    },
  ];
};

export const metadata = {
  title: "Dashboard • WabCatalyst",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  await connectDB();
  const userObjectId = toUserObjectId(session.user);
  const profileDoc = await UserProfile.findOne({ userId: userObjectId }).lean();
  const profile = profileDoc ? JSON.parse(JSON.stringify(profileDoc)) : null;
  const completion = computeCompletion(profile);
  const nextSteps = buildNextSteps(profile);
  const primarySkills = profile?.primarySkills?.slice(0, 6) || [];
  const secondarySkills = profile?.secondarySkills?.slice(0, 6) || [];
  const experiences = profile?.workExperience?.slice(0, 2) || [];
  const projects = profile?.projects?.slice(0, 2) || [];

  const greetingName =
    profile?.fullName || session.user.name || session.user.email.split("@")[0];

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20 pt-10 dark:bg-gray-950">
      {/* Decorative Background Elements */}
      <div className="fixed left-0 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-orange-200/20 blur-[100px] dark:bg-orange-900/10" />
      <div className="fixed right-0 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-rose-200/20 blur-[100px] dark:bg-rose-900/10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <header className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              Welcome back, <span className="font-semibold text-orange-600">{greetingName}</span>. Here&apos;s what&apos;s happening today.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/profile/create"
              className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-200 transition-all hover:bg-gray-50 hover:ring-gray-300 dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:hover:bg-gray-700"
            >
              Edit Profile
            </Link>
            <Link
              href="/blogs"
              className="inline-flex items-center justify-center rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-600/20 transition-all hover:bg-orange-700 hover:shadow-orange-600/30"
            >
              Career Resources
            </Link>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="mb-10 grid gap-6 md:grid-cols-3">
          {/* Profile Completion Card */}
          <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:bg-gray-900">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Profile Completion</p>
                <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{completion}%</h3>
              </div>
              <div className="relative h-16 w-16">
                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                  <path
                    className="text-gray-100 dark:text-gray-800"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className="text-orange-500 transition-all duration-1000 ease-out"
                    strokeDasharray={`${completion}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 transition-all duration-1000"
                  style={{ width: `${completion}%` }}
                />
              </div>
              <p className="mt-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                {completion >= 90 ? "Excellent! Your profile is robust." : "Complete your profile to rank higher."}
              </p>
            </div>
          </div>

          {/* Status Card */}
          <div className="rounded-3xl bg-white p-6 shadow-[0_2px_20px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:bg-gray-900">
            <div className="flex h-full flex-col justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Status</p>
                <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                  {profile ? "Active & Synced" : "Setup Required"}
                </h3>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  {profile?.jobType || "Job Type TBD"}
                </span>
                <span className="inline-flex items-center rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                  {profile?.preferredLocation || "Location TBD"}
                </span>
              </div>
            </div>
          </div>

          {/* Action Card */}
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-white shadow-[0_2px_20px_rgba(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">Next Step</p>
                <h3 className="mt-2 text-2xl font-bold">Generate Resume</h3>
                <p className="mt-2 text-sm text-gray-400">
                  Use our AI to craft the perfect resume based on your profile.
                </p>
              </div>
              <button className="mt-6 w-full rounded-xl bg-white/10 py-3 text-sm font-semibold backdrop-blur-sm transition-all hover:bg-white/20">
                Coming Soon
              </button>
            </div>
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange-500/20 blur-3xl transition-all group-hover:bg-orange-500/30" />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column (2/3) */}
          <div className="space-y-8 lg:col-span-2">
            {/* Next Steps */}
            <section className="rounded-3xl bg-white p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] dark:bg-gray-900">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recommended Actions</h3>
              <div className="mt-6 space-y-4">
                {nextSteps.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between rounded-2xl border p-4 transition-all ${item.done
                      ? "border-gray-100 bg-gray-50/50 opacity-60 dark:border-gray-800 dark:bg-gray-800/50"
                      : "border-orange-100 bg-orange-50/30 dark:border-orange-900/30 dark:bg-orange-900/10"
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${item.done
                          ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                          }`}
                      >
                        {item.done ? (
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="text-sm font-bold">{index + 1}</span>
                        )}
                      </div>
                      <span
                        className={`font-medium ${item.done ? "text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-white"
                          }`}
                      >
                        {item.label}
                      </span>
                    </div>
                    {!item.done && (
                      <Link
                        href="/profile/create"
                        className="text-sm font-semibold text-orange-600 hover:text-orange-700"
                      >
                        Start &rarr;
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Activity / Experience */}
            <section className="rounded-3xl bg-white p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Experience</h3>
                <Link href="/profile/create#experience" className="text-sm font-semibold text-orange-600 hover:text-orange-700">
                  View All
                </Link>
              </div>
              <div className="mt-6 space-y-6">
                {experiences.length > 0 ? (
                  experiences.map((exp, i) => (
                    <div key={i} className="group flex gap-4">
                      <div className="relative mt-1 flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-gray-50 text-xl font-bold text-gray-400 dark:bg-gray-800">
                        {exp.companyName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-gray-900 dark:text-white">{exp.jobTitle}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{exp.companyName}</p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                          {exp.startDate} - {exp.isCurrentJob ? "Present" : exp.endDate}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-10 text-center dark:border-gray-700">
                    <div className="mb-3 rounded-full bg-gray-50 p-3 dark:bg-gray-800">
                      <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">No experience added</p>
                    <p className="mt-1 text-sm text-gray-500">Add your work history to build credibility.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column (1/3) */}
          <div className="space-y-8">
            {/* Skills Widget */}
            <section className="rounded-3xl bg-white p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)] dark:bg-gray-900">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Top Skills</h3>
              <div className="mt-6 flex flex-wrap gap-2">
                {primarySkills.length > 0 ? (
                  primarySkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center rounded-lg bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No skills added yet.</p>
                )}
                <Link
                  href="/profile/create#skills"
                  className="inline-flex items-center rounded-lg border border-dashed border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:text-gray-300"
                >
                  + Add
                </Link>
              </div>
            </section>

            {/* Profile Snapshot */}
            <section className="rounded-3xl bg-gradient-to-br from-orange-500 to-rose-500 p-8 text-white shadow-lg">
              <h3 className="text-xl font-bold">Career Goal</h3>
              <p className="mt-4 text-sm leading-relaxed text-white/90">
                {profile?.careerObjective ||
                  "Define your career objective to get personalized job recommendations and resume tips."}
              </p>
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="flex justify-between text-sm">
                  <span className="text-white/80">Expected Salary</span>
                  <span className="font-bold">{profile?.expectedSalary || "-"}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
