import { NextResponse } from 'next/server'
import { db } from '@/libs/db/db'

export async function DELETE(req, { params }) {
  const { id } = params

  try {
    const deletedItinerary = await db.itinerary.delete({
      where: { id }
    })

    return NextResponse.json(
      {
        message: 'Itinerary deleted successfully',
        itinerary: deletedItinerary
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting itinerary:', error)

    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 })
    }

    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      const itinerary = await db.itinerary.findUnique({
        where: { id: id },
        include: {
          images: true,
          locations: true,
          prices: true,
          ageRestrictions: true,
          termsConditions: true,
          cancellationPolicies: true,
          openingTimes: true
        }
      })

      if (!itinerary) {
        return NextResponse.json({ error: 'Itinerary not found' }, { status: 404 })
      }

      return NextResponse.json({ itinerary }, { status: 200 })
    } else {
      const itineraries = await db.itinerary.findMany({
        include: {
          images: true,
          locations: true,
          prices: true,
          ageRestrictions: true,
          termsConditions: true,
          cancellationPolicies: true,
          openingTimes: true
        }
      })

      return NextResponse.json({ itineraries }, { status: 200 })
    }
  } catch (error) {
    console.error('Error fetching itineraries:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const body = await req.json()

    console.log('Request Body:', body)

    const {
      title,
      description,
      about,
      rating,
      prices,
      ageRestrictions,
      termsConditions,
      cancellationPolicies,
      openingTimes,
      location,
      categories,
      imageUrls
    } = body

    if (!title || !description || !about) {
      return NextResponse.json({ error: 'Title, description, and about are required' }, { status: 400 })
    }

    if (rating && (isNaN(rating) || rating < 0 || rating > 5)) {
      return NextResponse.json({ error: 'Rating must be a number between 0 and 5' }, { status: 400 })
    }

    if (!Array.isArray(prices) || prices.some(price => !price.category || !price.name || !price.value)) {
      return NextResponse.json({ error: 'Each price must have a category, name, and value' }, { status: 400 })
    }

    if (!Array.isArray(ageRestrictions) || ageRestrictions.some(restriction => !restriction.description)) {
      return NextResponse.json({ error: 'Each age restriction must have a description' }, { status: 400 })
    }

    if (!Array.isArray(termsConditions) || termsConditions.some(condition => !condition.description)) {
      return NextResponse.json({ error: 'Each term and condition must have a description' }, { status: 400 })
    }

    if (!Array.isArray(cancellationPolicies) || cancellationPolicies.some(policy => !policy.description)) {
      return NextResponse.json({ error: 'Each cancellation policy must have a description' }, { status: 400 })
    }

    if (
      !Array.isArray(openingTimes) ||
      openingTimes.some(time => !time.openingTime || !time.closingTime || !time.startMonth || !time.endMonth)
    ) {
      return NextResponse.json(
        { error: 'Each opening time must have openingTime, closingTime, openingMonth, and closingMonth' },
        { status: 400 }
      )
    }

    if (
      !Array.isArray(openingTimes) ||
      openingTimes.some(time => !time.openingTime || !time.closingTime || !time.startMonth || !time.endMonth)
    ) {
      return NextResponse.json(
        { error: 'Each opening time must have openingTime, closingTime, openingMonth, and closingMonth' },
        { status: 400 }
      )
    }

    const formattedLocations = location.map(loc => ({
      lat: loc.lat,
      lng: loc.lng,
      address: loc.address
    }))

    const formattedImages = imageUrls.map(url => ({ url }))

    const newItinerary = await db.itinerary.create({
      data: {
        title,
        description,
        about,
        rating: rating ? parseFloat(rating) : null,
        categories,
        locations: formattedLocations,
        prices,
        ageRestrictions,
        termsConditions,
        cancellationPolicies,
        openingTimes,
        images: formattedImages
      }
    })

    return NextResponse.json({
      itinerary: newItinerary,
      message: 'Itinerary created successfully'
    })
  } catch (error) {
    console.error('Error during itinerary creation:', error)

    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
