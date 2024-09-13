import { NextResponse } from 'next/server'

import { db } from '@/libs/db/db' // Adjust this path based on your project structure

export async function GET() {
  try {
    const accommodationTypes = await db.accommodationType.findMany()
    // console.log('accommodation', accommodationTypes)
    
    return NextResponse.json(accommodationTypes)
  } catch (error) {
    console.error('Error fetching accommodationTypes:', error)

    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData()
    const name = formData.get('name')

    if (!name) {
      return NextResponse.json({ error: 'accommodationType name is required' }, { status: 400 })
    }

    const newAccommodationType = await db.accommodationType.create({
      data: { name }
    })

    return NextResponse.json(newAccommodationType)
  } catch (error) {
    console.error('Error creating accommodationType:', error)

    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
