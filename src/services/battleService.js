// Mock battle generator - deterministic, frontend only
const SPECIFIC_ANSWER = "For most beginners without a specific specialization in mind, Python is an excellent first programming language because its readable syntax helps learners understand programming fundamentals. It also offers opportunities in automation, data science, scripting, and AI. However, if your primary goal is to develop interactive websites, JavaScript is the more direct starting point. The best choice ultimately depends on what you want to build: begin with Python for general-purpose learning and AI exploration, or choose JavaScript for frontend web development."

function makeTimestamp(i) {
  const base = new Date()
  base.setMinutes(base.getMinutes() - (14 - i)*2)
  return base.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})
}

function buildPythonBattle(aName, bName){
  const msgs = [
    { round: 1, speaker: 'A', text: "Python is an excellent first language because its readable syntax helps beginners focus on programming fundamentals rather than complex syntax.", addressing: null },
    { round: 1, speaker: 'B', text: "Python is beginner-friendly, but JavaScript offers an immediate path to interactive websites. The best choice depends on what the learner wants to build.", addressing: null },
    { round: 2, speaker: 'A', text: "JavaScript provides a direct path to web development, but Python's readability and broad use across automation, data science, and AI make it a more versatile first language for many learners.", addressing: "the direct path to web development argument" },
    { round: 2, speaker: 'B', text: "Versatility is valuable, but early motivation matters too. Learners interested in building websites can get visible results with JavaScript and see how their code behaves in a browser.", addressing: "the versatility claim" },
    { round: 3, speaker: 'A', text: "Visible results are important, but Python also enables quick projects and a gentle introduction to core programming concepts. It remains a strong default for learners who are undecided.", addressing: "the motivation-through-visibility point" },
    { round: 3, speaker: 'B', text: "Agreed for undecided learners. However, recommending Python without considering a learner's goal could delay progress for someone whose main objective is frontend development.", addressing: "the gentle introduction claim" },
    { round: 4, speaker: 'A', text: "The decision should depend on learning goals, but Python is a strong general recommendation when the learner has no specific specialization in mind.", addressing: "goal-specific delay concern" },
    { round: 4, speaker: 'B', text: "That distinction resolves much of the disagreement. Python is a sensible general starting point; JavaScript is the more direct choice for interactive web development.", addressing: "the specialization qualifier" },
  ]
  return msgs
}

function genericMessages(question, aName, bName){
  const q = question.slice(0, 90)
  return [
    { round: 1, speaker: 'A', text: `${aName} opens: “${q}…” — this is a nuanced question. I argue we should prioritize first-principles thinking, weighing long-term impact over short-term convenience.`, addressing: null },
    { round: 1, speaker: 'B', text: `${bName} counters: Interesting framing, but practical constraints matter more. For “${q}” the real test is what delivers measurable outcomes quickly for most people.`, addressing: null },
    { round: 2, speaker: 'A', text: `Counterpoint: speed without depth creates fragile understanding. If we optimize only for quick wins on “${q}”, we risk shallow adoption that fails under complexity.`, addressing: "practical constraints argument" },
    { round: 2, speaker: 'B', text: `Rebuttal: depth is important, yet motivation is the engine of learning. For “${q}”, early tangible results keep people engaged long enough to pursue depth later.`, addressing: "fragile understanding claim" },
    { round: 3, speaker: 'A', text: `Even so, evidence across education shows strong fundamentals correlate with better long-term adaptability — especially relevant for evolving topics like “${q}”.`, addressing: "motivation engine point" },
    { round: 3, speaker: 'B', text: `Fair — but adaptability also comes from building. Learners benefit from a tight feedback loop where they ship something real related to “${q}” early.`, addressing: "long-term adaptability claim" },
    { round: 4, speaker: 'A', text: `Synthesis nearing: perhaps the best path is fundamentals-first with project-driven milestones tied to “${q}”.`, addressing: "feedback loop argument" },
    { round: 4, speaker: 'B', text: `Agreed. Define the outcome for “${q}”, then choose the minimal first step that proves momentum while leaving room to deepen fundamentals.`, addressing: "fundamentals-first synthesis" },
  ]
}

