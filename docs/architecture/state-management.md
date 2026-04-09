# Architecture: State Management

**Created:** 2026-04-09
**Last Updated:** 2026-04-09
**Version:** 1.0.0
**Status:** Complete

## Overview

Client state is managed with React's `useReducer` + Context pattern, with automatic persistence to `localStorage`. All mutations flow through typed dispatch actions. No external state library is used.

---

## Architecture

```
ClientsProvider (context/ClientsContext.tsx)
  └─ useReducer(reducer, [], loadInitialState)
  │    └─ reducer(state: Client[], action: Action): Client[]
  └─ useEffect → localStorage.setItem on every state change
  └─ ClientsContext.Provider (exposes { clients, dispatch })
        └─ (all child components via useClients hook)
```

---

## Context: `ClientsContext`

**File:** `src/context/ClientsContext.tsx`

```typescript
interface ClientsContextValue {
  clients: Client[];
  dispatch: React.Dispatch<Action>;
}
```

Consumed via `useClients()` hook (`src/hooks/useClients.ts`).

---

## Action Types

```typescript
type Action =
  | { type: 'ADD_CLIENT'; client: Client }
  | { type: 'UPDATE_CLIENT'; id: string; updates: Partial<Client> }
  | { type: 'SET_STATUS'; id: string; status: ClientStatus }
  | { type: 'DELETE_CLIENT'; id: string }
  | { type: 'SEND_SCRIPT'; id: string; sentAt: string };
```

| Action | Effect |
|---|---|
| `ADD_CLIENT` | Prepends new client to array |
| `UPDATE_CLIENT` | Shallow-merges `updates` into matching client |
| `SET_STATUS` | Updates `status` field on matching client |
| `DELETE_CLIENT` | Filters out client with matching id |
| `SEND_SCRIPT` | Sets `status: 'נשלח'` and `sentAt` on matching client |

`UPDATE_CLIENT` is used for both scan results (`{ clientCard, status: 'מוכן' }`) and script persistence (`{ callScript }`).

---

## Initial State Loading

```typescript
function loadInitialState(): Client[] {
  if (typeof window === 'undefined') return MOCK_CLIENTS;
  try {
    const stored = localStorage.getItem('zap-crm-clients');
    if (stored) return JSON.parse(stored) as Client[];
  } catch {
    // Private mode or corrupted storage — fall back to mock data
  }
  return MOCK_CLIENTS;
}
```

- SSR: returns `MOCK_CLIENTS` (no localStorage access)
- Client with no stored data: returns `MOCK_CLIENTS` (onboarding experience)
- Client with stored data: returns parsed array

---

## Persistence

```typescript
useEffect(() => {
  try {
    localStorage.setItem('zap-crm-clients', JSON.stringify(clients));
  } catch {
    // localStorage unavailable — continue without persisting
  }
}, [clients]);
```

Runs on every state change. The entire `Client[]` array is serialized. `clientCard` and `callScript` are included — scan and script results survive page refresh.

**localStorage key:** `zap-crm-clients`

---

## Mock Seed Data

**File:** `src/lib/mockData.ts`

Provides initial `MOCK_CLIENTS` array shown when no localStorage data exists. Includes clients in all 4 statuses (ממתין, סורק, מוכן, נשלח) for demonstration.

---

## Provider Placement

**File:** `src/app/layout.tsx`

```tsx
<DemoModeBanner />
<ClientsProvider>
  <AppShell>
    {children}
  </AppShell>
  <Toaster position="bottom-center" richColors dir="rtl" />
</ClientsProvider>
```

`DemoModeBanner` is rendered outside `ClientsProvider` (it doesn't need client data). `Toaster` is inside `ClientsProvider` (sonner context).

---

## Client Type

```typescript
interface Client {
  id: string;                        // nanoid()
  businessName: string;
  websiteUrl?: string;
  dapeiZahavUrl?: string;
  status: ClientStatus;              // 'ממתין' | 'סורק' | 'מוכן' | 'נשלח'
  createdAt: string;                 // ISO 8601
  sentAt?: string;                   // ISO 8601, set by SEND_SCRIPT
  notes?: string;
  area?: string;
  businessType?: string;
  clientCard?: ClientCard;           // set by UPDATE_CLIENT after scan
  callScript?: CallScriptSection[];  // set by UPDATE_CLIENT after generate
}
```

---

## Related Documentation

- [Client Status Workflow](../statuses/client-status-workflow.md)
- [Client Onboarding Flow](../flows/client-onboarding-flow.md)
- [Architecture: Scan Pipeline](./scan-pipeline-architecture.md)
