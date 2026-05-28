import React, { useMemo } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import ChartCard from './ChartCard'

const orientationOptions = [
  { label: 'Vertical', value: 'vertical' },
  { label: 'Horizontal', value: 'horizontal' },
]

const sortOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Ascending', value: 'asc' },
  { label: 'Descending', value: 'desc' },
]

const ScoreDistributionChart = ({ data, activeFilter, setActiveFilter }) => {
  const formatted = useMemo(
    () => data.map(d => ({
      score_range: d.score_range,
      count: parseInt(d.student_count, 10),
    })),
    [data],
  )

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
          <p className="text-sm font-semibold text-gray-900">{payload[0].payload.score_range}</p>
          <p className="text-xs text-green-600">Students: {payload[0].value}</p>
        </div>
      )
    }
    return null
  }

  return (
    <ChartCard
      title="Score Distribution"
      defaultFilters={{ orientation: 'vertical', sort: 'default' }}
      filterConfig={[
        { label: 'Orientation', key: 'orientation', options: orientationOptions },
        { label: 'Sort', key: 'sort', options: sortOptions },
      ]}
      activeFilter={activeFilter}
      setActiveFilter={setActiveFilter}
    >
      {({ filters }) => {
        const displayData = [...formatted]

        if (filters.sort === 'asc') {
          displayData.sort((a, b) => a.count - b.count)
        } else if (filters.sort === 'desc') {
          displayData.sort((a, b) => b.count - a.count)
        }

        return (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={displayData}
              layout={filters.orientation === 'horizontal' ? 'vertical' : 'horizontal'}
              margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey={filters.orientation === 'horizontal' ? 'count' : 'score_range'}
                type={filters.orientation === 'horizontal' ? 'number' : 'category'}
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                dataKey={filters.orientation === 'horizontal' ? 'score_range' : undefined}
                type={filters.orientation === 'horizontal' ? 'category' : 'number'}
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#10b981" name="Students" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )
      }}
    </ChartCard>
  )
}

export default ScoreDistributionChart
