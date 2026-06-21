
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
    const all = await prisma.article.findMany()

    const sections: Record<string, number> = {}
    all.forEach((a: any) => {
        const s = a.section
        sections[s] = (sections[s] || 0) + 1
    })

    const aiFiltered = all.filter((a: any) => a.section.toUpperCase() === "AI")

    return NextResponse.json({
        total: all.length,
        sections,
        aiCount: aiFiltered.length,
        articles: all.slice(0, 5).map((a: any) => ({ title: a.title, section: a.section }))
    })
}
