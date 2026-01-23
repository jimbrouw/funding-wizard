import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id");

    const contentDir = path.join(process.cwd(), "content");

    try {
        if (type === "routes") {
            const filePath = path.join(contentDir, "routes.json");
            const data = fs.readFileSync(filePath, "utf8");
            return NextResponse.json(JSON.parse(data));
        }

        if (type === "wizard" && id) {
            const filePath = path.join(contentDir, `${id}.json`);
            if (fs.existsSync(filePath)) {
                const data = fs.readFileSync(filePath, "utf8");
                return NextResponse.json(JSON.parse(data));
            } else {
                return NextResponse.json({ error: "Route not found" }, { status: 404 });
            }
        }

        return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to load content" }, { status: 500 });
    }
}
