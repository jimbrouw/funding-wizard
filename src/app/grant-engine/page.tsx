"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
    DraftSection,
    GrantEngineState,
    InterrogationQuestion,
    InterrogationStatus,
    MasterDataAssetType,
    Project,
    ProjectGrant,
    ProjectStatus,
} from "@/lib/grant-engine/types";
import { SEEDED_PROJECT_GRANT_ID } from "@/lib/grant-engine/seed";

type ApiState = {
    mode: string;
    state: GrantEngineState;
};

type IconName = "check" | "grants" | "data" | "drafts" | "research" | "settings" | "reset" | "lock" | "plus";

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

const navItems: { label: string; icon: IconName; active?: boolean }[] = [
    { label: "Project Check", icon: "check", active: true },
    { label: "Grants", icon: "grants" },
    { label: "Master Data", icon: "data" },
    { label: "Drafts", icon: "drafts" },
    { label: "Research", icon: "research" },
    { label: "Settings", icon: "settings" },
];

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

    const answeredCount =
        selectedContext?.questions.filter((question) => ["answered", "not_applicable"].includes(question.status)).length || 0;
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
            <div className="min-h-screen bg-slate-50 text-slate-950 flex items-center justify-center">
                <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Loading Vibe Cheque
                </div>
            </div>
        );
    }

    const visibleQuestions = selectedContext.questions.slice(0, 4);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-950">
            <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)_320px]">
                <Sidebar dataMode={apiState?.mode || "seeded-memory"} />

                <main className="min-w-0 border-x border-slate-200 bg-white">
                    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
                        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-end md:justify-between">
                            <div>
                                <h1 className="text-[2rem] font-semibold tracking-tight text-slate-950 sm:text-[2.35rem]">
                                    Project Check
                                </h1>
                                <p className="mt-1 text-sm font-medium text-slate-500">
                                    Check the project before you write the application.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={busy}
                                aria-label="Reset local seed data"
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
                            >
                                <Icon name="reset" />
                                Reset seed
                            </button>
                        </div>

                        {error && (
                            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                                {error}
                            </div>
                        )}

                        <section aria-labelledby="pairing-title" className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-center">
                                <div>
                                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-500">
                                        Project
                                    </p>
                                    <h2 id="pairing-title" className="mt-1 text-base font-semibold text-slate-950">
                                        {selectedContext.project.name}
                                    </h2>
                                </div>
                                <div>
                                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-500">
                                        Grant
                                    </p>
                                    <p className="mt-1 text-base font-semibold text-slate-950">{selectedContext.grant.title}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleInterrogate(selectedContext.pairing)}
                                    disabled={busy}
                                    className="inline-flex h-10 items-center justify-center rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                                >
                                    Run interrogation
                                </button>
                            </div>
                        </section>

                        <StatusStrip
                            questions={selectedContext.questions.length}
                            answered={answeredCount}
                            open={unresolvedCount}
                            draftLocked={!canDraft}
                        />

                        <section aria-labelledby="gate-title" className="panel">
                            <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 id="gate-title" className="text-lg font-semibold text-slate-950">
                                        Interrogation gate
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Resolve the required gaps before the draft engine unlocks.
                                    </p>
                                </div>
                                <span className="rounded-full border border-lime-400/40 bg-lime-50 px-3 py-1 text-xs font-bold text-green-900">
                                    {selectedContext.questions.length || "No"} checks
                                </span>
                            </div>

                            {selectedContext.questions.length === 0 ? (
                                <div className="py-7 text-sm font-medium text-slate-500">
                                    Run interrogation to generate the fixed gap set.
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-200">
                                    {visibleQuestions.map((question) => (
                                        <QuestionRow
                                            key={question.id}
                                            question={question}
                                            value={answers[question.id] ?? question.answer}
                                            busy={busy}
                                            onChange={(value) => setAnswers((current) => ({ ...current, [question.id]: value }))}
                                            onAnswer={() => handleAnswer(question, "answered")}
                                            onNotApplicable={() => handleAnswer(question, "not_applicable")}
                                        />
                                    ))}
                                </div>
                            )}
                        </section>

                        <section aria-labelledby="draft-title" className="panel">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <h2 id="draft-title" className="text-lg font-semibold text-slate-950">Draft</h2>
                                    <p className="mt-1 max-w-2xl text-sm text-slate-500">
                                        Generation is locked until all required questions are answered or marked not applicable.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleDraft(selectedContext.pairing)}
                                    disabled={busy || !canDraft}
                                    aria-label={canDraft ? "Generate draft" : "Draft generation locked"}
                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-green-950 px-4 text-sm font-semibold text-white hover:bg-green-900 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                                >
                                    <Icon name={canDraft ? "drafts" : "lock"} />
                                    {canDraft ? "Generate draft" : "Draft locked"}
                                </button>
                            </div>
                            {!canDraft && selectedContext.questions.length > 0 && (
                                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
                                    Drafting is blocked until every required question is answered or marked not applicable.
                                </div>
                            )}
                            <DraftList drafts={selectedContext.drafts} />
                        </section>

                        <section className="grid gap-5 xl:grid-cols-2">
                            <CompactForm title="Create project">
                                <form className="space-y-3" onSubmit={handleCreateProject}>
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
                                        onChange={(value) =>
                                            setProjectForm((current) => ({ ...current, concreteOutputs: value }))
                                        }
                                    />
                                    <Input
                                        label="Budget total"
                                        type="number"
                                        value={projectForm.budgetTotal}
                                        onChange={(value) => setProjectForm((current) => ({ ...current, budgetTotal: value }))}
                                    />
                                    <button
                                        disabled={busy || !projectForm.name || !projectForm.rawIdea}
                                        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-40"
                                    >
                                        <Icon name="plus" />
                                        Create and select
                                    </button>
                                </form>
                            </CompactForm>

                            <CompactForm title="Master data">
                                <div className="mb-4 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
                                    {state.masterDataAssets.slice(0, 3).map((asset) => (
                                        <div key={asset.id} className="px-3 py-2">
                                            <p className="text-[0.67rem] font-bold uppercase tracking-[0.14em] text-slate-400">
                                                {asset.assetType.replaceAll("_", " ")}
                                            </p>
                                            <p className="mt-0.5 text-sm font-semibold text-slate-900">{asset.title}</p>
                                        </div>
                                    ))}
                                </div>
                                <form className="space-y-3" onSubmit={handleAddMasterData}>
                                    <label className="block space-y-1.5">
                                        <span className="field-label">Asset type</span>
                                        <select
                                            value={masterDataForm.assetType}
                                            onChange={(event) =>
                                                setMasterDataForm((current) => ({
                                                    ...current,
                                                    assetType: event.target.value as MasterDataAssetType,
                                                }))
                                            }
                                            className="field-control"
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
                                        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-40"
                                    >
                                        <Icon name="plus" />
                                        Add master data
                                    </button>
                                </form>
                            </CompactForm>
                        </section>
                    </div>
                </main>

                <ProjectsPanel
                    projects={state.projects}
                    pairings={state.projectGrants}
                    selectedPairingId={selectedPairingId}
                    selectedContext={selectedContext}
                    unresolvedCount={unresolvedCount}
                    onSelect={setSelectedPairingId}
                />
            </div>
        </div>
    );
}

