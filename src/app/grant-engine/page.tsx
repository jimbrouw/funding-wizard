"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
    DraftSection,
    GrantEngineState,
    InterrogationQuestion,
    MasterDataAssetType,
    Project,
    ProjectGrant,
} from "@/lib/grant-engine/types";
import { SEEDED_PROJECT_GRANT_ID } from "@/lib/grant-engine/seed";

type ApiState = {
    mode: string;
    state: GrantEngineState;
};

const emptyProjectForm = {
    name: "",
    rawIdea: "",
    concreteOutputs: "",
    budgetTotal: "",
};

const emptyMasterDataForm: {
    assetType: MasterDataAssetType;
    title: string;
    content: string;
} = {
    assetType: "method_statement",
    title: "",
    content: "",
};

export default function GrantEnginePage() {
    const [apiState, setApiState] = useState<ApiState | null>(null);
    const [selectedPairingId, setSelectedPairingId] = useState(SEEDED_PROJECT_GRANT_ID);
    const [projectForm, setProjectForm] = useState(emptyProjectForm);
    const [masterDataForm, setMasterDataForm] = useState(emptyMasterDataForm);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        async function loadInitialState() {
            const response = await fetch("/api/grant-engine");
            const data = await response.json();
            setApiState(data);
            if (data.state.projectGrants[0]) setSelectedPairingId(data.state.projectGrants[0].id);
        }

        loadInitialState();
    }, []);

    const state = apiState?.state;
    const selectedContext = useMemo(() => {
        if (!state) return null;
        const pairing = state.projectGrants.find((item) => item.id === selectedPairingId) || state.projectGrants[0];
        const project = pairing ? state.projects.find((item) => item.id === pairing.projectId) : null;
        const grant = pairing ? state.grants.find((item) => item.id === pairing.grantId) : null;
        const questions = pairing
            ? state.interrogationQuestions.filter((question) => question.projectGrantId === pairing.id)
            : [];
        const drafts = pairing ? state.draftSections.filter((section) => section.projectGrantId === pairing.id) : [];

        return pairing && project && grant ? { pairing, project, grant, questions, drafts } : null;
    }, [state, selectedPairingId]);

    const unresolvedCount =
        selectedContext?.questions.filter(
            (question) => question.required && ["open", "rewrite_requested"].includes(question.status),
        ).length || 0;
    const canDraft = Boolean(selectedContext?.questions.length) && unresolvedCount === 0;

    async function post(action: string, body: Record<string, unknown> = {}) {
        setBusy(true);
        setError("");
        try {
            const response = await fetch("/api/grant-engine", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, ...body }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || data.errors?.join(", ") || "Request failed.");
            setApiState((previous) => ({
                mode: previous?.mode || "seeded-memory",
                state: data.state,
            }));
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Request failed.");
            return null;
        } finally {
            setBusy(false);
        }
    }

    async function handleCreateProject(event: React.FormEvent) {
        event.preventDefault();
        const data = await post("create_project", projectForm);
        if (data?.pairing) {
            setSelectedPairingId(data.pairing.id);
            setProjectForm(emptyProjectForm);
        }
    }

    async function handleAddMasterData(event: React.FormEvent) {
        event.preventDefault();
        const data = await post("add_master_data", masterDataForm);
        if (data?.asset) setMasterDataForm(emptyMasterDataForm);
    }

    async function handleInterrogate(pairing: ProjectGrant) {
        await post("interrogate", { projectGrantId: pairing.id });
    }

    async function handleAnswer(question: InterrogationQuestion, status: "answered" | "not_applicable") {
        await post("answer_question", {
            questionId: question.id,
            answer: status === "not_applicable" ? "Not applicable to this project." : answers[question.id] || question.answer,
            status,
        });
    }

    async function handleDraft(pairing: ProjectGrant) {
        await post("draft", { projectGrantId: pairing.id });
    }

    async function handleReset() {
        const data = await post("reset");
        if (data?.state?.projectGrants?.[0]) setSelectedPairingId(data.state.projectGrants[0].id);
        setAnswers({});
    }

    if (!state || !selectedContext) {
        return (
            <div className="min-h-[40vh] flex items-center justify-center">
                <p className="text-sm font-black uppercase tracking-widest text-slate-400">Loading Grant Engine...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <header className="space-y-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="space-y-3">
                        <h1 className="text-5xl font-black text-slate-900 tracking-tight">Grant Engine</h1>
                        <p className="text-xl text-slate-500 max-w-3xl leading-relaxed">
                            A seeded vertical slice: select a project-grant pairing, interrogate the gaps, answer them, then draft.
                        </p>
                    </div>
                    <button
                        onClick={handleReset}
                        disabled={busy}
                        className="px-5 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl font-black text-sm hover:border-slate-900 disabled:opacity-50"
                    >
                        Reset seed
                    </button>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Store: {apiState?.mode || "seeded-memory"}</span>
                    <span>Questions: {selectedContext.questions.length}</span>
                    <span>Unresolved: {unresolvedCount}</span>
                    <span>Project status: {selectedContext.project.status}</span>
                </div>
            </header>

            {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-sm font-bold text-red-700">
                    {error}
                </div>
            )}

            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4 space-y-6">
                    <Panel title="Project">
                        <ProjectSelector
                            projects={state.projects}
                            pairings={state.projectGrants}
                            value={selectedPairingId}
                            onChange={setSelectedPairingId}
                        />
                        <form className="space-y-4 pt-5 border-t border-slate-100" onSubmit={handleCreateProject}>
                            <Input
                                label="New project name"
                                value={projectForm.name}
                                onChange={(value) => setProjectForm((current) => ({ ...current, name: value }))}
                            />
                            <Textarea
                                label="Raw idea"
                                value={projectForm.rawIdea}
                                onChange={(value) => setProjectForm((current) => ({ ...current, rawIdea: value }))}
                            />
                            <Input
                                label="Concrete outputs"
                                value={projectForm.concreteOutputs}
                                onChange={(value) => setProjectForm((current) => ({ ...current, concreteOutputs: value }))}
                            />
                            <Input
                                label="Budget total"
                                type="number"
                                value={projectForm.budgetTotal}
                                onChange={(value) => setProjectForm((current) => ({ ...current, budgetTotal: value }))}
                            />
                            <button
                                disabled={busy || !projectForm.name || !projectForm.rawIdea}
                                className="w-full py-3 bg-slate-900 text-white rounded-xl font-black text-sm disabled:opacity-40"
                            >
                                Create and select
                            </button>
                        </form>
                    </Panel>

                    <Panel title="Master data">
                        <div className="space-y-4">
                            <div className="space-y-3">
                                {state.masterDataAssets.map((asset) => (
                                    <div key={asset.id} className="p-3 bg-slate-50 rounded-xl">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{asset.assetType}</p>
                                        <p className="font-black text-sm text-slate-900 mt-1">{asset.title}</p>
                                    </div>
                                ))}
                            </div>
                            <form className="space-y-4 pt-5 border-t border-slate-100" onSubmit={handleAddMasterData}>
                                <label className="block space-y-2">
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Asset type</span>
                                    <select
                                        value={masterDataForm.assetType}
                                        onChange={(event) =>
                                            setMasterDataForm((current) => ({
                                                ...current,
                                                assetType: event.target.value as MasterDataAssetType,
                                            }))
                                        }
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900"
                                    >
                                        <option value="bio">Bio</option>
                                        <option value="budget_template">Budget template</option>
                                        <option value="access_rider">Access rider</option>
                                        <option value="method_statement">Method statement</option>
                                        <option value="equipment_inventory">Equipment inventory</option>
                                        <option value="past_project_outcome">Past project outcome</option>
                                    </select>
                                </label>
                                <Input
                                    label="Title"
                                    value={masterDataForm.title}
                                    onChange={(value) => setMasterDataForm((current) => ({ ...current, title: value }))}
                                />
                                <Textarea
                                    label="Content"
                                    value={masterDataForm.content}
                                    onChange={(value) => setMasterDataForm((current) => ({ ...current, content: value }))}
                                />
                                <button
                                    disabled={busy || !masterDataForm.title || !masterDataForm.content}
                                    className="w-full py-3 bg-slate-900 text-white rounded-xl font-black text-sm disabled:opacity-40"
                                >
                                    Add master data
                                </button>
                            </form>
                        </div>
                    </Panel>
                </div>

                <div className="lg:col-span-8 space-y-6">
                    <Panel title="Selected pairing">
                        <div className="space-y-4">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">{selectedContext.project.name}</h2>
                                <p className="text-sm text-slate-500 leading-relaxed mt-2">{selectedContext.project.rawIdea}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Grant</p>
                                <p className="font-black text-slate-900 mt-1">{selectedContext.grant.title}</p>
                                <p className="text-sm text-slate-500 mt-1">{selectedContext.grant.matchSummary}</p>
                            </div>
                            <button
                                onClick={() => handleInterrogate(selectedContext.pairing)}
                                disabled={busy}
                                className="px-5 py-3 bg-slate-900 text-white rounded-xl font-black text-sm disabled:opacity-50"
                            >
                                Run interrogation
                            </button>
                        </div>
                    </Panel>

                    <Panel title="Interrogation gate">
                        {selectedContext.questions.length === 0 ? (
                            <p className="text-sm font-bold text-slate-500">Run interrogation to generate the fixed gap set.</p>
                        ) : (
                            <div className="space-y-4">
                                {selectedContext.questions.map((question) => (
                                    <div key={question.id} className="p-5 border border-slate-100 rounded-2xl bg-white space-y-4">
                                        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                            <div>
                                                <p className="font-black text-slate-900">{question.question}</p>
                                                <p className="text-sm text-slate-500 mt-1">{question.reason}</p>
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                {question.status}
                                            </span>
                                        </div>
                                        <Textarea
                                            label="Answer"
                                            value={answers[question.id] ?? question.answer}
                                            onChange={(value) => setAnswers((current) => ({ ...current, [question.id]: value }))}
                                        />
                                        <div className="flex flex-wrap gap-3">
                                            <button
                                                onClick={() => handleAnswer(question, "answered")}
                                                disabled={busy || !(answers[question.id] ?? question.answer)}
                                                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black disabled:opacity-40"
                                            >
                                                Save answer
                                            </button>
                                            <button
                                                onClick={() => handleAnswer(question, "not_applicable")}
                                                disabled={busy}
                                                className="px-4 py-2 bg-white border border-slate-200 text-slate-900 rounded-xl text-xs font-black hover:border-slate-900"
                                            >
                                                Mark not applicable
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Panel>

                    <Panel title="Draft">
                        <div className="space-y-5">
                            <button
                                onClick={() => handleDraft(selectedContext.pairing)}
                                disabled={busy || !canDraft}
                                className="px-5 py-3 bg-slate-900 text-white rounded-xl font-black text-sm disabled:opacity-40"
                            >
                                Generate draft
                            </button>
                            {!canDraft && selectedContext.questions.length > 0 && (
                                <p className="text-sm font-bold text-amber-700">
                                    Drafting is blocked until every required question is answered or marked not applicable.
                                </p>
                            )}
                            <DraftList drafts={selectedContext.drafts} />
                        </div>
                    </Panel>
                </div>
            </section>
        </div>
    );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">{title}</h2>
            {children}
        </section>
    );
}

function ProjectSelector({
    projects,
    pairings,
    value,
    onChange,
}: {
    projects: Project[];
    pairings: ProjectGrant[];
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <label className="block space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Selected project</span>
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900"
            >
                {pairings.map((pairing) => {
                    const project = projects.find((item) => item.id === pairing.projectId);
                    return (
                        <option key={pairing.id} value={pairing.id}>
                            {project?.name || pairing.id}
                        </option>
                    );
                })}
            </select>
        </label>
    );
}

function Input({
    label,
    value,
    onChange,
    type = "text",
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
}) {
    return (
        <label className="block space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</span>
            <input
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 outline-none focus:border-slate-900"
            />
        </label>
    );
}

function Textarea({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <label className="block space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</span>
            <textarea
                rows={3}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 outline-none focus:border-slate-900 resize-none"
            />
        </label>
    );
}

function DraftList({ drafts }: { drafts: DraftSection[] }) {
    if (drafts.length === 0) return null;

    return (
        <div className="space-y-4">
            {drafts.map((draft) => (
                <article key={draft.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50 space-y-3">
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <h3 className="font-black text-slate-900">{draft.title}</h3>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${draft.status === "flagged" ? "text-red-500" : "text-emerald-600"}`}>
                            {draft.status}
                        </span>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{draft.generatedText}</p>
                    {draft.guardrailFlags.length > 0 && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl space-y-2">
                            {draft.guardrailFlags.map((flag) => (
                                <p key={`${flag.kind}-${flag.value}`} className="text-xs font-bold text-red-700">
                                    {flag.kind}: {flag.value}. {flag.message}
                                </p>
                            ))}
                        </div>
                    )}
                </article>
            ))}
        </div>
    );
}
