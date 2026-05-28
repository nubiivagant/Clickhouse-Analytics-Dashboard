import React from 'react';

const FilterPanel = ({ filters, onFiltersChange }) => {
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value === '' ? null : value };
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    onFiltersChange({});
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Filters</h2>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition duration-200"
        >
          Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Gender Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <select
            value={filters.gender || ''}
            onChange={(e) => handleFilterChange('gender', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Ethnicity Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ethnicity
          </label>
          <select
            value={filters.ethnicity || ''}
            onChange={(e) => handleFilterChange('ethnicity', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Ethnicities</option>
            <option value="group A">Group A</option>
            <option value="group B">Group B</option>
            <option value="group C">Group C</option>
            <option value="group D">Group D</option>
            <option value="group E">Group E</option>
          </select>
        </div>

        {/* Lunch Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lunch Type
          </label>
          <select
            value={filters.lunch || ''}
            onChange={(e) => handleFilterChange('lunch', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Lunch Types</option>
            <option value="free/reduced">Free/Reduced</option>
            <option value="standard">Standard</option>
          </select>
        </div>

        {/* Test Prep Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Preparation
          </label>
          <select
            value={filters.preparation_course || ''}
            onChange={(e) => handleFilterChange('preparation_course', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Students</option>
            <option value="none">None</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Parent Education Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Parent Education
          </label>
          <select
            value={filters.parent_education || ''}
            onChange={(e) => handleFilterChange('parent_education', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Levels</option>
            <option value="high school">High School</option>
            <option value="some high school">Some High School</option>
            <option value="some college">Some College</option>
            <option value="bachelor's degree">Bachelor's Degree</option>
            <option value="master's degree">Master's Degree</option>
            <option value="graduate">Graduate</option>
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {Object.keys(filters).filter(k => filters[k]).length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Active Filters:</strong>
          </p>
          <div className="flex flex-wrap gap-2">
            {filters.gender && (
              <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                Gender: {filters.gender}
              </span>
            )}
            {filters.ethnicity && (
              <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                Ethnicity: {filters.ethnicity}
              </span>
            )}
            {filters.lunch && (
              <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                Lunch: {filters.lunch}
              </span>
            )}
            {filters.preparation_course && (
              <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                Test Prep: {filters.preparation_course}
              </span>
            )}
            {filters.parent_education && (
              <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                Parent Edu: {filters.parent_education}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
