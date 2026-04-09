'use client';

import { useState } from 'react';
import { ClientCard } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

interface ClientCardViewProps {
  card: ClientCard;
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`text-xs transition-colors px-1.5 py-0.5 rounded ${
        copied
          ? 'text-emerald-600 bg-emerald-50'
          : 'text-gray-400 hover:text-zap-orange hover:bg-gray-100'
      }`}
      title={copied ? 'הועתק!' : 'העתק'}
    >
      {copied ? 'הועתק ✓' : 'העתק'}
    </button>
  );
}

export function ClientCardView({ card }: ClientCardViewProps) {
  return (
    <div className="flex flex-col gap-4 transition-opacity duration-300 opacity-100">
      {/* Header card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-xl font-bold text-gray-900">{card.businessName}</h2>
          {card.usedDemoData && (
            <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-1 rounded-full border border-amber-200">
              נתוני דמו
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {card.businessType && (
            <Badge variant="secondary" className="text-xs">{card.businessType}</Badge>
          )}
          {card.area && (
            <Badge variant="outline" className="text-xs text-blue-700 border-blue-200 bg-blue-50">
              {card.area}
            </Badge>
          )}
        </div>
        {card.ownerName && (
          <p className="text-sm text-gray-500 mt-3">בעלים: <span className="text-gray-800 font-medium">{card.ownerName}</span></p>
        )}
        {card.description && (
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">{card.description}</p>
        )}
      </div>

      {/* Contact card */}
      {(card.contactInfo.phone || card.contactInfo.email || card.contactInfo.address) && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 text-sm mb-3">פרטי קשר</h3>
          <div className="flex flex-col gap-2.5">
            {card.contactInfo.phone && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span>📞</span>
                  <span dir="ltr">{card.contactInfo.phone}</span>
                </div>
                <CopyButton value={card.contactInfo.phone} />
              </div>
            )}
            {card.contactInfo.email && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span>✉️</span>
                  <span dir="ltr">{card.contactInfo.email}</span>
                </div>
                <CopyButton value={card.contactInfo.email} />
              </div>
            )}
            {card.contactInfo.address && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span>📍</span>
                  <span>{card.contactInfo.address}</span>
                </div>
                <CopyButton value={card.contactInfo.address} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Services card */}
      {card.services.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 text-sm mb-3">שירותים</h3>
          <div className="flex flex-wrap gap-2">
            {card.services.map((service) => (
              <Badge key={service} variant="secondary" className="text-xs font-normal">
                {service}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Digital assets card */}
      {card.digitalAssets.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 text-sm mb-3">נכסים דיגיטליים שנסרקו</h3>
          <div className="flex flex-col gap-2.5">
            {card.digitalAssets.map((asset) => (
              <div key={asset.url} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    asset.scanStatus === 'demo' ? 'bg-amber-100 text-amber-700' :
                    asset.scanStatus === 'success' ? 'bg-emerald-100 text-emerald-700' :
                    asset.scanStatus === 'failed' ? 'bg-red-100 text-red-600' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {asset.scanStatus === 'demo' ? 'דמו' :
                     asset.scanStatus === 'success' ? 'נסרק' :
                     asset.scanStatus === 'failed' ? 'נכשל' : 'ממתין'}
                  </span>
                  <span className="text-sm text-gray-700">{asset.label}</span>
                </div>
                <a
                  href={asset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-zap-orange hover:underline truncate max-w-48"
                  dir="ltr"
                >
                  {asset.url}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metadata footer */}
      <div className="text-xs text-gray-400 px-1 pb-2">
        נסרק: {new Date(card.scannedAt).toLocaleString('he-IL')}
        {card.usedDemoData && ' · נתונים לצורך הדגמה בלבד'}
      </div>
    </div>
  );
}
