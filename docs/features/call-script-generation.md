# Feature: Call Script Generation

**Created:** 2026-04-09
**Last Updated:** 2026-04-09
**Version:** 1.0.0
**Status:** Complete

## Overview

After a client card is built from the scan, the producer can generate a personalized 5-section Hebrew onboarding call script with one click. The script is produced by Claude Opus 4.6 using the structured client card data as context. The result is stored in localStorage and can be emailed.

---

## User Perspective

1. After a successful scan (client status = `מוכן`), a "צור תסריט שיחה" button appears below the client card.
2. The producer clicks it. A loading skeleton replaces the button for 2–15 seconds.
3. The script appears as 5 colored sections. The producer reviews it.
4. The producer clicks "שלח ללקוח בדוא״ל" to proceed to email sending.
5. After sending, the script remains visible (status = `נשלח`) for reference.

---

## How It Works

### 1. Hook: `useScriptGeneration`

**File:** `src/hooks/useScriptGeneration.ts`

Manages state for the script generation lifecycle:

```typescript
interface ScriptGenerationState {
  isLoading: boolean;
  script: CallScriptSection[] | null;
  error: string | null;
  usedDemoData: boolean;
}
```

The `generate(clientCard)` function POSTs to `/api/generate-script` and returns the result (script + usedDemoData) so the caller can persist it. On error, returns `null`.

### 2. API Route: `POST /api/generate-script`

**File:** `src/app/api/generate-script/route.ts`

- Validates request body (try/catch on `request.json()`, 400 if missing `clientCard`)
- Checks demo mode (`!ANTHROPIC_API_KEY || DEMO_MODE === 'true'`) → returns mock script after 2s delay
- In live mode: instantiates `new Anthropic({ apiKey })` **inside** the handler (CRITICAL: not at module level — prevents crash when API key is absent in demo mode)
- Calls `claude-opus-4-6` with 15s timeout
- Extracts JSON array via `/\[[\s\S]*\]/` regex from response text
- Falls back to demo script if parse fails or Claude API throws
- Returns `{ script: CallScriptSection[], usedDemoData: boolean }`

### 3. Prompt: `buildScriptPrompt`

**File:** `src/lib/scriptPrompt.ts`

Builds a Hebrew instruction prompt that injects:
- Business name, owner name, type, area
- Services list (comma-separated)
- Digital assets purchased (comma-separated labels)

Instructs Claude to return **JSON only** — a 5-element array with this exact structure:
```json
[
  { "title": "פתיחה", "content": "..." },
  { "title": "מטרת השיחה", "content": "..." },
  { "title": "סקירת הנכסים הדיגיטליים", "content": "..." },
  { "title": "הצעדים הבאים", "content": "..." },
  { "title": "סגירה חמה", "content": "..." }
]
```

Tone: warm, professional, Israeli Hebrew.

### 4. Component: `CallScriptCard`

**File:** `src/components/clients/CallScriptCard.tsx`

Three exports:
- `CallScriptCard` — renders the full script with sections, demo banner, and email CTA
- `CallScriptGenerateButton` — "צור תסריט שיחה" button shown before generation
- `CallScriptLoadingState` — pulsing skeleton shown during generation

`CallScriptCard` manages `EmailPreviewModal` open state internally. Receives `onSend(sentAt: string)` from the page.

### 5. Persistence

When `generate()` returns a result, `page.tsx` dispatches:
```typescript
dispatch({ type: 'UPDATE_CLIENT', id: client.id, updates: { callScript: result.script } });
```
This saves the script to localStorage via the context `useEffect`. On page refresh, `displayScript = script ?? client.callScript ?? null` restores it from the persisted client.

---

## Script Section Types

```typescript
interface CallScriptSection {
  title: string;
  content: string;
}
```

---

## Demo Mode

When demo mode is active:
- The API returns `MOCK_CALL_SCRIPT` from `src/lib/mockCallScript.ts` after a 2-second simulated delay
- `usedDemoData: true` is returned and displayed as a banner in `CallScriptCard`
- The mock script is written for "קירור ומיזוג אבי כהן" (AC technician fixture client)

---

## Error Handling

| Scenario | Behavior |
|---|---|
| `ANTHROPIC_API_KEY` absent | Demo path returns mock script (module-level instantiation avoided) |
| Claude API timeout (>15s) | try/catch → falls back to demo script |
| Claude returns non-JSON | Regex match fails → falls back to demo script |
| JSON parse error | Falls back to demo script |
| Network error from hook | `error` state set with Hebrew message; retry available |

---

## Configuration

| Env Variable | Default | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | (empty) | Claude API key; empty = demo mode |
| `DEMO_MODE` | `true` | Force demo mode regardless of API key |

---

## Related Documentation

- [Client Onboarding Flow](../flows/client-onboarding-flow.md)
- [API: POST /api/generate-script](../api/generate-script-endpoint.md)
- [Client Status Workflow](../statuses/client-status-workflow.md)
- [Demo Mode Feature](./demo-mode.md)
