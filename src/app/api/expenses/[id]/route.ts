import { NextResponse } from 'next/server'
import { connectToDB } from '@/utils/db'
import Expense from '@/models/expense'

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectToDB()

  try {
    const deleted = await Expense.findByIdAndDelete(params.id)
    if (!deleted) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
