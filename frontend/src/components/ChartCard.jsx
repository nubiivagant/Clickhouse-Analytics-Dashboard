import React, { useEffect, useRef, useState } from 'react'
import { toPng } from 'html-to-image'

const ChartCard = ({
  title,
  children,
  className = '',
  defaultFilters = {},
  filterConfig = [],
  activeFilter,
  setActiveFilter,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [chartFilters, setChartFilters] = useState(defaultFilters)
  const [refreshKey, setRefreshKey] = useState(0)
  const cardRef = useRef(null)
  const menuRef = useRef(null)
  const closeButtonRef = useRef(null)
  const cardChartRef = useRef(null)
  const modalChartRef = useRef(null)

  const menuVisible = activeFilter === title
  const activeMenu = typeof activeFilter !== 'undefined' ? menuVisible : false

  useEffect(() => {
    if (!activeMenu) {
      return
    }
    const handleOutsideClick = event => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setActiveFilter?.(null)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [activeMenu, setActiveFilter])

  useEffect(() => {
    if (!activeMenu) {
      return
    }
    const firstButton = menuRef.current?.querySelector('button')
    firstButton?.focus()
  }, [activeMenu])

  useEffect(() => {
    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        if (isExpanded) {
          setIsExpanded(false)
        }
        if (activeMenu) {
          setActiveFilter?.(null)
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [activeMenu, isExpanded, setActiveFilter])

  const updateFilter = (key, value) => {
    setChartFilters(prev => ({ ...prev, [key]: value }))
    setRefreshKey(prev => prev + 1)
  }

  const resetChart = () => {
    setChartFilters(defaultFilters)
    setRefreshKey(prev => prev + 1)
  }

  const refreshChart = () => {
    setRefreshKey(prev => prev + 1)
  }

  const downloadChart = async useModal => {
    const node = useModal ? modalChartRef.current : cardChartRef.current
    if (!node) {
      return
    }

    try {
      const dataUrl = await toPng(node, {
        cacheBust: true,
        backgroundColor: '#ffffff',
      })
      const link = document.createElement('a')
      link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Chart export failed', error)
    }
  }

  const renderChild = typeof children === 'function'
    ? children({ filters: chartFilters, refreshKey })
    : children

  return (
    <>
      <div ref={cardRef} className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <div className="flex gap-2 relative">
            <button
              type="button"
              aria-label={`Open filter menu for ${title}`}
              onClick={() => setActiveFilter?.(activeMenu ? null : title)}
              className="p-2 hover:bg-gray-100 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L13 11.414V19a1 1 0 01-.293.707l-2 2A1 1 0 008 20v-8.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              type="button"
              aria-label={`Expand ${title} to fullscreen`}
              onClick={() => setIsExpanded(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6v4m12-4h4v4M6 18h4v-4m8 4h4v-4" />
              </svg>
            </button>

            {activeMenu && (
              <div
                ref={menuRef}
                className="absolute right-0 top-full z-20 mt-3 w-80 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl transition duration-200 ease-out"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Chart filters</p>
                  <button
                    type="button"
                    aria-label="Close filter menu"
                    onClick={() => setActiveFilter?.(null)}
                    className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    ×
                  </button>
                </div>
                {filterConfig.map(section => (
                  <div key={section.key} className="mb-4 last:mb-0">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">{section.label}</p>
                    <div className="flex flex-wrap gap-2">
                      {section.options.map(option => {
                        const active = chartFilters[section.key] === option.value
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => updateFilter(section.key, option.value)}
                            className={`rounded-full border px-3 py-1 text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 ${active ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 bg-gray-100 text-gray-700 hover:border-gray-300 hover:bg-gray-200'}`}
                          >
                            {option.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}

                <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                  <button
                    type="button"
                    onClick={resetChart}
                    className="w-full rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Reset Chart
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadChart(false)}
                    className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Download PNG
                  </button>
                  <button
                    type="button"
                    onClick={refreshChart}
                    className="w-full rounded-xl bg-white border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Refresh Chart
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div ref={cardChartRef} className="overflow-hidden rounded-2xl">
          <div key={`${refreshKey}-card`} className="transition duration-200 ease-out">
            {renderChild}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black/50 p-4 transition-opacity duration-200">
          <div className="relative w-full max-w-6xl rounded-[28px] bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-gray-200 bg-white px-6 py-4">
              <div>
                <p className="text-sm text-gray-500">Fullscreen view</p>
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={`Download ${title} as PNG`}
                  onClick={() => downloadChart(true)}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Download PNG
                </button>
                <button
                  type="button"
                  aria-label={`Refresh ${title}`}
                  onClick={refreshChart}
                  className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Refresh
                </button>
                <button
                  ref={closeButtonRef}
                  type="button"
                  aria-label={`Close fullscreen ${title}`}
                  onClick={() => setIsExpanded(false)}
                  className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="p-6">
              <div ref={modalChartRef} className="w-full rounded-2xl bg-white p-4 shadow-inner">
                <div key={`${refreshKey}-modal`} className="min-h-[480px] transition duration-200 ease-out">
                  {renderChild}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ChartCard
