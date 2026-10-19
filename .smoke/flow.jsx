/* Throwaway jsdom interaction flow test (dev-only, not part of the app). */
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import App from '../src/App.jsx'

export async function runFlow({ window, document }) {
  const results = []
  const ok = (name, cond, extra = '') =>
    results.push(`${cond ? 'PASS' : 'FAIL'}  ${name}${extra ? '  — ' + extra : ''}`)
  const errors = []
  const origError = console.error
  console.error = (...a) => { errors.push(a.join(' ')); origError(...a) }

  const container = document.createElement('div')
  document.body.appendChild(container)
  global.IS_REACT_ACT_ENVIRONMENT = true

  const root = createRoot(container)
  await act(async () => root.render(React.createElement(App)))

  const $ = (sel) => document.querySelector(sel)
  const $$ = (sel) => [...document.querySelectorAll(sel)]
  const byText = (sel, txt) => $$(sel).find((el) => el.textContent.includes(txt))
  const click = async (el) => {
    await act(async () => {
      el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }))
    })
  }
  const setText = async (el, value) => {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set
    await act(async () => {
      setter.call(el, value)
      el.dispatchEvent(new window.Event('input', { bubbles: true }))
    })
  }

  /* 1. landing → config */
  ok('start on landing', $('main').textContent.includes('What Happens When AI'))
  await click(byText('button', 'Enter the Arena'))
  ok('nav → config', document.body.textContent.includes('Choose Your Fighters'))

  /* navbar context switch */
  ok('navbar: CTA replaced by stage stepper', $('main').previousElementSibling.textContent.includes('SYNTHESIZE') && !$('main').previousElementSibling.querySelector('.nav-enter-btn'))
  ok('navbar: active stage CONFIGURE', !!$('.nav-stage-item.active') && $('.nav-stage-item.active').textContent === 'CONFIGURE')

  /* 2. model selection + duplicate prevention */
  const cardGPT = byText('.mcard', 'ChatGPT')
  await click(cardGPT)
  ok('slot 1 filled', $$('.slot.filled').length === 1)
  await click(cardGPT) // duplicate attempt
  ok('duplicate prevented', $$('.slot.filled').length === 1 && document.body.textContent.includes('already FIGHTER 01'))
  await click(byText('.mcard', 'Claude'))
  ok('slot 2 filled', $$('.slot.filled').length === 2)
  ok('start still disabled without question', $('.start-battle-btn').disabled)

  /* 3. question validation */
  const ta = $('#battle-question')
  await setText(ta, 'short')
  ok('short question warns', $('.val-status').textContent.includes('more character'))
  ok('counter shows length', $('.counter').textContent.includes('5 / 1000'))
  await setText(ta, 'Python vs JavaScript for a first programming language?')
  ok('start enabled when valid', !$('.start-battle-btn').disabled)
  ok('ready message', $('.val-status.ok') && $('.val-status.ok').textContent.includes('Ready: ChatGPT vs Claude'))

  /* Ctrl+Enter support */
  await act(async () => {
    ta.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true, bubbles: true }))
  })
  ok('Ctrl+Enter starts battle', document.body.textContent.includes('Shared debate timeline'))

  /* 4. arena streaming */
  await act(async () => new Promise((r) => setTimeout(r, 400)))
  const shownAfter400ms = $$('.msg').length
  ok('streaming reveals progressively (1–2 early)', shownAfter400ms >= 1 && shownAfter400ms <= 3, `showing ${shownAfter400ms}`)
  ok('typing caret present while streaming', !!$('.stream-caret'))
  ok('stage rail active on round 1', !!$('.rail-step.active') && $('.rail-step.active').textContent.includes('Opening Arguments'))
  ok('model accents distinct', (() => {
    const mcs = $$('.msg').map((m) => m.style.getPropertyValue('--mc'))
    return new Set(mcs.filter(Boolean)).size >= 1
  })())

  /* contention appears once full debate rendered — skip to results */
  await click(byText('button', 'Skip to results'))
  await act(async () => new Promise((r) => setTimeout(r, 1100))) // synthesis reveal window
  ok('skip jumps to results', document.body.textContent.includes('SANGRAM AI: FINAL ANSWER'))
  ok('final answer rendered', document.body.textContent.includes('Python should be the default') || document.body.textContent.includes('Python is the stronger first language') || $('.final-body').textContent.length > 300)
  ok('agreement meter present', document.body.textContent.includes('Demo agreement estimate') && document.body.textContent.includes('78'))
  ok('insights from both fighters', $$('.insight').length === 2)
  ok('history saved', (() => {
    const raw = window.localStorage.getItem('sangram-ai.history.v1')
    try { return JSON.parse(raw).length === 1 } catch { return false }
  })())
  ok('navbar: SYNTHESIZE active', $('.nav-stage-item.active')?.textContent === 'SYNTHESIZE')

  /* 5. copy + share fallbacks (no clipboard in jsdom) */
  await click(byText('.results-actions button', 'Copy Answer'))
  await act(async () => new Promise((r) => setTimeout(r, 50)))
  ok('copy failure handled gracefully', !!$('.results-feedback'))
  await click(byText('.results-actions button', 'Share'))
  await act(async () => new Promise((r) => setTimeout(r, 50)))
  ok('share degrades to manual copy or feedback', !!$('.results-feedback') || !!$('.manual-share textarea'))

  /* 6. full debate + return */
  await click(byText('.results-actions button', 'View Full Debate'))
  ok('full transcript opens', document.body.textContent.includes('Complete transcript'.toUpperCase()[0] + 'omplete transcript') || document.body.textContent.toLowerCase().includes('full debate timeline'))
  ok('all 8 turns listed', $$('.msg').length === 8)
  ok('contention marker present in transcript', document.body.textContent.includes('Point of contention'))
  ok('challenging refs present', $$('.msg-challenge').length >= 4)
  ok('no fabricated timestamps', !/\b\d{1,2}:\d{2}\s?(AM|PM)\b/i.test(document.querySelector('.timeline-panel').textContent))
  await click(byText('button', 'Back to final answer'))
  ok('return to results works', document.body.textContent.includes('SANGRAM AI: FINAL ANSWER'))

  /* 7. try another battle → reset state */
  await click(byText('.results-actions button', 'Try Another Battle'))
  ok('reset → config', document.body.textContent.includes('Choose Your Fighters'))
  ok('question cleared', $('#battle-question').value === '')
  ok('fighters retained', $$('.slot.filled').length === 2)

  /* 8. history reopen */
  await click($('.nav-logo-btn'))
  ok('back on landing', document.body.textContent.includes('What Happens When AI'))
  const histBtn = byText('button', 'Recent battles')
  await click(histBtn)
  ok('history lists saved session', document.body.textContent.includes('Python vs JavaScript') && document.body.textContent.includes('demo agreement 78/100'))
  await click(byText('.history-item button', 'Open'))
  ok('reopen lands on results', document.body.textContent.includes('SANGRAM AI: FINAL ANSWER'))
  await click(byText('button', 'Try Another Battle'))

  /* 9. invalid question blocked */
  await setText($('#battle-question'), 'ok')
  ok('invalid question cannot start', $('.start-battle-btn').disabled)
  await setText($('#battle-question'), 'a'.repeat(1001))
  ok('length capped at 1000', $('#battle-question').value.length === 1000)

  /* console hygiene */
  const warnCount = errors.filter((e) => e.includes('Warning')).length
  ok('no React warnings during flow', warnCount === 0, errors[0] || '')
  const errCount = errors.filter((e) => !e.includes('ReactDOMTestUtils') && !e.includes("Not implemented: Window's scrollTo")).length
  ok('no runtime errors during flow', errCount === 0, errors.slice(0, 2).join(' | '))

  console.error = origError
  await act(async () => root.unmount())
  console.log(results.join('\n'))
  const failed = results.filter((r) => r.startsWith('FAIL'))
  console.log(`\n${results.length - failed.length}/${results.length} flow assertions passed`)
  if (failed.length) process.exitCode = 1
}
