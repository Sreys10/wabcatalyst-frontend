"use client";

import Sidebar from '../../components/dashboard/Sidebar';
import Header from '../../components/dashboard/Header';
import DashboardContent from '../../components/dashboard/DashboardContent';

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-sans text-slate-900 dark:text-gray-100 transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <DashboardContent />
        </main>
      </div>
    </div>
  );
}
