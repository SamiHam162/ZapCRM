import { Client } from './types';

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'client-1',
    businessName: 'קירור ומיזוג אבי כהן',
    websiteUrl: 'https://avi-ac.co.il',
    dapeiZahavUrl: 'https://www.d.co.il/he/p/avi-cohen-ac-krayot',
    status: 'ממתין',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    notes: 'טכנאי מזגנים - הקריות. קנה אתר 5 עמודים + מיניסייט דפי זהב.',
    businessType: 'מזגנים',
    area: 'הקריות',
  },
  {
    id: 'client-2',
    businessName: 'שיפוצניק פרו - גלעד לוי',
    websiteUrl: 'https://shiputznik-pro.co.il',
    status: 'נשלח',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    sentAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    businessType: 'שיפוצים',
    area: 'תל אביב',
  },
  {
    id: 'client-3',
    businessName: 'מסעדת השף - ירושלים',
    dapeiZahavUrl: 'https://www.d.co.il/he/p/chef-restaurant-jerusalem',
    status: 'מוכן',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    businessType: 'מסעדה',
    area: 'ירושלים',
  },
  {
    id: 'client-4',
    businessName: 'ד״ר רחל ברקוביץ - רפואת שיניים',
    websiteUrl: 'https://dr-berkowitz-dental.co.il',
    dapeiZahavUrl: 'https://www.d.co.il/he/p/berkowitz-dental',
    status: 'סורק',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    businessType: 'רפואת שיניים',
    area: 'חיפה',
  },
];
