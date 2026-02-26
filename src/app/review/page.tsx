"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Step, Question, OutputSlot, MissingItem } from "@/lib/schema";
import { computeMissingInfo } from "@/lib/engine";
import MissingInfoList from "@/components/MissingInfoList";
import FiveFactsCheck from "@/components/FiveFactsCheck";

export default function ReviewPage() {
    const router = useRouter();
    const { answers, currentRoute } = useApp();
    const [routeData, setRouteData] = useState<{
        steps: Step[];
        questions: Record<string, Question[]>;
        outputs: OutputSlot[];
    } | null>(null);
    const [missingItems, setMissingItems] = useState<MissingItem[]>([]);

    useEffect(() => {
        if (!currentRoute) {
            router.push("/route-picker");
            return;
        }

        fetch(`/api/content?type=wizard&id=${currentRoute.id}`)
            .then((res) => res.json())
            .then((data) => {
                setRouteData(data);
                const missing = computeMissingInfo(data.steps, data.questions, data.outputs, answers);
                setMissingItems(missing);
            });
    }, [currentRoute, answers]);

    if (!routeData) return null;

    const hasMissing = missingItems.length > 0;

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <header className="space-y-4">
                <h1 className="text-5xl font-black text-slate-900 tracking-tight">Check what’s missing</h1>
                <p className="text-xl text-slate-500 max-w-2xl leading-relaxed">
                    This is a gap check. It doesn’t judge your idea. It shows what’s missing.
                </p>
            </header>

            <MissingInfoList
                items={missingItems}
                onGoToQuestion={(stepId, qId) => router.push(`/wizard/${currentRoute!.id}?step=${stepId}`)}
                onGoToOutput={(slotId) => router.push("/outputs")}
            />

            <FiveFactsCheck answers={answers} />

            {hasMissing && (
                <div className="p-6 bg-amber-50 border-2 border-amber-100 rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shrink-0">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <p className="text-sm font-bold text-amber-900 leading-tight">
                            Some outputs will be incomplete. Don’t paste incomplete text into Grantium.
                        </p>
                    </div>
                    <button
                        onClick={() => router.push("/outputs")}
                        className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm whitespace-nowrap shadow-xl shadow-amber-200/50"
                    >
                        Continue anyway
                    </button>
                </div>
            )}

            <div className="pt-8 flex justify-center">
                {!hasMissing && (
                    <button
                        onClick={() => router.push("/outputs")}
                        className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                    >
                        View final outputs
                    </button>
                )}
            </div>
        </div>
    );
}
