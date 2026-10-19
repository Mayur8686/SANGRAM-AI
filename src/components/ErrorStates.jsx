import React, { useState } from 'react'
import { IconAlert, IconInfo } from './Icons'

/**
 * Error surface shared by live failures and prepared integration states.
 * The UI distinguishes clearly: `demo` states are labelled as previews of
 * future backend behavior, never as real outages.
 */
export function ErrorNotice({ kind = 'error', title, detail, retryLabel, onRetry, dismiss, demo = false }) {
  return (
    <div className={`err-notice kind-${kind} ${demo ? 'is-demo' : ''}`} role={demo ? undefined : 'alert'}>
      <span className="err-icon" aria-hidden="true"><IconAlert size={15} /></span>
      <div className="err-body">
        <strong>{title}</strong>
        {detail && <p>{detail}</p>}
        {demo && (
          <p className="err-demo-tag">
            <IconInfo size={11} /> Preview of a planned integration state — not a live failure.
          </p>
        )}
      </div>
      <div className="err-actions">
        {retryLabel && onRetry && (
          <button type="button" className="btn-ghost" onClick={onRetry}>{retryLabel}</button>
        )}
        {dismiss && (
          <button type="button" className="share-banner-x" onClick={dismiss} aria-label="Dismiss message">✕</button>
        )}
      </div>
    </div>
  )
}

/**
 * Catalog of states the UI is already wired to render. A backend only has
 * to emit these codes (docs/BACKEND_CONTRACT.md) for the arena to handle
 * them without further UI work.
 */
export const FUTURE_STATES = [
  {
    code: 'MISSING_CONFIG', title: 'Model configuration missing',
    detail: 'One or both fighters have no backend endpoint or model id configured for this deployment.',
    retry: false
  },
  {
    code: 'API_FAILURE', title: 'Provider request failed',
    detail: 'The orchestration backend returned an error while calling one of the models. Message history up to the failure is preserved.',
    retry: true
  },
  {
    code: 'TIMEOUT', title: 'Response timed out',
    detail: 'A model did not respond within the configured window. Partial streaming is retained; retry resumes from the failed round.',
    retry: true
  },
  {
    code: 'RATE_LIMIT', title: 'Rate limited (429)',
    detail: 'Backend concurrency or provider quota exceeded. Retry is scheduled automatically with backoff.',
    retry: true
  },
  {
    code: 'AUTH_FAILED', title: 'Authorization failed (401/403)',
    detail: 'Session credential rejected by the backend. No provider keys live in this client; re-authenticate server-side.',
    retry: false
  },
  {
    code: 'NETWORK_OFFLINE', title: 'Network unavailable',
    detail: 'The browser cannot reach the orchestration backend. The battle state is kept locally and can resume on reconnect.',
    retry: true
  },
  {
    code: 'EMPTY_RESPONSE', title: 'Empty model response',
    detail: 'A fighter returned no content for this round. The timeline marks the turn as declined instead of inventing text.',
    retry: true
  },
  {
    code: 'SYNTHESIS_FAILED', title: 'Synthesis failed',
    detail: 'The debate completed but consolidation did not. Full transcript remains available; re-run synthesis alone.',
    retry: true
  }
]

export function DiagnosticsPanel() {
  const [open, setOpen] = useState(false)
  const [preview, setPreview] = useState(null)

  return (
    <section className="diagnostics" aria-labelledby="diag-h">
      <button
        type="button"
        className="diag-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="diag-body"
      >
        <IconInfo size={13} />
        <span>Diagnostics — how the UI will behave once a real backend is connected</span>
        <span className="diag-caret" aria-hidden="true">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div id="diag-body" className="diag-body">
          <p className="diag-intro">
            This prototype generates every battle locally with a deterministic mock engine (no network, no keys).
            Select a state to preview the exact panel the arena would show if the backend reported it. These are
            interface preparations, not simulated incidents.
          </p>
          <div className="diag-grid" role="group" aria-label="Preview UI states">
            {FUTURE_STATES.map((s) => (
              <button
                key={s.code}
                type="button"
                className={`diag-chip ${preview === s.code ? 'active' : ''}`}
                onClick={() => setPreview(preview === s.code ? null : s.code)}
                aria-pressed={preview === s.code}
              >
                {s.code.replaceAll('_', ' ').toLowerCase()}
              </button>
            ))}
          </div>
          {preview && (() => {
            const s = FUTURE_STATES.find((x) => x.code === preview)
            return (
              <div className="diag-preview">
                <ErrorNotice
                  kind={preview === 'RATE_LIMIT' || preview === 'EMPTY_RESPONSE' ? 'warn' : 'error'}
                  title={s.title}
                  detail={s.detail}
                  retryLabel={s.retry ? 'Retry round' : undefined}
                  onRetry={s.retry ? () => setPreview(null) : undefined}
                  dismiss={s.retry ? undefined : () => setPreview(null)}
                  demo
                />
              </div>
            )
          })()}
        </div>
      )}
    </section>
  )
}
