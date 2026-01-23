"use client";

import React from "react";

type RecommendationCardProps = {
    routeTitle: string;
    reason: string;
    onStart: () => void;
};

export default function RecommendationCard({
    routeTitle,
    reason,
    onStart,
}: RecommendationCardProps) {
    return (
        <div className="p-8 rounded-[2.5rem] bg-emerald-50 border-2 border-emerald-100 space-y-8">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div className="space-y-1">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Recommended Route</h2>
                    <p className="text-2xl font-black text-slate-900">{routeTitle}</p>
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="text-sm font-black text-slate-900">Why this route?</h3>
                <p className="text-slate-600 leading-relaxed">{reason}</p>
            </div>

            <button
                onClick={onStart}
                className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl shadow-emerald-200/50"
            >
                Start this route
            </button>
        </div>
    );
}
