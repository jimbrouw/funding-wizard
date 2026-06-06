import {
    DraftSection,
    Grant,
    GrantEngineState,
    GuardrailFlag,
    InterrogationQuestion,
    MasterDataAsset,
    NormalizedGrantPayload,
    Project,
    ProjectGrant,
} from "./types";
import { runDraftGuardrails } from "./guardrails";

const MAX_INTERROGATION_QUESTIONS = 8;

type PairingContext = {
    project: Project;
    grant: Grant;
    pairing: ProjectGrant;
    masterDataAssets: MasterDataAsset[];
    questions: InterrogationQuestion[];
};

export function getPairingContext(state: GrantEngineState, projectGrantId: string): PairingContext {
    const pairing = state.projectGrants.find((item) => item.id === projectGrantId);
    if (!pairing) throw new Error("Project/grant pairing not found.");

    const project = state.projects.find((item) => item.id === pairing.projectId);
    if (!project) throw new Error("Project not found.");

    const grant = state.grants.find((item) => item.id === pairing.grantId);
    if (!grant) throw new Error("Grant not found.");

    return {
        project,
        grant,
        pairing,
        masterDataAssets: state.masterDataAssets,
        questions: state.interrogationQuestions.filter((question) => question.projectGrantId === projectGrantId),
    };
}

export function buildInterrogationQuestions(context: PairingContext): InterrogationQuestion[] {
    if (context.questions.length > 0) return context.questions;

    const baseQuestions: InterrogationQuestion[] = [
        makeQuestion(context.pairing.id, "concrete_output", "What is the concrete public output?", "The funder needs a tangible result, not a theme."),
        makeQuestion(context.pairing.id, "match_funding", "Where is the match funding or in-kind support coming from?", "Budget credibility needs named sources or a clear zero-match explanation."),
        makeQuestion(context.pairing.id, "access_costs", "What is the access cost breakdown?", "Access must be costed, not described as a general commitment."),
        makeQuestion(context.pairing.id, "timeline_risk", "What is the main timeline risk and how will you handle it?", "Delivery risk needs a plain mitigation."),
    ];

    const criteriaQuestions = context.grant.assessmentCriteria.map((criterion) =>
        makeQuestion(
            context.pairing.id,
            criterion.id,
            `What proof do you have for "${criterion.label}"?`,
            criterion.detail,
        ),
    );

    return [...baseQuestions, ...criteriaQuestions].slice(0, MAX_INTERROGATION_QUESTIONS);
}

export function canDraft(questions: InterrogationQuestion[]): { ok: boolean; unresolved: InterrogationQuestion[] } {
    const unresolved = questions.filter(
        (question) => question.required && ["open", "rewrite_requested"].includes(question.status),
    );

    return {
        ok: unresolved.length === 0,
        unresolved,
    };
}

export function buildSourceCorpus(context: PairingContext): string {
    return [
        context.project.name,
        context.project.rawIdea,
        context.project.concreteOutputs,
        context.project.budgetTotal ? `£${context.project.budgetTotal}` : "",
        context.grant.title,
        context.grant.funderName,
        context.grant.matchSummary,
        context.grant.historicalFocus,
        context.grant.requirementsText,
        ...context.grant.assessmentCriteria.flatMap((criterion) => [criterion.label, criterion.detail]),
        ...context.masterDataAssets.flatMap((asset) => [asset.title, asset.content, asset.notes || ""]),
        ...context.questions.flatMap((question) => [question.question, question.answer]),
    ].join("\n");
}

export function buildDraftSections(context: PairingContext): DraftSection[] {
    const gate = canDraft(context.questions);
    if (!gate.ok) {
        throw new Error("Drafting is blocked until every required interrogation question is answered or marked not applicable.");
    }

    const sourceCorpus = buildSourceCorpus(context);
    const answerLines = context.questions
        .filter((question) => question.status === "answered" && question.answer.trim().length > 0)
        .map((question) => `${question.question} ${question.answer}`);
    const accessAsset = context.masterDataAssets.find((asset) => asset.assetType === "access_rider");
    const equipmentAsset = context.masterDataAssets.find((asset) => asset.assetType === "equipment_inventory");

    const summaryText = [
        `${context.project.name} is a time-limited project for ${context.grant.title}.`,
        context.project.rawIdea,
        context.project.concreteOutputs ? `The output is ${context.project.concreteOutputs}.` : "",
        context.project.budgetTotal ? `The total budget is £${context.project.budgetTotal}.` : "",
        answerLines.slice(0, 4).join(" "),
    ].filter(Boolean).join("\n\n");

    const feasibilityText = [
        equipmentAsset ? `Available equipment: ${equipmentAsset.content}` : "",
        accessAsset ? `Access plan: ${accessAsset.content}` : "",
        answerLines.slice(4).join(" "),
    ].filter(Boolean).join("\n\n");

    return [
        makeDraftSection(context.pairing.id, "project_summary", "Project summary", summaryText, sourceCorpus),
        makeDraftSection(context.pairing.id, "feasibility_access", "Feasibility and access", feasibilityText, sourceCorpus),
    ];
}

export function validateFetcherPayload(payload: NormalizedGrantPayload): string[] {
    const errors: string[] = [];
    if (!payload.source) errors.push("source is required");
    if (!payload.source_url) errors.push("source_url is required");
    if (!payload.title) errors.push("title is required");
    if (!payload.funder_name) errors.push("funder_name is required");
    if (!payload.grant_url) errors.push("grant_url is required");
    if (!payload.match_summary) errors.push("match_summary is required");
    if (!payload.requirements_text) errors.push("requirements_text is required");
    if (!Array.isArray(payload.assessment_criteria)) errors.push("assessment_criteria must be an array");
    return errors;
}

function makeQuestion(projectGrantId: string, criterionId: string, question: string, reason: string): InterrogationQuestion {
    return {
        id: crypto.randomUUID(),
        projectGrantId,
        criterionId,
        question,
        reason,
        required: true,
        status: "open",
        answer: "",
    };
}

function makeDraftSection(
    projectGrantId: string,
    sectionKey: string,
    title: string,
    generatedText: string,
    sourceCorpus: string,
): DraftSection {
    const flags: GuardrailFlag[] = runDraftGuardrails(generatedText, sourceCorpus);

    return {
        id: crypto.randomUUID(),
        projectGrantId,
        sectionKey,
        title,
        generatedText,
        sourceInputs: {
            generatedFrom: "project, grant, master data, interrogation answers",
        },
        guardrailFlags: flags,
        status: flags.length > 0 ? "flagged" : "generated",
    };
}
