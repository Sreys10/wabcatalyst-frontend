"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, User, FileText, Sparkles, Briefcase, Bookmark, MessageSquare, Wrench, Settings, HelpCircle } from 'lucide-react';
import Link from 'next/link';

const Sidebar = () => {
    const pathname = usePathname();
    
    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: User, label: 'My Profile', href: '/dashboard/profile' },
        { icon: FileText, label: 'My Resume', href: '/dashboard/resume' },
        { icon: Sparkles, label: 'Job Recommendations', href: '#' },
        { icon: Briefcase, label: 'Applied Jobs', href: '#' },
        { icon: Bookmark, label: 'Saved Jobs', href: '#' },
        { icon: MessageSquare, label: 'Messages', href: '#' },
    ];

    const otherItems = [
        { icon: Wrench, label: 'Career Tools', active: false },
        { icon: Settings, label: 'Settings', active: false },
        { icon: HelpCircle, label: 'Help', active: false },
    ];

    return (
        <div className="w-64 h-screen bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-200">
            <div className="p-6 flex items-center gap-3">
                <img src="/images/logo.png" alt="WabCatalyst Logo" className="w-8 h-8 object-contain" />
                <span className="text-xl font-bold text-gray-800 dark:text-gray-100">WabCatalyst</span>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <div className="px-4 mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Menu</div>
                <nav className="space-y-1 px-2">
                    {menuItems.map((item, index) => {
                        const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/dashboard');
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400 dark:text-gray-500'}`} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="px-4 mt-8 mb-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Others</div>
                <nav className="space-y-1 px-2">
                    {otherItems.map((item, index) => (
                        <Link
                            key={index}
                            href="#"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${item.active
                                ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${item.active ? 'text-orange-600 dark:text-orange-400' : 'text-gray-400 dark:text-gray-500'}`} />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
