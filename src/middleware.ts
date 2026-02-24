import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(_request: NextRequest) {
    // No auth required — data is local-only, no server sessions needed
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
