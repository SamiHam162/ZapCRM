import { Client } from './types';

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'client-1',
    businessName: 'קירור ומיזוג אבי כהן',
    websiteUrl: 'https://avi-ac.co.il',
    dapeiZahavUrl: 'https://www.d.co.il/he/p/avi-cohen-ac-krayot',
    status: 'ממתין',
    createdAt: '2026-04-09T08:00:00.000Z',
    notes: 'טכנאי מזגנים - הקריות. קנה אתר 5 עמודים + מיניסייט דפי זהב.',
    businessType: 'מזגנים',
    area: 'הקריות',
  },
  {
    id: 'client-2',
    businessName: 'שיפוצניק פרו - גלעד לוי',
    websiteUrl: 'https://shiputznik-pro.co.il',
    status: 'נשלח',
    createdAt: '2026-04-06T10:00:00.000Z',
    sentAt: '2026-04-07T14:30:00.000Z',
    businessType: 'שיפוצים',
    area: 'תל אביב',
    clientCard: {
      businessName: 'שיפוצניק פרו',
      ownerName: 'גלעד לוי',
      businessType: 'שיפוצים כלליים',
      area: 'תל אביב והמרכז',
      description: 'חברת שיפוצים מקצועית המתמחה בשיפוץ דירות, משרדים וחללים מסחריים.',
      contactInfo: {
        phone: '054-987-6543',
        email: 'gilad@shiputznik-pro.co.il',
        address: 'רחוב דיזנגוף 100, תל אביב',
      },
      services: ['שיפוץ דירות', 'שיפוץ משרדים', 'ריצוף וחיפוי', 'צביעה', 'גבס ופלסטר', 'אינסטלציה חשמל'],
      digitalAssets: [
        { type: 'website', url: 'https://shiputznik-pro.co.il', label: 'אתר אינטרנט', scanStatus: 'demo' },
      ],
      usedDemoData: true,
      scannedAt: '2026-04-06T11:00:00.000Z',
    },
    callScript: [
      {
        title: 'פתיחה',
        content: 'שלום גלעד! מדבר [שמך] מחברת זאפ. ברכות על הצטרפותך! יש לך רגע לשיחה קצרה על מה שהכנו עבור שיפוצניק פרו?',
      },
      {
        title: 'מטרת השיחה',
        content: 'אני מתקשר להודיע לך שהאתר של שיפוצניק פרו מוכן! רציתי לעבור איתך על מה בנינו ולוודא שהכל עונה על הציפיות שלך לפני הפצה.',
      },
      {
        title: 'סקירת הנכסים הדיגיטליים',
        content: 'בנינו לך אתר מקצועי עם עמודי שירותים מפורטים: שיפוץ דירות, משרדים, ריצוף, צביעה וגבס. הדגשנו את הניסיון שלך ואת אזור הפעילות — תל אביב והמרכז.',
      },
      {
        title: 'הצעדים הבאים',
        content: 'נצטרך ממך: 1) תמונות עבודות לפני ואחרי — זה מה שמוכר הכי טוב בשיפוצים. 2) לוגו של העסק אם יש. 3) אישור על פרטי יצירת קשר — טלפון ואימייל. תוכל לשלוח לנו עד סוף השבוע?',
      },
      {
        title: 'סגירה חמה',
        content: 'גלעד, אנחנו כאן לכל שאלה. מאחלים לך עסק משגשג ועונת שיפוצים עמוסה! שאלות לפני שנסיים?',
      },
    ],
  },
  {
    id: 'client-3',
    businessName: 'מסעדת השף - ירושלים',
    dapeiZahavUrl: 'https://www.d.co.il/he/p/chef-restaurant-jerusalem',
    status: 'מוכן',
    createdAt: '2026-04-09T05:00:00.000Z',
    businessType: 'מסעדה',
    area: 'ירושלים',
    clientCard: {
      businessName: 'מסעדת השף',
      ownerName: 'יוסי אברהם',
      businessType: 'מסעדה כשרה',
      area: 'ירושלים — רחביה',
      description: 'מסעדה כשרה למהדרין המתמחה במטבח ים תיכוני עם דגש על חומרי גלם מקומיים.',
      contactInfo: {
        phone: '02-567-8901',
        email: 'info@chef-jerusalem.co.il',
        address: 'רחוב אזה 14, ירושלים',
      },
      services: ['ארוחות עסקיות', 'אירועים פרטיים', 'בר מצוות וחתונות', 'קייטרינג', 'ארוחות שישי'],
      digitalAssets: [
        { type: 'dapei-zahav', url: 'https://www.d.co.il/he/p/chef-restaurant-jerusalem', label: 'דפי זהב', scanStatus: 'demo' },
      ],
      usedDemoData: true,
      scannedAt: '2026-04-09T06:00:00.000Z',
    },
  },
  {
    id: 'client-4',
    businessName: 'ד״ר רחל ברקוביץ - רפואת שיניים',
    websiteUrl: 'https://dr-berkowitz-dental.co.il',
    dapeiZahavUrl: 'https://www.d.co.il/he/p/berkowitz-dental',
    status: 'סורק',
    createdAt: '2026-04-09T09:30:00.000Z',
    businessType: 'רפואת שיניים',
    area: 'חיפה',
  },
];
