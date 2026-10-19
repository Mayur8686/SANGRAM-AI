import { useEffect, useState, useRef } from 'react'
import './styles/global.css'
import './App.css'
import { models, examplePrompts } from './data/models'
import { generateBattle, stages } from './services/battleService'
import {
  BrandLogo,
  ModelIcon,
  IconCompare,
  IconChallenge,
  IconSynthesize,
  IconStepSelect,
  IconStepQuestion,
  IconStepBattle,
  IconStepAnswer,
  IconArrowRight,
  IconArrowLeft,
  IconCheck,
  IconCopy,
  IconReset,
  IconReplyTarget,
  IconMenu
} from './components/Icons'

function Navbar({ view, setView }) {
  const [open, setOpen] = useState(false)

  const navigate = (targetView, sectionSelector) => {
    setOpen(false)
    if (targetView === 'landing' && sectionSelector) {
      setView('landing')
      setTimeout(() => {
        document.querySelector(sectionSelector)?.scrollIntoView({ behavior: 'smooth' })
      }, 60)
    } else {
      setView(targetView)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <header className="nav">
      <div className="container nav-inner">
        <button
          type="button"
          onClick={() => navigate('landing')}
          className="nav-logo-btn"
          aria-label="SANGRAM AI Home"
        >
          <BrandLogo />
        </button>

        <nav className={`nav-links ${open ? 'open' : ''}`} aria-label="Main navigation">
          <a
            href="#benefits"
            onClick={(e) => {
              e.preventDefault()
              navigate('landing', '#benefits')
            }}
          >
            Why Sangram
          </a>
          <a
            href="#how"
            onClick={(e) => {
              e.preventDefault()
              navigate('landing', '#how')
            }}
          >
            How It Works
          </a>
          <a
            href="#models"
            onClick={(e) => {
              e.preventDefault()
              navigate('landing', '#models')
            }}
          >
            Models
          </a>
          <button
            type="button"
            className="btn-primary nav-enter-btn"
            onClick={() => navigate('config')}
          >
            <span>Enter the Arena</span>
            <IconArrowRight size={15} />
          </button>
        </nav>

        <div className="nav-mobile-actions">
          <button
            type="button"
            className="hamburger"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={open}
          >
            <IconMenu open={open} size={20} />
          </button>
        </div>
      </div>
    </header>
  )
}

function Hero({ setView }) {
  const previewA = models[0] // ChatGPT
  const previewB = models[2] // Claude

  return (
    <section id="home" className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            <span>DIFFERENT MINDS. ONE ARENA.</span>
          </div>
          <h1>What Happens When AI Challenges AI?</h1>
          <p className="hero-sub">
            Choose your AI models. Watch them challenge each other's reasoning. Get one consolidated final answer.
          </p>
          <div className="hero-actions">
            <button
              type="button"
              className="btn-primary"
              onClick={() => setView('config')}
            >
              <span>Enter the Arena</span>
              <IconArrowRight size={16} />
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() =>
                document.querySelector('#how')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              <span>How It Works</span>
            </button>
          </div>
          <div className="hero-proto-note">
            <span className="proto-indicator" aria-hidden="true" />
            <span>
              Frontend prototype — simulated multi-model debate using local demonstration data.
            </span>
          </div>
        </div>

        <div className="arena-visual" aria-label="AI Debate Arena Architecture">
          <div className="arena-visual-header">
            <span className="arena-visual-title">ARENA DEBATE TOPOLOGY</span>
            <span className="arena-stage-pill">ARGUE → CHALLENGE → SYNTHESIZE</span>
          </div>

          <div className="arena-visual-body">
            {/* Two Distinct Model Cards + Central VS */}
            <div className="arena-combatants">
              <div className="arena-fighter-card fighter-a">
                <div className="arena-fighter-top">
                  <span className="fighter-slot-tag">FIGHTER 01</span>
                  <span className="fighter-status-dot active-cyan" />
                </div>
                <div className="arena-fighter-main">
                  <ModelIcon id={previewA.id} color={previewA.color} size={36} />
                  <div>
                    <div className="arena-fighter-name">{previewA.name}</div>
                    <div className="arena-fighter-meta">
                      {previewA.provider} • {previewA.model}
                    </div>
                  </div>
                </div>
                <div className="arena-fighter-stance">
                  <span className="stance-label">OPENING THESIS</span>
                  <p>Prioritizes foundational readability and cross-domain versatility.</p>
                </div>
              </div>

              <div className="arena-vs-column" aria-hidden="true">
                <div className="arena-vs-line" />
                <div className="arena-vs-node">VS</div>
                <div className="arena-vs-line" />
              </div>

              <div className="arena-fighter-card fighter-b">
                <div className="arena-fighter-top">
                  <span className="fighter-slot-tag">FIGHTER 02</span>
                  <span className="fighter-status-dot active-blue" />
                </div>
                <div className="arena-fighter-main">
                  <ModelIcon id={previewB.id} color={previewB.color} size={36} />
                  <div>
                    <div className="arena-fighter-name">{previewB.name}</div>
                    <div className="arena-fighter-meta">
                      {previewB.provider} • {previewB.model}
                    </div>
                  </div>
                </div>
                <div className="arena-fighter-stance">
                  <span className="stance-label">COUNTER-THESIS</span>
                  <p>Challenges abstract breadth with immediate execution feedback loops.</p>
                </div>
              </div>
            </div>

            {/* SVG Connection Schematic */}
            <div className="arena-schematic" aria-hidden="true">
              <svg className="schematic-svg" viewBox="0 0 400 44" preserveAspectRatio="none">
                <path
                  d="M90 2 V18 Q90 26 98 26 H192 Q200 26 200 34 V42"
                  fill="none"
                  stroke="#00D9FF"
                  strokeWidth="1.5"
                  strokeOpacity="0.65"
                />
                <path
                  d="M310 2 V18 Q310 26 302 26 H208 Q200 26 200 34 V42"
                  fill="none"
                  stroke="#4388FF"
                  strokeWidth="1.5"
                  strokeOpacity="0.65"
                />
                <circle cx="90" cy="4" r="3" fill="#00D9FF" />
                <circle cx="310" cy="4" r="3" fill="#4388FF" />
                <circle cx="200" cy="26" r="4" fill="#0E213A" stroke="#00D9FF" strokeWidth="1.5" />
              </svg>
              <div className="schematic-rounds">
                <span>R1: Opening</span>
                <span>R2: Counter</span>
                <span>R3: Rebuttal</span>
                <span>R4: Convergence</span>
              </div>
            </div>

            {/* Consolidated Synthesis Output Node */}
            <div className="arena-synthesis-node">
              <div className="synthesis-node-head">
                <span className="synthesis-node-tag">CONSOLIDATED OUTPUT</span>
                <span className="synthesis-node-meta">4 Rounds Verified in Shared Timeline</span>
              </div>
              <p className="synthesis-node-text">
                One structured conclusion distilled from the strongest surviving arguments of both models.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Landing({ setView }) {
  const benefits = [
    {
      id: 'compare',
      title: 'Compare Perspectives',
      desc: 'Two different models examine one question.',
      icon: <IconCompare size={20} />
    },
    {
      id: 'challenge',
      title: 'Challenge Arguments',
      desc: 'A shared timeline shows counterarguments and rebuttals.',
      icon: <IconChallenge size={20} />
    },
    {
      id: 'synthesize',
      title: 'Synthesize Insights',
      desc: 'One consolidated answer presents the strongest useful conclusions.',
      icon: <IconSynthesize size={20} />
    }
  ]

  const processSteps = [
    {
      step: '01',
      label: 'SELECT',
      desc: 'Choose two AI models.',
      icon: <IconStepSelect size={18} />
    },
    {
      step: '02',
      label: 'QUESTION',
      desc: 'Enter your question.',
      icon: <IconStepQuestion size={18} />
    },
    {
      step: '03',
      label: 'BATTLE',
      desc: 'Follow opening arguments, counterarguments, rebuttals, and final discussion.',
      icon: <IconStepBattle size={18} />
    },
    {
      step: '04',
      label: 'SYNTHESIZE',
      desc: 'Receive one consolidated final answer.',
      icon: <IconStepAnswer size={18} />
    }
  ]

  return (
    <main>
      {/* 2. Hero and arena visualization */}
      <Hero setView={setView} />

      {/* 3. Three concise product benefits */}
      <section id="benefits" className="section-benefits">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">STRUCTURED REASONING</span>
            <h2>Built for adversarial clarity</h2>
            <p>
              Instead of reading isolated responses side by side, watch two distinct models test each other's logic in a single arena.
            </p>
          </div>
          <div className="benefit-grid">
            {benefits.map((b) => (
              <article key={b.id} className="benefit-card">
                <div className="benefit-icon">{b.icon}</div>
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How It Works */}
      <section id="how" className="section-how">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">DEBATE PROTOCOL</span>
            <h2>How It Works</h2>
            <p>
              A linear four-stage process from model selection to a single synthesized conclusion.
            </p>
          </div>

          <div className="process-timeline" role="list">
            {processSteps.map((item, idx) => (
              <div key={item.label} className="process-step" role="listitem">
                <div className="process-step-rail">
                  <div className="process-step-node">
                    {item.icon}
                  </div>
                  {idx < processSteps.length - 1 && (
                    <div className="process-step-connector" aria-hidden="true" />
                  )}
                </div>
                <div className="process-step-content">
                  <div className="process-step-meta">
                    <span className="process-step-num">STAGE {item.step}</span>
                  </div>
                  <h3 className="process-step-title">{item.label}</h3>
                  <p className="process-step-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Compact Model Showcase */}
      <section id="models" className="section-models-showcase">
        <div className="container">
          <div className="showcase-header">
            <div>
              <span className="eyebrow">MODEL ROSTER</span>
              <h2>Available Arena Models</h2>
              <p>
                Six frontier model profiles available for simulated head-to-head debates.
              </p>
            </div>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setView('config')}
            >
              <span>Configure Matchup</span>
              <IconArrowRight size={15} />
            </button>
          </div>

          <div className="showcase-grid">
            {models.map((m) => (
              <div key={m.id} className="showcase-item">
                <ModelIcon id={m.id} color={m.color} size={36} />
                <div className="showcase-item-body">
                  <div className="showcase-item-top">
                    <strong>{m.name}</strong>
                    <span>{m.provider} • {m.model}</span>
                  </div>
                  <p>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Final Call-to-Action */}
      <section className="section-final-cta">
        <div className="container">
          <div className="cta-surface">
            <div className="cta-copy">
              <span className="eyebrow">
                <span className="eyebrow-dot" />
                <span>SANGRAM AI — DIFFERENT MINDS. ONE ARENA.</span>
              </span>
              <h2>Ready to put two AI perspectives to the test?</h2>
              <p>
                Select two models, enter your question, and review the full four-round debate alongside one synthesized answer.
              </p>
            </div>
            <div className="cta-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={() => setView('config')}
              >
                <span>Enter the Arena</span>
                <IconArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

            {/* 7. Footer */}
      <footer id="about" className="footer">
        <div className="container">
          <div className="footer-grid">
            {/* About Column */}
            <div className="footer-brand-col">
              <BrandLogo showTagline size="sm" />
              <p className="footer-about-text">
                <strong>SANGRAM AI</strong> is a multi-model debate and synthesis arena where two distinct AI minds challenge each other's reasoning in a shared timeline to converge on one stronger, consolidated answer.
              </p>
              <p className="footer-note">
                Frontend prototype using deterministic local simulation data. No live external model APIs are connected.
              </p>
            </div>

            {/* Navigation Column */}
            <div className="footer-col">
              <h4 className="footer-heading">Platform</h4>
              <div className="footer-links-stack">
                <a
                  href="#benefits"
                  onClick={(e) => {
                    e.preventDefault()
                    document.querySelector('#benefits')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  Why Sangram
                </a>
                <a
                  href="#how"
                  onClick={(e) => {
                    e.preventDefault()
                    document.querySelector('#how')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  How It Works
                </a>
                <a
                  href="#models"
                  onClick={(e) => {
                    e.preventDefault()
                    document.querySelector('#models')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  Model Roster
                </a>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => {
                    setView('config')
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                >
                  Enter the Arena
                </button>
              </div>
            </div>

            {/* Contact & Info Column */}
            <div className="footer-col">
               <div className="footer-contact-item">
                  <span className="contact-label">Email</span>
                  <div className="contact-email-row">
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=nikhil@sangramai.tech"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-link"
                    >
                      nikhil@sangramai.tech
                    </a>
                    <a
                      href="mailto:nikhil@sangramai.tech"
                      className="contact-sub-action"
                      title="Open default mail app"
                    >
                      
                    </a>
                  </div>
                
                <div className="footer-contact-item">
                  <span className="contact-label">WhatsApp</span>
                  <a
                    href="https://wa.me/917822902947"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-link"
                  >
                    +91 78229 02947
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} SANGRAM AI — Different Minds. One Arena.</span>
            <span>Multi-Model Debate &amp; Synthesis Platform</span>
          </div>
        </div>
      </footer>
    </main>
  )
}

function Config({
  selected,
  setSelected,
  question,
  setQuestion,
  setView,
  setBattleData,
  setStatus
}) {
  const [error, setError] = useState('')
  const [activeSlot, setActiveSlot] = useState(() => {
    if (!selected[0]) return 0
    if (!selected[1]) return 1
    return 0
  })
  const maxLen = 1000
  const minLen = 10

  const selectModelForSlot = (model, targetSlot) => {
    const otherSlot = targetSlot === 0 ? 1 : 0
    if (selected[otherSlot]?.id === model.id) {
      setError(
        `${model.name} is already assigned to Fighter 0${otherSlot + 1}. Please select two different models.`
      )
      return
    }
    setError('')
    const next = [...selected]
    next[targetSlot] = model
    setSelected(next)

    // Advance activeSlot automatically to the remaining empty slot if any
    if (targetSlot === 0 && !next[1]) {
      setActiveSlot(1)
    } else if (targetSlot === 1 && !next[0]) {
      setActiveSlot(0)
    }
  }

  const handleCatalogClick = (model) => {
    const inSlot0 = selected[0]?.id === model.id
    const inSlot1 = selected[1]?.id === model.id

    // If clicked model is already in one of the slots, prevent duplicate assignment
    if (inSlot0 || inSlot1) {
      const existingSlotNumber = inSlot0 ? '01' : '02'
      setError(
        `${model.name} is already selected as Fighter ${existingSlotNumber}. Choose a different model for the opposing slot, or click "Change" on Fighter ${existingSlotNumber}.`
      )
      return
    }

    // Determine which slot to populate
    if (!selected[0]) {
      selectModelForSlot(model, 0)
    } else if (!selected[1]) {
      selectModelForSlot(model, 1)
    } else {
      selectModelForSlot(model, activeSlot)
    }
  }

  const handleClearOrChangeSlot = (slotIdx) => {
    setError('')
    const next = [...selected]
    next[slotIdx] = null
    setSelected(next)
    setActiveSlot(slotIdx)
  }

  const trimmedLen = question.trim().length
  const modelsReady = Boolean(selected[0] && selected[1] && selected[0].id !== selected[1].id)
  const questionReady = trimmedLen >= minLen && question.length <= maxLen
  const canStart = modelsReady && questionReady

  const start = () => {
    if (!canStart) return
    const data = generateBattle(selected, question.trim())
    setBattleData(data)
    setStatus('ready')
    setView('arena')
  }

  return (
    <main className="container config-wrap">
      <div className="config-head">
        <span className="eyebrow">MATCHUP CONFIGURATION</span>
        <h1>Choose Your Fighters</h1>
        <p>Two models. Different perspectives. One arena.</p>
      </div>

      {/* Desktop layout: FIGHTER 01 — VS — FIGHTER 02 */}
      <section className="slots-section" aria-label="Selected fighters">
        <div className="slots">
          {/* Fighter 01 */}
          <div
            className={`slot ${selected[0] ? 'selected' : 'empty'} ${
              activeSlot === 0 && !selected[0] ? 'slot-targeted' : ''
            }`}
            onClick={() => {
              if (!selected[0]) setActiveSlot(0)
            }}
          >
            <div className="slot-head">
              <div className="slot-title-group">
                <span className="slot-label">FIGHTER 01</span>
                <span className={`slot-state-badge ${selected[0] ? 'is-ready' : ''}`}>
                  {selected[0] ? 'Selected' : 'Awaiting Selection'}
                </span>
              </div>
              {selected[0] && (
                <button
                  type="button"
                  className="btn-ghost slot-change-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClearOrChangeSlot(0)
                  }}
                >
                  Change
                </button>
              )}
            </div>

            {!selected[0] ? (
              <div className="slot-empty">
                <div className="slot-empty-icon">
                  <IconStepSelect size={18} />
                </div>
                <div className="slot-empty-text">
                  <strong>Select first model</strong>
                  <span>Choose a fighter from the model catalog below</span>
                </div>
              </div>
            ) : (
              <div className="slot-chosen">
                <ModelIcon id={selected[0].id} color={selected[0].color} size={42} />
                <div className="slot-chosen-info">
                  <div className="slot-chosen-name">{selected[0].name}</div>
                  <div className="slot-chosen-meta">
                    {selected[0].provider} • {selected[0].model}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Central VS */}
          <div className="vs-col" aria-hidden="true">
            <div className="vs-badge">VS</div>
          </div>

          {/* Fighter 02 */}
          <div
            className={`slot ${selected[1] ? 'selected' : 'empty'} ${
              activeSlot === 1 && !selected[1] ? 'slot-targeted' : ''
            }`}
            onClick={() => {
              if (!selected[1]) setActiveSlot(1)
            }}
          >
            <div className="slot-head">
              <div className="slot-title-group">
                <span className="slot-label">FIGHTER 02</span>
                <span className={`slot-state-badge ${selected[1] ? 'is-ready' : ''}`}>
                  {selected[1] ? 'Selected' : 'Awaiting Selection'}
                </span>
              </div>
              {selected[1] && (
                <button
                  type="button"
                  className="btn-ghost slot-change-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClearOrChangeSlot(1)
                  }}
                >
                  Change
                </button>
              )}
            </div>

            {!selected[1] ? (
              <div className="slot-empty">
                <div className="slot-empty-icon">
                  <IconStepSelect size={18} />
                </div>
                <div className="slot-empty-text">
                  <strong>Select second model</strong>
                  <span>Choose a different fighter from the catalog below</span>
                </div>
              </div>
            ) : (
              <div className="slot-chosen">
                <ModelIcon id={selected[1].id} color={selected[1].color} size={42} />
                <div className="slot-chosen-info">
                  <div className="slot-chosen-name">{selected[1].name}</div>
                  <div className="slot-chosen-meta">
                    {selected[1].provider} • {selected[1].model}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="error-msg" role="alert">
            <span>{error}</span>
          </div>
        )}
      </section>

      {/* Model Catalog */}
      <section className="catalog" aria-label="Model Catalog">
        <div className="catalog-header">
          <h4>Model Catalog</h4>
          <span className="catalog-note">
            Select two distinct models • Local mock profiles
          </span>
        </div>

        <div className="catalog-grid">
          {models.map((m) => {
            const isFighter1 = selected[0]?.id === m.id
            const isFighter2 = selected[1]?.id === m.id
            const isSelected = isFighter1 || isFighter2
            const assignedLabel = isFighter1
              ? 'FIGHTER 01'
              : isFighter2
              ? 'FIGHTER 02'
              : null

            return (
              <div
                key={m.id}
                className={`mcard ${isSelected ? 'selected' : ''}`}
                onClick={() => handleCatalogClick(m)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleCatalogClick(m)
                  }
                }}
                aria-pressed={isSelected}
                aria-label={`${m.name} by ${m.provider} (${m.model})${
                  assignedLabel ? ` — Selected as ${assignedLabel}` : ''
                }`}
              >
                <div className="mcard-top">
                  <ModelIcon id={m.id} color={m.color} size={40} />
                  <div className="mcard-title-wrap">
                    <h5>{m.name}</h5>
                    <small>
                      {m.provider} • {m.model}
                    </small>
                  </div>
                </div>

                <p className="mcard-desc">{m.desc}</p>

                <div className="mcard-footer">
                  {isSelected ? (
                    <span className="mcard-status selected-status">
                      <IconCheck size={13} />
                      <span>Selected • {assignedLabel}</span>
                    </span>
                  ) : (
                    <span className="mcard-status">
                      <span>
                        Assign to{' '}
                        {!selected[0]
                          ? 'Fighter 01'
                          : !selected[1]
                          ? 'Fighter 02'
                          : `Fighter 0${activeSlot + 1}`}
                      </span>
                      <IconArrowRight size={13} />
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Question Configuration */}
      <section className="question-section" aria-label="Debate Question">
        <div className="question-head">
          <div>
            <h3>Enter Your Question</h3>
            <p>
              Provide a technical, architectural, or strategic question for the two models to debate.
            </p>
          </div>
          <span className="question-req">Min {minLen} characters</span>
        </div>

        <div className="textarea-wrap">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value.slice(0, maxLen))}
            placeholder="Ask a question for both AI models to examine, challenge, and synthesize..."
            maxLength={maxLen}
            aria-label="Battle question"
          />
          <div
            className={`counter ${question.length > 850 ? 'warn' : ''} ${
              question.length >= maxLen ? 'error' : ''
            }`}
          >
            {question.length} / {maxLen}
          </div>
        </div>

        <div className="chips-row">
          <span className="chips-label">Example questions:</span>
          <div className="chips">
            {examplePrompts.map((p) => (
              <button
                type="button"
                key={p}
                className={`chip ${question === p ? 'active' : ''}`}
                onClick={() => setQuestion(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="start-bar">
          <div className="validation-status" aria-live="polite">
            {!modelsReady && (
              <span className="val-msg">
                Select two different models above ({(selected[0] ? 1 : 0) + (selected[1] ? 1 : 0)} of 2 selected).
              </span>
            )}
            {modelsReady && trimmedLen === 0 && (
              <span className="val-msg">
                Enter a question (at least {minLen} characters) to start the battle.
              </span>
            )}
            {modelsReady && trimmedLen > 0 && trimmedLen < minLen && (
              <span className="val-msg val-warn">
                Question is too short — add {minLen - trimmedLen} more character{minLen - trimmedLen === 1 ? '' : 's'}.
              </span>
            )}
            {canStart && (
              <span className="val-msg val-ok">
                <IconCheck size={14} />
                <span>
                  Ready: {selected[0].name} vs {selected[1].name}
                </span>
              </span>
            )}
          </div>

          <button
            type="button"
            className="btn-primary start-battle-btn"
            disabled={!canStart}
            onClick={start}
            aria-disabled={!canStart}
          >
            <span>Start Battle</span>
            <IconArrowRight size={16} />
          </button>
        </div>
      </section>
    </main>
  )
}

function Arena({
  selected,
  question,
  battleData,
  setView,
  setFinalAnswer,
  setInsightsState,
  onReset
}) {
  const [revealed, setRevealed] = useState([])
  const [stageIdx, setStageIdx] = useState(0)
  const [typing, setTyping] = useState(false)
  const [status, setStatus] = useState('running') // running | synthesizing | completed
  const listRef = useRef(null)
  const timersRef = useRef([])

  useEffect(() => {
    if (!battleData) return
    setRevealed([])
    setStageIdx(0)
    setTyping(true)
    setStatus('running')

    let idx = 0
    const total = battleData.messages.length

    function scheduleNext() {
      if (idx >= total) {
        setTyping(true)
        setStageIdx(4) // synthesis
        setStatus('synthesizing')
        const t = setTimeout(() => {
          setStatus('completed')
          setTyping(false)
          setFinalAnswer(battleData.finalAnswer)
          setInsightsState(battleData.insights)
          setTimeout(() => setView('results'), 900)
        }, 1600)
        timersRef.current.push(t)
        return
      }
      const msg = battleData.messages[idx]
      const delay = 1100 + Math.random() * 550
      const t = setTimeout(() => {
        setRevealed((prev) => [...prev, msg])
        setStageIdx(Math.min(msg.round - 1, 3))
        setTyping(true)
        idx++
        scheduleNext()
      }, delay)
      timersRef.current.push(t)
      setTyping(false)
      const t2 = setTimeout(() => setTyping(true), delay - 280)
      timersRef.current.push(t2)
    }

    scheduleNext()

    return () => {
      timersRef.current.forEach(clearTimeout)
      timersRef.current = []
    }
  }, [battleData, setFinalAnswer, setInsightsState, setView])

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [revealed, typing, status])

  const skip = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    if (battleData) {
      setRevealed(battleData.messages)
      setStageIdx(4)
      setStatus('completed')
      setTyping(false)
      setFinalAnswer(battleData.finalAnswer)
      setInsightsState(battleData.insights)
      setView('results')
    }
  }

  if (!selected[0] || !selected[1] || !battleData) {
    return (
      <main className="container arena-empty-fallback">
        <div className="fallback-card">
          <h2>No Active Matchup</h2>
          <p>Select two AI models and enter a question to begin a debate.</p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => setView('config')}
          >
            Configure Matchup
          </button>
        </div>
      </main>
    )
  }

  const nextPendingMsg = battleData.messages[revealed.length]
  const activeSpeakerId =
    status === 'running' && nextPendingMsg ? nextPendingMsg.speaker : null

  const currentStage = stages[stageIdx] || stages[0]

  return (
    <main className="container arena-page">
      {/* Arena Header: Competing Models, Active Round, Controls, and Question */}
      <section className="arena-header" aria-label="Debate Matchup Header">
        <div className="arena-header-top">
          <div className="arena-models">
            <div
              className={`arena-model fighter-chip-a ${
                activeSpeakerId === 'A' ? 'speaking' : ''
              }`}
            >
              <ModelIcon id={selected[0].id} color={selected[0].color} size={30} />
              <div className="arena-model-text">
                <span className="arena-fighter-tag">FIGHTER 01</span>
                <strong>{selected[0].name}</strong>
                <small>{selected[0].provider}</small>
              </div>
            </div>

            <div className="arena-vs" aria-hidden="true">
              VS
            </div>

            <div
              className={`arena-model fighter-chip-b ${
                activeSpeakerId === 'B' ? 'speaking' : ''
              }`}
            >
              <ModelIcon id={selected[1].id} color={selected[1].color} size={30} />
              <div className="arena-model-text">
                <span className="arena-fighter-tag">FIGHTER 02</span>
                <strong>{selected[1].name}</strong>
                <small>{selected[1].provider}</small>
              </div>
            </div>
          </div>

          <div className="arena-header-controls">
            <div className="arena-stage-status">
              <span
                className={`status-dot ${
                  status === 'completed'
                    ? 'done'
                    : status === 'synthesizing'
                    ? 'synth'
                    : 'live'
                }`}
              />
              <span>
                {status === 'synthesizing'
                  ? 'Stage 5 of 5 • Synthesizing'
                  : status === 'completed'
                  ? 'Debate Complete'
                  : `Round ${Math.min(stageIdx + 1, 4)} of 4 • ${currentStage.label}`}
              </span>
            </div>
            <button type="button" className="btn-ghost" onClick={skip}>
              Skip to Results
            </button>
            <button type="button" className="btn-ghost" onClick={onReset}>
              Exit Arena
            </button>
          </div>
        </div>

        <div className="arena-question-bar">
          <span className="question-bar-label">DEBATE QUESTION</span>
          <p className="question-bar-text">{question}</p>
          <span className="question-bar-tag">Simulated Debate</span>
        </div>
      </section>

      <div className="arena-layout">
        {/* Progress Sidebar / Mobile Stepper */}
        <aside className="progress-card" aria-label="Battle Progress">
          <div className="progress-card-head">
            <h4>Debate Stages</h4>
            <span>{Math.min(stageIdx + 1, 5)} / 5</span>
          </div>

          <div className="stage-list">
            {stages.map((s, i) => {
              const isActive = i === stageIdx
              const isDone = i < stageIdx || status === 'completed'
              return (
                <div
                  key={s.id}
                  className={`stage ${isActive ? 'active' : ''} ${
                    isDone ? 'done' : ''
                  }`}
                >
                  <div className="stage-index">
                    {isDone ? <IconCheck size={12} /> : `0${i + 1}`}
                  </div>
                  <div className="stage-info">
                    <b>{s.label}</b>
                    <span>
                      {i === 4 ? 'Final Conclusion' : `Round 0${s.round}`}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mobile-stepper" aria-label="Debate stages">
            {stages.map((s, i) => {
              const isActive = i === stageIdx
              const isDone = i < stageIdx || status === 'completed'
              return (
                <div
                  key={s.id}
                  className={`mstep ${isActive ? 'active' : ''} ${
                    isDone ? 'done' : ''
                  }`}
                >
                  <span>{isDone ? <IconCheck size={11} /> : `0${i + 1}`}</span>
                  <span>{s.label}</span>
                </div>
              )
            })}
          </div>

          <div className="progress-legend">
            <div className="legend-title">Shared Timeline</div>
            <p>
              Arguments unfold chronologically in one arena so every counterargument directly addresses the opposing model's prior point.
            </p>
          </div>
        </aside>

        {/* Chronological Shared Debate Timeline */}
        <section className="timeline" aria-label="Shared Debate Timeline">
          <div className="timeline-head">
            <div>
              <h3>Shared Debate Timeline</h3>
              <p className="timeline-sub">
                Chronological exchange • {revealed.length} of {battleData.messages.length} arguments recorded
              </p>
            </div>
            <div className="timeline-live-indicator">
              <span
                className={`status-dot ${
                  status === 'completed' ? 'done' : 'live'
                }`}
              />
              <span>
                {status === 'completed'
                  ? 'All rounds complete'
                  : status === 'synthesizing'
                  ? 'Synthesizing final answer...'
                  : nextPendingMsg
                  ? `Speaking: ${nextPendingMsg.modelName}`
                  : 'Debate in progress'}
              </span>
            </div>
          </div>

          <div className="timeline-list" ref={listRef}>
            {revealed.map((m, idx) => {
              const isA = m.speaker === 'A'
              const prevMsg = idx > 0 ? revealed[idx - 1] : null
              const isNewRound = !prevMsg || prevMsg.round !== m.round
              const stageInfo = stages.find((s) => s.round === m.round)

              return (
                <div key={m.id} className="timeline-item-group">
                  {isNewRound && (
                    <div className="round-divider">
                      <span className="round-divider-num">
                        ROUND 0{m.round}
                      </span>
                      <span className="round-divider-label">
                        {stageInfo?.label || `Round ${m.round}`}
                      </span>
                      <span className="round-divider-line" />
                    </div>
                  )}

                  <article
                    className={`msg round-type-${m.round} ${
                      isA ? 'speaker-a' : 'speaker-b'
                    }`}
                  >
                    <div className="msg-sidebar">
                      <ModelIcon id={m.modelId} color={m.color} size={34} />
                      <div className="msg-vertical-line" />
                    </div>

                    <div className="msg-content">
                      <header className="msg-meta">
                        <span className="msg-fighter-badge">
                          {isA ? 'FIGHTER 01' : 'FIGHTER 02'}
                        </span>
                        <strong className="msg-model-name">{m.modelName}</strong>
                        <span className="msg-provider">{m.provider}</span>
                        <span className="msg-stage-tag">
                          {m.stageLabel || `Round ${m.round}`}
                        </span>
                        <time className="msg-time">{m.timestamp}</time>
                      </header>

                      {m.addressing && (
                        <div className="msg-challenge-ref">
                          <IconReplyTarget size={13} />
                          <span>
                            Challenging{' '}
                            <strong>{m.opponentName || (isA ? selected[1].name : selected[0].name)}</strong>{' '}
                            on: <em>“{m.addressing}”</em>
                          </span>
                        </div>
                      )}

                      <p className="msg-text">{m.text}</p>
                    </div>
                  </article>
                </div>
              )
            })}

            {typing && status !== 'completed' && (
              <div className="typing-banner" aria-live="polite">
                <div className="typing-dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </div>
                <span>
                  {status === 'synthesizing'
                    ? 'Stage 05 (Synthesis): Distilling strongest arguments into one consolidated final answer...'
                    : `${
                        nextPendingMsg?.modelName || selected[0].name
                      } is formulating a ${
                        nextPendingMsg?.stageLabel?.toLowerCase() || 'response'
                      }...`}
                </span>
              </div>
            )}

            {status === 'completed' && (
              <div className="synthesis-complete-banner">
                <div className="synthesis-banner-info">
                  <span className="eyebrow">
                    <span className="eyebrow-dot" />
                    <span>STAGE 05 COMPLETE</span>
                  </span>
                  <strong>All 4 debate rounds complete — synthesis ready</strong>
                  <p>
                    The strongest insights from {selected[0].name} and {selected[1].name} have been consolidated.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setView('results')}
                >
                  <span>View Final Answer</span>
                  <IconArrowRight size={15} />
                </button>
              </div>
            )}
          </div>

          <div className="arena-actions">
            <button type="button" className="btn-ghost" onClick={skip}>
              Skip to Results
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setView('config')}
            >
              Change Models
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}

function Results({
  selected,
  question,
  finalAnswer,
  insights,
  setView,
  setBattleData,
  setQuestion,
  setSelected
}) {
  const [feedback, setFeedback] = useState('')

  const copy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(finalAnswer)
        setFeedback('Copied final answer to clipboard.')
      } else {
        const ta = document.createElement('textarea')
        ta.value = finalAnswer
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        ta.remove()
        setFeedback('Copied final answer to clipboard.')
      }
    } catch {
      setFeedback('Copy failed — please select and copy the text manually.')
    }
    setTimeout(() => setFeedback(''), 2800)
  }

  const tryAnother = () => {
    setQuestion('')
    setBattleData(null)
    setSelected([null, null])
    setView('config')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const viewDebate = () => {
    setView('arena-done')
  }

  return (
    <main className="container results-wrap">
      <div className="results-head">
        <span className="eyebrow">
          <span className="eyebrow-dot" />
          <span>SYNTHESIS COMPLETE</span>
        </span>
        <h1>SANGRAM AI: FINAL ANSWER</h1>
        <p>Synthesized from the strongest insights of the debate.</p>
      </div>

      {/* Debate Context Bar */}
      <div className="results-context-bar">
        <div className="results-context-question">
          <span className="context-label">QUESTION</span>
          <p>{question}</p>
        </div>
        <div className="results-context-matchup">
          <span className="context-label">PARTICIPANTS</span>
          <div className="context-fighters">
            <span>{selected[0]?.name || 'Model A'}</span>
            <span className="context-vs">VS</span>
            <span>{selected[1]?.name || 'Model B'}</span>
          </div>
        </div>
      </div>

      {/* Primary Focus: Consolidated Answer Surface */}
      <section className="final-card" aria-label="Consolidated Final Answer">
        <div className="final-card-header">
          <span className="final-card-label">CONSOLIDATED CONCLUSION</span>
          <span className="final-card-meta">4 Rounds Synthesized</span>
        </div>
        <p className="final-card-body">{finalAnswer}</p>
      </section>

      {/* Supporting Insights from Each Model */}
      <section className="insights-section" aria-label="Supporting Model Insights">
        <h2 className="insights-heading">Supporting Perspectives from the Debate</h2>
        <div className="insights">
          <article className="insight insight-a">
            <div className="insight-head">
              <ModelIcon
                id={selected[0]?.id || 'chatgpt'}
                color={selected[0]?.color || '#00D9FF'}
                size={32}
              />
              <div>
                <span className="insight-role">FIGHTER 01 CONTRIBUTION</span>
                <h4>{selected[0]?.name || 'Model A'}</h4>
              </div>
            </div>
            <p>{insights?.a || 'No supporting insight recorded.'}</p>
          </article>

          <article className="insight insight-b">
            <div className="insight-head">
              <ModelIcon
                id={selected[1]?.id || 'gemini'}
                color={selected[1]?.color || '#4388FF'}
                size={32}
              />
              <div>
                <span className="insight-role">FIGHTER 02 CONTRIBUTION</span>
                <h4>{selected[1]?.name || 'Model B'}</h4>
              </div>
            </div>
            <p>{insights?.b || 'No supporting insight recorded.'}</p>
          </article>
        </div>
      </section>

      {/* Primary Result Actions */}
      <div className="result-actions">
        <button type="button" className="btn-primary" onClick={copy}>
          <IconCopy size={16} />
          <span>Copy Answer</span>
        </button>
        <button type="button" className="btn-secondary" onClick={viewDebate}>
          <span>View Full Debate</span>
          <IconArrowRight size={15} />
        </button>
        <button type="button" className="btn-ghost" onClick={tryAnother}>
          <IconReset size={15} />
          <span>Try Another Battle</span>
        </button>
      </div>

      {feedback && (
        <div
          className={`copy-feedback ${feedback.includes('failed') ? 'err' : 'ok'}`}
          role="status"
        >
          {feedback}
        </div>
      )}

      <p className="results-disclaimer">
        Simulated synthesis generated from local demonstration templates. Not generated or verified by live external AI APIs.
      </p>
    </main>
  )
}

function CompletedDebate({ selected, question, battleData, setView }) {
  return (
    <main className="container arena-page">
      <div className="completed-top-bar">
        <div>
          <span className="eyebrow">COMPLETE TRANSCRIPT</span>
          <h2>Full Debate Timeline</h2>
        </div>
        <div className="completed-top-actions">
          <button
            type="button"
            className="btn-primary"
            onClick={() => setView('results')}
          >
            <IconArrowLeft size={15} />
            <span>Back to Final Answer</span>
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setView('config')}
          >
            New Battle
          </button>
        </div>
      </div>

      <section className="arena-header">
        <div className="arena-header-top">
          <div className="arena-models">
            <div className="arena-model fighter-chip-a">
              <ModelIcon
                id={selected[0]?.id}
                color={selected[0]?.color}
                size={30}
              />
              <div className="arena-model-text">
                <span className="arena-fighter-tag">FIGHTER 01</span>
                <strong>{selected[0]?.name}</strong>
                <small>{selected[0]?.provider}</small>
              </div>
            </div>
            <div className="arena-vs">VS</div>
            <div className="arena-model fighter-chip-b">
              <ModelIcon
                id={selected[1]?.id}
                color={selected[1]?.color}
                size={30}
              />
              <div className="arena-model-text">
                <span className="arena-fighter-tag">FIGHTER 02</span>
                <strong>{selected[1]?.name}</strong>
                <small>{selected[1]?.provider}</small>
              </div>
            </div>
          </div>
          <div className="arena-stage-status">
            <span className="status-dot done" />
            <span>4 Rounds Completed</span>
          </div>
        </div>
        <div className="arena-question-bar">
          <span className="question-bar-label">DEBATE QUESTION</span>
          <p className="question-bar-text">{question}</p>
        </div>
      </section>

      <section className="timeline completed-timeline">
        <div className="timeline-list completed-list">
          {battleData?.messages.map((m, idx) => {
            const isA = m.speaker === 'A'
            const prevMsg = idx > 0 ? battleData.messages[idx - 1] : null
            const isNewRound = !prevMsg || prevMsg.round !== m.round
            const stageInfo = stages.find((s) => s.round === m.round)

            return (
              <div key={m.id} className="timeline-item-group">
                {isNewRound && (
                  <div className="round-divider">
                    <span className="round-divider-num">ROUND 0{m.round}</span>
                    <span className="round-divider-label">
                      {stageInfo?.label || `Round ${m.round}`}
                    </span>
                    <span className="round-divider-line" />
                  </div>
                )}

                <article
                  className={`msg round-type-${m.round} ${
                    isA ? 'speaker-a' : 'speaker-b'
                  }`}
                >
                  <div className="msg-sidebar">
                    <ModelIcon id={m.modelId} color={m.color} size={34} />
                    <div className="msg-vertical-line" />
                  </div>

                  <div className="msg-content">
                    <header className="msg-meta">
                      <span className="msg-fighter-badge">
                        {isA ? 'FIGHTER 01' : 'FIGHTER 02'}
                      </span>
                      <strong className="msg-model-name">{m.modelName}</strong>
                      <span className="msg-provider">{m.provider}</span>
                      <span className="msg-stage-tag">
                        {m.stageLabel || `Round ${m.round}`}
                      </span>
                      <time className="msg-time">{m.timestamp}</time>
                    </header>

                    {m.addressing && (
                      <div className="msg-challenge-ref">
                        <IconReplyTarget size={13} />
                        <span>
                          Challenging{' '}
                          <strong>
                            {m.opponentName ||
                              (isA ? selected[1]?.name : selected[0]?.name)}
                          </strong>{' '}
                          on: <em>“{m.addressing}”</em>
                        </span>
                      </div>
                    )}

                    <p className="msg-text">{m.text}</p>
                  </div>
                </article>
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}

export default function App() {
  const [view, setView] = useState('landing')
  const [selected, setSelected] = useState([null, null])
  const [question, setQuestion] = useState('')
  const [battleData, setBattleData] = useState(null)
  const [finalAnswer, setFinalAnswer] = useState('')
  const [insights, setInsights] = useState(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [view])

  const handleReset = () => {
    setView('config')
  }

  return (
    <div className="app-shell">
      <Navbar view={view} setView={setView} />
      {view === 'landing' && <Landing setView={setView} />}
      {view === 'config' && (
        <Config
          selected={selected}
          setSelected={setSelected}
          question={question}
          setQuestion={setQuestion}
          setView={setView}
          setBattleData={setBattleData}
          setStatus={() => {}}
        />
      )}
      {view === 'arena' && (
        <Arena
          selected={selected}
          question={question}
          battleData={battleData}
          view={view}
          setView={setView}
          setFinalAnswer={setFinalAnswer}
          setInsightsState={setInsights}
          onReset={handleReset}
        />
      )}
      {view === 'arena-done' && (
        <CompletedDebate
          selected={selected}
          question={question}
          battleData={battleData}
          setView={setView}
        />
      )}
      {view === 'results' && (
        <Results
          selected={selected}
          question={question}
          finalAnswer={finalAnswer}
          insights={insights}
          setView={setView}
          battleData={battleData}
          setBattleData={setBattleData}
          setQuestion={setQuestion}
          setSelected={setSelected}
        />
      )}
    </div>
  )
}
