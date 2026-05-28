import React, { useState, useMemo } from 'react'
import Card from './Card'

const TopPerformersTable = ({ data }) => {
  const [sortBy, setSortBy] = useState('total_score')
  const [sortOrder, setSortOrder] = useState('desc')
  const [page, setPage] = useState(0)
  const rowsPerPage = 10

  const sortedData = useMemo(() => {
    const sorted = [...(data || [])].sort((a, b) => {
      const aVal = a[sortBy] || 0
      const bVal = b[sortBy] || 0
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal
    })
    return sorted
  }, [data, sortBy, sortOrder])

  const paginatedData = sortedData.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
  const totalPages = Math.ceil(sortedData.length / rowsPerPage)

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
    setPage(0)
  }

  const SortIcon = ({ column }) => {
    if (sortBy !== column) return <span className="text-gray-300 ml-1">⇅</span>
    return sortOrder === 'desc' ? <span className="text-blue-600 ml-1">↓</span> : <span className="text-blue-600 ml-1">↑</span>
  }

  return (
    <Card noPadding>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-50 border-y border-gray-200 dark:bg-slate-900 dark:border-slate-700">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                <button onClick={() => handleSort('gender')} className="flex items-center hover:text-blue-600">
                  Gender <SortIcon column="gender" />
                </button>
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                <button onClick={() => handleSort('ethnicity')} className="flex items-center hover:text-blue-600">
                  Ethnicity <SortIcon column="ethnicity" />
                </button>
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                <button onClick={() => handleSort('parent_education')} className="flex items-center hover:text-blue-600">
                  Parent Ed. <SortIcon column="parent_education" />
                </button>
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-700">
                <button onClick={() => handleSort('preparation_course')} className="flex items-center hover:text-blue-600">
                  Test Prep <SortIcon column="preparation_course" />
                </button>
              </th>
              <th className="px-6 py-3 text-right font-semibold text-gray-700">
                <button onClick={() => handleSort('math_score')} className="flex items-center justify-end ml-auto hover:text-blue-600">
                  Math <SortIcon column="math_score" />
                </button>
              </th>
              <th className="px-6 py-3 text-right font-semibold text-gray-700">
                <button onClick={() => handleSort('reading_score')} className="flex items-center justify-end ml-auto hover:text-blue-600">
                  Reading <SortIcon column="reading_score" />
                </button>
              </th>
              <th className="px-6 py-3 text-right font-semibold text-gray-700">
                <button onClick={() => handleSort('writing_score')} className="flex items-center justify-end ml-auto hover:text-blue-600">
                  Writing <SortIcon column="writing_score" />
                </button>
              </th>
              <th className="px-6 py-3 text-right font-semibold text-gray-700">
                <button onClick={() => handleSort('total_score')} className="flex items-center justify-end ml-auto hover:text-blue-600">
                  Total <SortIcon column="total_score" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
            {paginatedData.map((row, idx) => (
              <tr key={idx} className="hover:bg-blue-50 dark:hover:bg-slate-800 transition">
                <td className="px-6 py-3 text-gray-800 dark:text-slate-100">{row.gender}</td>
                <td className="px-6 py-3 text-gray-800 dark:text-slate-100">{row.ethnicity}</td>
                <td className="px-6 py-3 text-gray-800 dark:text-slate-100 text-sm">{row.parent_education.substring(0, 12)}</td>
                <td className="px-6 py-3 text-gray-800 dark:text-slate-100">{row.preparation_course}</td>
                <td className="px-6 py-3 text-right text-gray-800 dark:text-slate-100 font-medium">{row.math_score}</td>
                <td className="px-6 py-3 text-right text-gray-800 dark:text-slate-100 font-medium">{row.reading_score}</td>
                <td className="px-6 py-3 text-right text-gray-800 dark:text-slate-100 font-medium">{row.writing_score}</td>
                <td className="px-6 py-3 text-right text-gray-900 dark:text-slate-100 font-bold">{row.total_score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {paginatedData.length === 0 && (
        <div className="px-6 py-8 text-center text-gray-500">
          No data available
        </div>
      )}

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, sortedData.length)} of {sortedData.length}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`px-3 py-1 rounded-lg transition ${
                  page === i ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page === totalPages - 1}
              className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </Card>
  )
}

export default TopPerformersTable
