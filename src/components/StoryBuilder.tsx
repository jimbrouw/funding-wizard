"use client";

import React, { useState } from "react";

const SKILLS = [
    { id: "critical_thinking", label: "Critical thinking", prompt: "a time you analysed a complex problem and found a solution others missed" },
    { id: "adaptability", label: "Adaptability", prompt: "a time you had to change direction mid-project and made it work" },
    { id: "conflict_resolution", label: "Handling conflict", prompt: "a time you navigated a disagreement or tension and reached a positive outcome" },
    { id: "leadership", label: "Leadership", prompt: "a time you guided a team, project, or community through a challenge" },
    { id: "collaboration", label: "Collaboration", prompt: "a time you worked with others and the result was stronger because of it" },
    { id: "creative_problem_solving", label: "Creative problem-solving", prompt: "a time you found an unconventional solution to a challenge" },
    { id: "community_engagement", label: "Community engagement", prompt: "a time you brought people together or deepened a community connection" },
    { id: "budget_management", label: "Budget & resource management", prompt: "a time you delivered something meaningful with limited resources" },
    { id: "resilience", label: "Resilience & perseverance", prompt: "a time you kept going when things got difficult and achieved something" },
    { id: "cultural_sensitivity", label: "Cultural awareness", prompt: "a time you worked sensitively across different cultures, backgrounds, or communities" },
    { id: "project_management", label: "Project management", prompt: "a time you planned, coordinated, and delivered a complex project" },
    { id: "mentoring", label: "Mentoring & supporting others", prompt: "a time you helped someone else develop their skills or confidence" },
    { id: "innovation", label: "Innovation & experimentation", prompt: "a time you tried something new and learned from the process" },
    { id: "audience_development", label: "Reaching new audiences", prompt: "a time you brought your work to people who wouldn't normally encounter it" },
    { id: "partnership_building", label: "Building partnerships", prompt: "a time you created a meaningful collaboration with an organisation or individual" },
];

type StoryStep = "skill" | "situation" | "action" | "result" | "output";

