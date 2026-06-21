import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { encrypt } from "@/lib/auth";

export async function POST(request: Request) {
    try {
        const { name, email, password, sections } = await request.json();

        if (!name || !email || !password || !sections || sections.length === 0) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Transaction: Create User & Subscriptions
        const user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                },
            });

            // Create subscriptions
            for (const section of sections) {
                await tx.subscription.create({
                    data: {
                        userId: newUser.id,
                        section,
                        isActive: true,
                    }
                });
            }

            return newUser;
        });

        // Login immediately (Set cookie)
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
        const session = await encrypt({ id: user.id, email: user.email, name: user.name, expires });

        const response = NextResponse.json({ success: true, user });
        response.cookies.set("session", session, { expires, httpOnly: true });

        return response;

    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Registration failed" }, { status: 500 });
    }
}
