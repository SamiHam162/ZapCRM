import { extractTextFromHtml } from '@/lib/htmlExtractor';
import { extractClientDataWithClaude, ExtractedClientData } from '@/lib/claudeClient';
import { extractClientDataFromHtml } from '@/lib/regexExtractor';
import { MOCK_AC_TECHNICIAN_CARD } from '@/lib/mockClientCard';
import { ClientCard } from '@/lib/types';

const DEMO_STEPS_DELAY_MS = 1200;

/** Returns true if url should be blocked (private/loopback/non-http). */
function isPrivateUrl(rawUrl: string): boolean {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return true; // malformed
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') return true;

  const host = url.hostname.replace(/^\[|\]$/g, ''); // strip IPv6 brackets

  if (host === 'localhost') return true;

  // IPv6 loopback / private
  if (host === '::1' || host.startsWith('fc') || host.startsWith('fd')) return true;

  // IPv4 private ranges
  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const [a, b] = [Number(ipv4[1]), Number(ipv4[2])];
    if (a === 10) return true;                         // 10.0.0.0/8
    if (a === 172 && b >= 16 && b <= 31) return true;  // 172.16.0.0/12
    if (a === 192 && b === 168) return true;            // 192.168.0.0/16
    if (a === 127) return true;                         // 127.0.0.0/8
    if (a === 169 && b === 254) return true;            // 169.254.0.0/16
    if (a === 0) return true;                           // 0.0.0.0/8
  }

  return false;
}

function buildClientCard(
  data: ExtractedClientData,
  websiteUrl?: string,
  dapeiZahavUrl?: string,
  usedDemoData = false
): ClientCard {
  const digitalAssets: ClientCard['digitalAssets'] = [];
  if (websiteUrl) {
    digitalAssets.push({
      type: 'website',
      url: websiteUrl,
      label: 'אתר אינטרנט',
      scanStatus: usedDemoData ? 'demo' : 'success',
    });
  }
  if (dapeiZahavUrl) {
    digitalAssets.push({
      type: 'dapei-zahav',
      url: dapeiZahavUrl,
      label: 'דפי זהב',
      scanStatus: usedDemoData ? 'demo' : 'success',
    });
  }

  return {
    businessName: data.businessName || '',
    ownerName: data.ownerName ?? undefined,
    businessType: data.businessType || '',
    area: data.area || '',
    description: data.description ?? undefined,
    contactInfo: {
      phone: data.contactInfo?.phone ?? undefined,
      email: data.contactInfo?.email ?? undefined,
      address: data.contactInfo?.address ?? undefined,
    },
    services: data.services || [],
    digitalAssets,
    usedDemoData,
    scannedAt: new Date().toISOString(),
  };
}

/** Fetches raw HTML from a URL. Returns null if fetch fails or URL is blocked. */
async function fetchHtml(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ZapBot/1.0)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'he,en;q=0.9',
      },
    });
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
}

async function simulateDemoScan(
  send: (data: object) => void
): Promise<ClientCard> {
  send({ step: 1, status: 'active' });
  await new Promise((r) => setTimeout(r, DEMO_STEPS_DELAY_MS));
  send({ step: 1, status: 'done' });

  send({ step: 2, status: 'active' });
  await new Promise((r) => setTimeout(r, DEMO_STEPS_DELAY_MS));
  send({ step: 2, status: 'done' });

  send({ step: 3, status: 'active' });
  await new Promise((r) => setTimeout(r, DEMO_STEPS_DELAY_MS * 1.5));
  send({ step: 3, status: 'done' });

  send({ step: 4, status: 'active' });
  await new Promise((r) => setTimeout(r, DEMO_STEPS_DELAY_MS * 0.75));
  send({ step: 4, status: 'done' });

  return { ...MOCK_AC_TECHNICIAN_CARD, scannedAt: new Date().toISOString() };
}

