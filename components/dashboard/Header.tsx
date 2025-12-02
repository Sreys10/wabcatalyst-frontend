"use client";

import React from 'react';
import { Search, Bell, ChevronDown, Moon, Sun } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTheme } from '@layouts/partials/ThemeProvider';

const Header = () => {
    const { data: session } = useSession();
    const { theme, toggleTheme } = useTheme();
    const user = session?.user;

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
                <div className="relative flex items-center bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-orange-200 dark:focus-within:ring-orange-800 transition-all">
                    <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3" />
                    <input
                        type="text"
                        placeholder="Search jobs, skills, companies"
                        className="w-full bg-transparent border-none text-sm focus:outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
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

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 font-semibold overflow-hidden">
                        {user?.image ? (
                            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            getInitials(user?.name)
                        )}
                    </div>
                    <div className="hidden md:block">
                        <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">{user?.name || 'Guest User'}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'Please log in'}</div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
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
