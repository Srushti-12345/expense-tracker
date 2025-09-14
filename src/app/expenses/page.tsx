'use client'

import { useState, useEffect } from 'react'

type Expense = {
  _id?: string
  title: string
  amount: number
  category: string
  date: string
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [form, setForm] = useState<Expense>({
    title: '',
    amount: 0,
    category: '',
    date: ''
  })

  useEffect(() => {
    fetch('/api/expenses')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setExpenses(data)
      })
      .catch(err => console.error('Error fetching expenses:', err))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (!res.ok) throw new Error('Failed to create expense')

      const newExpense = await res.json()
      setExpenses(prev => [...prev, newExpense])
      setForm({ title: '', amount: 0, category: '', date: '' })
    } catch (err) {
      console.error('Error submitting expense:', err)
    }
  }

  const handleDelete = async (id?: string) => {
    if (!id) return
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to delete expense')

      setExpenses(prev => prev.filter(exp => exp._id !== id))
    } catch (err) {
      console.error('Error deleting expense:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-6">
      <div className="max-w-xl mx-auto bg-white border border-gray-300 rounded-lg p-6 shadow-md">

        {/* Navigation Link */}
        <nav className="mb-4 text-center">
          <a href="/" className="text-indigo-600 hover:underline font-medium">
            ← Back to Home
          </a>
        </nav>

        <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
          Expense Tracker
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full p-2 rounded border border-gray-300 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <input
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Amount"
            type="number"
            className="w-full p-2 rounded border border-gray-300 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="w-full p-2 rounded border border-gray-300 bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <input
            name="date"
            value={form.date}
            onChange={handleChange}
            type="date"
            className="w-full p-2 rounded border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-700 transition duration-300"
          >
            ➕ Add Expense
          </button>
        </form>

        <ul className="space-y-4">
          {expenses.map((exp, idx) => (
            <li
              key={exp._id || idx}
              className="border border-gray-300 p-4 rounded bg-white text-gray-800 hover:bg-gray-50 transition duration-300 flex justify-between items-center"
            >
              <div>
                <strong className="text-indigo-700">{exp.title}</strong> — ₹{exp.amount}{' '}
                <span className="text-gray-600">({exp.category})</span> on{' '}
                <span className="text-gray-500">{new Date(exp.date).toLocaleDateString()}</span>
              </div>
              <button
                onClick={() => handleDelete(exp._id)}
                aria-label={`Delete expense ${exp.title}`}
                className="text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded transition ml-4"
              >
                Delete🗑️
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
