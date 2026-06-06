import { NextResponse } from "next/server";
import {
    buildDraftSections,
    buildInterrogationQuestions,
    getPairingContext,
    validateFetcherPayload,
} from "@/lib/grant-engine/engine";
import { getGrantEngineRepository } from "@/lib/grant-engine/repository";
import { maybeGenerateClaudeDraftSections } from "@/lib/grant-engine/llm";
import { MasterDataAssetType, NormalizedGrantPayload } from "@/lib/grant-engine/types";

export async function GET() {
    const repository = getGrantEngineRepository();

    return NextResponse.json({
        mode: repository.mode,
        state: await repository.getState(),
    });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const action = body.action as string;
        const repository = getGrantEngineRepository();

        if (action === "reset") {
            return NextResponse.json({ state: await repository.reset() });
        }

        if (action === "create_project") {
            const { project, pairing, state } = await repository.createProject({
                name: String(body.name || "").trim(),
                rawIdea: String(body.rawIdea || "").trim(),
                concreteOutputs: String(body.concreteOutputs || "").trim(),
                budgetTotal: body.budgetTotal === "" || body.budgetTotal === undefined ? null : Number(body.budgetTotal),
            });
            return NextResponse.json({ state, project, pairing });
        }

        if (action === "add_master_data") {
            const { state, asset } = await repository.addMasterDataAsset({
                assetType: body.assetType as MasterDataAssetType,
                title: String(body.title || "").trim(),
                content: String(body.content || "").trim(),
                notes: String(body.notes || "").trim(),
            });
            return NextResponse.json({ state, asset });
        }

        if (action === "fetcher") {
            const payload = body.payload as NormalizedGrantPayload;
            const errors = validateFetcherPayload(payload);
            if (errors.length > 0) return NextResponse.json({ errors }, { status: 400 });

            const { state, grant } = await repository.addGrantFromFetcher(payload);
            return NextResponse.json({ state, grant });
        }

        if (action === "interrogate") {
            const projectGrantId = String(body.projectGrantId || "");
            const context = getPairingContext(await repository.getState(), projectGrantId);
            const questions = buildInterrogationQuestions(context);
            const state = await repository.saveInterrogationQuestions(projectGrantId, questions);
            return NextResponse.json({ state, questions });
        }

        if (action === "answer_question") {
            const state = await repository.answerQuestion({
                questionId: String(body.questionId || ""),
                answer: String(body.answer || ""),
                status: body.status,
            });
            return NextResponse.json({ state });
        }

        if (action === "draft") {
            const projectGrantId = String(body.projectGrantId || "");
            const state = await repository.getState();
            const context = getPairingContext(state, projectGrantId);
            const fallbackDrafts = buildDraftSections(context);
            const drafts = await maybeGenerateClaudeDraftSections(context, fallbackDrafts) || fallbackDrafts;
            const nextState = await repository.saveDraftSections(projectGrantId, drafts);

            return NextResponse.json({ state: nextState, drafts });
        }

        return NextResponse.json({ error: "Unknown action." }, { status: 400 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Grant Engine request failed.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
