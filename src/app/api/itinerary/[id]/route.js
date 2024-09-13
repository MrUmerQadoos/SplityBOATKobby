import { NextResponse } from 'next/server'
import { db } from '@/libs/db/db'

export async function PUT(req, { params }) {
  const { id } = params

  try {
    const body = await req.json()
    console.log(body)
    // Destructure the fields from the body
    const {
      title,
      description,
      about,
      rating,
      prices = [],
      ageRestrictions = [],
      termsConditions = [],
      cancellationPolicies = [],
      openingTimes = [],
      locations = [],
      categories,
      imageUrls = []
    } = body

    // Validate required fields
    if (!title || !description || !about) {
      return NextResponse.json({ error: 'Title, description, and about are required' }, { status: 400 })
    }

    // Validate rating
    if (rating && (isNaN(rating) || rating < 0 || rating > 5)) {
      return NextResponse.json({ error: 'Rating must be a number between 0 and 5' }, { status: 400 })
    }

    // Update the itinerary in the database
    // const updatedItinerary = await db.itinerary.update({
    //   where: { id },
    //   data: {
    //     title,
    //     description,
    //     about,
    //     rating: rating ? parseFloat(rating) : null,
    //     categories,
    //     prices: {
    //       set: prices // Replaces existing prices with new ones
    //     },
    //     ageRestrictions: {
    //       set: ageRestrictions // Replaces existing age restrictions with new ones
    //     },
    //     termsConditions: {
    //       set: termsConditions // Replaces existing terms and conditions with new ones
    //     },
    //     cancellationPolicies: {
    //       set: cancellationPolicies // Replaces existing cancellation policies with new ones
    //     },
    //     openingTimes: {
    //       set: openingTimes // Replaces existing opening times with new ones
    //     },
    //     locations: {
    //       set: locations // Replaces existing locations with new ones
    //     },
    //     images: {
    //       set: imageUrls // Replaces existing images with new ones
    //     }
    //   }
    // })

    const updateData = {
      title,
      description,
      about,
      rating: rating ? parseFloat(rating) : null,
      categories,
      prices: {
        set: prices // Replaces existing prices with new ones
      },
      ageRestrictions: {
        set: ageRestrictions // Replaces existing age restrictions with new ones
      },
      termsConditions: {
        set: termsConditions // Replaces existing terms and conditions with new ones
      },
      cancellationPolicies: {
        set: cancellationPolicies // Replaces existing cancellation policies with new ones
      },
      openingTimes: {
        set: openingTimes // Replaces existing opening times with new ones
      },
      locations: {
        set: locations // Replaces existing locations with new ones
      }
    }

    // Conditionally update images only if imageUrls has length greater than 0
    if (imageUrls.length > 0) {
      updateData.images = {
        set: imageUrls // Replaces existing images with new ones
      }
    }

    const updatedItinerary = await db.itinerary.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({
      itinerary: updatedItinerary,
      message: 'Itinerary updated successfully'
    })
  } catch (error) {
    console.error('Error updating itinerary:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  const { id } = params

  try {
    // Delete the itinerary along with its related reviews
    const deletedItinerary = await db.itinerary.delete({
      where: { id },
      include: {
        reviews: true // Include related reviews
      }
    })

    return NextResponse.json(
      {
        message: 'Itinerary and associated reviews deleted successfully',
        itinerary: deletedItinerary
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting itinerary:', error)

    if (error.code === 'P2025') {
      // Prisma error code for record not found
      return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 })
    }

    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
