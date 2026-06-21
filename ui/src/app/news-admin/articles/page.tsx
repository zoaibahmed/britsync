export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/db";
import { Article } from "@prisma/client";
import { Plus, Edit, Trash, Eye, Lock, Unlock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArticleActions } from "@/components/admin-article-actions";

export default async function AdminArticles() {
    const articles = await prisma.article.findMany({
        orderBy: { createdAt: 'desc' }
    });
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold mb-2">Articles</h1>
                    <p className="text-stone-500 text-sm">Manage your publications and content visibility.</p>
                </div>
                <Link href="/news-admin/articles/new">
                    <Button className="bg-stone-900 text-white rounded-none h-12 px-6 uppercase tracking-widest text-xs font-bold gap-2">
                        <Plus className="w-4 h-4" /> New Article
                    </Button>
                </Link>
            </div>

            <div className="bg-white border border-stone-200 shadow-sm">
                <Table>
                    <TableHeader className="bg-stone-50">
                        <TableRow>
                            <TableHead className="uppercase tracking-widest text-[10px] font-bold py-4">Article Title</TableHead>
                            <TableHead className="uppercase tracking-widest text-[10px] font-bold">Section</TableHead>
                            <TableHead className="uppercase tracking-widest text-[10px] font-bold">Visibility</TableHead>
                            <TableHead className="uppercase tracking-widest text-[10px] font-bold">Date</TableHead>
                            <TableHead className="uppercase tracking-widest text-[10px] font-bold text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {articles.map((article: Article) => (
                            <TableRow key={article.id} className="hover:bg-stone-50/50">
                                <TableCell className="py-4">
                                    <div className="flex items-center gap-4">
                                        <img src={article.thumbnail || ""} className="w-12 h-12 object-cover" />
                                        <span className="font-serif font-bold text-lg">{article.title}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="uppercase tracking-widest text-[10px]">
                                        {article.section}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {article.isPremium ? (
                                        <div className="flex items-center gap-2 text-stone-900 text-[10px] font-bold uppercase tracking-widest">
                                            <Lock className="w-3 h-3 text-red-600" /> Premium
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-stone-400 text-[10px] font-bold uppercase tracking-widest">
                                            <Unlock className="w-3 h-3" /> Public
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="text-stone-400 font-mono text-xs">
                                    {new Date(article.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="w-4 h-4" /></Button>
                                        <ArticleActions id={article.id} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
