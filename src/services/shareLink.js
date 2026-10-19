/**
 * Shareable demo links — compact, safe, honest.
 * ------------------------------------------------------------------
 * There is no backend, so nothing can be "uploaded" for others to view.
 * What IS genuinely shareable is the deterministic input of a battle:
 * (question + the two model ids). Because the mock engine is fully
 * deterministic, the same input reproduces the same debate on any
 * machine running this app — the link therefore re-runs the battle
 * locally for the visitor instead of pointing at a fake hosted record.
 *
 * Rules enforced here:
 *  • Only { q, a, b } goes in the URL — no transcript, no keys, no
 *    personal data, nothing secret.
 *  • The fragment is capped; an over-long payload degrades to a plain
 *    "copy text" share instead of producing an absurd URL.
 *
 * A real product adds a backend `POST /debates {…} -> { slug }` step.
 * The integration boundary is documented in docs/BACKEND_CONTRACT.md.
 */

const MAX_URL_CHARS = 1900

const enc = (s) => btoa(String.fromCharCode(...new TextEncoder().encode(s)))
  .replaceAll('+', '-')
  .replaceAll('/', '_')
  .replace(/=+$/, '')

const dec = (s) => {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/')
  const pad = b64 + '='.repeat((4 - (b64.length % 4)) % 4)
  const bytes = Uint8Array.from(atob(pad), (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

/** Returns a compact payload string, or null when it would be too large. */
export function encodeDemoState({ question, modelIds }) {
  if (!question || !Array.isArray(modelIds) || modelIds.length !== 2) return null
  const payload = {
    q: question.slice(0, 1000),
    a: modelIds[0],
    b: modelIds[1]
  }
  let encoded
  try {
    encoded = enc(JSON.stringify(payload))
  } catch {
    return null
  }
  const url = `${location.origin}${location.pathname}#demo=${encoded}`
  return url.length > MAX_URL_CHARS ? null : url
}

/** Parses ?#demo=... from a hash. Returns { question, modelIds } or null. */
export function decodeDemoHash(hash) {
  try {
    const match = /#demo=([A-Za-z0-9\-_]+)/.exec(hash || '')
    if (!match) return null
    const parsed = JSON.parse(dec(match[1]))
    if (typeof parsed?.q !== 'string' || !parsed.q.trim()) return null
    if (typeof parsed.a !== 'string' || typeof parsed.b !== 'string') return null
    return { question: parsed.q.trim().slice(0, 1000), modelIds: [parsed.a, parsed.b] }
  } catch {
    return null // any malformed link is simply ignored
  }
}

export function clearDemoHash() {
  try {
    history.replaceState(null, '', location.pathname + location.search)
  } catch {
    /* ignore */
  }
}

/** Plain-text share body (fallback when no URL / no Web Share). */
export function buildShareText({ question, fighterNames, finalAnswer, shortUrl }) {
  const parts = [
    'SANGRAM AI — simulated debate (demo)',
    `Question: ${question}`,
    `Fighters: ${fighterNames.join(' vs ')}`,
    shortUrl ? `Replay this debate: ${shortUrl}` : null,
    '',
    finalAnswer
  ].filter(Boolean)
  return parts.join('\n')
}
