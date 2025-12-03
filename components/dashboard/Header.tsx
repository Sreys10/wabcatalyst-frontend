"use client";

import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown, Moon, Sun } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from '@layouts/partials/ThemeProvider';

const Header = () => {
    const { data: session } = useSession();
    const { theme, toggleTheme } = useTheme();
    const user = session?.user;
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        if (isProfileOpen && !profileData) {
            fetch('/api/profile')
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setProfileData(data.profile);
                    }
                })
                .catch(err => console.error("Failed to fetch profile:", err));
        }
    }, [isProfileOpen, profileData]);

    // Get initials from name
    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || 'JD';
    };

    return (
        <header className="h-20 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between px-6 md:px-8 transition-colors duration-200">
            <div className="flex-1 max-w-md mr-6">
                <div className="relative flex items-center bg-gray-100 dark:bg-gray-900 border border-transparent dark:border-gray-700 rounded-full px-4 py-2.5 focus-within:ring-2 focus-within:ring-orange-500/20 dark:focus-within:ring-orange-500/20 transition-all">
                    <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3" />
                    <input
                        type="text"
                        placeholder="Search jobs, skills, companies"
                        className="w-full bg-transparent border-none text-sm focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 appearance-none"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? (
                        <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    ) : (
                        <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    )}
                </button>

                <div className="relative">
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2 rounded-xl transition-all"
                    >
                        <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 font-semibold overflow-hidden border border-orange-200 dark:border-orange-800">
                            {user?.image ? (
                                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                getInitials(user?.name)
                            )}
                        </div>
                        <div className="hidden md:block text-left">
                            <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">{user?.name || 'Guest User'}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'Please log in'}</div>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Profile Dropdown */}
                    {isProfileOpen && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsProfileOpen(false)}
                            />
                            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-6 flex flex-col items-center border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                                    <div className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 text-2xl font-bold overflow-hidden mb-3 border-4 border-white dark:border-gray-700 shadow-sm">
                                        {user?.image ? (
                                            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                        ) : (
                                            getInitials(user?.name)
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{user?.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                                    {profileData?.personal?.phone && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                                            <span>📞</span> {profileData.personal.phone}
                                        </p>
                                    )}
                                </div>
                                <div className="p-2">
                                    <button
                                        onClick={() => {
                                            // Navigate to profile
                                            window.location.href = '/dashboard/profile';
                                        }}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
                                    >
                                        View Profile
                                    </button>
                                    <button
                                        onClick={() => {
                                            signOut({ callbackUrl: '/login' });
                                            setIsProfileOpen(false);
                                        }}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors group">
                    <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                </button>
            </div>
        </header>
    );
};

export default Header;
