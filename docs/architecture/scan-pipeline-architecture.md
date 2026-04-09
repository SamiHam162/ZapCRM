# Architecture: AI Scan Pipeline

**Created:** 2026-04-09
**Last Updated:** 2026-04-09
**Version:** 1.0.0
**Status:** Complete

## Component Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  Browser (Client)                                               │
│                                                                 │
│  page.tsx                                                       │
│    ├── useClients()        ← ClientsContext (localStorage)      │
│    ├── useScanPipeline()   ← manages SSE stream + step state    │
│    ├── <ScanPipeline>      ← animated 5-step progress UI       │
│    └── <ClientCardView>    ← renders completed ClientCard       │
└────────────────────────────┬────────────────────────────────────┘
                             │ POST /api/scan (SSE stream)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Next.js Server (route.ts)                                      │
│                                                                 │
│  POST /api/scan                                                 │
│    ├── SSRF validation                                          │
│    ├── fetchAndExtract(websiteUrl)   → htmlExtractor.ts         │
│    ├── fetchAndExtract(dapeiZahavUrl)                           │
│    ├── extractClientDataWithClaude() → claudeClient.ts          │
│    │     └── Anthropic SDK                                      │
│    │           └── claude-haiku-4-5-20251001                    │
│    └── buildClientCard()            → ClientCard                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### Server → Client (SSE)

Each server-sent event is a UTF-8 encoded line:
```
data: {JSON}\n\n
```

The client uses `TextDecoder({ stream: true })` and a line buffer to safely reassemble multi-byte Hebrew characters split across chunk boundaries. Only complete `\n`-terminated lines are parsed.

### Client State Updates

`useScanPipeline` manages:
```typescript
steps: ScanStepState[]   // 5 items, each with status: pending|active|done|failed
clientCard: ClientCard | null
isScanning: boolean
error: string | null
```

Transitions are applied via `setSteps(prev => prev.map(...))` — immutable state updates keyed by `step.id`.

### Persistence

On scan completion (`clientCard` set in hook state), `page.tsx` fires a `useEffect`:
```typescript
dispatch({ type: 'UPDATE_CLIENT', id: client.id, updates: { clientCard, status: 'מוכן' } })
```
`ClientsContext` performs a shallow merge and persists the full client array to `localStorage`.

---

## Module Dependency Tree

```
route.ts
  ├── htmlExtractor.ts      (HTML → plain text)
  ├── scanPrompt.ts         (builds Hebrew Claude prompt)
  ├── claudeClient.ts       (@anthropic-ai/sdk wrapper)
  └── mockClientCard.ts     (MOCK_AC_TECHNICIAN_CARD fixture)

useScanPipeline.ts
  └── types.ts              (ScanStepState, ClientCard)

page.tsx (clients/[id])
  ├── useScanPipeline.ts
  ├── useClients.ts → ClientsContext.tsx
  ├── ScanPipeline.tsx → ScanStep.tsx
  └── ClientCardView.tsx
```

---

## Key Architectural Decisions

### Why SSE instead of WebSocket?
Server-Sent Events are unidirectional (server → client), which is all we need. SSE works natively with Next.js `ReadableStream` responses, requires no additional infrastructure, and auto-reconnects in browsers.

### Why `finally { controller.close() }` only?
The `ReadableStream` controller must not be closed more than once. Calling `close()` inside `try` blocks **and** in `finally` caused double-close errors that silently truncated the stream at step 4. The single `finally` close guarantees the stream flushes all buffered events before closing.

### Why `decoder.decode(value, { stream: true })`?
Hebrew text (multi-byte UTF-8) can be split across chunk boundaries. Without `{ stream: true }`, the decoder inserts replacement characters (U+FFFD) mid-character, corrupting JSON. The buffer accumulation pattern (`lines.pop()` retains incomplete last lines) compounds this protection.

### Why `AbortController` on fetch?
Next.js server components and route handlers run in Node.js. Without an abort signal, an unmounted client would keep an orphaned reader loop alive on the server connection, leaking memory across scans.

### Demo Mode Design
The demo check is the first thing handled in the stream callback. This ensures the demo path is isolated from production code and doesn't accidentally exercise real fetch/Claude code paths.

---

## Security Architecture

### SSRF Prevention (`isPrivateUrl`)

All URLs pass through `isPrivateUrl(rawUrl)` before any `fetch()` call:

```typescript
function isPrivateUrl(rawUrl: string): boolean {
  // Blocks: malformed, non-http(s), localhost, ::1,
  // IPv6 fc/fd, IPv4 ranges 10.x / 172.16-31.x / 192.168.x / 127.x / 169.254.x / 0.x
}
```

Invalid URLs are **silently nulled** (not an error) — the corresponding scan step will show `failed` rather than leaking information about why the URL was rejected.

**Limitation:** Domain names that resolve to private IPs bypass this check. Mitigated by the internal-only deployment context (production agents, not public users).

---

## File Locations

| File | Path |
|---|---|
| API route | `src/app/api/scan/route.ts` |
| HTML extractor | `src/lib/htmlExtractor.ts` |
| Scan prompt builder | `src/lib/scanPrompt.ts` |
| Claude API wrapper | `src/lib/claudeClient.ts` |
| Demo fixture | `src/lib/mockClientCard.ts` |
| Client-side hook | `src/hooks/useScanPipeline.ts` |
| Pipeline UI container | `src/components/scan/ScanPipeline.tsx` |
| Pipeline step component | `src/components/scan/ScanStep.tsx` |
| Card renderer | `src/components/clients/ClientCardView.tsx` |
| Detail page | `src/app/clients/[id]/page.tsx` |

---

## Related Documentation

- [AI Scan Flow](../flows/ai-scan-flow.md)
- [AI Scan Engine Feature](../features/ai-scan-engine.md)
- [API: POST /api/scan](../api/scan-endpoint.md)
