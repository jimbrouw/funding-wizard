"use client";

import React from "react";
import AppShell from "./AppShell";
import { useApp } from "@/context/AppContext";
import { downloadJson, copyToClipboard } from "@/lib/engine";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const { answers, profile } = useApp();

    const handleExportAnswers = () => {
        downloadJson("funding_wizard_answers.json", { profile, answers });
    };

    const handleCopyOutputs = () => {
        // This would ideally collect all computed outputs and join them
        // For now, it's a placeholder for the functionality
        alert("Copying all outputs to clipboard...");
    };

    const hasAnswers = Object.keys(answers).length > 0;
    // Let's assume there are outputs if there is a route selected and some answers
    const hasOutputs = hasAnswers;

    return (
        <AppShell
            hasAnswers={hasAnswers}
            hasOutputs={hasOutputs}
            onExportAnswers={handleExportAnswers}
            onCopyOutputs={handleCopyOutputs}
        >
            {children}
        </AppShell>
    );
}
