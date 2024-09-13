// pages/api/upload-s3.js
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { PrismaClient } from '@prisma/client'
import fs from 'fs'

const prisma = new PrismaClient()
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { tempFilePath, mediaData } = req.body

  try {
    // Read file from temp location
    const fileContent = fs.readFileSync(tempFilePath)

    // Upload to S3
    const key = `instagram-posts/${Date.now()}.jpg`
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: fileContent,
        ContentType: 'image/jpeg'
      })
    )

    // Save to database
    const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`
    const galleryItem = await prisma.inStaGallery.create({
      data: {
        imageUrl,
        source: 'instagram',
        postUrl: mediaData.permalink,
        caption: mediaData.caption,
        mediaType: mediaData.media_type,
        timestamp: new Date(mediaData.timestamp)
      }
    })

    // Clean up temp file
    fs.unlinkSync(tempFilePath)

    res.status(200).json({ data: galleryItem })
  } catch (error) {
    console.error('Error uploading to S3 or saving to database:', error)
    res.status(500).json({ message: 'Error uploading to S3 or saving to database' })
  }
}
