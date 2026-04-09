# Feature: AI Scan Engine

**Created:** 2026-04-09
**Last Updated:** 2026-04-09
**Version:** 1.0.0
**Status:** Complete

## What It Does (User Perspective)

The AI scan engine takes a client's website URL and/or Dapei Zahav listing URL and automatically extracts structured business information from the pages — business name, contact details, service list, area, and more — presenting the result as a formatted client card.

The scan takes roughly 5-15 seconds (or ~5 seconds in demo mode). Progress is shown in real time through an animated 5-step pipeline.

---

## How It Works (Technical)

### Pipeline Steps

| Step | ID | What Happens |
|---|---|---|
| Scan website | 1 | `fetchAndExtract(websiteUrl)` — HTTP GET with 5s timeout, HTML → plain text |
| Scan Dapei Zahav | 2 | Same for `dapeiZahavUrl` |
| AI analysis | 3 | Extracted texts → Claude `claude-haiku-4-5-20251001` → `ExtractedClientData` JSON |
| Build client card | 4 | `buildClientCard()` maps extracted data → `ClientCard` shape |
| Done | 5 | Final `clientCard` delivered in SSE event; frontend persists it |

### HTML Extraction (`src/lib/htmlExtractor.ts`)
1. Remove `<script>` and `<style>` blocks
2. Replace block-level tags (`h1-h6`, `p`, `div`, `li`, `br`, `tr`) with newlines
3. Strip remaining HTML tags
4. Decode 4 common HTML entities (`&amp;`, `&nbsp;`, `&quot;`, `&#39;`)
5. Collapse whitespace to single spaces
6. Truncate to 8 000 characters (fits safely in Claude's context)

### Claude Extraction (`src/lib/claudeClient.ts`)
- Model: `claude-haiku-4-5-20251001`
- Max tokens: 1 024
- Timeout: 30 000 ms
- Prompt: Hebrew — instructs JSON-only response with 7 fields
- JSON extracted via regex `/\{[\s\S]*\}/`
- `services` field validated as array (coerced to `[]` if not)

### SSE Streaming (`src/app/api/scan/route.ts`)
- `ReadableStream` with `TextEncoder`
- Each event: `data: {step, status, clientCard?}\n\n`
- `controller.close()` only in `finally` block (no double-close)
- SSRF protection: private/loopback IPs blocked before any fetch

### Client-Side Consumption (`src/hooks/useScanPipeline.ts`)
- `TextDecoder` with `{ stream: true }` for correct multi-byte (Hebrew UTF-8) handling
- Line buffer accumulation — incomplete chunks retained until `\n` received
- `AbortController` wired to fetch; aborted on unmount via `useEffect` cleanup
- 5 `ScanStepState` items with status transitions: `pending → active → done|failed`

---

## Demo Mode

Triggered when `ANTHROPIC_API_KEY` is absent or `DEMO_MODE=true` in `.env.local`.

In demo mode, `simulateDemoScan()` animates all 5 steps with artificial delays:
- Steps 1-2: 1 200 ms each
- Step 3: 1 800 ms
- Step 4: 900 ms

Returns `MOCK_AC_TECHNICIAN_CARD` expanded with `scannedAt: new Date().toISOString()`.

The fixture represents "קירור ומיזוג אבי כהן - הקריות" with 6 services, full contact info, and 2 digital assets, all marked `scanStatus: 'demo'`.

---

## SSRF Protection

The server validates every URL before fetching:
- Protocol must be `http:` or `https:`
- Hostname `localhost` blocked
- IPv4 private ranges blocked: `10.x`, `172.16-31.x`, `192.168.x`, `127.x`, `169.254.x`, `0.x`
- IPv6 loopback (`::1`) and private (`fc/fd` prefix) blocked
- Malformed URLs blocked
- Invalid URLs are silently nulled (not treated as errors)

---

## Configuration

| Env Var | Default | Effect |
|---|---|---|
| `ANTHROPIC_API_KEY` | _(empty)_ | If absent, forces demo mode |
| `DEMO_MODE` | `true` | Set to `true` to force demo regardless of API key |

`.env.local` template:
```
ANTHROPIC_API_KEY=
DEMO_MODE=true
```

---

## Known Limitations

- HTML entity decoding covers only 4 common entities (`&amp;`, `&nbsp;`, `&quot;`, `&#39;`)
- No DNS-level SSRF protection — domain names that resolve to private IPs pass validation
- Single Claude call per scan (no retry on rate-limit errors)
- Max extracted text: 8 000 chars per source (16 000 chars total to Claude)

---

## Dependencies

- `@anthropic-ai/sdk` ^0.86.1
- `ANTHROPIC_API_KEY` environment variable (optional — falls back to demo)
- `src/lib/scanPrompt.ts` — prompt builder
- `src/lib/htmlExtractor.ts` — HTML → plain text
- `src/lib/mockClientCard.ts` — demo fixture

---

## Related Documentation

- [AI Scan Flow](../flows/ai-scan-flow.md)
- [API: POST /api/scan](../api/scan-endpoint.md)
- [Architecture: Scan Pipeline](../architecture/scan-pipeline-architecture.md)
