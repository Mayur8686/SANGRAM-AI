import React from 'react'

/**
 * Set OFFICIAL_LOGO_SRC to a path (e.g. '/sangram-logo.svg') when the official
 * Sangram AI brand mark asset is added to the repository.
 * While null, a restrained neutral geometric placeholder is rendered.
 */
export const OFFICIAL_LOGO_SRC = null

export function BrandLogo({ showTagline = false, size = 'md' }) {
  const boxSize = size === 'sm' ? 28 : 32
  return (
    <div className={`brand brand-${size}`}>
      <div
        className="brand-mark"
        style={{ width: boxSize, height: boxSize }}
        aria-hidden="true"
      >
        {OFFICIAL_LOGO_SRC ? (
          <img src={OFFICIAL_LOGO_SRC} alt="" width={boxSize} height={boxSize} />
        ) : (
          <svg
            width={boxSize - 12}
            height={boxSize - 12}
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M3.5 6.5L10 3L16.5 6.5V13.5L10 17L3.5 13.5V6.5Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M6.5 8.5L10 10.5L13.5 8.5M10 10.5V14.5"
              stroke="#00D9FF"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <div className="brand-text">
        <span className="brand-wordmark">SANGRAM AI</span>
        {showTagline && (
          <span className="brand-tagline">Different Minds. One Arena.</span>
        )}
      </div>
    </div>
  )
}

export function ModelIcon({ id, color = '#00D9FF', size = 38 }) {
  const glyphSize = Math.round(size * 0.5)
  const renderGlyph = () => {
    switch (id) {
      case 'chatgpt':
        return (
          <svg width={glyphSize} height={glyphSize} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
            <path d="M12 4V9M12 15V20M4 12H9M15 12H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )
      case 'gemini':
        return (
          <svg width={glyphSize} height={glyphSize} viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3C12 8 16 12 21 12C16 12 12 16 12 21C12 16 8 12 3 12C8 12 12 8 12 3Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        )
      case 'claude':
        return (
          <svg width={glyphSize} height={glyphSize} viewBox="0 0 24 24" fill="none">
            <polygon
              points="12,3 20,7.5 20,16.5 12,21 4,16.5 4,7.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path d="M8.5 12H15.5M12 8.5V15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )
      case 'llama':
        return (
          <svg width={glyphSize} height={glyphSize} viewBox="0 0 24 24" fill="none">
            <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" />
            <path d="M8 15L12 9L16 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      case 'mistral':
        return (
          <svg width={glyphSize} height={glyphSize} viewBox="0 0 24 24" fill="none">
            <path
              d="M4 17V7L9 12L12 9L15 12L20 7V17"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )
      case 'grok':
      default:
        return (
          <svg width={glyphSize} height={glyphSize} viewBox="0 0 24 24" fill="none">
            <path d="M6 18L18 6M8 6H18V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
    }
  }

  return (
    <div
      className="model-icon-badge"
      style={{
        width: size,
        height: size,
        '--model-color': color
      }}
      aria-hidden="true"
    >
      {renderGlyph()}
    </div>
  )
}

export function IconCompare({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="7" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
      <rect x="14" y="4" width="7" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
      <path d="M10 9H14M10 15H14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

export function IconChallenge({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 8H16L13 5M20 16H8L11 19"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IconSynthesize({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 6L12 13L19 6M12 13V20"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="19" r="2" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  )
}

export function IconStepSelect({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="7" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
      <rect x="14" y="5" width="7" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  )
}

export function IconStepQuestion({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6H20V16H8L4 20V6Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M8 10H16M8 13H13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

export function IconStepBattle({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 7H18M6 12H15M6 17H18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="18" cy="12" r="2" fill="currentColor" />
    </svg>
  )
}

export function IconStepAnswer({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 12L11 14L15.5 9.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="4" y="4" width="16" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  )
}

export function IconArrowRight({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12H19M13 6L19 12L13 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconArrowLeft({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M19 12H5M11 6L5 12L11 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconCheck({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12.5L9.5 17L19 7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconCopy({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M5 15H4C3.45 15 3 14.55 3 14V4C3 3.45 3.45 3 4 3H14C14.55 3 15 3.45 15 4V5" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  )
}

export function IconReset({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12C4 7.58 7.58 4 12 4C15.37 4 18.26 6.08 19.43 9M20 4V9H15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 12C20 16.42 16.42 20 12 20C8.63 20 5.74 17.92 4.57 15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

export function IconReplyTarget({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 5V14H18M14 10L18 14L14 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconMenu({ open = false, size = 20 }) {
  if (open) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
