"use client";

import React, { useState } from "react";

export default function GrantResearchGuide() {
    const [isOpen, setIsOpen] = useState(false);

    const tips = [
        {
            id: "eligible_vs_qualified",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            title: "Eligible ≠ Qualified",
            body: "Meeting the eligibility criteria (age, location, baseline) doesn't mean you qualify. Before applying, research past winners — their locations, demographics, and project types. If every past winner shares traits you don't, factor that into your decision.",
        },
        {
            id: "dont_google",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            ),
            title: "Don't Google for grants",
            body: "Google search surfaces expired grants and winner announcements — neither helps you find open opportunities. Instead, use Google Alerts with specific keywords like your discipline + 'open call' or 'funding'. Better keywords = better leads, delivered straight to your inbox.",
        },
        {
            id: "funder_research",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            title: "Research like an FBI agent",
            body: "Before you write a single word, know the funders: board members, past winners, their projects, project themes and geographic patterns. Only apply to grants that are genuinely aligned with what you're creating. Selective applications beat mass applications every time.",
        },
        {
            id: "five_facts",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
            ),
            title: "Five Facts of Funding",
            body: "Every funded idea shows: (1) a clear outcome, (2) a defined audience, (3) realistic scope, (4) a logical budget, and (5) proof you can deliver. Most creatives stop at inspiration — funders are looking for architecture.",
        },
    ];

    return (
        <div className="rounded-3xl border-2 border-slate-100 bg-white overflow-hidden transition-all shadow-sm">
            {/* Toggle header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-5 flex items-center justify-between text-left group hover:bg-slate-50/50 transition-all"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-violet-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-base font-black text-slate-900">Before You Begin</h3>
                        <p className="text-xs text-slate-400 font-bold">Strategic tips that separate funded projects from rejected ones</p>
                    </div>
                </div>
                <svg
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Expandable content */}
            {isOpen && (
                <div className="px-6 pb-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="h-px bg-slate-100" />
                    {tips.map((tip) => (
                        <div
                            key={tip.id}
                            className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100"
                        >
                            <div className="shrink-0 mt-0.5 text-violet-500">
                                {tip.icon}
                            </div>
                            <div className="min-w-0">
                                <h4 className="text-sm font-black text-slate-900">{tip.title}</h4>
                                <p className="text-sm text-slate-600 leading-relaxed mt-1">{tip.body}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
