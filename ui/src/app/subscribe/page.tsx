import { Navbar } from "@/components/navbar";
import { SubscribeClient } from "@/components/subscribe-client";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function SubscribePage() {
    const session = await getSession();
    let userSubscriptions: string[] = [];

    if (session) {
        const subs = await prisma.subscription.findMany({
            where: { userId: session.id, isActive: true },
            select: { section: true }
        });
        userSubscriptions = subs.map(s => s.section);
    }

    return (
        <div className="min-h-screen flex flex-col bg-stone-50">
            <Navbar />
            <SubscribeClient session={session} initialSubscriptions={userSubscriptions} />
        </div>
    );
}