function Sidebar({ dataMode }: { dataMode: string }) {
    return (
        <aside className="border-b border-slate-200 bg-slate-100/80 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-b-0">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 lg:block lg:px-5 lg:py-5">
                <div>
                    <p className="text-base font-semibold tracking-tight text-slate-950">Vibe Cheque</p>
                    <p className="mt-0.5 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-500">Workbench</p>
                </div>
                <span className="rounded-full border border-slate-300 bg-white px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em] text-slate-500 lg:hidden">
                    {formatMode(dataMode)}
                </span>
            </div>
            <nav aria-label="Primary" className="flex gap-1 overflow-x-auto px-3 py-3 lg:flex-col lg:px-3">
                {navItems.map((item) => (
                    <button
                        key={item.label}
                        type="button"
                        aria-current={item.active ? "page" : undefined}
                        className={`inline-flex h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition-colors lg:w-full ${
                            item.active
                                ? "bg-white text-slate-950 shadow-sm ring-1 ring-slate-200"
                                : "text-slate-600 hover:bg-white/70 hover:text-slate-950"
                        }`}
                    >
                        <Icon name={item.icon} />
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
            <div className="mt-auto hidden border-t border-slate-200 px-5 py-4 lg:block">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-500">Data mode</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{formatMode(dataMode)}</p>
            </div>
        </aside>
    );
}

function StatusStrip({
    questions,
    answered,
    open,
    draftLocked,
}: {
    questions: number;
    answered: number;
    open: number;
    draftLocked: boolean;
}) {
    return (
        <section aria-label="Project check status" className="grid grid-cols-2 overflow-hidden rounded-xl border border-slate-200 bg-white sm:grid-cols-4">
            <StatusCell label="Questions" value={String(questions)} />
            <StatusCell label="Answered" value={String(answered)} accent />
            <StatusCell label="Open" value={String(open)} />
            <StatusCell label={draftLocked ? "Draft locked" : "Draft ready"} value={draftLocked ? "Locked" : "Ready"} />
        </section>
    );
}

function StatusCell({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
    return (
        <div className="border-b border-r border-slate-200 px-4 py-3 last:border-r-0 sm:border-b-0">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
            <p className={`mt-1 text-xl font-semibold ${accent ? "text-green-950" : "text-slate-950"}`}>{value}</p>
        </div>
    );
}

function QuestionRow({
    question,
    value,
    busy,
    onChange,
    onAnswer,
    onNotApplicable,
}: {
    question: InterrogationQuestion;
    value: string;
    busy: boolean;
    onChange: (value: string) => void;
    onAnswer: () => void;
    onNotApplicable: () => void;
}) {
    const isOpen = ["open", "rewrite_requested"].includes(question.status);

    return (
        <article className="grid gap-4 py-4 lg:grid-cols-[minmax(0,1fr)_160px]">
            <div className="min-w-0">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <h3 className="text-base font-semibold leading-snug text-slate-950">{question.question}</h3>
                    <StatusChip status={question.status} />
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-500">{question.reason}</p>
                {isOpen ? (
                    <textarea
                        aria-label={`Answer ${question.question}`}
                        rows={3}
                        value={value}
                        onChange={(event) => onChange(event.target.value)}
                        placeholder="Add the missing evidence, cost, owner, or decision."
                        className="mt-3 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium leading-6 text-slate-950 outline-none placeholder:text-slate-400 focus:border-green-900 focus:ring-2 focus:ring-lime-300/40"
                    />
                ) : (
                    <p className="mt-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-700">
                        {question.answer || "Marked not applicable."}
                    </p>
                )}
            </div>
            <div className="flex items-start gap-2 lg:flex-col">
                {isOpen ? (
                    <>
                        <button
                            type="button"
                            onClick={onAnswer}
                            disabled={busy || !value}
                            className="inline-flex h-9 flex-1 items-center justify-center rounded-lg bg-slate-950 px-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-40 lg:w-full"
                        >
                            Answer
                        </button>
                        <button
                            type="button"
                            onClick={onNotApplicable}
                            disabled={busy}
                            className="inline-flex h-9 flex-1 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 lg:w-full"
                        >
                            Not applicable
                        </button>
                    </>
                ) : (
                    <button
                        type="button"
                        onClick={onAnswer}
                        disabled={busy || !value}
                        className="inline-flex h-9 w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                    >
                        Update
                    </button>
                )}
            </div>
        </article>
    );
}

function ProjectsPanel({
    projects,
    pairings,
    selectedPairingId,
    selectedContext,
    unresolvedCount,
    onSelect,
}: {
    projects: Project[];
    pairings: ProjectGrant[];
    selectedPairingId: string;
    selectedContext: {
        project: Project;
        grant: GrantEngineState["grants"][number];
        pairing: ProjectGrant;
        questions: InterrogationQuestion[];
        drafts: DraftSection[];
    };
    unresolvedCount: number;
    onSelect: (value: string) => void;
}) {
    const criteria = selectedContext.grant.assessmentCriteria;

    return (
        <aside className="bg-slate-50 px-4 py-5 sm:px-6 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:px-5">
            <section aria-labelledby="projects-title" className="panel">
                <h2 id="projects-title" className="text-lg font-semibold text-slate-950">Projects</h2>
                <div className="mt-4 divide-y divide-slate-200">
                    {pairings.map((pairing) => {
                        const project = projects.find((item) => item.id === pairing.projectId);
                        if (!project) return null;
                        const selected = pairing.id === selectedPairingId;

                        return (
                            <button
                                key={pairing.id}
                                type="button"
                                onClick={() => onSelect(pairing.id)}
                                aria-current={selected ? "true" : undefined}
                                className={`grid w-full gap-1 px-2 py-3 text-left transition-colors ${
                                    selected ? "bg-lime-50/70" : "hover:bg-white"
                                }`}
                            >
                                <span className="flex items-start justify-between gap-3">
                                    <span className="text-sm font-semibold text-slate-950">{project.name}</span>
                                    {selected && (
                                        <span className="mt-0.5 h-2 w-2 rounded-full bg-lime-500" aria-label="Selected project" />
                                    )}
                                </span>
                                <span className="flex items-center justify-between gap-3 text-xs font-semibold text-slate-500">
                                    <span>{formatProjectStatus(project.status)}</span>
                                    <span>{formatCurrency(project.budgetTotal)}</span>
                                </span>
                            </button>
                        );
                    })}
                </div>
            </section>

            <section aria-labelledby="grant-fit-title" className="panel mt-5">
                <div className="flex items-center justify-between gap-3">
                    <h2 id="grant-fit-title" className="text-lg font-semibold text-slate-950">Grant fit</h2>
                    <span className="text-sm font-semibold text-green-950">{selectedContext.pairing.matchScore || 0}%</span>
                </div>
                <div className="mt-4 space-y-3">
                    {criteria.map((criterion) => {
                        const relatedQuestion = selectedContext.questions.find((question) => question.criterionId === criterion.id);
                        const complete = relatedQuestion ? !["open", "rewrite_requested"].includes(relatedQuestion.status) : false;

                        return (
                            <div key={criterion.id} className="grid grid-cols-[18px_minmax(0,1fr)] gap-3">
                                <span
                                    className={`mt-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full border text-[0.65rem] font-bold ${
                                        complete
                                            ? "border-lime-500 bg-lime-100 text-green-950"
                                            : "border-slate-300 bg-white text-slate-400"
                                    }`}
                                    aria-hidden="true"
                                >
                                    {complete ? "✓" : ""}
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">{criterion.label}</p>
                                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-200">
                                        <div
                                            className={`h-full rounded-full ${complete ? "bg-lime-500" : "bg-slate-300"}`}
                                            style={{ width: complete ? "100%" : unresolvedCount > 0 ? "46%" : "75%" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </aside>
    );
}

function CompactForm({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">{title}</h2>
            {children}
        </section>
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
        <label className="block space-y-1.5">
            <span className="field-label">{label}</span>
            <input
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="field-control"
            />
        </label>
    );
}

function Textarea({
    label,
    value,
    onChange,
    placeholder,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}) {
    return (
        <label className="mt-3 block space-y-1.5">
            <span className="field-label">{label}</span>
            <textarea
                rows={3}
                value={value}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
                className="field-control resize-none"
            />
        </label>
    );
}

function DraftList({ drafts }: { drafts: DraftSection[] }) {
    if (drafts.length === 0) return null;

    return (
        <div className="mt-5 divide-y divide-slate-200 border-t border-slate-200">
            {drafts.map((draft) => (
                <article key={draft.id} className="py-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <h3 className="font-semibold text-slate-950">{draft.title}</h3>
                        <span className={`text-xs font-bold uppercase tracking-[0.14em] ${draft.status === "flagged" ? "text-red-600" : "text-green-800"}`}>
                            {draft.status}
                        </span>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{draft.generatedText}</p>
                    {draft.guardrailFlags.length > 0 && (
                        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                            {draft.guardrailFlags.map((flag) => (
                                <p key={`${flag.kind}-${flag.value}`} className="text-xs font-semibold text-red-700">
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

function StatusChip({ status }: { status: InterrogationStatus }) {
    const open = ["open", "rewrite_requested"].includes(status);
    return (
        <span
            className={`inline-flex h-7 shrink-0 items-center rounded-full border px-2.5 text-xs font-bold capitalize ${
                open
                    ? "border-amber-200 bg-amber-50 text-amber-800"
                    : "border-lime-400/50 bg-lime-50 text-green-950"
            }`}
        >
            {status.replaceAll("_", " ")}
        </span>
    );
}

function Icon({ name }: { name: IconName }) {
    const common = "h-4 w-4 shrink-0";
    if (name === "check") {
        return (
            <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }
    if (name === "grants") {
        return (
            <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M7 4h10v16H7z" />
                <path d="M9 8h6M9 12h6M9 16h4" strokeLinecap="round" />
            </svg>
        );
    }
    if (name === "data") {
        return (
            <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 7c0-2 16-2 16 0v10c0 2-16 2-16 0z" />
                <path d="M4 7c0 2 16 2 16 0M4 12c0 2 16 2 16 0" />
            </svg>
        );
    }
    if (name === "drafts") {
        return (
            <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 3h8l4 4v14H6z" />
                <path d="M14 3v5h5M9 13h6M9 17h6" strokeLinecap="round" />
            </svg>
        );
    }
    if (name === "research") {
        return (
            <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="10" cy="10" r="5" />
                <path d="m14 14 5 5" strokeLinecap="round" />
            </svg>
        );
    }
    if (name === "settings") {
        return (
            <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" strokeLinecap="round" />
            </svg>
        );
    }
    if (name === "reset") {
        return (
            <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 12a8 8 0 1 0 3-6.2" strokeLinecap="round" />
                <path d="M4 4v6h6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }
    if (name === "lock") {
        return (
            <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="5" y="10" width="14" height="10" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" strokeLinecap="round" />
            </svg>
        );
    }
    return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
    );
}

function formatMode(mode: string) {
    return mode === "seeded-memory" ? "Local seed" : mode.replaceAll("-", " ");
}

function formatCurrency(value: number | null) {
    if (!value) return "";
    return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
        maximumFractionDigits: 0,
    }).format(value);
}

function formatProjectStatus(status: ProjectStatus) {
    if (status === "ready_to_draft") return "Ready to draft";
    return status.replaceAll("_", " ").replace(/^\w/, (letter) => letter.toUpperCase());
}
