import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import uniqid from 'uniqid' // For generating unique file names

const s3 = new S3Client({
  endpoint: process.env.NEXT_PUBLIC_R2_ENDPOINT,
  region: 'auto',
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_R2_SECRET_ACCESS_KEY
  }
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { key, fileType } = req.body

  if (!key || !fileType) {
    return res.status(400).json({ error: 'File key and file type are required.' })
  }

  try {
    const uniqueFileName = `${uniqid()}-${key}`
    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_R2_BUCKET_NAME,
      Key: uniqueFileName,
      ContentType: fileType,
      ACL: 'public-read'
    })

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 })
    const fileUrl = `https://pub-2f5b50a81b7a40358799d6e7c3b2f968.r2.dev/${uniqueFileName}`

    return res.status(200).json({
      signedUrl,
      fileUrl
    })
  } catch (error) {
    console.error('Error generating presigned URL:', error)
    return res.status(500).json({ error: 'Failed to generate presigned URL.' })
  }
}
