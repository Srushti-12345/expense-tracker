import mongoose from 'mongoose'

const ExpenseSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  category: String,
  date: Date
})

export default mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema)
