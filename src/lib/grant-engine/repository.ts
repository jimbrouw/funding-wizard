import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { createSeedState } from "./seed";
import {
    DraftSection,
    Grant,
    GrantEngineState,
    InterrogationQuestion,
    MasterDataAsset,
    MasterDataAssetType,
    NormalizedGrantPayload,
    Project,
    ProjectGrant,
} from "./types";
import {
    addGrantFromFetcher,
    addMasterDataAsset,
    answerQuestion,
    createProject,
    getState,
    replaceState,
    saveInterrogationQuestions,
} from "./store";

export type CreateProjectInput = {
    name: string;
    rawIdea: string;
    concreteOutputs?: string;
    budgetTotal?: number | null;
};

export type CreateMasterDataInput = {
    assetType: MasterDataAssetType;
    title: string;
    content: string;
    notes?: string;
};

export type AnswerQuestionInput = {
    questionId: string;
    answer: string;
    status: "answered" | "not_applicable" | "rewrite_requested";
};

export interface GrantEngineRepository {
    mode: "seeded-memory" | "supabase";
    getState(): Promise<GrantEngineState>;
    reset(): Promise<GrantEngineState>;
    createProject(input: CreateProjectInput): Promise<{ state: GrantEngineState; project: Project; pairing: ProjectGrant }>;
    addMasterDataAsset(input: CreateMasterDataInput): Promise<{ state: GrantEngineState; asset: MasterDataAsset }>;
    addGrantFromFetcher(payload: NormalizedGrantPayload): Promise<{ state: GrantEngineState; grant: Grant }>;
    saveInterrogationQuestions(projectGrantId: string, questions: InterrogationQuestion[]): Promise<GrantEngineState>;
    answerQuestion(input: AnswerQuestionInput): Promise<GrantEngineState>;
    saveDraftSections(projectGrantId: string, drafts: DraftSection[]): Promise<GrantEngineState>;
}

type Row = Record<string, unknown>;

export function getGrantEngineRepository(): GrantEngineRepository {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (url && key) {
        return new SupabaseGrantEngineRepository(createClient(url, key, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            },
        }));
    }

    return new MemoryGrantEngineRepository();
}

class MemoryGrantEngineRepository implements GrantEngineRepository {
    mode = "seeded-memory" as const;

    async getState() {
        return getState();
    }

    async reset() {
        return replaceState(createSeedState());
    }

    async createProject(input: CreateProjectInput) {
        return createProject(input);
    }

    async addMasterDataAsset(input: CreateMasterDataInput) {
        return addMasterDataAsset(input);
    }

    async addGrantFromFetcher(payload: NormalizedGrantPayload) {
        return addGrantFromFetcher(payload);
    }

    async saveInterrogationQuestions(projectGrantId: string, questions: InterrogationQuestion[]) {
        return saveInterrogationQuestions(projectGrantId, questions);
    }

    async answerQuestion(input: AnswerQuestionInput) {
        return answerQuestion(input);
    }

    async saveDraftSections(projectGrantId: string, drafts: DraftSection[]) {
        const state = getState();
        const existingIds = new Set(state.draftSections.map((section) => section.id));
        drafts.forEach((section) => {
            if (!existingIds.has(section.id)) state.draftSections.push(section);
        });

        const pairing = state.projectGrants.find((item) => item.id === projectGrantId);
        const project = pairing ? state.projects.find((item) => item.id === pairing.projectId) : null;
        if (project) project.status = "drafted";

        return state;
    }
}

class SupabaseGrantEngineRepository implements GrantEngineRepository {
    mode = "supabase" as const;

    constructor(private readonly client: SupabaseClient) {}

    async getState(): Promise<GrantEngineState> {
        const [projects, grants, masterDataAssets, projectGrants, interrogationQuestions, draftSections] =
            await Promise.all([
                this.selectRows("projects"),
                this.selectRows("grants"),
                this.selectRows("master_data_assets"),
                this.selectRows("project_grants"),
                this.selectRows("interrogation_questions"),
                this.selectRows("draft_sections"),
            ]);

        return {
            projects: projects.map(mapProject),
            grants: grants.map(mapGrant),
            masterDataAssets: masterDataAssets.map(mapMasterDataAsset),
            projectGrants: projectGrants.map(mapProjectGrant),
            interrogationQuestions: interrogationQuestions.map(mapInterrogationQuestion),
            draftSections: draftSections.map(mapDraftSection),
        };
    }

    async reset(): Promise<GrantEngineState> {
        await this.deleteAll("draft_sections");
        await this.deleteAll("interrogation_questions");
        await this.deleteAll("project_grants");
        await this.deleteAll("master_data_assets");
        await this.deleteAll("projects");
        await this.deleteAll("grants");

        const seed = createSeedState();
        await this.insertRows("projects", seed.projects.map(projectToRow));
        await this.insertRows("grants", seed.grants.map(grantToRow));
        await this.insertRows("master_data_assets", seed.masterDataAssets.map(masterDataAssetToRow));
        await this.insertRows("project_grants", seed.projectGrants.map(projectGrantToRow));

        return this.getState();
    }

