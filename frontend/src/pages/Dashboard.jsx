import React, { useEffect, useState } from 'react'
import * as api from '../services/analyticsApi'
import * as studentApi from '../services/studentApi'
import FilterBar from '../components/FilterBar'
import KPICard from '../components/KPICard'
import GenderChart from '../components/GenderChart'
import RaceChart from '../components/RaceChart'
import LunchChart from '../components/LunchChart'
import TestPrepChart from '../components/TestPrepChart'
import ParentEducationChart from '../components/ParentEducationChart'
import ScoreDistributionChart from '../components/ScoreDistributionChart'
import TopPerformersTable from '../components/TopPerformersTable'
import InsightsCard from '../components/InsightsCard'
import ExportButtons from '../components/ExportButtons'
import AddStudentModal from '../components/AddStudentModal'
import Card from '../components/Card'

const Dashboard = ({ theme, toggleTheme }) => {
  const [overview, setOverview] = useState(null)
  const [gender, setGender] = useState([])
  const [race, setRace] = useState([])
  const [lunch, setLunch] = useState([])
  const [testPrep, setTestPrep] = useState([])
  const [parentEdu, setParentEdu] = useState([])
  const [topPerformers, setTopPerformers] = useState([])
  const [scoreDist, setScoreDist] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({})
  const [activeChartFilter, setActiveChartFilter] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [submittingStudent, setSubmittingStudent] = useState(false)

  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [ov, g, r, l, tp, pe, tpers, sd] = await Promise.all([
        api.getOverview(filters),
        api.getGenderAnalysis(filters),
        api.getRaceAnalysis(filters),
        api.getLunchAnalysis(filters),
        api.getTestPrepAnalysis(filters),
        api.getParentEducationAnalysis(filters),
        api.getTopPerformers(filters),
        api.getScoreDistribution(filters),
      ])

      setOverview(ov.data)
      setGender(g.data)
      setRace(r.data)
      setLunch(l.data)
      setTestPrep(tp.data)
      setParentEdu(pe.data)
      setTopPerformers(tpers.data)
      setScoreDist(sd.data)
      setLastUpdated(new Date())
    } catch (err) {
      console.error(err)
      setError('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [filters, refreshTrigger])

  const handleStudentAdded = async (studentData) => {
    try {
      setSubmittingStudent(true)
      await studentApi.addStudent(studentData)
      setToastMessage('Student added successfully')
      setIsAddModalOpen(false)
      setRefreshTrigger((prev) => prev + 1)
    } catch (err) {
      console.error(err)
      setToastMessage(err.response?.data?.message || 'Failed to add student')
    } finally {
      setSubmittingStudent(false)
    }
  }

  useEffect(() => {
    if (!toastMessage) return
    const timer = setTimeout(() => setToastMessage(''), 4000)
    return () => clearTimeout(timer)
  }, [toastMessage])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="rounded-lg bg-red-50 border border-red-200 p-6 text-red-800">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6 dark:bg-slate-900 dark:border-slate-700">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Student Analytics Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1 dark:text-slate-300">Performance insights powered by ClickHouse</p>
            <p className="text-xs text-gray-500 mt-2 dark:text-slate-400">
              Last Updated: {lastUpdated.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white text-xl text-gray-700 shadow-sm transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <ExportButtons filters={filters} />
          </div>
        </div>
      </div>
      {toastMessage && (
        <div className="fixed right-6 top-28 z-30 rounded-2xl bg-slate-900 px-5 py-3 text-sm text-white shadow-xl dark:bg-slate-800">
          {toastMessage}
        </div>
      )}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleStudentAdded}
        submitting={submittingStudent}
      />

      {/* Sticky Filter Bar */}
      <FilterBar filters={filters} onFiltersChange={setFilters} onAddStudent={() => setIsAddModalOpen(true)} />

      {/* Main Content */}
      <div className="px-6 py-6 space-y-6">
        {/* KPI Section - Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                <div className="h-8 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          /* KPI Cards */
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <KPICard
              title="Total Students"
              value={overview?.total_students || 0}
              icon="students"
              subtitle="All Students"
            />
            <KPICard
              title="Avg Math Score"
              value={overview?.avg_math_score?.toFixed(1) || 0}
              icon="math"
              subtitle="Across cohort"
            />
            <KPICard
              title="Avg Reading Score"
              value={overview?.avg_reading_score?.toFixed(1) || 0}
              icon="reading"
              subtitle="Across cohort"
            />
            <KPICard
              title="Avg Writing Score"
              value={overview?.avg_writing_score?.toFixed(1) || 0}
              icon="writing"
              subtitle="Across cohort"
            />
            <KPICard
              title="Test Prep Completed"
              value={overview?.completed_test_prep || 0}
              icon="testprep"
              subtitle="Students"
            />
          </section>
        )}

        {/* Charts Grid - 2 Columns */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm h-80 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
                <div className="h-full bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GenderChart data={gender} activeFilter={activeChartFilter} setActiveFilter={setActiveChartFilter} />
            <ScoreDistributionChart data={scoreDist} activeFilter={activeChartFilter} setActiveFilter={setActiveChartFilter} />
            <RaceChart data={race} activeFilter={activeChartFilter} setActiveFilter={setActiveChartFilter} />
            <ParentEducationChart data={parentEdu} activeFilter={activeChartFilter} setActiveFilter={setActiveChartFilter} />
            <LunchChart data={lunch} activeFilter={activeChartFilter} setActiveFilter={setActiveChartFilter} />
            <TestPrepChart data={testPrep} activeFilter={activeChartFilter} setActiveFilter={setActiveChartFilter} />
          </section>
        )}

        {/* Top Performers Table */}
        {!loading && <TopPerformersTable data={topPerformers} />}

        {/* Insights Section */}
        <InsightsCard filters={filters} refreshTrigger={refreshTrigger} />
      </div>
    </div>
  )
}

export default Dashboard
