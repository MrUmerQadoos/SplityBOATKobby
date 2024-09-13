// Logout API (if needed)
export async function POST(req) {
  try {
    console.log('Received a POST request to logout endpoint')
    // No need to clear cookies, just send a success response
    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error logging out:', error.message)
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 })
  }
}

// import { serialize } from 'cookie'
// import { NextResponse } from 'next/server'
// export async function POST(req) {
//   try {
//     console.log('Received a POST request to logout endpoint')
//     // Clear the auth cookie
//     return NextResponse.json(
//       { message: 'Logged out successfully' },
//       {
//         status: 200,
//         headers: {
//           'Set-Cookie': serialize('auth', '', {
//             httpOnly: true,
//             secure: process.env.NEXT_PUBLIC_PATH === 'production',
//             maxAge: -1, // Expire the cookie immediately
//             path: '/'
//           })
//         }
//       }
//     )
//   } catch (error) {
//     console.error('Error logging out:', error.message)
//     return NextResponse.json({ error: 'Failed to logout' }, { status: 500 })
//   }
// }
