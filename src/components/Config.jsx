import React, { useEffect, useMemo, useRef, useState } from 'react'
import { models, examplePrompts, accentVars } from '../data/models'
import {
  ModelIcon,
  IconCheck,
  IconArrowRight,
  IconStepSelect,
  IconAlert,
  IconLightning
} from './Icons'
import { DiagnosticsPanel } from './ErrorStates'

const MAX_LEN = 1000
const MIN_LEN = 10

/**
 * Configuration: fighter slots (FIGHTER 01 — VS — FIGHTER 02), shared
 * model catalog, question input. Duplicate selection is impossible by
 * design: catalog entries already assigned are shown as occupied and
 * cannot take the opposing slot.
 */
export default function Config({
  selected,
  setSelected,
  question,
  setQuestion,
  onStart,
  starting,
  fatalError,
  onDismissFatal,
  sharePrefilled
}) {
  const [notice, setNotice] = useState('')
  const [touched, setTouched] = useState(false)
  const [activeSlot, setActiveSlot] = useState(() => (!selected[0] ? 0 : !selected[1] ? 1 : 0))
  const textareaRef = useRef(null)
  const startGuard = useRef(false)

  // Autofocus the question only when fighters are already chosen — never
  // steal focus mid-selection, never on touch-first-load contexts.
  useEffect(() => {
    const wideViewport = window.matchMedia?.('(min-width: 768px)')?.matches ?? true
    if (selected[0] && selected[1] && !question && textareaRef.current && wideViewport) {
      textareaRef.current.focus({ preventScroll: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const assign = (model, slot) => {
    const other = slot === 0 ? 1 : 0
    if (selected[other]?.id === model.id) {
      setNotice(`${model.name} already holds FIGHTER 0${other + 1}. Every battle needs two different models — pick another, or use “Change” on Fighter 0${other + 1}.`)
      return
    }
    setNotice('')
    const next = [...selected]
    next[slot] = model
    setSelected(next)
    if (slot === 0 && !next[1]) setActiveSlot(1)
    if (slot === 1 && !next[0]) setActiveSlot(0)
  }

  const handleCatalog = (model) => {
    const slot0 = selected[0]?.id === model.id
    const slot1 = selected[1]?.id === model.id
    if (slot0 || slot1) {
      setActiveSlot(slot0 ? 1 : 0)
      setNotice(`${model.name} is already FIGHTER 0${slot0 ? '1' : '2'}. Choose a different model for Fighter 0${slot0 ? '2' : '1'}.`)
      return
    }
    const target = !selected[0] ? 0 : !selected[1] ? 1 : activeSlot
    assign(model, target)
  }

  const clearSlot = (slot) => {
    setNotice('')
    const next = [...selected]
    next[slot] = null
    setSelected(next)
    setActiveSlot(slot)
  }

  const trimmedLen = question.trim().length
  const modelsReady = Boolean(selected[0] && selected[1] && selected[0].id !== selected[1].id)
  const questionValid = trimmedLen >= MIN_LEN && question.length <= MAX_LEN
  const canStart = modelsReady && questionValid && !starting

  const start = () => {
    if (!canStart || startGuard.current) return
    startGuard.current = true
    onStart()
    setTimeout(() => { startGuard.current = false }, 400)
  }

  const onKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      start()
    }
  }

  const validation = useMemo(() => {
    if (!modelsReady) {
      const n = (selected[0] ? 1 : 0) + (selected[1] ? 1 : 0)
      return { level: 'pending', msg: `Select two different models — ${n} of 2 selected.` }
    }
    if (!touched && trimmedLen === 0) return { level: 'pending', msg: 'Enter a question for the arena (minimum 10 characters).' }
    if (trimmedLen === 0) return { level: 'error', msg: 'A question is required before the battle can start.' }
    if (trimmedLen < MIN_LEN) return { level: 'warn', msg: `Add ${MIN_LEN - trimmedLen} more character${MIN_LEN - trimmedLen === 1 ? '' : 's'} — the question needs at least ${MIN_LEN}.` }
    return { level: 'ok', msg: `Ready: ${selected[0].name} vs ${selected[1].name}.` }
  }, [modelsReady, selected, trimmedLen, touched])

  return (
    <main id="main" className="container config-wrap">
      <header className="config-head">
        <p className="eyebrow">MATCHUP CONFIGURATION</p>
        <h1>Choose Your Fighters</h1>
        <p className="config-sub">Two models. Different perspectives. One arena.</p>
      </header>

      {sharePrefilled && (
        <div className="share-banner" role="status">
          <IconLightning size={14} />
          <span>
            Demo link detected — fighters and question pre-filled from a shared link. The debate re-runs the local
            simulated engine on this device; nothing was loaded from a server.
          </span>
          <button type="button" className="share-banner-x" onClick={() => window.history.replaceState(null, '', window.location.pathname)} aria-label="Dismiss">✕</button>
        </div>
      )}

      {/* Fighter slots */}
      <section className="slots-section" aria-label="Selected fighters">
        <div className="slots">
          <FighterSlot slot={0} model={selected[0]} onClear={clearSlot} />
          <div className="vs-divider" aria-hidden="true"><span>VS</span></div>
          <FighterSlot slot={1} model={selected[1]} onClear={clearSlot} />
        </div>
        {notice && (
          <p className="notice-msg" role="alert">
            <IconAlert size={14} />
            <span>{notice}</span>
          </p>
        )}
      </section>

      {/* Shared catalog */}
      <section className="catalog" aria-labelledby="catalog-h">
        <div className="catalog-header">
          <h2 id="catalog-h">Model Catalog</h2>
          <span className="catalog-note">Simulated profiles · select two distinct models</span>
        </div>
        <div className="catalog-grid">
          {models.map((m) => {
            const assigned = selected[0]?.id === m.id ? 'FIGHTER 01' : selected[1]?.id === m.id ? 'FIGHTER 02' : null
            const conflict = Boolean(assigned)
            return (
              <button
                key={m.id}
                type="button"
                className={`mcard ${assigned ? 'occupied' : ''}`}
                style={accentVars(m)}
                onClick={() => handleCatalog(m)}
                aria-pressed={Boolean(assigned)}
                aria-label={
                  assigned
                    ? `${m.name} by ${m.provider}. Currently assigned to ${assigned}. Selecting again will not change this; use Change on that slot.`
                    : `${m.name} by ${m.provider}, ${m.modelLabel}. Assign to ${!selected[0] ? 'Fighter 01' : !selected[1] ? 'Fighter 02' : `Fighter 0${activeSlot + 1}`}.`
                }
              >
                <span className="mcard-top">
                  <ModelIcon id={m.id} size={38} />
                  <span className="mcard-title">
                    <strong>{m.name}</strong>
                    <small>{m.provider} · {m.modelLabel}</small>
                  </span>
                </span>
                <span className="mcard-desc">{m.desc}</span>
                <span className={`mcard-foot ${assigned ? 'ok' : ''}`}>
                  {assigned ? (
                    <><IconCheck size={13} /><span>Selected · {assigned}</span></>
                  ) : (
                    <span>Assign to {!selected[0] ? 'Fighter 01' : !selected[1] ? 'Fighter 02' : `Fighter 0${activeSlot + 1}`} <IconArrowRight size={13} /></span>
                  )}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Question */}
      <section className="question-section" aria-labelledby="question-h" onKeyDown={onKeyDown}>
        <div className="question-head">
          <div>
            <h2 id="question-h">What Should They Battle Over?</h2>
            <p>A technical, strategic or open-ended question both models will argue through four rounds.</p>
          </div>
        </div>

        <label className="sr-only" htmlFor="battle-question">Debate question</label>
        <div className={`textarea-wrap ${touched && validation.level === 'error' ? 'invalid' : ''}`}>
          <textarea
            id="battle-question"
            ref={textareaRef}
            value={question}
            onChange={(e) => { setQuestion(e.target.value.slice(0, MAX_LEN)); if (!touched) setTouched(true) }}
            onBlur={() => setTouched(true)}
            placeholder="Ask anything. Let the AI models challenge each other's reasoning..."
            maxLength={MAX_LEN}
            rows={5}
            aria-describedby="question-help question-count"
            aria-invalid={touched && validation.level === 'error' ? true : undefined}
          />
          <div className="textarea-foot">
            <span id="question-help">Ctrl + Enter to start · minimum {MIN_LEN} characters</span>
            <span id="question-count" className={`counter ${question.length > 900 ? 'warn' : ''}`} aria-live="off">
              {question.length} / {MAX_LEN}
            </span>
          </div>
        </div>

        <div className="chips" role="group" aria-label="Example questions">
          <span className="chips-label">Examples:</span>
          {examplePrompts.map((p) => (
            <button
              key={p}
              type="button"
              className={`chip ${question === p ? 'active' : ''}`}
              onClick={() => { setQuestion(p); setTouched(true) }}
            >
              {p}
            </button>
          ))}
        </div>

        {fatalError && (
          <div className="notice-msg fatal">
            <IconAlert size={14} />
            <span>{fatalError}</span>
            <button type="button" className="share-banner-x" onClick={onDismissFatal} aria-label="Dismiss error">✕</button>
          </div>
        )}

        <div className="start-bar">
          <p className={`val-status ${validation.level}`} aria-live="polite">
            {validation.level === 'ok' && <IconCheck size={14} />}
            {(validation.level === 'error' || validation.level === 'warn') && <IconAlert size={14} />}
            <span>{validation.msg}</span>
          </p>
          <button type="button" className="btn-primary btn-lg start-battle-btn" disabled={!canStart} onClick={start} aria-disabled={!canStart}>
            <span>{starting ? 'Preparing…' : 'Start Battle'}</span>
            <IconArrowRight size={16} />
          </button>
        </div>
      </section>

      <DiagnosticsPanel />
    </main>
  )
}

function FighterSlot({ slot, model, onClear }) {
  const label = `FIGHTER 0${slot + 1}`
  return (
    <div className={`slot ${model ? 'filled' : 'empty'}`} style={model ? accentVars(model) : undefined}>
      <div className="slot-head">
        <span className="slot-label">{label}</span>
        {model ? (
          <span className="slot-badge ready"><IconCheck size={11} />Selected</span>
        ) : (
          <span className="slot-badge">Awaiting selection</span>
        )}
      </div>

      {model ? (
        <div className="slot-body chosen">
          <ModelIcon id={model.id} size={44} />
          <span className="slot-info">
            <strong>{model.name}</strong>
            <small>{model.provider} · {model.modelLabel}</small>
            <small className="slot-api">{model.apiModel ? `API id: ${model.apiModel}` : 'API id: not connected (simulation)'}</small>
          </span>
          <button type="button" className="btn-ghost slot-change" onClick={() => onClear(slot)}>
            Change
          </button>
        </div>
      ) : (
        <div className="slot-body awaiting">
          <span className="slot-empty-icon" aria-hidden="true"><IconStepSelect size={17} /></span>
          <span className="slot-info">
            <strong>Select {slot === 0 ? 'first' : 'second'} model</strong>
            <small>Pick {slot === 0 ? 'a fighter' : 'a different fighter'} from the catalog below</small>
          </span>
        </div>
      )}
    </div>
  )
}
