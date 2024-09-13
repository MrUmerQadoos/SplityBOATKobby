import { db } from '@/libs/db/db' // Adjust the import path to your actual db setup
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { explore, experience, gallery } = await req.json()

    // Validate the received data
    if (!Array.isArray(explore) || !Array.isArray(experience) || !gallery || !Array.isArray(gallery.images)) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 })
    }

    // Insert into MongoDB using Prisma
    const newPlaceToVisit = await db.placeToVisit.create({
      data: {
        explore,
        experience,
        gallery
      }
    })

    return NextResponse.json(
      {
        message: 'Place to Visit created successfully',
        placeToVisit: newPlaceToVisit
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error saving Place to Visit:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
