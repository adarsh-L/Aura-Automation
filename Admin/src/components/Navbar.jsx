import { useState } from 'react'

/**
 * Navbar — Top navigation bar with sidebar toggle, search, and action buttons.
 *
 * @param {{ onToggleSidebar: () => void }} props
 */
export default function Navbar({ onToggleSidebar }) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="h-16 bg-aura-800/40 backdrop-blur-xl border-b border-aura-700/40 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
      {/* Left — Hamburger + Title */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          id="navbar-hamburger"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 -ml-1 rounded-lg hover:bg-aura-700/40 transition-colors cursor-pointer"
          aria-label="Open sidebar"
        >
          <svg className="w-5 h-5 text-aura-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h2 className="text-lg font-semibold text-aura-100 tracking-tight">Dashboard</h2>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neon-cyan/10 text-neon-cyan text-[11px] font-semibold uppercase tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse-glow" />
          Live
        </span>
      </div>

      {/* Center — Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-aura-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            id="navbar-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads, campaigns..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-aura-700/40 border border-aura-600/30 text-sm text-aura-200 placeholder:text-aura-500
                       focus:outline-none focus:ring-2 focus:ring-neon-blue/30 focus:border-neon-blue/40 transition-all duration-200"
          />
        </div>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notification Bell */}
        <button
          id="navbar-notifications"
          className="relative p-2 rounded-lg hover:bg-aura-700/40 transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <svg className="w-5 h-5 text-aura-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-neon-pink animate-pulse-glow" />
        </button>

        {/* Refresh */}
        <button
          id="navbar-refresh"
          className="p-2 rounded-lg hover:bg-aura-700/40 transition-colors cursor-pointer"
          aria-label="Refresh"
          onClick={() => window.location.reload()}
        >
          <svg className="w-5 h-5 text-aura-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        {/* Date */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-aura-700/30 border border-aura-600/20">
          <svg className="w-4 h-4 text-aura-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs text-aura-400 font-medium">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>
    </header>
  )
}
