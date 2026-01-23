"use client";

import React from "react";
import { OutputSlot, OutputStatus } from "@/lib/schema";

type OutputCardProps = {
    slot: OutputSlot;
    status: OutputStatus;
    text: string; // empty if incomplete
    currentLength?: number;
    missingInputs?: string[];
    onCopy: () => void;
    onEditInputs: () => void; // navigate to first relevant step
    onRewriteAI?: () => void; // optional
    onTrimToLimit?: () => void; // optional
};

export default function OutputCard({
    slot,
    status,
    text,
    currentLength = 0,
    missingInputs = [],
    onCopy,
    onEditInputs,
    onRewriteAI,
    onTrimToLimit,
}: OutputCardProps) {
    const isOverLimit = status === "over_limit";
    const isIncomplete = status === "incomplete";

    return (
        <div className={`rounded-3xl border-2 transition-all p-8 space-y-6 ${isIncomplete
                ? "border-slate-100 bg-slate-50/50"
                : isOverLimit
                    ? "border-amber-200 bg-white shadow-xl shadow-amber-50"
                    : "border-slate-200 bg-white shadow-sm hover:shadow-xl hover:shadow-slate-100"
            }`}>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-1">
                    <h2 className="text-xl font-black text-slate-900">{slot.title}</h2>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <span className="flex items-center gap-1">
                            <span className="text-slate-300">Target:</span>
                            <span className="text-slate-600">{slot.grantiumFieldId || "Draft"}</span>
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="text-slate-300">Limit:</span>
                            <span className={`${isOverLimit ? "text-amber-600" : "text-slate-600"}`}>
                                {slot.maxChars || "∞"} chars
                            </span>
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="text-slate-300">Current:</span>
                            <span className={`${isOverLimit ? "text-amber-600 font-black" : "text-slate-600"}`}>
                                {currentLength} chars
                            </span>
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {!isIncomplete && (
                        <button
                            onClick={onCopy}
                            className="px-4 py-2 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                            Copy
                        </button>
                    )}
                    <button
                        onClick={onEditInputs}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-900 text-xs font-black rounded-xl hover:border-slate-900 transition-all"
                    >
                        Edit inputs
                    </button>
                </div>
            </div>

            <div className="relative">
                {isIncomplete ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="space-y-1">
                            <p className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Incomplete Section</p>
                            <p className="text-sm font-bold text-slate-600">Missing: {missingInputs.join(", ")}</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className={`p-6 rounded-2xl bg-slate-50 border-l-4 font-medium leading-relaxed text-slate-800 break-words whitespace-pre-wrap ${isOverLimit ? "border-amber-400" : "border-slate-300"
                            }`}>
                            {text}
                        </div>

                        {isOverLimit && (
                            <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-xs font-bold text-amber-700">Over the limit. Use “Trim to limit”.</p>
                                </div>
                                {onTrimToLimit && (
                                    <button
                                        onClick={onTrimToLimit}
                                        className="px-4 py-2 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-amber-600 transition-all"
                                    >
                                        Trim to limit
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            {!isIncomplete && onRewriteAI && (
                <div className="flex justify-end">
                    <button
                        onClick={onRewriteAI}
                        className="group flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all"
                    >
                        <svg className="w-4 h-4 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Rewrite (AI)
                    </button>
                </div>
            )}
        </div>
    );
}
