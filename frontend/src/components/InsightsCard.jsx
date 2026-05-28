import React, { useState, useEffect } from 'react'
import { getInsights } from '../services/analyticsApi'
import Card from './Card'

const InsightsCard = ({ filters = {}, refreshTrigger = 0 }) => {
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const insightIcons = ['📈', '🍽', '🎓', '📊', '⭐', '🎯']

  useEffect(() => {
    fetchInsights()
  }, [filters, refreshTrigger])

  const fetchInsights = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getInsights(filters)
      setInsights(response.data?.insights || [])
    } catch (err) {
      setError('Failed to load insights')
      console.error('Error fetching insights:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-6">Analytics Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 rounded-lg animate-pulse bg-gradient-to-br from-gray-100 to-gray-50 dark:from-slate-800 dark:to-slate-900"
            />
          ))}
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Analytics Insights</h2>
        <button
          onClick={fetchInsights}
          className="px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition dark:text-blue-300 dark:hover:bg-slate-800"
        >
          Refresh
        </button>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg dark:bg-rose-900 dark:border-rose-800 dark:text-rose-300">
          {error}
        </div>
      ) : insights.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-md transition dark:border-slate-700 dark:from-slate-800 dark:to-slate-900"
            >
              <div className="flex gap-3">
                <span className="text-xl">{insightIcons[index % insightIcons.length]}</span>
                <p className="text-sm text-gray-800 dark:text-slate-200 leading-relaxed">{insight}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm dark:text-slate-400">No insights available at this time.</p>
      )}
    </Card>
  )
}

export default InsightsCard
