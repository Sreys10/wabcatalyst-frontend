"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Download, LogOut } from "lucide-react";
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
}

export default function AdminDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        } else if (status === "authenticated") {
            if (session?.user?.role !== "admin") {
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

    if (session?.user?.role !== "admin") {
        return null; // Will redirect
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 transition-colors">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Admin Dashboard</h1>
                    <div className="flex gap-4">
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Download className="w-4 h-4" /> Export to Excel
                        </button>
                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-red-600 border border-red-200 dark:border-red-900/30 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                            <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Name</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Email</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Phone</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Location</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Job Title</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-800 dark:text-gray-200 font-medium">
                                            {user.personal?.fullName || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {user.personal?.email || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {user.personal?.phone || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 capitalize">
                                            {user.personal?.location || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {user.summary?.jobTitles || "N/A"}
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                            No users found.
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
