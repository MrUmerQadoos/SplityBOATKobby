import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const POST = async req => {
  try {
    const { mayIntrested } = await req.json()

    if (!mayIntrested || !Array.isArray(mayIntrested)) {
      return new Response(JSON.stringify({ error: 'Invalid data format' }), { status: 400 })
    }

    // Find the first PlanYourTrip record
    let planYourTrip = await prisma.planYourTrip.findFirst()

    if (!planYourTrip) {
      // Create a new PlanYourTrip if none exists
      planYourTrip = await prisma.planYourTrip.create({
        data: {
          mayIntrested: [], // Initialize mayIntrested array
          topplacestovistPlan: [] // Initialize topplacestovistPlan array as well
        }
      })
    }

    // Iterate over each card and either update or create new records
    for (const card of mayIntrested) {
      const { id, image, title } = card

      if (id === undefined || image === undefined || title === undefined) {
        return new Response(JSON.stringify({ error: 'Missing id, image, or title' }), { status: 400 })
      }

      const interestIndex = planYourTrip.mayIntrested.findIndex(mi => mi.id === id)

      if (interestIndex !== -1) {
        // Update existing mayIntrested record
        planYourTrip.mayIntrested[interestIndex].image = image
        planYourTrip.mayIntrested[interestIndex].title = title
      } else {
        // Add new mayIntrested record
        planYourTrip.mayIntrested.push({ id, image, title })
      }
    }

    // Save the changes
    await prisma.planYourTrip.update({
      where: { id: planYourTrip.id },
      data: {
        mayIntrested: planYourTrip.mayIntrested
      }
    })

    return new Response(JSON.stringify({ message: 'May Be Interested section updated successfully' }), {
      status: 200
    })
  } catch (error) {
    console.error('Error updating mayIntrested section:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}

export const GET = async () => {
  try {
    const planYourTrip = await prisma.planYourTrip.findFirst()

    if (!planYourTrip) {
      return new Response(JSON.stringify({ error: 'No data found' }), { status: 404 })
    }

    return new Response(JSON.stringify(planYourTrip), { status: 200 })
  } catch (error) {
    console.error('Error fetching mayIntrested section:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}
