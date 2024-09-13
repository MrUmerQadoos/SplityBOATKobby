import { NextResponse } from 'next/server'

import { db } from '@/libs/db/db' // Adjust this path based on your project structure

export async function GET() {
  try {
    const categories = await db.category.findMany()

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)

    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData()
    const name = formData.get('name')

    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
    }

    const newCategory = await db.category.create({
      data: { name }
    })

    return NextResponse.json(newCategory)
  } catch (error) {
    console.error('Error creating category:', error)

    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
