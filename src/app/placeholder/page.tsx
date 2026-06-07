"use client";

import React, { Suspense, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { downloadJson } from "@/lib/engine";

function PlaceholderContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { answers, profile } = useApp();
    const routeParam = searchParams.get("route") || "unknown";

    const handleExport = () => {
        downloadJson("vibe_cheque_answers_partial.json", { profile, answers });
    };

    return (
        <div className="max-w-2xl mx-auto space-y-12 py-12 animate-in fade-in duration-700">
            <div className="w-20 h-20 rounded-[2rem] bg-slate-100 flex items-center justify-center text-slate-400">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            </div>

            <header className="space-y-4">
                <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">
                    Not implemented in v0.1
                </h1>
                <p className="text-xl text-slate-500 leading-relaxed">
                    The <span className="text-slate-900 font-bold">"{routeParam.replace(/_/g, " ")}"</span> route is planned, but not built yet.
                    You can still export what you’ve entered so far.
                </p>
            </header>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => router.push("/route-picker")}
                    className="flex-grow py-5 bg-slate-900 text-white rounded-3xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                >
                    Back to route picker
                </button>
                <button
                    onClick={handleExport}
                    className="px-12 py-5 bg-white border-2 border-slate-100 text-slate-900 rounded-3xl font-black text-lg hover:border-slate-900 transition-all"
                >
                    Export answers (JSON)
                </button>
            </div>
        </div>
    );
}

export default function PlaceholderPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PlaceholderContent />
        </Suspense>
    );
}
