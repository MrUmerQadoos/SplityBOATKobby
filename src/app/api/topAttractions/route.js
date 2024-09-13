import { db } from '@/libs/db/db'

export const POST = async req => {
  try {
    const { topAttractions } = await req.json()

    if (!topAttractions || !Array.isArray(topAttractions)) {
      return new Response(JSON.stringify({ error: 'Invalid data format' }), { status: 400 })
    }

    // Find the first ThingsTodo record
    let thingsTodo = await db.thingsTodo.findFirst()

    if (!thingsTodo) {
      // Create a new ThingsTodo if none exists
      thingsTodo = await db.thingsTodo.create({
        data: {
          topAttractions: [] // Start with an empty topAttractions array
        }
      })
    }

    // Iterate over each attraction and either update or create new records
    for (const attraction of topAttractions) {
      const { id, image, title } = attraction

      if (id === undefined || image === undefined || title === undefined) {
        return new Response(JSON.stringify({ error: 'Missing id, image, or title' }), { status: 400 })
      }

      const attractionIndex = thingsTodo.topAttractions.findIndex(attr => attr.id === id)

      if (attractionIndex !== -1) {
        // Update existing topAttractions record
        thingsTodo.topAttractions[attractionIndex].image = image
        thingsTodo.topAttractions[attractionIndex].title = title
      } else {
        // Add new topAttractions record
        thingsTodo.topAttractions.push({ id, image, title })
      }
    }

    // Save the changes
    await db.thingsTodo.update({
      where: { id: thingsTodo.id },
      data: {
        topAttractions: thingsTodo.topAttractions
      }
    })

    return new Response(JSON.stringify({ message: 'Top Attractions updated successfully' }), { status: 200 })
  } catch (error) {
    console.error('Error updating top attractions:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}

export const GET = async () => {
  try {
    const thingsTodo = await db.thingsTodo.findFirst()

    if (!thingsTodo) {
      return new Response(JSON.stringify({ error: 'No data found' }), { status: 404 })
    }

    return new Response(JSON.stringify(thingsTodo), { status: 200 })
  } catch (error) {
    console.error('Error fetching top attractions:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}
