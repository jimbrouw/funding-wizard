"use client";

import React from "react";

type FiveFactsCheckProps = {
    answers: Record<string, any>;
};

type Fact = {
    id: string;
    label: string;
    pass: boolean;
    tip: string;
};

export default function FiveFactsCheck({ answers }: FiveFactsCheckProps) {
    const facts: Fact[] = [
        {
            id: "clear_outcome",
            label: "Clear outcome",
            pass: !!(answers["q_one_sentence"] && String(answers["q_one_sentence"]).trim().length > 10),
            tip: "What specific thing will exist after the money is spent? Make this concrete.",
        },
        {
            id: "defined_audience",
            label: "Defined audience",
            pass: !!(answers["q_target_audience"] && String(answers["q_target_audience"]).trim().length > 3),
            tip: "Who exactly will experience this? Be specific — 'everyone' is not an audience.",
        },
        {
            id: "realistic_scope",
            label: "Realistic scope",
            pass: !!(answers["project_start_date"] && answers["project_end_date"] && answers["q_activities_list"]),
            tip: "Can you actually do this in the time and budget proposed? Check your dates and activities.",
        },
        {
            id: "logical_budget",
            label: "Logical budget",
            pass: !!(answers["elig_amount_requested"] && answers["budget_expenditure_table"] && Array.isArray(answers["budget_expenditure_table"]) && answers["budget_expenditure_table"].length > 0),
            tip: "Do the numbers add up? Every budget line should be justified.",
        },
        {
            id: "proof_of_capacity",
            label: "Proof of capacity",
            pass: !!(
                (answers["pm_experience_choice"] === "yes") ||
                (answers["pm_experience_choice"] === "no" && answers["pm_experience_support_1500"] && String(answers["pm_experience_support_1500"]).trim().length > 10)
            ),
            tip: "Can you prove you can deliver this? Use transferable proof from adjacent experiences.",
        },
    ];

    const passCount = facts.filter((f) => f.pass).length;
    const allPass = passCount === facts.length;

    return (
        <div className={`rounded-3xl border-2 overflow-hidden transition-all ${allPass
            ? "border-emerald-200 bg-emerald-50/30"
            : "border-amber-200 bg-white"
            }`}>
            {/* Header */}
            <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${allPass ? "bg-emerald-500 text-white" : "bg-amber-100 text-amber-600"
                            }`}>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 2a6 6 0 00-2 11.66V16a2 2 0 002 2h0a2 2 0 002-2v-2.34A6 6 0 0010 2zm0 2a4 4 0 011.54 7.69.75.75 0 00-.54.72V14H9v-1.59a.75.75 0 00-.54-.72A4 4 0 0110 4z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-900">Five Facts of Funding</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                {passCount}/{facts.length} met
                            </p>
                        </div>
                    </div>
                </div>
                <p className="mt-3 text-sm text-slate-500">
                    Every funded idea shows these five things. Ideas without architecture get rejected.
                </p>
            </div>

            {/* Facts */}
            <div className="divide-y divide-slate-100">
                {facts.map((fact) => (
                    <div
                        key={fact.id}
                        className={`px-6 py-4 flex items-start gap-4 transition-all ${fact.pass ? "bg-white/50" : "bg-amber-50/30"
                            }`}
                    >
                        <div className={`shrink-0 mt-0.5 ${fact.pass ? "text-emerald-500" : "text-amber-400"}`}>
                            {fact.pass ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.74-5.24Z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className={`text-sm font-black ${fact.pass ? "text-slate-700" : "text-slate-900"}`}>
                                {fact.label}
                            </p>
                            {!fact.pass && (
                                <p className="text-xs text-amber-700 mt-1 leading-relaxed">{fact.tip}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
