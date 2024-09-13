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
