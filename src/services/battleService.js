/**
 * SANGRAM AI — battle engine (frontend prototype)
 * ------------------------------------------------------------------
 * Deterministic mock battle source. No network calls, no randomness in
 * content: the same (fighters, question) always produces the same battle.
 *
 * This module is the seam where a real backend will plug in later.
 * The UI only ever consumes the normalized `battle` shape returned by
 * generateBattle() — see docs/BACKEND_CONTRACT.md for the streaming
 * contract a server must fulfill to replace this file.
 *
 * Message shape:
 *   {
 *     id, round, stageKey, stageLabel,
 *     speaker: 'A' | 'B', modelId, modelName, provider, modelLabel, accent,
 *     text,
 *     challenges:   { modelName, point } | null,   // what claim is being answered
 *     contention:   string | null,                 // explicit disagreement topic
 *     converging:   boolean                        // round-4 reconciliation
 *   }
 *
 * NOTE: no timestamps are fabricated. Ordering is conveyed by round
 * sequence alone, which is all a live debate timeline genuinely has.
 */

export const stages = [
  { id: 1, key: 'opening', label: 'Opening Arguments', round: 1, short: 'Open' },
  { id: 2, key: 'counter', label: 'Counterarguments', round: 2, short: 'Counter' },
  { id: 3, key: 'rebuttal', label: 'Rebuttals', round: 3, short: 'Rebut' },
  { id: 4, key: 'final', label: 'Final Discussion', round: 4, short: 'Final' },
  { id: 5, key: 'synthesis', label: 'Synthesis', round: 5, short: 'Sync' }
]

const stageForRound = (r) => stages.find((s) => s.round === r) || stages[0]

/* ------------------------------------------------------------------ */
/* Battle scripts. Each `messages` entry is one turn in the shared    */
/* timeline. `score`/`scoreNote` are clearly-labelled demo estimates. */
/* ------------------------------------------------------------------ */

