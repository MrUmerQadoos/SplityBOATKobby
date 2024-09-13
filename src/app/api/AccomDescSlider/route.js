import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET Method: Fetch existing slider images
export async function GET(req) {
  try {
    // Fetch the existing AccomDescSlider record
    const existingRecord = await prisma.accomDescSlider.findFirst()

    if (existingRecord) {
      console.log('Fetched Slider Record:', existingRecord)
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

// POST Method: Add or update slider images
export async function POST(req) {
  try {
    const body = await req.json()
    // console.log('Request Body:', body)

    const { bannerSlider } = body // Now reading `bannerSlider` from the request

    // Check if bannerSlider exists and is in array format
    if (!Array.isArray(bannerSlider)) {
      //   console.log('Invalid bannerSlider format:', bannerSlider)
      return NextResponse.json({ error: 'Slider must be an array' }, { status: 400 })
    }

    // Validate that each bannerSlider object has a URL
    const invalidImages = bannerSlider.filter(image => !image.url)
    if (invalidImages.length > 0) {
      //   console.log('Invalid slider images:', invalidImages)
      return NextResponse.json({ error: 'Each slider image must have a URL' }, { status: 400 })
    }

    // Fetch the existing AccomDescSlider record
    const existingRecord = await prisma.accomDescSlider.findFirst()

    if (existingRecord) {
      //   console.log('Existing Record Found:', existingRecord)

      // Reset the slider to an empty array before updating
      await prisma.accomDescSlider.update({
        where: { id: existingRecord.id },
        data: {
          slider: {
            set: [] // Clear all existing images
          }
        }
      })

      // Update the record with the new set of images
      const updatedSlider = await prisma.accomDescSlider.update({
        where: { id: existingRecord.id },
        data: {
          slider: {
            set: bannerSlider // Set the new images
          }
        }
      })

      //   console.log('Slider Updated:', updatedSlider)
      return NextResponse.json({
        slider: updatedSlider,
        message: 'Slider updated successfully'
      })
    } else {
      console.log('No existing record, creating new one.')

      // Create a new record with the provided images
      const newSlider = await prisma.accomDescSlider.create({
        data: {
          slider: bannerSlider
        }
      })

      //   console.log('Slider Created:', newSlider)
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
