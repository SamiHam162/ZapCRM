# Feature: Demo Mode

**Created:** 2026-04-09
**Last Updated:** 2026-04-09
**Version:** 1.0.0
**Status:** Complete

## Overview

Demo mode allows the full Zap Onboarding CRM workflow to run without an Anthropic API key. When active, all AI operations (scan and script generation) return pre-built fixture data for a sample AC technician client ("קירור ומיזוג אבי כהן") instead of making real API calls.

---

## Activation

Demo mode is active when **either** condition is true:

| Condition | Server-side check | Client-side check |
|---|---|---|
| No API key | `!process.env.ANTHROPIC_API_KEY` | N/A |
| Explicit flag | `process.env.DEMO_MODE === 'true'` | `process.env.NEXT_PUBLIC_DEMO_MODE === 'true'` |

**Environment variables:**

```
ANTHROPIC_API_KEY=           # empty = auto-demo
DEMO_MODE=true               # explicit demo mode (server+client)
NEXT_PUBLIC_DEMO_MODE=true   # client-readable copy (must match DEMO_MODE)
```

`NEXT_PUBLIC_DEMO_MODE` is required because Next.js only exposes `NEXT_PUBLIC_*` variables to the browser. It must be kept in sync with `DEMO_MODE`.

---

## Demo Mode Banner

**Component:** `src/components/ui/DemoModeBanner.tsx`

A client component that reads `process.env.NEXT_PUBLIC_DEMO_MODE`. When active, renders a dismissible orange banner above the app shell:

```
⚡ מצב דמו — לא נעשות שיחות API. כל הנתונים הם לדוגמה.    [×]
```

- Rendered in `src/app/layout.tsx` before `<ClientsProvider>`
- Dismissible (click X) — hidden until next page reload
- Uses `zap-orange` color to match brand

---

## Demo Behavior Per Operation

### Scan Pipeline (`POST /api/scan`)

When demo mode is active:
- Real URL fetches are skipped
- Steps 1–4 animate with 1200ms delay each (simulates scan latency)
- Final `clientCard` is `MOCK_AC_TECHNICIAN_CARD` with live `scannedAt` timestamp
- `usedDemoData: true` on the returned card

**Fixture:** `src/lib/mockClientCard.ts` — AC technician in Krayot

### Script Generation (`POST /api/generate-script`)

When demo mode is active:
- Claude API call is skipped
- 2-second simulated delay
- Returns `MOCK_CALL_SCRIPT` with `usedDemoData: true`

**Fixture:** `src/lib/mockCallScript.ts` — 5-section script for "קירור ומיזוג אבי כהן"

---

## Fixture Data

### Mock Client Card (`MOCK_AC_TECHNICIAN_CARD`)

| Field | Value |
|---|---|
| businessName | קירור ומיזוג אבי כהן |
| ownerName | אבי כהן |
| businessType | טכנאי מזגנים |
| area | קריות (קרית ביאליק, קרית אתא, קרית מוצקין) |
| phone | 052-123-4567 |
| services | התקנה, תיקון, תחזוקה שנתית, מזגנים מרכזיים, VRF |
| usedDemoData | true |
| scannedAt | Set at call time (not module load) |

### Mock Call Script (`MOCK_CALL_SCRIPT`)

5-section script referencing the AC technician fixture, written in warm Israeli Hebrew.

---

## Visual Indicators

| Indicator | Location | Condition |
|---|---|---|
| Orange demo banner | Top of every page | `NEXT_PUBLIC_DEMO_MODE=true` |
| "נתוני דמו" badge in client card | `ClientCardView` | `clientCard.usedDemoData === true` |
| Demo note in script | `CallScriptCard` | `usedDemoData === true` from API |

---

## Related Documentation

- [Client Onboarding Flow](../flows/client-onboarding-flow.md)
- [API: POST /api/scan](../api/scan-endpoint.md)
- [API: POST /api/generate-script](../api/generate-script-endpoint.md)
