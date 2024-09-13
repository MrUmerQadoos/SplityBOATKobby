import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Named export for POST method
export async function POST(request) {
  try {
    const { imageUrl, source, postUrl } = await request.json() // Parse JSON body

    // Save to database using Prisma
    const newGalleryItem = await prisma.gallery.create({
      data: {
        imageUrl,
        source,
        postUrl
      }
    })

    // Return success response
    return new Response(JSON.stringify({ success: true, data: newGalleryItem }), { status: 200 })
  } catch (error) {
    console.error('Error saving to database:', error)
    // Return error response
    return new Response(JSON.stringify({ success: false, error: 'Error saving to database' }), { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
