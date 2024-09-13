import mongoose from 'mongoose'
// const NEXT_PUBLIC_DATABASE_URL = process.env.NEXT_PUBLIC_DATABASE_URL

export async function connectDB() {
  try {
    await mongoose.connect(
      'mongodb+srv://umerqudooscortechsols:Wi7cNnzvzoiK9AjZ@cluster0.wsdd7.mongodb.net/IMAGESPLITDITYBOAT',
      {
        dbName: 'store'
      }
    )
    console.log('connection created successfully.')
  } catch (error) {
    console.log(error)
  }
}
