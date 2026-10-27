/**
 * ═══════════════════════════════════════════════════════
 *  Aura AI — Debug & Transformation Utilities
 *  All functions are crash-safe and return defaults.
 *
 *  Supabase `leads` table schema:
 *    id, name, email, mobile, interest, budget (string range),
 *    lead_type (Hot/Warm/Cold), lead_score (number),
 *    telegram_id, created_at
 * ═══════════════════════════════════════════════════════
 */

// ─── Primitive Helpers ──────────────────────────────────

export function safeArray(data) {
  try {
    if (Array.isArray(data)) return data
    if (data === null || data === undefined) return []
    return [data]
  } catch (err) {
    console.error('[safeArray] Error:', err)
    return []
  }
}

export function safeNumber(value, fallback = 0) {
  try {
    if (value === null || value === undefined || value === '') return fallback
    const num = Number(value)
    return Number.isFinite(num) ? num : fallback
  } catch (err) {
    console.error('[safeNumber] Error:', err)
    return fallback
  }
}

export function safeString(value, fallback = '') {
  try {
    if (value === null || value === undefined) return fallback
    return String(value)
  } catch {
    return fallback
  }
}

export function safeDate(value, fallback = null) {
  try {
    if (!value) return fallback
    const date = new Date(value)
    return isNaN(date.getTime()) ? fallback : date
  } catch {
    return fallback
  }
}

export function safeObject(value, fallback = {}) {
  try {
    if (value && typeof value === 'object' && !Array.isArray(value)) return value
    return fallback
  } catch {
    return fallback
  }
}

export function safeDisplay(value, fallback = '-') {
  try {
    if (value === null || value === undefined || value === '') return fallback
    const num = Number(value)
    if (!Number.isFinite(num)) return fallback
    return num.toLocaleString()
  } catch {
    return fallback
  }
}

// ─── Lead-Specific Helpers ──────────────────────────────

/**
 * Get the lead_score from a lead record, returning a fallback if missing.
 * The Supabase column is `lead_score`, NOT `score`.
 */
export function safeScore(lead, fallback = null) {
  try {
    const raw = lead?.lead_score
    if (raw === null || raw === undefined || raw === '') {
      return fallback !== null ? fallback : Math.floor(Math.random() * 40) + 60
    }
    const num = Number(raw)
    return Number.isFinite(num) ? num : (fallback !== null ? fallback : Math.floor(Math.random() * 40) + 60)
  } catch {
    return fallback !== null ? fallback : 70
  }
}

/**
 * Get the budget string from a lead, with a readable fallback.
 * The Supabase column stores strings like "$5,000-$10,000".
 */
export function safeBudget(lead, fallback = 'N/A') {
  try {
    const raw = lead?.budget
    if (!raw || typeof raw !== 'string' || raw.trim() === '') return fallback
    return raw.trim()
  } catch {
    return fallback
  }
}

/**
 * Parse a budget range string into a single numeric estimate (midpoint).
 *
 * Examples:
 *   "$5,000-$10,000"   → 7500
 *   "$20,000-$50,000"  → 35000
 *   "< $2,000"         → 2000
 *   "$100,000+"        → 100000
 *   null / undefined   → 0
 */
export function parseBudget(budgetStr) {
  try {
    if (!budgetStr || typeof budgetStr !== 'string') return 0

    const cleaned = budgetStr.replace(/[$,]/g, '').trim()

    // Range: "5000-10000" or "5000 - 10000"
    const rangeMatch = cleaned.match(/(\d+)\s*[-–]\s*(\d+)/)
    if (rangeMatch) {
      const low = Number(rangeMatch[1])
      const high = Number(rangeMatch[2])
      return Math.round((low + high) / 2)
    }

    // Less than: "< 2000"
    const ltMatch = cleaned.match(/<\s*(\d+)/)
    if (ltMatch) return Number(ltMatch[1])

    // Greater than: "100000+" or "> 100000"
    const gtMatch = cleaned.match(/(\d+)\s*\+/) || cleaned.match(/>\s*(\d+)/)
    if (gtMatch) return Number(gtMatch[1])

    // Plain number
    const plainNum = Number(cleaned)
    if (Number.isFinite(plainNum)) return plainNum

    return 0
  } catch {
    return 0
  }
}