export async function POST(request: Request) {
  let websiteUrl: string | undefined;
  let dapeiZahavUrl: string | undefined;
  try {
    const body = await request.json();
    websiteUrl = body.websiteUrl;
    dapeiZahavUrl = body.dapeiZahavUrl;
  } catch {
    return new Response('גוף הבקשה אינו תקין', { status: 400 });
  }

  // SSRF: reject private/loopback URLs
  if (websiteUrl && isPrivateUrl(websiteUrl)) websiteUrl = undefined;
  if (dapeiZahavUrl && isPrivateUrl(dapeiZahavUrl)) dapeiZahavUrl = undefined;

  // Mode selection:
  // DEMO_MODE=true  → always return mock data (no real fetching)
  // ANTHROPIC_API_KEY set → real fetch + Claude AI extraction
  // neither → real fetch + local regex extraction (no API needed)
  const isDemoMode = process.env.DEMO_MODE === 'true';
  const hasApiKey = !!process.env.ANTHROPIC_API_KEY;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        if (isDemoMode) {
          const clientCard = await simulateDemoScan(send);
          send({ step: 5, status: 'done', clientCard });
          return;
        }

        // Step 1: Fetch website HTML
        send({ step: 1, status: 'active' });
        const websiteHtml = websiteUrl ? await fetchHtml(websiteUrl) : null;
        send({ step: 1, status: websiteHtml ? 'done' : 'failed' });

        // Step 2: Fetch Dapei Zahav HTML
        send({ step: 2, status: 'active' });
        const dapeiZahavHtml = dapeiZahavUrl ? await fetchHtml(dapeiZahavUrl) : null;
        send({ step: 2, status: dapeiZahavHtml ? 'done' : 'failed' });

        const htmlChunks: { label: string; html: string }[] = [];
        if (websiteHtml) htmlChunks.push({ label: 'אתר אינטרנט', html: websiteHtml });
        if (dapeiZahavHtml) htmlChunks.push({ label: 'דפי זהב', html: dapeiZahavHtml });

        // No URLs fetched — fall back to demo card
        if (htmlChunks.length === 0) {
          send({ step: 3, status: 'active' });
          await new Promise((r) => setTimeout(r, DEMO_STEPS_DELAY_MS * 1.5));
          send({ step: 3, status: 'done' });
          send({ step: 4, status: 'active' });
          await new Promise((r) => setTimeout(r, DEMO_STEPS_DELAY_MS * 0.75));
          send({ step: 4, status: 'done' });
          const demoCard = { ...MOCK_AC_TECHNICIAN_CARD, scannedAt: new Date().toISOString() };
          send({ step: 5, status: 'done', clientCard: demoCard });
          return;
        }

        // Step 3: Extract business data
        send({ step: 3, status: 'active' });
        let extractedData: ExtractedClientData;

        if (hasApiKey) {
          // AI extraction via Claude Haiku — highest quality
          try {
            const textChunks = htmlChunks.map(({ label, html }) => ({
              label,
              text: extractTextFromHtml(html),
            }));
            extractedData = await extractClientDataWithClaude(textChunks);
            send({ step: 3, status: 'done' });
          } catch {
            // Claude failed — fall back to regex
            extractedData = extractClientDataFromHtml(htmlChunks);
            send({ step: 3, status: 'done' });
          }
        } else {
          // No API key — use local regex extraction (real data, no AI)
          await new Promise((r) => setTimeout(r, 600)); // brief pause for UX
          extractedData = extractClientDataFromHtml(htmlChunks);
          send({ step: 3, status: 'done' });
        }

        // Step 4: Build client card
        send({ step: 4, status: 'active' });
        const clientCard = buildClientCard(extractedData, websiteUrl, dapeiZahavUrl, false);
        send({ step: 4, status: 'done' });

        // Step 5: Done
        send({ step: 5, status: 'done', clientCard });
      } catch {
        // Unexpected error — close gracefully
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
