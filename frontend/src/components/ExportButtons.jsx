import React, { useState } from 'react'

const saveBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

const ExportButtons = ({ filters = {} }) => {
  const [loadingCsv, setLoadingCsv] = useState(false)
  const [loadingPdf, setLoadingPdf] = useState(false)
  const [error, setError] = useState(null)

  // Dynamic imports for the API functions
  const handleExport = async (type) => {
    setError(null)
    try {
      const { exportCSV, exportPDF } = await import('../services/exportApi')
      if (type === 'csv') {
        setLoadingCsv(true)
        const response = await exportCSV(filters)
        saveBlob(response.data, 'student-analytics-report.csv')
      } else {
        setLoadingPdf(true)
        const response = await exportPDF(filters)
        saveBlob(response.data, 'student-analytics-report.pdf')
      }
    } catch (err) {
      console.error('Export failed', err)
      setError('Unable to download report. Please try again.')
    } finally {
      setLoadingCsv(false)
      setLoadingPdf(false)
    }
  }

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={() => handleExport('csv')}
        disabled={loadingCsv || loadingPdf}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
        title="Export as CSV"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v-4m0 0V8m0 4h4m-4 0H8" />
        </svg>
        {loadingCsv ? 'Exporting...' : 'CSV'}
      </button>
      <button
        onClick={() => handleExport('pdf')}
        disabled={loadingCsv || loadingPdf}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
        title="Export as PDF"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v-4m0 0V8m0 4h4m-4 0H8" />
        </svg>
        {loadingPdf ? 'Exporting...' : 'PDF'}
      </button>
      {error && (
        <div className="text-sm text-red-600 whitespace-nowrap">{error}</div>
      )}
    </div>
  )
}

export default ExportButtons
