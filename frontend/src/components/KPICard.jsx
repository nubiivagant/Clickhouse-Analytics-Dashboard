import React from 'react'
import Card from './Card'

const KPICard = ({ title, value, subtitle, icon, trend }) => {
  const icons = {
    students: '👥',
    math: '🔢',
    reading: '📖',
    writing: '✏️',
    testprep: '✅',
  }

  const selectedIcon = icon ? icons[icon] : '📊'

  return (
    <Card className="flex flex-col justify-between h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">{title}</p>
        </div>
        <span className="text-2xl">{selectedIcon}</span>
      </div>

      <div>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
        {trend && (
          <div className={`text-xs font-semibold mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
      </div>
    </Card>
  )
}

export default KPICard
