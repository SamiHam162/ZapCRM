# API Reference: POST /api/generate-script

**Created:** 2026-04-09
**Last Updated:** 2026-04-09
**Version:** 1.0.0
**Status:** Complete

## Overview

Generates a personalized 5-section Hebrew onboarding call script for a client using Claude Opus 4.6. Returns a JSON array of `CallScriptSection` objects. Supports demo mode (no API key required).

---

## Endpoint

```
POST /api/generate-script
Content-Type: application/json
```

No authentication required (internal tool).

---

## Request Body

```typescript
{
  clientCard: ClientCard;  // Required — structured client data from scan
}
```

See [ClientCard schema in scan-endpoint.md](./scan-endpoint.md#clientcard-schema) for the full shape.

**Malformed JSON body** → `400 Bad Request` (text: `גוף הבקשה אינו תקין`)

**Missing `clientCard`** → `400 Bad Request` (text: `חסר clientCard בבקשה`)

---

## Response

### Success: 200 OK

```json
{
  "script": [
    { "title": "פתיחה", "content": "שלום [שם]! ..." },
    { "title": "מטרת השיחה", "content": "..." },
    { "title": "סקירת הנכסים הדיגיטליים", "content": "..." },
    { "title": "הצעדים הבאים", "content": "..." },
    { "title": "סגירה חמה", "content": "..." }
  ],
  "usedDemoData": false
}
```

`usedDemoData: true` when demo mode is active or Claude falls back to mock script.

### Error Responses

| Status | Body | When |
|---|---|---|
| `400` | `גוף הבקשה אינו תקין` | Malformed JSON |
| `400` | `חסר clientCard בבקשה` | `clientCard` field missing |
| `500` | `תגובה לא צפויה מ-Claude` | Claude returned non-text content block |

In practice, most errors fall back to the demo script (200 with `usedDemoData: true`) rather than returning 5xx.

---

## CallScriptSection Schema

```typescript
interface CallScriptSection {
  title: string;   // Section heading (Hebrew)
  content: string; // Script content for that section
}
```

The 5 sections are always:
1. פתיחה
2. מטרת השיחה
3. סקירת הנכסים הדיגיטליים
4. הצעדים הבאים
5. סגירה חמה

---

## Demo Mode

Activated when `process.env.ANTHROPIC_API_KEY` is falsy **or** `process.env.DEMO_MODE === 'true'`.

In demo mode:
- No Claude API call is made
- Response is delayed by 2 seconds (simulates real latency)
- Returns `MOCK_CALL_SCRIPT` from `src/lib/mockCallScript.ts`
- `usedDemoData: true` in response

---

## Implementation Notes

**File:** `src/app/api/generate-script/route.ts`

Critical design decisions:
- `new Anthropic({ apiKey })` is instantiated **inside** the POST handler, **after** the demo mode check. This prevents module-level initialization failure when `ANTHROPIC_API_KEY` is absent (which would break the demo mode path).
- `client.messages.create()` is wrapped in try/catch — any API error falls back to demo script rather than returning 500.
- Claude response is parsed via `/\[[\s\S]*\]/` regex to extract the JSON array, tolerating any preamble text.
- Timeout: 15 seconds (`{ timeout: 15000 }` as second argument to `create()`).

---

## Example (curl)

```bash
curl -X POST http://localhost:3000/api/generate-script \
  -H "Content-Type: application/json" \
  -d '{
    "clientCard": {
      "businessName": "קירור ומיזוג אבי כהן",
      "ownerName": "אבי כהן",
      "businessType": "טכנאי מזגנים",
      "area": "קריות",
      "services": ["התקנת מזגנים", "תיקון מזגנים", "תחזוקה שנתית"],
      "digitalAssets": [
        { "type": "website", "url": "https://example.co.il", "label": "אתר אינטרנט", "scanStatus": "success" }
      ],
      "contactInfo": { "phone": "052-123-4567" },
      "usedDemoData": false,
      "scannedAt": "2026-04-09T10:00:00.000Z"
    }
  }'
```

Expected response (demo mode):
```json
{
  "script": [
    { "title": "פתיחה", "content": "שלום אבי! ..." },
    ...
  ],
  "usedDemoData": true
}
```

---

## Related Documentation

- [Call Script Generation Feature](../features/call-script-generation.md)
- [Client Onboarding Flow](../flows/client-onboarding-flow.md)
- [API: POST /api/scan](./scan-endpoint.md)
