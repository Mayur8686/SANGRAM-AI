/**
 * Debate history — local-only persistence for completed demo battles.
 * ------------------------------------------------------------------
 * Everything stored here lives in the visitor's browser under a single
 * key. It never leaves the machine, contains no credentials, and is
 * clearly surfaced in the UI as locally stored demo sessions.
 *
 * A future backend can adopt the same record shape for a /history API —
 * see docs/BACKEND_CONTRACT.md.
 */

const KEY = 'sangram-ai.history.v1'
const MAX_ENTRIES = 12
const MAX_TEXT = 4000 // hard cap so a corrupted/oversized write can't brick storage

const safeGet = () => {
  try {
    return window.localStorage.getItem(KEY)
  } catch {
    return null
  }
}

const safeSet = (value) => {
  try {
    window.localStorage.setItem(KEY, value)
    return true
  } catch {
    return false
  }
}

const truncate = (s, n) => {
  if (typeof s !== 'string') return ''
  return s.length > n ? s.slice(0, n) : s
}

/** Validates one parsed record; returns null when unusable. */
function normalizeEntry(raw) {
  if (!raw || typeof raw !== 'object') return null
  const { question, fighters, messages, finalAnswer } = raw
  if (!Array.isArray(fighters) || fighters.length !== 2) return null
  if (!Array.isArray(messages) || messages.length === 0) return null
  if (typeof question !== 'string' || !question.trim()) return null
  if (typeof finalAnswer !== 'string' || !finalAnswer.trim()) return null

  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : `h-${Date.now().toString(36)}`,
    savedAt: typeof raw.savedAt === 'number' && Number.isFinite(raw.savedAt) ? raw.savedAt : Date.now(),
    completed: raw.completed === true,
    question: truncate(question.trim(), 1000),
    fighters: fighters.map((f, i) => ({
      slot: i,
      modelId: typeof f?.modelId === 'string' ? f.modelId : 'unknown',
      name: truncate(f?.name, 60) || 'Unknown model',
      provider: truncate(f?.provider, 40) || '—',
      modelLabel: truncate(f?.modelLabel, 40) || ''
    })),
    messages: messages.slice(0, 40).map((m, i) => ({
      id: truncate(m?.id, 20) || `m${i + 1}`,
      round: Number.isFinite(m?.round) ? m.round : 1,
      stageLabel: truncate(m?.stageLabel, 40) || '',
      speaker: m?.speaker === 'B' ? 'B' : 'A',
      modelId: truncate(m?.modelId, 20) || 'unknown',
      modelName: truncate(m?.modelName, 40) || 'Model',
      provider: truncate(m?.provider, 40) || '',
      modelLabel: truncate(m?.modelLabel, 40) || '',
      text: truncate(m?.text, MAX_TEXT),
      challenges: m?.challenges || null,
      contention: typeof m?.contention === 'string' ? truncate(m.contention, 400) : null,
      converging: Boolean(m?.converging)
    })),
    roundSummaries: Array.isArray(raw.roundSummaries)
      ? raw.roundSummaries.slice(0, 6).map((s) => truncate(s, 400))
      : [],
    finalAnswer: truncate(finalAnswer, MAX_TEXT),
    insights: {
      a: truncate(raw?.insights?.a, MAX_TEXT),
      b: truncate(raw?.insights?.b, MAX_TEXT)
    },
    agreement:
      raw?.agreement && Number.isFinite(raw.agreement.score)
        ? {
            score: Math.max(0, Math.min(100, Math.round(raw.agreement.score))),
            note: truncate(raw.agreement.note, 600),
            label: truncate(raw.agreement.label, 60) || 'Demo agreement estimate',
            demo: true
          }
        : null,
    source: raw?.source === 'local-mock' || !raw?.source ? 'local-mock' : truncate(raw.source, 20)
  }
}

export function loadHistory() {
  const raw = safeGet()
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map(normalizeEntry).filter(Boolean)
  } catch {
    // Corrupt storage must never crash the app — self-heal silently.
    try {
      window.localStorage.removeItem(KEY)
    } catch {
      /* ignore */
    }
    return []
  }
}

export function saveBattleToHistory(battle) {
  if (!battle || !Array.isArray(battle.messages) || battle.messages.length === 0) return null
  const entry = normalizeEntry({
    id: `h-${Date.now().toString(36)}`,
    savedAt: Date.now(),
    completed: true,
    question: battle.question,
    fighters: battle.fighters,
    messages: battle.messages,
    roundSummaries: battle.roundSummaries,
    finalAnswer: battle.finalAnswer,
    insights: battle.insights,
    agreement: battle.agreement,
    source: battle.source
  })
  if (!entry) return null
  const next = [entry, ...loadHistory()].slice(0, MAX_ENTRIES)
  const ok = safeSet(JSON.stringify(next))
  return ok ? entry : null
}

export function deleteHistoryEntry(id) {
  const next = loadHistory().filter((e) => e.id !== id)
  safeSet(JSON.stringify(next))
  return next
}

export function clearHistory() {
  try {
    window.localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}

/** Human relative label for saved history cards (genuinely elapsed time). */
export function relativeSavedLabel(ts) {
  if (!Number.isFinite(ts)) return ''
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hr${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
