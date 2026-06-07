"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Step, Question, OutputSlot } from "@/lib/schema";
import { computeOutput, copyToClipboard, downloadJson } from "@/lib/engine";
import OutputCard from "@/components/OutputCard";
import TableCard from "@/components/TableCard";

export default function OutputsPage() {
    const router = useRouter();
    const { answers, currentRoute, profile } = useApp();
    const [routeData, setRouteData] = useState<{
        steps: Step[];
        questions: Record<string, Question[]>;
        outputs: OutputSlot[];
    } | null>(null);

    useEffect(() => {
        if (!currentRoute) {
            router.push("/route-picker");
            return;
        }

        fetch(`/api/content?type=wizard&id=${currentRoute.id}`)
            .then((res) => res.json())
            .then((data) => {
                setRouteData(data);
            });
    }, [currentRoute]);

    if (!routeData) return null;

    const handleCopyAll = async () => {
        const allText = routeData.outputs
            .map((slot) => {
                const res = computeOutput(slot, answers);
                return res.status === "complete" || res.status === "over_limit"
                    ? `[${slot.title}]\n${res.text}`
                    : `[${slot.title}]\nINCOMPLETE`;
            })
            .join("\n\n---\n\n");

        await copyToClipboard(allText);
        alert("Copied all outputs to clipboard.");
    };

    const handleExportAnswers = () => {
        downloadJson("vibe_cheque_answers.json", { profile, answers });
    };

    const handleExportOutputs = () => {
        const outputs = routeData.outputs.map(slot => ({
            ...slot,
            computed: computeOutput(slot, answers)
        }));
        downloadJson("vibe_cheque_outputs.json", outputs);
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <header className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                    <div className="space-y-4">
                        <h1 className="text-5xl font-black text-slate-900 tracking-tight">Your draft outputs</h1>
                        <p className="text-xl text-slate-500 max-w-2xl leading-relaxed">
                            Each card shows where to paste it in Grantium and the character limit.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={handleCopyAll}
                            className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-sm shadow-xl shadow-slate-200"
                        >
                            Copy all outputs
                        </button>
                        <button
                            onClick={handleExportAnswers}
                            className="px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl font-black text-sm hover:border-slate-900 transition-all"
                        >
                            Export answers (JSON)
                        </button>
                        <button
                            onClick={handleExportOutputs}
                            className="px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl font-black text-sm hover:border-slate-900 transition-all"
                        >
                            Export outputs (JSON)
                        </button>
                    </div>
                </div>
            </header>

            <div className="space-y-8">
                {routeData.outputs.map((slot) => {
                    const res = computeOutput(slot, answers);

                    if (slot.type === "table") {
                        const tableQuestion = Object.values(routeData.questions)
                            .flat()
                            .find(q => q.id === (slot as any).requiredInputs?.[0]);

                        const rows = (answers[tableQuestion?.id || ""] || []) as any[];
                        const cols = (tableQuestion as any)?.columns || [];

                        return (
                            <TableCard
                                key={slot.id}
                                title={slot.title}
                                grantiumFieldId={slot.grantiumFieldId}
                                rows={rows}
                                columns={cols.map((c: any) => ({ key: c.key, label: c.label }))}
                                onCopyCSV={() => {
                                    const csv = [
                                        cols.map((c: any) => c.label).join(","),
                                        ...rows.map(row => cols.map((c: any) => row[c.key]).join(","))
                                    ].join("\n");
                                    copyToClipboard(csv);
                                    alert("Copied CSV to clipboard.");
                                }}
                            />
                        );
                    }

                    return (
                        <OutputCard
                            key={slot.id}
                            slot={slot}
                            status={res.status}
                            text={res.text}
                            currentLength={res.currentLength}
                            missingInputs={res.missingInputs}
                            onCopy={() => {
                                copyToClipboard(res.text);
                                alert(`Copied "${slot.title}" to clipboard.`);
                            }}
                            onEditInputs={() => {
                                const sourceStep = slot.sourceSteps?.[0] || routeData.steps[0].id;
                                router.push(`/wizard/${currentRoute?.id}?step=${sourceStep}`);
                            }}
                            onRewriteAI={() => alert("AI Rewrite coming soon!")}
                            onTrimToLimit={() => {
                                const trimmed = res.text.slice(0, slot.maxChars);
                                alert("Simulated trim to limit.");
                                // In a real app, we'd update state or suggest changes
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
}
