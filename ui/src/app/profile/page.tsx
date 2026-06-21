import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    const subscriptions = await prisma.subscription.findMany({
        where: { userId: session.id, isActive: true }
    });

    const isPremium = subscriptions.length > 0;

    return (
        <div className="min-h-screen flex flex-col bg-stone-50">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-12 flex items-center justify-center">
                <Card className="w-full max-w-lg">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-24 h-24 rounded-full bg-stone-900 flex items-center justify-center mb-4 text-4xl font-serif italic text-white uppercase">
                            {session.name?.[0] || session.email?.[0] || "U"}
                        </div>
                        <CardTitle className="text-2xl font-serif">{session.name || "Subscriber"}</CardTitle>
                        <CardDescription>{session.email}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-stone-500">Subscription Status</h3>
                            <div className="p-4 bg-stone-100 rounded-lg flex items-center justify-between">
                                <span className="font-bold uppercase tracking-widest text-xs">
                                    {isPremium ? (
                                        <span className="text-green-600">Premium Member</span>
                                    ) : (
                                        <span className="text-stone-500">Free Tier</span>
                                    )}
                                </span>
                                {!isPremium && (
                                    <Link href="/subscribe">
                                        <Button variant="outline" size="sm" className="rounded-none font-bold uppercase tracking-widest text-[10px] border-stone-300">Upgrade</Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-stone-500">Active Access</h3>
                            <div className="flex flex-wrap gap-2">
                                {subscriptions.map(sub => (
                                    <div key={sub.id} className="px-3 py-1 bg-white border border-stone-200 text-[10px] font-bold uppercase tracking-widest">
                                        {sub.section}
                                    </div>
                                ))}
                                {subscriptions.length === 0 && <p className="text-stone-400 text-sm italic">Limited access to public stories.</p>}
                            </div>
                        </div>

                        <form action="/api/auth/logout" method="POST">
                            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest rounded-none h-14">
                                Sign Out
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
