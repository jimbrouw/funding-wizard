"use client";

import React from "react";
import { Step } from "@/lib/schema";

type StepperProps = {
    steps: Step[];
    currentStepId: string;
    onNavigate: (stepId: string) => void;
};

export default function Stepper({ steps, currentStepId, onNavigate }: StepperProps) {
    const currentIndex = steps.findIndex((s) => s.id === currentStepId);

    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {steps.map((step, index) => {
                const isActive = step.id === currentStepId;
                const isCompleted = index < currentIndex;

                return (
                    <React.Fragment key={step.id}>
                        <button
                            onClick={() => (index <= currentIndex) && onNavigate(step.id)}
                            className={`flex-shrink-0 flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all ${isActive
                                    ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                                    : isCompleted
                                        ? "bg-slate-100 text-slate-900 hover:bg-slate-200"
                                        : "bg-transparent text-slate-400 cursor-default"
                                }`}
                        >
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${isActive ? "bg-white/20" : isCompleted ? "bg-slate-900 text-white" : "bg-slate-100"
                                }`}>
                                {isCompleted ? (
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    index + 1
                                )}
                            </div>
                            <span className="text-sm font-bold whitespace-nowrap">{step.title}</span>
                        </button>
                        {index < steps.length - 1 && (
                            <div className="flex-shrink-0 w-4 h-[2px] bg-slate-100" />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

export function ProgressBar({ currentIndex, total }: { currentIndex: number; total: number }) {
    const progress = ((currentIndex + 1) / total) * 100;

    return (
        <div 
            role="progressbar" 
            aria-valuenow={Math.round(progress)} 
            aria-valuemin={0} 
            aria-valuemax={100}
            className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"
        >
            <div
                className="h-full bg-slate-900 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
