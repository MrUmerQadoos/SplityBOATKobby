import { NextRequest, NextResponse } from 'next/server'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import uniqid from 'uniqid' // Assuming you're using the 'uniqid' package

const s3 = new S3Client({
  region: process.env.NEXT_PUBLIC_R2_REGION,
  endpoint: process.env.NEXT_PUBLIC_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_R2_SECRET_ACCESS_KEY
  }
})

export const POST = async req => {
  try {
    const formData = await req.formData()

    if (formData.has('file')) {
      const file = formData.get('file')

      // Generate a unique ID for the file and preserve its original extension
      const randomId = uniqid()
      const ext = file.name.split('.').pop()
      const newFilename = `${randomId}.${ext}`

      // Convert ReadableStream to Buffer
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Construct the upload command with the new filename
      const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_R2_BUCKET_NAME,
        Key: newFilename,
        Body: buffer,
        ContentType: file.type,
        ACL: 'public-read' // Ensure the file is publicly accessible
      })

      // Send the upload request to Cloudflare R2
      const response = await s3.send(putObjectCommand)

      if (response.$metadata.httpStatusCode === 200) {
        // Use the Public R2.dev Bucket URL provided by Cloudflare
        const fileUrl = `https://pub-2f5b50a81b7a40358799d6e7c3b2f968.r2.dev/${newFilename}`
        console.log('File uploaded successfully: ', fileUrl)

        // Return the file URL in the response
        return new NextResponse(JSON.stringify({ link: fileUrl }), { status: 200 })
      } else {
        console.log('Error in file upload', response)
        return new NextResponse(JSON.stringify({ success: false, message: 'Failed to upload file' }), { status: 500 })
      }
    } else {
      return new NextResponse(JSON.stringify({ message: 'File not found' }), { status: 400 })
    }
  } catch (error) {
    console.log('Error during file upload', error)
    return new NextResponse(JSON.stringify({ success: false, message: error.message }), {
      status: 500
    })
  }
}

// import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
// import uniqid from 'uniqid'

// export async function POST(req) {
//   try {
//     const formData = await req.formData()

//     if (formData.has('file')) {
//       const file = formData.get('file')

//       const S3_ACCESS_KEY = process.env.NEXT_PUBLIC_S3_ACCESS_KEY
//       const S3_SECRET_ACCESS_KEY = process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY
//       const BUCKET_NAME = process.env.NEXT_PUBLIC_BUCKET_NAME

//       if (!S3_ACCESS_KEY || !S3_SECRET_ACCESS_KEY || !BUCKET_NAME) {
//         return new Response('Missing environment variables', { status: 500 })
//       }

//       const s3Client = new S3Client({
//         region: 'ap-northeast-2',
//         credentials: {
//           accessKeyId: S3_ACCESS_KEY,
//           secretAccessKey: S3_SECRET_ACCESS_KEY
//         }
//       })

//       const randomId = uniqid()
//       const ext = file.name.split('.').pop()
//       const newFilename = `landscape/${randomId}.${ext}` // Folder structure for landscapes

//       // Convert ReadableStream to Buffer
//       const buffer = await new Response(file).arrayBuffer()
//       const body = Buffer.from(buffer)

//       await s3Client.send(
//         new PutObjectCommand({
//           Bucket: BUCKET_NAME,
//           Key: newFilename,
//           ACL: 'public-read',
//           Body: body,
//           ContentType: file.type
//         })
//       )

//       const link = `https://${BUCKET_NAME}.s3.amazonaws.com/${newFilename}`

//       return new Response(JSON.stringify({ link }), { status: 200 })
//     }

//     return new Response('File not found', { status: 400 })
//   } catch (error) {
//     console.error('Error uploading file:', error)
//     return new Response('Internal Server Error', { status: 500 })
//   }
// }
