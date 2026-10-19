# SANGRAM AI — Credit System Readiness (design notes only)

**Status: not implemented — intentionally.** This phase is UI refinement; no
billing, no token balances, no fake wallet exists in the frontend and none
should be invented client-side. These notes define the separation a future
backend must own.

## Ownership model

```
┌─ Backend (authoritative) ────────────────────────────────┐
│ user account ──► balance (integer minor units of credits) │
│ model catalog ──► per-model cost table (per 1k in/out)    │
│ battle orchestrator ──► estimated usage before start      │
│ provider adapters ──► ACTUAL usage after each call        │
│ ledger ──► append-only entries: hold / capture / refund   │
└───────────────────────────────────────────────────────────┘
┌─ Frontend (display only) ────────────────────────────────┐
│ shows balance/quotes returned by API; never computes      │
│ deductions; never trusts client state for money           │
└───────────────────────────────────────────────────────────┘
```

## Required flow (battle lifecycle)

1. `POST /api/battles` quotes `estimatedCost = Σ(modelPrice × estTokens) + synthesisCost`.
2. Backend places a **hold** on the balance; insufficient → `402 INSUFFICIENT_CREDITS`.
3. On completion: capture `actual usage reported by the backend` per model call
   (provider usage fields), refund the difference (`hold − actual`).
4. On failure: failed request policy — rounds that never returned content are
   fully released; partial successes capture only their real usage.
   `battle.error{retryable:true}` must not double-charge: holds are keyed to
   `battleId` (idempotency).
5. Rate limits (requests/day per user tier) are enforced before the hold.

## Ledger entry shape (suggested)

```ts
type LedgerEntry = {
  id, userId, battleId?,
  type: 'hold' | 'capture' | 'refund' | 'adjustment' | 'topup',
  modelId: string | null,       // model-specific usage attribution
  estimated: number,            // quote at hold time (credits)
  actual: number | null,        // reported usage after completion
  credits: number,              // signed delta applied to balance
  reason: string | null,        // for manual adjustments
  createdAt
}
```

## Non-negotiables

- One shared provider key in browser code is **prohibited forever**; per-user
  BYO-key, if ever offered, also lives server-side, encrypted.
- Never claim per-user provider accounts in UI copy unless the architecture
  actually provisions them.
- Refunds/adjustments are backend-only; the client may *display* them.
- Usage display strings ("~X credits this battle") must come from the
  `estimatedCost` field, not from frontend arithmetic.
