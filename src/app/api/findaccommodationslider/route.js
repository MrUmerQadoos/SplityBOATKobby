import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req) {
  try {
    // Fetch the existing slider record
    const existingRecord = await prisma.findAccommodationSlider.findFirst()

    if (existingRecord) {
      return NextResponse.json({
        slider: existingRecord.slider,
        message: 'Images fetched successfully'
      })
    } else {
      return NextResponse.json({ message: 'No images found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error during fetching slider images:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const body = await req.json()
    console.log('Request Body:', body)

    const { bannerSlider, deletedImages } = body

    // Validate required fields
    if (!Array.isArray(bannerSlider) || bannerSlider.some(image => !image.url)) {
      return NextResponse.json({ error: 'Each slider image must have a URL' }, { status: 400 })
    }

    // Fetch the existing slider record
    const existingRecord = await prisma.findAccommodationSlider.findFirst()

    if (existingRecord) {
      // Reset the slider to an empty array before updating
      await prisma.findAccommodationSlider.update({
        where: { id: existingRecord.id },
        data: {
          slider: {
            set: [] // Clear all existing images
          }
        }
      })

      // Update the record with the new set of images
      const updatedSlider = await prisma.findAccommodationSlider.update({
        where: { id: existingRecord.id },
        data: {
          slider: {
            set: bannerSlider // Set the new images
          }
        }
      })

      return NextResponse.json({
        slider: updatedSlider,
        message: 'Slider updated successfully'
      })
    } else {
      // Create a new record with the provided images
      const newSlider = await prisma.findAccommodationSlider.create({
        data: {
          slider: bannerSlider
        }
      })

      return NextResponse.json({
        slider: newSlider,
        message: 'Slider created successfully'
      })
    }
  } catch (error) {
    console.error('Error during slider creation or update:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
