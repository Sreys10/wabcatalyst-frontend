"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Download, LogOut, FileText, Search, Users, FileCheck, Filter, ChevronDown } from "lucide-react";
import { JOB_TITLES } from "@/lib/constants";
import { signOut } from "next-auth/react";

interface User {
    _id: string;
    personal: {
        fullName: string;
        email: string;
        phone: string;
        location: string;
    };
    summary: {
        jobTitles: string;
    };
    resumeFile?: string;
    resumeFileName?: string;
}

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [jobTitleFilter, setJobTitleFilter] = useState("All");

    // Get unique job titles for filter
    const uniqueJobTitles = ["All", ...JOB_TITLES];

    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.personal?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.personal?.email?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter = jobTitleFilter === "All" || user.summary?.jobTitles === jobTitleFilter;

        return matchesSearch && matchesFilter;
    });

    const totalUsers = users.length;
    const usersWithResume = users.filter(u => u.resumeFile).length;

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((session?.user as any)?.role !== "admin") {
                router.push("/dashboard");
            } else {
                fetchUsers();
            }
        }
    }, [status, session, router]);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        window.location.href = "/api/admin/export";
    };

    if (status === "loading" || loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading Admin Dashboard...</div>;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((session?.user as any)?.role !== "admin") {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 transition-colors font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header & Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-black dark:text-white tracking-tight">Admin Dashboard</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage users and view platform insights</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2.5 bg-black text-orange-500 rounded-lg hover:bg-black-900 transition-all shadow-md hover:shadow-lg font-medium border border-black"
                        >
                            <Download className="w-4 h-4" /> Export Excel
                        </button>
                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 text-red-600 border border-red-200 dark:border-red-900/30 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-sm font-medium"
                        >
                            <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{totalUsers}</h3>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                            <FileCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Resumes Uploaded</p>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{usersWithResume}</h3>
                        </div>
                    </div>
                    {/* Add more stats here if needed */}
                </div>

                {/* Command Bar (Search & Filter) */}
                <div className="relative max-w-4xl mx-auto w-full mb-8 group z-10">
                    {/* Glow Effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

                    <div className="relative bg-white dark:bg-gray-800 rounded-full shadow-2xl flex items-center p-2 border border-gray-100 dark:border-gray-700">
                        {/* Search Section */}
                        <div className="flex-1 flex items-center px-4 md:px-6 gap-3 md:gap-4">
                            <Search className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray text-base md:text-lg py-2 outline-none"
                            />
                        </div>

                        {/* Divider */}
                        <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-2"></div>

                        {/* Filter Section */}
                        <div className="relative min-w-[180px] md:min-w-[220px] px-2">
                            <div className="flex items-center gap-2 cursor-pointer h-full">
                                <Filter className="w-4 h-4 text-gray-500" />
                                <select
                                    value={jobTitleFilter}
                                    onChange={(e) => setJobTitleFilter(e.target.value)}
                                    className="w-full bg-transparent border-none focus:ring-0 text-gray-700 dark:text-gray-200 text-sm font-medium appearance-none cursor-pointer py-2 pl-1 pr-8 outline-none"
                                >
                                    {uniqueJobTitles.map((title) => (
                                        <option key={title} value={title} className="bg-white dark:bg-gray-800">
                                            {title === "All" ? "Filter by Role (All)" : title}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-base font-bold text-black dark:text-black uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-base font-bold text-black dark:text-black uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-base font-bold text-black dark:text-black uppercase tracking-wider">Phone</th>
                                    <th className="px-6 py-4 text-base font-bold text-black dark:text-black uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-4 text-base font-bold text-black dark:text-black uppercase tracking-wider">Job Title</th>
                                    <th className="px-6 py-4 text-base font-bold text-black dark:text-black uppercase tracking-wider">Resume</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {filteredUsers.map((user, index) => (
                                    <tr
                                        key={user._id}
                                        className={`
                                            transition-colors
                                            ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-800/50'}
                                            hover:bg-blue-50/50 dark:hover:bg-blue-900/10
                                        `}
                                    >
                                        <td className="px-6 py-5 text-sm text-gray-900 dark:text-white font-semibold">
                                            {user.personal?.fullName || "N/A"}
                                        </td>
                                        <td className="px-6 py-5 text-sm text-gray-600 dark:text-gray-300">
                                            {user.personal?.email || "N/A"}
                                        </td>
                                        <td className="px-6 py-5 text-sm text-gray-600 dark:text-gray-300">
                                            {user.personal?.phone || "N/A"}
                                        </td>
                                        <td className="px-6 py-5 text-sm text-gray-600 dark:text-gray-300 capitalize">
                                            {user.personal?.location || "N/A"}
                                        </td>
                                        <td className="px-6 py-5 text-sm text-gray-600 dark:text-gray-300">
                                            {user.summary?.jobTitles || "N/A"}
                                        </td>
                                        <td className="px-6 py-5 text-sm text-gray-600 dark:text-gray-300">
                                            {user.resumeFile ? (
                                                <a
                                                    href={user.resumeFile}
                                                    target={user.resumeFile.startsWith('http') ? "_blank" : "_self"}
                                                    download={!user.resumeFile.startsWith('http') ? (user.resumeFileName || "resume.pdf") : undefined}
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-xs font-medium border border-blue-100 dark:border-blue-800"
                                                >
                                                    <FileText className="w-3.5 h-3.5" />
                                                    Download
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 text-xs italic">No Resume</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                            <div className="flex flex-col items-center gap-2">
                                                <Search className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                                                <p>No users found matching your search.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
