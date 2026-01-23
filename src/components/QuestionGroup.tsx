"use client";

import React from "react";
import { Question, Answers, AnswerValue } from "@/lib/schema";
import QuestionRenderer from "./QuestionRenderer";

type QuestionGroupProps = {
    questions: Question[];
    values: Answers;
    errors: Record<string, string | null>;
    onChange: (questionId: string, value: AnswerValue) => void;
};

export default function QuestionGroup({
    questions,
    values,
    errors,
    onChange,
}: QuestionGroupProps) {
    return (
        <div className="space-y-16">
            {questions.map((q) => (
                <QuestionRenderer
                    key={q.id}
                    question={q}
                    value={values[q.id]}
                    onChange={(val) => onChange(q.id, val)}
                    error={errors[q.id]}
                />
            ))}
        </div>
    );
}
