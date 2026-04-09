'use client';

import { useState } from 'react';
import { ClientCard, CallScriptSection } from '@/lib/types';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface EmailPreviewModalProps {
  open: boolean;
  onClose: () => void;
  script: CallScriptSection[];
  clientCard: ClientCard;
  onSend: (sentAt: string) => void;
}

export function EmailPreviewModal({
  open,
  onClose,
  script,
  clientCard,
  onSend,
}: EmailPreviewModalProps) {
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const toEmail =
    clientCard.contactInfo.email ??
    `לקוח@${clientCard.businessName.replace(/\s/g, '')}`;

  const handleSend = async () => {
    setSending(true);
    setSuccess(false);
    await new Promise((r) => setTimeout(r, 1200));
    setSuccess(true);
    await new Promise((r) => setTimeout(r, 400));
    const sentAt = new Date().toISOString();
    setSending(false);
    setSuccess(false);
    onClose();
    onSend(sentAt);
    toast.success(`האימייל נשלח בהצלחה — ${clientCard.businessName}`);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-colors duration-300 ${
        success ? 'bg-emerald-900/30' : 'bg-black/50'
      }`}
      onClick={(e) => { if (e.target === e.currentTarget && !sending) onClose(); }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Chrome bar — styled like an email client header */}
        <div className="flex items-center justify-between px-5 py-3 bg-zap-dark text-white text-sm flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-zap-orange rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold leading-none">Z</span>
            </div>
            <span className="font-semibold">זאפ מייל — תצוגה מקדימה</span>
          </div>
          <button
            onClick={onClose}
            disabled={sending}
            className="p-1 rounded hover:bg-white/10 transition-colors disabled:opacity-40"
            title="סגור"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Email metadata — looks like inbox header */}
        <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 text-sm flex-shrink-0">
          <div className="flex gap-2 mb-1.5">
            <span className="font-medium text-gray-500 w-12 shrink-0">מאת:</span>
            <span className="text-gray-800">צוות זאפ &lt;onboarding@zap.co.il&gt;</span>
          </div>
          <div className="flex gap-2 mb-1.5">
            <span className="font-medium text-gray-500 w-12 shrink-0">אל:</span>
            <span className="text-gray-800" dir="ltr">{toEmail}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-medium text-gray-500 w-12 shrink-0">נושא:</span>
            <span className="text-gray-800 font-medium">ברוך הבא לזאפ – {clientCard.businessName}</span>
          </div>
        </div>

        {/* Email body — grey outer + white card = real email client look */}
        <div className="flex-1 overflow-y-auto bg-gray-100">
          <div className="mx-4 my-4 bg-white rounded-xl shadow-md overflow-hidden">
            {/* Zap brand header strip */}
            <div className="bg-zap-dark px-6 py-4 flex items-center justify-center gap-3">
              <div className="w-7 h-7 bg-zap-orange rounded-full flex items-center justify-center shrink-0">
                <span className="text-white text-sm font-bold leading-none">Z</span>
              </div>
              <span className="text-white font-bold text-lg tracking-wide">ZAP</span>
            </div>

            {/* Email content */}
            <div className="px-6 py-5">
              <p className="text-sm text-gray-700 mb-5">
                שלום {clientCard.ownerName ?? 'לקוח יקר'},
              </p>

              {script.map((section) => (
                <div key={section.title} className="mb-5">
                  <p className="text-sm font-bold text-gray-900 mb-1.5 border-r-2 border-zap-orange pr-2">
                    {section.title}
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>

            {/* Footer inside card */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 text-center">
              בברכה, צוות זאפ &nbsp;·&nbsp; zap.co.il &nbsp;·&nbsp; support@zap.co.il &nbsp;·&nbsp; 03-7777777
            </div>
          </div>
        </div>

        {/* Modal actions — full-width send button */}
        <div className="px-5 py-4 border-t border-gray-200 bg-white flex-shrink-0">
          <button
            onClick={handleSend}
            disabled={sending}
            className="w-full flex items-center justify-center gap-2 py-3 bg-zap-orange hover:bg-zap-orange/90 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-70 shadow-sm"
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {success ? 'נשלח!' : 'שולח...'}
              </>
            ) : (
              'שלח עכשיו →'
            )}
          </button>
          <button
            onClick={onClose}
            disabled={sending}
            className="w-full mt-2 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-40"
          >
            ביטול
          </button>
        </div>
      </div>
    </div>
  );
}
