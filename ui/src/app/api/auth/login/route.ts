import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password required" }, { status: 400 });
        }

        // 1. Check Hardcoded Admin (Requested to unify login)
        if (email === "admin@zyphra.com" && password === "admin123") {
            const session = await encrypt({ role: "admin", email });
            const cookieStore = await cookies();
            cookieStore.set("session", session, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            });
            return NextResponse.json({ success: true, role: "admin" });
        }

        // 2. Fallback to normal user database check
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Create user session
        const session = await encrypt({ id: user.id, email: user.email, name: user.name });
        const cookieStore = await cookies();
        cookieStore.set("session", session, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });

        return NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name } });

    } catch (e) {
        return NextResponse.json({ error: "Login failed" }, { status: 500 });
    }
}
