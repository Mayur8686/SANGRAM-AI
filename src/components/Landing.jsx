import React, { useState } from 'react'
import { models, accentVars } from '../data/models'
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
  IconInfo,
  IconContention,       
  IconHistory
} from './Icons'

/* ------------------------------------------------------------------ */
/* Hero + custom arena visualization                                   */
/* ------------------------------------------------------------------ */

function ArenaVisual() {
  const a = models[0] // ChatGPT
  const b = models[2] // Claude

  return (
    <div className="arena-visual" role="img" aria-label="Arena visualization: two AI models debate across a shared timeline and converge on one synthesized answer">
      <div className="arena-glow" aria-hidden="true" />
      <div className="arena-grid" aria-hidden="true" />

      <div className="arena-visual-head">
        <span className="arena-visual-title">ARENA · LIVE VIEW (SIMULATED)</span>
        <span className="arena-visual-stages" aria-hidden="true">ARGUE → CHALLENGE → SYNTHESIZE</span>
      </div>

      <div className="arena-combatants">
        <div className="arena-fighter" style={accentVars(a)}>
          <div className="arena-fighter-top">
            <span className="fighter-slot-tag">FIGHTER 01</span>
            <span className="fighter-live-dot" aria-hidden="true" />
          </div>
          <div className="arena-fighter-main">
            <ModelIcon id={a.id} size={38} />
            <div>
              <div className="arena-fighter-name">{a.name}</div>
              <div className="arena-fighter-meta">{a.provider}</div>
            </div>
          </div>
          <p className="arena-fighter-stance"><span>OPENING THESIS</span>{a.desc}</p>
        </div>

        <div className="arena-vs" aria-hidden="true">
          <span className="arena-vs-line" />
          <span className="arena-vs-node">VS</span>
          <span className="arena-vs-line" />
        </div>

        <div className="arena-fighter" style={accentVars(b)}>
          <div className="arena-fighter-top">
            <span className="fighter-slot-tag">FIGHTER 02</span>
            <span className="fighter-live-dot" aria-hidden="true" />
          </div>
          <div className="arena-fighter-main">
            <ModelIcon id={b.id} size={38} />
            <div>
              <div className="arena-fighter-name">{b.name}</div>
              <div className="arena-fighter-meta">{b.provider}</div>
            </div>
          </div>
          <p className="arena-fighter-stance"><span>COUNTER-THESIS</span>Challenges abstraction with immediate feedback loops and verifiable outcomes.</p>
        </div>
      </div>

      <svg className="arena-schematic" viewBox="0 0 420 58" preserveAspectRatio="none" aria-hidden="true">
        <path d="M105 0v20q0 8 8 8h89q8 0 8 8v14" fill="none" stroke={a.accent.color} strokeOpacity="0.55" strokeWidth="1.5" />
        <path d="M315 0v20q0 8-8 8h-89q-8 0-8 8v14" fill="none" stroke={b.accent.color} strokeOpacity="0.55" strokeWidth="1.5" />
        <circle cx="105" cy="3" r="3" fill={a.accent.color} />
        <circle cx="315" cy="3" r="3" fill={b.accent.color} />
        <circle cx="210" cy="28" r="4.5" fill="#0E213A" stroke="var(--accent-primary)" strokeWidth="1.5" />
      </svg>

      <div className="arena-synthesis">
        <div className="arena-synthesis-row">
          <span className="arena-synthesis-tag">STAGE 05 · SYNTHESIS</span>
          <span className="arena-synthesis-rounds">R1 OPEN · R2 COUNTER · R3 REBUT · R4 FINAL</span>
        </div>
        <p>One consolidated answer distilled from the strongest surviving arguments of both models.</p>
      </div>

      <div className="arena-visual-foot" aria-hidden="true">
        <span>ARGUE</span><i>→</i><span>CHALLENGE</span><i>→</i><span>SYNTHESIZE</span>
      </div>
    </div>
  )
}

