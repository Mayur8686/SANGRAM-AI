import React from 'react'
import Timeline from './Timeline'
import { ModelIcon, IconArrowRight, IconInfo } from './Icons'
import { accentVars } from '../data/models'

/**
 * Full-transcript view: the finished shared timeline, preserved exactly as
 * it streamed — used after a battle and when reopening from local history.
 */
export default function CompletedDebate({ battle, selected, onBackToResults, onNewBattle, fromHistory }) {
  if (!battle) {
    return (
      <main id="main" className="container fallback-wrap">
        <div className="fallback-card">
          <h1>No transcript to show</h1>
          <p>This debate is not in memory. Start a new battle to produce one.</p>
          <button type="button" className="btn-primary" onClick={onNewBattle}>Configure a battle</button>
        </div>
      </main>
    )
  }

  return (
    <main id="main" className="container debate-wrap">
      <header className="debate-head">
        <div>
          <p className="eyebrow">COMPLETE TRANSCRIPT</p>
          <h1>Full debate timeline</h1>
          <p className="debate-sub">
            {battle.messages.length} turns · 4 rounds · one consolidated answer — preserved in chronological order.
          </p>
        </div>
        {battle.finalAnswer && (
          <button type="button" className="btn-primary" onClick={onBackToResults}>
            <span>Back to final answer</span>
            <IconArrowRight size={15} />
          </button>
        )}
      </header>

      {fromHistory && (
        <p className="history-banner">
          <IconInfo size={13} />
          <span>Reopened from your local history — a stored demo session, read-only.</span>
        </p>
      )}

      <section className="debate-matchup" aria-label="Matchup">
        {[0, 1].map((slot) => {
          const m = selected[slot]
          if (!m) return null
          return (
            <div key={slot} className="fighter-chip" style={accentVars(m)}>
              <ModelIcon id={m.id} size={28} />
              <div className="fighter-chip-text">
                <span className="fighter-chip-slot">FIGHTER 0{slot + 1}</span>
                <strong>{m.name}</strong>
                <small>{m.provider} · {m.modelLabel}</small>
              </div>
            </div>
          )
        })}
      </section>

      <div className="arena-question">
        <span className="aq-label">DEBATE QUESTION</span>
        <p className="aq-text">{battle.question}</p>
        <span className="aq-stage">Demo Mode · Simulated responses</span>
      </div>

      <section className="timeline-panel" aria-label="Shared debate timeline">
        <Timeline messages={battle.messages} />
      </section>
    </main>
  )
}
