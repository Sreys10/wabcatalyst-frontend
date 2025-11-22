"use client";

import React from 'react';
import Sidebar from '../../../components/dashboard/Sidebar';
import Header from '../../../components/dashboard/Header';
import ProfileContent from '../../../components/dashboard/ProfileContent';

export default function ProfilePage() {
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Header />
                <main className="flex-1 overflow-y-auto">
                    <ProfileContent />
                </main>
            </div>
        </div>
    );
}