export default function StoryBuilder() {
    const [currentStep, setCurrentStep] = useState<StoryStep>("skill");
    const [selectedSkill, setSelectedSkill] = useState<string>("");
    const [situation, setSituation] = useState("");
    const [action, setAction] = useState("");
    const [result, setResult] = useState("");
    const [copied, setCopied] = useState(false);

    const skill = SKILLS.find((s) => s.id === selectedSkill);

    const generateNarrative = () => {
        if (!skill) return "";

        const sitClean = situation.trim().replace(/\.$/, "");
        const actClean = action.trim().replace(/\.$/, "");
        const resClean = result.trim().replace(/\.$/, "");

        return `${sitClean}. ${actClean}. ${resClean}.`;
    };

    const generateResumeBullet = () => {
        if (!skill) return "";
        return `• ${skill.label}: Experienced in ${skill.label.toLowerCase()} within creative projects.`;
    };

    const narrative = generateNarrative();
    const resumeBullet = generateResumeBullet();

    const copyNarrative = async () => {
        try {
            await navigator.clipboard.writeText(narrative);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            const el = document.createElement("textarea");
            el.value = narrative;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    const reset = () => {
        setCurrentStep("skill");
        setSelectedSkill("");
        setSituation("");
        setAction("");
        setResult("");
        setCopied(false);
    };

    const steps: { key: StoryStep; label: string; num: number }[] = [
        { key: "skill", label: "Pick skill", num: 1 },
        { key: "situation", label: "Set the scene", num: 2 },
        { key: "action", label: "What you did", num: 3 },
        { key: "result", label: "The impact", num: 4 },
        { key: "output", label: "Your narrative", num: 5 },
    ];

    const currentIndex = steps.findIndex((s) => s.key === currentStep);

    return (
        <div className="space-y-8">
            {/* Progress bar */}
            <div className="flex items-center gap-1">
                {steps.map((step, i) => (
                    <React.Fragment key={step.key}>
                        <button
                            onClick={() => {
                                if (i < currentIndex) setCurrentStep(step.key);
                            }}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${i === currentIndex
                                ? "bg-slate-900 text-white"
                                : i < currentIndex
                                    ? "bg-emerald-100 text-emerald-700 cursor-pointer hover:bg-emerald-200"
                                    : "bg-slate-100 text-slate-400"
                                }`}
                        >
                            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${i === currentIndex
                                ? "bg-white text-slate-900"
                                : i < currentIndex
                                    ? "bg-emerald-500 text-white"
                                    : "bg-slate-200 text-slate-400"
                                }`}>
                                {i < currentIndex ? "✓" : step.num}
                            </span>
                            <span className="hidden sm:inline">{step.label}</span>
                        </button>
                        {i < steps.length - 1 && (
                            <div className={`flex-1 h-0.5 rounded-full ${i < currentIndex ? "bg-emerald-300" : "bg-slate-200"}`} />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Step content */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">

                {/* STEP 1: Pick a skill */}
                {currentStep === "skill" && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-slate-900">What do you want to prove?</h2>
                            <p className="text-sm text-slate-500 leading-relaxed max-w-xl">
                                Don't list it on your CV. <strong>Show it through a story.</strong> Pick the quality you want the funder to see in you.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {SKILLS.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => {
                                        setSelectedSkill(s.id);
                                        setCurrentStep("situation");
                                    }}
                                    className={`p-4 text-left rounded-2xl border-2 transition-all hover:scale-[1.01] ${selectedSkill === s.id
                                        ? "border-slate-900 bg-slate-900 text-white shadow-lg"
                                        : "border-slate-100 bg-white text-slate-600 hover:border-slate-300"
                                        }`}
                                >
                                    <span className="text-sm font-bold block">{s.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 2: The situation */}
                {currentStep === "situation" && skill && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-slate-900">Set the scene</h2>
                            <p className="text-sm text-slate-500 leading-relaxed max-w-xl">
                                Think of <strong>{skill.prompt}</strong>. Where were you? What was happening? Give the funder a vivid picture.
                            </p>
                        </div>

                        <div className="p-5 bg-amber-50/60 border border-amber-100 rounded-2xl text-sm text-amber-800 space-y-2">
                            <p className="font-bold">💡 Show, don't tell</p>
                            <div className="space-y-1 text-xs">
                                <p className="text-red-600 line-through">❌ "I have experience managing budgets."</p>
                                <p className="text-emerald-700">✅ "In 2023, I was commissioned to deliver a 3-week community photography programme with a £4,000 budget. Midway through, our venue pulled out…"</p>
                            </div>
                        </div>

                        <textarea
                            value={situation}
                            onChange={(e) => setSituation(e.target.value)}
                            placeholder="Describe the specific situation — when, where, what was the context…"
                            rows={4}
                            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-white text-slate-900 font-medium placeholder:text-slate-300 outline-none focus:border-slate-900 transition-all resize-none leading-relaxed"
                        />

                        <div className="flex gap-3">
                            <button onClick={() => setCurrentStep("skill")} className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">
                                Back
                            </button>
                            <button
                                onClick={() => setCurrentStep("action")}
                                disabled={situation.trim().length < 10}
                                className={`flex-1 py-3 rounded-2xl font-black transition-all ${situation.trim().length >= 10
                                    ? "bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
                                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                    }`}
                            >
                                Next: What you did →
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: The action */}
                {currentStep === "action" && skill && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-slate-900">What did you do?</h2>
                            <p className="text-sm text-slate-500 leading-relaxed max-w-xl">
                                Be specific. Don't say "I dealt with it." Say <strong>exactly</strong> what actions you took. This is where {skill.label.toLowerCase()} comes through.
                            </p>
                        </div>

                        <div className="p-5 bg-violet-50/60 border border-violet-100 rounded-2xl text-sm text-violet-800 space-y-2">
                            <p className="font-bold">🎯 Be concrete</p>
                            <div className="space-y-1 text-xs">
                                <p className="text-red-600 line-through">❌ "I found a solution and handled it professionally."</p>
                                <p className="text-emerald-700">✅ "I contacted three alternative venues within 24 hours, renegotiated the hire fee, and moved all equipment on a single day with two volunteers."</p>
                            </div>
                        </div>

                        <textarea
                            value={action}
                            onChange={(e) => setAction(e.target.value)}
                            placeholder="Describe the specific actions you took…"
                            rows={4}
                            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-white text-slate-900 font-medium placeholder:text-slate-300 outline-none focus:border-slate-900 transition-all resize-none leading-relaxed"
                        />

                        <div className="flex gap-3">
                            <button onClick={() => setCurrentStep("situation")} className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">
                                Back
                            </button>
                            <button
                                onClick={() => setCurrentStep("result")}
                                disabled={action.trim().length < 10}
                                className={`flex-1 py-3 rounded-2xl font-black transition-all ${action.trim().length >= 10
                                    ? "bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
                                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                    }`}
                            >
                                Next: The impact →
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 4: The result */}
                {currentStep === "result" && skill && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-slate-900">What was the impact?</h2>
                            <p className="text-sm text-slate-500 leading-relaxed max-w-xl">
                                Numbers, outcomes, testimonials, what changed. This is where you land the story and prove {skill.label.toLowerCase()} isn't just a claim — it's a fact.
                            </p>
                        </div>

                        <div className="p-5 bg-emerald-50/60 border border-emerald-100 rounded-2xl text-sm text-emerald-800 space-y-2">
                            <p className="font-bold">📊 Land it with evidence</p>
                            <div className="space-y-1 text-xs">
                                <p className="text-red-600 line-through">❌ "It went well and everyone was happy."</p>
                                <p className="text-emerald-700">✅ "The programme ran to schedule with all 15 participants completing the course. Two participants went on to exhibit at a local gallery, and the venue invited us back for a follow-up residency."</p>
                            </div>
                        </div>

                        <textarea
                            value={result}
                            onChange={(e) => setResult(e.target.value)}
                            placeholder="Describe the outcome — what changed, what was the impact, what numbers can you share…"
                            rows={4}
                            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-white text-slate-900 font-medium placeholder:text-slate-300 outline-none focus:border-slate-900 transition-all resize-none leading-relaxed"
                        />

                        <div className="flex gap-3">
                            <button onClick={() => setCurrentStep("action")} className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all">
                                Back
                            </button>
                            <button
                                onClick={() => setCurrentStep("output")}
                                disabled={result.trim().length < 10}
                                className={`flex-1 py-3 rounded-2xl font-black transition-all ${result.trim().length >= 10
                                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 shadow-xl shadow-violet-200"
                                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                    }`}
                            >
                                Build my narrative ✨
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 5: Output */}
                {currentStep === "output" && skill && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-slate-900">Your narrative</h2>
                            <p className="text-sm text-slate-500">
                                Here's the difference between telling and showing. Copy the narrative and paste it into your application.
                            </p>
                        </div>

                        {/* Before/After comparison */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-6 bg-red-50/60 border-2 border-red-100 rounded-2xl space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-black">✕</span>
                                    <h3 className="text-sm font-black text-red-700">Resume-style (telling)</h3>
                                </div>
                                <p className="text-sm text-red-800 leading-relaxed italic">{resumeBullet}</p>
                            </div>

                            <div className="p-6 bg-emerald-50/60 border-2 border-emerald-200 rounded-2xl space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-black">✓</span>
                                    <h3 className="text-sm font-black text-emerald-700">Narrative-style (showing)</h3>
                                </div>
                                <p className="text-sm text-emerald-800 leading-relaxed">{narrative}</p>
                            </div>
                        </div>

                        {/* Copyable output */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-black text-slate-900">Ready to paste</h3>
                                <button
                                    onClick={copyNarrative}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all ${copied
                                        ? "bg-emerald-500 text-white"
                                        : "bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
                                        }`}
                                >
                                    {copied ? "✓ Copied!" : "Copy narrative"}
                                </button>
                            </div>
                            <div className="p-6 bg-white border-2 border-slate-200 rounded-2xl">
                                <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">{narrative}</p>
                            </div>
                        </div>

                        {/* Coaching note */}
                        <div className="p-5 bg-amber-50/60 border border-amber-100 rounded-2xl text-sm text-amber-800 space-y-2">
                            <p className="font-bold">💡 Where to use this</p>
                            <ul className="space-y-1 text-xs">
                                <li>• <strong>Budget & financial management experience</strong> — to prove you can handle funds</li>
                                <li>• <strong>Project management experience</strong> — to prove you can deliver</li>
                                <li>• <strong>Creative case</strong> — to show your artistic thinking</li>
                                <li>• <strong>Risk management</strong> — to show you handle the unexpected</li>
                                <li>• <strong>Community engagement</strong> — to show real relationships, not claims</li>
                            </ul>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={reset}
                                className="flex-1 py-4 bg-slate-100 text-slate-700 font-black rounded-2xl hover:bg-slate-200 transition-all"
                            >
                                Build another story
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