const SCRIPTS = {
  languageChoice: {
    match: (q) => (q.includes('python') && q.includes('javascript')) || q.includes('first programming language'),
    score: 78,
    scoreNote:
      'Demo estimate from the simulated transcript: the models entered round 2 in direct conflict but conceded most of it by round 4. It measures stance convergence — not factual correctness.',
    messages: [
      {
        round: 1, speaker: 'A',
        text: 'Python should be the default first language. Its syntax reads close to pseudocode, so beginners spend their scarce cognitive budget on control flow, data and decomposition instead of semicolons, braces and casting rules. That transfer is measurable: the fundamentals learned in Python — variables, loops, functions, error handling — move cleanly into every later language. The ecosystem then multiplies the value: automation, data analysis, scripting and machine learning are all reachable from the same interpreter a learner started with.',
        contention: null, converging: false
      },
      {
        round: 1, speaker: 'B',
        text: 'I would argue the opposite priority: motivation first, fundamentals second. JavaScript runs everywhere the beginner already is — the browser — and it is the only language that gives an instant, visible, shareable loop: change a line, refresh, something moves. Beginners who pick Python for "readability" often stall in a REPL with nothing to show for it, while a week-one JavaScript learner has a page responding to input. Readability is a teacher\'s convenience; visible output is the learner\'s fuel.',
        contention: 'What a beginner should optimize for first — transferable fundamentals or fast, visible feedback.',
        converging: false
      },
      {
        round: 2, speaker: 'A',
        text: 'The feedback-loop argument confuses novelty with learning depth. Browser results are visible, but early JavaScript also drags beginners through traps that have nothing to do with fundamentals: the DOM, `this`, coercion rules, package.json, build tooling. "Just refresh the page" quietly becomes "first, understand why nothing rendered." Python defers that tax. A learner can build a file-renaming utility or a spreadsheet analysis in week two with real, tangible payoff and zero configuration — the feedback is just as immediate, without the runtime semantics ambushes.',
        challenges: "B's \"motivation first\" framing", contention: null, converging: false
      },
      {
        round: 2, speaker: 'B',
        text: 'Fair point on tooling friction — Python environments have their own traps — but versatility cuts both ways. A language that is good at everything is often deployed for nothing. Learners do not abandon JavaScript because it is hard; they abandon any language when weeks pass without a project they actually wanted. And the breadth claim deserves scrutiny: Python\'s "gentle" reputation collapses at scale, where dynamic typing forces discipline beginners have not yet built. JavaScript plus TypeScript teaches that discipline in the same breath, inside the platform with the largest deployment surface on Earth.',
        challenges: "A's \"environments are gentle\" claim", contention: null, converging: false
      },
      {
        round: 3, speaker: 'A',
        text: 'Where we actually disagree narrows to the learner\'s goal, and I will concede the case that shape it. For someone whose target is interactive products, frontend work, or anything client-side, JavaScript is not a distraction — it is the curriculum itself; learning it early is paying the right tuition. What I still reject is the default: for a beginner with no target yet, "learn to think programmatically first" beats "learn to ship to a browser first." Python in week one, then the language their goal demands — that sequence has never cost anyone meaningfully.',
        challenges: "B's momentum-over-transferability argument", contention: null, converging: true
      },
      {
        round: 3, speaker: 'B', challenges: 'A\'s falsifiable pre-mortem',
        text: 'And I will meet that halfway. The environments point lands — nothing kills beginner momentum like a pip resolution error before a single print statement runs. My revised claim: JavaScript is the better first language only when the learner\'s goal is visible, interactive, or web-adjacent; for the undecided learner, a short, deliberate Python phase — four to six weeks, fundamentals only, no framework churn — is a reasonable on-ramp. The true failure mode is neither language; it is a beginner picking one for prestige and abandoning it at the first wall.',
        challenges: "B's \"a date attached to each risk\" discipline", contention: null, converging: true
      },
      {
        round: 4, speaker: 'A',
        text: 'Final position: start with Python when the goal is open-ended — general literacy, automation, data, or AI exploration — because its fundamentals transfer and its week-two ceiling is high and its floor is low. Switch to JavaScript the moment the stated goal is a product in a browser. The question "which language" is nearly always the wrong one; "what do you want to be able to do on day 30" is the question, and Python and JavaScript simply answer different versions of it.',
        challenges: "B's claim that versatile means unfocused", contention: null, converging: false
      },
      {
        round: 4, speaker: 'B',
        text: 'Agreed, with one addition worth keeping from my side of the debate: momentum is a curriculum requirement, not a nice-to-have. So whichever language wins the goal question, the learner should ship a tiny real thing weekly from day one. My closing recommendation: undecided learners — Python first, six-week horizon, then reassess; product-minded learners — JavaScript immediately, TypeScript as soon as the project earns it. One starting point each, both valid, and the debate should retire on those terms.',
        challenges: "A's language-agnostic default rule", contention: null, converging: false
      }
    ],
    final: 'For a beginner with no fixed target, Python is the stronger first language: its readable syntax keeps attention on programming fundamentals, those fundamentals transfer, and automation, data work and AI stay reachable from the same interpreter. JavaScript becomes the better choice the moment the learner\'s goal is interactive or web-facing — building visible, shareable things early is a genuine motivational advantage, not a detour. The practical rule both models converged on: decide what you want to be able to do by day 30, then pick Python for open-ended learning and JavaScript for product-building — and ship something small every week regardless of the language.',
    insights: {
      a: '{A} held that transferable fundamentals and low setup friction make Python the safest default, conceding that goal-driven learners should jump straight to the platform their product lives on.',
      b: '{B} held that motivation is the binding constraint for beginners, and that JavaScript plus TypeScript teaches real-world discipline inside the most deployable platform there is.'
    },
    roundSummaries: [
      'Opening: fundamentals-transfer (A) versus motivation-first feedback loops (B) — a direct clash on what a beginner should optimize for.',
      'Counters: A attacks JavaScript\'s hidden tooling tax; B attacks Python\'s "gentle at scale" reputation and the prestige-driven choice.',
      'Rebuttals: both models concede the goal determines the answer; disagreement narrows to defaults for undecided learners.',
      'Final: a shared decision rule emerges — Python by default, JavaScript for web-facing goals, weekly shipping either way.'
    ]
  },

  remoteWork: {
    match: (q) => q.includes('remote') && (q.includes('office') || q.includes('work')),
    score: 84,
    scoreNote:
      'Demo estimate from the simulated transcript: disagreement was mostly about weighting and evidence, and both models converged on a hybrid default. It measures stance convergence — not factual correctness.',
    messages: [
      {
        round: 1, speaker: 'A',
        text: 'Remote-first is the correct default for knowledge work. The productivity case is no longer anecdotal: async-by-default forces written decisions, which are searchable, reviewable and survivable across time zones, while deep-focus blocks that offices structurally cannot guarantee become the norm. The equity case is stronger still — geography stops being a filter, so teams can hire caregivers, disabled engineers, and talent outside two or three expensive hubs. Culture is something you build deliberately through rituals and documentation, not a byproduct of sharing a room.',
        contention: null, converging: false
      },
      {
        round: 1, speaker: 'B',
        text: 'I challenge the assumption that written async is the whole of collaboration. The highest-bandwidth mentoring in engineering happens in the accidents: over-the-shoulder debugging, hearing how a senior phrases doubt, fifteen-second corridor clarifications that never become documents. Juniors are the class most harmed by remote-first — they get scheduled 1:1s instead of ambient learning, and the evidence on early-career productivity in distributed settings is notably weaker than the headline numbers suggest. Serendipity is not mystical; it is the unlogged channel, and offices are the proven way to keep it open.',
        contention: 'Whether async documentation genuinely replaces the unstructured, high-bandwidth learning that proximity provides — especially for juniors.',
        converging: false
      },
      {
        round: 2, speaker: 'A',
        text: 'The junior-mentorship concern is real, but it indicts bad remote practice, not remote itself. Teams that replaced proximity with a busier calendar did nothing intentional: no pairing rotations, no written decision logs, no onboarding that front-loads in-person weeks. And weigh what the office channel actually costs before romanticizing it: two hours of commute daily is the most reliable attention tax in knowledge work, paid by exactly the caregivers and outside-hub talent that remote access newly includes. A designed remote team with mandatory pairing weeks recovers most of the ambient channel while keeping that equity intact.',
        challenges: "B's ambient-learning claim", contention: null, converging: false
      },
      {
        round: 2, speaker: 'B',
        text: 'Concede the calendar-versus-culture point — "remote with more meetings" is a failure mode, not the model. But "recovers most of the ambient channel" is doing heavy lifting in your argument; most is not all, and the residual is concentrated precisely in trust formation and conflict de-escalation, where text is a known-losing medium. Note what hybrid advocates actually concede in the research: spontaneous interaction drops sharply under partial remote, and it does not recover by policy. So if the loss is concentrated and permanent, the honest design question is what you deliberately protect in-person for — and onboarding and design reviews are the two with the hardest evidence.',
        challenges: "A's \"culture is designed, not located\" thesis", contention: null, converging: false
      },
      {
        round: 3, speaker: 'A',
        text: 'That is the strongest version of the case and I will take it head-on: measure the loss, then spend anchor days where the evidence is hardest. My position tightens to this — remote-first as the default week, with two designed in-person exceptions that are explicitly about the channels text loses: the first four to six weeks of onboarding, and multi-day architectural or conflict sessions, both documented outward so the excluded are not second-class. What I still reject is office-as-default for its own retention: paying hub rent and commute tax to preserve an ambient channel that most seniors genuinely do not need daily.',
        challenges: "B's \"text loses trust formation\" evidence", contention: null, converging: true
      },
      {
        round: 3, speaker: 'B',
        text: 'And I will tighten symmetrically: the equity and focus numbers are real and I no longer dispute them as side effects. Where I hold ground is on drift — a hybrid policy with only two protected uses degrades into "office is where reviews happen," and then attendance becomes a status signal again unless managers actively kill it. So my concession comes with a mechanism, not a mood: anchor collaboration should be scheduled with the same rigor as standups — pairing blocks, review days, written summaries — and audited quarterly against junior progression metrics. Culture survives intention; it dies of drift.',
        challenges: "A's recovery-by-design argument", contention: null, converging: true
      },
      {
        round: 4, speaker: 'A',
        text: 'Final: remote-first by default; in-person treated as a scarce budget spent only where text loses bandwidth — onboarding, architecture, and repair after conflict. Async documentation is not the enemy of mentorship; it is the thing that makes mentorship scale past one time zone. Measure output, written decisions, and junior ramp-up; never measure seats.',
        challenges: "B's warning that async hides mentorship gaps", contention: null, converging: false
      },
      {
        round: 4, speaker: 'B',
        text: 'Agreed on the shape, with the mechanism welded in: two anchor days minimum for the uses the evidence supports, mandatory in-person onboarding weeks, quarterly review of whether proximity actually happened or became decoration. The debate\'s real output is this rule — presence must earn its cost every quarter or it defaults to remote, and remote must fund its documentation or it defaults to silence.',
        challenges: "A's dismissal of office-side evidence", contention: null, converging: false
      }
    ],
    final: 'Both models converged on a designed hybrid: remote-first as the default week because async documentation, focus protection and geographic equity are real, measured gains — while in-person time is treated as a scarce budget deliberately spent where text-based work loses its bandwidth: structured onboarding weeks for juniors, architecture and design reviews, and post-conflict repair. The decisive insight from the exchange is that neither failure mode is intrinsic to the location: remote decays without intentional rituals and documentation, offices decay into attendance-as-status. The shared rule: presence must earn its cost quarterly (commute, rent, lost focus) against junior-ramp and output metrics — and if it does not, the default is remote with written decision logs.',
    insights: {
      a: '{A} drove the productivity, focus and geographic-equity case, conceding only that onboarding and conflict repair deserve protected in-person time.',
      b: '{B} kept the debate honest about the ambient channel juniors lose, steering the compromise from mood to mechanism: scheduled, audited anchor collaboration.'
    },
    roundSummaries: [
      'Opening: async efficiency and equity (A) versus the irreplaceable ambient mentoring channel for juniors (B).',
      'Counters: A blames bad remote practice, not remote; B isolates trust formation and conflict de-escalation as known-losing media for text.',
      'Rebuttals: convergence on "anchor days spent only where evidence is hardest," with B warning about hybrid drift.',
      'Final: designed hybrid with a quarterly earn-your-cost rule for presence and a documentation floor for remote.'
    ]
  },

  learnNext: {
    match: (q) => q.includes('which technology') || q.includes('learn') && (q.includes('next') || q.includes('career')),
    score: 72,
    scoreNote:
      'Demo estimate from the simulated transcript: the models agreed on sequencing but conflicted on what deserves the first four months. It measures stance convergence — not factual correctness.',
    messages: [
      {
        round: 1, speaker: 'A',
        text: 'Learn TypeScript properly, then one modern full-stack framework, and be employable on fundamentals the market already prices. Framework names churn — React, then Next, then something else — but typed JavaScript, HTTP, state management, database interaction and deployment are the durable substrate, and every hiring loop screens on them. The career logic is simple: employers pay for shipped, maintainable products, and a developer who can carry a feature from schema to dashboard with type safety is hirable in any market cycle.',
        contention: null, converging: false
      },
      {
        round: 1, speaker: 'B',
        text: 'I disagree with the sequencing, not the quality of TypeScript. The market is repricing what "software engineer" means: the routine CRUD-plus-framework layer is exactly what AI tooling is absorbing fastest, while the people getting leverage are those who can wire models into products — retrieval, agents, evaluations, prompt pipelines, cost control. Six focused months on applied AI engineering on top of whatever you already know out-earns six months deepening a skill the assistant is getting better at every quarter. Build the layer above the abstraction everyone else is being absorbed into.',
        contention: 'Whether full-stack fundamentals or applied AI skills deserve the next four months of focused learning.',
        converging: false
      },
      {
        round: 2, speaker: 'A',
        text: 'The absorption thesis overstates its case. AI tools raise the floor and the ceiling at once, and they raise the ceiling hardest for people who can verify output — someone who cannot read generated TypeScript carefully is not "AI-leveraged," they are AI-hostage, unable to debug what the model shipped. Retrieval pipelines and agent orchestration are themselves full-stack engineering: streaming responses, schema design, caching, auth, cost telemetry. The hiring data supports the boring reading — job posts still screen on building and operating real applications; the "AI engineer" title is overwhelmingly those same skills with a fine-tuning line attached.',
        challenges: "B's \"AI absorbs the framework layer\" prediction", contention: null, converging: false
      },
      {
        round: 2, speaker: 'B',
        text: 'Concede verification is the actual skill — but that is my argument, not yours: evaluation, testing, and reading model output are exactly what applied-AI work trains, more deliberately than another framework project does. Where your plan loses is differentiation: "typed full-stack" describes the median candidate, and the median is precisely what the market is automating toward. The scarce profile right now is a developer who has shipped a model-backed feature with latency budgets, quality metrics, fallback behavior and cost limits documented. That portfolio piece reframes you from "another React dev" to the person teams are still fighting to hire.',
        challenges: "A's verification-first rebuttal", contention: null, converging: false
      },
      {
        round: 3, speaker: 'A',
        text: 'We disagree less about the destination than the ramp, so here is the strongest version of my order: TypeScript fundamentals first not because they are prestigious but because they are the prerequisite for everything downstream — an AI feature with no type discipline is a demo, not a product. I will fold your project into my plan rather than compete with it: fourth month, the capstone is your model-backed feature, built in the stack the first three months established. Fundamentals earn their keep the day they let you ship the differentiated thing credibly.',
        challenges: "B's differentiation pressure", contention: null, converging: true
      },
      {
        round: 3, speaker: 'B',
        text: 'Accepted, with the failure mode named: the "fundamentals first" plan historically dies in tutorial purgatory, so the three months must be project-anchored or the plan has no survival advantage. On my side I concede that agents-without-engineering ships fragile demos. So the combined bet is testable — every month ends with something deployed, and month four\'s AI feature is the portfolio centerpiece both arguments actually care about. If we disagree on anything left, it is only whether fundamentals deserve three months or one.',
        challenges: "A's fundamentals-first sequencing", contention: null, converging: true
      },
      {
        round: 4, speaker: 'A',
        text: 'Final: three months of typed, project-anchored full-stack skill — deployment, database, testing included — because durability and verification are the moat; month four spends that moat on a real AI-backed feature so the differentiation is earned, not cosmetic. The sequencing dispute should be settled by one test: could you debug the AI demo without the fundamentals? If not, they were the foundation all along.',
        challenges: "B's obsolescence-risk framing", contention: null, converging: false
      },
      {
        round: 4, speaker: 'B',
        text: 'Agreed in substance. My lasting correction to the consensus: keep the AI layer from month one in small doses — a weekly model-API exercise inside every fundamentals project — so it never becomes an afterthought bolted on at month four. Depth first is right; contact early is also right. Deployed portfolio pieces with measured quality, latency and cost numbers are the shared scoreboard, and that is the outcome both our arguments actually optimize for.',
        challenges: "A's month-four capstone concession", contention: null, converging: false
      }
    ],
    final: 'The synthesized recommendation: build TypeScript-plus-full-stack fundamentals first, because durability, verifiability and hiring screening all reward the developer who can carry a typed feature from schema to deployment — but keep applied AI in contact from month one, in weekly doses inside every project, so model-backed features never become a bolt-on afterthought. Month four\'s centerpiece should be exactly the thing the other side argued for: a deployed, model-backed application with documented latency budgets, quality evaluations and cost limits — the portfolio piece that currently differentiates candidates. The debate resolved by reframing: this is a sequencing disagreement, not a choice between fundamentals and AI — fundamentals are what let you ship AI features credibly, and AI projects are what keep fundamentals from dying in tutorial purgatory.',
    insights: {
      a: '{A} insisted fundamentals are the verification moat: without them, "AI leverage" becomes dependency on output nobody can debug or deploy.',
      b: '{B} kept the differentiation pressure: the median typed-full-stack profile is what automation absorbs fastest, so the plan must end in a shipped, measured AI-backed feature.'
    },
    roundSummaries: [
      'Opening: durable full-stack fundamentals (A) versus front-loading applied AI for leverage (B) — direct conflict over the next four months.',
      'Counters: A questions verification ability without fundamentals; B concedes the point but weaponizes it as an argument for evaluation-heavy AI practice.',
      'Rebuttals: plans merge — project-anchored fundamentals, AI capstone at month four, weekly model contact from day one.',
      'Final: agreed sequencing with one surviving adjustment on dose; deployed, measured artifacts become the shared scoreboard.'
    ]
  },

  codingProblem: {
    match: (q) => q.includes('coding problem') || (q.includes('approach') && q.includes('solve')) || (q.includes('hard problem') && q.includes('deadline')),
    score: 88,
    scoreNote:
      'Demo estimate from the simulated transcript: the models agreed on method early and refined emphasis rather than reversing positions. It measures stance convergence — not factual correctness.',
    messages: [
      {
        round: 1, speaker: 'A',
        text: 'Under deadline pressure, deliberate design beats exploratory coding: define the problem contract before writing a line. Input domains and types, required output invariants, complexity target, and the edge cases that break naive solutions — sketched in ten minutes as a one-screen contract — decide most of the outcome. The reason is diagnostic: most "stuck debugging" is actually a misunderstood spec, and every hour spent inside a half-understood problem buys rework later. A clear contract also tells you when you are done, which under a deadline is not a luxury but the objective.',
        contention: null, converging: false
      },
      {
        round: 1, speaker: 'B',
        text: 'I challenge the premise that understanding precedes engagement on hard problems — it usually emerges from it. With examples and tests first, you probe the behavior: three to five concrete input/output pairs, including the ones that feel mean, written before any algorithm exists. That process surfaces the spec\'s real ambiguities at the only moment they matter — when cheap to fix — instead of in a design review you do not have time for under deadline. A ten-minute contract is optimistic; a working test harness is ground truth, and it turns "is this right?" from a debate into a run.',
        contention: 'Whether spec understanding is best gained through upfront design or through probing examples and executable tests.',
        converging: false
      },
      {
        round: 2, speaker: 'A',
        text: 'We are closer than we sound, and I will say why: good examples are the contract, just written where I want them. My objection is to examples without invariants — behavior-only tests freeze the bug in place. Write down what must be true of all answers, not just the five you typed: monotonicity, bounds, symmetry, "result is idempotent." Those constraints catch wrong-but-passing solutions, which are the deadliest failure class on a deadline because they ship. So I concede the test-first loop, and add the one artifact it lacks: the invariant list, because it generalizes past the cases you happened to write.',
        challenges: "B's \"a plan that never meets reality\" charge", contention: null, converging: true
      },
      {
        round: 2, speaker: 'B',
        text: 'And I will concede the generalization point in exchange for a discipline rule: invariant lists are where analysis paralysis hides when it is allowed to. So the loop is bounded and loud — sketch invariants in five minutes max, timebox each attempted strategy to twenty-five, and when the box expires, switch strategy or ask. A second perspective on a hard problem is frequently worth another half hour of solo grind, and under deadline the scarce resource is not understanding, it is wall-clock. The harness plus the clock is what actually saves you; the perfect contract you ran out of time to finish does not.',
        challenges: "A's invariant-list defense", contention: null, converging: false
      },
      {
        round: 3, speaker: 'A', challenges: "B's bounded-loop discipline",
        text: 'Agreed on timeboxing — with one guardrail: the twenty-five-minute switch must change representation, not just typing. Brute force to sorted, recursion to iteration, greedy to dynamic programming, string to graph — strategy switching inside the same failed representation is panic with extra steps. The invariants earn their rent here: when you switch, they survive the change, so the tests you keep running become the continuity between attempts. That is also my answer to "asking is faster": write the contract and the invariants down and the question you ask is ten times more answerable.',
        contention: null, converging: false
      },
      {
        round: 3, speaker: 'B',
        text: 'That is the best integration either of us has proposed, so let me finish the shape of it: start by brute-forcing one correct tiny case end to end — it validates the harness and teaches you the data shapes — then upgrade deliberately with invariants as the continuity you described. The one thing I would still amend: "write it down then ask" assumes another human is awake at deadline hour. The fallback for the solo case is a rubber-duck protocol on the same contract — speak the invariants and the mean examples aloud, and half the bugs confess before anyone reviews a line.',
        challenges: "A's representation-switch guardrail", contention: null, converging: false
      },
      {
        round: 4, speaker: 'A', challenges: "B's 'perfect contract' dismissal",
        text: 'Final: contract-lite first — five minutes on domains, outputs, invariants — then the shortest working path to one true answer, then harden. Invariants are the load-bearing wall: they generalize the tests, survive strategy switches, and define done. What this debate converted me on is urgency: the contract is five minutes, not thirty, and the clock outranks elegance. Under deadline, a rough understanding you can test beats a beautiful one you cannot finish.',
        contention: null, converging: false
      },
      {
        round: 4, speaker: 'B',
        text: 'Consensus as I understand it: examples and tests are the floor, invariants are the ceiling, timeboxes are the walls — and one brute-force-correct anchor case before any optimization. My closing amendment to both our originals: after the timebox, the switch must change representation, and the question you ask — human or rubber duck — is exactly your contract read aloud. Structured intent, executable behavior, bounded iteration. That method beats both "think harder" and "code faster" on the only metric a deadline counts.',
        challenges: "A's pre-mortem concession", contention: null, converging: false
      }
    ],
    final: 'The consolidated method for hard coding problems under deadline: open with a five-minute contract — input domains, expected outputs, and explicit invariants — then immediately write three to five example-driven tests including deliberately nasty cases, since behavior pinned down early is understanding earned cheaply. Anchor correctness with one brute-force-but-correct small case end to end, then optimize deliberately: every strategy switch must change the problem representation (brute→sort, recursion→iteration, greedy→DP), with the written invariants as continuity between attempts so tests survive the switch. Timebox each approach to roughly twenty-five minutes; when the box expires, switch or ask, and frame the question as the contract read aloud — invariants plus mean examples make it answerable by a human or a rubber duck. The debate\'s joint verdict: upfront design and test-first probing were never opposites; examples without invariants freeze bugs in place, invariants without examples stall, and the deadline is what makes both cheap and both mandatory.',
    insights: {
      a: '{A} contributed the contract and the invariant list — the artifacts that define correctness, survive strategy changes, and tell you when you are done.',
      b: '{B} contributed the executable discipline: mean example tests, a brute-force anchor case, hard timeboxes, and the rule that a switch must change representation.'
    },
    roundSummaries: [
      'Opening: design the contract first (A) versus probe with examples and tests until the spec makes sense (B).',
      'Counters: A adopts tests but demands invariants to catch wrong-but-passing solutions; B binds everything to timeboxes.',
      'Rebuttals: synthesis emerges — invariants as continuity across representation-changing strategy switches.',
      'Final: shared method — contract-lite, anchored by one correct brute-force case, bounded, then hardened.'
    ]
  },

  ai2030: {
    match: (q) => q.includes('ai') && (q.includes('2030') || q.includes('future')),
    score: 62,
    scoreNote:
      'Demo estimate from the simulated transcript: the models retained a genuine disagreement about deployment speed versus governance drag, so the score is deliberately lower. It measures stance convergence — not factual correctness.',
    messages: [
      {
        round: 1, speaker: 'A',
        text: 'By 2030 the interesting unit of AI will not be a chatbot but an orchestration layer: personal and organizational agents handling routine cognition — scheduling, triage, document drafting, monitoring — under human judgment and budget. The tells are already visible: context windows that swallow whole codebases, tool use that is reliable enough to chain, and interfaces dissolving into the applications they augment. The scarce human skill shifts from operating software to specifying intent well and verifying results honestly. Expect the product shape of computing to bend around that loop: stateful assistants with memory, delegation, and accountability trails.',
        contention: null, converging: false
      },
      {
        round: 1, speaker: 'B',
        text: 'I predict a narrower, harder-won 2030: useful, regulated, and boring. Agents dazzle in demos and fail in prod for reasons governance has always eventually caught up with — liability, provenance, energy, and audit trails. The durable deployments will be AI inside pipelines someone signs off on: multimodal systems with verified reasoning traces embedded in physical and regulated workflows — logistics, diagnostics, document review — where the win is measured in error rates and compliance, not wonder. The personal-orchestration future you sketch runs into the wall that trust, not capability, has been the bottleneck since 2024.',
        contention: 'Whether 2030\'s binding constraint on AI is still capability (A) or already trust and governance (B).',
        converging: false
      },
      {
        round: 2, speaker: 'A', challenges: 'B\'s "institutions set the pace" claim',
        text: 'Trust-as-bottleneck understates what capability keeps doing to it. Every generation of models has made verifiability cheaper: reasoning traces, evals run by stronger judges, machine-checked outputs, sandboxed actions with human sign-off at the boundary — governance is being automated into the product, not imposed on it. Your regulated pipelines are real, but note who ships them: the same agent platforms, wrapped in compliance. So my forecast absorbs yours — the orchestration layer arrives with the audit trail as a feature. The contested residue is speed: I bet capability curves and margin incentives keep outrunning the slow-moving trust institutions; you bet the institutions set the pace.',
        contention: null, converging: false
      },
      {
        round: 2, speaker: 'B',
        text: 'That is the cleanest way to state the live dispute, so let me state my side sharply: automated verification softens the bottleneck, it does not dissolve it, because the trust that gates deployment is legal, institutional and human — not technical. Judges that are themselves models certify confidence, not liability; no eval ever signed an incident report. History favors the slow clock: electricity, aviation, and pharmaceuticals all saw capability outrun trust for decades before the institutions bit. I will grant you form and deny you timeline: yes, agent-like interfaces with verification traces; no, not broadly delegated by 2030. The interesting prediction is about pace, and I rest on the evidence of every technology that arrived before its institutions were ready.',
        challenges: "A's \"governance gets automated in\" counter", contention: null, converging: false
      },
      {
        round: 3, speaker: 'A',
        text: 'Then let me tighten my claim where your history actually cuts: orchestration will be deep in domains where verification is cheap — code, documents, logistics math, anything where correctness is machine-checkable — and thin exactly where liability is expensive. That concession costs me little because the cheap-verification domains are where the workforce transformation lives anyway. Where I still push back is the aviation analogy: regulation followed mass incidents and mass deployment; AI-first compliance may invert the order, shipping with guardrails designed-in because platform economics reward immediate trust features. Pace is our real disagreement; on geography — where adoption clusters — I think we are converging.',
        challenges: "B's aviation-era analogy", contention: null, converging: true
      },
      {
        round: 3, speaker: 'B',
        text: 'Agreed that geography is the consensus, and "verification-cheap domains first" is exactly how I would have phrased my own forecast — which tells me the demo-versus-production gap was the useful fight here. On pace I will hedge honestly rather than fold: designed-in guardrails do invert aviation\'s sequence if, and only if, the guardrails survive the pressure to loosen for market share; that is a contest, not a trend. My durable claim is modest: by 2030 the AI worth trusting will be boring, auditable, and concentrated in verifiable workflows, with the frontier of delegation determined less by what models can do than by what institutions will sign.',
        challenges: "A's verifiability-cheaper argument", contention: null, converging: true
      },
      {
        round: 4, speaker: 'A',
        text: 'Final: 2030 is agentic in the verifiable and deferential in the consequential. Personal and organizational orchestration layers become real products wherever machine-checkable correctness exists, with humans specifying intent and owning exceptions; judgment, provenance and sign-off become the interface. Where I will not yield: the boundary will keep moving — each verification advance converts another domain from "regulated someday" to "automatable now," so the plan should assume the map changes, not that the territory stays still.',
        challenges: "B's pace-of-institutions objection", contention: null, converging: false
      },
      {
        round: 4, speaker: 'B',
        text: 'Consensus, with the caveat welded on: adoption by 2030 will concentrate where verification is cheap and stall where trust is legal rather than technical; the boring integrations win. Where I hold the line: designing for the pace institutions can actually ratify — audit trails, explicit delegation boundaries, human sign-off at the consequence boundary — pays better than designing for capability at full speed. The honest disagreement to keep on the record: whether the guardrail contest resolves faster than the market absorbs the risk. Anyone building for 2030 should treat that as the open question our debate could not close.',
        challenges: "A's moving-boundary bet", contention: null, converging: false
      }
    ],
    final: 'The debate converged on a map and left a live fault line. Converged: by 2030, AI worth trusting concentrates where verification is machine-cheap — code, documents, logistics, compliance-adjacent workflows — surfacing as agentic orchestration layers with reasoning traces, explicit delegation boundaries and human sign-off at the point of consequence, while capability alone remains a poor predictor of adoption. The genuine unresolved disagreement, preserved honestly: pace. One side bets that verification keeps converting "regulated someday" domains into "automatable now," with guardrails shipping designed-in because platform economics reward trust; the other bets that institutions — liability, audit, sign-off — set the real clock, as they did for electricity and aviation. The actionable synthesis: build for the verifiable-first map, architect the trust boundary as the product\'s spine, and treat the pace question as the market\'s to settle.',
    insights: {
      a: '{A} contributed the capability dynamic: every verification advance moves the adoption boundary, so plans should assume the map of automatable domains keeps expanding.',
      b: '{B} contributed the institutional brake: demos prove capability, but signed liability proves deployment — and legal trust historically lags technical trust.'
    },
    roundSummaries: [
      'Opening: ambient agent orchestration (A) versus boring, regulated, verified deployment (B) — the pace and trust dispute framed.',
      'Counters: A argues governance is being automated into the product; B answers that no eval ever signed an incident report.',
      'Rebuttals: real convergence on geography (verifiable domains first); the surviving dispute narrows to institutional pace.',
      'Final: agreed map, preserved fault line — design the trust boundary as the spine and let the market settle speed.'
    ]
  }
}

