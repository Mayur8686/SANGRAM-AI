/**
 * Stream runner — the ONLY place battle pacing timers live.
 * ------------------------------------------------------------------
 * Frontend concern: reveal a finished, deterministic battle progressively.
 * It performs no fetching and fakes no network; it exists so a real
 * backend SSE/streaming source can drive the same UI state machine later
 * (see docs/BACKEND_CONTRACT.md — the callback contract is identical to
 * the event stream the backend will emit).
 *
 * State exposed through onUpdate():
 *   { phase, revealedCount, activeIndex, revealedText, synthElapsed }
 *
 *   phase: 'idle' | 'streaming' | 'between' | 'synthesizing' | 'done'
 */

const CHUNK_MS = 18 // tick interval
const CHARS_PER_TICK = 3 // fixed rate keeps the reveal calm and deterministic
const BETWEEN_MSG_MS = 420 // pause after a message completes
const SYNTH_MS = 1500

export function createBattleRunner(battle, { reducedMotion = false, onUpdate, onFinish } = {}) {
  const messages = battle?.messages || []
  const total = messages.length

  let state = { phase: 'idle', revealedCount: 0, activeIndex: -1, revealedText: '', synthElapsed: 0 }
  let charTimer = null
  let gapTimer = null
  let synthTimer = null
  let finished = false

  const push = (patch) => {
    state = { ...state, ...patch }
    if (onUpdate) onUpdate(state)
  }

  const clearAll = () => {
    if (charTimer) { clearInterval(charTimer); charTimer = null }
    if (gapTimer) { clearTimeout(gapTimer); gapTimer = null }
    if (synthTimer) { clearInterval(synthTimer); synthTimer = null }
  }

  const startSynthesis = () => {
    push({ phase: 'synthesizing', activeIndex: -1, revealedText: '', synthElapsed: 0 })
    synthTimer = setInterval(() => {
      const next = state.synthElapsed + 100
      push({ synthElapsed: next })
      if (next >= SYNTH_MS) finish()
    }, 100)
  }

  const finish = () => {
    if (finished) return
    finished = true
    clearAll()
    push({ phase: 'done', revealedCount: total, activeIndex: -1, revealedText: '' })
    if (onFinish) onFinish(battle)
  }

  const revealMessageInstantly = (idx) => {
    push({ revealedCount: idx + 1 })
  }

  const startMessage = (idx) => {
    if (finished) return
    const msg = messages[idx]
    if (!msg) { startSynthesis(); return }
    push({ phase: 'streaming', activeIndex: idx, revealedText: '' })

    if (reducedMotion) {
      // Reduced motion: no character animation, but stage order is preserved.
      push({ revealedText: msg.text })
      revealMessageInstantly(idx)
      gapTimer = setTimeout(() => startMessage(idx + 1), 160)
      return
    }

    let len = 0
    charTimer = setInterval(() => {
      len = Math.min(msg.text.length, len + CHARS_PER_TICK)
      push({ revealedText: msg.text.slice(0, len) })
      if (len >= msg.text.length) {
        clearInterval(charTimer)
        charTimer = null
        revealMessageInstantly(idx)
        gapTimer = setTimeout(() => startMessage(idx + 1), BETWEEN_MSG_MS)
      }
    }, CHUNK_MS)
  }

  return {
    start() {
      if (state.phase !== 'idle') return
      startMessage(0)
    },
    /** Skip typing animation for the current message only. */
    skipMessage() {
      const idx = state.activeIndex
      const msg = messages[idx]
      if (state.phase === 'streaming' && msg) {
        if (charTimer) { clearInterval(charTimer); charTimer = null }
        push({ revealedText: msg.text })
        revealMessageInstantly(idx)
        if (gapTimer) clearTimeout(gapTimer)
        gapTimer = setTimeout(() => startMessage(idx + 1), 120)
      }
    },
    /** Jump to completed battle + final answer immediately. */
    skipAll() {
      clearAll()
      push({ revealedCount: total })
      finish()
    },
    dispose: clearAll,
    getState: () => state
  }
}
