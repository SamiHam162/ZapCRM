# Zap Onboarding CRM

An internal tool for Zap Group Israel's production team. When a new client purchases a website or Dapei Zahav listing package, the producer opens the client in this app, clicks **Scan**, and the system automatically builds a structured client card and a personalized Hebrew onboarding call script — ready to review and send.

Built with Next.js 16, Tailwind CSS v4, shadcn/ui, and Anthropic Claude.

---

## How It Works

The system runs a 3-step AI pipeline per client:

```
1. Fetch   → downloads the client's website and/or Dapei Zahav listing
2. Extract → parses the HTML and builds a structured client card
             (business name, services, address, phone, email)
3. Script  → generates a personalized 5-section Hebrew onboarding call script
             based on the extracted card
```

After the script is generated, the producer can preview it as a formatted email and click **Send** — which marks the client as `נשלח` (sent) with a timestamp.

### Three Operating Modes

| Mode | How to activate | What happens |
|---|---|---|
| **Demo** | `DEMO_MODE=true` | Returns pre-built fixture data. No internet access, no API needed. |
| **Real (no AI)** | `DEMO_MODE=false`, no API key | Fetches real URLs + extracts data using local HTML/regex parsing. Free, no API needed. |
| **Real (AI)** | `DEMO_MODE=false` + `ANTHROPIC_API_KEY` set | Fetches real URLs + Claude Haiku extraction + Claude Opus script generation. Best quality. |

---

## Quick Start

```bash
# 1. Clone and install
git clone <your-repo-url>
cd zap-onboarding-crm
npm install

# 2. Set up environment
cp .env.local.example .env.local
# Edit .env.local:
#   - Leave ANTHROPIC_API_KEY empty to use local extraction (no API needed)
#   - Or add your key for full Claude AI quality
#   - Set DEMO_MODE=true to use fixture data only

# 3. Run
npm run dev
# → http://localhost:3000
```

---

## The 4 Demo Clients

When you first open the app (or clear localStorage), four pre-seeded clients are loaded — one for each status in the pipeline. They let you explore the full workflow without scanning anything.

### 1. קירור ומיזוג אבי כהן · `ממתין` (Waiting)

An HVAC technician from the Krayot area (Haifa suburbs). This client has just been added to the system — no scan has been run yet. Demonstrates the **initial state**: the detail page shows the scan CTA button.

- **To progress:** click the client → click "סרוק נכסים דיגיטליים" to run the scan pipeline.

---

### 2. מסעדת השף — ירושלים · `מוכן` (Ready)

A kosher restaurant in Jerusalem (Rehavia). The scan has already completed and the client card is populated with business info, services, and contact details. The script has not been generated yet. Demonstrates the **post-scan state**.

- **To progress:** click the client → scroll to the bottom → click "צור תסריט שיחה" to generate the onboarding call script.

---

### 3. שיפוצניק פרו — גלעד לוי · `נשלח` (Sent)

A renovation contractor in Tel Aviv. This client has gone through the full pipeline: card extracted, call script generated, email sent. Demonstrates the **completed state** — you can view the full client card and the 5-section call script as they were sent.

- **sentAt** timestamp: 07/04/2026 14:30
- The "שלח ללקוח בדוא״ל" button will re-open the email preview modal.

---

### 4. ד"ר רחל ברקוביץ — רפואת שיניים · `סורק` (Scanning)

A dental clinic in Haifa. This client represents the **in-progress scan state** — the status is frozen at `סורק` in the fixture data to demonstrate how the pipeline step indicator looks while running. (In real usage this status is transient and resolves within seconds.)

---

## Client Status Flow

```
ממתין → סורק → מוכן → נשלח
  │        │       │        │
 Added   Scan    Card    Script
          runs   ready   sent
```

| Status | Hebrew | Meaning |
|---|---|---|
| `ממתין` | Waiting | Client added, scan not started |
| `סורק` | Scanning | Scan pipeline in progress |
| `מוכן` | Ready | Card extracted, script not yet generated |
| `נשלח` | Sent | Script generated and email sent |

---

## Usage Guide

### Adding a New Client

1. Click **+ לקוח חדש** (top right of dashboard)
2. Fill in the form:
   - **שם עסק** — business name (required)
   - **כתובת אתר** — website URL (optional but improves extraction quality)
   - **כתובת דפי זהב** — Dapei Zahav listing URL (optional)
   - **אזור** — area / city
   - **סוג עסק** — business type
   - **הערות** — any notes
3. At least one URL (website or Dapei Zahav) is required to run a scan. Without URLs, you can still add the client manually.
4. Click **הוספת לקוח** — the client is created with status `ממתין` and you are taken to the detail page.

