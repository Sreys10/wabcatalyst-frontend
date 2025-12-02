import React from 'react';
import { X, TrendingUp, AlertTriangle, CheckCircle, Award, BookOpen, Target, Zap } from 'lucide-react';

interface ATSReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
}

const ATSReportModal: React.FC<ATSReportModalProps> = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    const { score, suggestions, strengths, weaknesses, industryInsights } = data;

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

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-900 w-full max-w-4xl my-8 rounded-3xl shadow-2xl flex flex-col border border-gray-100 dark:border-gray-800">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Zap className="w-6 h-6 text-orange-500 fill-orange-500" />
                            ATS Analysis Report
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Generated on {new Date(data.analyzedAt).toLocaleDateString()}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500 dark:text-gray-400"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">

                    {/* Top Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Total Score */}
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-800 dark:to-gray-800/50 p-6 rounded-2xl border border-orange-200 dark:border-gray-700 flex flex-col items-center justify-center text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Target className="w-24 h-24 text-orange-600" />
                            </div>
                            <span className="text-sm font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-2">Overall Score</span>
                            <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                                {score.total}<span className="text-2xl text-gray-400 font-normal">/100</span>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(score.grade)}`}>
                                Grade {score.grade}
                            </div>
                        </div>

                        {/* Percentile */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-center shadow-sm">
                            <TrendingUp className="w-8 h-8 text-blue-500 mb-3" />
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Top Percentile</span>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                Top {100 - score.percentile}%
                            </div>
                            <p className="text-xs text-gray-400 mt-2">Better than {score.percentile}% of candidates</p>
                        </div>

                        {/* Summary */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col justify-center shadow-sm">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-purple-500" />
                                AI Summary
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-4">
                                {score.reasoning}
                            </p>
                        </div>
                    </div>

                    {/* Score Breakdown */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Score Breakdown</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            {Object.entries(score.breakdown).map(([key, value]: [string, any]) => (
                                <div key={key} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 capitalize">{key}</span>
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">{value}</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${getScoreColor((value / (key === 'experience' ? 20 : key === 'education' || key === 'keywords' ? 15 : 25)) * 100)}`}
                                            style={{ width: `${(value / (key === 'experience' ? 20 : key === 'education' || key === 'keywords' ? 15 : 25)) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Strengths */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                Key Strengths
                            </h3>
                            <div className="bg-green-50 dark:bg-green-900/10 rounded-2xl p-1 border border-green-100 dark:border-green-900/30">
                                {strengths.map((strength: string, i: number) => (
                                    <div key={i} className="flex items-start gap-3 p-3 hover:bg-white/50 dark:hover:bg-white/5 rounded-xl transition-colors">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">{strength}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Weaknesses */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                Areas for Improvement
                            </h3>
                            <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-1 border border-red-100 dark:border-red-900/30">
                                {weaknesses.map((weakness: string, i: number) => (
                                    <div key={i} className="flex items-start gap-3 p-3 hover:bg-white/50 dark:hover:bg-white/5 rounded-xl transition-colors">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">{weakness}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Critical Suggestions */}
                    {suggestions.critical && suggestions.critical.length > 0 && (
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-orange-500" />
                                Critical Actions Required
                            </h3>
                            <div className="grid gap-4">
                                {suggestions.critical.map((item: any, i: number) => (
                                    <div key={i} className="bg-white dark:bg-gray-800 p-5 rounded-xl border-l-4 border-orange-500 shadow-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-semibold text-gray-900 dark:text-white">{item.issue}</h4>
                                            <span className="text-xs font-bold text-orange-600 bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded uppercase">High Priority</span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{item.action}</p>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" />
                                            Impact: {item.impact}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Industry Insights */}
                    {industryInsights && (
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                            <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-100 mb-3 flex items-center gap-2">
                                <Award className="w-5 h-5" />
                                Industry Insights
                            </h3>
                            <p className="text-sm text-indigo-800 dark:text-indigo-200 leading-relaxed">
                                {industryInsights}
                            </p>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-white dark:hover:bg-gray-800 transition-colors"
                    >
                        Close
                    </button>
                    <button className="px-6 py-2.5 rounded-xl bg-orange-600 text-white font-medium hover:bg-orange-700 shadow-lg shadow-orange-200 dark:shadow-orange-900/20 transition-all transform hover:-translate-y-0.5">
                        Download PDF Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ATSReportModal;
