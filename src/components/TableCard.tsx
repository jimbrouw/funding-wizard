"use client";

import React from "react";

type TableCardProps = {
    title: string;
    grantiumFieldId?: string;
    rows: Record<string, any>[];
    columns: { key: string; label: string }[];
    onCopyCSV: () => void;
};

export default function TableCard({
    title,
    grantiumFieldId,
    rows,
    columns,
    onCopyCSV,
}: TableCardProps) {
    return (
        <div className="rounded-3xl border-2 border-slate-200 bg-white p-8 space-y-6 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-1">
                    <h2 className="text-xl font-black text-slate-900">{title}</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Paste target: {grantiumFieldId || "Draft"}
                    </p>
                </div>

                <button
                    onClick={onCopyCSV}
                    className="px-4 py-2 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copy CSV
                </button>
            </div>

            <div className="rounded-2xl border border-slate-100 overflow-hidden bg-slate-50/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="bg-white border-b border-slate-100">
                                {columns.map((col) => (
                                    <th key={col.key} className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {rows.map((row, i) => (
                                <tr key={i} className="hover:bg-white transition-colors">
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-6 py-4 font-bold text-slate-700">
                                            {row[col.key]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            {rows.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400 italic">
                                        No data entries.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
