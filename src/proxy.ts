import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;
    // console.log(pathname)
    const publicRoutes = ['/login', '/register', '/api/auth'];
    if (publicRoutes.some((path) => pathname.startsWith(path))) {
        return NextResponse.next();
    }
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    console.log('token is here', token);
    console.log('req url ', req.url);
    if (!token) {
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('callback', req.url);
        // console.log("login url ",loginUrl)
        return NextResponse.redirect(loginUrl);
    }

    const role = token.role;
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
        /*
      Include everything except static, images, favicon and stripe webhook
    */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/user/stripe/webhook).*)',
    ],
};
