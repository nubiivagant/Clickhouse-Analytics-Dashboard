import React, { useMemo } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts'
import ChartCard from './ChartCard'

const metricOptions = [
  { label: 'All Metrics', value: 'all' },
  { label: 'Math', value: 'avg_math_score' },
  { label: 'Reading', value: 'avg_reading_score' },
  { label: 'Writing', value: 'avg_writing_score' },
]

const viewOptions = [
  { label: 'Grouped', value: 'grouped' },
  { label: 'Stacked', value: 'stacked' },
]

const topOptions = [
  { label: 'All Ethnicities', value: 'all' },
  { label: 'Top 5 by selected metric', value: 'top5' },
]

const RaceChart = ({ data, activeFilter, setActiveFilter }) => {
  const formatted = useMemo(
    () => data.map(d => ({
      ethnicity: d.ethnicity.substring(0, 10),
      avg_math_score: parseFloat(d.avg_math_score.toFixed(1)),
      avg_reading_score: parseFloat(d.avg_reading_score.toFixed(1)),
      avg_writing_score: parseFloat(d.avg_writing_score.toFixed(1)),
    })),
    [data],
  )

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
          <p className="text-sm font-semibold text-gray-900">{payload[0].payload.ethnicity}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <ChartCard
      title="Race / Ethnicity Analysis"
      defaultFilters={{ metric: 'all', view: 'grouped', topN: 'all' }}
      filterConfig={[
        { label: 'Metric', key: 'metric', options: metricOptions },
        { label: 'View', key: 'view', options: viewOptions },
        { label: 'Category', key: 'topN', options: topOptions },
      ]}
      activeFilter={activeFilter}
      setActiveFilter={setActiveFilter}
    >
      {({ filters }) => {
        const metricKey = filters.metric === 'all' ? 'avg_math_score' : filters.metric
        const displayData = [...formatted]

        if (filters.topN === 'top5') {
          displayData.sort((a, b) => (b[metricKey] ?? 0) - (a[metricKey] ?? 0))
          displayData.splice(5)
        }

        return (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={displayData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="ethnicity" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              {filters.metric === 'all' && <Legend />}
              {filters.metric === 'all' ? (
                <>
                  <Bar dataKey="avg_math_score" fill="#3b82f6" name="Math" radius={[4, 4, 0, 0]} stackId={filters.view === 'stacked' ? 'a' : undefined} />
                  <Bar dataKey="avg_reading_score" fill="#10b981" name="Reading" radius={[4, 4, 0, 0]} stackId={filters.view === 'stacked' ? 'a' : undefined} />
                  <Bar dataKey="avg_writing_score" fill="#f59e0b" name="Writing" radius={[4, 4, 0, 0]} stackId={filters.view === 'stacked' ? 'a' : undefined} />
                </>
              ) : (
                <Bar dataKey={metricKey} fill={metricKey === 'avg_reading_score' ? '#10b981' : metricKey === 'avg_writing_score' ? '#f59e0b' : '#3b82f6'} name={metricOptions.find(option => option.value === metricKey)?.label || 'Metric'} radius={[4, 4, 0, 0]} />
              )}
            </BarChart>
          </ResponsiveContainer>
        )
      }}
    </ChartCard>
  )
}

export default RaceChart
