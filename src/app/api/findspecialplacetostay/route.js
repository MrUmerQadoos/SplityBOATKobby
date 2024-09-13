import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const POST = async req => {
  try {
    const { findspecialplacetostay } = await req.json()

    if (!findspecialplacetostay || !Array.isArray(findspecialplacetostay)) {
      return new Response(JSON.stringify({ error: 'Invalid data format' }), { status: 400 })
    }

    // Find the first AccommodationDesc record
    let accommodationDesc = await prisma.accommodationDesc.findFirst()

    if (!accommodationDesc) {
      // Create a new AccommodationDesc if none exists
      accommodationDesc = await prisma.accommodationDesc.create({
        data: {
          findspecialplacetostay: [] // Initialize findspecialplacetostay array as empty
        }
      })
    }

    // Iterate over each card and either update or create new records
    for (const card of findspecialplacetostay) {
      const { id, image, title } = card

      if (id === undefined || image === undefined || title === undefined) {
        return new Response(JSON.stringify({ error: 'Missing id, image, or title' }), { status: 400 })
      }

      const placeIndex = accommodationDesc.findspecialplacetostay.findIndex(place => place.id === id)

      if (placeIndex !== -1) {
        // Update existing findspecialplacetostay record
        accommodationDesc.findspecialplacetostay[placeIndex].image = image
        accommodationDesc.findspecialplacetostay[placeIndex].title = title
      } else {
        // Add new findspecialplacetostay record
        accommodationDesc.findspecialplacetostay.push({ id, image, title })
      }
    }

    // Save the changes
    await prisma.accommodationDesc.update({
      where: { id: accommodationDesc.id },
      data: {
        findspecialplacetostay: accommodationDesc.findspecialplacetostay
      }
    })

    return new Response(JSON.stringify({ message: 'Find a special place to stay section updated successfully' }), {
      status: 200
    })
  } catch (error) {
    console.error('Error updating findspecialplacetostay section:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}

export const GET = async () => {
  try {
    const accommodationDesc = await prisma.accommodationDesc.findFirst()

    if (!accommodationDesc) {
      return new Response(JSON.stringify({ error: 'No data found' }), { status: 404 })
    }

    return new Response(JSON.stringify(accommodationDesc), { status: 200 })
  } catch (error) {
    console.error('Error fetching findspecialplacetostay section:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}
