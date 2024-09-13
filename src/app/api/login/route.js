// route.js (login API)
import { db } from '@/libs/db/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    console.log('Received a POST request to login endpoint')

    const body = await req.json()
    console.log('Request body parsed successfully:', body)
    const { email, password } = body

    const user = await db.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.error('No user found with this email')
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      console.error('Invalid password')
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    console.log('User authenticated successfully')

    // const secretKey = process.env.JWT_SECRET
    const secretKey = '122343444455yudbi32y88823njz'

    const sessionToken = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '7d' })

    console.log('Generated JWT:', sessionToken)

    // Return token in response instead of setting a cookie
    return NextResponse.json(
      { message: 'Login successful', token: sessionToken, user: { id: user.id, email: user.email } },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error logging in:', error.message)
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 })
  }
}

// // pages/api/login.js
// import { db } from '@/libs/db/db' // Ensure this imports your Prisma client
// import { serialize } from 'cookie'
// import bcrypt from 'bcryptjs'
// import jwt from 'jsonwebtoken'
// import { NextResponse } from 'next/server'

// export async function POST(req) {
//   try {
//     console.log('Received a POST request to login endpoint')

//     // Parse the incoming request body
//     const body = await req.json()
//     console.log('Request body parsed successfully:', body)
//     const { email, password } = body

//     // Fetch the user from the database
//     const user = await db.user.findUnique({
//       where: { email }
//     })

//     if (!user) {
//       console.error('No user found with this email')
//       return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
//     }

//     // Verify the password
//     const isPasswordValid = await bcrypt.compare(password, user.password)
//     if (!isPasswordValid) {
//       console.error('Invalid password')
//       return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
//     }

//     console.log('User authenticated successfully')

//     // Generate a JWT token
//     const secretKey = process.env.JWT_SECRET // Use an environment variable for the secret
//     const sessionToken = jwt.sign(
//       { id: user.id, email: user.email }, // Payload
//       secretKey, // Secret key
//       { expiresIn: '7d' } // Token expires in 7 days
//     )

//     console.log('Generated JWT:', sessionToken) // Debugging line

//     // Set the cookie
//     return NextResponse.json(
//       { message: 'Login successful' },
//       {
//         status: 200,
//         headers: {
//           'Set-Cookie': serialize('auth', sessionToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             maxAge: 60 * 60 * 24 * 7, // 7 days
//             path: '/'
//           })
//         }
//       }
//     )
//   } catch (error) {
//     console.error('Error logging in:', error.message)
//     return NextResponse.json({ error: 'Failed to login' }, { status: 500 })
//   }
// }
