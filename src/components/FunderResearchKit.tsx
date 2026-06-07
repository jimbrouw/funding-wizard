"use client";

import React, { useState } from "react";

type ResearchSection = {
    id: string;
    title: string;
    description: string;
    icon: string;
    questions: { id: string; text: string; placeholder: string }[];
};

const RESEARCH_SECTIONS: ResearchSection[] = [
    {
        id: "basics",
        title: "Funder basics",
        description: "Start here. Understand who they are and what they fund.",
        icon: "🏛️",
        questions: [
            { id: "funder_name", text: "Funder name", placeholder: "e.g. Arts Council England, Paul Hamlyn Foundation" },
            { id: "funder_website", text: "Website URL", placeholder: "e.g. artscouncil.org.uk" },
            { id: "mission", text: "What is their stated mission or purpose?", placeholder: "Copy their mission statement here — word for word" },
            { id: "priorities", text: "What are their current funding priorities?", placeholder: "List their priority areas — these change, so check the latest" },
            { id: "budget_range", text: "What's their typical funding range?", placeholder: "e.g. £1,000–£15,000 / up to £100,000 / no stated limit" },
            { id: "deadline", text: "Application deadline or round", placeholder: "e.g. Rolling / Next deadline: March 2025 / Annual cycle" },
        ],
    },
    {
        id: "people",
        title: "The people behind the fund",
        description: "Who's deciding? What do they care about? This is where the FBI work starts.",
        icon: "🔍",
        questions: [
            { id: "board_members", text: "Key board members or decision-makers", placeholder: "List names — look at their About/Team page, Annual Report, LinkedIn" },
            { id: "board_backgrounds", text: "What are their backgrounds?", placeholder: "What have they done? Artists? Policy? Business? This tells you what they value" },
            { id: "assessors", text: "Who are the assessors/reviewers?", placeholder: "Some funders publish this — look for assessment panels or peer reviewers" },
            { id: "public_statements", text: "Any public statements, interviews, or speeches?", placeholder: "Google their names + 'arts' or 'funding' — what do they talk about publicly?" },
        ],
    },
    {
        id: "past_grantees",
        title: "Past grantees & funded projects",
        description: "This is gold. Who did they fund? What did those projects look like?",
        icon: "🏆",
        questions: [
            { id: "recent_grantees", text: "Name 3–5 recent grantees", placeholder: "Check their website, annual report, or social media for announcements" },
            { id: "project_types", text: "What types of projects got funded?", placeholder: "Performances? Installations? Community programmes? Film? Research?" },
            { id: "project_scale", text: "What scale were those projects?", placeholder: "Small/local? Regional? National? International? Solo or collaborative?" },
            { id: "grantee_profiles", text: "What kind of people got funded?", placeholder: "Emerging? Established? From specific communities? Specific art forms?" },
            { id: "project_values", text: "What values or themes do funded projects have in common?", placeholder: "Community? Innovation? Diversity? Heritage? Environmental? Digital?" },
        ],
    },
    {
        id: "alignment",
        title: "Alignment check",
        description: "Now the critical question: does YOUR project actually fit?",
        icon: "🎯",
        questions: [
            { id: "your_project", text: "Describe your project in one sentence", placeholder: "What are you making, who is it for, and why does it matter?" },
            { id: "priority_match", text: "Which of their priorities does your project match?", placeholder: "Be specific — quote their priority and explain how you match it" },
            { id: "audience_match", text: "Does your target audience align with who they want to reach?", placeholder: "Their communities vs. your communities — where's the overlap?" },
            { id: "similar_funded", text: "Have they funded anything similar to your project before?", placeholder: "If yes, that's a strong signal. If no, ask yourself why" },
            { id: "budget_fit", text: "Does your budget fit their typical range?", placeholder: "If you need £50k and they give £5k max, this isn't the right funder" },
            { id: "red_flags", text: "Any red flags or mismatches?", placeholder: "Be honest. Better to know now than waste weeks on an application" },
        ],
    },
];

type ChecklistItem = {
    id: string;
    text: string;
    checked: boolean;
};

