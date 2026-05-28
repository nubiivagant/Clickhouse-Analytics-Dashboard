import React, { useMemo } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import ChartCard from './ChartCard'

const orientationOptions = [
  { label: 'Horizontal', value: 'horizontal' },
  { label: 'Vertical', value: 'vertical' },
]

const sortOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Ascending', value: 'asc' },
  { label: 'Descending', value: 'desc' },
]

const ParentEducationChart = ({ data, activeFilter, setActiveFilter }) => {
  const formatted = useMemo(
    () => data.map(d => ({ name: d.parent_education, value: parseFloat(d.overall_average.toFixed(1)) })),
    [data],
  )

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
          <p className="text-sm font-semibold text-gray-900">{payload[0].payload.name}</p>
          <p className="text-xs text-amber-600">Overall Avg: {payload[0].value}</p>
        </div>
      )
    }
    return null
  }

  return (
    <ChartCard
      title="Parental Education Analysis"
      defaultFilters={{ orientation: 'horizontal', sort: 'default' }}
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
          displayData.sort((a, b) => a.value - b.value)
        } else if (filters.sort === 'desc') {
          displayData.sort((a, b) => b.value - a.value)
        }

        return (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              layout={filters.orientation === 'horizontal' ? 'vertical' : 'horizontal'}
              data={displayData}
              margin={{ top: 10, right: 20, left: filters.orientation === 'horizontal' ? 0 : 120, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                type={filters.orientation === 'horizontal' ? 'number' : 'category'}
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                dataKey={filters.orientation === 'horizontal' ? 'name' : undefined}
                type={filters.orientation === 'horizontal' ? 'category' : 'number'}
                stroke="#9ca3af"
                style={{ fontSize: '11px' }}
                width={filters.orientation === 'horizontal' ? 110 : undefined}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#f59e0b" name="Overall Avg" radius={[filters.orientation === 'horizontal' ? 0 : 4, 4, 4, filters.orientation === 'horizontal' ? 0 : 4]} />
            </BarChart>
          </ResponsiveContainer>
        )
      }}
    </ChartCard>
  )
}

export default ParentEducationChart
