import Anthropic from '@anthropic-ai/sdk';
import { buildExtractionPrompt } from './scanPrompt';

export interface ExtractedClientData {
  businessName?: string;
  ownerName?: string | null;
  businessType?: string;
  area?: string;
  description?: string | null;
  contactInfo?: {
    phone?: string | null;
    email?: string | null;
    address?: string | null;
  };
  services?: string[];
}

export async function extractClientDataWithClaude(
  texts: { label: string; text: string }[]
): Promise<ExtractedClientData> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const prompt = buildExtractionPrompt(texts);

  const message = await client.messages.create(
    {
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    },
    { timeout: 30000 }
  );

  const content = message.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type from Claude');

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON found in Claude response');

  const parsed = JSON.parse(jsonMatch[0]) as ExtractedClientData;
  if (parsed.services !== undefined && !Array.isArray(parsed.services)) {
    parsed.services = [];
  }
  return parsed;
}
