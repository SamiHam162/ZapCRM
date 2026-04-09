export function extractTextFromHtml(html: string, maxChars = 8000): string {
  let text = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[\s\S]*?<\/style>/gi, '');
  text = text.replace(/<(h[1-6]|p|div|li|br|tr)[^>]*>/gi, '\n');
  text = text.replace(/<[^>]+>/g, ' ');
  text = text.replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
             .replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  text = text.replace(/\s+/g, ' ').trim();
  return text.slice(0, maxChars);
}