function otherTemplates(){
  return {
    remote: [
      { round: 1, speaker: 'A', text: "Remote work maximizes autonomy, access to global talent, and deep focus time — especially for knowledge workers.", addressing: null },
      { round: 1, speaker: 'B', text: "Office work fosters serendipitous collaboration, mentorship, and culture building that's hard to replicate remotely.", addressing: null },
      { round: 2, speaker: 'A', text: "Culture can be built intentionally with async rituals and periodic on-sites; daily commute isn't a prerequisite for trust.", addressing: "culture building claim" },
      { round: 2, speaker: 'B', text: "Intentional rituals help, but junior talent often grows faster with in-person observation and spontaneous feedback.", addressing: "async rituals argument" },
      { round: 3, speaker: 'A', text: "Remote also widens access for caregivers and those outside hubs — equity is a productivity multiplier.", addressing: "mentorship gap" },
      { round: 3, speaker: 'B', text: "True equity matters, and hybrid models may capture both: core collaboration days plus protected remote focus time.", addressing: "equity multiplier" },
      { round: 4, speaker: 'A', text: "Hybrid with clear norms — 2 anchor days + async documentation — resolves most tradeoffs.", addressing: "hybrid suggestion" },
      { round: 4, speaker: 'B', text: "Consensus: hybrid by default, remote-first tooling, and measuring output over presence.", addressing: "anchor days model" },
    ],
    tech: [
      { round:1, speaker:'A', text:"For next tech to learn, I'd prioritize fundamentals that compound: TypeScript + a modern full-stack framework.", addressing:null},
      { round:1, speaker:'B', text:"Alternatively, AI-augmented tooling + Python for data fluency may deliver higher career leverage right now.", addressing:null},
      { round:2, speaker:'A', text:"Career leverage is real, but framework fluency makes you shipping-ready — employers pay for shipped products.", addressing:"AI leverage claim"},
      { round:2, speaker:'B', text:"Shipping matters, yet AI literacy is becoming table stakes across roles — ignoring it risks obsolescence.", addressing:"shipping-ready argument"},
      { round:3, speaker:'A', text:"Combine both: learn TypeScript deeply, then layer AI-assisted workflows on top to 10x output.", addressing:"obsolescence point"},
      { round:3, speaker:'B', text:"Agreed — and validate with a portfolio project that demonstrates both engineering quality and AI integration.", addressing:"10x workflow claim"},
      { round:4, speaker:'A', text:"Roadmap: Week 1-4 TypeScript fundamentals, Week 5-8 full-stack project, Week 9-10 AI augmentations.", addressing:"portfolio validation"},
      { round:4, speaker:'B', text:"Supports that — measure progress by deployed project + measurable automation gains, not just tutorials.", addressing:"roadmap proposal"},
    ],
    solution: [
      { round:1, speaker:'A', text:"Break the coding problem into input → transform → output with explicit invariants before coding.", addressing:null},
      { round:1, speaker:'B', text:"Alternatively, start with examples and tests — let desired behavior drive the implementation.", addressing:null},
      { round:2, speaker:'A', text:"Test-first is great for clarity, but without invariants you risk tautological tests that mirror bugs.", addressing:"test-first approach"},
      { round:2, speaker:'B', text:"Invariants help, but over-formalizing early can stall — iterate quickly, then harden with property tests.", addressing:"invariants concern"},
      { round:3, speaker:'A', text:"Balance: sketch invariants lightly, write 3-5 critical tests, code the simplest pass, refactor.", addressing:"stall concern"},
      { round:3, speaker:'B', text:"Exactly — and timebox exploration; if stuck after 25 mins, switch strategy or seek a second perspective.", addressing:"balance proposal"},
      { round:4, speaker:'A', text:"Final recommendation: invariants + example tests + timeboxed iteration is robust for most coding challenges.", addressing:"timebox advice"},
      { round:4, speaker:'B', text:"Consensus: structured intent, concrete tests, iterative delivery — then optimize for readability and edge cases.", addressing:"structured intent"},
    ]
  }
}

function genericFinalAnswer(question, aName, bName){
  const shortQ = question.length > 180 ? question.slice(0,177)+'...' : question
  return `Synthesized answer for: “${shortQ}” — Both ${aName} and ${bName} converged on a balanced approach. Start with your core intent: define the outcome you want in the next 4–6 weeks, then choose the smallest step that proves momentum. Combine fundamentals with immediate application — learn the underlying principles while shipping a small, visible project. Review after two iterations and adjust based on what energized you most. This dual-track method respects both depth (long-term adaptability) and speed (motivation and feedback).`
}

function genericInsights(aName, bName, question){
  const q = question.slice(0,70)
  return {
    a: `${aName} emphasized structure and fundamentals for “${q}…” — readability, invariants, and compounding knowledge as the durable edge.`,
    b: `${bName} emphasized outcomes and immediacy — shipping visible results quickly to sustain momentum and validate direction.`
  }
}

