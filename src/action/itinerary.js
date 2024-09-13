'use server'

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function createItinerary(data) {
  try {
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
      locations, // Make sure locations is passed correctly
      categories,
      imageUrls
    } = data

    // Validate required fields
    if (!title || !description || !about) {
      throw new Error('Title, description, and about are required')
    }

    // Validate locations (each location must have lat and lng)
    if (
      !Array.isArray(locations) ||
      locations.some(loc => typeof loc.lat !== 'number' || typeof loc.lng !== 'number')
    ) {
      throw new Error('Each location must have valid lat and lng coordinates')
    }

    // Format the data
    const formattedLocations = locations.map(loc => ({
      lat: loc.lat,
      lng: loc.lng,
      address: loc.address
    }))

    const formattedImages = imageUrls.map(url => ({ url }))

    // Create new itinerary in the database
    const newItinerary = await prisma.itinerary.create({
      data: {
        title,
        description,
        about,
        rating: rating ? parseFloat(rating) : null,
        categories,
        locations: formattedLocations, // Directly assign formatted locations
        prices: prices, // Directly assign prices
        ageRestrictions: ageRestrictions, // Directly assign age restrictions
        termsConditions: termsConditions, // Directly assign terms and conditions
        cancellationPolicies: cancellationPolicies, // Directly assign cancellation policies
        openingTimes: openingTimes, // Directly assign opening times
        images: formattedImages // Directly assign formatted images
      }
    })

    return {
      status: 200,
      message: 'Itinerary created successfully',
      itinerary: newItinerary
    }
  } catch (error) {
    console.error('Error during itinerary creation:', error.message)
    return {
      status: 500,
      message: `Failed to create itinerary: ${error.message}`
    }
  }
}
