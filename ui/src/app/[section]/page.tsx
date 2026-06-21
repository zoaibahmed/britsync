import SectionContent from "@/components/section-content";
import { redirect, notFound } from "next/navigation";

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
    const { section } = await params;

    const sectionMap: Record<string, string> = {
        "news": "WORLD_NEWS",
        "ai": "AI",
        "lifestyle": "LIFESTYLE",
        "tutorials": "AI"
    };

    const titleMap: Record<string, string> = {
        "WORLD_NEWS": "World News",
        "AI": "AI & Technology",
        "LIFESTYLE": "Premium Lifestyle"
    };

    const dataSection = sectionMap[section.toLowerCase()];
    if (!dataSection) return notFound();

    return <SectionContent dataSection={dataSection} displayTitle={titleMap[dataSection]} />;
}
