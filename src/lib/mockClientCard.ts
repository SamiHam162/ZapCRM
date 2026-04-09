import { ClientCard } from './types';

export const MOCK_AC_TECHNICIAN_CARD: ClientCard = {
  businessName: 'קירור ומיזוג אבי כהן - הקריות',
  ownerName: 'אבי כהן',
  businessType: 'טכנאי מזגנים',
  area: 'קריות (קרית ביאליק, קרית אתא, קרית מוצקין)',
  description: 'עסק משפחתי עם ניסיון של 15 שנה בהתקנה ותיקון מזגנים בצפון הארץ.',
  contactInfo: {
    phone: '052-123-4567',
    email: 'avi@aviair.co.il',
    address: 'שד\' הנשיא 45, קרית ביאליק',
  },
  services: [
    'התקנת מזגנים',
    'תיקון מזגנים',
    'תחזוקה שנתית',
    'מזגני מרכזיים',
    'מערכות VRF',
    'שירות חירום',
  ],
  digitalAssets: [
    {
      type: 'website',
      url: 'https://avi-ac.co.il',
      label: 'אתר אינטרנט (5 עמודים)',
      scanStatus: 'demo',
    },
    {
      type: 'dapei-zahav',
      url: 'https://www.d.co.il/...',
      label: 'מיניסייט דפי זהב - הקריות',
      scanStatus: 'demo',
    },
  ],
  usedDemoData: true,
  scannedAt: '', // callers always override with new Date().toISOString()
};
