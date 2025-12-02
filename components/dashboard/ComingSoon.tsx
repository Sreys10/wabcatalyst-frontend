"use client";

import React from 'react';
import { Construction, Sparkles } from 'lucide-react';

interface ComingSoonProps {
    title?: string;
    description?: string;
}

const ComingSoon = ({
    title = "Feature Coming Soon",
    description = "We're working hard to bring you this feature. Stay tuned for updates!"
}: ComingSoonProps) => {
    return (
        <div className="flex items-center justify-center min-h-[60vh] p-8">
            <div className="text-center max-w-md">
                <div className="mb-6 flex justify-center">
                    <div className="relative">
                        <div className="w-24 h-24 bg-orange-100 dark:bg-orange-900/40 rounded-full flex items-center justify-center">
                            <Construction className="w-12 h-12 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="absolute -top-2 -right-2">
                            <Sparkles className="w-6 h-6 text-orange-500 dark:text-orange-400 animate-pulse" />
                        </div>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3">{title}</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">{description}</p>

                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                    <p className="text-sm text-orange-800 dark:text-orange-200">
                        We're constantly improving our platform. Check back soon for this exciting new feature!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ComingSoon;


