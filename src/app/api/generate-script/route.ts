import Anthropic from '@anthropic-ai/sdk';
import { buildScriptPrompt } from '@/lib/scriptPrompt';
import { buildTemplateScript } from '@/lib/templateScript';
import { MOCK_CALL_SCRIPT } from '@/lib/mockCallScript';
import { ClientCard, CallScriptSection } from '@/lib/types';

export async function POST(request: Request) {
  let clientCard: ClientCard;
  try {
    const body = await request.json();
    clientCard = body.clientCard;
  } catch {
    return new Response('גוף הבקשה אינו תקין', { status: 400 });
  }

  if (!clientCard) {
    return new Response('חסר clientCard בבקשה', { status: 400 });
  }

  // DEMO_MODE=true → always return static mock (ignores real data)
  // ANTHROPIC_API_KEY set → Claude Opus generation (best quality)
  // neither → template-based generation from real scanned card (no API needed)
  const isDemoMode = process.env.DEMO_MODE === 'true';
  const hasApiKey = !!process.env.ANTHROPIC_API_KEY;

  if (isDemoMode) {
    await new Promise((r) => setTimeout(r, 2000));
    return Response.json({ script: MOCK_CALL_SCRIPT, usedDemoData: true });
  }

  if (!hasApiKey) {
    // Generate a personalized script from the real client card — no AI needed
    await new Promise((r) => setTimeout(r, 800));
    const script = buildTemplateScript(clientCard);
    return Response.json({ script, usedDemoData: false });
  }

  const prompt = buildScriptPrompt(clientCard);
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  let message: Anthropic.Message;
  try {
    message = await client.messages.create(
      {
        model: 'claude-opus-4-6',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      },
      { timeout: 15000 }
    );
  } catch {
    // Claude failed — fall back to template script using real data
    const script = buildTemplateScript(clientCard);
    return Response.json({ script, usedDemoData: false });
  }

  const content = message.content[0];
  if (content.type !== 'text') {
    return new Response('תגובה לא צפויה מ-Claude', { status: 500 });
  }

  const jsonMatch = content.text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    const script = buildTemplateScript(clientCard);
    return Response.json({ script, usedDemoData: false });
  }

  let script: CallScriptSection[];
  try {
    script = JSON.parse(jsonMatch[0]) as CallScriptSection[];
  } catch {
    script = buildTemplateScript(clientCard);
    return Response.json({ script, usedDemoData: false });
  }

  return Response.json({ script, usedDemoData: false });
}
