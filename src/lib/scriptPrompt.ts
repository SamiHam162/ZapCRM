import { ClientCard } from './types';

export function buildScriptPrompt(card: ClientCard): string {
  const services = card.services.length > 0 ? card.services.join(', ') : 'לא צוינו';
  const assets = card.digitalAssets.map((a) => a.label).join(', ') || 'לא צוינו';
  const ownerGreeting = card.ownerName ? `שלום ${card.ownerName}` : 'שלום';

  return `אתה נציג לקוחות של חברת זאפ. עליך לכתוב תסריט שיחת Onboarding מותאם אישית בעברית עבור לקוח חדש.

פרטי הלקוח:
- שם העסק: ${card.businessName}
- שם בעל העסק: ${card.ownerName ?? 'לא ידוע'}
- סוג עסק: ${card.businessType}
- אזור: ${card.area}
- שירותים: ${services}
- נכסים דיגיטליים שנרכשו: ${assets}

כתוב תסריט שיחה מובנה עם 5 חלקים. החזר JSON בלבד, ללא טקסט נוסף, במבנה הבא:
[
  { "title": "פתיחה", "content": "..." },
  { "title": "מטרת השיחה", "content": "..." },
  { "title": "סקירת הנכסים הדיגיטליים", "content": "..." },
  { "title": "הצעדים הבאים", "content": "..." },
  { "title": "סגירה חמה", "content": "..." }
]

הנחיות:
- השתמש בשם "${ownerGreeting}" בפתיחה ובסגירה
- אזכר ספציפית את שירותי העסק (${services})
- הזכר את האזור: ${card.area}
- הסבר בפשטות מה זאפ הכינה עבורם (${assets})
- טון חמים, מקצועי, ישראלי
- החזר JSON בלבד — אל תוסיף הסברים לפני או אחרי`;
}
