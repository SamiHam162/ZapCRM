'use client';

import { useState } from 'react';
import { ClientCard, CallScriptSection } from '@/lib/types';
import { EmailPreviewModal } from './EmailPreviewModal';
import { Loader2, Wand2 } from 'lucide-react';

interface CallScriptCardProps {
  script: CallScriptSection[];
  clientCard: ClientCard;
  clientId: string;
  usedDemoData: boolean;
  onSend: (sentAt: string) => void;
}

export function CallScriptCard({
  script,
  clientCard,
  clientId,
  usedDemoData,
  onSend,
}: CallScriptCardProps) {
  const [emailOpen, setEmailOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/60">
          <div className="flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-zap-orange" />
            <h3 className="font-semibold text-gray-800 text-sm">תסריט שיחת Onboarding</h3>
          </div>
          {usedDemoData && (
            <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-1 rounded-full border border-amber-200">
              נתוני דמו
            </span>
          )}
        </div>

        {/* Sections */}
        <div className="divide-y divide-gray-100">
          {script.map((section, i) => (
            <div key={section.title} className="px-6 py-4 border-r-4 border-zap-orange/20 hover:border-zap-orange/60 transition-colors">
              <p className="text-xs font-bold text-zap-orange uppercase tracking-wide mb-1.5">
                {i + 1}. {section.title}
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/40">
          <button
            onClick={() => setEmailOpen(true)}
            className="w-full py-2.5 bg-zap-orange hover:bg-zap-orange/90 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
          >
            שלח ללקוח בדוא״ל
          </button>
        </div>
      </div>

      <EmailPreviewModal
        open={emailOpen}
        onClose={() => setEmailOpen(false)}
        script={script}
        clientCard={clientCard}
        onSend={onSend}
      />
    </>
  );
}

interface CallScriptGeneratingProps {
  onGenerate: () => void;
}

export function CallScriptGenerateButton({ onGenerate }: CallScriptGeneratingProps) {
  return (
    <button
      onClick={onGenerate}
      className="w-full py-3 bg-white border-2 border-zap-orange/40 hover:border-zap-orange hover:bg-zap-orange/5 text-zap-orange font-semibold text-sm rounded-lg transition-all flex items-center justify-center gap-2"
    >
      <Wand2 className="w-4 h-4" />
      צור תסריט שיחה
    </button>
  );
}

export function CallScriptLoadingState() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8 flex flex-col items-center gap-3 shadow-sm">
      <Loader2 className="w-6 h-6 text-zap-orange animate-spin" />
      <p className="text-sm font-medium text-gray-700">מייצר תסריט...</p>
      <p className="text-xs text-gray-400">AI מכין תסריט שיחה מותאם אישית</p>
    </div>
  );
}
