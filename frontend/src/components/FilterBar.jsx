import React from 'react'

const FilterBar = ({ filters, onFiltersChange, onAddStudent }) => {
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value === '' ? null : value }
    onFiltersChange(newFilters)
  }

  const handleReset = () => {
    onFiltersChange({})
  }

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-full px-6 py-4 flex items-center gap-4 overflow-x-auto">
        {/* Gender Filter */}
        <div className="flex flex-col min-w-max">
          <label className="text-xs font-semibold text-gray-600 mb-1">Gender</label>
          <select
            value={filters.gender || ''}
            onChange={(e) => handleFilterChange('gender', e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Ethnicity Filter */}
        <div className="flex flex-col min-w-max">
          <label className="text-xs font-semibold text-gray-600 mb-1">Ethnicity</label>
          <select
            value={filters.ethnicity || ''}
            onChange={(e) => handleFilterChange('ethnicity', e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">All</option>
            <option value="group A">Group A</option>
            <option value="group B">Group B</option>
            <option value="group C">Group C</option>
            <option value="group D">Group D</option>
            <option value="group E">Group E</option>
          </select>
        </div>

        {/* Lunch Filter */}
        <div className="flex flex-col min-w-max">
          <label className="text-xs font-semibold text-gray-600 mb-1">Lunch</label>
          <select
            value={filters.lunch || ''}
            onChange={(e) => handleFilterChange('lunch', e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">All</option>
            <option value="free/reduced">Free/Reduced</option>
            <option value="standard">Standard</option>
          </select>
        </div>

        {/* Test Prep Filter */}
        <div className="flex flex-col min-w-max">
          <label className="text-xs font-semibold text-gray-600 mb-1">Test Prep</label>
          <select
            value={filters.preparation_course || ''}
            onChange={(e) => handleFilterChange('preparation_course', e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">All</option>
            <option value="none">None</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Parent Education Filter */}
        <div className="flex flex-col min-w-max">
          <label className="text-xs font-semibold text-gray-600 mb-1">Parent Ed.</label>
          <select
            value={filters.parent_education || ''}
            onChange={(e) => handleFilterChange('parent_education', e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">All</option>
            <option value="high school">High School</option>
            <option value="some high school">Some High School</option>
            <option value="some college">Some College</option>
            <option value="bachelor's degree">Bachelor's</option>
            <option value="master's degree">Master's</option>
            <option value="graduate">Graduate</option>
          </select>
        </div>

        <div className="ml-auto flex items-center gap-3 mt-5 whitespace-nowrap">
          <button
            type="button"
            onClick={onAddStudent}
            className="rounded-full bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
          >
            + Add
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition whitespace-nowrap"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilterBar
