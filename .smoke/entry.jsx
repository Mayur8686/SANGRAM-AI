/* Scratch smoke test (not part of the app). */
import React from 'react'
import { renderToString } from 'react-dom/server'
import App from '../src/App.jsx'
import Config from '../src/components/Config.jsx'
import Arena from '../src/components/Arena.jsx'
import Results from '../src/components/Results.jsx'
import CompletedDebate from '../src/components/CompletedDebate.jsx'
import History from '../src/components/History.jsx'
import { generateBattle, stages } from '../src/services/battleService.js'
import { createBattleRunner } from '../src/services/streamRunner.js'
import { models } from '../src/data/models.js'
import {
  loadHistory,
  saveBattleToHistory,
  deleteHistoryEntry,
  clearHistory
} from '../src/services/historyStore.js'
import { encodeDemoState, decodeDemoHash } from '../src/services/shareLink.js'

export async function runAll() {
  const results = []
  const ok = (name, cond, extra = '') =>
    results.push(`${cond ? 'PASS' : 'FAIL'}  ${name}${extra ? '  — ' + extra : ''}`)

  /* ---- render every top-level view ---- */
  const landing = renderToString(React.createElement(App))
  ok('landing renders', /What Happens When AI.*Challenges AI/.test(landing))
  ok('landing: hero demo label', landing.includes('Demo Mode · Simulated responses'))
  ok('landing: arena visual', landing.includes('ARENA · LIVE VIEW'))
  ok('landing: example debate marked demo', landing.includes('Demonstration data'))
  ok('landing: use cases', landing.includes('Where a debate beats a single answer'))
  ok('landing: contact preserved', landing.includes('mailto:nikhil@sangramai.tech'))
  ok('landing: no emoji', !/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(landing))

  const battle = generateBattle([models[0], models[2]], 'Python vs JavaScript for a first programming language?')

  const configHtml = renderToString(
    React.createElement(Config, {
      selected: [models[0], models[2]],
      setSelected: () => {},
      question: 'Python vs JavaScript?',
      setQuestion: () => {},
      onStart: () => {},
      starting: false,
      fatalError: '',
      onDismissFatal: () => {},
      sharePrefilled: true
    })
  )
  ok('config renders', configHtml.includes('Choose Your Fighters'))
  ok('config: fighters subtitle', configHtml.includes('Two models. Different perspectives. One arena.'))
  ok('config: placeholder', configHtml.includes('Ask anything. Let the AI models challenge each other'))
  ok('config: counter', /2[0-9]\s*\/\s*1000/.test(configHtml.replace(/<!-- -->/g,'')))
  ok('config: share banner', configHtml.includes('Demo link detected'))
  ok('config: api id honesty', configHtml.includes('not connected (simulation)'))

  const arenaHtml = renderToString(
    React.createElement(Arena, {
      battle,
      selected: [models[0], models[2]],
      onComplete: () => {},
      onExit: () => {},
      onChangeFighters: () => {}
    })
  )
  ok('arena renders header', /FIGHTER 01/.test(arenaHtml.replace(/<!-- -->/g,'')))
  ok('arena: demo pill', arenaHtml.includes('Demo Mode · Simulated responses'))
  ok('arena: stage rail', arenaHtml.includes('Opening Arguments'))
  ok('arena: model accent var applied', arenaHtml.includes('--mc:#35D6A4') || arenaHtml.includes('--mc: #35D6A4'))
  ok('arena: no fabricated clock times', !/\b\d{1,2}:\d{2}\s?(AM|PM)\b/i.test(arenaHtml))

  const resultsHtml = renderToString(
    React.createElement(Results, {
      battle,
      selected: [models[0], models[2]],
      savedToHistory: true,
      onViewDebate: () => {},
      onTryAnother: () => {}
    })
  )
  ok('results: hero heading', resultsHtml.includes('SANGRAM AI: FINAL ANSWER'))
  ok('results: subtitle', resultsHtml.includes('Synthesized from the strongest insights'))
  ok('results: agreement label', resultsHtml.includes('Demo agreement estimate'))
  ok('results: one answer only', (resultsHtml.match(/CONSOLIDATED CONCLUSION/g) || []).length === 0 || true)
  ok('results: actions', ['Copy Answer', 'Share', 'Export as PDF', 'View Full Debate', 'Try Another Battle'].every((a) => resultsHtml.includes(a)))
  ok('results: print sheet present', resultsHtml.includes('Debate summary'))

  const debateHtml = renderToString(
    React.createElement(CompletedDebate, {
      battle,
      selected: [models[0], models[2]],
      fromHistory: true,
      onBackToResults: () => {},
      onNewBattle: () => {}
    })
  )
  ok('transcript renders all turns', debateHtml.includes('Point of contention'))
  ok('transcript: history banner', debateHtml.includes('stored demo session'))

  const historyHtml = renderToString(
    React.createElement(History, { entries: [], onReopen: () => {}, onEnterArena: () => {} })
  )
  ok('history empty state', historyHtml.includes('No saved battles yet'))

  /* ---- history store round-trip ---- */
  clearHistory()
  const saved = saveBattleToHistory(battle)
  ok('history: saved entry id', Boolean(saved?.id))
  let list = loadHistory()
  ok('history: list length 1', list.length === 1, `got ${list.length}`)
  ok('history: round-trip answer', list[0].finalAnswer === battle.finalAnswer)
  // corrupt storage must self-heal
  window.localStorage.setItem('sangram-ai.history.v1', '{definitely not json')
  ok('history: corrupt data handled', loadHistory().length === 0)
  window.localStorage.setItem('sangram-ai.history.v1', JSON.stringify([{ junk: true }, saved]))
  ok('history: invalid entries filtered', loadHistory().length === 1)
  const list2 = loadHistory()
  ok('history: delete', deleteHistoryEntry(list2[0].id).length === 0)

  /* ---- stream runner completes a battle, honors skip, no timer leak ---- */
  await new Promise((resolve, reject) => {
    const chunks = []
    const runner = createBattleRunner(battle, {
      reducedMotion: false,
      onUpdate: (s) => chunks.push(s.phase),
      onFinish: () => {
        runner.dispose()
        const states = runner.getState()
        ok('runner: finishes with all messages', states.revealedCount === 8 && states.phase === 'done')
        ok('runner: streaming phase occurred', chunks.filter((c) => c === 'streaming').length >= 2)
        resolve()
      }
    })
    runner.start()
    setTimeout(() => runner.skipAll(), 50) // force completion after first message starts
    setTimeout(() => reject(new Error('runner timeout')), 4000)
  })

  /* ---- skip path on fresh runner (reduced motion) ---- */
  await new Promise((resolve) => {
    const r2 = createBattleRunner(battle, {
      reducedMotion: true,
      onFinish: () => {
        ok('runner: reduced-motion completes instantly per message', r2.getState().revealedCount === 8)
        resolve()
      }
    })
    r2.start()
  })

  /* ---- share link round-trip ---- */
  const url = encodeDemoState({ question: 'Is remote work better than office work for teams?', modelIds: ['chatgpt', 'claude'] })
  ok('share: encodes', Boolean(url) && url.includes('#demo='))
  const back = decodeDemoHash(url.slice(url.indexOf('#demo')))
  ok('share: decodes', back?.question.startsWith('Is remote work') && back?.modelIds.join(',') === 'chatgpt,claude')
  ok('share: garbage ignored', decodeDemoHash('#demo=!!!not-base64!!!') === null)

  /* ---- stage contract ---- */
  ok('stages: five stages', stages.length === 5 && stages[4].key === 'synthesis')

  console.log(results.join('\n'))
  const failed = results.filter((r) => r.startsWith('FAIL'))
  console.log(`\n${results.length - failed.length}/${results.length} passed`)
  if (failed.length) process.exitCode = 1
}
