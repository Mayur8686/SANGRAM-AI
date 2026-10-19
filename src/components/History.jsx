import React, { useState } from 'react'
import {
  deleteHistoryEntry,
  clearHistory,
  relativeSavedLabel
} from '../services/historyStore'
import { getModelById } from '../data/models'
import { ModelIcon, IconTrash, IconArrowRight, IconHistory, IconInfo } from './Icons'

/**
 * Locally stored demo sessions. Everything here lives in this browser's
 * storage only — the UI says so plainly and offers delete/clear controls.
 */
export default function History({ entries, onReopen, onEnterArena }) {
  const [items, setItems] = useState(entries)
  const [confirmClear, setConfirmClear] = useState(false)

  const remove = (id) => setItems(deleteHistoryEntry(id))
  const clearAll = () => {
    clearHistory()
    setItems([])
    setConfirmClear(false)
  }

  return (
    <main id="main" className="container history-wrap">
      <header className="history-head">
        <div>
          <p className="eyebrow">LOCAL ARCHIVE</p>
          <h1>Recent battles</h1>
          <p className="history-sub">
            Completed demo debates are stored only in this browser (up to 12). Nothing is uploaded, and clearing
            site data removes them permanently.
          </p>
        </div>
        {items.length > 0 && (
          <div className="history-head-actions">
            {confirmClear ? (
              <>
                <span className="confirm-q">Clear all {items.length}?</span>
                <button type="button" className="btn-ghost danger" onClick={clearAll}>Yes, clear</button>
                <button type="button" className="btn-ghost" onClick={() => setConfirmClear(false)}>Keep</button>
              </>
            ) : (
              <button type="button" className="btn-ghost danger" onClick={() => setConfirmClear(true)}>
                <IconTrash size={13} /><span>Clear history</span>
              </button>
            )}
          </div>
        )}
      </header>

      {items.length === 0 ? (
        <div className="history-empty">
          <span className="history-empty-icon" aria-hidden="true"><IconHistory size={22} /></span>
          <h2>No saved battles yet</h2>
          <p>Finish a battle in the arena and it will be archived here automatically for this device.</p>
          <button type="button" className="btn-primary" onClick={onEnterArena}>
            <span>Enter the Arena</span>
            <IconArrowRight size={15} />
          </button>
        </div>
      ) : (
        <ul className="history-list">
          {items.map((e) => (
            <li key={e.id} className="history-item">
              <div className="hi-main">
                <p className="hi-question">{e.question}</p>
                <div className="hi-meta">
                  <span className="hi-fighters">
                    {e.fighters.map((f) => {
                      const m = getModelById(f.modelId)
                      return (
                        <span key={f.modelId} className="hi-fighter">
                          <ModelIcon id={f.modelId} size={20} />
                          {f.name}
                          {m ? '' : ' (unknown profile)'}
                        </span>
                      )
                    })}
                  </span>
                  <span className="hi-dot" aria-hidden="true">•</span>
                  <span>{e.messages.length} turns</span>
                  {e.agreement && (
                    <>
                      <span className="hi-dot" aria-hidden="true">•</span>
                      <span>demo agreement {e.agreement.score}/100</span>
                    </>
                  )}
                  <span className="hi-dot" aria-hidden="true">•</span>
                  <span>{relativeSavedLabel(e.savedAt)}</span>
                </div>
              </div>
              <div className="hi-actions">
                <button type="button" className="btn-secondary" onClick={() => onReopen(e)}>
                  <span>Open</span>
                  <IconArrowRight size={13} />
                </button>
                <button type="button" className="btn-ghost danger icon-btn" onClick={() => remove(e.id)} aria-label={`Delete saved battle: ${e.question.slice(0, 50)}`}>
                  <IconTrash size={15} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="history-foot-note">
        <IconInfo size={12} />
        <span>Locally stored demo sessions — transcripts were produced by the frontend simulation engine, not by live model APIs.</span>
      </p>
    </main>
  )
}
