import { NextResponse } from "next/server";
import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // Hardcoded admin check for now, can be moved to DB later
        if (email === "admin@zyphra.com" && password === "admin123") {
            const session = await encrypt({ role: "admin", email });
            const cookieStore = await cookies();
            cookieStore.set("session", session, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    } catch (e) {
        return NextResponse.json({ error: "Auth failed" }, { status: 500 });
    }
}
