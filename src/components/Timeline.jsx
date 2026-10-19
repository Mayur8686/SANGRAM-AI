import React, { useState } from 'react'
import { getModelById } from '../data/models'
import { stages } from '../services/battleService'
import { ModelIcon, IconReplyTarget, IconContention, IconConverge } from './Icons'

const READ_MORE_AT = 430

function accentFor(msg) {
  if (msg.accent) return msg.accent
  const m = getModelById(msg.modelId)
  return m?.accent || { color: '#00D9FF', soft: 'rgba(0,217,255,.1)', line: 'rgba(0,217,255,.4)' }
}

export function RoundDivider({ round }) {
  const st = stages.find((s) => s.round === round)
  return (
    <div className="round-divider" role="presentation">
      <span className="rd-num">ROUND 0{round}</span>
      <span className="rd-label">{st?.label || `Round ${round}`}</span>
      <span className="rd-line" aria-hidden="true" />
    </div>
  )
}

function MessageItemBase({ msg, streaming = false, text = null, expanded, onToggle }) {
  const isA = msg.speaker === 'A'
  const acc = accentFor(msg)
  const body = text ?? msg.text
  const long = msg.text.length > READ_MORE_AT
  const clamped = !streaming && long && !expanded
  const shown = clamped ? msg.text.slice(0, READ_MORE_AT).trimEnd() + '…' : body

  return (
    <article
      className={`msg ${isA ? 'side-a' : 'side-b'} ${streaming ? 'is-streaming' : ''} ${msg.converging ? 'is-refined' : ''}`}
      style={{ '--mc': acc.color, '--mc-soft': acc.soft, '--mc-line': acc.line }}
      aria-label={`${streaming ? '' : 'Spoken turn'}: Round 0${msg.round}, ${msg.stageLabel}, ${msg.modelName}`}
    >
      <span className="msg-gutter" aria-hidden="true">
        <ModelIcon id={msg.modelId} size={30} />
      </span>

      <div className="msg-main">
        <header className="msg-meta">
          <span className="msg-fighter">{isA ? 'FIGHTER 01' : 'FIGHTER 02'}</span>
          <strong className="msg-model">{msg.modelName}</strong>
          <span className="msg-prov">{msg.provider}{msg.modelLabel ? ` · ${msg.modelLabel}` : ''}</span>
          <span className="msg-stage">{msg.stageLabel}</span>
          {streaming && (
            <span className="msg-typing" role="status">
              <i aria-hidden="true" /><i aria-hidden="true" /><i aria-hidden="true" />
              <span className="sr-only">composing</span>
            </span>
          )}
        </header>

        {msg.challenges && (
          <p className="msg-challenge">
            <IconReplyTarget size={12} />
            <span>Challenging <strong>{msg.opponentName || 'the opposing model'}</strong> — “{msg.challenges}”</span>
          </p>
        )}

        {msg.contention && (
          <p className="msg-contention">
            <IconContention size={12} />
            <span className="mc-label">Point of contention</span>
            <span className="mc-text">{msg.contention}</span>
          </p>
        )}

        {msg.converging && (
          <p className="msg-refined">
            <IconConverge size={12} />
            <span>Position refined — a concession toward the other fighter</span>
          </p>
        )}

        <p className={`msg-text ${clamped ? 'clamped' : ''}`}>
          {shown}
          {streaming && <span className="stream-caret" aria-hidden="true" />}
        </p>

        {long && !streaming && (
          <button type="button" className="read-more" onClick={() => onToggle(msg.id)} aria-expanded={Boolean(expanded)}>
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
    </article>
  )
}

export const MessageItem = React.memo(MessageItemBase)

/**
 * The shared chronological timeline. Both speakers share one list —
 * side offset is presentation only, never separate chat panes.
 */
export default function Timeline({ messages, streamingMsg = null, streamingText = null }) {
  const [expandedIds, setExpandedIds] = useState(() => new Set())
  const toggle = React.useCallback((id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  return (
    <div className="timeline-list" role="list">
      {messages.map((m, i) => {
        const prev = messages[i - 1]
        const newRound = !prev || prev.round !== m.round
        return (
          <React.Fragment key={m.id}>
            {newRound && <RoundDivider round={m.round} />}
            <div role="listitem" className="timeline-item">
              <MessageItem
                msg={m}
                expanded={expandedIds.has(m.id)}
                onToggle={toggle}
              />
            </div>
          </React.Fragment>
        )
      })}

      {streamingMsg && (
        <div role="listitem" className="timeline-item">
          <MessageItem msg={streamingMsg} streaming text={streamingText} />
        </div>
      )}
    </div>
  )
}
