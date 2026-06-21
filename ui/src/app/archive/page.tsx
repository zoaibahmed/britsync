import { prisma } from "@/lib/db";
import { Article } from "@prisma/client";
import NewsArchiveClient from "@/components/news-archive-client";
import { Navbar } from "@/components/navbar";

export const dynamic = "force-dynamic";

export default async function NewsArchivePage() {
    let allArticles: Article[] = [];
    try {
        allArticles = await prisma.article.findMany({
            orderBy: { createdAt: "desc" },
            // Limit to recent 1000 to prevent payload blowing up, typically sufficient for an archive page without server pagination
            take: 1000 
        });
    } catch (err) {
        console.error("Archive: DB access failed.", err);
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />
            <main className="flex-1">
                <NewsArchiveClient initialArticles={allArticles} />
            </main>
        </div>
    );
}
