import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { useSession } from 'next-auth/react';

const Header = () => {
    const { data: session } = useSession();
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
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8">
            <div className="flex-1 max-w-2xl">
                <div className="relative flex items-center bg-gray-50 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-orange-200 transition-all">
                    <Search className="w-5 h-5 text-gray-400 mr-3" />
                    <input
                        type="text"
                        placeholder="Search jobs, skills, companies"
                        className="w-full bg-transparent border-none text-sm focus:outline-none text-gray-700 placeholder-gray-400"
                    />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold overflow-hidden">
                        {user?.image ? (
                            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            getInitials(user?.name)
                        )}
                    </div>
                    <div className="hidden md:block">
                        <div className="text-sm font-semibold text-gray-700">{user?.name || 'Guest User'}</div>
                        <div className="text-xs text-gray-500">{user?.email || 'Please log in'}</div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
                <button className="relative p-2 hover:bg-gray-50 rounded-full transition-colors group">
                    <Bell className="w-5 h-5 text-gray-500 group-hover:text-orange-600 transition-colors" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
            </div>
        </header>
    );
};

export default Header;
