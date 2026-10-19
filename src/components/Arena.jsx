import React, { useEffect, useMemo, useRef, useState } from 'react'
import { accentVars } from '../data/models'
import { stages } from '../services/battleService'
import { createBattleRunner } from '../services/streamRunner'
import Timeline from './Timeline'
import { ModelIcon, IconCheck, IconSkip, IconArrowRight, IconInfo } from './Icons'

/**
 * The debate arena — one shared chronological timeline, never two chat
 * panes. All pacing flows through a single streamRunner instance so a
 * battle can never spawn duplicate timers; unmount disposes it cleanly.
 */
export default function Arena({ battle, selected, onComplete, onExit, onChangeFighters }) {
  const reducedMotion = useMemo(
    () => window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false,
    []
  )

  const [runState, setRunState] = useState({
    phase: 'idle',
    revealedCount: 0,
    activeIndex: -1,
    revealedText: '',
    synthElapsed: 0
  })
  const [announce, setAnnounce] = useState('')
  const listRef = useRef(null)
  const stickRef = useRef(true)
  const runnerRef = useRef(null)
  const completedRef = useRef(false)

  const messages = battle?.messages || []

  useEffect(() => {
    if (!battle) return
    completedRef.current = false
    const runner = createBattleRunner(battle, {
      reducedMotion,
      onUpdate: (st) => {
        setRunState(st)
        if (st.phase === 'streaming' && st.activeIndex >= 0) {
          const m = battle.messages[st.activeIndex]
          if (m && st.revealedText === '') {
            setAnnounce(`${m.modelName} begins ${m.stageLabel}, round 0${m.round} of 04.`)
          }
        } else if (st.phase === 'synthesizing') {
          setAnnounce('Debate rounds complete. Synthesis of the final answer in progress.')
        }
      },
      onFinish: (b) => {
        if (completedRef.current) return
        completedRef.current = true
        setAnnounce('Synthesis complete. Opening the final answer.')
        if (reducedMotion) onComplete(b)
        else setTimeout(() => onComplete(b), 850)
      }
    })
    runnerRef.current = runner
    runner.start()
    return () => {
      runner.dispose()
      runnerRef.current = null
    }
  }, [battle, reducedMotion, onComplete])

  // Auto-scroll only while the user is at/near the bottom — reading is never hijacked.
  const onListScroll = () => {
    const el = listRef.current
    if (!el) return
    stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 140
  }
  useEffect(() => {
    const el = listRef.current
    if (el && stickRef.current) el.scrollTop = el.scrollHeight
  }, [runState.revealedCount, runState.revealedText.length, runState.phase])

  if (!battle || !selected[0] || !selected[1]) {
    return (
      <main id="main" className="container fallback-wrap">
        <div className="fallback-card">
          <h1>No active battle</h1>
          <p>Select two AI models and enter a question to begin a debate.</p>
          <button type="button" className="btn-primary" onClick={onChangeFighters}>Configure matchup</button>
        </div>
      </main>
    )
  }

  const revealed = messages.slice(0, runState.revealedCount)
  const activeMsg = runState.phase === 'streaming' && runState.activeIndex >= 0 ? messages[runState.activeIndex] : null

  const activeRound = activeMsg?.round ?? (revealed.length ? revealed[revealed.length - 1].round : 1)
  const stageIdx = runState.phase === 'done' || runState.phase === 'synthesizing' ? 4 : Math.min(activeRound - 1, 4)
  const currentStage = stages[stageIdx]

  const progressPct = Math.round((runState.revealedCount / Math.max(1, messages.length)) * 100)
  const phaseText =
    runState.phase === 'synthesizing' || runState.phase === 'done'
      ? 'Stage 05 · Synthesizing'
      : `Stage 0${stageIdx + 1} of 05 · ${currentStage.label}`

  const skipAll = () => {
    stickRef.current = true
    runnerRef.current?.skipAll()
  }
  const skipMessage = () => runnerRef.current?.skipMessage()

  return (
    <main id="main" className="container arena-page">
      <p className="sr-only" role="status" aria-live="polite">{announce}</p>

      <header className="arena-head">
        <div className="arena-fighters">
          {[0, 1].map((slot) => {
            const m = selected[slot]
            const speaking = activeMsg && activeMsg.speaker === (slot === 0 ? 'A' : 'B')
            return (
              <div key={slot} className={`fighter-chip ${speaking ? 'speaking' : ''}`} style={accentVars(m)}>
                <ModelIcon id={m.id} size={30} />
                <div className="fighter-chip-text">
                  <span className="fighter-chip-slot">FIGHTER 0{slot + 1}</span>
                  <strong>{m.name}</strong>
                  <small>{m.provider} · {m.modelLabel}</small>
                </div>
                {speaking && <span className="fighter-chip-live" aria-hidden="true" />}
              </div>
            )
          })}
          <span className="arena-vs-mini" aria-hidden="true">VS</span>
        </div>

        <div className="arena-controls">
          <span className="demo-pill">
            <span className="demo-dot" aria-hidden="true" />
            Demo Mode · Simulated responses
          </span>
          <button type="button" className="btn-ghost" onClick={skipMessage} disabled={!activeMsg} title="Reveal the current message fully">
            <IconSkip size={13} /> Finish message
          </button>
          <button type="button" className="btn-ghost" onClick={skipAll}>
            <IconArrowRight size={13} /> Skip to results
          </button>
          <button type="button" className="btn-ghost danger" onClick={onExit}>Exit</button>
        </div>
      </header>

      <div className="arena-question" >
        <span className="aq-label">DEBATE QUESTION</span>
        <p className="aq-text">{battle.question}</p>
        <span className="aq-stage">{phaseText}</span>
      </div>

      <div className="arena-body">
        {/* Desktop: sticky stage rail */}
        <aside className="stage-rail" aria-label="Debate stages">
          <div className="rail-head">
            <h2>Debate stages</h2>
            <span className="rail-count" aria-hidden="true">{stageIdx + 1}/5</span>
          </div>
          <ol className="rail-list">
            {stages.map((s, i) => {
              const done = i < stageIdx || runState.phase === 'done'
              const active = i === stageIdx && runState.phase !== 'done'
              return (
                <li key={s.key} className={`rail-step ${done ? 'done' : ''} ${active ? 'active' : ''}`} aria-current={active ? 'step' : undefined}>
                  <span className="rail-node" aria-hidden="true">{done ? <IconCheck size={11} /> : `0${i + 1}`}</span>
                  <span className="rail-label">
                    <strong>{s.label}</strong>
                    <small>{i < 4 ? `Round 0${i + 1} · 2 turns` : 'One consolidated answer'}</small>
                  </span>
                </li>
              )
            })}
          </ol>
          <div className="rail-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressPct} aria-label="Timeline progress">
            <span style={{ width: `${progressPct}%` }} />
          </div>
          <p className="rail-note">
            <IconInfo size={12} />
            <span>Both fighters speak into one shared timeline; every counterargument addresses a named claim from the opposing side.</span>
          </p>
        </aside>

        {/* Mobile: compact horizontal stepper */}
        <nav className="m-stepper" aria-label="Debate stages">
          {stages.map((s, i) => {
            const done = i < stageIdx || runState.phase === 'done'
            const active = i === stageIdx && runState.phase !== 'done'
            return (
              <span key={s.key} className={`m-step ${done ? 'done' : ''} ${active ? 'active' : ''}`} aria-current={active ? 'step' : undefined}>
                {done ? <IconCheck size={10} /> : `0${i + 1}`}
                <em>{s.short}</em>
              </span>
            )
          })}
        </nav>

        <section className="arena-timeline-wrap" aria-label="Shared debate timeline">
          <div className="at-head">
            <h2>Shared debate timeline</h2>
            <span className="at-count">{runState.revealedCount} / {messages.length} turns</span>
          </div>

          <div className="at-scroll" ref={listRef} onScroll={onListScroll}>
            <Timeline
              messages={revealed}
              streamingMsg={activeMsg}
              streamingText={activeMsg ? runState.revealedText : null}
            />

            {runState.phase === 'synthesizing' && (
              <div className="synth-banner" role="status">
                <span className="synth-dots" aria-hidden="true"><i /><i /><i /></span>
                <div>
                  <strong>Stage 05 — Synthesis</strong>
                  <p>Distilling {messages.length} debate turns into one consolidated final answer…</p>
                </div>
              </div>
            )}
            {runState.phase === 'done' && (
              <div className="synth-banner ready" role="status">
                <span className="synth-check" aria-hidden="true"><IconCheck size={14} /></span>
                <div>
                  <strong>Synthesis complete</strong>
                  <p>All four rounds decided. Opening the final answer…</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