const GENERIC = {
  score: 70,
  scoreNote:
    'Demo estimate from a simulated template exchange. Because this question has no curated script, the debate demonstrates structure (position → challenge → refine → converge) rather than expert content. It measures stance convergence — not factual correctness.',
  build: (q) => [
    {
      round: 1, speaker: 'A',
      text: `Framing "${trim(q)}": I argue for the position that survives scrutiny longest — optimize for second-order effects and durable consequences rather than the most attractive immediate gain. Concretely, that means stating the criteria the answer must satisfy a year out, checking which options still meet them, and preferring the option whose failure modes are recoverable. A choice judged mainly by first-order payoff tends to look brilliant right up until the compounding side-effects arrive — complexity, dependency, or commitment — and those costs are almost always invisible in the window where the decision felt easy.`,
      contention: null, converging: false
    },
    {
      round: 1, speaker: 'B',
      text: `Countering "${trim(q)}": durable-consequence thinking is seductive but frequently a proxy for analysis that never has to meet reality. I argue for outcome-first reasoning — name the concrete, measurable result wanted soonest, and treat anything not advancing it as deferred until the feedback arrives. On questions like this, the map is not the territory: real constraints reveal themselves only through contact, and a plan built from second-order speculation usually optimizes an imagined future while quietly paying a certain present cost. The recoverability argument can be reversed with equal honesty — committing early to the visible win preserves more real options than waiting for certainty that never arrives.`,
      contention: 'Whether this question is best answered by reasoning ahead to durable consequences (A) or by treating fast, measurable feedback as the only reliable evidence (B).',
      converging: false
    },
    {
      round: 2, speaker: 'A', challenges: "B's \"feedback is the only evidence\" stance",
      text: 'The feedback-first argument mistakes velocity for direction. Yes, contact with reality teaches what models cannot — but undirected contact teaches little twice: teams that optimize the nearest metric famously ship the local win and inherit the global tax, and "we will learn when the feedback arrives" is how sunk costs get rebranded as exploration. My position does not require speculation that outruns evidence: a short list of failure modes worth avoiding, cheaply checked now, is second-order thinking with the same empirical virtue you claim — and it is usually the difference between a result that compounds and one that has to be explained later.',
      challenges: "B's \"examples before design\" opening", contention: null, converging: false
    },
    {
      round: 2, speaker: 'B',
      text: 'Conceded that unexamined speed is its own failure mode — I will sharpen instead of soften: the risk you describe is exactly what a good feedback loop prices in, because the loop is where you notice the global tax early. Your "short list of failure modes" is itself speculation bounded by which failures you thought to imagine; mine is the same list plus a deadline attached to each item. Depth that cannot be tested is preference wearing a lab coat. So let the actual dispute be auditability: which claim about this question can be checked within a cycle, versus which one can only be argued about forever.',
      challenges: "A's failure-mode inventory", contention: null, converging: false
    },
    {
      round: 3, speaker: 'A', challenges: "B's auditability frame",
      text: 'Auditability is a fair frame to meet — and on it I will move deliberately: the checkable version of my position is not a prophecy, it is a pre-mortem with kill-criteria, the discipline of naming now what evidence would later prove the durable-risk read right or wrong. That is falsifiable inside your cycle; what I refuse is optimizing purely for the cycle. The two halves of a good answer to a question like this are the same instrument: commit to a fast, visible first step, but write down the consequence budget you are not willing to overspend — and make that budget reviewable by the same feedback you trust.',
      contention: null, converging: true
    },
    {
      round: 3, speaker: 'B', challenges: "A's falsifiable pre-mortem",
      text: 'And I will meet that halfway honestly: a pre-mortem with kill-criteria is a test, not a temperament — I have no objection to a test. What your budget needs, though, is exactly what my loop supplies: a date. Name the review window, let the evidence move the budget, and accept that when contact with reality contradicts the forecast, reality wins the argument — that is the one concession I will not trade, because a durable-concern budget that cannot be revised by feedback becomes the procrastination of commitment in disguise. On those terms the method is common ground.',
      contention: null, converging: true
    },
    {
      round: 4, speaker: 'A', challenges: "B's \"depth without tests is preference\" charge",
      text: 'Closing position: choose the option whose downside is legible, budgeted and reviewable — state the criteria, run the pre-mortem, set the kill-criteria — then take the smallest step that produces real feedback fast enough to matter while the cost of being wrong is still small. Structure first, speed inside the structure: that is the version of my opening that your challenge improved.',
      challenges: "B's auditability challenge", contention: null, converging: false
    },
    {
      round: 4, speaker: 'B', challenges: "A's budget-before-motion rule",
      text: 'Consensus on method: define the measurable win, attach a date and a consequence budget, ship the smallest real step this week, and let the review — not either forecast — settle the disagreement. I would only add that when the feedback arrives and the budget is safe, the answer to questions like this usually turns out to be less fateful than the debate around it made it feel.',
      contention: null, converging: false
    }
  ],
  final: 'The synthesized answer: treat the question as a decision to instrument, not a debate to win. Both reasoning styles survived scrutiny only after merging — commit to the option whose downside is legible, budgeted and reviewable (name the criteria, run a pre-mortem, attach kill-criteria and a review date), then take the smallest step that produces real, measurable feedback fast enough to matter. Let that dated evidence, rather than either forecast, settle the disagreement: when the cycle comes back and the consequence budget is safe, proceed; when it is not, the feedback — not the original argument — is the answer.',
  insights: {
    a: '{A} contributed the consequence discipline: criteria, pre-mortem, and a budgeted downside so the fast move cannot quietly become the expensive one.',
    b: '{B} contributed the auditability discipline: dated feedback as the only honest referee, with reality outranking any forecast that contradicts it.'
  },
  roundSummaries: [
    'Opening: durable-consequence optimization (A) versus measurable-feedback-first optimization (B) — the epistemic clash framed.',
    'Counters: A warns velocity without direction compounds hidden costs; B answers that untestable depth is preference in a lab coat.',
    'Rebuttals: convergence on an instrumented method — pre-mortem with kill-criteria plus a dated review.',
    'Final: choose the legible, budgeted option; ship the smallest real step; let dated evidence referee.'
  ]
}

