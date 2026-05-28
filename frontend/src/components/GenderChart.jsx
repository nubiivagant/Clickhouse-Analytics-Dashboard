import React, { useMemo } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts'
import ChartCard from './ChartCard'

const metricOptions = [
  { label: 'All Metrics', value: 'all' },
  { label: 'Math', value: 'avg_math' },
  { label: 'Reading', value: 'avg_reading' },
  { label: 'Writing', value: 'avg_writing' },
]

const viewOptions = [
  { label: 'Grouped', value: 'grouped' },
  { label: 'Stacked', value: 'stacked' },
]

const sortOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Ascending', value: 'asc' },
  { label: 'Descending', value: 'desc' },
]

const GenderChart = ({ data, activeFilter, setActiveFilter }) => {
  const formatted = useMemo(
    () => data.map(d => ({
      gender: d.gender,
      avg_math: parseFloat(d.avg_math.toFixed(1)),
      avg_reading: parseFloat(d.avg_reading.toFixed(1)),
      avg_writing: parseFloat(d.avg_writing.toFixed(1)),
    })),
    [data],
  )

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
          <p className="text-sm font-semibold text-gray-900">{payload[0].payload.gender}</p>
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
      title="Gender Analysis"
      defaultFilters={{ metric: 'all', view: 'grouped', sort: 'default' }}
      filterConfig={[
        { label: 'Metric', key: 'metric', options: metricOptions },
        { label: 'Chart Mode', key: 'view', options: viewOptions },
        { label: 'Sort', key: 'sort', options: sortOptions },
      ]}
      activeFilter={activeFilter}
      setActiveFilter={setActiveFilter}
    >
      {({ filters }) => {
        const metricKey = filters.metric === 'all' ? 'all' : filters.metric
        const displayData = [...formatted]

        if (filters.sort === 'asc') {
          displayData.sort((a, b) => (a[metricKey === 'all' ? 'avg_math' : metricKey] ?? 0) - (b[metricKey === 'all' ? 'avg_math' : metricKey] ?? 0))
        } else if (filters.sort === 'desc') {
          displayData.sort((a, b) => (b[metricKey === 'all' ? 'avg_math' : metricKey] ?? 0) - (a[metricKey === 'all' ? 'avg_math' : metricKey] ?? 0))
        }

        return (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={displayData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="gender" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              {metricKey === 'all' && <Legend />}
              {metricKey === 'all' ? (
                <>
                  <Bar dataKey="avg_math" fill="#3b82f6" name="Math" radius={[4, 4, 0, 0]} stackId={filters.view === 'stacked' ? 'a' : undefined} />
                  <Bar dataKey="avg_reading" fill="#10b981" name="Reading" radius={[4, 4, 0, 0]} stackId={filters.view === 'stacked' ? 'a' : undefined} />
                  <Bar dataKey="avg_writing" fill="#f59e0b" name="Writing" radius={[4, 4, 0, 0]} stackId={filters.view === 'stacked' ? 'a' : undefined} />
                </>
              ) : (
                <Bar dataKey={metricKey} fill={metricKey === 'avg_reading' ? '#10b981' : metricKey === 'avg_writing' ? '#f59e0b' : '#3b82f6'} name={metricOptions.find(option => option.value === metricKey)?.label || 'Metric'} radius={[4, 4, 0, 0]} />
              )}
            </BarChart>
          </ResponsiveContainer>
        )
      }}
    </ChartCard>
  )
}

export default GenderChart
