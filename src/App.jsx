import { useEffect, useState, useRef } from 'react'
import './styles/global.css'
import './App.css'
import { models } from './data/models'
import { generateBattle, stages } from './services/battleService'

const examplePrompts = [
  "Python vs JavaScript for beginners.",
  "Which technology should I learn next?",
  "What is the best solution to this coding problem?",
  "Is remote work better than office work?",
  "What will AI look like in 2030?",
]

function Logo(){
  return (
    <div className="brand">
      <div className="brand-mark">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L20 7v10l-8 5-8-5V7l8-5z" stroke="currentColor" strokeWidth="1.7" />
          <path d="M12 2v20M20 7L4 17M4 7l16 10" stroke="currentColor" strokeWidth="1.2" opacity="0.9"/>
          <circle cx="12" cy="12" r="2.5" fill="currentColor"/>
        </svg>
      </div>
      <span>SANGRAM AI <sup>AI ARENA</sup></span>
    </div>
  )
}

function Navbar({ view, setView }){
  const [open, setOpen] = useState(false)
  const go = (v, section) => {
    setOpen(false)
    if(v === 'landing' && section){
      setView('landing')
      setTimeout(()=> document.querySelector(section)?.scrollIntoView({behavior:'smooth'}), 80)
    } else if(v === 'landing') {
      setView('landing')
      window.scrollTo({top:0, behavior:'smooth'})
    } else {
      setView(v)
      window.scrollTo({top:0, behavior:'smooth'})
    }
  }
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <button onClick={()=>go('landing')} style={{background:'none',border:'none',cursor:'pointer'}}>
          <Logo/>
        </button>
        <div className={`nav-links ${open?'open':''}`}>
          <a href="#home" onClick={(e)=>{e.preventDefault(); go('landing','#home')}}>Home</a>
          <a href="#how" onClick={(e)=>{e.preventDefault(); go('landing','#how')}}>How It Works</a>
          <a href="#models" onClick={(e)=>{e.preventDefault(); go('landing','#models')}}>Models</a>
          <a href="#about" onClick={(e)=>{e.preventDefault(); go('landing','#about')}}>About</a>
          <button className="btn-primary" style={{padding:'10px 18px', fontSize:'14px'}} onClick={()=>go('config')}>Enter Arena →</button>
        </div>
        <div className="nav-cta">
          <button className="hamburger" onClick={()=>setOpen(!open)} aria-label="menu">{open?'✕':'☰'}</button>
        </div>
      </div>
    </nav>
  )
}

function Hero({ setView }){
  return (
    <section id="home" className="hero">
      <div className="container hero-grid">
        <div>
          <div className="badge">● Live Simulated Battles • No API Keys Required</div>
          <h1 style={{marginTop:14}}>What Happens When <span>AI Challenges AI?</span></h1>
          <p className="hero-sub">Choose your AI models. Enter your question. Watch them challenge each other's reasoning and work toward one ultimate answer.</p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={()=>setView('config')}>Enter the Arena →</button>
            <button className="btn-secondary" onClick={()=>document.querySelector('#how')?.scrollIntoView({behavior:'smooth'})}>How It Works</button>
          </div>
          <div className="hero-stats">
            <div className="stat"><span style={{width:10,height:10,borderRadius:'50%',background:'var(--cyan)',display:'inline-block', boxShadow:'0 0 10px var(--cyan)'}}></span> <span><strong>4</strong> rounds + synthesis</span></div>
            <div className="stat">⚡ <span><strong>Shared</strong> timeline, not split chats</span></div>
            <div className="stat">🏆 <span><strong>1</strong> final answer</span></div>
          </div>
          <p style={{marginTop:14, fontSize:12, color:'var(--text-muted)'}}>Simulated experience — responses are mock demonstration data, not live model outputs.</p>
        </div>

        <div className="arena-visual" aria-hidden>
          <div className="arena-ring">
            <div className="vs-center">VS</div>
          </div>
          <div className="fighter left">
            <div className="fighter-avatar">◉</div>
            <b>ChatGPT</b>
            <span>OpenAI • GPT-4o</span>
          </div>
          <div className="fighter right">
            <div className="fighter-avatar">⬢</div>
            <b>Gemini</b>
            <span>Google • 1.5 Pro</span>
          </div>
          <div className="arena-bars"><i style={{height:10}}></i><i></i><i></i><i></i><i style={{height:16}}></i></div>
          <div style={{position:'absolute', bottom: 54, fontSize:11, color:'var(--text-secondary)', letterSpacing:'0.08em', textTransform:'uppercase', fontWeight:700}}>Shared Arena • Chronological Debate</div>
        </div>
      </div>
    </section>
  )
}

