'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export function DemoModeBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== 'true') return null;

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2.5 bg-zap-orange text-white text-sm" dir="rtl">
      <span className="font-medium">
        מצב דמו פעיל — הוסף{' '}
        <code className="bg-white/20 px-1.5 py-0.5 rounded text-xs font-mono">ANTHROPIC_API_KEY</code>
        {' '}לקובץ <code className="bg-white/20 px-1.5 py-0.5 rounded text-xs font-mono">.env.local</code>{' '}
        לסריקה ויצירת תסריטים אמיתיים
      </span>
      <button
        onClick={() => setDismissed(true)}
        className="p-1 rounded hover:bg-white/20 transition-colors shrink-0"
        title="סגור"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
