import { NextResponse } from 'next/server'
import { connectDB } from '../../../lib/mongodb'
import Expense from '../../../models/expense'

export async function GET() {
  await connectDB()
  const expenses = await Expense.find()
  return NextResponse.json(expenses)
}

export async function POST(req: Request) {
  await connectDB()
  const body = await req.json()
  const newExpense = await Expense.create(body)
  return NextResponse.json(newExpense)
}