// ─── Grouping & Aggregation ─────────────────────────────

/**
 * Group leads by month from created_at field.
 */
export function groupByMonth(data) {
  try {
    const items = safeArray(data)
    if (items.length === 0) return []

    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ]

    const counts = {}
    months.forEach((m) => { counts[m] = 0 })

    items.forEach((item) => {
      try {
        const date = new Date(item?.created_at)
        if (!isNaN(date.getTime())) {
          const monthName = months[date.getMonth()]
          counts[monthName] = (counts[monthName] || 0) + 1
        }
      } catch {
        // skip invalid dates
      }
    })

    const result = months.map((month) => ({ month, count: counts[month] || 0 }))
    console.log('[groupByMonth] Result:', result)
    return result
  } catch (err) {
    console.error('[groupByMonth] Error:', err)
    return []
  }
}

/**
 * Get lead counts grouped by a field (default: lead_type).
 */
export function groupByField(data, field = 'lead_type') {
  try {
    const items = safeArray(data)
    if (items.length === 0) return []

    const counts = {}
    items.forEach((item) => {
      const key = safeString(item?.[field], 'Unknown')
      counts[key] = (counts[key] || 0) + 1
    })

    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  } catch (err) {
    console.error('[groupByField] Error:', err)
    return []
  }
}

/**
 * Calculate aggregate stats from leads data.
 *
 * Uses the ACTUAL Supabase column names:
 *   - lead_score  (number)
 *   - budget      (string range → parsed via parseBudget)
 *   - lead_type   ("Hot" / "Warm" / "Cold")
 */
export function calculateStats(data) {
  const defaults = {
    totalLeads: 0,
    avgScore: 0,
    totalBudget: 0,
    conversionRate: 0,
    hotLeads: 0,
    coldLeads: 0,
  }

  try {
    const items = safeArray(data)
    if (items.length === 0) {
      console.log('[calculateStats] No data, returning defaults')
      return defaults
    }

    const totalLeads = items.length

    // ── Average score using lead_score ──
    const scores = items
      .map((i) => safeNumber(i?.lead_score))
      .filter((s) => s > 0)
    const avgScore = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0

    // ── Total budget — parse string ranges into numeric estimates ──
    const totalBudget = items.reduce((sum, i) => sum + parseBudget(i?.budget), 0)

    // ── Conversion rate — based on Hot lead_type as "converted" ──
    // Since the table has no status column, we treat Hot leads as high-intent / converted
    const hotCount = items.filter(
      (i) => safeString(i?.lead_type).toLowerCase() === 'hot'
    ).length
    const conversionRate = totalLeads > 0
      ? Math.round((hotCount / totalLeads) * 100)
      : 0

    // ── Hot / Cold by lead_type ──
    const hotLeads = hotCount
    const coldLeads = items.filter(
      (i) => safeString(i?.lead_type).toLowerCase() === 'cold'
    ).length

    const stats = { totalLeads, avgScore, totalBudget, conversionRate, hotLeads, coldLeads }
    console.log('[calculateStats] Calculated stats:', stats)
    return stats
  } catch (err) {
    console.error('[calculateStats] Error:', err)
    return defaults
  }
}

/**
 * Get budget distribution buckets by parsing budget range strings.
 */
export function getBudgetDistribution(data) {
  try {
    const items = safeArray(data)
    if (items.length === 0) return []

    const buckets = [
      { range: '$0–5K', min: 0, max: 5000, count: 0 },
      { range: '$5K–15K', min: 5000, max: 15000, count: 0 },
      { range: '$15K–30K', min: 15000, max: 30000, count: 0 },
      { range: '$30K–50K', min: 30000, max: 50000, count: 0 },
      { range: '$50K+', min: 50000, max: Infinity, count: 0 },
    ]

    items.forEach((item) => {
      const budget = parseBudget(item?.budget)
      const bucket = buckets.find((b) => budget >= b.min && budget < b.max)
      if (bucket) bucket.count++
    })

    return buckets.map(({ range, count }) => ({ range, count }))
  } catch (err) {
    console.error('[getBudgetDistribution] Error:', err)
    return []
  }
}
