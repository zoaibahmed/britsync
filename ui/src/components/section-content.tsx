
import { prisma } from "@/lib/db";
import { Article } from "@prisma/client";
import { Navbar } from "@/components/navbar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import SafeImage from "@/components/safe-image";

interface SectionContentProps {
    dataSection: string;
    displayTitle: string;
}

export default async function SectionContent({ dataSection, displayTitle }: SectionContentProps) {
    let articles: Article[] = [];
    try {
        articles = await prisma.article.findMany({
            where: { section: dataSection },
            orderBy: { createdAt: "desc" },
            take: 30
        });
    } catch (err) {
        console.error(`SectionContent (${dataSection}): DB access failed.`, err);
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="container mx-auto px-4 py-12">
                <div className="mb-12 text-center">
                    <Badge variant="outline" className="mb-4 uppercase tracking-[0.2em] text-stone-500 border-stone-300">
                        Section
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">
                        {displayTitle}
                    </h1>
                </div>

                {articles.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((article: Article) => (
                            <div key={article.id} className="border border-stone-200 p-6 flex flex-col group hover:shadow-2xl transition-shadow bg-white">
                                <Link href={`/article/${article.slug}`} className="relative mb-6 overflow-hidden aspect-video block">
                                    <SafeImage
                                        src={article.thumbnail || ""}
                                        alt={article.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {article.isPremium && (
                                        <div className="absolute top-4 right-4 bg-stone-900 text-white text-[10px] uppercase font-bold px-3 py-1 tracking-widest">
                                            Premium
                                        </div>
                                    )}
                                </Link>
                                <Link href={`/article/${article.slug}`}>
                                    <h3 className="text-2xl font-serif font-bold mb-4 flex-1 leading-tight hover:text-stone-600 transition-colors">
                                        {article.title}
                                    </h3>
                                </Link>
                                <div className="flex items-center justify-between pt-6 border-t border-stone-100">
                                    <span className="text-xs font-mono text-stone-400 uppercase">
                                        {article.createdAt ? new Date(article.createdAt).toLocaleDateString() : "Live Report"}
                                    </span>
                                    <Link href={`/article/${article.slug}`} className="font-serif italic text-stone-900 text-sm group-hover:translate-x-1 transition-transform">
                                        Read Story &rarr;
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border border-dashed border-stone-200">
                        <p className="text-stone-400 font-serif italic mb-4">No investigation reports available in {displayTitle} at the moment.</p>
                        <Link href="/">
                            <button className="px-6 py-2 bg-stone-900 text-white rounded-full uppercase tracking-widest text-[10px] font-bold">Return Home</button>
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}
