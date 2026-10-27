import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import { safeArray, safeNumber } from '../lib/utils'

const COLORS = ['#06d6a0', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#ef4444']

/**
 * useDeferredMount — Custom hook that defers children rendering until the
 * container DOM element has valid (>0) dimensions. Uses ResizeObserver with
 * a requestAnimationFrame fallback. This permanently eliminates the
 * Recharts v3 "width(-1) and height(-1)" console warning.
 */
function useDeferredMount(ref) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Check immediately — if already has dimensions, mount now
    const { width, height } = el.getBoundingClientRect()
    if (width > 0 && height > 0) {
      setReady(true)
      return
    }

    // Otherwise, use ResizeObserver to wait for layout
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const rect = entry.contentRect
        if (rect.width > 0 && rect.height > 0) {
          setReady(true)
          observer.disconnect()
        }
      }
    })
    observer.observe(el)

    // Safety fallback: force mount after 300ms
    const timer = setTimeout(() => {
      setReady(true)
      observer.disconnect()
    }, 300)

    return () => {
      observer.disconnect()
      clearTimeout(timer)
    }
  }, [ref])

  return ready
}

/**
 * ChartWrapper — Provides consistent glassmorphism container with explicit height
 * and deferred ResponsiveContainer mounting to prevent Recharts dimension bugs.
 */
function ChartWrapper({ title, children, id }) {
  const containerRef = useRef(null)
  const ready = useDeferredMount(containerRef)

  return (
    <div id={id} className="glass-card p-5 space-y-4 min-w-0 animate-fade-in-up">
      <h3 className="text-sm font-semibold text-aura-300 tracking-wide">{title}</h3>
      <div
        ref={containerRef}
        style={{ width: '100%', height: 300, minWidth: 0 }}
      >
        {ready ? (
          <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 400, height: 300 }}>
            {children}
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-aura-600/30 border-t-aura-400 animate-spin" />
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * NoData — Elegant empty-state placeholder for charts.
 */
function NoData() {
  return (
    <div style={{ width: '100%', height: 300 }} className="flex flex-col items-center justify-center gap-3">
      <div className="w-12 h-12 rounded-full bg-aura-700/40 flex items-center justify-center">
        <svg className="w-6 h-6 text-aura-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6m6 0h6m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v10m6 0v-4a2 2 0 00-2-2h-2a2 2 0 00-2 2v4" />
        </svg>
      </div>
      <p className="text-sm text-aura-500 italic">No analytics data available</p>
    </div>
  )
}

/**
 * Custom tooltip styling for dark theme consistency.
 */
const tooltipStyle = {
  background: 'rgba(15, 23, 42, 0.95)',
  border: '1px solid rgba(51, 65, 85, 0.6)',
  borderRadius: '0.75rem',
  boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
  backdropFilter: 'blur(12px)',
}

export function MonthlyLeadsChart({ data }) {
  const safe = safeArray(data)
  if (safe.length === 0) {
    return (
      <div className="glass-card p-5 space-y-4 min-w-0 animate-fade-in-up">
        <h3 className="text-sm font-semibold text-aura-300 tracking-wide">Monthly Leads</h3>
        <NoData />
      </div>
    )
  }

  return (
    <ChartWrapper title="Monthly Leads" id="chart-monthly">
      <AreaChart data={safe} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="gradCyan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06d6a0" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#06d6a0" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: '#334155' }} tickLine={false} />
        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: '#334155' }} tickLine={false} allowDecimals={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: '#334155' }} />
        <Area type="monotone" dataKey="count" stroke="#06d6a0" strokeWidth={2.5} fill="url(#gradCyan)" dot={{ r: 3, fill: '#06d6a0', strokeWidth: 0 }} activeDot={{ r: 5, fill: '#06d6a0', stroke: '#0f172a', strokeWidth: 2 }} />
      </AreaChart>
    </ChartWrapper>
  )
}

export function LeadTypeChart({ data }) {
  const safe = safeArray(data)
  if (safe.length === 0) {
    return (
      <div className="glass-card p-5 space-y-4 min-w-0 animate-fade-in-up">
        <h3 className="text-sm font-semibold text-aura-300 tracking-wide">Lead Types</h3>
        <NoData />
      </div>
    )
  }

  return (
    <ChartWrapper title="Lead Types" id="chart-types">
      <PieChart>
        <Pie data={safe} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={55} paddingAngle={4} strokeWidth={0}>
          {safe.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
      </PieChart>
    </ChartWrapper>
  )
}

export function BudgetDistributionChart({ data }) {
  const safe = safeArray(data)
  if (safe.length === 0) {
    return (
      <div className="glass-card p-5 space-y-4 min-w-0 animate-fade-in-up">
        <h3 className="text-sm font-semibold text-aura-300 tracking-wide">Budget Distribution</h3>
        <NoData />
      </div>
    )
  }

  return (
    <ChartWrapper title="Budget Distribution" id="chart-budget">
      <BarChart data={safe} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.6} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="range" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: '#334155' }} tickLine={false} />
        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: '#334155' }} tickLine={false} allowDecimals={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(59, 130, 246, 0.08)' }} />
        <Bar dataKey="count" fill="url(#gradBlue)" radius={[6, 6, 0, 0]} maxBarSize={50} />
      </BarChart>
    </ChartWrapper>
  )
}

export function ScoreDistributionChart({ data }) {
  const safe = safeArray(data)
  if (safe.length === 0) {
    return (
      <div className="glass-card p-5 space-y-4 min-w-0 animate-fade-in-up">
        <h3 className="text-sm font-semibold text-aura-300 tracking-wide">Score Distribution</h3>
        <NoData />
      </div>
    )
  }

  const buckets = useMemo(() => {
    const result = [
      { range: '0–20', count: 0 },
      { range: '21–40', count: 0 },
      { range: '41–60', count: 0 },
      { range: '61–80', count: 0 },
      { range: '81–100', count: 0 },
    ]

    safe.forEach((item) => {
      const score = safeNumber(item?.lead_score)
      if (score <= 20) result[0].count++
      else if (score <= 40) result[1].count++
      else if (score <= 60) result[2].count++
      else if (score <= 80) result[3].count++
      else result[4].count++
    })

    return result
  }, [safe])

  return (
    <ChartWrapper title="Score Distribution" id="chart-score">
      <BarChart data={buckets} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="gradPurple" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#ec4899" stopOpacity={0.6} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="range" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: '#334155' }} tickLine={false} />
        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: '#334155' }} tickLine={false} allowDecimals={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(139, 92, 246, 0.08)' }} />
        <Bar dataKey="count" fill="url(#gradPurple)" radius={[6, 6, 0, 0]} maxBarSize={50} />
      </BarChart>
    </ChartWrapper>
  )
}
