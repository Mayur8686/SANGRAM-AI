# SANGRAM AI — Backend Integration Contract

The frontend is a deterministic prototype. This document defines the seam a
real orchestration backend must fulfil to make it live. **No provider API keys
may ever ship in this client** — the browser only ever talks to our own
backend; the backend holds OpenAI/Google/Anthropic/etc. credentials.

## Current frontend boundary

| Module | Role | Swap point |
| --- | --- | --- |
| `src/services/battleService.js` | Deterministic mock battle generator | Replaced by backend-generated content |
| `src/services/streamRunner.js` | Pacing engine that reveals finished content | Replaced by SSE/chunk consumption |
| `src/components/*` | Render normalized `battle` objects only | No changes needed |

The UI consumes one normalized shape — `generateBattle()`'s return value:

```ts
type Battle = {
  id: string
  question: string
  fighters: [{ slot: 0, modelId, name, provider, modelLabel }, …]
  messages: BattleMessage[]          // chronological, shared timeline
  roundSummaries: string[]           // one per round, used by export
  finalAnswer: string                // ONE consolidated answer
  insights: { a: string, b: string }
  agreement: { score: number, note: string, label: string, demo: true }
  source: 'local-mock' | 'backend'
}

type BattleMessage = {
  id: string
  round: 1|2|3|4                     // 5 = synthesis (not a message)
  stageKey: 'opening'|'counter'|'rebuttal'|'final'
  stageLabel: string
  speaker: 'A'|'B'
  modelId: string                    // catalog identity, for accent resolution
  modelName: string
  provider: string
  modelLabel: string                 // display id, distinct from apiModel
  text: string
  challenges: string|null            // named claim being answered
  contention: string|null            // explicit disagreement topic (rare!)
  converging: boolean                // position was refined/conceded
}
```

## Endpoints the backend should expose

```
POST /api/battles
  body:  { question: string(10–1000), modelA: string, modelB: string,
           clientBattleId?: string }   // idempotency key
  201:   { battleId, streamUrl, estimatedCost }
  4xx/5xx: { code: ErrorCode, message, retryable: boolean }

GET  /api/battles/:id/events           (SSE)
  events:
    battle.stage { round, stageKey }
    battle.message.start   { messageId, speaker, modelId, stageLabel }
    battle.message.chunk   { messageId, delta }
    battle.message.done    { messageId, contention?: string, challenges?: string }
    battle.round.summary   { round, summary }
    battle.synthesis.start
    battle.final           { finalAnswer, insights, agreement }
    battle.error           { code, message, retryable }
    battle.done

GET  /api/battles/:id                  → persisted Battle (same shape)
POST /api/shares  { battleId }          → { shareToken }   (enables real links)
GET  /api/s/:token                      → read-only Battle snapshot
```

### Error codes the UI already renders

`MISSING_CONFIG`, `API_FAILURE`, `TIMEOUT`, `RATE_LIMIT`, `AUTH_FAILED`,
`NETWORK_OFFLINE`, `EMPTY_RESPONSE`, `SYNTHESIS_FAILED`.
Each maps to a panel in `src/components/ErrorStates.jsx`; `retryable` controls
whether the Retry button appears. `src/services/streamRunner.js` already
implements the same event vocabulary (`onUpdate`/`onFinish`) used by the mock;
a backend adapter just feeds real chunks into it.

## Agreement score

Today: fixed per-template demo estimates labelled "Demo agreement estimate".
Real version: backend computes convergence (e.g. claim-graph overlap between
final positions) and must send `{score, method, computedAt}`; the UI only
displays the value and its explanation — the client never invents scores.

## Share links

The prototype encodes only `{question, modelA, modelB}` into a URL fragment
and re-runs the deterministic local engine on visit (`shareLink.js`). No
transcript, no user data, no secrets in URLs. With the backend above, replace
the fragment flow with `POST /api/shares` tokens; the Results share button is
the only call site.

## Timestamps

The mock deliberately fabricates none. A live backend may attach real
`createdAt` per message; the UI will show them only as relative labels.
