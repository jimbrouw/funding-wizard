"use client";

import React from "react";
import { OutputSlot, OutputStatus } from "@/lib/schema";

type OutputsMiniPreviewProps = {
    slots: OutputSlot[];
    computed: {
        slotId: string;
        status: OutputStatus;
        textPreview?: string;
        currentLength?: number;
    }[];
    onOpenOutputs: () => void;
};

export default function OutputsMiniPreview({
    slots,
    computed,
    onOpenOutputs,
}: OutputsMiniPreviewProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Affected Outputs
                </h2>
                <button
                    onClick={onOpenOutputs}
                    className="text-[10px] font-black uppercase tracking-widest text-slate-900 hover:opacity-70 transition-opacity"
                >
                    View Full Drafts
                </button>
            </div>

            <div className="space-y-3">
                {slots.map((slot) => {
                    const res = computed.find((c) => c.slotId === slot.id);
                    const status = res?.status || "incomplete";

                    return (
                        <div
                            key={slot.id}
                            className="p-4 rounded-2xl bg-white border border-slate-100 space-y-2 group hover:border-slate-300 transition-all"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <span className="text-xs font-black text-slate-900 leading-tight">
                                    {slot.title}
                                </span>
                                <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-1 ${status === "complete" ? "bg-emerald-500" : status === "over_limit" ? "bg-amber-500" : "bg-slate-200"
                                    }`} />
                            </div>

                            <div className="flex items-center justify-between text-[10px] font-bold">
                                <span className="text-slate-400 uppercase tracking-widest">
                                    {slot.grantiumFieldId || "No target"}
                                </span>
                                <span className={`${status === "over_limit" ? "text-amber-600" : "text-slate-400"}`}>
                                    {res?.currentLength || 0} / {slot.maxChars || "∞"}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
