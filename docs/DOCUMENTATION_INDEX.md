# Documentation Index

**Last Updated:** 2026-04-09
**Total Files:** 13

---

## Quick Reference

| Layer | Files | Status |
|---|---|---|
| Product Overview | 1 | ✓ |
| User Flows | 2 | ✓ |
| Screens | 2 | ✓ |
| Status Workflows | 1 | ✓ |
| Features | 3 | ✓ |
| API Reference | 2 | ✓ |
| Architecture | 2 | ✓ |

---

## All Documentation Files

### Product Overview
- [`PRODUCT_OVERVIEW.md`](./PRODUCT_OVERVIEW.md) — Product purpose, feature list, tech stack, user journey summary, current state

### User Flows (`docs/flows/`)
- [`flows/client-onboarding-flow.md`](./flows/client-onboarding-flow.md) — Complete 8-step flow: add client → scan → card review → script generation → email send; includes sequence diagram and error paths
- [`flows/ai-scan-flow.md`](./flows/ai-scan-flow.md) — AI scan pipeline sub-flow: SSE events, card persistence, demo mode behavior

### Screens (`docs/screens/`)
- [`screens/dashboard.md`](./screens/dashboard.md) — Client list dashboard: search, filter tabs, status groups, pagination, add client, delete
- [`screens/client-detail.md`](./screens/client-detail.md) — Client detail page: scan pipeline, card view, script generation, email modal, state hooks

### Status Workflows (`docs/statuses/`)
- [`statuses/client-status-workflow.md`](./statuses/client-status-workflow.md) — Four-status state machine (ממתין/סורק/מוכן/נשלח): transitions, context actions, UI behavior per status, data model

### Features (`docs/features/`)
- [`features/ai-scan-engine.md`](./features/ai-scan-engine.md) — AI scan engine: HTML extraction, Claude Haiku call, SSRF protection, SSE buffering, demo mode, configuration
- [`features/call-script-generation.md`](./features/call-script-generation.md) — Script generation: Claude Opus 4.6 prompt, API route design, persistence, demo fallback, error handling
- [`features/demo-mode.md`](./features/demo-mode.md) — Demo mode system: activation logic, env vars, banner component, fixture data, per-operation behavior

### API Reference (`docs/api/`)
- [`api/scan-endpoint.md`](./api/scan-endpoint.md) — POST /api/scan: SSE stream format, step definitions, ClientCard schema, SSRF protection, curl example
- [`api/generate-script-endpoint.md`](./api/generate-script-endpoint.md) — POST /api/generate-script: request/response schemas, demo mode, error handling, implementation notes, curl example

### Architecture (`docs/architecture/`)
- [`architecture/scan-pipeline-architecture.md`](./architecture/scan-pipeline-architecture.md) — Scan pipeline component diagram, data flow, module dependency tree, key design decisions
- [`architecture/state-management.md`](./architecture/state-management.md) — useReducer + Context + localStorage: action types, initial state loading, persistence, Client type, provider placement

---

## What's Not Yet Documented

Low priority for current internal tool stage:
- RTL layout system and Zap brand tokens (`tailwind.config.ts`, CSS variables)
- `useClients`, `useScanPipeline` hook internals (readable from source)
- `htmlExtractor.ts` — HTML stripping utility
- Mock client seed data (`src/lib/mockData.ts`)
- `AppShell` / `Sidebar` layout components
