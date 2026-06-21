import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const cookieStore = await cookies();
    cookieStore.delete("session");
    // Also clear legacy admin cookie for completeness if needed, but keeping separate for now
    return NextResponse.redirect(new URL("/login", request.url));
}