function Landing({ setView }){
  return (
    <>
      <Hero setView={setView}/>
      <section className="features">
        <div className="container">
          <div className="section-head">
            <h2>Three steps to one stronger answer</h2>
            <p>Pick your fighters, pose your question, and watch a structured debate converge into a single synthesis.</p>
          </div>
          <div className="feature-grid">
            <div className="fcard">
              <div className="ficon">⬢</div>
              <h3>Choose Your Models</h3>
              <p>Select two different AI models. Each has distinct strengths — creativity, reasoning, speed, or depth.</p>
            </div>
            <div className="fcard">
              <div className="ficon">⚔</div>
              <h3>Watch the AI Battle</h3>
              <p>Follow arguments, challenges, and rebuttals in one shared timeline — not two disconnected chats.</p>
            </div>
            <div className="fcard">
              <div className="ficon">🏆</div>
              <h3>Get One Final Answer</h3>
              <p>Receive one consolidated response based on the strongest insights from the entire debate.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="how">
        <div className="container">
          <div className="section-head">
            <h2>How It Works</h2>
            <p>A deliberate, stage-by-stage debate designed for clarity and convergence.</p>
          </div>
          <div className="steps">
            <div className="step"><div className="step-num">1</div><b>Select</b><p style={{color:'var(--text-secondary)', fontSize:13, marginTop:6}}>Choose two fighters from the catalog. Duplicate picks are blocked to keep the debate diverse.</p></div>
            <div className="step"><div className="step-num">2</div><b>Question</b><p style={{color:'var(--text-secondary)', fontSize:13, marginTop:6}}>Ask anything up to 1000 characters. Use example chips to start fast.</p></div>
            <div className="step"><div className="step-num">3</div><b>Battle</b><p style={{color:'var(--text-secondary)', fontSize:13, marginTop:6}}>4 rounds: openings → counters → rebuttals → final discussion, then synthesis.</p></div>
            <div className="step"><div className="step-num">4</div><b>Answer</b><p style={{color:'var(--text-secondary)', fontSize:13, marginTop:6}}>One premium card with the synthesized answer, plus insight cards per model.</p></div>
          </div>
        </div>
      </section>

      <section id="models" className="models-preview">
        <div className="container">
          <div className="section-head">
            <h2>Meet the Fighters</h2>
            <p>Mock model choices for the prototype — no real API calls. Clean, consistent cards with clear selection states.</p>
          </div>
          <div className="model-grid-mini">
            {models.slice(0,4).map(m=>(
              <div key={m.id} className="mmini">
                <div className="mmini-icon" style={{background:m.color}}>{m.icon}</div>
                <div><b style={{fontSize:14}}>{m.name}</b><br/><small style={{color:'var(--text-secondary)', fontSize:12}}>{m.provider} • {m.model}</small></div>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center', marginTop:18}}>
            <button className="btn-primary" onClick={()=>setView('config')}>Enter the Arena →</button>
          </div>
        </div>
      </section>

      <section id="about" className="about">
        <div className="container about-grid">
          <div>
            <h2 style={{fontFamily:'Space Grotesk', fontSize:28, fontWeight:800}}>About SANGRAM AI</h2>
            <p style={{color:'var(--text-secondary)', marginTop:10, lineHeight:1.7}}>Sangram means battle — a premium, futuristic arena where different AI minds challenge each other to produce one stronger answer. The experience is deliberately shared: one chronological timeline, clear round structure, and a single synthesis. Built as a frontend prototype with mock data, ready for real model orchestration later.</p>
            <div style={{display:'flex', gap:10, marginTop:16, flexWrap:'wrap'}}>
              <span className="badge">Frontend-only</span>
              <span className="badge" style={{background:'rgba(66,133,255,0.15)', borderColor:'rgba(66,133,255,0.25)', color:'#8AB4F8'}}>API-Ready Architecture</span>
            </div>
          </div>
          <div className="about-card">
            <h4 style={{fontSize:14, letterSpacing:'0.06em', textTransform:'uppercase', color:'var(--cyan)'}}>Vision</h4>
            <p style={{marginTop:8, color:'var(--text-secondary)', lineHeight:1.7}}>Different Minds. One Arena. Two models debate, scrutinize, and refine — synthesis distills the strongest insights into a single, readable final answer. No split screens, no duplicated answers — just one converging battle.</p>
            <div style={{marginTop:14, display:'flex', gap:8, flexWrap:'wrap'}}>
              <span className="chip">Glassmorphism</span><span className="chip">Cyan lighting</span><span className="chip">Responsive</span><span className="chip">Accessible</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <span>© {new Date().getFullYear()} SANGRAM AI — Different Minds. One Arena. Simulated battles for demonstration.</span>
          <span style={{display:'flex', gap:12}}><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Contact</a></span>
        </div>
      </footer>
    </>
  )
}

function Config({ selected, setSelected, question, setQuestion, setView, setBattleData, setStatus }){
  const [error, setError] = useState("")
  const maxLen = 1000

  const selectModel = (model, slotIdx) => {
    setError("")
    const otherIdx = slotIdx === 0 ? 1 : 0
    if(selected[otherIdx]?.id === model.id){
      setError(`“${model.name}” is already selected in the other slot. Choose a different model.`)
      return
    }
    const next = [...selected]
    next[slotIdx] = model
    setSelected(next)
  }
  const clearSlot = (idx) => {
    const next = [...selected]; next[idx]=null; setSelected(next); setError("")
  }
  const canStart = selected[0] && selected[1] && question.trim().length >= 10 && question.length <= maxLen

  const start = () => {
    if(!canStart) return
    const data = generateBattle(selected, question)
    setBattleData(data)
    setStatus('ready')
    setView('arena')
  }

  return (
    <div className="container config-wrap">
      <div className="config-head">
        <div className="badge">Step 1 of 2 • Configuration</div>
        <h1 style={{marginTop:10}}>Choose Your AI Fighters</h1>
        <p>Choose two AI models to enter the arena.</p>
        {error && <div className="error-msg" style={{marginTop:12}}>{error}</div>}
      </div>

      <div className="slots">
        {[0,1].map(idx=>(
          <div key={idx} className={`slot ${selected[idx]?'selected':''}`}>
            <div className="slot-head">
              <h3>Slot {idx+1} {selected[idx]?'• Ready':''}</h3>
              {selected[idx] && <button className="btn-ghost" onClick={()=>clearSlot(idx)}>Change</button>}
            </div>
            {!selected[idx] ? (
              <div className="slot-empty">
                <div>
                  <div style={{fontSize:22, marginBottom:6}}>⬡</div>
                  <div style={{fontWeight:700, color:'var(--text-primary)'}}>No fighter selected</div>
                  <div style={{fontSize:12, marginTop:4}}>Pick a model from the catalog below</div>
                </div>
              </div>
            ) : (
              <div className="slot-chosen">
                <div className="slot-chosen-icon" style={{background: selected[idx].color}}>{selected[idx].icon}</div>
                <div style={{flex:1}}>
                  <b style={{fontSize:15}}>{selected[idx].name}</b> <small style={{color:'var(--text-secondary)'}}>• {selected[idx].provider}</small>
                  <div style={{fontSize:12, color:'var(--text-secondary)', marginTop:2}}>{selected[idx].model}</div>
                </div>
              </div>
            )}
          </div>
        ))}
        <div className="vs-col">
          <div className="vs-badge">VS</div>
          <small style={{color:'var(--text-muted)', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase'}}>Best of 4 Rounds</small>
        </div>
      </div>

      <div className="catalog">
        <h4>Model Catalog — Click to select (simulated, no API)</h4>
        <div className="catalog-grid">
          {models.map(m=>{
            const isSelected = selected[0]?.id===m.id || selected[1]?.id===m.id
            const isInOtherSlot = selected.some(s=>s?.id===m.id)
            return (
              <div key={m.id}
                className={`mcard ${isSelected?'selected':''} ${isInOtherSlot && !isSelected?'disabled':''}`}
                onClick={()=>{
                  // pick first empty slot, else slot 1
                  if(isSelected) return
                  if(!selected[0]) selectModel(m,0)
                  else if(!selected[1]) selectModel(m,1)
                  else selectModel(m,1) // replace second
                }}
                role="button" tabIndex={0}
                onKeyDown={(e)=>{if(e.key==='Enter') { e.preventDefault(); if(!selected[0]) selectModel(m,0); else if(!selected[1]) selectModel(m,1)}}}
                aria-label={`Select ${m.name} by ${m.provider}`}
              >
                {isSelected && <div className="check">✓</div>}
                <div className="mcard-top">
                  <div className="mcard-icon" style={{background:m.color}}>{m.icon}</div>
                  <div><h5>{m.name}</h5><small>{m.provider} • {m.model}</small></div>
                </div>
                <p>{m.desc}</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="question-section">
        <h3>What Should They Battle Over?</h3>
        <p>Your question drives the debate. Be specific for a tighter synthesis.</p>
        <div className="textarea-wrap">
          <textarea
            value={question}
            onChange={e=>setQuestion(e.target.value.slice(0,maxLen))}
            placeholder="Ask anything. Let the AI models challenge each other's reasoning..."
            maxLength={maxLen}
            aria-label="Battle question"
          />
          <div className={`counter ${question.length>800?'warn':''} ${question.length>=maxLen?'error':''}`}>{question.length} / {maxLen}</div>
        </div>
        <div className="chips">
          {examplePrompts.map(p=>(
            <button key={p} className="chip" onClick={()=>setQuestion(p)}>{p}</button>
          ))}
        </div>
        <div className="start-bar">
          <div className="hint">
            {question.trim().length>0 && question.trim().length<10 && <span style={{color:'#FF8A80'}}>Question too short — add a bit more detail (min 10 chars)</span>}
            {question.trim().length>=10 && <span style={{color:'#4ADE80'}}>✓ Ready to battle</span>}
            {question.trim().length===0 && <span>Enter a question to enable Start Battle</span>}
          </div>
          <button className="btn-primary" disabled={!canStart} onClick={start} aria-disabled={!canStart}>
            Start Battle → {!canStart && <span style={{opacity:0.7, fontWeight:500, fontSize:12}}>({!selected[0]||!selected[1] ? 'select 2 models' : question.trim().length<10 ? 'question too short' : 'ready'})</span>}
          </button>
        </div>
        <div className="sim-badge">◉ Simulated battle • Demonstration data only</div>
      </div>
    </div>
  )
}

function Arena({ selected, question, battleData, view, setView, setFinalAnswer, setInsightsState, onReset }){
  const [revealed, setRevealed] = useState([])
  const [stageIdx, setStageIdx] = useState(0)
  const [typing, setTyping] = useState(false)
  const [status, setStatus] = useState('running') // running, synthesizing, completed
  const listRef = useRef(null)
  const timersRef = useRef([])

  // init battle simulation
  useEffect(()=>{
    if(!battleData) return
    setRevealed([])
    setStageIdx(0)
    setTyping(true)
    setStatus('running')

    let idx = 0
    const total = battleData.messages.length

    function scheduleNext(){
      if(idx >= total){
        setTyping(true)
        setStageIdx(4) // synthesis
        setStatus('synthesizing')
        const t = setTimeout(()=>{
          setStatus('completed')
          setTyping(false)
          // store final answer for results view
          setFinalAnswer(battleData.finalAnswer)
          setInsightsState(battleData.insights)
          // auto navigate to results after short pause
          setTimeout(()=> setView('results'), 900)
        }, 1800)
        timersRef.current.push(t)
        return
      }
      const msg = battleData.messages[idx]
      const delay = 1200 + Math.random()*700
      const t = setTimeout(()=>{
        setRevealed(prev=>[...prev, msg])
        setStageIdx(msg.round -1)
        if(msg.round>4) setStageIdx(3)
        // small typing gap
        setTyping(true)
        idx++
        // update stage indicator: if next msg is new round, flash
        scheduleNext()
      }, delay)
      timersRef.current.push(t)
      // show typing false briefly between? keep true for simplicity but toggle
      setTyping(false)
      const t2 = setTimeout(()=>setTyping(true), delay - 300)
      timersRef.current.push(t2)
    }

    scheduleNext()

    return ()=>{
      timersRef.current.forEach(clearTimeout)
      timersRef.current=[]
    }
  }, [battleData])

  useEffect(()=>{
    if(listRef.current){
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [revealed, typing])

  const skip = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current=[]
    if(battleData){
      setRevealed(battleData.messages)
      setStageIdx(4)
      setStatus('completed')
      setTyping(false)
      setFinalAnswer(battleData.finalAnswer)
      setInsightsState(battleData.insights)
      setView('results')
    }
  }

  const progressLabel = status==='synthesizing' ? 'Synthesizing...' : status==='completed' ? 'Completed' : 'Live'

  if(!selected[0] || !selected[1]) return <div className="container" style={{padding:40}}>Missing models. <button className="btn-primary" onClick={()=>setView('config')}>Go to config</button></div>
  if(!battleData) return <div className="container" style={{padding:40}}>No battle data. <button className="btn-primary" onClick={()=>setView('config')}>Configure</button></div>

  return (
    <div className="container arena-page">
      <div className="arena-header">
        <div className="arena-models">
          <div className="arena-model"><i style={{background:selected[0].color}}>{selected[0].icon}</i><b style={{fontSize:13}}>{selected[0].name}</b> <small style={{color:'var(--text-secondary)', fontSize:11}}>{selected[0].provider}</small></div>
          <div className="arena-vs">VS</div>
          <div className="arena-model"><i style={{background:selected[1].color}}>{selected[1].icon}</i><b style={{fontSize:13}}>{selected[1].name}</b> <small style={{color:'var(--text-secondary)', fontSize:11}}>{selected[1].provider}</small></div>
          <span className="live" style={{marginLeft:8}}>{progressLabel}</span>
        </div>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <span style={{fontSize:12, color:'var(--text-secondary)', fontWeight:600}}>Round {Math.min(stageIdx+1,5)} of 5</span>
          <button className="btn-ghost" onClick={skip}>Skip to Results →</button>
          <button className="btn-ghost" onClick={onReset}>Exit Arena</button>
        </div>
        <div className="arena-question"><b style={{color:'var(--cyan)'}}>Battle Question:</b> “{question}” <span style={{marginLeft:8, background:'rgba(255,193,7,0.12)', border:'1px solid rgba(255,193,7,0.22)', color:'#FFD54F', padding:'2px 8px', borderRadius:999, fontSize:10, fontWeight:700}}>SIMULATED</span></div>
      </div>

      <div className="arena-layout">
        <aside className="progress-card">
          <h4>Battle Progress</h4>
          <div className="stage-list">
            {stages.map((s,i)=>(
              <div key={s.id} className={`stage ${i===stageIdx?'active':''} ${i<stageIdx?'done':''}`}>
                <i>{i<stageIdx?'✓':i+1}</i>
                <div><b>{s.label}</b><span>{i===4?'Consolidated answer':`Round ${s.round}`}</span></div>
              </div>
            ))}
          </div>
          <div className="mobile-stepper" aria-label="progress">
            {stages.map((s,i)=>(
              <div key={s.id} className={`mstep ${i===stageIdx?'active':''} ${i<stageIdx?'done':''}`}>{i<stageIdx?'✓':i+1} {s.label}</div>
            ))}
          </div>
          <div style={{marginTop:12, background:'rgba(7,20,38,0.8)', border:'1px solid var(--border)', borderRadius:10, padding:'10px 12px', fontSize:12, color:'var(--text-secondary)'}}>
            <b style={{color:'var(--text-primary)', fontSize:12}}>Shared Timeline</b><br/>Both models respond to each other chronologically — not two separate chats.
          </div>
        </aside>

        <div className="timeline">
          <div className="timeline-head">
            <h3>Shared Debate Timeline</h3>
            <span style={{fontSize:11, color:'var(--text-muted)', display:'flex', gap:8, alignItems:'center'}}>
              <span style={{width:8,height:8, borderRadius:'50%', background: status==='completed'?'#4ADE80':'#00D9FF', display:'inline-block'}}></span>
              {status==='completed'?'Battle Complete': status==='synthesizing'?'Synthesizing Final Answer…':'Live Debate — Messages appear chronologically'}
            </span>
          </div>
          <div className="timeline-list" ref={listRef}>
            {revealed.map(m=>{
              const isA = m.speaker==='A'
              return (
                <div key={m.id} className="msg">
                  <div className="msg-avatar" style={{background: m.color}}>{m.icon}</div>
                  <div className={`msg-body ${isA?'ownA':'ownB'}`}>
                    <div className="msg-meta">
                      <b>{m.modelName}</b> <small>Round {m.round}</small> <em>• {m.timestamp}</em>
                      <span style={{marginLeft:'auto', fontSize:10, color:'var(--text-muted)', fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase'}}>{m.provider}</span>
                    </div>
                    <p>{m.text}</p>
                    {m.addressing && <div className="reply">↳ Addressing: {m.addressing}</div>}
                  </div>
                </div>
              )
            })}
            {(typing && status!=='completed') && (
              <div className="typing" aria-live="polite">
                <i></i><i></i><i></i>
                <span style={{marginLeft:6}}>
                  {status==='synthesizing' ? 'Synthesizing final answer from strongest insights...' : `${battleData.messages[revealed.length]?.modelName || selected[0].name} is preparing a response...`}
                </span>
              </div>
            )}
            {status==='completed' && (
              <div style={{background:'linear-gradient(135deg, rgba(0,217,255,0.12), rgba(66,133,255,0.12))', border:'1px solid rgba(0,217,255,0.22)', borderRadius:12, padding:12, textAlign:'center'}}>
                <b style={{color:'var(--cyan)'}}>✓ All 4 rounds complete — synthesis ready</b>
                <div style={{fontSize:12, color:'var(--text-secondary)', marginTop:4}}>View the consolidated answer</div>
                <button className="btn-primary" style={{marginTop:10}} onClick={()=>setView('results')}>View Final Answer →</button>
              </div>
            )}
          </div>
          <div className="arena-actions">
            <button className="btn-ghost" onClick={skip}>Skip to Results →</button>
            <button className="btn-secondary" onClick={()=>setView('config')}>Change Models</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Results({ selected, question, finalAnswer, insights, setView, battleData, setBattleData, setQuestion, setSelected }){
  const [feedback, setFeedback] = useState("")
  const copy = async () => {
    try{
      if(navigator.clipboard?.writeText){
        await navigator.clipboard.writeText(finalAnswer)
        setFeedback("✓ Copied to clipboard!")
      } else {
        // fallback
        const ta = document.createElement('textarea')
        ta.value = finalAnswer
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        ta.remove()
        setFeedback("✓ Copied!")
      }
    } catch{
      setFeedback("Copy failed — please select and copy manually.")
    }
    setTimeout(()=>setFeedback(""), 2500)
  }

  const tryAnother = () => {
    // spec: clear question, messages, progress, synthesis, restore defaults (empty)
    setQuestion("")
    setBattleData(null)
    // keep models? spec says restore appropriate defaults or empty slots — we clear to empty for fresh
    setSelected([null,null])
    setView('config')
    window.scrollTo({top:0, behavior:'smooth'})
  }

  const viewDebate = () => {
    setView('arena-done')
  }

  return (
    <div className="container results-wrap">
      <div className="results-head">
        <div className="badge">Synthesis Complete • One Answer</div>
        <h1 style={{marginTop:10}}>🏆 SANGRAM AI: FINAL ANSWER</h1>
        <p>Synthesized from the strongest insights of the debate.</p>
        <div className="arena-question" style={{marginTop:12, textAlign:'left', maxWidth:760, marginInline:'auto'}}>
          <b>Question:</b> “{question}” <span style={{marginLeft:6, fontSize:10, background:'rgba(255,255,255,0.08)', padding:'3px 8px', borderRadius:999, border:'1px solid var(--border)'}}>{selected[0]?.name} vs {selected[1]?.name}</span>
        </div>
        <div className="sim-badge">◉ Simulated synthesis • Demonstration content only</div>
      </div>

      <div className="final-card">
        <b>Consolidated Final Answer • SANGRAM Synthesis Engine</b>
        <p>{finalAnswer}</p>
      </div>

      <div className="insights">
        <div className="insight">
          <h4><i style={{background: selected[0]?.color || '#00D9FF'}}>{selected[0]?.icon || '◉'}</i> Strongest from {selected[0]?.name || 'Model A'}</h4>
          <p>{insights?.a || 'No insights available.'}</p>
        </div>
        <div className="insight">
          <h4><i style={{background: selected[1]?.color || '#4285FF'}}>{selected[1]?.icon || '⬢'}</i> Strongest from {selected[1]?.name || 'Model B'}</h4>
          <p>{insights?.b || 'No insights available.'}</p>
        </div>
      </div>

      <div className="result-actions">
        <button className="btn-primary" onClick={copy}>Copy Answer</button>
        <button className="btn-secondary" onClick={viewDebate}>View Full Debate →</button>
        <button className="btn-ghost" onClick={tryAnother}>Try Another Battle ↺</button>
      </div>
      {feedback && <div className={`copy-feedback ${feedback.includes('failed')?'err':'ok'}`}>{feedback}</div>}

      <div style={{textAlign:'center', marginTop:16, fontSize:12, color:'var(--text-muted)'}}>
        This synthesis is mock demonstration data tailored to your question. It does not represent a verified expert answer.
      </div>
    </div>
  )
}

function CompletedDebate({ selected, question, battleData, setView }){
  // read-only timeline
  return (
    <div className="container arena-page">
      <div style={{display:'flex', justifyContent:'space-between', gap:12, alignItems:'center', flexWrap:'wrap', marginBottom:14}}>
        <h2 style={{fontFamily:'Space Grotesk'}}>Full Debate Timeline — Completed</h2>
        <div style={{display:'flex', gap:8}}>
          <button className="btn-primary" onClick={()=>setView('results')}>← Back to Final Answer</button>
          <button className="btn-ghost" onClick={()=>setView('config')}>New Battle</button>
        </div>
      </div>
      <div className="arena-header">
        <div className="arena-models">
          <div className="arena-model"><i style={{background:selected[0]?.color}}>{selected[0]?.icon}</i>{selected[0]?.name} <small style={{color:'var(--text-secondary)'}}>{selected[0]?.provider}</small></div>
          <div className="arena-vs">VS</div>
          <div className="arena-model"><i style={{background:selected[1]?.color}}>{selected[1]?.icon}</i>{selected[1]?.name} <small style={{color:'var(--text-secondary)'}}>{selected[1]?.provider}</small></div>
        </div>
        <div className="arena-question"><b>Question:</b> {question}</div>
      </div>
      <div className="timeline" style={{marginTop:16}}>
        <div className="timeline-list" style={{maxHeight:'none'}}>
          {battleData?.messages.map(m=>(
            <div key={m.id} className="msg">
              <div className="msg-avatar" style={{background:m.color}}>{m.icon}</div>
              <div className={`msg-body ${m.speaker==='A'?'ownA':'ownB'}`}>
                <div className="msg-meta"><b>{m.modelName}</b><small>Round {m.round}</small><em>• {m.timestamp}</em></div>
                <p>{m.text}</p>
                {m.addressing && <div className="reply">↳ Addressing: {m.addressing}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function App(){
  const [view, setView] = useState('landing')
  const [selected, setSelected] = useState([null,null])
  const [question, setQuestion] = useState("")
  const [battleData, setBattleData] = useState(null)
  const [finalAnswer, setFinalAnswer] = useState("")
  const [insights, setInsights] = useState(null)

  // ensure view scrolls top
  useEffect(()=>{ window.scrollTo({top:0, behavior:'smooth'}) }, [view])

  const handleReset = () => {
    setView('config')
    // don't clear battleData unless user wants new; but allow exit
  }

  return (
    <div style={{minHeight:'100vh', background:'var(--bg-primary)'}}>
      <Navbar view={view} setView={setView}/>
      {view==='landing' && <Landing setView={setView}/>}
      {view==='config' && <Config selected={selected} setSelected={setSelected} question={question} setQuestion={setQuestion} setView={setView} setBattleData={setBattleData} setStatus={()=>{}}/>}
      {view==='arena' && <Arena selected={selected} question={question} battleData={battleData} view={view} setView={setView} setFinalAnswer={setFinalAnswer} setInsightsState={setInsights} onReset={handleReset}/>}
      {view==='arena-done' && <CompletedDebate selected={selected} question={question} battleData={battleData} setView={setView}/>}
      {view==='results' && <Results selected={selected} question={question} finalAnswer={finalAnswer} insights={insights} setView={setView} battleData={battleData} setBattleData={setBattleData} setQuestion={setQuestion} setSelected={setSelected}/>}
    </div>
  )
}
