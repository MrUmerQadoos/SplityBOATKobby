import { NextRequest } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export const runtime = 'edge'

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.NEXT_PUBLIC_R2_ENDPOINT, // Cloudflare R2 endpoint
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_R2_SECRET_ACCESS_KEY
  }
})

export async function POST(request) {
  const { filename } = await request.json()

  try {
    const signedUrl = await getSignedUrl(
      s3,
      new PutObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_R2_BUCKET_NAME,
        Key: filename,
        ACL: 'public-read'
      }),
      { expiresIn: 600 } // URL expires in 10 minutes
    )

    const fileUrl = `https://pub-2f5b50a81b7a40358799d6e7c3b2f968.r2.dev/${filename}`

    return new Response(JSON.stringify({ url: signedUrl, fileUrl }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// import { NextRequest } from 'next/server'
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// export const runtime = 'edge'

// const s3 = new S3Client({
//   region: 'auto', // Cloudflare R2 doesn't need a specific region
//   endpoint: process.env.NEXT_PUBLIC_R2_ENDPOINT, // Your Cloudflare R2 endpoint
//   credentials: {
//     accessKeyId: process.env.NEXT_PUBLIC_R2_ACCESS_KEY_ID,
//     secretAccessKey: process.env.NEXT_PUBLIC_R2_SECRET_ACCESS_KEY
//   }
// })

// export async function POST(request) {
//   const { filename } = await request.json()

//   try {
//     const signedUrl = await getSignedUrl(
//       s3,
//       new PutObjectCommand({
//         Bucket: process.env.NEXT_PUBLIC_R2_BUCKET_NAME, // Your R2 bucket
//         Key: filename,
//         ACL: 'public-read' // Set appropriate permissions
//       }),
//       { expiresIn: 600 } // URL expiry time
//     )

//     return new Response(JSON.stringify({ url: signedUrl }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' }
//     })
//   } catch (error) {
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' }
//     })
//   }
// }





