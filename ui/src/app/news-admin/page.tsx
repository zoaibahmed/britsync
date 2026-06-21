export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Users, FileText, TrendingUp, Settings } from "lucide-react";
import { prisma } from "@/lib/db";
import { Article } from "@prisma/client";
import { AdminReportActions } from "@/components/admin-report-actions";
import { NewsSyncButton } from "@/components/news-sync-button";

export default async function AdminDashboard() {
    const subscriberCount = await prisma.user.count();
    const articleCount = await prisma.article.count();
    const recentArticles = await prisma.article.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold">Dashboard</h1>
                    <p className="text-stone-500">Welcome back, Admin</p>
                </div>
                <NewsSyncButton />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{subscriberCount}</div>
                        <p className="text-xs text-muted-foreground">Lifetime subscribers</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Articles</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{articleCount}</div>
                        <p className="text-xs text-muted-foreground">Published stories</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Daily Views</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12,345</div>
                        <p className="text-xs text-muted-foreground">+10% from yesterday</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2.4%</div>
                        <p className="text-xs text-muted-foreground">+0.5% increase</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Daily Reports</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        {/* Placeholder for Chart or more detailed report */}
                        <div className="h-[200px] flex items-center justify-center text-stone-400 border-2 border-dashed border-stone-100 rounded-md bg-stone-50">
                            <span>Analytics Chart Placeholder</span>
                        </div>
                        <AdminReportActions />
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentArticles.map((article: Article) => (
                                <div key={article.id} className="flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    <p className="text-sm text-stone-600 line-clamp-1">Published: {article.title}</p>
                                    <span className="text-xs text-stone-400 ml-auto whitespace-nowrap">
                                        {article.createdAt ? new Date(article.createdAt).toLocaleDateString() : 'Just now'}
                                    </span>
                                </div>
                            ))}
                            {recentArticles.length === 0 && <p className="text-sm text-stone-400">No activity yet.</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
