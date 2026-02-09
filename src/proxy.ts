
import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;
    // console.log(pathname)
    const publicRoutes = ['/login', '/register', '/api/auth'];
    if (publicRoutes.some((path) => pathname.startsWith(path))) {
        return NextResponse.next();
    }
 
    const session=await auth()
 
    if (!session) {
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('callback', req.url);
        // console.log("login url ",loginUrl)
        return NextResponse.redirect(loginUrl);
    }

    const role = session.user?.role;
    if (pathname.startsWith('/user') && role !== 'user') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
    if (pathname.startsWith('/delivery') && role !== 'deliveryBoy') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
    if (pathname.startsWith('/admin') && role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/user/stripe/webhook|api/socket/.*|api/.*).*)',
    ],
};