    async createProject(input: CreateProjectInput): Promise<{ state: GrantEngineState; project: Project; pairing: ProjectGrant }> {
        const state = await this.getState();
        const activeGrant = state.grants.find((grant) => grant.status === "active") || state.grants[0];
        if (!activeGrant) throw new Error("No grant exists to pair with the project.");

        const project: Project = {
            id: crypto.randomUUID(),
            name: input.name,
            rawIdea: input.rawIdea,
            concreteOutputs: input.concreteOutputs || "",
            budgetTotal: input.budgetTotal ?? null,
            status: "draft",
        };
        const pairing: ProjectGrant = {
            id: crypto.randomUUID(),
            projectId: project.id,
            grantId: activeGrant.id,
            relationship: "selected",
            matchScore: null,
        };

        await this.insertRows("projects", [projectToRow(project)]);
        await this.insertRows("project_grants", [projectGrantToRow(pairing)]);

        return { state: await this.getState(), project, pairing };
    }

    async addMasterDataAsset(input: CreateMasterDataInput): Promise<{ state: GrantEngineState; asset: MasterDataAsset }> {
        const asset: MasterDataAsset = {
            id: crypto.randomUUID(),
            assetType: input.assetType,
            title: input.title,
            content: input.content,
            notes: input.notes || "",
        };

        await this.insertRows("master_data_assets", [masterDataAssetToRow(asset)]);
        return { state: await this.getState(), asset };
    }

    async addGrantFromFetcher(payload: NormalizedGrantPayload): Promise<{ state: GrantEngineState; grant: Grant }> {
        const grant: Grant = {
            id: crypto.randomUUID(),
            funderName: payload.funder_name,
            title: payload.title,
            grantUrl: payload.grant_url,
            deadline: payload.deadline || "",
            maxAmount: payload.max_amount ?? null,
            matchSummary: payload.match_summary,
            historicalFocus: "",
            assessmentCriteria: payload.assessment_criteria,
            requirementsText: payload.requirements_text,
            status: "discovery",
        };

        await this.insertRows("grants", [grantToRow(grant)]);
        return { state: await this.getState(), grant };
    }

    async saveInterrogationQuestions(projectGrantId: string, questions: InterrogationQuestion[]): Promise<GrantEngineState> {
        const state = await this.getState();
        const existing = state.interrogationQuestions.filter((question) => question.projectGrantId === projectGrantId);
        if (existing.length === 0 && questions.length > 0) {
            await this.insertRows("interrogation_questions", questions.map(interrogationQuestionToRow));
        }

        const pairing = state.projectGrants.find((item) => item.id === projectGrantId);
        const project = pairing ? state.projects.find((item) => item.id === pairing.projectId) : null;
        if (project && project.status === "draft") {
            await this.updateById("projects", project.id, { status: "interrogating" });
        }

        return this.getState();
    }

    async answerQuestion(input: AnswerQuestionInput): Promise<GrantEngineState> {
        const state = await this.getState();
        const question = state.interrogationQuestions.find((item) => item.id === input.questionId);
        if (!question) throw new Error("Question not found.");

        await this.updateById("interrogation_questions", input.questionId, {
            answer: input.answer,
            status: input.status,
        });

        await this.updateProjectGate(question.projectGrantId);
        return this.getState();
    }

    async saveDraftSections(projectGrantId: string, drafts: DraftSection[]): Promise<GrantEngineState> {
        if (drafts.length > 0) {
            const existing = (await this.getState()).draftSections.filter((section) => section.projectGrantId === projectGrantId);
            if (existing.length === 0) {
                await this.insertRows("draft_sections", drafts.map(draftSectionToRow));
            }
        }

        const state = await this.getState();
        const pairing = state.projectGrants.find((item) => item.id === projectGrantId);
        if (pairing) await this.updateById("projects", pairing.projectId, { status: "drafted" });

        return this.getState();
    }

    private async updateProjectGate(projectGrantId: string) {
        const state = await this.getState();
        const pairing = state.projectGrants.find((item) => item.id === projectGrantId);
        if (!pairing) return;

        const unresolved = state.interrogationQuestions.some(
            (question) =>
                question.projectGrantId === projectGrantId &&
                question.required &&
                ["open", "rewrite_requested"].includes(question.status),
        );
        await this.updateById("projects", pairing.projectId, { status: unresolved ? "interrogating" : "ready_to_draft" });
    }

    private async selectRows(table: string): Promise<Row[]> {
        const { data, error } = await this.client.from(table).select("*");
        if (error) throw new Error(error.message);
        return (data || []) as Row[];
    }

    private async insertRows(table: string, rows: Row[]) {
        if (rows.length === 0) return;
        const { error } = await this.client.from(table).insert(rows);
        if (error) throw new Error(error.message);
    }

    private async updateById(table: string, id: string, values: Row) {
        const { error } = await this.client.from(table).update(values).eq("id", id);
        if (error) throw new Error(error.message);
    }