export function generateBattle(selectedModels, question){
  const a = selectedModels[0]
  const b = selectedModels[1]
  const aName = a?.name || 'Model A'
  const bName = b?.name || 'Model B'
  const qLower = question.toLowerCase()

  let raw = null
  let finalAnswer = ""
  let insights = null

  if( (qLower.includes('python') && qLower.includes('javascript')) || qLower.includes('python vs javascript') ){
    raw = buildPythonBattle(aName, bName)
    finalAnswer = SPECIFIC_ANSWER
    insights = {
      a: `${aName} argued Python’s readability and versatility across automation, data science and AI make it ideal for undecided beginners.`,
      b: `${bName} argued JavaScript’s immediate path to interactive websites sustains motivation for learners focused on frontend goals.`
    }
  } else if(qLower.includes('remote') && (qLower.includes('office') || qLower.includes('work'))){
    raw = otherTemplates().remote
    finalAnswer = `Hybrid is the strongest resolution: adopt remote-first tooling, define 2 weekly anchor days for collaboration and mentorship, document decisions async, and measure output over presence. This preserves autonomy and global talent access while restoring serendipity, coaching, and culture. Rotate anchor days quarterly and review effectiveness with team health metrics.`
    insights = {
      a: `${aName} championed autonomy, focus time, and equity of access unlocked by remote work.`,
      b: `${bName} championed spontaneous collaboration, junior mentorship, and cultural cohesion from in-person presence.`
    }
  } else if(qLower.includes('which technology') || qLower.includes('learn next') || qLower.includes('what should i learn')){
    raw = otherTemplates().tech
    finalAnswer = `Learn TypeScript + a modern full-stack framework as your base (4 weeks fundamentals, 4 weeks shipped project), then layer AI-assisted development — prompt engineering, vector DBs, and automation — to amplify output. Validate with a portfolio project that shows both clean engineering and AI integration, measuring success by deployed functionality and time saved.`
    insights = {
      a: `${aName} prioritized shipping-ready full-stack fluency and compounding fundamentals.`,
      b: `${bName} prioritized AI literacy as near-term career leverage.`
    }
  } else if(qLower.includes('solution') || qLower.includes('coding problem')){
    raw = otherTemplates().solution
    finalAnswer = `Decompose the coding problem into inputs, transforms, and outputs with light invariants; write 3–5 example-driven tests that capture desired behavior; implement the simplest passing solution; then harden with edge cases and refactor for readability. Timebox exploration to 25 minutes per approach and switch strategy if stuck — structured intent plus iterative delivery beats premature optimization.`
    insights = {
      a: `${aName} stressed invariants and decomposition before coding to avoid tautological tests.`,
      b: `${bName} stressed example-driven tests and rapid iteration to maintain momentum.`
    }
  } else if(qLower.includes('ai') && qLower.includes('2030')){
    raw = genericMessages(question, aName, bName)
    // override some to be specific
    raw[0].text = `${aName}: By 2030, AI will be ambient — specialized agents orchestrated by personal AI OS, handling routine cognition while humans focus on judgment and creativity.`
    raw[1].text = `${bName}: By 2030, AI will be regulated & grounded — multimodal systems with verifiable reasoning, tightly integrated into physical work via robotics, not just chat.`
    finalAnswer = `By 2030, AI will likely be ambient and regulated: personal orchestration layers, specialized expert agents, verifiable multimodal reasoning, and embodied AI in physical workflows. The differentiator won’t be raw intelligence but trusted integration — human judgment plus AI execution, governed by provenance, safety standards, and continuous personalization.`
    insights = {
      a: `${aName} envisioned ambient, personalized orchestration where AI handles routine cognition.`,
      b: `${bName} envisioned verifiable, embodied AI deeply integrated into physical and regulated domains.`
    }
  } else {
    raw = genericMessages(question, aName, bName)
    finalAnswer = genericFinalAnswer(question, aName, bName)
    insights = genericInsights(aName, bName, question)
  }

  const roundTypeMap = {
    1: { label: 'Opening Argument', phase: 'Opening Arguments' },
    2: { label: 'Counterargument', phase: 'Counterarguments' },
    3: { label: 'Rebuttal', phase: 'Rebuttals' },
    4: { label: 'Final Discussion', phase: 'Final Discussion' }
  }

  const messages = raw.map((m, i) => {
    const isA = m.speaker === 'A'
    const currentModel = isA ? a : b
    const opponentModel = isA ? b : a
    const roundMeta = roundTypeMap[m.round] || { label: `Round ${m.round}`, phase: `Round ${m.round}` }
    return {
      id: `m-${i}`,
      round: m.round,
      stageLabel: roundMeta.label,
      phaseLabel: roundMeta.phase,
      speaker: m.speaker, // A or B
      modelId: currentModel.id,
      modelName: currentModel.name,
      opponentName: opponentModel.name,
      provider: currentModel.provider,
      modelVersion: currentModel.model,
      color: currentModel.color,
      icon: currentModel.icon,
      text: m.text,
      addressing: m.addressing,
      timestamp: makeTimestamp(i)
    }
  })

  return { messages, finalAnswer, insights }
}

export const stages = [
  { id: 1, label: "Opening Arguments", round: 1 },
  { id: 2, label: "Counterarguments", round: 2 },
  { id: 3, label: "Rebuttals", round: 3 },
  { id: 4, label: "Final Discussion", round: 4 },
  { id: 5, label: "Synthesis", round: 5 },
]
