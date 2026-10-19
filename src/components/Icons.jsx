import React from 'react'

/**
 * Icon primitives for SANGRAM AI.
 * ------------------------------------------------------------------
 * OFFICIAL brand asset in this repository: /sangram-logo.png (640×640,
 * dark navy background, cyan arena mark). No vector/SVG source of the
 * official mark exists yet — if one is provided, set OFFICIAL_LOGO_SRC
 * to it and remove the note below. The inline hex fallback in
 * LogoMark is explicitly a TEMPORARY stand-in and must not be presented
 * as the official logo.
 */
export const OFFICIAL_LOGO_SRC = '/sangram-logo.png'

export function BrandLogo({ showTagline = false, size = 'md' }) {
  const boxSize = size === 'sm' ? 28 : 32
  return (
    <div className={`brand brand-${size}`}>
      <span className="brand-mark" style={{ width: boxSize, height: boxSize }} aria-hidden="true">
        {OFFICIAL_LOGO_SRC ? (
          <img src={OFFICIAL_LOGO_SRC} alt="" width={boxSize} height={boxSize} />
        ) : (
          <TemporaryMark boxSize={boxSize} />
        )}
      </span>
      <span className="brand-text">
        <span className="brand-wordmark">SANGRAM AI</span>
        {showTagline && <span className="brand-tagline">Different Minds. One Arena.</span>}
      </span>
    </div>
  )
}

