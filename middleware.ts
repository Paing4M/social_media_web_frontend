import { auth } from '@/app/api/auth/[...nextauth]/auth'
import { NextRequest, NextResponse } from 'next/server'

export default auth((req, res) => {
	if (
		(req.nextUrl.pathname === '/' ||
			req.nextUrl.pathname.includes('profile') ||
			req.nextUrl.pathname.includes('group')
		) &&
		!req.auth
	) {
		const callbackURL = req.nextUrl.pathname
		return NextResponse.redirect(new URL('/login?callbackURL=' + encodeURIComponent(callbackURL), req.url))
	}
	if (
		(req.nextUrl.pathname === '/login' ||
			req.nextUrl.pathname === '/signup') &&
		req.auth
	) {
		return NextResponse.redirect(new URL('/', req.url))
	}
})

export const config = {
	matcher: ['/', '/login', '/signup', '/profile/:path*' , '/group/:path*'],
}
