"use client";

import { useState, useMemo } from "react";
import { Article } from "@prisma/client";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface NewsArchiveClientProps {
    initialArticles: Article[];
}

export default function NewsArchiveClient({ initialArticles }: NewsArchiveClientProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
    const [selectedDateFilter, setSelectedDateFilter] = useState<string>("ALL_TIME");
    const [searchQuery, setSearchQuery] = useState("");

    const categories = ["ALL", "AI", "WORLD_NEWS", "LIFESTYLE"];
    const dateFilters = [
        { label: "All Time", value: "ALL_TIME" },
        { label: "Today", value: "TODAY" },
        { label: "This Week", value: "THIS_WEEK" },
        { label: "This Month", value: "THIS_MONTH" },
    ];

    const filteredArticles = useMemo(() => {
        let filtered = initialArticles;

        // Apply Category Filter
        if (selectedCategory !== "ALL") {
            filtered = filtered.filter(a => a.section === selectedCategory);
        }

        // Apply Search Filter
        if (searchQuery.trim() !== "") {
            const lowerQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(a => 
                a.title.toLowerCase().includes(lowerQuery) || 
                (a.content && a.content.toLowerCase().includes(lowerQuery))
            );
        }

        // Apply Date Filter
        const now = new Date();
        if (selectedDateFilter === "TODAY") {
            filtered = filtered.filter(a => {
                const date = new Date(a.createdAt);
                return date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
            });
        } else if (selectedDateFilter === "THIS_WEEK") {
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filtered = filtered.filter(a => new Date(a.createdAt) >= oneWeekAgo);
        } else if (selectedDateFilter === "THIS_MONTH") {
            filtered = filtered.filter(a => {
                const date = new Date(a.createdAt);
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
            });
        }

        return filtered;
    }, [initialArticles, selectedCategory, selectedDateFilter, searchQuery]);

    // Handle Image Error by replacing with default thumbnail
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="mb-12 text-center">
                <Badge variant="outline" className="mb-4 uppercase tracking-[0.2em] text-stone-500 border-stone-300">
                    Zyphra Archive
                </Badge>
                <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-4">
                    The Complete Archives.
                </h1>
                <p className="text-stone-500 italic font-serif">Explore all verified reports, lifestyle features, and analysis.</p>
            </div>

            {/* Filtering Master Controls */}
            <div className="bg-stone-50 border border-stone-200 p-6 md:p-8 mb-12 flex flex-col md:flex-row gap-6 items-center justify-between shadow-sm">
                
                {/* Search Bar */}
                <div className="w-full md:w-1/3">
                    <input 
                        type="text" 
                        placeholder="Search archives..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-stone-200 h-12 px-4 rounded-none font-serif italic focus:outline-none focus:ring-1 focus:ring-stone-400"
                    />
                </div>

                {/* Category Toggles */}
                <div className="flex flex-wrap gap-2 justify-center">
                    {categories.map(cat => (
                        <Button 
                            key={cat}
                            variant={selectedCategory === cat ? "default" : "outline"}
                            onClick={() => setSelectedCategory(cat)}
                            className={`rounded-none h-10 px-6 uppercase tracking-widest text-[10px] font-bold ${selectedCategory === cat ? 'bg-stone-900 text-white' : 'border-stone-200 text-stone-600'}`}
                        >
                            {cat.replace("_", " ")}
                        </Button>
                    ))}
                </div>

                {/* Date Dropdown */}
                <div className="w-full md:w-auto">
                    <select 
                        value={selectedDateFilter}
                        onChange={(e) => setSelectedDateFilter(e.target.value)}
                        className="w-full md:w-48 bg-white border border-stone-200 h-10 px-4 rounded-none uppercase tracking-widest text-[10px] font-bold text-stone-600 focus:outline-none"
                    >
                        {dateFilters.map(filter => (
                            <option key={filter.value} value={filter.value}>{filter.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Results Grid */}
            {filteredArticles.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredArticles.map((article: Article) => (
                        <div key={article.id} className="border border-stone-200 p-6 flex flex-col group hover:shadow-2xl transition-shadow bg-white">
                            <Link href={`/article/${article.slug}`} className="relative mb-6 overflow-hidden aspect-video block bg-stone-100">
                                {article.thumbnail ? (
                                    <img
                                        src={article.thumbnail}
                                        onError={handleImageError}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        alt={article.title}
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-stone-50 border border-stone-200">
                                        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-300">Zyphra Matrix</div>
                                        <div className="w-8 h-[1px] bg-stone-200 mt-2" />
                                    </div>
                                )}
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
                                    {article.createdAt ? new Date(article.createdAt).toLocaleDateString() : "Historical Record"}
                                </span>
                                <Badge className="bg-stone-100 text-stone-500 hover:bg-stone-200 text-[9px] uppercase tracking-widest">{article.section.replace("_", " ")}</Badge>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 border border-dashed border-stone-200">
                    <p className="text-stone-400 font-serif italic mb-4">No archives found matching the selected filters.</p>
                    <Button 
                        onClick={() => { setSelectedCategory("ALL"); setSelectedDateFilter("ALL_TIME"); setSearchQuery("")}}
                        variant="outline" 
                        className="rounded-none uppercase tracking-widest text-[10px] font-bold"
                    >
                        Clear Filters
                    </Button>
                </div>
            )}
        </div>
    );
}
