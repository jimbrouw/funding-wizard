import { Question, Answers, OutputSlot, OutputStatus, Step, MissingItem } from "./schema";

/**
 * Validates a set of questions against provided answers.
 * Returns a record of question IDs to error messages (or null if valid).
 */
export function validateStepQuestions(questions: Question[], answers: Answers): Record<string, string | null> {
    const errors: Record<string, string | null> = {};

    questions.forEach((q) => {
        const value = answers[q.id];
        if (q.required && (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0))) {
            errors[q.id] = "Required.";
        } else {
            errors[q.id] = null;
        }
    });

    return errors;
}

/**
 * Checks if a step can be proceeded from.
 */
export function canProceed(questions: Question[], answers: Answers): { ok: boolean; missing: string[] } {
    const errors = validateStepQuestions(questions, answers);
    const missing = Object.entries(errors)
        .filter(([_, error]) => error !== null)
        .map(([id]) => id);

    return {
        ok: missing.length === 0,
        missing,
    };
}

/**
 * Computes the output text and status for a given slot.
 * Basic implementation: joins template lines, replacing {{questionId}} with answer values.
 */
export function computeOutput(slot: OutputSlot, answers: Answers): {
    status: OutputStatus;
    text: string;
    missingInputs: string[];
    currentLength?: number;
} {
    const missingInputs: string[] = [];
    const requiredInputs = slot.requiredInputs || [];

    requiredInputs.forEach((id) => {
        const value = answers[id];
        if (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
            missingInputs.push(id);
        }
    });

    if (missingInputs.length > 0) {
        return {
            status: "incomplete",
            text: "",
            missingInputs,
            currentLength: 0,
        };
    }

    // Simple template replacement
    const text = (slot.template || [])
        .map((line) => {
            return line.replace(/\{\{(.*?)\}\}/g, (_, questionId) => {
                const value = answers[questionId.trim()];
                if (value === undefined || value === null) return "";
                if (Array.isArray(value)) return value.join(", ");
                return String(value);
            });
        })
        .join("\n\n");

    const currentLength = text.length;
    const isOverLimit = slot.maxChars ? currentLength > slot.maxChars : false;

    return {
        status: isOverLimit ? "over_limit" : "complete",
        text,
        missingInputs: [],
        currentLength,
    };
}

/**
 * Aggregates all missing required questions and incomplete outputs.
 */
export function computeMissingInfo(
    allSteps: Step[],
    questionsByStep: Record<string, Question[]>,
    slots: OutputSlot[],
    answers: Answers
): MissingItem[] {
    const items: MissingItem[] = [];

    // Check questions
    allSteps.forEach((step) => {
        const questions = questionsByStep[step.id] || [];
        questions.forEach((q) => {
            if (q.required) {
                const value = answers[q.id];
                if (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
                    items.push({
                        kind: "question",
                        stepId: step.id,
                        questionId: q.id,
                        label: q.label,
                    });
                }
            }
        });
    });

    // Check outputs
    slots.forEach((slot) => {
        const computed = computeOutput(slot, answers);
        if (computed.status === "incomplete") {
            items.push({
                kind: "output",
                slotId: slot.id,
                title: slot.title,
                missingInputs: computed.missingInputs,
            });
        }
    });

    return items;
}

/**
 * Downloads data as a JSON file.
 */
export function downloadJson(filename: string, data: any): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Copies text to clipboard.
 */
export async function copyToClipboard(text: string): Promise<void> {
    await navigator.clipboard.writeText(text);
}
