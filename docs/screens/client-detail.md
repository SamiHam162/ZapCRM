# Screen: Client Detail Page

**Created:** 2026-04-09
**Last Updated:** 2026-04-09
**Version:** 1.0.0
**Status:** Complete

## Overview

The client detail page (`/clients/[id]`) is the primary workspace for processing a single client through the onboarding pipeline: scan → card review → script generation → email send.

---

## Route

```
/clients/[id]
```

Dynamic segment. `id` is a nanoid string. Rendered by `src/app/clients/[id]/page.tsx` (Client Component, uses `use(params)`).

---

## Component Hierarchy

```
ClientPage (page.tsx)
  └─ TopBar (title=businessName, backHref="/clients")
  └─ main.p-6.max-w-3xl
      ├─ Header card
      │    └─ StatusBadge
      ├─ Digital assets card (URLs)
      ├─ Notes card (conditional)
      ├─ Scan CTA card (conditional)
      ├─ ScanPipeline (conditional)
      ├─ ClientCardView (conditional)
      └─ Script section (conditional)
           ├─ CallScriptLoadingState
           ├─ CallScriptCard
           │    └─ EmailPreviewModal (portal, conditional)
           └─ CallScriptGenerateButton
```

---

## Sections

### TopBar
- Displays `client.businessName` as title
- `backHref="/clients"` shows an `ArrowRight` icon button navigating back to dashboard
- Search input hidden when `backHref` is set

### Header Card
- Business name (h2), business type (subtitle)
- `StatusBadge` with current status
- Grid: area, creation date, sent date (if `sentAt` set)

### Digital Assets Card
- Website URL and Dapei Zahav URL as clickable links (`target="_blank"`)
- "לא צוין" placeholder when URL is empty

### Notes Card
- Only rendered when `client.notes` is non-empty

### Scan CTA Card
- Shown when `!showPipeline && !displayCard`
- "סרוק נכסים דיגיטליים" button disabled when `!canScan` (`canScan = status === 'ממתין' || status === 'סורק'`)

### Scan Pipeline (`ScanPipeline`)
- Shown when `showPipeline = isScanning || steps.some(s => s.status !== 'pending')`
- Animated 5-step progress with icons, labels, status dots
- "נסה שוב" button on failure

### Client Card (`ClientCardView`)
- Shown when `displayCard = clientCard ?? client.clientCard ?? null` is not null
- "סרוק מחדש" link shown when `canScan`
- Contains: business header, contact info (copy buttons), services list, digital assets

### Script Section
- Shown when `canGenerateScript = displayCard !== null && (status === 'מוכן' || status === 'נשלח')`
- Three states:
  1. **Loading:** `CallScriptLoadingState` — pulsing skeleton
  2. **Script ready:** `CallScriptCard` with 5 sections + email CTA
  3. **Not yet generated:** `CallScriptGenerateButton` (+ optional error message)
- `displayScript = script ?? client.callScript ?? null` — restored from localStorage on refresh

### Email Preview Modal (`EmailPreviewModal`)
- Triggered from `CallScriptCard` when producer clicks "שלח ללקוח בדוא״ל"
- Full-screen overlay, z-50
- Shows header (chrome bar), email metadata (from/to/subject), body (ZAP logo + sections + footer), action buttons
- "שלח עכשיו →" triggers 1.5s animation, closes modal, fires `onSend(sentAt)`, calls `toast.success`

---

## State & Side Effects

### Hooks Used

| Hook | Source | Purpose |
|---|---|---|
| `useClients()` | `src/hooks/useClients.ts` | clients array + dispatch |
| `useScanPipeline()` | `src/hooks/useScanPipeline.ts` | SSE scan state |
| `useScriptGeneration()` | `src/hooks/useScriptGeneration.ts` | script loading state |

### Key Computed Values

```typescript
const canScan = client.status === 'ממתין' || client.status === 'סורק';
const showPipeline = isScanning || steps.some((s) => s.status !== 'pending');
const displayCard = clientCard ?? client.clientCard ?? null;
const canGenerateScript = displayCard !== null && (client.status === 'מוכן' || client.status === 'נשלח');
const displayScript = script ?? client.callScript ?? null;
```

### Side Effects

```typescript
// Persist scan result to localStorage after scan completes
useEffect(() => {
  if (clientCard && client) {
    dispatch({ type: 'UPDATE_CLIENT', id: client.id, updates: { clientCard, status: 'מוכן' } });
  }
}, [clientCard, client?.id]);
```

### Action Handlers

```typescript
handleScan()   // reset + SET_STATUS('סורק') + startScan(urls)
handleSend()   // SEND_SCRIPT { id, sentAt }
handleGenerate() // generate(displayCard) → UPDATE_CLIENT { callScript }
```

---

## Not Found State

When `client === undefined` (invalid ID):
- Renders "לקוח לא נמצא" empty state with emoji, message, and "חזרה לרשימה" button

---

## Related Documentation

- [Dashboard Screen](./dashboard.md)
- [Client Onboarding Flow](../flows/client-onboarding-flow.md)
- [Client Status Workflow](../statuses/client-status-workflow.md)
- [AI Scan Engine Feature](../features/ai-scan-engine.md)
- [Call Script Generation Feature](../features/call-script-generation.md)
