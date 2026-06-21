import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from './lib/auth'

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    // BasePath handles /main now, so we don't need manual redirects here

    const isAdminPath = pathname.startsWith('/news-admin');
    const isLoginPage = pathname === '/news-admin/login';

    if (isAdminPath && !isLoginPage) {
        const session = request.cookies.get('session')?.value;
        if (!session) {
            return NextResponse.redirect(new URL('/news-admin/login', request.url));
        }

        const decoded = await decrypt(session);
        if (!decoded) {
            return NextResponse.redirect(new URL('/news-admin/login', request.url));
        }
    }
}

export const config = {
    matcher: ['/news-admin/:path*'],
}
