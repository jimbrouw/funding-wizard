"use client";

import React from "react";
import StoryBuilder from "@/components/StoryBuilder";

export default function StorytellingPage() {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-200">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                            Story Builder
                        </h1>
                        <p className="text-sm font-bold text-slate-400">
                            Show, don't tell. Turn experience into narrative.
                        </p>
                    </div>
                </div>
                <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
                    Stop listing your CV. Start telling stories. This tool walks you through turning a real experience into a compelling narrative that funders actually want to read.
                </p>
            </header>

            {/* The difference */}
            <div className="flex items-start gap-4 p-5 bg-amber-50/60 border border-amber-100 rounded-2xl">
                <span className="shrink-0 mt-0.5 text-2xl">📖</span>
                <div className="text-sm text-amber-800 leading-relaxed">
                    <strong>Why storytelling wins grants:</strong> Funders read hundreds of applications. The ones that stick aren't the ones with the longest CVs — they're the ones with the most vivid, specific stories. A single concrete example proves more about your ability than a page of credentials.
                </div>
            </div>

            <StoryBuilder />
        </div>
    );
}
