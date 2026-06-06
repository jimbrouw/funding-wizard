import { buildSourceCorpus } from "./engine";
import { runDraftGuardrails } from "./guardrails";
import { SLOP_FILTER_SYSTEM_PROMPT } from "./prompt";
import { DraftSection, Grant, InterrogationQuestion, MasterDataAsset, Project, ProjectGrant } from "./types";

type PairingContext = {
    project: Project;
    grant: Grant;
    pairing: ProjectGrant;
    masterDataAssets: MasterDataAsset[];
    questions: InterrogationQuestion[];
};

type AnthropicMessageResponse = {
    content?: Array<{ type: string; text?: string }>;
};

export async function maybeGenerateClaudeDraftSections(
    context: PairingContext,
    fallbackDrafts: DraftSection[],
): Promise<DraftSection[] | null> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return null;

    const prompt = [
        "Draft two plain UK grant application sections as JSON.",
        "Return only valid JSON with this shape:",
        `[{"sectionKey":"project_summary","title":"Project summary","generatedText":"..."},{"sectionKey":"feasibility_access","title":"Feasibility and access","generatedText":"..."}]`,
        "",
        "Project:",
        JSON.stringify(context.project, null, 2),
        "",
        "Grant:",
        JSON.stringify(context.grant, null, 2),
        "",
        "Master data:",
        JSON.stringify(context.masterDataAssets, null, 2),
        "",
        "Interrogation answers:",
        JSON.stringify(context.questions, null, 2),
    ].join("\n");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
            model: process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022",
            max_tokens: 1800,
            system: SLOP_FILTER_SYSTEM_PROMPT,
            messages: [{ role: "user", content: prompt }],
        }),
    });

    if (!response.ok) {
        throw new Error(`Claude draft request failed with status ${response.status}.`);
    }

    const data = (await response.json()) as AnthropicMessageResponse;
    const text = data.content?.find((item) => item.type === "text")?.text;
    if (!text) return null;

    const parsed = parseDraftJson(text);
    if (!parsed) return null;

    const sourceCorpus = buildSourceCorpus(context);

    return fallbackDrafts.map((fallback) => {
        const replacement = parsed.find((item) => item.sectionKey === fallback.sectionKey);
        if (!replacement) return fallback;

        const guardrailFlags = runDraftGuardrails(replacement.generatedText, sourceCorpus);
        return {
            ...fallback,
            title: replacement.title || fallback.title,
            generatedText: replacement.generatedText,
            guardrailFlags,
            status: guardrailFlags.length > 0 ? "flagged" : "generated",
            sourceInputs: {
                ...fallback.sourceInputs,
                llmProvider: "anthropic",
                model: process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022",
            },
        };
    });
}

function parseDraftJson(text: string): Array<{ sectionKey: string; title: string; generatedText: string }> | null {
    try {
        const trimmed = text.trim();
        const jsonText = trimmed.startsWith("[") ? trimmed : trimmed.slice(trimmed.indexOf("["), trimmed.lastIndexOf("]") + 1);
        const value = JSON.parse(jsonText) as unknown;
        if (!Array.isArray(value)) return null;

        return value
            .filter(isDraftLike)
            .map((item) => ({
                sectionKey: item.sectionKey,
                title: item.title,
                generatedText: item.generatedText,
            }));
    } catch {
        return null;
    }
}

function isDraftLike(value: unknown): value is { sectionKey: string; title: string; generatedText: string } {
    if (typeof value !== "object" || value === null) return false;
    const record = value as Record<string, unknown>;
    return (
        typeof record.sectionKey === "string" &&
        typeof record.title === "string" &&
        typeof record.generatedText === "string"
    );
}
