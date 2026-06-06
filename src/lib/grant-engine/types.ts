export type ProjectStatus = "draft" | "interrogating" | "ready_to_draft" | "drafted" | "archived";
export type GrantStatus = "discovery" | "active" | "selected" | "rejected";
export type ProjectGrantRelationship = "candidate" | "selected" | "rejected";
export type InterrogationStatus = "open" | "answered" | "not_applicable" | "rewrite_requested";
export type DraftStatus = "generated" | "edited" | "approved" | "flagged";

export type AssessmentCriterion = {
    id: string;
    label: string;
    detail: string;
};

export type Project = {
    id: string;
    name: string;
    rawIdea: string;
    concreteOutputs: string;
    budgetTotal: number | null;
    status: ProjectStatus;
};

export type Grant = {
    id: string;
    funderName: string;
    title: string;
    grantUrl: string;
    deadline: string;
    maxAmount: number | null;
    matchSummary: string;
    historicalFocus: string;
    assessmentCriteria: AssessmentCriterion[];
    requirementsText: string;
    status: GrantStatus;
};

export type MasterDataAssetType =
    | "bio"
    | "budget_template"
    | "access_rider"
    | "method_statement"
    | "equipment_inventory"
    | "past_project_outcome";

export type MasterDataAsset = {
    id: string;
    assetType: MasterDataAssetType;
    title: string;
    content: string;
    notes?: string;
};

export type ProjectGrant = {
    id: string;
    projectId: string;
    grantId: string;
    relationship: ProjectGrantRelationship;
    matchScore: number | null;
};

export type InterrogationQuestion = {
    id: string;
    projectGrantId: string;
    criterionId?: string;
    question: string;
    reason: string;
    required: boolean;
    status: InterrogationStatus;
    answer: string;
};

export type GuardrailFlag = {
    kind: "slop_term" | "unsupported_claim" | "vague_claim";
    value: string;
    message: string;
};

export type DraftSection = {
    id: string;
    projectGrantId: string;
    sectionKey: string;
    title: string;
    generatedText: string;
    sourceInputs: Record<string, unknown>;
    guardrailFlags: GuardrailFlag[];
    status: DraftStatus;
};

export type GrantEngineState = {
    projects: Project[];
    grants: Grant[];
    masterDataAssets: MasterDataAsset[];
    projectGrants: ProjectGrant[];
    interrogationQuestions: InterrogationQuestion[];
    draftSections: DraftSection[];
};

export type NormalizedGrantPayload = {
    source: string;
    source_url: string;
    title: string;
    funder_name: string;
    deadline?: string;
    max_amount?: number;
    grant_url: string;
    match_summary: string;
    requirements_text: string;
    assessment_criteria: AssessmentCriterion[];
};
