
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const article = await prisma.article.findUnique({
            where: { id }
        });
        if (!article) return NextResponse.json({ error: "Article not found" }, { status: 404 });
        return NextResponse.json(article);
    } catch {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        const body = await request.json();
        const { title, content, section, isPremium, imageUrl, videoUrl, editorsNote } = body;

        const updated = await prisma.article.update({
            where: { id },
            data: {
                title,
                content,
                section,
                isPremium,
                thumbnail: imageUrl, // Mapping
                videoUrl,
                editorsNote
            }
        });
        return NextResponse.json({ success: true, article: updated });
    } catch (e: any) {
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        await prisma.article.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
