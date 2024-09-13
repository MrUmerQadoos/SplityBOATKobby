import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const POST = async req => {
  try {
    const { topplacestovistPlan } = await req.json()

    if (!topplacestovistPlan || !Array.isArray(topplacestovistPlan)) {
      return new Response(JSON.stringify({ error: 'Invalid data format' }), { status: 400 })
    }

    // Find the first PlanYourTrip record
    let planYourTrip = await prisma.planYourTrip.findFirst()

    if (!planYourTrip) {
      // Create a new PlanYourTrip if none exists
      planYourTrip = await prisma.planYourTrip.create({
        data: {
          topplacestovistPlan: [], // Start with an empty topplacestovistPlan array
          mayIntrested: [] // Initialize mayIntrested array as well
        }
      })
    }

    // Iterate over each card and either update or create new records
    for (const card of topplacestovistPlan) {
      const { id, image, title } = card

      if (id === undefined || image === undefined || title === undefined) {
        return new Response(JSON.stringify({ error: 'Missing id, image, or title' }), { status: 400 })
      }

      const planIndex = planYourTrip.topplacestovistPlan.findIndex(tp => tp.id === id)

      if (planIndex !== -1) {
        // Update existing topplacestovistPlan record
        planYourTrip.topplacestovistPlan[planIndex].image = image
        planYourTrip.topplacestovistPlan[planIndex].title = title
      } else {
        // Add new topplacestovistPlan record
        planYourTrip.topplacestovistPlan.push({ id, image, title })
      }
    }

    // Save the changes
    await prisma.planYourTrip.update({
      where: { id: planYourTrip.id },
      data: {
        topplacestovistPlan: planYourTrip.topplacestovistPlan
      }
    })

    return new Response(JSON.stringify({ message: 'Top Places to Visit Plan section updated successfully' }), {
      status: 200
    })
  } catch (error) {
    console.error('Error updating topplacestovistPlan section:', error)
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
    console.error('Error fetching topplacestovistPlan section:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}
