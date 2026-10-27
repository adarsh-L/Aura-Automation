import { useState } from 'react'

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z" />
      </svg>
    ),
  },
  {
    label: 'Leads',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: 'Analytics',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6m6 0h6m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v10m6 0v-4a2 2 0 00-2-2h-2a2 2 0 00-2 2v4" />
      </svg>
    ),
  },
  {
    label: 'Campaigns',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
  },
  {
    label: 'Settings',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

/**
 * Sidebar — Responsive navigation drawer.
 * Desktop: fixed 260px sidebar. Mobile: slide-in overlay with backdrop.
 *
 * @param {{ open: boolean, onClose: () => void }} props
 */
export default function Sidebar({ open, onClose }) {
  const [activeItem, setActiveItem] = useState('Dashboard')

  const handleNav = (label) => {
    setActiveItem(label)
    onClose?.() // close mobile drawer on nav
  }

  return (
    <>
      {/* ── Mobile backdrop ── */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar panel ── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-[260px] bg-aura-800/80 backdrop-blur-2xl border-r border-aura-700/50 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-aura-700/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center shadow-lg shadow-neon-cyan/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-aura-100 tracking-tight">Aura AI</h1>
              <p className="text-[11px] text-aura-500 font-medium tracking-wide uppercase">Lead Management</p>
            </div>
            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden ml-auto p-1.5 rounded-lg hover:bg-aura-700/40 transition-colors cursor-pointer"
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5 text-aura-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <p className="px-3 mb-3 text-[10px] font-semibold text-aura-500 uppercase tracking-widest">Menu</p>
          {NAV_ITEMS.map((item) => {
            const isActive = activeItem === item.label
            return (
              <button
                key={item.label}
                id={`sidebar-${item.label.toLowerCase()}`}
                onClick={() => handleNav(item.label)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer
                  ${isActive
                    ? 'bg-neon-blue/10 text-neon-blue shadow-sm'
                    : 'text-aura-400 hover:text-aura-200 hover:bg-aura-700/40'
                  }`}
              >
                <span className={isActive ? 'text-neon-blue' : 'text-aura-500'}>{item.icon}</span>
                {item.label}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse-glow" />
                )}
              </button>
            )
          })}
        </nav>

        {/* Bottom user section */}
        <div className="px-4 py-5 border-t border-aura-700/40">
          <div className="glass-card p-4 space-y-3" style={{ transform: 'none' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center text-xs font-bold text-white">
                A
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-aura-200 truncate">Admin</p>
                <p className="text-[11px] text-aura-500 truncate">admin@aura.ai</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
