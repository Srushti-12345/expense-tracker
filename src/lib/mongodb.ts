import mongoose from 'mongoose'

export async function connectDB() {
  if (mongoose.connections[0].readyState) return

  // 🔍 Log the environment variable to debug
  console.log('MongoDB URI:', process.env.MONGODB_URI)

  await mongoose.connect(process.env.MONGODB_URI!)
}

