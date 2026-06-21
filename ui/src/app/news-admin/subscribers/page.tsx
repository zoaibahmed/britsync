export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Mail, Download } from "lucide-react";
import { prisma } from "@/lib/db";

import { Prisma } from "@prisma/client";

type UserWithSubscriptions = Prisma.UserGetPayload<{
    include: { subscriptions: true }
}>;

export default async function AdminSubscribers() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        include: { subscriptions: true }
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold mb-2">Subscribers</h1>
                    <p className="text-stone-500 text-sm">Monitor and manage your audience.</p>
                </div>
                <Button variant="outline" className="border-stone-300 rounded-none h-12 px-6 uppercase tracking-widest text-xs font-bold gap-2">
                    <Download className="w-4 h-4" /> Export CSV
                </Button>
            </div>

            <div className="bg-white border border-stone-200 shadow-sm">
                <Table>
                    <TableHeader className="bg-stone-50">
                        <TableRow>
                            <TableHead className="uppercase tracking-widest text-[10px] font-bold py-4">User Details</TableHead>
                            <TableHead className="uppercase tracking-widest text-[10px] font-bold">Active Subscriptions</TableHead>
                            <TableHead className="uppercase tracking-widest text-[10px] font-bold">Joined Date</TableHead>
                            <TableHead className="uppercase tracking-widest text-[10px] font-bold text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user: UserWithSubscriptions) => (
                            <TableRow key={user.id} className="hover:bg-stone-50/50">
                                <TableCell className="py-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-stone-900">{user.name || "Anonymous"}</span>
                                        <span className="text-sm text-stone-500">{user.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {user.subscriptions.length > 0 ? (
                                            user.subscriptions.map((sub: { id: string, section: string }) => (
                                                <Badge key={sub.id} variant="secondary" className="bg-stone-100 text-stone-600 border-none text-[9px] uppercase tracking-wider">
                                                    {sub.section}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-stone-400 text-xs italic">Free Tier</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-stone-400 font-mono text-xs">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" className="font-bold uppercase tracking-widest text-[10px] gap-2 text-stone-900">
                                        <Mail className="w-3 h-3" /> Send Email
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

