import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const POST = async req => {
  try {
    const { thingstoSee } = await req.json()

    if (!thingstoSee || !Array.isArray(thingstoSee)) {
      return new Response(JSON.stringify({ error: 'Invalid data format' }), { status: 400 })
    }

    // Find the first FindAccommodation record
    let findAccommodation = await prisma.findAccommodation.findFirst()

    if (!findAccommodation) {
      // Create a new FindAccommodation if none exists
      findAccommodation = await prisma.findAccommodation.create({
        data: {
          topplacestovist: [], // Initialize topplacestovist array as well
          thingstoSee: [] // Start with an empty thingstoSee array
        }
      })
    }

    // Iterate over each card and either update or create new records
    for (const card of thingstoSee) {
      const { id, image, title } = card

      if (id === undefined || image === undefined || title === undefined) {
        return new Response(JSON.stringify({ error: 'Missing id, image, or title' }), { status: 400 })
      }

      const thingstoSeeIndex = findAccommodation.thingstoSee.findIndex(ts => ts.id === id)

      if (thingstoSeeIndex !== -1) {
        // Update existing thingstoSee record
        findAccommodation.thingstoSee[thingstoSeeIndex].image = image
        findAccommodation.thingstoSee[thingstoSeeIndex].title = title
      } else {
        // Add new thingstoSee record
        findAccommodation.thingstoSee.push({ id, image, title })
      }
    }

    // Save the changes
    await prisma.findAccommodation.update({
      where: { id: findAccommodation.id },
      data: {
        thingstoSee: findAccommodation.thingstoSee
      }
    })

    return new Response(JSON.stringify({ message: 'Things to See section updated successfully' }), {
      status: 200
    })
  } catch (error) {
    console.error('Error updating thingstoSee section:', error)
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
    console.error('Error fetching thingstoSee section:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}
