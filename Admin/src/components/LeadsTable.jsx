import { useState, useMemo } from 'react'
import { safeArray, safeScore, safeBudget, safeString } from '../lib/utils'

/**
 * Lead type color badges (replaces the old status-based colors).
 * The Supabase table uses `lead_type` (Hot/Warm/Cold), not `status`.
 */
const TYPE_COLORS = {
  hot: 'bg-neon-red/15 text-neon-red',
  warm: 'bg-neon-amber/15 text-neon-amber',
  cold: 'bg-neon-blue/15 text-neon-blue',
}

function getTypeClasses(leadType) {
  const key = (leadType || '').toLowerCase()
  return TYPE_COLORS[key] || 'bg-aura-600/20 text-aura-400'
}

/**
 * Score badge color:
 *   >=85  → green (neon-cyan)
 *   >=70  → yellow (neon-amber)
 *   <70   → red (neon-red)
 */
function getScoreColor(score) {
  if (score >= 85) return 'text-neon-cyan'
  if (score >= 70) return 'text-neon-amber'
  return 'text-neon-red'
}

function getScoreBg(score) {
  if (score >= 85) return 'bg-neon-cyan/10'
  if (score >= 70) return 'bg-neon-amber/10'
  return 'bg-neon-red/10'
}

/** The columns we display and their sort keys. */
const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'lead_type', label: 'Lead Type' },
  { key: 'lead_score', label: 'Score' },
  { key: 'budget', label: 'Budget' },
  { key: 'lead_type_filter', label: 'Status' },
  { key: 'created_at', label: 'Created At' },
]

export default function LeadsTable({ data }) {
  const leads = safeArray(data)
  const [sortField, setSortField] = useState('created_at')
  const [sortDir, setSortDir] = useState('desc')
  const [filterType, setFilterType] = useState('all')
  const [page, setPage] = useState(0)
  const perPage = 10

  const filtered = useMemo(() => {
    let result = [...leads]

    // Filter by lead_type (Hot/Warm/Cold)
    if (filterType !== 'all') {
      result = result.filter((l) => safeString(l?.lead_type).toLowerCase() === filterType)
    }

    // Sort
    const field = sortField === 'lead_type_filter' ? 'lead_type' : sortField
    result.sort((a, b) => {
      let av = a?.[field] ?? ''
      let bv = b?.[field] ?? ''
      // Numeric sort for score
      if (field === 'lead_score') {
        av = safeScore(a, 0)
        bv = safeScore(b, 0)
      }
      if (sortDir === 'asc') return av > bv ? 1 : -1
      return av < bv ? 1 : -1
    })
    return result
  }, [leads, filterType, sortField, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paginated = filtered.slice(page * perPage, (page + 1) * perPage)

  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortField(field); setSortDir('asc') }
  }

  const filterOptions = ['all', 'hot', 'warm', 'cold']

  if (leads.length === 0) {
    return (
      <div id="leads-table" className="glass-card p-8 text-center animate-fade-in-up">
        <p className="text-aura-500 italic">No leads data available</p>
      </div>
    )
  }

  return (
    <div id="leads-table" className="glass-card overflow-hidden animate-fade-in-up">
      {/* Toolbar */}
      <div className="p-4 border-b border-aura-700/30 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-aura-300 tracking-wide">Recent Leads</h3>
        <div className="flex gap-2 flex-wrap">
          {filterOptions.map((s) => (
            <button key={s} onClick={() => { setFilterType(s); setPage(0) }}
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer
                ${filterType === s ? 'bg-neon-blue/20 text-neon-blue' : 'bg-aura-700/30 text-aura-400 hover:bg-aura-700/50'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-aura-700/30">
              {COLUMNS.map((col) => (
                <th key={col.key} onClick={() => handleSort(col.key)}
                  className="px-4 py-3 text-left text-xs font-semibold text-aura-500 uppercase tracking-wider cursor-pointer hover:text-aura-300 transition-colors select-none">
                  <span className="flex items-center gap-1">
                    {col.label}
                    {sortField === col.key && <span className="text-neon-blue">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((lead, i) => {
              const score = safeScore(lead, 0)
              const budget = safeBudget(lead, 'N/A')
              const leadType = safeString(lead?.lead_type, 'Unknown')

              return (
                <tr key={lead?.id || i} className="border-b border-aura-700/20 hover:bg-aura-700/20 transition-colors">
                  <td className="px-4 py-3 font-medium text-aura-200">{lead?.name || '-'}</td>
                  <td className="px-4 py-3 text-aura-400">{lead?.email || '-'}</td>
                  <td className="px-4 py-3 text-aura-400">{leadType}</td>

                  {/* Score — colored badge */}
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${getScoreColor(score)} ${getScoreBg(score)}`}>
                      {score > 0 ? score : 'N/A'}
                    </span>
                  </td>

                  {/* Budget — display the actual string from Supabase */}
                  <td className="px-4 py-3 text-aura-300 font-medium">{budget}</td>

                  {/* Lead type badge (replaces old status column) */}
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getTypeClasses(leadType)}`}>
                      {leadType}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-aura-500 text-xs">
                    {lead?.created_at ? new Date(lead.created_at).toLocaleDateString() : '-'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-aura-700/30 flex items-center justify-between">
        <p className="text-xs text-aura-500">{filtered.length} lead{filtered.length !== 1 ? 's' : ''} total</p>
        <div className="flex gap-2">
          <button disabled={page === 0} onClick={() => setPage(page - 1)}
            className="px-3 py-1 rounded-lg text-xs bg-aura-700/30 text-aura-400 hover:bg-aura-700/50 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors">
            Prev
          </button>
          <span className="px-3 py-1 text-xs text-aura-400">{page + 1} / {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}
            className="px-3 py-1 rounded-lg text-xs bg-aura-700/30 text-aura-400 hover:bg-aura-700/50 disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
