"use client";

import React from "react";
import FunderResearchKit from "@/components/FunderResearchKit";

export default function ResearchPage() {
    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-slate-300">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                            Funder Research Kit
                        </h1>
                        <p className="text-sm font-bold text-slate-400">
                            Research like an FBI agent. Only apply to what aligns.
                        </p>
                    </div>
                </div>
                <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
                    Before you write a single word of your application, investigate the funder. Know their board, their past grantees, their priorities. This tool structures your research so you only apply to grants that genuinely fit.
                </p>
            </header>

            <FunderResearchKit />
        </div>
    );
}
