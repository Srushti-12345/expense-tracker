import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'

const connectToDB = async () => {
  if (mongoose.connection.readyState >= 1) return
  await mongoose.connect(process.env.MONGODB_URI!)
}

const ExpenseSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  category: String,
  date: String,
})

const Expense = mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema)

export async function POST(request: NextRequest) {
  const { id } = await request.json()
  await connectToDB()

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 })
  }

  try {
    const deleted = await Expense.findByIdAndDelete(id)
    if (!deleted) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Expense deleted successfully', deleted })
  } catch (error: any) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
