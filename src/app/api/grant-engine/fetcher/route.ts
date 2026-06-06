import { NextResponse } from "next/server";
import { validateFetcherPayload } from "@/lib/grant-engine/engine";
import { getGrantEngineRepository } from "@/lib/grant-engine/repository";
import { NormalizedGrantPayload } from "@/lib/grant-engine/types";

export async function POST(request: Request) {
    const configuredSecret = process.env.GRANT_ENGINE_WEBHOOK_SECRET;
    if (configuredSecret) {
        const header = request.headers.get("authorization") || "";
        if (header !== `Bearer ${configuredSecret}`) {
            return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
        }
    }

    try {
        const payload = (await request.json()) as NormalizedGrantPayload;
        const errors = validateFetcherPayload(payload);
        if (errors.length > 0) return NextResponse.json({ errors }, { status: 400 });

        const repository = getGrantEngineRepository();
        const { state, grant } = await repository.addGrantFromFetcher(payload);
        return NextResponse.json({ mode: repository.mode, state, grant });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Fetcher webhook failed.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
