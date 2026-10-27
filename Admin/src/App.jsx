import { useState, useCallback } from 'react'
import ErrorBoundary from './components/ErrorBoundary'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'

/**
 * App — Root layout with responsive sidebar + navbar + content area.
 * Wraps everything in ErrorBoundary for crash safety.
 */
export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), [])
  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen bg-aura-900 text-aura-100">
        {/* ── Sidebar ── */}
        <Sidebar open={sidebarOpen} onClose={closeSidebar} />

        {/* ── Main Area ── */}
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar onToggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto">
            <Dashboard />
          </main>
        </div>
      </div>
    </ErrorBoundary>
  )
}
