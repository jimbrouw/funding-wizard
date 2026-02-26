"use client";

import React from "react";
import { Question, AnswerValue, ChoiceOption } from "@/lib/schema";

type QuestionRendererProps = {
    question: Question;
    value: AnswerValue;
    onChange: (value: AnswerValue) => void;
    error?: string | null;
};

export default function QuestionRenderer({
    question,
    value,
    onChange,
    error,
}: QuestionRendererProps) {
    const { id, type, label, help, required, coachingTip } = question;

    const renderCoachingTip = () =>
        coachingTip ? (
            <div className="mb-4 flex items-start gap-3 p-4 bg-amber-50/60 border border-amber-100 rounded-2xl">
                <span className="shrink-0 mt-0.5 text-amber-500">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a6 6 0 00-2 11.66V16a2 2 0 002 2h0a2 2 0 002-2v-2.34A6 6 0 0010 2zm0 2a4 4 0 011.54 7.69.75.75 0 00-.54.72V14H9v-1.59a.75.75 0 00-.54-.72A4 4 0 0110 4z" />
                    </svg>
                </span>
                <p className="text-sm text-amber-800 font-medium italic leading-relaxed">{coachingTip}</p>
            </div>
        ) : null;

    const renderLabel = () => (
        <div className="space-y-1 mb-6">
            <label htmlFor={id} className="block text-xl font-black text-slate-900 leading-tight">
                {label}
                {required && <span className="text-slate-400 ml-1 italic font-medium text-sm">(Required)</span>}
            </label>
            {help && <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">{help}</p>}
        </div>
    );

    const renderError = () => (
        error && (
            <p id={`${id}-error`} className="mt-3 text-sm font-bold text-red-600 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.401 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
                {error}
            </p>
        )
    );

    const inputBaseClasses = `w-full px-6 py-4 rounded-2xl border-2 transition-all outline-none text-slate-900 font-bold placeholder:text-slate-300 ${error
        ? "border-red-100 bg-red-50 focus:border-red-500"
        : "border-slate-100 bg-white focus:border-slate-900 focus:shadow-xl focus:shadow-slate-100"
        }`;

    switch (type) {
        case "choice":
        case "multi_choice": {
            const isMulti = type === "multi_choice";
            const choices = (question as any).choices as ChoiceOption[];

            return (
                <div className="group/q">
                    {renderLabel()}
                    <div className="grid grid-cols-1 gap-3">
                        {choices.map((opt) => {
                            const isSelected = isMulti
                                ? Array.isArray(value) && (value as string[]).includes(opt.value)
                                : value === opt.value;

                            const handleClick = () => {
                                if (isMulti) {
                                    const current = Array.isArray(value) ? (value as string[]) : [];
                                    if (isSelected) {
                                        onChange(current.filter(v => v !== opt.value) as string[]);
                                    } else {
                                        onChange([...current, opt.value] as string[]);
                                    }
                                } else {
                                    onChange(opt.value);
                                }
                            };

                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={handleClick}
                                    className={`p-5 text-left rounded-2xl border-2 transition-all flex items-center justify-between group/btn ${isSelected
                                        ? "border-slate-900 bg-slate-900 text-white shadow-xl scale-[1.01]"
                                        : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50 text-slate-600"
                                        }`}
                                >
                                    <span className="font-bold">{opt.label}</span>
                                    {isMulti && (
                                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${isSelected ? "bg-white border-white" : "border-slate-200 group-hover/btn:border-slate-300"
                                            }`}>
                                            {isSelected && (
                                                <svg className="w-4 h-4 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    {renderError()}
                </div>
            );
        }

        case "text_short":
            return (
                <div>
                    {renderLabel()}
                    {renderCoachingTip()}
                    <input
                        id={id}
                        type="text"
                        value={value as string || ""}
                        onChange={(e) => onChange(e.target.value)}
                        className={inputBaseClasses}
                        placeholder={(question as any).placeholder || "Type here..."}
                        aria-describedby={error ? `${id}-error` : undefined}
                    />
                    {renderError()}
                </div>
            );

        case "text_long":
            return (
                <div>
                    {renderLabel()}
                    {renderCoachingTip()}
                    <textarea
                        id={id}
                        rows={5}
                        value={value as string || ""}
                        onChange={(e) => onChange(e.target.value)}
                        className={`${inputBaseClasses} resize-none`}
                        placeholder={(question as any).placeholder || "Provide details..."}
                        aria-describedby={error ? `${id}-error` : undefined}
                    />
                    {(question as any).maxChars && (
                        <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
                            {((value as string) || "").length} / {(question as any).maxChars} chars
                        </div>
                    )}
                    {renderError()}
                </div>
            );

        case "number":
        case "currency_gbp":
            return (
                <div>
                    {renderLabel()}
                    <div className="relative group/input">
                        {type === "currency_gbp" && (
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black">£</span>
                        )}
                        <input
                            id={id}
                            type="number"
                            value={value as number || ""}
                            onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
                            className={`${inputBaseClasses} ${type === "currency_gbp" ? "pl-10" : ""}`}
                            placeholder="0"
                            aria-describedby={error ? `${id}-error` : undefined}
                        />
                    </div>
                    {renderError()}
                </div>
            );

        case "date":
            return (
                <div>
                    {renderLabel()}
                    <input
                        id={id}
                        type="date"
                        value={value as string || ""}
                        onChange={(e) => onChange(e.target.value)}
                        className={inputBaseClasses}
                        aria-describedby={error ? `${id}-error` : undefined}
                    />
                    {renderError()}
                </div>
            );

        case "table": {
            const rows = Array.isArray(value) ? value : [];
            const columns = (question as any).columns;

            return (
                <div>
                    {renderLabel()}
                    <div className="rounded-3xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        {columns.map((col: any) => (
                                            <th key={col.key} className="px-6 py-4 font-black text-slate-500 uppercase tracking-widest text-[10px]">
                                                {col.label}
                                            </th>
                                        ))}
                                        <th className="px-6 py-4 w-16"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {rows.map((row: any, rowIndex: number) => (
                                        <tr key={rowIndex} className="group/row bg-white hover:bg-slate-50/50">
                                            {columns.map((col: any) => (
                                                <td key={col.key} className="px-3 py-3">
                                                    <input
                                                        type={col.type === "number" || col.type === "currency_gbp" ? "number" : col.type === "date" ? "date" : "text"}
                                                        value={row[col.key] || ""}
                                                        onChange={(e) => {
                                                            const newRows = [...rows];
                                                            newRows[rowIndex] = { ...row, [col.key]: e.target.value };
                                                            onChange(newRows as Record<string, any>[]);
                                                        }}
                                                        className="w-full px-4 py-3 rounded-xl border border-transparent focus:border-slate-200 focus:bg-white bg-slate-50/50 outline-none font-bold text-slate-800 transition-all text-sm placeholder:text-slate-300"
                                                        placeholder={col.label}
                                                    />
                                                </td>
                                            ))}
                                            <td className="px-6 py-3">
                                                <button
                                                    type="button"
                                                    onClick={() => onChange(rows.filter((_, i) => i !== rowIndex) as Record<string, any>[])}
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-row:opacity-100"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {rows.length === 0 && (
                                        <tr>
                                            <td colSpan={columns.length + 1} className="px-6 py-12 text-center text-slate-400 italic font-medium">
                                                No entries yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 bg-slate-50/50 border-t border-slate-200">
                            <button
                                type="button"
                                onClick={() => {
                                    const newRow = columns.reduce((acc: any, col: any) => ({ ...acc, [col.key]: "" }), {});
                                    onChange([...rows, newRow]);
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-black text-slate-900 hover:border-slate-900 transition-all shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                                </svg>
                                Add row
                            </button>
                        </div>
                    </div>
                    {renderError()}
                </div>
            );
        }

        default:
            return null;
    }
}