function Hero({ onEnter, onHowItWorks }) {
  return (
    <section className="hero" id="top">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="hero-eyebrow">DIFFERENT MINDS. ONE ARENA.</p>
          <h1>What Happens When AI&nbsp;Challenges AI?</h1>
          <p className="hero-sub">
            Choose your AI models. Watch them challenge each other's reasoning. Get one consolidated final answer.
          </p>
          <div className="hero-actions">
            <button type="button" className="btn-primary btn-lg" onClick={onEnter}>
              <span>Enter the Arena</span>
              <IconArrowRight size={16} />
            </button>
            <button type="button" className="btn-secondary btn-lg" onClick={onHowItWorks}>
              <span>How It Works</span>
            </button>
          </div>
          <p className="hero-proto-label">
            <span className="demo-dot" aria-hidden="true" />
            Demo Mode · Simulated responses — frontend prototype, no live model APIs
          </p>
        </div>
        <ArenaVisual />
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Example debate preview — clearly marked demonstration data          */
/* ------------------------------------------------------------------ */

const EXAMPLE_TURNS = [
  {
    who: 'a', kind: 'Opening Argument',
    text: 'TypeScript first: a typed contract between modules is the cheapest correctness you can buy, and the discipline compounds across every framework that comes after it.',
    contention: null
  },
  {
    who: 'b', kind: 'Counterargument',
    text: 'The contract argument assumes the contract is right. Types describe structure, not behavior — teams ship type-safe products that are confidently wrong, while a model-backed prototype proves the feature was worth typing at all.',
    contention: 'Whether correctness leverage starts at the code boundary (types) or at the outcome boundary (validated behavior).'
  },
  {
    who: 'a', kind: 'Rebuttal — position refined',
    text: 'Conceded on confidence: types catch drift, not delusion. But evaluation suites are code too — typed tests, typed schemas, typed prompts. The disagreement becomes sequencing, and I hold: the type system is where the eval harness stops lying to you.',
    contention: null
  }
]

function ExampleDebate({ onEnter }) {
  const a = models[0]
  const b = models[2]
  return (
    <section className="section-example" aria-labelledby="example-h">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">DEBATE IN MOTION</p>
          <h2 id="example-h">What a round actually looks like</h2>
          <p>
            A condensed excerpt demonstrating the shared-timeline format: one claim, one genuine challenge, one refined position.
          </p>
        </div>

        <div className="example-card">
          <div className="example-flag">
            <IconInfo size={13} />
            <span>Demonstration data — curated example, not generated by live APIs</span>
          </div>

          <div className="example-question">
            <span className="example-q-label">QUESTION</span>
            <p>Which should a junior developer prioritize first — TypeScript fundamentals or shipping AI-backed prototypes?</p>
          </div>

          <div className="example-timeline" role="list">
            {EXAMPLE_TURNS.map((t, i) => {
              const model = t.who === 'a' ? a : b
              return (
                <div key={i} role="listitem" className={`example-msg ${t.who === 'a' ? 'side-a' : 'side-b'}`} style={accentVars(model)}>
                  <span className="example-avatar"><ModelIcon id={model.id} size={26} /></span>
                  <div className="example-body">
                    <div className="example-meta">
                      <strong className="example-name">{model.name}</strong>
                      <span className="example-kind">{t.kind}</span>
                    </div>
                    {t.contention && (
                      <p className="example-contention"><IconContention size={12} /><span>{t.contention}</span></p>
                    )}
                    <p className="example-text">{t.text}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="example-foot">
            <p className="example-verdict"><span>SYNTHESIZED</span> Fundamentals and prototyping merge into one loop: typed, small, shipped weekly — types stop the eval harness from lying, prototypes stop the roadmap from drifting.</p>
            <button type="button" className="btn-primary" onClick={onEnter}>
              <span>Run this matchup in the Arena</span>
              <IconArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Landing composition                                                 */
/* ------------------------------------------------------------------ */

const BENEFITS = [
  {
    icon: <IconCompare size={19} />,
    title: 'Two minds, one question',
    desc: 'Pick any two model profiles and put a single question through both — no prompt juggling, no side-by-side reading.'
  },
  {
    icon: <IconChallenge size={19} />,
    title: 'Arguments that answer each other',
    desc: 'Counterarguments and rebuttals respond to named claims in a shared timeline, so disagreements stay concrete.'
  },
  {
    icon: <IconSynthesize size={19} />,
    title: 'One consolidated answer',
    desc: 'The synthesis stage merges the strongest surviving reasoning into a single conclusion you can copy, share or export.'
  }
]

const HOW_STEPS = [
  { icon: <IconStepSelect size={17} />, num: '01', title: 'Select models', desc: 'Assign two distinct model profiles to the fighter slots.' },
  { icon: <IconStepQuestion size={17} />, num: '02', title: 'Ask one question', desc: 'Anything worth reasoning over — technical, strategic, or open-ended.' },
  { icon: <IconStepBattle size={17} />, num: '03', title: 'Watch the debate', desc: 'Four rounds stream into one timeline: opening, counter, rebuttal, final.' },
  { icon: <IconStepAnswer size={17} />, num: '04', title: 'Receive the answer', desc: 'One synthesized conclusion with each model\'s supporting insight.' }
]

const USE_CASES = [
  { title: 'Comparing technical approaches', desc: 'Put two candidate architectures in the ring and see which claims survive challenge.' },
  { title: 'Exploring competing explanations', desc: 'Watch rival interpretations pressure-test each other instead of accepting the first fluent answer.' },
  { title: 'Evaluating programming choices', desc: 'Language, framework, database — get the trade-offs argued from both sides, then merged.' },
  { title: 'Decision trade-offs', desc: 'Before committing, see assumptions named, contested and reconciled in one record.' }
]

export default function Landing({ onEnter, onOpenHistory }) {
  const scrollTo = (sel) => document.querySelector(sel)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <main id="main">
      <Hero onEnter={onEnter} onHowItWorks={() => scrollTo('#how')} />

      {/* Benefits */}
      <section className="section-benefits" id="benefits" aria-labelledby="benefits-h">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">WHY SANGRAM</p>
            <h2 id="benefits-h">Adversarial clarity, not chatbot noise</h2>
          </div>
          <div className="benefit-grid">
            {BENEFITS.map((b, i) => (
              <article key={b.title} className="benefit-card">
                <span className="benefit-icon" aria-hidden="true">{b.icon}</span>
                <h3><span className="benefit-num" aria-hidden="true">0{i + 1}</span>{b.title}</h3>
                <p>{b.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-how" id="how" aria-labelledby="how-h">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">DEBATE PROTOCOL</p>
            <h2 id="how-h">How It Works</h2>
            <p>A linear four-stage journey from model selection to one synthesized conclusion.</p>
          </div>
          <ol className="how-grid">
            {HOW_STEPS.map((s) => (
              <li key={s.num} className="how-step">
                <span className="how-icon" aria-hidden="true">{s.icon}</span>
                <span className="how-num">{s.num}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Compact model showcase */}
      <section className="section-showcase" id="models" aria-labelledby="models-h">
        <div className="container">
          <div className="section-head section-head-split">
            <div>
              <p className="eyebrow">MODEL ROSTER</p>
              <h2 id="models-h">Six profiles, any pairing</h2>
              <p>Simulated fighter profiles with distinct reasoning personas. Identifiers are for display only — no live APIs are connected.</p>
            </div>
            <button type="button" className="btn-secondary" onClick={onEnter}>
              <span>Configure Matchup</span>
              <IconArrowRight size={14} />
            </button>
          </div>
          <div className="showcase-grid">
            {models.map((m) => (
              <div key={m.id} className="showcase-item" style={accentVars(m)}>
                <ModelIcon id={m.id} size={34} />
                <div className="showcase-item-body">
                  <strong>{m.name}</strong>
                  <span className="showcase-item-meta">{m.provider} · reference id: {m.modelLabel}</span>
                  <p>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="showcase-foot-note">
            <IconInfo size={12} />
            <span>Display names and reference identifiers are not claimed to be current flagship models and are not wired to any provider API.</span>
          </p>
        </div>
      </section>

      {/* Example debate preview */}
      <ExampleDebate onEnter={onEnter} />

      {/* Use cases */}
      <section className="section-usecases" aria-labelledby="use-h">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">BUILT FOR DECISIONS</p>
            <h2 id="use-h">Where a debate beats a single answer</h2>
          </div>
          <div className="usecase-grid">
            {USE_CASES.map((u) => (
              <article key={u.title} className="usecase-card">
                <h3>{u.title}</h3>
                <p>{u.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-cta" aria-labelledby="cta-h">
        <div className="container">
          <div className="cta-surface">
            <div>
              <h2 id="cta-h">Ready to put two AI perspectives to the test?</h2>
              <p>Select two models, enter one question, and review the full four-round debate alongside a single synthesized answer.</p>
            </div>
            <div className="cta-actions">
              <button type="button" className="btn-primary btn-lg" onClick={onEnter}>
                <span>Enter the Arena</span>
                <IconArrowRight size={16} />
              </button>
              <button type="button" className="btn-ghost" onClick={onOpenHistory}>
                <IconHistory size={15} />
                <span>Recent battles</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer onEnter={onEnter} onOpenHistory={onOpenHistory} />
    </main>
  )
}


const CONTACT_EMAIL = 'nikhil@sangramai.tech'

function Footer({ onEnter, onOpenHistory }) {
  const scrollTo = (sel) =>
    document.querySelector(sel)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })

  return (
    <footer className="footer no-print">
      <div className="container footer-grid">
        <div className="footer-brand-col">
          <BrandLogo showTagline size="sm" />
          <p className="footer-about">
            SANGRAM AI is a multi-model debate and synthesis arena:
            two distinct AI minds challenge each other's reasoning
            in one shared timeline and converge on a stronger
            consolidated answer.
          </p>
          <p className="footer-note">
            Frontend prototype. Battles use local demo data.
          </p>
        </div>

        <nav className="footer-col" aria-label="Footer navigation">
          <h3>Platform</h3>
          <a href="#benefits" onClick={(e) => {
            e.preventDefault()
            scrollTo('#benefits')
          }}>Why Sangram</a>
          <a href="#how" onClick={(e) => {
            e.preventDefault()
            scrollTo('#how')
          }}>How It Works</a>
          <a href="#models" onClick={(e) => {
            e.preventDefault()
            scrollTo('#models')
          }}>Model Roster</a>
          <button type="button" className="footer-link-btn" onClick={onEnter}>
            Enter the Arena
          </button>
          <button type="button" className="footer-link-btn" onClick={onOpenHistory}>
            Recent battles
          </button>
        </nav>

        <div className="footer-col">
          <h3>Contact</h3>
          <a
            className="footer-contact-link"
            href="https://mail.google.com/mail/?view=cm&fs=1&to=nikhil%40sangramai.tech"
          >
            {CONTACT_EMAIL}
          </a>

          <a
            className="footer-contact-link"
            href="https://wa.me/917822902947"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp: +91 78229 02947
          </a>

          <p className="footer-note">
            For demo feedback and partnership enquiries.
          </p>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} SANGRAM AI — Different Minds. One Arena.
        </span>
        <span>Multi-model debate &amp; synthesis · frontend prototype</span>
      </div>
    </footer>
  )
}

  
