# API Reference: POST /api/scan

**Created:** 2026-04-09
**Last Updated:** 2026-04-09
**Version:** 1.0.0
**Status:** Complete

## Overview

Initiates an AI scan of a client's digital assets. Returns a Server-Sent Events (SSE) stream of step-progress events, culminating in a fully-structured `ClientCard` object.

---

## Endpoint

```
POST /api/scan
Content-Type: application/json
```

No authentication required (internal tool).

---

## Request Body

```typescript
{
  websiteUrl?: string;     // Full URL of the client's website (optional)
  dapeiZahavUrl?: string;  // Full URL of the client's Dapei Zahav listing (optional)
}
```

At least one URL is recommended, but neither is required. If neither URL is fetchable, the response falls back to demo data.

**Malformed JSON body** → `400 Bad Request` (plain text: `גוף הבקשה אינו תקין`)

**Private/loopback URLs** → silently treated as not provided (SSRF protection).

---

## Response

### Success: SSE Stream

```
HTTP/1.1 200 OK
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

The response body is a stream of SSE events. Each event is a JSON-encoded line:

```
data: {"step": 1, "status": "active"}\n\n
data: {"step": 1, "status": "done"}\n\n
data: {"step": 2, "status": "active"}\n\n
...
data: {"step": 5, "status": "done", "clientCard": { ... }}\n\n
```

#### Event shape

```typescript
// Step progress event
{ step: 1 | 2 | 3 | 4 | 5;  status: 'active' | 'done' | 'failed' }

// Final event (step 5 done)
{ step: 5;  status: 'done';  clientCard: ClientCard }
```

#### Step definitions

| Step | Label | Description |
|---|---|---|
| 1 | Scan website | Fetches and extracts text from `websiteUrl` |
| 2 | Scan Dapei Zahav | Fetches and extracts text from `dapeiZahavUrl` |
| 3 | AI analysis | Sends combined text to Claude, receives extracted JSON |
| 4 | Build client card | Assembles `ClientCard` from extracted data |
| 5 | Done | Final event carrying the completed `clientCard` |

#### Status meanings

| Status | Meaning |
|---|---|
| `active` | Step is currently running |
| `done` | Step completed successfully |
| `failed` | Step failed; scan continues with fallback behavior |

---

## ClientCard Schema

Delivered in the `step: 5` event:

```typescript
interface ClientCard {
  businessName: string;
  ownerName?: string;
  businessType: string;
  area: string;
  description?: string;
  contactInfo: {
    phone?: string;
    email?: string;
    address?: string;
  };
  services: string[];
  digitalAssets: {
    type: 'website' | 'dapei-zahav' | 'social';
    url: string;
    label: string;
    scanStatus: 'pending' | 'success' | 'failed' | 'demo';
  }[];
  usedDemoData: boolean;
  scannedAt: string; // ISO 8601
}
```

---

## Error Handling

| Scenario | Behavior |
|---|---|
| Malformed JSON body | `400` before stream opens |
| Private/loopback URL | URL nulled; step 1 or 2 shows `failed` |
| URL unreachable / timeout | Step shows `failed`; scan continues |
| Both URLs fail | Steps 3-5 animate with demo card |
| Claude API error | Step 3 `failed`; steps 4-5 complete with demo card |
| `DEMO_MODE=true` | Full demo simulation — no real fetches or Claude calls |
| Unexpected server error | Stream closes without final event |

---

## Demo Mode

Activated when `process.env.ANTHROPIC_API_KEY` is falsy **or** `process.env.DEMO_MODE === 'true'`.

In demo mode, the same SSE stream is returned with simulated step delays. The final `clientCard` contains the AC technician fixture (`usedDemoData: true`).

---

## Example (curl)

```bash
curl -N -X POST http://localhost:3000/api/scan \
  -H "Content-Type: application/json" \
  -d '{"websiteUrl":"https://example.co.il","dapeiZahavUrl":""}'
```

Expected SSE output (demo mode):
```
data: {"step":1,"status":"active"}
data: {"step":1,"status":"done"}
data: {"step":2,"status":"active"}
data: {"step":2,"status":"done"}
data: {"step":3,"status":"active"}
data: {"step":3,"status":"done"}
data: {"step":4,"status":"active"}
data: {"step":4,"status":"done"}
data: {"step":5,"status":"done","clientCard":{...}}
```

---

## Implementation

**File:** `src/app/api/scan/route.ts`

Key implementation notes:
- `ReadableStream` with `TextEncoder` — compatible with Next.js App Router Edge/Node runtimes
- `controller.close()` only in `finally` block — prevents double-close stream truncation
- `AbortSignal.timeout(5000)` per URL fetch
- Claude call wrapped in try/catch for graceful degradation

---

## Related Documentation

- [AI Scan Flow](../flows/ai-scan-flow.md)
- [AI Scan Engine Feature](../features/ai-scan-engine.md)
- [Architecture: Scan Pipeline](../architecture/scan-pipeline-architecture.md)
