import { createSeedState } from "./seed";
import {
    Grant,
    GrantEngineState,
    InterrogationQuestion,
    MasterDataAsset,
    NormalizedGrantPayload,
    Project,
    ProjectGrant,
} from "./types";

declare global {
    var __grantEngineState: GrantEngineState | undefined;
}

export function getState(): GrantEngineState {
    if (!globalThis.__grantEngineState) {
        globalThis.__grantEngineState = createSeedState();
    }

    return globalThis.__grantEngineState;
}

export function replaceState(state: GrantEngineState): GrantEngineState {
    globalThis.__grantEngineState = state;
    return state;
}

export function createProject(input: {
    name: string;
    rawIdea: string;
    concreteOutputs?: string;
    budgetTotal?: number | null;
}): { state: GrantEngineState; project: Project; pairing: ProjectGrant } {
    const state = getState();
    const activeGrant = state.grants.find((grant) => grant.status === "active") || state.grants[0];
    if (!activeGrant) throw new Error("No grant exists to pair with the project.");

    const project: Project = {
        id: `project-${crypto.randomUUID()}`,
        name: input.name,
        rawIdea: input.rawIdea,
        concreteOutputs: input.concreteOutputs || "",
        budgetTotal: input.budgetTotal ?? null,
        status: "draft",
    };
    const pairing: ProjectGrant = {
        id: `pg-${crypto.randomUUID()}`,
        projectId: project.id,
        grantId: activeGrant.id,
        relationship: "selected",
        matchScore: null,
    };

    state.projects.push(project);
    state.projectGrants
        .filter((item) => item.projectId === project.id)
        .forEach((item) => {
            item.relationship = "candidate";
        });
    state.projectGrants.push(pairing);

    return { state, project, pairing };
}

export function addMasterDataAsset(input: Omit<MasterDataAsset, "id">): { state: GrantEngineState; asset: MasterDataAsset } {
    const state = getState();
    const asset: MasterDataAsset = {
        ...input,
        id: `asset-${crypto.randomUUID()}`,
    };
    state.masterDataAssets.push(asset);
    return { state, asset };
}

export function addGrantFromFetcher(payload: NormalizedGrantPayload): { state: GrantEngineState; grant: Grant } {
    const state = getState();
    const grant: Grant = {
        id: `grant-${crypto.randomUUID()}`,
        funderName: payload.funder_name,
        title: payload.title,
        grantUrl: payload.grant_url,
        deadline: payload.deadline || "",
        maxAmount: payload.max_amount ?? null,
        matchSummary: payload.match_summary,
        historicalFocus: "",
        requirementsText: payload.requirements_text,
        assessmentCriteria: payload.assessment_criteria,
        status: "discovery",
    };
    state.grants.push(grant);
    return { state, grant };
}

export function saveInterrogationQuestions(projectGrantId: string, questions: InterrogationQuestion[]): GrantEngineState {
    const state = getState();
    const existingIds = new Set(state.interrogationQuestions.map((question) => question.id));
    questions.forEach((question) => {
        if (!existingIds.has(question.id)) state.interrogationQuestions.push(question);
    });

    const pairing = state.projectGrants.find((item) => item.id === projectGrantId);
    const project = pairing ? state.projects.find((item) => item.id === pairing.projectId) : null;
    if (project && project.status === "draft") project.status = "interrogating";

    return state;
}

export function answerQuestion(input: {
    questionId: string;
    answer: string;
    status: "answered" | "not_applicable" | "rewrite_requested";
}): GrantEngineState {
    const state = getState();
    const question = state.interrogationQuestions.find((item) => item.id === input.questionId);
    if (!question) throw new Error("Question not found.");

    question.answer = input.answer;
    question.status = input.status;
    updateProjectGate(question.projectGrantId);

    return state;
}

export function updateProjectGate(projectGrantId: string): GrantEngineState {
    const state = getState();
    const pairing = state.projectGrants.find((item) => item.id === projectGrantId);
    const project = pairing ? state.projects.find((item) => item.id === pairing.projectId) : null;
    if (!project) return state;

    const unresolved = state.interrogationQuestions.some(
        (question) =>
            question.projectGrantId === projectGrantId &&
            question.required &&
            ["open", "rewrite_requested"].includes(question.status),
    );

    project.status = unresolved ? "interrogating" : "ready_to_draft";
    return state;
}
