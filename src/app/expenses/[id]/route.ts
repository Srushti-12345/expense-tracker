import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'

// 🔗 Connect to MongoDB only if not already connected
const connectToDB = async () => {
  if (mongoose.connection.readyState >= 1) return
  try {
    await mongoose.connect(process.env.MONGODB_URI!)
  } catch (err) {
    console.error('MongoDB connection error:', err)
    throw new Error('Database connection failed')
  }
}

// 📦 Define Expense schema and model
const ExpenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: String, required: true },
})

const Expense = mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema)

// 🗑️ DELETE handler with awaited params and robust error handling
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    await connectToDB()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid expense ID format' }, { status: 400 })
    }

    const deletedExpense = await Expense.findByIdAndDelete(id)

    if (!deletedExpense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 })
    }

    return NextResponse.json(
      { message: 'Expense deleted successfully', deletedExpense },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('DELETE route error:', error.message || error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
