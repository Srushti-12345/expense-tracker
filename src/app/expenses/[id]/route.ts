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

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  await connectToDB()

  const { id } = context.params

  try {
    const deleted = await Expense.findByIdAndDelete(id)
    if (!deleted) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