const GO_NOGO_CHECKLIST: ChecklistItem[] = [
    { id: "mission_align", text: "Your project aligns with their mission/priorities", checked: false },
    { id: "audience_align", text: "Your target audience overlaps with who they want to reach", checked: false },
    { id: "scale_match", text: "Your project scale matches what they typically fund", checked: false },
    { id: "budget_match", text: "Your budget is within their funding range", checked: false },
    { id: "similar_work", text: "They've funded similar projects or art forms before", checked: false },
    { id: "eligibility", text: "You meet all eligibility criteria (location, art form, career stage)", checked: false },
    { id: "deadline_ok", text: "You have enough time to write a strong application", checked: false },
    { id: "no_red_flags", text: "No major red flags or mismatches identified", checked: false },
];

export default function FunderResearchKit() {
    const [funderName, setFunderName] = useState("");
    const [notes, setNotes] = useState<Record<string, string>>({});
    const [checklist, setChecklist] = useState<ChecklistItem[]>(GO_NOGO_CHECKLIST);
    const [showVerdict, setShowVerdict] = useState(false);
    const [expandedSections, setExpandedSections] = useState<string[]>(["basics"]);
    const [copiedNotes, setCopiedNotes] = useState(false);

    const toggleSection = (id: string) => {
        setExpandedSections((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    };

    const updateNote = (questionId: string, value: string) => {
        setNotes((prev) => ({ ...prev, [questionId]: value }));
    };

    const toggleCheck = (id: string) => {
        setChecklist((prev) =>
            prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
        );
    };

    const checkedCount = checklist.filter((c) => c.checked).length;
    const totalChecks = checklist.length;
    const score = Math.round((checkedCount / totalChecks) * 100);

    const getVerdict = () => {
        if (score >= 75) return { label: "Strong match — go for it", color: "emerald", emoji: "🟢" };
        if (score >= 50) return { label: "Possible — but review the gaps", color: "amber", emoji: "🟡" };
        return { label: "Weak match — find a better funder", color: "red", emoji: "🔴" };
    };

    const filledFields = Object.values(notes).filter((n) => n.trim().length > 0).length;
    const totalFields = RESEARCH_SECTIONS.reduce((acc, s) => acc + s.questions.length, 0);

    const exportNotes = async () => {
        let output = `# Funder Research: ${funderName || "Untitled"}\n\n`;
        output += `Generated by Vibe Cheque\n\n---\n\n`;

        RESEARCH_SECTIONS.forEach((section) => {
            output += `## ${section.icon} ${section.title}\n\n`;
            section.questions.forEach((q) => {
                const answer = notes[q.id] || "(not completed)";
                output += `**${q.text}**\n${answer}\n\n`;
            });
        });

        output += `## 🎯 Go/No-Go Assessment\n\n`;
        output += `Score: ${score}% (${checkedCount}/${totalChecks})\n`;
        output += `Verdict: ${getVerdict().emoji} ${getVerdict().label}\n\n`;

        checklist.forEach((item) => {
            output += `${item.checked ? "✅" : "⬜"} ${item.text}\n`;
        });

        try {
            await navigator.clipboard.writeText(output);
            setCopiedNotes(true);
            setTimeout(() => setCopiedNotes(false), 2500);
        } catch {
            const el = document.createElement("textarea");
            el.value = output;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
            setCopiedNotes(true);
            setTimeout(() => setCopiedNotes(false), 2500);
        }
    };

    const reset = () => {
        setFunderName("");
        setNotes({});
        setChecklist(GO_NOGO_CHECKLIST);
        setShowVerdict(false);
        setExpandedSections(["basics"]);
    };

    return (
        <div className="space-y-8">
            {/* Funder name header */}
            <div className="space-y-4">
                <input
                    type="text"
                    value={funderName}
                    onChange={(e) => setFunderName(e.target.value)}
                    placeholder="Enter funder name to start your investigation…"
                    className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 bg-white text-xl font-black text-slate-900 placeholder:text-slate-300 outline-none focus:border-slate-900 transition-all"
                />
                {funderName && (
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                        <span>{filledFields} of {totalFields} fields completed</span>
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-slate-900 rounded-full transition-all duration-500"
                                style={{ width: `${(filledFields / totalFields) * 100}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* FBI tip */}
            <div className="flex items-start gap-4 p-5 bg-slate-900 rounded-2xl">
                <span className="text-2xl shrink-0">🕵️</span>
                <div className="text-sm text-slate-300 leading-relaxed space-y-1">
                    <p className="font-bold text-white">Research like an FBI agent</p>
                    <p>Go through records like you're trying to find somebody in a lie. Know the funders, the board members, the people they've selected in the past, their projects. Get a full, comprehensive breakdown on everybody involved. It will save you so much time — only apply to grants aligned with what you're creating.</p>
                </div>
            </div>

            {/* Research sections */}
            {RESEARCH_SECTIONS.map((section) => {
                const isExpanded = expandedSections.includes(section.id);
                const sectionFilled = section.questions.filter((q) => notes[q.id]?.trim()).length;

                return (
                    <div key={section.id} className="border-2 border-slate-100 rounded-2xl overflow-hidden transition-all">
                        <button
                            onClick={() => toggleSection(section.id)}
                            className="w-full flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl">{section.icon}</span>
                                <div className="text-left">
                                    <h3 className="text-sm font-black text-slate-900">{section.title}</h3>
                                    <p className="text-xs text-slate-400">{section.description}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {sectionFilled > 0 && (
                                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                                        {sectionFilled}/{section.questions.length}
                                    </span>
                                )}
                                <svg className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </button>

                        {isExpanded && (
                            <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">
                                {section.questions.map((q) => (
                                    <div key={q.id} className="space-y-2">
                                        <label className="text-xs font-bold text-slate-700">{q.text}</label>
                                        <textarea
                                            value={notes[q.id] || ""}
                                            onChange={(e) => updateNote(q.id, e.target.value)}
                                            placeholder={q.placeholder}
                                            rows={2}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-300 outline-none focus:border-slate-900 transition-all resize-none leading-relaxed"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Go/No-Go Checklist */}
            <div className="space-y-4">
                <div className="space-y-1">
                    <h2 className="text-xl font-black text-slate-900">Go / No-Go assessment</h2>
                    <p className="text-sm text-slate-500">
                        Be brutally honest. A "No-Go" saves you weeks of wasted effort. There's always a better-aligned funder out there.
                    </p>
                </div>

                <div className="space-y-2">
                    {checklist.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => toggleCheck(item.id)}
                            className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${item.checked
                                ? "border-emerald-200 bg-emerald-50/60"
                                : "border-slate-100 bg-white hover:border-slate-200"
                                }`}
                        >
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${item.checked
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-100 text-slate-300"
                                }`}>
                                {item.checked && (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                            <span className={`text-sm font-bold ${item.checked ? "text-emerald-800" : "text-slate-600"}`}>
                                {item.text}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Show verdict button */}
                <button
                    onClick={() => setShowVerdict(true)}
                    className="w-full py-4 rounded-2xl text-lg font-black bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-xl shadow-violet-200 hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                    Show my verdict
                </button>
            </div>

            {/* Verdict */}
            {showVerdict && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                    <div className="h-px bg-slate-200" />

                    <div className={`p-8 rounded-2xl text-center space-y-4 ${score >= 75 ? "bg-emerald-50 border-2 border-emerald-200"
                        : score >= 50 ? "bg-amber-50 border-2 border-amber-200"
                            : "bg-red-50 border-2 border-red-200"
                        }`}>
                        <p className="text-5xl">{getVerdict().emoji}</p>
                        <div>
                            <p className="text-3xl font-black text-slate-900">{score}%</p>
                            <p className="text-sm text-slate-600 font-bold mt-1">{checkedCount} of {totalChecks} alignment checks passed</p>
                        </div>
                        <p className={`text-lg font-black ${score >= 75 ? "text-emerald-700"
                            : score >= 50 ? "text-amber-700"
                                : "text-red-700"
                            }`}>{getVerdict().label}</p>
                    </div>

                    {score < 75 && (
                        <div className="p-5 bg-amber-50/60 border border-amber-100 rounded-2xl text-sm text-amber-800">
                            <p className="font-bold">💡 Remember: eligible ≠ qualified.</p>
                            <p className="mt-1 text-xs leading-relaxed">
                                Just because you <em>can</em> apply doesn't mean you <em>should</em>. If your alignment score is below 75%, consider whether your time would be better spent finding a funder whose priorities genuinely match your project. A well-aligned application to the right funder beats a generic application to the wrong one every time.
                            </p>
                        </div>
                    )}

                    {/* Export */}
                    <div className="flex gap-3">
                        <button
                            onClick={exportNotes}
                            className={`flex-1 py-4 rounded-2xl font-black transition-all ${copiedNotes
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
                                }`}
                        >
                            {copiedNotes ? "✓ Research notes copied!" : "Copy all research notes"}
                        </button>
                        <button
                            onClick={reset}
                            className="px-6 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                        >
                            New research
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
