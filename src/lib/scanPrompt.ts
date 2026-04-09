export function buildExtractionPrompt(extractedTexts: { label: string; text: string }[]): string {
  const contentBlock = extractedTexts
    .map(({ label, text }) => `=== ${label} ===\n${text}`)
    .join('\n\n');

  return `אתה עוזר AI של חברת זאפ. נסרק התוכן הבא מהנכסים הדיגיטליים של לקוח:

${contentBlock}

חלץ את המידע הבא מהתוכן ותחזיר אותו כ-JSON תקני בלבד (ללא טקסט נוסף):

{
  "businessName": "שם העסק",
  "ownerName": "שם בעל העסק (אם נמצא, אחרת null)",
  "businessType": "סוג העסק (לדוגמה: טכנאי מזגנים)",
  "area": "אזור/עיר הפעילות",
  "description": "תיאור קצר של העסק (1-2 משפטים)",
  "contactInfo": {
    "phone": "מספר טלפון (אם נמצא)",
    "email": "כתובת אימייל (אם נמצאה)",
    "address": "כתובת פיזית (אם נמצאה)"
  },
  "services": ["שירות 1", "שירות 2", "..."]
}

אם מידע מסוים לא נמצא, השתמש ב-null. החזר JSON בלבד.`;
}
