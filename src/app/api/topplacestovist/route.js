import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const POST = async req => {
  try {
    const { topplacestovist } = await req.json()

    if (!topplacestovist || !Array.isArray(topplacestovist)) {
      return new Response(JSON.stringify({ error: 'Invalid data format' }), { status: 400 })
    }

    // Find the first FindAccommodation record
    let findAccommodation = await prisma.findAccommodation.findFirst()

    if (!findAccommodation) {
      // Create a new FindAccommodation if none exists
      findAccommodation = await prisma.findAccommodation.create({
        data: {
          topplacestovist: [], // Start with an empty topplacestovist array
          thingstoSee: [] // Initialize thingstoSee array as well
        }
      })
    }

    // Iterate over each card and either update or create new records
    for (const card of topplacestovist) {
      const { id, image, title } = card

      if (id === undefined || image === undefined || title === undefined) {
        return new Response(JSON.stringify({ error: 'Missing id, image, or title' }), { status: 400 })
      }

      const topPlaceIndex = findAccommodation.topplacestovist.findIndex(tp => tp.id === id)

      if (topPlaceIndex !== -1) {
        // Update existing topplacestovist record
        findAccommodation.topplacestovist[topPlaceIndex].image = image
        findAccommodation.topplacestovist[topPlaceIndex].title = title
      } else {
        // Add new topplacestovist record
        findAccommodation.topplacestovist.push({ id, image, title })
      }
    }

    // Save the changes
    await prisma.findAccommodation.update({
      where: { id: findAccommodation.id },
      data: {
        topplacestovist: findAccommodation.topplacestovist
      }
    })

    return new Response(JSON.stringify({ message: 'Top Places to Visit section updated successfully' }), {
      status: 200
    })
  } catch (error) {
    console.error('Error updating topplacestovist section:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}

export const GET = async () => {
  try {
    const findAccommodation = await prisma.findAccommodation.findFirst()

    if (!findAccommodation) {
      return new Response(JSON.stringify({ error: 'No data found' }), { status: 404 })
    }

    return new Response(JSON.stringify(findAccommodation), { status: 200 })
  } catch (error) {
    console.error('Error fetching topplacestovist section:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}
