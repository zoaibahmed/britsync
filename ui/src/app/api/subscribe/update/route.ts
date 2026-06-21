import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { sections } = await request.json(); // Array of strings e.g. ["AI", "LIFESTYLE"] or ["ALL"]

        if (!sections || !Array.isArray(sections)) {
            return NextResponse.json({ error: "Invalid selections" }, { status: 400 });
        }

        await prisma.$transaction(async (tx) => {
            // 1. Deactivate ALL existing subscriptions for this user
            //    (Easiest way to handle "unchecking" boxes)
            await tx.subscription.deleteMany({
                where: { userId: session.id }
            });

            // 2. Create new subscriptions
            for (const section of sections) {
                await tx.subscription.create({
                    data: {
                        userId: session.id,
                        section,
                        isActive: true
                    }
                });
            }
        });

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}
