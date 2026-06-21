
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET() {
    try {
        // 1. Fetch Stats
        const subscriberCount = await prisma.user.count();
        const articleCount = await prisma.article.count();
        const newArticlesToday = await prisma.article.count({
            where: {
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0))
                }
            }
        });

        // 2. Configure Email Transporter
        const user = process.env.EMAIL_USER;
        const pass = process.env.EMAIL_PASS;

        console.log("Attempting to send email...");
        console.log("User:", user ? user : "MISSING");
        console.log("Password Length:", pass ? pass.length : 0); // Don't log the full password!

        if (!user || !pass) {
            console.error("Missing credentials in environment variables.");
            return NextResponse.json({ error: "Server missing email credentials. Did you restart?" }, { status: 500 });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail", // Or use host/port for other providers
            auth: {
                user: user,
                pass: pass,
            },
        });

        // 3. Fetch Recent Articles for Newsletter
        const recentArticles = await prisma.article.findMany({
            where: {
                createdAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0))
                }
            }
        });

        // 4. Fetch Users with Subscriptions
        const users = await prisma.user.findMany({
            include: { subscriptions: true }
        });

        // 5. Send Personal Newsletters
        for (const user of users) {
            // Skip if no subscriptions
            if (!user.subscriptions || user.subscriptions.length === 0) continue;

            const userSections = user.subscriptions.map(s => s.section);
            const isAllAccess = userSections.includes("ALL");

            // Filter articles based on interest
            const relevantArticles = recentArticles.filter(article =>
                isAllAccess || userSections.includes(article.section)
            );

            if (relevantArticles.length > 0) {
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: user.email,
                    subject: `Your Daily Zyphra: ${relevantArticles.length} New Stories`,
                    html: `
                        <div style="font-family: serif; color: #1c1917;">
                            <h1 style="border-bottom: 2px solid #1c1917; padding-bottom: 10px;">Zyphra</h1>
                            <p>Good morning, ${user.name || "Reader"}. Here are today's top stories selected for you:</p>
                            
                            ${relevantArticles.map(article => `
                                <div style="margin-bottom: 20px; border-bottom: 1px solid #e7e5e4; padding-bottom: 20px;">
                                    <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #78716c;">${article.section}</span>
                                    <h2 style="margin: 5px 0; font-size: 24px;">${article.title}</h2>
                                    <p style="color: #57534e;">Create your own path.</p>
                                    <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/article/${article.slug}" style="display: inline-block; background: #1c1917; color: white; text-decoration: none; padding: 10px 20px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-top: 10px;">Read Story</a>
                                </div>
                            `).join('')}
                            
                            <p style="font-size: 12px; color: #a8a29e; margin-top: 40px;">
                                You are receiving this because you are subscribed to Zyphra.
                            </p>
                        </div>
                    `
                });
            }
        }

        // 6. Send Admin Report (Keep existing)
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // Send to admin
            subject: `Daily Report: Zyphra - ${new Date().toLocaleDateString()}`,
            html: `
                <h1>Zyphra - Daily Summary</h1>
                <p>Here are your stats for today:</p>
                <ul>
                    <li><strong>Total Subscribers:</strong> ${subscriberCount}</li>
                    <li><strong>Total Articles:</strong> ${articleCount}</li>
                    <li><strong>New Articles Today:</strong> ${newArticlesToday}</li>
                </ul>
                <p>Keep up the great work!</p>
            `,
        });

        return NextResponse.json({ success: true, message: "Reports sent" });
    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
