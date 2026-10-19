import { useCallback, useEffect, useState } from 'react'
import './styles/global.css'
import './App.css'
import Navbar from './components/Navbar'
import Landing from './components/Landing'
import Config from './components/Config'
import Arena from './components/Arena'
import Results from './components/Results'
import CompletedDebate from './components/CompletedDebate'
import History from './components/History'
import { getModelById } from './data/models'
import { generateBattle } from './services/battleService'
import { loadHistory, saveBattleToHistory } from './services/historyStore'
import { decodeDemoHash, clearDemoHash } from './services/shareLink'

const TITLES = {
  landing: 'SANGRAM AI — What Happens When AI Challenges AI?',
  config: 'Configure Battle — SANGRAM AI',
  arena: 'Debate Arena — SANGRAM AI',
  results: 'Final Answer — SANGRAM AI',
  debate: 'Full Debate — SANGRAM AI',
  history: 'Recent Battles — SANGRAM AI'
}

export default function App() {
  const [view, setView] = useState('landing')
  const [selected, setSelected] = useState([null, null])
  const [question, setQuestion] = useState('')
  const [battle, setBattle] = useState(null)
  const [starting, setStarting] = useState(false)
  const [fatalError, setFatalError] = useState('')
  const [fromHistory, setFromHistory] = useState(false)
  const [sharePrefilled, setSharePrefilled] = useState(false)
  const [savedToHistory, setSavedToHistory] = useState(false)
  const [historyEntries, setHistoryEntries] = useState(() => loadHistory())

  /* Shareable demo links: #demo=<question + two model ids> only. */
  useEffect(() => {
    const demo = decodeDemoHash(window.location.hash)
    if (!demo) return
    const a = getModelById(demo.modelIds[0])
    const b = getModelById(demo.modelIds[1])
    if (a || b) {
      setQuestion(demo.question)
      setSelected([a, a && b ? (b.id === a.id ? null : b) : b])
      setSharePrefilled(true)
      setView('config')
    }
    clearDemoHash()
  }, [])

  useEffect(() => {
    document.title = TITLES[view] || TITLES.landing
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }, [view])

  const goLandingSection = useCallback((section) => {
    setView('landing')
    setTimeout(() => {
      document.querySelector(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }, [])

  const goHome = useCallback(() => setView('landing'), [])
  const goEnter = useCallback(() => setView('config'), [])

  const startBattle = useCallback(() => {
    setFatalError('')
    setStarting(true)
    // Deterministic local generation — no network, no fake latency.
    try {
      const next = generateBattle(selected, question)
      setBattle(next)
      setSavedToHistory(false)
      setFromHistory(false)
      setView('arena')
    } catch (err) {
      setFatalError(
        `The arena engine could not start this battle (${err?.message || 'unexpected error'}). ` +
        'Two different models and a valid question are required — nothing was submitted anywhere.'
      )
    } finally {
      setStarting(false)
    }
  }, [selected, question])

  /* Battle finished in the arena → persist demo session, reveal results. */
  const handleBattleComplete = useCallback((finished) => {
    const saved = saveBattleToHistory(finished)
    setHistoryEntries(saved ? [saved, ...loadHistory()].slice(0, 12) : loadHistory())
    setSavedToHistory(Boolean(saved))
    setBattle(finished)
    setView('results')
  }, [])

  /* Abort mid-battle: dispose happens in Arena's cleanup; drop battle state. */
  const exitArena = useCallback(() => {
    setBattle(null)
    setFromHistory(false)
    setView('config')
  }, [])

  const tryAnother = useCallback(() => {
    setBattle(null)
    setQuestion('')
    setFatalError('')
    setFromHistory(false)
    setSharePrefilled(false)
    setView('config')
  }, [])

  const reopenHistoryEntry = useCallback((entry) => {
    const models = entry.fighters.map((f) => {
      const m = getModelById(f.modelId)
      return m || { id: f.modelId, name: f.name, provider: f.provider, modelLabel: f.modelLabel, accent: null, apiModel: null }
    })
    setSelected(models)
    setQuestion(entry.question)
    setBattle({
      id: entry.id,
      question: entry.question,
      fighters: entry.fighters,
      messages: entry.messages,
      roundSummaries: entry.roundSummaries || [],
      finalAnswer: entry.finalAnswer,
      insights: entry.insights,
      agreement: entry.agreement,
      source: entry.source
    })
    setFromHistory(true)
    setSavedToHistory(false)
    setView(entry.finalAnswer ? 'results' : 'debate')
  }, [])

  const openHistory = useCallback(() => {
    setHistoryEntries(loadHistory())
    setView('history')
  }, [])

  return (
    <div className="app-shell">
      <div className="bg-depth" aria-hidden="true" />
      <Navbar view={view} onNavigate={goLandingSection} onHome={goHome} onEnter={goEnter} />

      {view === 'landing' && <Landing onEnter={goEnter} onOpenHistory={openHistory} />}

      {view === 'config' && (
        <Config
          selected={selected}
          setSelected={setSelected}
          question={question}
          setQuestion={setQuestion}
          onStart={startBattle}
          starting={starting}
          fatalError={fatalError}
          onDismissFatal={() => setFatalError('')}
          sharePrefilled={sharePrefilled}
        />
      )}

      {view === 'arena' && (
        <Arena
          battle={battle}
          selected={selected}
          onComplete={handleBattleComplete}
          onExit={exitArena}
          onChangeFighters={goEnter}
        />
      )}

      {view === 'results' && (
        <Results
          battle={battle}
          selected={selected}
          savedToHistory={savedToHistory}
          fromHistory={fromHistory}
          onViewDebate={() => setView('debate')}
          onTryAnother={tryAnother}
        />
      )}

      {view === 'debate' && (
        <CompletedDebate
          battle={battle}
          selected={selected}
          fromHistory={fromHistory}
          onBackToResults={() => setView('results')}
          onNewBattle={tryAnother}
        />
      )}

      {view === 'history' && (
        <History entries={historyEntries} onReopen={reopenHistoryEntry} onEnterArena={goEnter} />
      )}
    </div>
  )
}
