import React, { useEffect, useState } from 'react'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light')
    setTheme(initialTheme)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    window.localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gray-50 text-gray-900 dark:bg-slate-950 dark:text-slate-100">
      <Dashboard theme={theme} toggleTheme={toggleTheme} />
    </div>
  )
}
