"use client";

import Link from "next/link";
import { useApp } from "@/context/AppContext";

export default function Header() {
    const { answers } = useApp();

    const hasAnswers = Object.keys(answers).length > 0;
    const hasOutputs = hasAnswers; // Simplified for now, will refine as outputs are implemented

    const handleExportJson = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(answers, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "funding_wizard_answers.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <header className="border-b border-border bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                    </div>
                    <span className="font-bold text-foreground tracking-tight text-lg">Funding Wizard</span>
                </Link>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExportJson}
                        disabled={!hasAnswers}
                        className="text-sm font-semibold px-4 py-2 rounded-lg border border-border bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Export JSON
                    </button>
                    <Link
                        href="/outputs"
                        className={`text-sm font-semibold px-4 py-2 rounded-lg bg-primary text-white shadow-sm hover:opacity-90 transition-opacity ${!hasOutputs ? 'pointer-events-none opacity-50' : ''}`}
                    >
                        Copy outputs
                    </Link>
                </div>
            </div>
        </header>
    );
}
