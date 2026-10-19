/**
 * Shared model catalog — single source of truth for the homepage showcase,
 * the configuration screen, battle metadata and history records.
 *
 * IMPORTANT — prototype honesty:
 *   • No live provider APIs are connected. These are simulated fighter profiles.
 *   • `modelLabel` is a reference identifier for display only.
 *   • `apiModel` stays null until a secure backend maps a real integration.
 *
 * Accent tokens are defined once here and consumed everywhere via CSS custom
 * properties (--mc / --mc-soft / --mc-line) so speaker color never drifts.
 */

export const models = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    provider: 'OpenAI',
    modelLabel: 'GPT-5',
    apiModel: null, // not connected — frontend prototype
    desc: 'Structured, first-principles reasoning with broad general-knowledge fluency.',
    accent: { color: '#35D6A4', soft: 'rgba(53, 214, 164, 0.12)', line: 'rgba(53, 214, 164, 0.45)' }
  },
  {
    id: 'gemini',
    name: 'Gemini',
    provider: 'Google',
    modelLabel: 'Gemini 2.5 Pro',
    apiModel: null,
    desc: 'Long-context, multimodal architecture tuned for synthesis across sources.',
    accent: { color: '#5B9DFF', soft: 'rgba(91, 157, 255, 0.12)', line: 'rgba(91, 157, 255, 0.45)' }
  },
  {
    id: 'claude',
    name: 'Claude',
    provider: 'Anthropic',
    modelLabel: 'Claude Sonnet 4.5',
    apiModel: null,
    desc: 'Methodical, nuance-aware critique with careful epistemic hedging.',
    accent: { color: '#E9A05E', soft: 'rgba(233, 160, 94, 0.12)', line: 'rgba(233, 160, 94, 0.45)' }
  },
  {
    id: 'llama',
    name: 'Llama',
    provider: 'Meta',
    modelLabel: 'Llama 4',
    apiModel: null,
    desc: 'Open-weights flagship profile built for rigorous systems-level argumentation.',
    accent: { color: '#9B9CFF', soft: 'rgba(155, 156, 255, 0.13)', line: 'rgba(155, 156, 255, 0.45)' }
  },
  {
    id: 'mistral',
    name: 'Mistral',
    provider: 'Mistral AI',
    modelLabel: 'Mistral Large 2',
    apiModel: null,
    desc: 'High-efficiency profile with concise, code-forward, minimal-waste argumentation.',
    accent: { color: '#E4719B', soft: 'rgba(228, 113, 155, 0.12)', line: 'rgba(228, 113, 155, 0.45)' }
  },
  {
    id: 'grok',
    name: 'Grok',
    provider: 'xAI',
    modelLabel: 'Grok 4',
    apiModel: null,
    desc: 'Contrarian challenger profile that stress-tests conventional assumptions.',
    accent: { color: '#B9C6DA', soft: 'rgba(185, 198, 218, 0.12)', line: 'rgba(185, 198, 218, 0.4)' }
  }
]

export const getModelById = (id) => models.find((m) => m.id === id) || null

/**
 * CSS custom-property bag carrying a model's accent through inline styles.
 * Every surface that must show a model identity uses this helper — never a
 * hard-coded hex value in a component.
 */
export const accentVars = (model) => {
  if (!model || !model.accent) return {}
  return {
    '--mc': model.accent.color,
    '--mc-soft': model.accent.soft,
    '--mc-line': model.accent.line
  }
}

export const examplePrompts = [
  'Python vs JavaScript for a first programming language?',
  'Should I learn AI tooling or full-stack engineering next?',
  'Is remote work better than office work for engineering teams?',
  'What is the best approach to solve a hard coding problem under a deadline?',
  'What will applied AI look like in 2030?'
]
