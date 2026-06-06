import { GuardrailFlag } from "./types";

const SLOP_TERMS = ["innovative", "transformative", "impactful", "community-led", "synergy"];
const VAGUE_CLAIMS = [
    "raise awareness",
    "create impact",
    "drive change",
    "empower",
    "inspire",
    "engage communities",
];

export function findSlopTerms(text: string): GuardrailFlag[] {
    const lower = text.toLowerCase();

    return SLOP_TERMS.filter((term) => lower.includes(term)).map((term) => ({
        kind: "slop_term",
        value: term,
        message:
            "This is vague. Exactly what specific action is being taken? Who is doing it? What is the tangible proof of this claim?",
    }));
}

export function findVagueClaims(text: string): GuardrailFlag[] {
    const lower = text.toLowerCase();

    return VAGUE_CLAIMS.filter((claim) => lower.includes(claim)).map((claim) => ({
        kind: "vague_claim",
        value: claim,
        message:
            "This claim needs evidence from the project, master data, or interrogation answers before it can be used.",
    }));
}

export function findUnsupportedClaims(text: string, sourceCorpus: string): GuardrailFlag[] {
    const normalizedCorpus = normalize(sourceCorpus);
    const candidates = new Set<string>();
    const moneyMatches = text.match(/£\s?\d[\d,]*(?:\.\d+)?/g) || [];
    const namedMatches = text.match(/\b[A-Z][A-Za-z0-9&'.-]+(?:\s+[A-Z][A-Za-z0-9&'.-]+)+\b/g) || [];

    moneyMatches.forEach((value) => candidates.add(value));
    namedMatches
        .filter((value) => !isExpectedSentencePhrase(value))
        .forEach((value) => candidates.add(value));

    return [...candidates]
        .filter((candidate) => !normalizedCorpus.includes(normalize(candidate)))
        .map((candidate) => ({
            kind: "unsupported_claim",
            value: candidate,
            message: "This entity or figure is not present in the project, master data, grant, or interrogation answers.",
        }));
}

export function runDraftGuardrails(text: string, sourceCorpus: string): GuardrailFlag[] {
    return [
        ...findSlopTerms(text),
        ...findVagueClaims(text),
        ...findUnsupportedClaims(text, sourceCorpus),
    ];
}

function normalize(value: string): string {
    return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function isExpectedSentencePhrase(value: string): boolean {
    return [
        "The project",
        "This project",
        "Project Grants",
        "Arts Council England",
        "National Lottery Project Grants",
    ].includes(value);
}