/** Temporary simplified stand-in — replaceable, clearly not the official art. */
export function TemporaryMark({ boxSize = 20 }) {
  return (
    <svg width={boxSize - 10} height={boxSize - 10} viewBox="0 0 20 20" fill="none">
      <path d="M3.5 6.5L10 3l6.5 3.5v7L10 17l-6.5-3.5v-7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M6.5 8.5 10 10.5l3.5-2M10 10.5v4" stroke="#00D9FF" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Per-model glyph set. Color arrives via the --mc CSS variable only. */
export function ModelIcon({ id, size = 38, variant = 'md' }) {
  const glyphSize = Math.round(size * 0.52)
  const stroke = 1.8
  const glyph = (() => {
    switch (id) {
      case 'chatgpt':
        return (
          <svg width={glyphSize} height={glyphSize} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth={stroke} />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={stroke} />
            <path d="M12 4v5M12 15v5M4 12h5M15 12h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )
      case 'gemini':
        return (
          <svg width={glyphSize} height={glyphSize} viewBox="0 0 24 24" fill="none">
            <path d="M12 3c0 5 4 9 9 9-5 0-9 4-9 9 0-5-4-9-9-9 5 0 9-4 9-9Z" stroke="currentColor" strokeWidth={stroke} strokeLinejoin="round" />
          </svg>
        )
      case 'claude':
        return (
          <svg width={glyphSize} height={glyphSize} viewBox="0 0 24 24" fill="none">
            <polygon points="12,3 20,7.5 20,16.5 12,21 4,16.5 4,7.5" stroke="currentColor" strokeWidth={stroke} strokeLinejoin="round" />
            <path d="M8.5 12h7M12 8.5v7" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" />
          </svg>
        )
      case 'llama':
        return (
          <svg width={glyphSize} height={glyphSize} viewBox="0 0 24 24" fill="none">
            <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth={stroke} />
            <path d="M8 15l4-6 4 6" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      case 'mistral':
        return (
          <svg width={glyphSize} height={glyphSize} viewBox="0 0 24 24" fill="none">
            <path d="M4 17V7l5 5 3-3 3 3 5-5v10" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
      case 'grok':
      default:
        return (
          <svg width={glyphSize} height={glyphSize} viewBox="0 0 24 24" fill="none">
            <path d="M6 18 18 6M8 6h10v10" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )
    }
  })()

  return (
    <span className={`model-icon-badge variant-${variant}`} style={{ width: size, height: size }} aria-hidden="true">
      {glyph}
    </span>
  )
}

/* ---- utility icons (24×24 grid, 1.75 stroke, currentColor) ---- */

const svgProps = (size) => ({ width: size, height: size, viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': true })

export const IconCompare = ({ size = 20 }) => (
  <svg {...svgProps(size)}>
    <rect x="3" y="4" width="7" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
    <rect x="14" y="4" width="7" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
    <path d="M10 9h4M10 15h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
)

export const IconChallenge = ({ size = 20 }) => (
  <svg {...svgProps(size)}>
    <path d="M4 8h12l-3-3M20 16H8l3 3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const IconSynthesize = ({ size = 20 }) => (
  <svg {...svgProps(size)}>
    <path d="M5 6l7 7 7-7M12 13v7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="19" r="2" stroke="currentColor" strokeWidth="1.75" />
  </svg>
)

export const IconStepSelect = ({ size = 18 }) => (
  <svg {...svgProps(size)}>
    <rect x="3" y="5" width="7" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
    <rect x="14" y="5" width="7" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
  </svg>
)

export const IconStepQuestion = ({ size = 18 }) => (
  <svg {...svgProps(size)}>
    <path d="M4 6h16v10H8l-4 4V6Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    <path d="M8 10h8M8 13h5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
)

export const IconStepBattle = ({ size = 18 }) => (
  <svg {...svgProps(size)}>
    <path d="M6 7h12M6 12h9M6 17h12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    <circle cx="18" cy="12" r="2" fill="currentColor" />
  </svg>
)

export const IconStepAnswer = ({ size = 18 }) => (
  <svg {...svgProps(size)}>
    <path d="M9 12l2 2 4.5-4.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="4" y="4" width="16" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.75" />
  </svg>
)

export const IconArrowRight = ({ size = 16 }) => (
  <svg {...svgProps(size)}>
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const IconArrowLeft = ({ size = 16 }) => (
  <svg {...svgProps(size)}>
    <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const IconCheck = ({ size = 14 }) => (
  <svg {...svgProps(size)}>
    <path d="M5 12.5 9.5 17 19 7.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const IconCopy = ({ size = 16 }) => (
  <svg {...svgProps(size)}>
    <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.75" />
    <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" stroke="currentColor" strokeWidth="1.75" />
  </svg>
)

export const IconReset = ({ size = 16 }) => (
  <svg {...svgProps(size)}>
    <path d="M4 12c0-4.42 3.58-8 8-8 3.37 0 6.26 2.08 7.43 5M20 4v5h-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 12c0 4.42-3.58 8-8 8-3.37 0-6.26-2.08-7.43-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
)

export const IconReplyTarget = ({ size = 14 }) => (
  <svg {...svgProps(size)}>
    <path d="M6 5v9h12M14 10l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const IconMenu = ({ open = false, size = 20 }) =>
  open ? (
    <svg {...svgProps(size)}>
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ) : (
    <svg {...svgProps(size)}>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )

export const IconShare = ({ size = 16 }) => (
  <svg {...svgProps(size)}>
    <circle cx="6" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.75" />
    <circle cx="17.5" cy="6" r="2.4" stroke="currentColor" strokeWidth="1.75" />
    <circle cx="17.5" cy="18" r="2.4" stroke="currentColor" strokeWidth="1.75" />
    <path d="m8.2 10.8 7.1-3.6M8.2 13.2l7.1 3.6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
)

export const IconPrint = ({ size = 16 }) => (
  <svg {...svgProps(size)}>
    <path d="M7 8V4h10v4" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    <rect x="4" y="8" width="16" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.75" />
    <path d="M7 13h10v7H7z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
  </svg>
)

export const IconInfo = ({ size = 14 }) => (
  <svg {...svgProps(size)}>
    <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.75" />
    <path d="M12 11v5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    <circle cx="12" cy="8" r="1" fill="currentColor" />
  </svg>
)

export const IconContention = ({ size = 14 }) => (
  <svg {...svgProps(size)}>
    <path d="M12 4 21 19H3L12 4Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    <path d="M12 10v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    <circle cx="12" cy="16.5" r="0.9" fill="currentColor" />
  </svg>
)

export const IconConverge = ({ size = 14 }) => (
  <svg {...svgProps(size)}>
    <path d="M4 5c5 0 5 7 8 7M4 19c5 0 5-7 8-7M12 12h8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
)

export const IconTrash = ({ size = 15 }) => (
  <svg {...svgProps(size)}>
    <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const IconHistory = ({ size = 16 }) => (
  <svg {...svgProps(size)}>
    <path d="M4 12a8 8 0 1 0 2.5-5.8M4 4v4h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 8v4.5l3 1.8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const IconAlert = ({ size = 16 }) => (
  <svg {...svgProps(size)}>
    <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.75" />
    <path d="M12 7.5v5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    <circle cx="12" cy="16" r="1" fill="currentColor" />
  </svg>
)

export const IconSkip = ({ size = 15 }) => (
  <svg {...svgProps(size)}>
    <path d="M5 5l8 7-8 7V5Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
    <path d="M17 5v14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
)

export const IconLightning = ({ size = 16 }) => (
  <svg {...svgProps(size)}>
    <path d="M13 3 5 13.5h5.5L10 21l8-10.5h-5.5L13 3Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
  </svg>
)
