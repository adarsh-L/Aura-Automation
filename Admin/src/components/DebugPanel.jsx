import { useState, useMemo } from 'react'
import { safeArray } from '../lib/utils'

/**
 * DebugPanel — Dev-only diagnostics panel.
 * Shows: record counts, loading/error state, environment validation,
 * Supabase connection status, and raw data preview.
 * Only renders when import.meta.env.DEV is true.
 */
export default function DebugPanel({ data, loading, error }) {
  if (!import.meta.env.DEV) return null

  const [expanded, setExpanded] = useState(false)
  const items = safeArray(data)

  const envStatus = useMemo(() => {
    const url = import.meta.env.VITE_SUPABASE_URL || ''
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY || ''
    return {
      urlValid: url.length > 10 && url.startsWith('https://') && !url.includes('placeholder') && !url.includes('your-project'),
      keyValid: key.length > 20 && !key.includes('placeholder') && !key.includes('your-anon'),
      url: url.slice(0, 40) + (url.length > 40 ? '...' : ''),
      key: key.slice(0, 20) + '***',
    }
  }, [])

  // Dashboard audit log
  if (typeof console.group === 'function') {
    console.group('🔍 Dashboard Audit')
    console.log('Total records:', items.length)
    console.log('Loading:', loading)
    console.log('Error:', error || 'None')
    console.log('Env URL valid:', envStatus.urlValid)
    console.log('Env Key valid:', envStatus.keyValid)
    console.groupEnd()
  }

  return (
    <div id="debug-panel" className="glass-card p-5 space-y-4 animate-fade-in-up border border-neon-amber/20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-neon-amber/15 text-neon-amber text-[10px] font-bold uppercase tracking-wider">
            Dev
          </span>
          <h3 className="text-sm font-semibold text-aura-300">Debug Panel</h3>
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="px-3 py-1 rounded-lg text-xs bg-aura-700/30 text-aura-400 hover:bg-aura-700/50 transition-colors cursor-pointer"
        >
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-aura-700/30">
          <p className="text-[10px] text-aura-500 uppercase tracking-wider mb-1">Records</p>
          <p className="text-lg font-bold text-aura-200">{items.length}</p>
        </div>
        <div className="p-3 rounded-lg bg-aura-700/30">
          <p className="text-[10px] text-aura-500 uppercase tracking-wider mb-1">Loading</p>
          <p className="text-lg font-bold text-aura-200">{loading ? '⏳' : '✅'}</p>
        </div>
        <div className="p-3 rounded-lg bg-aura-700/30">
          <p className="text-[10px] text-aura-500 uppercase tracking-wider mb-1">Error</p>
          <p className="text-lg font-bold text-aura-200">{error ? '❌' : '✅'}</p>
        </div>
        <div className="p-3 rounded-lg bg-aura-700/30">
          <p className="text-[10px] text-aura-500 uppercase tracking-wider mb-1">Supabase</p>
          <p className="text-lg font-bold text-aura-200">{envStatus.urlValid && envStatus.keyValid ? '🟢' : '🔴'}</p>
        </div>
      </div>

      {/* Expanded sections */}
      {expanded && (
        <div className="space-y-4">
          {/* Environment Validation */}
          <div className="p-4 rounded-lg bg-aura-900/60 space-y-2">
            <p className="text-[10px] text-aura-500 uppercase tracking-wider font-semibold">Environment</p>
            <div className="space-y-1.5 text-xs font-mono">
              <p className={envStatus.urlValid ? 'text-neon-cyan' : 'text-neon-red'}>
                {envStatus.urlValid ? '✅' : '❌'} VITE_SUPABASE_URL: {envStatus.url}
              </p>
              <p className={envStatus.keyValid ? 'text-neon-cyan' : 'text-neon-red'}>
                {envStatus.keyValid ? '✅' : '❌'} VITE_SUPABASE_ANON_KEY: {envStatus.key}
              </p>
            </div>
            {(!envStatus.urlValid || !envStatus.keyValid) && (
              <p className="text-[11px] text-neon-amber mt-2">
                ⚠️ Set valid Supabase credentials in your <code className="px-1 py-0.5 rounded bg-aura-700/50">.env</code> file to connect to live data.
              </p>
            )}
          </div>

          {/* Raw Data Preview */}
          <div>
            <p className="text-[10px] text-aura-500 uppercase tracking-wider mb-2">Raw Data (first 3)</p>
            <pre className="p-3 rounded-lg bg-aura-900/60 text-[11px] text-aura-400 font-mono overflow-x-auto max-h-48 overflow-y-auto">
              {JSON.stringify(items.slice(0, 3), null, 2) || 'No data'}
            </pre>
          </div>

          {/* Error Details */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20">
              <p className="text-xs text-red-400 font-mono break-all">{String(error)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
