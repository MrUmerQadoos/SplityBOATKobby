// pages/api/gallery.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const galleryItems = await prisma.inStaGallery.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.status(200).json(galleryItems)
  } catch (error) {
    console.error('Error fetching gallery items:', error)
    res.status(500).json({ message: 'Error fetching gallery items' })
  } finally {
    await prisma.$disconnect()
  }
}
