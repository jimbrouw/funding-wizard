import test from "node:test";
import assert from "node:assert/strict";

import { buildDraftSections, buildInterrogationQuestions, canDraft, getPairingContext, validateFetcherPayload } from "../src/lib/grant-engine/engine.ts";
import { findSlopTerms, findUnsupportedClaims } from "../src/lib/grant-engine/guardrails.ts";
import { getGrantEngineRepository } from "../src/lib/grant-engine/repository.ts";
import { createSeedState, SEEDED_PROJECT_GRANT_ID } from "../src/lib/grant-engine/seed.ts";

test("interrogation generation is stable and capped", () => {
    const state = createSeedState();
    const context = getPairingContext(state, SEEDED_PROJECT_GRANT_ID);
    const questions = buildInterrogationQuestions(context);

    assert.equal(questions.length, 8);
    assert.equal(questions[0].question, "What is the concrete public output?");
});

test("drafting is blocked until required questions are resolved", () => {
    const state = createSeedState();
    const context = getPairingContext(state, SEEDED_PROJECT_GRANT_ID);
    const questions = buildInterrogationQuestions(context);

    assert.equal(canDraft(questions).ok, false);

    questions.forEach((question) => {
        question.status = "not_applicable";
        question.answer = "Not applicable to this project.";
    });

    assert.equal(canDraft(questions).ok, true);
});

test("draft sections are generated only after the gate clears", () => {
    const state = createSeedState();
    const context = getPairingContext(state, SEEDED_PROJECT_GRANT_ID);
    const questions = buildInterrogationQuestions(context);

    assert.throws(() => buildDraftSections({ ...context, questions }), /Drafting is blocked/);

    questions.forEach((question) => {
        question.status = "answered";
        question.answer = "The project team will provide this evidence in the application.";
    });

    const drafts = buildDraftSections({ ...context, questions });
    assert.equal(drafts.length, 2);
});

test("guardrails catch banned language and unsupported entities", () => {
    assert.equal(findSlopTerms("This is an innovative project.").length, 1);

    const flags = findUnsupportedClaims(
        "The project will happen at Nottingham Castle with £50,000.",
        "The project will happen in Nottingham with £18,500.",
    );

    assert.equal(flags.some((flag) => flag.value === "Nottingham Castle"), true);
    assert.equal(flags.some((flag) => flag.value === "£50,000"), true);
});

test("fetcher payload validation enforces the future n8n contract", () => {
    assert.deepEqual(validateFetcherPayload({} as never), [
        "source is required",
        "source_url is required",
        "title is required",
        "funder_name is required",
        "grant_url is required",
        "match_summary is required",
        "requirements_text is required",
        "assessment_criteria must be an array",
    ]);
});

test("repository defaults to seeded memory without Supabase credentials", async () => {
    const originalUrl = process.env.SUPABASE_URL;
    const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;

    try {
        const repository = getGrantEngineRepository();
        const state = await repository.reset();

        assert.equal(repository.mode, "seeded-memory");
        assert.equal(state.projectGrants[0].id, SEEDED_PROJECT_GRANT_ID);
    } finally {
        if (originalUrl) process.env.SUPABASE_URL = originalUrl;
        if (originalKey) process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey;
    }
});
