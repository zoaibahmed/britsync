import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Mock data fetching for demonstration
const articles = [
    { title: "AI Breakthrough 2026", section: "AI", premium: true },
    { title: "Mediterranean Travel Guide", section: "Lifestyle", premium: false },
    { title: "Global Market Update", section: "World News", premium: false },
];

const subscribers = [
    { name: "Alice", email: "alice@example.com", interests: ["AI", "World News"] },
    { name: "Bob", email: "bob@lifestyle.com", interests: ["Lifestyle"] },
];

export async function POST(request: Request) {
    try {
        const { secret } = await request.json();

        // Simple security check (in production use env variable)
        if (secret !== "zyphra-cron-secret") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        console.log("Starting Daily Report Dispatch...");

        // Integration for Nodemailer (simulated)
        // const transporter = nodemailer.createTransport({ ... });

        const results = subscribers.map(sub => {
            const relevantArticles = articles.filter(art =>
                sub.interests.some(interest => art.section.toLowerCase().includes(interest.toLowerCase()))
            );

            if (relevantArticles.length === 0) return null;

            // Simulate sending email
            console.log(`Sending report to ${sub.email} with ${relevantArticles.length} articles`);

            return {
                email: sub.email,
                articlesCount: relevantArticles.length,
                status: "Sent"
            };
        }).filter(Boolean);

        return NextResponse.json({
            message: "Daily reports dispatched successfully",
            summary: {
                totalSubscribers: subscribers.length,
                dispatched: results.length,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error("Report System Error:", error);
        return NextResponse.json({ error: "Failed to dispatch reports" }, { status: 500 });
    }
}
