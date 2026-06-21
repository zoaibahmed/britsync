import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const sections = ["AI", "LIFESTYLE", "WORLD_NEWS"];
        const notifications = [];

        for (const section of sections) {
            const latestArticle = await prisma.article.findFirst({
                where: { section },
                orderBy: { updatedAt: "desc" }
            });

            if (!latestArticle || latestArticle.updatedAt < oneDayAgo) {
                notifications.push({
                    type: "STALE_SECTION",
                    section,
                    lastUpdated: latestArticle?.updatedAt || null,
                    message: `Action Required: The ${section.replace("_", " ")} section hasn't been updated in over 24 hours.`
                });
            }
        }

        // Check breaking news bar too
        try {
            // @ts-ignore
            const settings = await prisma.siteSetting.findUnique({ where: { id: "global" } });
            if (!settings || settings.updatedAt < oneDayAgo) {
                notifications.push({
                    type: "STALE_BREAKING_NEWS",
                    lastUpdated: settings?.updatedAt || null,
                    message: "Reminder: Update the Breaking News bar with fresh announcements."
                });
            }
        } catch (e) { }

        return NextResponse.json(notifications);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
    }
}
