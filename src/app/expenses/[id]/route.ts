import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'

// 🔗 Connect to MongoDB
const connectToDB = async () => {
  if (mongoose.connection.readyState >= 1) return
  await mongoose.connect(process.env.MONGODB_URI!)
}

// 📦 Expense Schema and Model
const ExpenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: String, required: true },
})

const Expense = mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema)

// 🗑️ DELETE Handler
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params // ✅ Await the dynamic params

  await connectToDB()

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid expense ID format' }, { status: 400 })
  }

  try {
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
