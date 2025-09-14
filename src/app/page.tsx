'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [total, setTotal] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    // Fetch summary data from your API
    fetch('/api/expenses')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCount(data.length)
          setTotal(data.reduce((sum, exp) => sum + exp.amount, 0))
        }
      })
  }, [])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-white text-gray-800 p-6">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-bold text-indigo-700 mb-4">Welcome to Expense Tracker</h1>
        <p className="text-gray-600 mb-6">
          A simple, elegant way to manage your spending. Whether you're budgeting for groceries or tracking business costs, we've got you covered.
        </p>

        <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm mb-6">
          <p className="text-lg font-medium text-gray-700">
            📊 Total Expenses Logged: <span className="text-indigo-600">{count}</span>
          </p>
          <p className="text-lg font-medium text-gray-700">
            💰 Total Amount Spent: <span className="text-indigo-600">₹{total}</span>
          </p>
        </div>

        <Link
          href="/expenses"
          className="inline-block bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 hover:scale-105 transition transform duration-200"
        >
          ➡️ Start Tracking Expenses
        </Link>

        <div className="mt-6 text-sm text-gray-500">
          💡 Tip: Use categories to understand where your money goes.<br />
          🔒 Your data stays private and secure.
        </div>
      </div>
    </main>
  )
}
