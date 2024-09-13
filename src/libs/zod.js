import { z } from 'zod'

// Define the schema for a single LandscapceCard
const landscapceCardSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  imgSrc: z.string().min(1, 'Image is required'),
})


const exploreSectionSchema = z.array(landscapceCardSchema)

export { landscapceCardSchema, exploreSectionSchema }
