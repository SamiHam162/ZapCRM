# ZapAI Onboarding CRM — Product Overview

**Created:** 2026-04-09
**Last Updated:** 2026-04-09
**Version:** 3.0.0
**Status:** Active

## Purpose

ZapAI CRM is an internal tool for Zap Group's production team to onboard new business clients. It automates the time-consuming process of building a client knowledge card by scanning the client's digital footprint (website + Dapei Zahav listing), running the content through Claude AI, and presenting the extracted data as a structured card — ready for use in outreach. The producer then generates a personalized Hebrew call script with one click, previews it as an email, and "sends" it.

**Target users:** Zap Group production agents who onboard new business clients.

---

## Value Proposition

Without this tool, production agents must manually visit multiple websites, copy-paste contact info, summarize what a business does, and write a customized outreach script. With ZapAI CRM:

- **30-second scan** replaces 15+ minutes of manual research
- **Structured client cards** surface phone, email, address, services, and business type
- **One-click script generation** produces a 5-section personalized Hebrew call script via Claude Opus
- **Email simulation** lets the producer preview and "send" the script — updating client status automatically
- **Demo mode** works without an API key — safe for demonstrations and testing
- **Persistent state** — cards and scripts survive page refresh via localStorage

---

## Feature List

| Feature | Description |
|---|---|
| Client list dashboard | Paginated, filterable table grouped by status: Pending / Scanning / Ready / Sent |
| Add client dialog | Form to enter business name, website URL, Dapei Zahav URL, area, type, notes |
| Status tracking | Four-stage pipeline per client: ממתין → סורק → מוכן → נשלח |
| AI scan engine | Fetches HTML from client URLs, extracts plain text, sends to Claude Haiku, returns structured JSON |
| Animated scan pipeline | 5-step SSE-streamed progress UI (fetch site → fetch DZ → AI analysis → build card → done) |
| Client card view | Rendered card with business header, contact info (with copy), services, digital assets |
| Call script generation | Claude Opus 4.6 generates a 5-section personalized Hebrew onboarding script |
| Email preview modal | Full-screen modal previewing the email (From/To/Subject/Body), 1.5s send animation |
| Send flow | "שלח עכשיו" updates client to נשלח with sentAt timestamp, shows toast confirmation |
| Demo mode | Full simulation with realistic fixture data when `ANTHROPIC_API_KEY` is absent |
| Demo mode banner | Dismissible orange top bar indicating demo mode is active |
| SSRF protection | Private/loopback IP ranges blocked before any external fetch |
| RTL Hebrew UI | Full right-to-left layout with Hebrew copy throughout |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.3 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 (CSS-first config) |
| Components | shadcn/ui (Base UI + CVA) |
| AI — Extraction | Anthropic Claude Haiku (`claude-haiku-4-5-20251001`) |
| AI — Script | Anthropic Claude Opus 4.6 (`claude-opus-4-6`) |
| State | `useReducer` + Context + localStorage |
| Streaming | Server-Sent Events (SSE) via `ReadableStream` API route |
| Notifications | sonner (toast) |
| Icons | Lucide React |
| IDs | nanoid |

---

## User Journey (Summary)

```
Producer adds client → Client status: ממתין
  ↓
Producer clicks "סרוק נכסים" → status: סורק
  ↓ (SSE stream, 5 steps)
AI scan completes → Client card displayed → status: מוכן
  ↓
Producer clicks "צור תסריט שיחה" → Claude Opus generates script
  ↓
Script displayed → Producer clicks "שלח ללקוח בדוא״ל"
  ↓
Email preview modal → Producer clicks "שלח עכשיו"
  ↓ (1.5s animation + toast)
Status → נשלח, sentAt recorded, script persisted
```

---

## Current State

**Shipped (Phase 1 + 2 + 3):**
- Full client list dashboard with search, filter, status grouping, pagination
- RTL Hebrew UI with Zap brand colors
- Add client form with validation
- Individual client detail page with back navigation
- AI scan engine with streaming pipeline animation
- SSRF protection + SSE chunk-boundary buffering
- Client card extraction + localStorage persistence
- Call script generation with Claude Opus 4.6
- Email preview modal with send simulation
- SEND_SCRIPT action (status + sentAt + callScript persistence)
- DemoModeBanner + sonner toast notifications
- Demo mode (no API key required)

**Not implemented (out of scope for v1):**
- Real email delivery (simulation only)
- Multi-user authentication
- Database backend (localStorage only)
- Edit client details
- Analytics / reporting

---

## Related Documentation

- [Client Status Workflow](./statuses/client-status-workflow.md)
- [Client Onboarding Flow](./flows/client-onboarding-flow.md)
- [AI Scan Flow](./flows/ai-scan-flow.md)
- [Dashboard Screen](./screens/dashboard.md)
- [Client Detail Screen](./screens/client-detail.md)
- [AI Scan Engine Feature](./features/ai-scan-engine.md)
- [Call Script Generation Feature](./features/call-script-generation.md)
- [Demo Mode Feature](./features/demo-mode.md)
- [API: POST /api/scan](./api/scan-endpoint.md)
- [API: POST /api/generate-script](./api/generate-script-endpoint.md)
- [Architecture: State Management](./architecture/state-management.md)
- [Documentation Index](./DOCUMENTATION_INDEX.md)