function trim(q) {
  const s = q.trim().replace(/[?.!]+$/, '')
  return s.length > 72 ? s.slice(0, 72).trimEnd() + '…' : s
}

/* ------------------------------------------------------------------ */
/* Normalization                                                       */
/* ------------------------------------------------------------------ */

export function generateBattle(selectedModels, question) {
  const a = selectedModels[0]
  const b = selectedModels[1]
  if (!a || !b) throw new Error('Two distinct models are required to generate a battle.')
  if (!question || !question.trim()) throw new Error('A question is required to generate a battle.')

  const q = question.toLowerCase()
  const script =
    Object.values(SCRIPTS).find((s) => s.match(q)) || null

  const raw = script ? script.messages : GENERIC.build(question)
  const finalAnswer = script ? script.final : GENERIC.final
  const insightTpl = script ? script.insights : GENERIC.insights
  const roundSummaries = script ? script.roundSummaries : GENERIC.roundSummaries
  const agreement = script ? script.score : GENERIC.score
  const agreementNote = script ? script.scoreNote : GENERIC.scoreNote

  const messages = raw.map((m, i) => {
    const isA = m.speaker === 'A'
    const cur = isA ? a : b
    const opp = isA ? b : a
    const st = stageForRound(m.round)
    return {
      id: `m${i + 1}`,
      round: m.round,
      stageKey: st.key,
      stageLabel: st.label,
      type: isA && m.round === 1 ? 'opening' : st.key,
      speaker: m.speaker,
      modelId: cur.id,
      modelName: cur.name,
      provider: cur.provider,
      modelLabel: cur.modelLabel,
      accent: cur.accent,
      opponentName: opp.name,
      text: m.text,
      challenges: m.challenges || m.addressing || null,
      contention: m.contention || null,
      converging: Boolean(m.converging)
    }
  })

  return {
    id: `b-${Date.now().toString(36)}`,
    question: question.trim(),
    fighters: [
      { slot: 0, modelId: a.id, name: a.name, provider: a.provider, modelLabel: a.modelLabel },
      { slot: 1, modelId: b.id, name: b.name, provider: b.provider, modelLabel: b.modelLabel }
    ],
    messages,
    roundSummaries,
    finalAnswer,
    insights: {
      a: insightTpl.a.replaceAll('{A}', a.name),
      b: insightTpl.b.replaceAll('{B}', b.name).replaceAll('{A}', a.name)
    },
    agreement: {
      score: agreement,
      note: agreementNote,
      label: 'Demo agreement estimate',
      demo: true
    },
    source: 'local-mock' // replaced by 'backend' once a real orchestrator exists
  }
}

/** Deterministic digest used to key shareable demo links and history ids. */
export function battleFingerprint(selectedModels, question) {
  const ids = [selectedModels[0]?.id || '', selectedModels[1]?.id || ''].sort().join('|')
  const q = (question || '').trim().toLowerCase()
  let h1 = 0x811c9dc5
  const s = ids + '::' + q
  for (let i = 0; i < s.length; i++) {
    h1 ^= s.charCodeAt(i)
    h1 = Math.imul(h1, 0x01000193) >>> 0
  }
  return h1.toString(36)
}
