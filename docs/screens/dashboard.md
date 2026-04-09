# Screen: Dashboard

**Created:** 2026-04-09
**Last Updated:** 2026-04-09
**Version:** 1.0.0
**Status:** Complete

## Overview

The main dashboard (`/clients`) lists all clients grouped by status, with search, filter tabs, and an "Add Client" button. It is the primary entry point for the production team.

---

## Route

```
/clients
```

Rendered by `src/app/clients/page.tsx` (Client Component).

---

## Component Hierarchy

```
ClientsPage (page.tsx)
  └─ AppShell
      └─ TopBar (search input)
      └─ main
          ├─ Dashboard header (title + AddClientDialog button)
          ├─ Summary bar (ממתין / מוכן / נשלח counts)
          ├─ Filter tabs (הכל / ממתין / סורק / מוכן / נשלח)
          └─ ClientTable (filtered client list)
               └─ ClientTableSection[] (one per status group)
                    └─ Collapsible header (chevron + status dot + count)
                    └─ Table (table-fixed, colgroup)
                         └─ TableRow[] (clickable → /clients/[id])
                              └─ TrashIcon (delete, stopPropagation)
                    └─ Pagination (if > 12 clients per group)
```

---

## Features

### Search
- `TopBar` renders a search `<input>` when `backHref` is not set
- Filters `clients` array by `businessName.toLowerCase().includes(query)`
- Search state lives in `ClientsPage`

### Filter Tabs
- Five tabs: הכל | ממתין | סורק | מוכן | נשלח
- Active tab highlighted with `zap-orange` underline
- Sets `filter` state → passed to `ClientTable`

### Summary Bar
- Shows count of ממתין, מוכן, and נשלח clients
- Only counts from current search results

### ClientTable

**File:** `src/components/clients/ClientTable.tsx`

Receives `clients` (search-filtered) and `filter`. Applies status filter, groups by status, renders one `ClientTableSection` per group.

**Groups are ordered:** ממתין → סורק → מוכן → נשלח

### ClientTableSection

Each section is an independently collapsible group:

- **Header button:** colored by status (amber/blue/emerald/orange), shows chevron + dot + name + count
- **Table:** `table-fixed` with `<colgroup>` columns: 35% / 25% / 20% / 14% / 6%
  - Col 1: שם עסק (bold, hover → orange + underline)
  - Col 2: סוג עסק
  - Col 3: אזור
  - Col 4: תאריך (sentAt for נשלח, createdAt otherwise, DD/MM/YYYY Hebrew locale)
  - Col 5: Delete button (Trash2, hover red)
- **Row click:** navigates to `/clients/[id]`
- **Delete click:** `e.stopPropagation()` + `confirm()` dialog + `DELETE_CLIENT` dispatch

### Pagination

Shown when a status group has > 12 clients:
- "X–Y מתוך Z" count
- Previous / Next buttons with disabled states

---

## Add Client Dialog

**Component:** `AddClientDialog`

Opens a modal form:
- שם עסק (required)
- כתובת אתר
- כתובת דפי זהב
- אזור
- סוג עסק
- הערות

On submit: `ADD_CLIENT` dispatch with `nanoid()` id, `createdAt: new Date().toISOString()`, `status: 'ממתין'`.

---

## Empty States

| Scenario | Display |
|---|---|
| No clients match filter | "אין לקוחות להצגה" centered text |
| No clients at all | Same (mock data loads by default) |

---

## Related Documentation

- [Client Detail Screen](./client-detail.md)
- [Client Status Workflow](../statuses/client-status-workflow.md)
- [Architecture: State Management](../architecture/state-management.md)
- [Client Onboarding Flow](../flows/client-onboarding-flow.md)
