import { NextResponse } from 'next/server'
import { db } from '@/libs/db/db'

export async function PUT(req, { params }) {
  const { id } = params

  try {
    const body = await req.json()

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
      accomodatiotype,
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

    // Update the accommodation in the database
    const updatedAccommodation = await db.accommodation.update({
      where: { id },
      data: {
        title,
        description,
        about,
        rating: rating ? parseFloat(rating) : null,
        accomodatiotype,
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
        },
        images: {
          set: imageUrls // Replaces existing images with new ones
        }
      }
    })

    return NextResponse.json({
      accommodation: updatedAccommodation,
      message: 'Accommodation updated successfully'
    })
  } catch (error) {
    console.error('Error updating accommodation:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  const { id } = params

  try {
    // Delete the accommodation along with its related reviews
    const deletedAccommodation = await db.accommodation.delete({
      where: { id },
      include: {
        reviews: true // Include related reviews
      }
    })

    return NextResponse.json(
      {
        message: 'Accommodation and associated reviews deleted successfully',
        accommodation: deletedAccommodation
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting accommodation:', error)

    if (error.code === 'P2025') {
      // Prisma error code for record not found
      return NextResponse.json({ error: 'Accommodation not found' }, { status: 404 })
    }

    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
