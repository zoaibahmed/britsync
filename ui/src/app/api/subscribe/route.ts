import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { section } = await request.json(); // "ALL", "AI", etc.

        // Upsert subscription
        await prisma.subscription.upsert({
            where: {
                userId_section: {
                    userId: session.id,
                    section: section
                }
            },
            update: { isActive: true },
            create: {
                userId: session.id,
                section: section,
                isActive: true
            }
        });

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
    }
}
