"use client";

import React from "react";
import Link from "next/link";

type AppShellProps = {
    children: React.ReactNode;
    hasAnswers: boolean;
    hasOutputs: boolean;
    onExportAnswers: () => void;
    onCopyOutputs: () => void;
};

export default function AppShell({
    children,
    hasAnswers,
    hasOutputs,
    onExportAnswers,
    onCopyOutputs,
}: AppShellProps) {
    return (
        <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex flex-col">
                            <span className="text-xl font-black tracking-tight text-slate-900">
                                Funding Wizard
                            </span>
                            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                                v0.1 · Beta
                            </span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-1">
                            <Link
                                href="/"
                                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                            >
                                Start
                            </Link>
                            <Link
                                href="/route-picker"
                                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                            >
                                Routes
                            </Link>
                            <Link
                                href="/grant-engine"
                                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                            >
                                Grant Engine
                            </Link>
                            <div className="w-px h-5 bg-slate-200 mx-1" />
                            <Link
                                href="/storytelling"
                                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                            >
                                Story Builder
                            </Link>
                            <Link
                                href="/research"
                                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                            >
                                Research
                            </Link>
                            <Link
                                href="/alerts"
                                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                            >
                                Alerts
                            </Link>
                            <div className="w-px h-5 bg-slate-200 mx-1" />
                            <Link
                                href="/subscribe"
                                className="px-3 py-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            >
                                Subscribe
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-3">
                        {hasAnswers && (
                            <button
                                onClick={onExportAnswers}
                                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Export JSON
                            </button>
                        )}
                        {hasOutputs && (
                            <button
                                onClick={onCopyOutputs}
                                className="flex items-center gap-2 px-5 py-2.5 text-sm font-black bg-slate-900 text-white hover:bg-slate-800 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                                Copy Outputs
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-12">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 py-12">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col gap-1 text-center md:text-left">
                        <span className="text-sm font-bold text-slate-900">Funding Wizard</span>
                        <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                            Turn rough notes into Grantium-ready answers.
                            Not official guidance. You are responsible for what you submit.
                        </p>
                    </div>

                    <div className="flex items-center gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <span>Arts Council England Support</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                        <span>v0.1 Beta</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
