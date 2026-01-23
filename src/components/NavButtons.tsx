"use client";

import React from "react";

type NavButtonsProps = {
    onBack: () => void;
    onNext: () => void;
    nextDisabled: boolean;
    nextMessage?: string; // shown when disabled
};

export default function NavButtons({
    onBack,
    onNext,
    nextDisabled,
    nextMessage,
}: NavButtonsProps) {
    return (
        <div className="pt-8 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                    onClick={onBack}
                    className="w-full sm:w-auto px-8 py-4 text-sm font-black text-slate-500 hover:text-slate-900 transition-colors bg-white rounded-2xl border-2 border-slate-100 hover:border-slate-200"
                >
                    Back
                </button>

                <div className="flex-grow group relative w-full sm:w-auto">
                    <button
                        onClick={onNext}
                        disabled={nextDisabled}
                        className={`w-full py-4 px-12 rounded-2xl text-lg font-black transition-all ${nextDisabled
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200 hover:-translate-y-0.5 active:translate-y-0"
                            }`}
                    >
                        Next
                    </button>

                    {nextDisabled && nextMessage && (
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                            {nextMessage}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
                        </div>
                    )}
                </div>
            </div>

            {nextDisabled && (
                <p className="mt-4 text-center text-xs font-bold text-slate-400">
                    You need to answer the required questions before you can continue.
                </p>
            )}
        </div>
    );
}
