import { ClientCard, CallScriptSection } from './types';

/**
 * Generates a personalized onboarding call script from a ClientCard
 * using string templates — no AI API required.
 * Output quality is lower than Claude but uses the actual scanned data.
 */
export function buildTemplateScript(card: ClientCard): CallScriptSection[] {
  const owner = card.ownerName ?? 'שלום';
  const business = card.businessName;
  const area = card.area ? `ב${card.area}` : '';
  const type = card.businessType || 'העסק שלך';
  const phone = card.contactInfo.phone;

  const servicesList =
    card.services.length > 0
      ? card.services.slice(0, 4).join(', ')
      : type;

  const assetLabels = card.digitalAssets.map((a) => a.label);
  const hasWebsite = assetLabels.includes('אתר אינטרנט');
  const hasDapeiZahav = assetLabels.includes('דפי זהב');

  let assetsDescription = 'הנכסים הדיגיטליים';
  if (hasWebsite && hasDapeiZahav) {
    assetsDescription = 'האתר והמיניסייט בדפי זהב';
  } else if (hasWebsite) {
    assetsDescription = 'האתר שלך';
  } else if (hasDapeiZahav) {
    assetsDescription = 'המיניסייט שלך בדפי זהב';
  }

  const nextStepsItems: string[] = [];
  nextStepsItems.push('תמונות של עבודות שביצעת — לוגו, תמונות צוות או מהשטח');
  if (phone) {
    nextStepsItems.push(`אישור שמספר הטלפון ${phone} נכון`);
  }
  nextStepsItems.push('אישור על הטקסטים בעמודים — שלח לנו מייל אם יש שינויים');

  const nextStepsText = nextStepsItems
    .map((item, i) => `${i + 1}) ${item}`)
    .join('. ');

  return [
    {
      title: 'פתיחה',
      content: `שלום ${owner}! מדבר [שמך] מחברת זאפ. ברכות על הצטרפותך למשפחת זאפ! אנחנו שמחים מאוד לעבוד עם ${business}. יש לך רגע לשיחה קצרה?`,
    },
    {
      title: 'מטרת השיחה',
      content: `אני מתקשר להודיע לך ש${assetsDescription} של "${business}" ${area} מוכנים! רציתי לעבור איתך על מה שהכנו ולוודא שהכל עונה על הציפיות שלך לפני שנפרסם הכל.`,
    },
    {
      title: 'סקירת הנכסים הדיגיטליים',
      content: `הכנו לך ${assetsDescription} מקצועי שמציג את השירותים של ${business}: ${servicesList}. ${area ? `הדגשנו את אזור הפעילות שלך — ${card.area}.` : ''} הכל בנוי כדי שלקוחות חדשים ימצאו אותך בקלות באינטרנט.`,
    },
    {
      title: 'הצעדים הבאים',
      content: `יש כמה דברים קטנים שנצטרך ממך כדי להשלים הכל: ${nextStepsText}. הכל ייקח לך כ-10 דקות בלבד!`,
    },
    {
      title: 'סגירה חמה',
      content: `${owner}, אנחנו זמינים לכל שאלה — מייל support@zap.co.il או טלפון 03-7777777 בימים א׳-ה׳ בין 9:00-18:00. מאחלים ל${business} ${area} הרבה לקוחות חדשים! שאלות לפני שנסיים?`,
    },
  ];
}
