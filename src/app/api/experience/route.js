import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const POST = async req => {
  try {
    const { experience } = await req.json()

    if (!experience || !Array.isArray(experience)) {
      return new Response(JSON.stringify({ error: 'Invalid data format' }), { status: 400 })
    }
    // Find the first PlaceToVisit record
    let placeToVisit = await prisma.placeToVisit.findFirst()

    if (!placeToVisit) {
      // Create a new PlaceToVisit if none exists
      placeToVisit = await prisma.placeToVisit.create({
        data: {
          experience: [],
          // Start with an empty experience array
          explore: [], // You might want to initialize explore and gallery too
          gallery: {
            images: []
          }
        }
      })
    }

    // Iterate over each card and either update or create new records
    for (const card of experience) {
      const { id, image, title } = card

      if (id === undefined || image === undefined || title === undefined) {
        return new Response(JSON.stringify({ error: 'Missing id, image, or title' }), { status: 400 })
      }

      const experienceIndex = placeToVisit.experience.findIndex(exp => exp.id === id)

      if (experienceIndex !== -1) {
        // Update existing experience record
        placeToVisit.experience[experienceIndex].image = image
        placeToVisit.experience[experienceIndex].title = title
      } else {
        // Add new experience record
        placeToVisit.experience.push({ id, image, title })
      }
    }

    // Save the changes
    await prisma.placeToVisit.update({
      where: { id: placeToVisit.id },
      data: {
        experience: placeToVisit.experience
      }
    })

    return new Response(JSON.stringify({ message: 'Experience section updated successfully' }), { status: 200 })
  } catch (error) {
    console.error('Error updating experience section:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}

export const GET = async () => {
  try {
    const placeToVisit = await prisma.placeToVisit.findFirst()

    if (!placeToVisit) {
      return new Response(JSON.stringify({ error: 'No data found' }), { status: 404 })
    }

    return new Response(JSON.stringify(placeToVisit), { status: 200 })
  } catch (error) {
    console.error('Error fetching experience section:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}
