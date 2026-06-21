import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
    try {
        // @ts-ignore
        const settings = await prisma.siteSetting.upsert({
            where: { id: "global" },
            update: {},
            create: { id: "global" }
        });
        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { breakingNews } = await req.json();
        // @ts-ignore
        const settings = await prisma.siteSetting.update({
            where: { id: "global" },
            data: { breakingNews }
        });
        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
    }
}
