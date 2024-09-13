import { NextResponse } from 'next/server'

import { db } from '@/libs/db/db' // Adjust this path based on your project structure

export async function DELETE(req) {
  try {
    const id = req.nextUrl.pathname.split('/').pop()

    if (!id) {
      return NextResponse.json({ error: 'AccomodationType ID is required' }, { status: 400 })
    }

    const deletedAccomodation = await db.accommodationType.delete({
      where: { id }
    })

    return NextResponse.json(deletedAccomodation)
  } catch (error) {
    console.error('Error deleting AccomodationType:', error)

    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
