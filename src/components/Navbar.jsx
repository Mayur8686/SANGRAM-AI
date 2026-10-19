import React, { useState } from 'react'
import { BrandLogo, IconArrowRight, IconMenu } from './Icons'

/**
 * Context-aware navigation.
 *  • Landing: full links + "Enter the Arena" CTA.
 *  • Inside the product: the CTA is replaced by a compact
 *    CONFIGURE → BATTLE → SYNTHESIZE stage indicator.
 */

const STAGES = [
  { key: 'configure', label: 'CONFIGURE' },
  { key: 'battle', label: 'BATTLE' },
  { key: 'synthesize', label: 'SYNTHESIZE' }
]

const VIEW_STAGE = {
  config: 'configure',
  arena: 'battle',
  debate: 'synthesize',
  results: 'synthesize',
  history: null
}

export default function Navbar({ view, onNavigate, onHome, onEnter }) {
  const [open, setOpen] = useState(false)
  const onProduct = view !== 'landing' && VIEW_STAGE[view] !== undefined && view !== 'history'
  const activeStage = VIEW_STAGE[view]

  const goSection = (section) => {
    setOpen(false)
    onNavigate(section)
  }

  const links = (
    <>
      <a href="#top" onClick={(e) => { e.preventDefault(); setOpen(false); onHome() }}>Home</a>
      <a href="#how" onClick={(e) => { e.preventDefault(); goSection('#how') }}>How It Works</a>
      <a href="#models" onClick={(e) => { e.preventDefault(); goSection('#models') }}>Models</a>
    </>
  )

  return (
    <header className="nav no-print">
      <div className="container nav-inner">
        <button type="button" className="nav-logo-btn" onClick={() => { setOpen(false); onHome() }} aria-label="SANGRAM AI — home">
          <BrandLogo />
        </button>

        <nav className={`nav-links ${open ? 'open' : ''}`} aria-label="Main navigation">
          {links}
          {onProduct ? (
            <div className="nav-stage" role="group" aria-label="Product stage progress">
              {STAGES.map((s, i) => (
                <React.Fragment key={s.key}>
                  {i > 0 && <span className="nav-stage-arrow" aria-hidden="true">→</span>}
                  <span
                    className={`nav-stage-item ${activeStage === s.key ? 'active' : ''} ${
                      STAGES.findIndex((x) => x.key === activeStage) > i ? 'passed' : ''
                    }`}
                    aria-current={activeStage === s.key ? 'step' : undefined}
                  >
                    {s.label}
                  </span>
                </React.Fragment>
              ))}
            </div>
          ) : (
            <button type="button" className="btn-primary nav-enter-btn" onClick={() => { setOpen(false); onEnter() }}>
              <span>Enter the Arena</span>
              <IconArrowRight size={15} />
            </button>
          )}
        </nav>

        <div className="nav-mobile-actions">
          {onProduct && <span className="nav-stage-compact" aria-label="Current stage">{STAGES.find((s) => s.key === activeStage)?.label || ''}</span>}
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
