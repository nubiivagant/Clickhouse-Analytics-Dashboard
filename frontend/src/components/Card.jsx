import React from 'react'

const Card = ({ children, className = '', noPadding = false }) => {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 ${!noPadding ? 'p-6' : ''} ${className}`}>
      {children}
    </div>
  )
}

export default Card
