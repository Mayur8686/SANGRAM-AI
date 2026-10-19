import React, { useCallback, useEffect, useRef, useState } from 'react'
import { accentVars } from '../data/models'
import { buildShareText, encodeDemoState } from '../services/shareLink'
import { BrandLogo, ModelIcon, IconCopy, IconShare, IconPrint, IconArrowLeft, IconReset, IconCheck, IconInfo } from './Icons'

function verdictFor(score) {
  if (score >= 80) return 'Strong convergence — the fighters conceded most of the dispute.'
  if (score >= 65) return 'Partial convergence — core positions survived, emphasis differs.'
  return 'Contested — both sides kept defensible ground; read the timeline for the fault line.'
}

export default function Results({
  battle,
  selected,
  onViewDebate,
  onTryAnother,
  savedToHistory,
  fromHistory = false
}) {
  const [feedback, setFeedback] = useState(null)
  const fbTimer = useRef(null)
  const [revealed, setRevealed] = useState(false)
  const [manual, setManual] = useState(null)

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 60)
    return () => { clearTimeout(t); clearTimeout(fbTimer.current) }
  }, [])

  const say = useCallback((msg, kind = 'ok') => {
    setFeedback({ msg, kind })
    clearTimeout(fbTimer.current)
    fbTimer.current = setTimeout(() => setFeedback(null), 3400)
  }, [])

  if (!battle) {
    return (
      <main id="main" className="container fallback-wrap">
        <div className="fallback-card">
          <h1>Nothing to synthesize yet</h1>
          <p>Run a battle first — its final answer will appear here.</p>
          <button type="button" className="btn-primary" onClick={onTryAnother}>Configure a battle</button>
        </div>
      </main>
    )
  }

  const { question, finalAnswer, insights, agreement, roundSummaries, fighters } = battle
  const models = selected.filter(Boolean)

  /* ---- actions ---- */
  const fallbackCopy = (text) => {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      ta.remove()
      return ok
    } catch {
      return false
    }
  }

  const copyAnswer = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(`${question}\n\n${finalAnswer}`)
        say('Final answer copied to clipboard.')
      } else if (fallbackCopy(`${question}\n\n${finalAnswer}`)) {
        say('Final answer copied to clipboard.')
      } else {
        say('Copy blocked by the browser — select the answer text and copy manually.', 'err')
      }
    } catch {
      say('Copy failed — select the answer text and copy manually.', 'err')
    }
  }

  const share = async () => {
    const fighterNames = models.map((m) => m.name)
    const url = encodeDemoState({ question, modelIds: models.map((m) => m.id) })
    const text = buildShareText({ question, fighterNames, finalAnswer, shortUrl: url })
    if (navigator.share) {
      try {
        await navigator.share({ title: 'SANGRAM AI — debate result (simulated)', text, url: url || undefined })
        say('Shared via your system share sheet.')
        return
      } catch (err) {
        if (err?.name === 'AbortError') return // user cancelled — report nothing
        // fall through to copy
      }
    }
    const payload = url || text
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(payload)
      else if (!fallbackCopy(payload)) throw new Error('no-clipboard')
      say(url ? 'Share link copied — it re-runs this battle locally on the visitor’s device.' : 'Share text copied (link too long for a URL).')
    } catch {
      say('Sharing unavailable here — copy from the dialog shown below.', 'err')
      setManual(payload)
    }
  }

  const printPdf = () => window.print()

  return (
    <main id="main" className="container results-wrap">
      <div className={`results-reveal ${revealed ? 'in' : ''}`}>
        <header className="results-head">
          <p className="eyebrow"><span className="eyebrow-dot" aria-hidden="true" />SYNTHESIS COMPLETE</p>
          <h1>SANGRAM AI: FINAL ANSWER</h1>
          <p className="results-sub">Synthesized from the strongest insights of the debate.</p>
        </header>

        <div className="results-context" aria-label="Debate context">
          <div className="rc-question">
            <span className="rc-label">QUESTION</span>
            <p>{question}</p>
          </div>
          <div className="rc-fighters">
            <span className="rc-label">FIGHTERS</span>
            <div className="rc-chips">
              {models.map((m, i) => (
                <span key={m.id} className="rc-chip" style={accentVars(m)}>
                  <ModelIcon id={m.id} size={22} />
                  <b>{m.name}</b><small>0{i + 1}</small>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* The one consolidated answer */}
        <section className="final-card" aria-labelledby="final-h">
          <div className="final-card-head">
            <h2 id="final-h">Consolidated conclusion</h2>
            <span className="final-rounds">4 rounds · {battle.messages.length} turns</span>
          </div>
          <p className="final-body">{finalAnswer}</p>
          <p className="final-demo-tag">
            <IconInfo size={12} />
            Synthesized from local demonstration templates by the arena engine — not generated by live external model APIs.
          </p>
        </section>

        {/* Agreement meter */}
        <section className="agreement" aria-labelledby="agree-h">
          <div className="agree-head">
            <h2 id="agree-h">Agreement Score</h2>
            <span className="agree-badge">{agreement?.label || 'Demo agreement estimate'}</span>
          </div>
          <div className="agree-body">
            <div className="agree-meter" role="img" aria-label={`Demo agreement estimate: ${agreement?.score ?? 0} out of 100. ${verdictFor(agreement?.score ?? 0)}`}>
              <div className="agree-track">
                <span className="agree-fill" style={{ width: revealed ? `${agreement?.score ?? 0}%` : '0%' }} />
                <span className="agree-tick" style={{ left: '65%' }} aria-hidden="true" />
              </div>
              <span className="agree-score">{agreement?.score ?? 0}<i>/100</i></span>
            </div>
            <p className="agree-verdict">{verdictFor(agreement?.score ?? 0)}</p>
            <p className="agree-note">{agreement?.note}</p>
          </div>
        </section>

        {/* Supporting insights */}
        <section className="insights" aria-labelledby="ins-h">
          <h2 id="ins-h">What each fighter brought</h2>
          <div className="insight-row">
            {['a', 'b'].map((side, i) => {
              const m = models[i]
              return (
                <article key={side} className="insight" style={m ? accentVars(m) : undefined}>
                  <header>
                    {m && <ModelIcon id={m.id} size={26} />}
                    <span>
                      <small>FIGHTER 0{i + 1} CONTRIBUTION</small>
                      <strong>{m?.name || 'Model'}</strong>
                    </span>
                  </header>
                  <p>{insights?.[side] || 'No supporting insight recorded for this fighter.'}</p>
                </article>
              )
            })}
          </div>
        </section>

        {/* Actions */}
        <div className="results-actions no-print" role="group" aria-label="Final answer actions">
          <button type="button" className="btn-primary" onClick={copyAnswer}>
            <IconCopy size={15} /><span>Copy Answer</span>
          </button>
          <button type="button" className="btn-secondary" onClick={share}>
            <IconShare size={15} /><span>Share</span>
          </button>
          <button type="button" className="btn-secondary" onClick={printPdf}>
            <IconPrint size={15} /><span>Export as PDF</span>
          </button>
          <button type="button" className="btn-secondary" onClick={onViewDebate}>
            <span>View Full Debate</span><IconArrowLeft size={14} style={{ transform: 'rotate(180deg)' }} />
          </button>
          <button type="button" className="btn-ghost" onClick={onTryAnother}>
            <IconReset size={14} /><span>Try Another Battle</span>
          </button>
        </div>

        <p className="results-saved" role="status">
          <IconCheck size={12} />
          {fromHistory
            ? 'Reopened from your local history — stored in this browser only.'
            : savedToHistory
              ? 'This battle was saved to your local history (this browser only).'
              : 'History storage unavailable in this browser — this result will not persist after reload.'}
        </p>

        {feedback && (
          <p className={`results-feedback ${feedback.kind}`} role="status">{feedback.msg}</p>
        )}
        {manual && (
          <div className="manual-share">
            <label htmlFor="manual-share-input">Copy this share text manually:</label>
            <textarea id="manual-share-input" readOnly value={manual} onFocus={(e) => e.target.select()} rows={4} />
          </div>
        )}
      </div>

      {/* Print / PDF surface — rendered for print media only */}
      <div className="print-sheet" aria-hidden="true">
        <div className="print-brand">
          <BrandLogo size="sm" />
          <span>Different Minds. One Arena. · Simulated demo battle</span>
        </div>
        <h1>Final Answer</h1>
        <p className="print-q"><strong>Question:</strong> {question}</p>
        <p className="print-fighters"><strong>Fighters:</strong> {models.map((m) => `${m.name} (${m.provider})`).join('  vs  ')}</p>
        <h2>Consolidated conclusion</h2>
        <p>{finalAnswer}</p>
        <h2>Debate summary ({agreement?.label || 'Demo estimate'}: {agreement?.score}/100)</h2>
        <ol>
          {(roundSummaries || []).map((r, i) => <li key={i}><strong>Round 0{i + 1}:</strong> {r}</li>)}
        </ol>
        <h2>Supporting perspectives</h2>
        {models.map((m, i) => (
          <p key={m.id}><strong>{m.name}:</strong> {insights?.[i === 0 ? 'a' : 'b']}</p>
        ))}
        <p className="print-foot">Generated by the SANGRAM AI frontend prototype using deterministic local simulation. No live model APIs were contacted.</p>
      </div>
    </main>
  )
}
