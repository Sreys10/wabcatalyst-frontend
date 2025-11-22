import React from 'react';
import { LayoutDashboard, User, FileText, Sparkles, Briefcase, Bookmark, MessageSquare, Wrench, Settings, HelpCircle } from 'lucide-react';
import Link from 'next/link';

const Sidebar = () => {
    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', active: true },
        { icon: User, label: 'My Profile', active: false },
        { icon: FileText, label: 'My Resume', active: false },
        { icon: Sparkles, label: 'Job Recommendations', active: false },
        { icon: Briefcase, label: 'Applied Jobs', active: false },
        { icon: Bookmark, label: 'Saved Jobs', active: false },
        { icon: MessageSquare, label: 'Messages', active: false },
    ];

    const otherItems = [
        { icon: Wrench, label: 'Career Tools', active: false },
        { icon: Settings, label: 'Settings', active: false },
        { icon: HelpCircle, label: 'Help', active: false },
    ];

    return (
        <div className="w-64 h-screen bg-gray-50 border-r border-gray-200 flex flex-col">
            <div className="p-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">G</div>
                <span className="text-xl font-bold text-orange-900">WebCatalyst</span>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</div>
                <nav className="space-y-1 px-2">
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            href={item.label === 'My Profile' ? '/dashboard/profile' : '#'}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${item.active || (item.label === 'My Profile' && typeof window !== 'undefined' && window.location.pathname === '/dashboard/profile')
                                ? 'bg-orange-50 text-orange-600'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${item.active ? 'text-orange-600' : 'text-gray-400'}`} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="px-4 mt-8 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Others</div>
                <nav className="space-y-1 px-2">
                    {otherItems.map((item, index) => (
                        <Link
                            key={index}
                            href="#"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${item.active
                                ? 'bg-orange-50 text-orange-600'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${item.active ? 'text-orange-600' : 'text-gray-400'}`} />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
