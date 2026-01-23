"use client";

import React from "react";
import { Answers, AnswerValue, ChoiceOption } from "@/lib/schema";

type QuizQuestion = {
    id: string;
    type: "choice";
    label: string;
    choices: ChoiceOption[];
};

type QualifyingQuizProps = {
    questions: QuizQuestion[];
    values: Answers;
    onChange: (questionId: string, value: AnswerValue) => void;
    onRecommend: () => void;
};

export default function QualifyingQuiz({
    questions,
    values,
    onChange,
    onRecommend,
}: QualifyingQuizProps) {
    const isComplete = questions.every((q) => values[q.id]);

    return (
        <div className="max-w-xl space-y-12">
            <div className="space-y-10">
                {questions.map((q) => (
                    <div key={q.id} className="space-y-4">
                        <h2 className="text-xl font-black text-slate-900">{q.label}</h2>
                        <div className="flex flex-col gap-2">
                            {q.choices.map((choice) => (
                                <button
                                    key={choice.value}
                                    onClick={() => onChange(q.id, choice.value)}
                                    className={`w-full p-4 text-left rounded-2xl border-2 transition-all font-bold ${values[q.id] === choice.value
                                            ? "border-slate-900 bg-slate-900 text-white shadow-lg"
                                            : "border-slate-100 bg-white text-slate-600 hover:border-slate-200 hover:bg-slate-50"
                                        }`}
                                >
                                    {choice.label}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={onRecommend}
                disabled={!isComplete}
                className={`w-full py-5 rounded-2xl text-lg font-black transition-all ${isComplete
                        ? "bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
            >
                Recommend a route
            </button>
        </div>
    );
}
