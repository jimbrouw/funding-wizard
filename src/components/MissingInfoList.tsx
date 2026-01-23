"use client";

import React from "react";
import { MissingItem } from "@/lib/schema";

type MissingInfoListProps = {
    items: MissingItem[];
    onGoToQuestion: (stepId: string, questionId: string) => void;
    onGoToOutput: (slotId: string) => void;
};

export default function MissingInfoList({
    items,
    onGoToQuestion,
    onGoToOutput,
}: MissingInfoListProps) {
    const missingQuestions = items.filter((i) => i.kind === "question");
    const incompleteOutputs = items.filter((i) => i.kind === "output");

    return (
        <div className="space-y-12">
            <section className="space-y-6">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Required answers missing ({missingQuestions.length})
                </h2>

                {missingQuestions.length === 0 ? (
                    <p className="text-sm font-bold text-emerald-600 flex items-center gap-2 bg-emerald-50 p-4 rounded-xl">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        No missing required answers.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {missingQuestions.map((item: any) => (
                            <button
                                key={`${item.stepId}-${item.questionId}`}
                                onClick={() => onGoToQuestion(item.stepId, item.questionId)}
                                className="group flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:border-slate-900 transition-all text-left"
                            >
                                <div className="space-y-1">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{item.stepId}</p>
                                    <p className="font-bold text-slate-900">{item.label}</p>
                                </div>
                                <svg className="w-5 h-5 text-slate-300 group-hover:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        ))}
                    </div>
                )}
            </section>

            <section className="space-y-6">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Output sections incomplete ({incompleteOutputs.length})
                </h2>

                {incompleteOutputs.length === 0 ? (
                    <p className="text-sm font-bold text-emerald-600 flex items-center gap-2 bg-emerald-50 p-4 rounded-xl">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        All output sections are complete.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {incompleteOutputs.map((item: any) => (
                            <button
                                key={item.slotId}
                                onClick={() => onGoToOutput(item.slotId)}
                                className="group flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:border-slate-900 transition-all text-left"
                            >
                                <div className="space-y-1">
                                    <p className="font-bold text-slate-900">{item.title}</p>
                                    <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">
                                        Missing: {item.missingInputs.join(", ")}
                                    </p>
                                </div>
                                <svg className="w-5 h-5 text-slate-300 group-hover:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
