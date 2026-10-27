import { useState, useEffect, useMemo, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import {
  safeArray, calculateStats, groupByMonth,
  groupByField, getBudgetDistribution,
} from '../lib/utils'
import StatCard from '../components/StatCard'
import { MonthlyLeadsChart, LeadTypeChart, BudgetDistributionChart, ScoreDistributionChart } from '../components/Charts'
import LeadsTable from '../components/LeadsTable'
import DebugPanel from '../components/DebugPanel'

/**
 * Dashboard — Main analytics page.
 * Fetches leads from Supabase and renders stat cards, charts, table, and debug panel.
 */
export default function Dashboard() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ── Fetch Leads ──
  const fetchLeads = useCallback(async () => {
    try {
      console.log('[Dashboard] Fetching leads from Supabase...')
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) {
        console.error('[Dashboard] Supabase error:', fetchError)
        setError(fetchError.message || 'Failed to fetch leads')
        setLeads([])
        return
      }

      console.log('Fetched leads:', data)
      setLeads(safeArray(data))
    } catch (err) {
      console.error('[Dashboard] Unexpected error:', err)
      setError(err?.message || 'An unexpected error occurred')
      setLeads([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  // ── Data Transformations (all crash-safe + memoized) ──
  const stats = useMemo(() => {
    try {
      const result = calculateStats(leads)
      console.log('Calculated stats:', result)
      return result
    } catch (err) {
      console.error('[Dashboard] Stats calculation error:', err)
      return { totalLeads: 0, avgScore: 0, totalBudget: 0, conversionRate: 0, hotLeads: 0, coldLeads: 0 }
    }
  }, [leads])

  const monthlyData = useMemo(() => {
    try {
      const result = groupByMonth(leads)
      console.log('Monthly data:', result)
      return result
    } catch (err) {
      console.error('[Dashboard] Monthly grouping error:', err)
      return []
    }
  }, [leads])

  const leadTypes = useMemo(() => {
    try { return groupByField(leads, 'lead_type') }
    catch { return [] }
  }, [leads])

  const budgetDist = useMemo(() => {
    try { return getBudgetDistribution(leads) }
    catch { return [] }
  }, [leads])

  // ── Loading State ──
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full border-[3px] border-neon-blue/30 border-t-neon-blue animate-spin" />
          <p className="text-sm text-aura-400 font-medium">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  // ── Error State ──
  if (error && leads.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh] p-6">
        <div className="glass-card p-8 max-w-md w-full text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-neon-red/10 flex items-center justify-center">
            <svg className="w-7 h-7 text-neon-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-aura-200">Failed to load data</h3>
          <p className="text-sm text-aura-400 leading-relaxed">{error}</p>
          <button onClick={fetchLeads}
            className="px-5 py-2.5 rounded-lg bg-neon-blue/20 text-neon-blue text-sm font-semibold hover:bg-neon-blue/30 transition-all duration-200 cursor-pointer">
            Retry
          </button>
        </div>
      </div>
    )
  }

  // ── Empty State ──
  if (leads.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh] p-6">
        <div className="glass-card p-8 max-w-md w-full text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-neon-purple/10 flex items-center justify-center">
            <svg className="w-7 h-7 text-neon-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-aura-200">No leads yet</h3>
          <p className="text-sm text-aura-400 leading-relaxed">Your leads will appear here once they start coming in.</p>
        </div>
      </div>
    )
  }

  // ── Main Dashboard ──
  return (
    <div className="p-4 sm:p-6 space-y-6 min-w-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-aura-100 tracking-tight">Overview</h1>
        <p className="text-sm text-aura-500 mt-1">Real-time insights from your AI lead pipeline</p>
      </div>

      {/* Stat Cards — responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Total Leads" value={stats.totalLeads} icon="leads" color="cyan" trend="+12%" trendUp delay={0} />
        <StatCard label="Avg Score" value={stats.avgScore} icon="score" color="blue" suffix="/100" delay={1} />
        <StatCard label="Total Budget" value={stats.totalBudget} icon="budget" color="purple" prefix="$" delay={2} />
        <StatCard label="Conversion" value={stats.conversionRate} icon="conversion" color="pink" suffix="%" trend="+5%" trendUp delay={3} />
        <StatCard label="Hot Leads" value={stats.hotLeads} icon="hot" color="amber" delay={4} />
        <StatCard label="Cold Leads" value={stats.coldLeads} icon="cold" color="red" delay={5} />
      </div>

      {/* Charts Grid — min-w-0 prevents flex overflow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
        <MonthlyLeadsChart data={monthlyData} />
        <LeadTypeChart data={leadTypes} />
        <BudgetDistributionChart data={budgetDist} />
        <ScoreDistributionChart data={leads} />
      </div>

      {/* Leads Table */}
      <LeadsTable data={leads} />

      {/* Debug Panel (dev only) */}
      <DebugPanel data={leads} loading={loading} error={error} />
    </div>
  )
}
