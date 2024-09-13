// middleware.js
import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
// Define secure paths
const securePaths = [
  '/main',
  '/things-to-do',
  '/wild',
  '/plan-your-trip',
  '/find-accommodation',
  '/account-settings',
  '/aboutpage',
  '/card-basic',
  '/place-to-visit'
]
export async function middleware(req) {
  const { pathname } = req.nextUrl
  // Check if the requested path is secure
  if (securePaths.includes(pathname)) {
    const authCookie = req.cookies.get('authToken')
    // Debugging: Check what authCookie contains
    console.log('Auth Cookie:', authCookie)
    if (!authCookie) {
      console.log('Auth cookie is missing, redirecting to login.')
      return NextResponse.redirect(new URL('/login', req.url))
    }
    try {
      // const secretKey = new TextEncoder().encode(process.env.JWT_SECRET)
      const secretKey = new TextEncoder().encode('122343444455yudbi32y88823njz')

      // Verify the JWT token using jose
      await jwtVerify(authCookie.value, secretKey)
      // Continue if token is valid
      return NextResponse.next()
    } catch (error) {
      console.error('JWT verification failed:', error.message)
      return NextResponse.redirect(new URL('/login', req.url)) // Redirect if token is invalid
    }
  }
  return NextResponse.next()
}
export const config = {
  matcher: [
    '/main',
    '/things-to-do',
    '/wild',
    '/plan-your-trip',
    '/find-accommodation',
    '/account-settings',
    '/aboutpage',
    '/card-basic',
    '/place-to-visit'
  ]
}
