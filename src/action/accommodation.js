'use server'

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function createAccommodation(data) {
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
      location,
      accomodatiotype,
      imageUrls
    } = data

    // Validate required fields
    if (!title || !description || !about) {
      throw new Error('Title, description, and about are required')
    }

    // Validate rating (if provided, must be a number between 0 and 5)
    if (rating && (isNaN(rating) || rating < 0 || rating > 5)) {
      throw new Error('Rating must be a number between 0 and 5')
    }

    // Validate prices (each price must have category, name, and value)
    if (!Array.isArray(prices) || prices.some(price => !price.category || !price.name || !price.value)) {
      throw new Error('Each price must have a category, name, and value')
    }

    // Validate ageRestrictions (each restriction must have a description)
    if (!Array.isArray(ageRestrictions) || ageRestrictions.some(restriction => !restriction.description)) {
      throw new Error('Each age restriction must have a description')
    }

    // Validate termsConditions (each term must have a description)
    if (!Array.isArray(termsConditions) || termsConditions.some(condition => !condition.description)) {
      throw new Error('Each term and condition must have a description')
    }

    // Validate cancellationPolicies (each policy must have a description)
    if (!Array.isArray(cancellationPolicies) || cancellationPolicies.some(policy => !policy.description)) {
      throw new Error('Each cancellation policy must have a description')
    }

    // Validate openingTimes (each time must have openingTime, closingTime, startMonth, and endMonth)
    if (
      !Array.isArray(openingTimes) ||
      openingTimes.some(time => !time.openingTime || !time.closingTime || !time.startMonth || !time.endMonth)
    ) {
      throw new Error('Each opening time must have openingTime, closingTime, startMonth, and endMonth')
    }

    // Validate locations (each location must have lat and lng)
    if (!Array.isArray(location) || location.some(loc => typeof loc.lat !== 'number' || typeof loc.lng !== 'number')) {
      throw new Error('Each location must have valid lat and lng coordinates')
    }

    // Validate imageUrls (each URL must be a valid string)
    if (!Array.isArray(imageUrls) || imageUrls.some(url => typeof url !== 'string')) {
      throw new Error('Each image URL must be a valid string')
    }

    // Prepare the data for Prisma
    const formattedLocations = location.map(loc => ({
      lat: loc.lat,
      lng: loc.lng,
      address: loc.address
    }))

    const formattedImages = imageUrls.map(url => ({ url }))

    // Create new accommodation in the database
    const newAccommodation = await prisma.accommodation.create({
      data: {
        title,
        description,
        about,
        rating: rating ? parseFloat(rating) : null,
        accomodatiotype,
        locations: formattedLocations, // Remove "create"
        prices: prices, // Remove "create"
        ageRestrictions: ageRestrictions, // Remove "create"
        termsConditions: termsConditions, // Remove "create"
        cancellationPolicies: cancellationPolicies, // Remove "create"
        openingTimes: openingTimes, // Remove "create"
        images: formattedImages // Remove "create"
      }
    })

    return {
      status: 200,
      message: 'Accommodation created successfully',
      accommodation: newAccommodation
    }
  } catch (error) {
    console.error('Error during accommodation creation:', error.message)
    return {
      status: 500,
      message: `Failed to create accommodation: ${error.message}`
    }
  }
}

// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()

// export async function createAccommodation(data) {
//   try {
//     const {
//       title,
//       description,
//       about,
//       rating,
//       prices,
//       ageRestrictions,
//       termsConditions,
//       cancellationPolicies,
//       openingTimes,
//       location,
//       accomodatiotype,
//       imageUrls
//     } = data

//     // Validate required fields
//     if (!title || !description || !about) {
//       throw new Error('Title, description, and about are required')
//     }

//     // Validate rating (if provided, must be a number between 0 and 5)
//     if (rating && (isNaN(rating) || rating < 0 || rating > 5)) {
//       throw new Error('Rating must be a number between 0 and 5')
//     }

//     // Validate prices (each price must have category, name, and value)
//     if (!Array.isArray(prices) || prices.some(price => !price.category || !price.name || !price.value)) {
//       throw new Error('Each price must have a category, name, and value')
//     }

//     // Validate ageRestrictions (each restriction must have a description)
//     if (!Array.isArray(ageRestrictions) || ageRestrictions.some(restriction => !restriction.description)) {
//       throw new Error('Each age restriction must have a description')
//     }

//     // Validate termsConditions (each term must have a description)
//     if (!Array.isArray(termsConditions) || termsConditions.some(condition => !condition.description)) {
//       throw new Error('Each term and condition must have a description')
//     }

//     // Validate cancellationPolicies (each policy must have a description)
//     if (!Array.isArray(cancellationPolicies) || cancellationPolicies.some(policy => !policy.description)) {
//       throw new Error('Each cancellation policy must have a description')
//     }

//     // Validate openingTimes (each time must have openingTime, closingTime, startMonth, and endMonth)
//     if (
//       !Array.isArray(openingTimes) ||
//       openingTimes.some(time => !time.openingTime || !time.closingTime || !time.startMonth || !time.endMonth)
//     ) {
//       throw new Error('Each opening time must have openingTime, closingTime, startMonth, and endMonth')
//     }

//     // Validate locations (each location must have lat and lng)
//     if (!Array.isArray(location) || location.some(loc => typeof loc.lat !== 'number' || typeof loc.lng !== 'number')) {
//       throw new Error('Each location must have valid lat and lng coordinates')
//     }

//     // Validate imageUrls (each URL must be a valid string)
//     if (!Array.isArray(imageUrls) || imageUrls.some(url => typeof url !== 'string')) {
//       throw new Error('Each image URL must be a valid string')
//     }

//     // Prepare the data for Prisma
//     const formattedLocations = location.map(loc => ({
//       lat: loc.lat,
//       lng: loc.lng,
//       address: loc.address
//     }))

//     const formattedImages = imageUrls.map(url => ({ url }))

//     // Create new accommodation in the database
//     const newAccommodation = await prisma.accommodation.create({
//       data: {
//         title,
//         description,
//         about,
//         rating: rating ? parseFloat(rating) : null,
//         accomodatiotype,
//         locations: {
//           create: formattedLocations
//         },
//         prices: {
//           create: prices
//         },
//         ageRestrictions: {
//           create: ageRestrictions
//         },
//         termsConditions: {
//           create: termsConditions
//         },
//         cancellationPolicies: {
//           create: cancellationPolicies
//         },
//         openingTimes: {
//           create: openingTimes
//         },
//         images: {
//           create: formattedImages
//         }
//       }
//     })

//     return {
//       status: 200,
//       message: 'Accommodation created successfully',
//       accommodation: newAccommodation
//     }
//   } catch (error) {
//     console.error('Error during accommodation creation:', error.message)
//     return {
//       status: 500,
//       message: `Failed to create accommodation: ${error.message}`
//     }
//   }
// }
