
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const session = await getSession();
        // Ideally verify admin here, but for now we trust the auth middleware/session
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { title, content, section, isPremium, imageUrl, videoUrl, editorsNote } = body;

        if (!title || !content || !section) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const slug = title
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "") + "-" + Date.now(); // Simple slug gen

        const article = await prisma.article.create({
            data: {
                title,
                slug,
                content, // HTML from Tiptap
                section,
                isPremium,
                thumbnail: imageUrl, // Map to correct field
                videoUrl,
                editorsNote,
            }
        });

        return NextResponse.json({ success: true, article });

    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
    }
}
