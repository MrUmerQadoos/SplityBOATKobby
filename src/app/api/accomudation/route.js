import { NextResponse } from 'next/server'

import { db } from '@/libs/db/db'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      const accommodation = await db.accommodation.findUnique({
        where: { id: id }, // Treat id as a string
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

      if (!accommodation) {
        return NextResponse.json({ error: 'Accommodation not found' }, { status: 404 })
      }

      return NextResponse.json({ accommodation }, { status: 200 })
    } else {
      const accommodations = await db.accommodation.findMany({
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

      return NextResponse.json({ accommodations }, { status: 200 })
    }
  } catch (error) {
    console.error('Error fetching accommodations:', error)
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
      accomodatiotype,
      imageUrls
    } = body

    // Validate required fields
    if (!title || !description || !about) {
      return NextResponse.json({ error: 'Title, description, and about are required' }, { status: 400 })
    }

    // Validate rating (if provided, must be a number between 0 and 5)
    if (rating && (isNaN(rating) || rating < 0 || rating > 5)) {
      return NextResponse.json({ error: 'Rating must be a number between 0 and 5' }, { status: 400 })
    }

    // Validate prices (each price must have category, name, and value)
    if (!Array.isArray(prices) || prices.some(price => !price.category || !price.name || !price.value)) {
      return NextResponse.json({ error: 'Each price must have a category, name, and value' }, { status: 400 })
    }

    // Validate ageRestrictions (each restriction must have a description)
    if (!Array.isArray(ageRestrictions) || ageRestrictions.some(restriction => !restriction.description)) {
      return NextResponse.json({ error: 'Each age restriction must have a description' }, { status: 400 })
    }

    // Validate termsConditions (each term must have a description)
    if (!Array.isArray(termsConditions) || termsConditions.some(condition => !condition.description)) {
      return NextResponse.json({ error: 'Each term and condition must have a description' }, { status: 400 })
    }

    // Validate cancellationPolicies (each policy must have a description)
    if (!Array.isArray(cancellationPolicies) || cancellationPolicies.some(policy => !policy.description)) {
      return NextResponse.json({ error: 'Each cancellation policy must have a description' }, { status: 400 })
    }

    // Validate openingTimes (each time must have openingTime, closingTime, and month)
    if (
      !Array.isArray(openingTimes) ||
      openingTimes.some(time => !time.openingTime || !time.closingTime || !time.startMonth || !time.endMonth)
    ) {
      return NextResponse.json(
        { error: 'Each opening time must have openingTime, closingTime, openingMonth, and closingMonth' },
        { status: 400 }
      )
    }

    // Validate locations (each location must have lat and lng)
    if (!Array.isArray(location) || location.some(loc => typeof loc.lat !== 'number' || typeof loc.lng !== 'number')) {
      return NextResponse.json({ error: 'Each location must have valid lat and lng coordinates' }, { status: 400 })
    }

    // Validate imageUrls (each URL must be a valid string)
    if (!Array.isArray(imageUrls) || imageUrls.some(url => typeof url !== 'string')) {
      return NextResponse.json({ error: 'Each image URL must be a valid string' }, { status: 400 })
    }

    // Prepare the data for Prisma
    const formattedLocations = location.map(loc => ({
      lat: loc.lat,
      lng: loc.lng,
      address: loc.address // Include the address in the final form data
    }))

    const formattedImages = imageUrls.map(url => ({ url }))

    // Create new accommodation in the database
    const newAccommodation = await db.accommodation.create({
      data: {
        title,
        description,
        about,
        rating: rating ? parseFloat(rating) : null,
        accomodatiotype,
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
      accommodation: newAccommodation,
      message: 'Accommodation created successfully'
    })
  } catch (error) {
    console.error('Error during accommodation creation:', error)

    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
