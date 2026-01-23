"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { downloadJson } from "@/lib/engine";

export default function NotEligiblePage() {
    const router = useRouter();
    const { answers, profile } = useApp();

    const handleExport = () => {
        downloadJson("funding_wizard_answers.json", { profile, answers });
    };

    return (
        <div className="max-w-2xl mx-auto space-y-12 py-12 animate-in fade-in duration-700">
            <div className="w-20 h-20 rounded-[2rem] bg-amber-50 flex items-center justify-center text-amber-500">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>

            <header className="space-y-4">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                    This version only supports Arts Council England routes
                </h1>
                <p className="text-xl text-slate-500 leading-relaxed">
                    If you’re not based in England, you may still be eligible for other funders.
                    This tool can’t recommend those routes yet.
                </p>
            </header>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={handleExport}
                    className="flex-grow py-5 bg-slate-900 text-white rounded-3xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                >
                    Export my answers (JSON)
                </button>
                <button
                    onClick={() => router.push("/")}
                    className="px-12 py-5 bg-white border-2 border-slate-100 text-slate-900 rounded-3xl font-black text-lg hover:border-slate-900 transition-all"
                >
                    Back
                </button>
            </div>
        </div>
    );
}
