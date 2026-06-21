export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { AdminReportActions } from "@/components/admin-report-actions";
import { BarChart, Users, Mail } from "lucide-react";

export default async function AdminReports() {
    const totalArticles = await prisma.article.count();
    const premiumArticles = await prisma.article.count({ where: { isPremium: true } });
    const totalUsers = await prisma.user.count();
    const newUsersToday = await prisma.user.count({
        where: {
            createdAt: {
                gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
        }
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold">Daily Reports</h1>
                    <p className="text-stone-500 text-sm">Automated analytics and manual triggers.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Content Distribution</CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalArticles} Total</div>
                        <p className="text-xs text-stone-500">{premiumArticles} Premium Stories</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Audience Growth</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsers} Users</div>
                        <p className="text-xs text-stone-500">+{newUsersToday} today</p>
                    </CardContent>
                </Card>

                <Card className="bg-stone-50 border-stone-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-stone-900">Manual Actions</CardTitle>
                        <Mail className="h-4 w-4 text-stone-900" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-stone-500 mb-4">
                            Trigger an immediate daily report email to the admin address.
                        </p>
                        <AdminReportActions />
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Report Preview</CardTitle>
                    <CardDescription>What's included in your daily email.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-stone-100 p-6 rounded-md font-mono text-sm text-stone-600">
                        <p><strong>Subject:</strong> Daily Report: Zyphra - {new Date().toLocaleDateString()}</p>
                        <br />
                        <p>Here are your stats for today:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Total Subscribers: {totalUsers}</li>
                            <li>Total Articles: {totalArticles}</li>
                            <li>New Articles Today: [Dynamic Count]</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
