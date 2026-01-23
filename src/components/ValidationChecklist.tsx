"use client";

import { RouteContent, Question, UserAnswers } from "@/lib/types";

interface Props {
    content: RouteContent;
    answers: UserAnswers;
    onJumpToStep: (stepId: string) => void;
}

export default function ValidationChecklist({ content, answers, onJumpToStep }: Props) {
    // 1. Missing required questions
    const allQuestions = Object.values(content.questions).flat();
    const missingQuestions = allQuestions.filter(q => q.required && !answers[q.id]);

    // 2. Rule-based sanity checks
    const sanityChecks = [
        {
            id: 'project_name',
            label: 'Project name set',
            pass: !!answers['elig_project_name'],
            message: 'Specify a name for your project.'
        },
        {
            id: 'amount',
            label: 'Request amount set',
            pass: !!answers['elig_amount_requested'],
            message: 'Specify how much funding you are seeking.'
        },
        {
            id: 'dates',
            label: 'Dates set',
            pass: !!answers['project_start_date'] && !!answers['project_end_date'],
            message: 'Specify start and end dates.'
        },
        {
            id: 'outcomes',
            label: 'Outcomes selected',
            pass: !!answers['outcomes_selected'] && (answers['outcomes_selected'] as string[]).length > 0,
            message: 'Select at least one ACE outcome.'
        },
        {
            id: 'date_warning',
            label: 'Start date timeline',
            pass: (() => {
                if (!answers['project_start_date']) return true; // Handled by 'dates' check
                const startDate = new Date(answers['project_start_date'] as string);
                const today = new Date();
                const eightWeeksLater = new Date(today.getTime() + 8 * 7 * 24 * 60 * 60 * 1000);
                return startDate >= eightWeeksLater;
            })(),
            message: 'Note: Start date is less than 8 weeks after submission.'
        }
    ];

    const hasGaps = missingQuestions.length > 0 || sanityChecks.some(c => !c.pass);

    if (!hasGaps) {
        return (
            <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                </div>
                <div>
                    <h3 className="font-bold text-emerald-900">Application Ready!</h3>
                    <p className="text-emerald-700 text-sm">All required fields are complete and sanity checks passed.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
            <div className="p-6 bg-white border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900">Review & Validation</h3>
                <p className="text-slate-500 text-sm">Review the items below to strengthen your application.</p>
            </div>

            <div className="p-6 space-y-6">
                {missingQuestions.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Missing Information</h4>
                        <ul className="space-y-2">
                            {missingQuestions.map(q => {
                                const stepId = Object.entries(content.questions).find(([sid, questions]) =>
                                    questions.some(qq => qq.id === q.id)
                                )?.[0];

                                return (
                                    <li key={q.id} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                                            <span className="text-slate-700 font-medium">{q.label}</span>
                                        </div>
                                        {stepId && (
                                            <button
                                                onClick={() => onJumpToStep(stepId)}
                                                className="text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                                            >
                                                Fix →
                                            </button>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}

                <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sanity Checks</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {sanityChecks.map(check => (
                            <div
                                key={check.id}
                                className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${check.pass
                                    ? "bg-emerald-50/50 border-emerald-100"
                                    : "bg-amber-50/50 border-amber-100"
                                    }`}
                            >
                                <div className={`shrink-0 mt-0.5 ${check.pass ? "text-emerald-500" : "text-amber-500"}`}>
                                    {check.pass ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.74-5.24Z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <div>
                                    <p className={`text-sm font-bold ${check.pass ? "text-emerald-900" : "text-amber-900"}`}>{check.label}</p>
                                    {!check.pass && <p className="text-xs text-amber-700 mt-0.5">{check.message}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