**Real test client to try:**
```
שם עסק:          חשמל דניאל
כתובת דפי זהב:   https://www.d.co.il/80336090/17910/
אזור:            תל אביב
סוג עסק:         חשמלאות
```
This is a live Dapei Zahav listing with a real phone number, address, and 6 services in the HTML.

---

### Running a Scan

1. Open a client with status `ממתין`
2. Click **סרוק נכסים דיגיטליים ←**
3. Watch the 5-step pipeline animate:
   - שלב 1: Fetching website HTML
   - שלב 2: Fetching Dapei Zahav HTML
   - שלב 3: Extracting structured data
   - שלב 4: Building client card
   - שלב 5: Done
4. The client card appears below the pipeline with extracted business name, contact info, services, and digital assets.
5. Client status automatically flips to `מוכן`.

If a URL is unreachable, that step shows `failed` but the pipeline continues with whatever data was fetched from the other URL.

---

### Generating the Call Script

1. Open a client with status `מוכן` or `נשלח`
2. Scroll to the bottom of the page
3. Click **צור תסריט שיחה**
4. Wait ~1 second (template mode) or several seconds (Claude mode)
5. A 5-section call script appears, personalized with the client's actual business name, services, area, and phone number:
   - **פתיחה** — opening greeting
   - **מטרת השיחה** — purpose of the call
   - **סקירת הנכסים הדיגיטליים** — review of what was built
   - **הצעדים הבאים** — next steps (what the client needs to provide)
   - **סגירה חמה** — warm closing

---

### Sending the Email

1. From the call script view, click **שלח ללקוח בדוא״ל**
2. An email preview modal opens showing the formatted email as it will appear in the client's inbox (From, To, Subject, body)
3. Review the content
4. Click **שלח עכשיו →**
5. After a 1.5-second confirmation animation, the modal closes and a toast notification confirms the send
6. The client status flips to `נשלח` with the current timestamp
7. The dashboard now shows the `sentAt` date in this client's row

---

### Dashboard Features

- **Search** — filters by business name, business type, and area simultaneously
- **Status tabs** — filter to סה"כ / ממתין / סורק / מוכן / נשלח
- **Summary bar** — count of clients per status, clickable as filter buttons
- **Status groups** — clients are grouped by status with collapsible sections
- **Delete** — trash icon on each row (with confirmation prompt)
- **Mobile** — card layout at narrow viewports instead of table

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | No | *(empty)* | Anthropic API key. If empty, uses local regex extraction for scan and template generation for scripts. |
| `DEMO_MODE` | No | `false` | Set to `true` to always return fixture data instead of fetching real URLs. |
| `NEXT_PUBLIC_DEMO_MODE` | No | `false` | Must match `DEMO_MODE`. Shows/hides the orange demo banner in the browser. |

Copy `.env.local.example` to `.env.local` to get started.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui |
| Font | Rubik (Hebrew-optimized) |
| AI — Extraction | Claude Haiku (when API key is set) |
| AI — Script | Claude Opus 4.6 (when API key is set) |
| Local extraction | Regex + Schema.org JSON-LD parsing (no API) |
| State | `useReducer` + React Context + `localStorage` |
| Streaming | Server-Sent Events (SSE) for scan pipeline |

---

## Project Structure

```
src/
├── app/
│   ├── clients/              Dashboard page (list, search, filter)
│   ├── clients/[id]/         Client detail (scan → card → script → send)
│   └── api/
│       ├── scan/             SSE streaming endpoint — fetch + extract
│       └── generate-script/  POST endpoint — script generation
├── components/
│   ├── clients/              Table, card view, call script, email modal
│   ├── scan/                 Pipeline step indicator
│   ├── layout/               AppShell, Sidebar, TopBar
│   └── ui/                   shadcn/ui primitives + DemoModeBanner
├── context/
│   └── ClientsContext.tsx    Global state (useReducer + localStorage)
├── hooks/
│   ├── useClients.ts         Context consumer
│   ├── useScanPipeline.ts    SSE scan orchestration
│   └── useScriptGeneration.ts Script fetch + state
└── lib/
    ├── types.ts              Client, ClientCard, CallScriptSection types
    ├── claudeClient.ts       Claude Haiku extraction wrapper
    ├── regexExtractor.ts     Local HTML/regex extraction (no API)
    ├── templateScript.ts     Template-based script generation (no API)
    ├── htmlExtractor.ts      HTML → plain text stripper
    ├── scanPrompt.ts         Claude extraction prompt builder
    ├── scriptPrompt.ts       Claude script prompt builder
    └── mockData.ts           Pre-seeded demo clients
```

---

## Data Persistence

All client data is stored in `localStorage` under the key `zap-crm-clients`. The mock clients are loaded once on first visit (when localStorage is empty). Clearing localStorage resets the app to the 4 demo clients.

No database, no backend storage, no authentication — this is a client-side prototype with server-side AI API calls only.
