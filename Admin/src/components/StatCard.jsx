import { safeDisplay } from '../lib/utils'

const ICON_MAP = {
  leads: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  score: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  budget: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  conversion: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  hot: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    </svg>
  ),
  cold: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  ),
}

const COLOR_MAP = {
  cyan: { bg: 'bg-neon-cyan/10', text: 'text-neon-cyan', glow: 'glow-cyan' },
  blue: { bg: 'bg-neon-blue/10', text: 'text-neon-blue', glow: 'glow-blue' },
  purple: { bg: 'bg-neon-purple/10', text: 'text-neon-purple', glow: 'glow-purple' },
  pink: { bg: 'bg-neon-pink/10', text: 'text-neon-pink', glow: 'glow-pink' },
  amber: { bg: 'bg-neon-amber/10', text: 'text-neon-amber', glow: '' },
  red: { bg: 'bg-neon-red/10', text: 'text-neon-red', glow: '' },
}

export default function StatCard({ label = 'Metric', value, icon = 'leads', color = 'cyan', suffix = '', prefix = '', trend = '', trendUp = true, delay = 0 }) {
  const colors = COLOR_MAP[color] || COLOR_MAP.cyan
  const iconSvg = ICON_MAP[icon] || ICON_MAP.leads
  const displayValue = safeDisplay(value)

  return (
    <div className={`glass-card p-5 ${colors.glow} animate-fade-in-up min-w-0 overflow-hidden`} style={{ animationDelay: `${delay * 100}ms` }}>
      <div className="flex items-start justify-between gap-2 min-w-0">
        <div className="space-y-3 min-w-0 flex-1">
          <p className="text-xs font-semibold text-aura-500 uppercase tracking-wider">{label}</p>
          <p className="text-2xl sm:text-3xl xl:text-xl 2xl:text-3xl font-extrabold text-aura-100 tracking-tight">{prefix}{displayValue}{suffix}</p>
          {trend && (
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-semibold ${trendUp ? 'text-neon-cyan' : 'text-neon-red'}`}>{trendUp ? '↑' : '↓'} {trend}</span>
              <span className="text-[11px] text-aura-500">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl shrink-0 ${colors.bg}`}>
          <div className={colors.text}>{iconSvg}</div>
        </div>
      </div>
    </div>
  )
}
