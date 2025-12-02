"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, AlertTriangle, CheckCircle, Award, BookOpen, Target, Zap, Download } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function ATSReportPage() {
    const router = useRouter();
    const [atsReport, setAtsReport] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchATSReport = async () => {
            try {
                const res = await fetch('/api/ats/calculate', {
                    method: 'POST',
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.data) {
                        setAtsReport(data.data);
                    }
                }
            } catch (error) {
                console.error("Error fetching ATS report:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchATSReport();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300">Loading your ATS report...</p>
                </div>
            </div>
        );
    }

    if (!atsReport) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">No ATS report available</p>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const { score, suggestions, strengths, weaknesses, industryInsights } = atsReport;

    const getGradeColor = (grade: string) => {
        if (['A+', 'A'].includes(grade)) return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
        if (['B+', 'B'].includes(grade)) return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
        if (['C+', 'C'].includes(grade)) return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400';
        return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
    };

    const getScoreColor = (value: number) => {
        if (value >= 80) return 'bg-green-500';
        if (value >= 60) return 'bg-blue-500';
        if (value >= 40) return 'bg-orange-500';
        return 'bg-red-500';
    };

    const scoreData = [
        { name: 'Score', value: score.total },
        { name: 'Remaining', value: 100 - score.total },
    ];

    const COLORS = ['#f97316', '#e5e7eb'];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Dashboard
                    </button>
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <Zap className="w-8 h-8 text-orange-500 fill-orange-500" />
                                ATS Analysis Report
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">
                                Generated on {new Date(atsReport.analyzedAt).toLocaleDateString()}
                            </p>
                        </div>
                        <button className="px-6 py-2.5 rounded-xl bg-orange-600 text-white font-medium hover:bg-orange-700 shadow-lg shadow-orange-200 dark:shadow-orange-900/20 transition-all flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Download PDF
                        </button>
                    </div>
                </div>

                {/* Top Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Total Score */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-800 dark:to-gray-800/50 p-8 rounded-2xl border border-orange-200 dark:border-gray-700 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Target className="w-32 h-32 text-orange-600" />
                        </div>
                        <div className="relative">
                            <span className="text-sm font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider">Overall Score</span>
                            <div className="flex items-center justify-between mt-4">
                                <div>
                                    <div className="text-5xl font-bold text-gray-900 dark:text-white">
                                        {score.total}<span className="text-2xl text-gray-400 font-normal">/100</span>
                                    </div>
                                    <div className={`mt-3 px-3 py-1 rounded-full text-sm font-bold inline-block ${getGradeColor(score.grade)}`}>
                                        Grade {score.grade}
                                    </div>
                                </div>
                                <div className="w-24 h-24">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={scoreData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={25}
                                                outerRadius={40}
                                                startAngle={90}
                                                endAngle={-270}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {scoreData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Percentile */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <TrendingUp className="w-10 h-10 text-blue-500 mb-4" />
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Top Percentile</span>
                        <div className="text-4xl font-bold text-gray-900 dark:text-white mt-2">
                            Top {100 - score.percentile}%
                        </div>
                        <p className="text-sm text-gray-400 mt-2">Better than {score.percentile}% of candidates</p>
                    </div>

                    {/* Summary */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-purple-500" />
                            AI Summary
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            {score.reasoning}
                        </p>
                    </div>
                </div>

                {/* Score Breakdown */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Score Breakdown</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        {Object.entries(score.breakdown).map(([key, value]: [string, any]) => (
                            <div key={key} className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-xl">
                                <div className="flex justify-between items-end mb-3">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300 capitalize">{key}</span>
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
                                </div>
                                <div className="h-3 w-full bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all ${getScoreColor((value / (key === 'experience' ? 20 : key === 'education' || key === 'keywords' ? 15 : 25)) * 100)}`}
                                        style={{ width: `${(value / (key === 'experience' ? 20 : key === 'education' || key === 'keywords' ? 15 : 25)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Strengths */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                            <CheckCircle className="w-6 h-6 text-green-500" />
                            Key Strengths
                        </h2>
                        <div className="space-y-3">
                            {strengths.map((strength: string, i: number) => (
                                <div key={i} className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/30">
                                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{strength}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Weaknesses */}
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                            Areas for Improvement
                        </h2>
                        <div className="space-y-3">
                            {weaknesses.map((weakness: string, i: number) => (
                                <div key={i} className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
                                    <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{weakness}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Critical Suggestions */}
                {suggestions.critical && suggestions.critical.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <AlertTriangle className="w-6 h-6 text-orange-500" />
                            Critical Actions Required
                        </h2>
                        <div className="grid gap-4">
                            {suggestions.critical.map((item: any, i: number) => (
                                <div key={i} className="bg-white dark:bg-gray-700/50 p-6 rounded-xl border-l-4 border-orange-500">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{item.issue}</h3>
                                        <span className="text-xs font-bold text-orange-600 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded uppercase">High Priority</span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 mb-3">{item.action}</p>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4" />
                                        Impact: {item.impact}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Industry Insights */}
                {industryInsights && (
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-8 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 shadow-sm">
                        <h2 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center gap-2">
                            <Award className="w-6 h-6" />
                            Industry Insights
                        </h2>
                        <p className="text-indigo-800 dark:text-indigo-200 leading-relaxed">
                            {industryInsights}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
