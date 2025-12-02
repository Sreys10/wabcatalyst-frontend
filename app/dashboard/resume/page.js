"use client";

import React from 'react';
import Sidebar from '../../../components/dashboard/Sidebar';
import Header from '../../../components/dashboard/Header';
import ComingSoon from '../../../components/dashboard/ComingSoon';

export default function ResumePage() {
    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden font-sans transition-colors duration-200">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Header />
                <main className="flex-1 overflow-y-auto">
                    <ComingSoon
                        title="My Resume - Coming Soon"
                        description="We're building an amazing resume builder for you. Stay tuned for updates!"
                    />
                </main>
            </div>
        </div>
    );
}