    private async deleteAll(table: string) {
        const { error } = await this.client.from(table).delete().neq("id", "00000000-0000-0000-0000-000000000000");
        if (error) throw new Error(error.message);
    }
}

function mapProject(row: Row): Project {
    return {
        id: stringValue(row.id),
        name: stringValue(row.name),
        rawIdea: stringValue(row.raw_idea),
        concreteOutputs: stringValue(row.concrete_outputs),
        budgetTotal: numberOrNull(row.budget_total),
        status: stringValue(row.status) as Project["status"],
    };
}

function mapGrant(row: Row): Grant {
    return {
        id: stringValue(row.id),
        funderName: stringValue(row.funder_name),
        title: stringValue(row.title),
        grantUrl: stringValue(row.grant_url),
        deadline: stringValue(row.deadline),
        maxAmount: numberOrNull(row.max_amount),
        matchSummary: stringValue(row.match_summary),
        historicalFocus: stringValue(row.historical_focus),
        assessmentCriteria: Array.isArray(row.assessment_criteria) ? row.assessment_criteria as Grant["assessmentCriteria"] : [],
        requirementsText: stringValue(row.requirements_text),
        status: stringValue(row.status) as Grant["status"],
    };
}

function mapMasterDataAsset(row: Row): MasterDataAsset {
    return {
        id: stringValue(row.id),
        assetType: stringValue(row.asset_type) as MasterDataAsset["assetType"],
        title: stringValue(row.title),
        content: stringValue(row.content),
        notes: stringValue(row.notes),
    };
}

function mapProjectGrant(row: Row): ProjectGrant {
    return {
        id: stringValue(row.id),
        projectId: stringValue(row.project_id),
        grantId: stringValue(row.grant_id),
        relationship: stringValue(row.relationship) as ProjectGrant["relationship"],
        matchScore: numberOrNull(row.match_score),
    };
}

function mapInterrogationQuestion(row: Row): InterrogationQuestion {
    return {
        id: stringValue(row.id),
        projectGrantId: stringValue(row.project_grant_id),
        criterionId: stringValue(row.criterion_id),
        question: stringValue(row.question),
        reason: stringValue(row.reason),
        required: Boolean(row.required),
        status: stringValue(row.status) as InterrogationQuestion["status"],
        answer: stringValue(row.answer),
    };
}

function mapDraftSection(row: Row): DraftSection {
    return {
        id: stringValue(row.id),
        projectGrantId: stringValue(row.project_grant_id),
        sectionKey: stringValue(row.section_key),
        title: stringValue(row.title),
        generatedText: stringValue(row.generated_text),
        sourceInputs: isRecord(row.source_inputs) ? row.source_inputs : {},
        guardrailFlags: Array.isArray(row.guardrail_flags) ? row.guardrail_flags as DraftSection["guardrailFlags"] : [],
        status: stringValue(row.status) as DraftSection["status"],
    };
}

function projectToRow(project: Project): Row {
    return {
        id: project.id,
        name: project.name,
        raw_idea: project.rawIdea,
        concrete_outputs: project.concreteOutputs,
        budget_total: project.budgetTotal,
        status: project.status,
    };
}

function grantToRow(grant: Grant): Row {
    return {
        id: grant.id,
        funder_name: grant.funderName,
        title: grant.title,
        grant_url: grant.grantUrl,
        deadline: grant.deadline || null,
        max_amount: grant.maxAmount,
        match_summary: grant.matchSummary,
        historical_focus: grant.historicalFocus,
        assessment_criteria: grant.assessmentCriteria,
        requirements_text: grant.requirementsText,
        status: grant.status,
    };
}

function masterDataAssetToRow(asset: MasterDataAsset): Row {
    return {
        id: asset.id,
        asset_type: asset.assetType,
        title: asset.title,
        content: asset.content,
        notes: asset.notes || "",
    };
}

function projectGrantToRow(projectGrant: ProjectGrant): Row {
    return {
        id: projectGrant.id,
        project_id: projectGrant.projectId,
        grant_id: projectGrant.grantId,
        relationship: projectGrant.relationship,
        match_score: projectGrant.matchScore,
    };
}

function interrogationQuestionToRow(question: InterrogationQuestion): Row {
    return {
        id: question.id,
        project_grant_id: question.projectGrantId,
        criterion_id: question.criterionId || null,
        question: question.question,
        reason: question.reason,
        required: question.required,
        status: question.status,
        answer: question.answer,
    };
}

function draftSectionToRow(section: DraftSection): Row {
    return {
        id: section.id,
        project_grant_id: section.projectGrantId,
        section_key: section.sectionKey,
        title: section.title,
        generated_text: section.generatedText,
        source_inputs: section.sourceInputs,
        guardrail_flags: section.guardrailFlags,
        status: section.status,
    };
}

function stringValue(value: unknown): string {
    return typeof value === "string" ? value : "";
}

function numberOrNull(value: unknown): number | null {
    if (typeof value === "number") return value;
    if (typeof value === "string" && value.trim() !== "") return Number(value);
    return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
