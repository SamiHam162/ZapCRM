'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/layout/TopBar';
import { StatusBadge } from '@/components/clients/StatusBadge';
import { Button } from '@/components/ui/button';
import { useClients } from '@/hooks/useClients';

interface ClientPageProps {
  params: Promise<{ id: string }>;
}

export default function ClientPage({ params }: ClientPageProps) {
  const { id } = use(params);
  const { clients } = useClients();
  const router = useRouter();

  const client = clients.find((c) => c.id === id);

  if (!client) {
    return (
      <>
        <TopBar title="לקוח לא נמצא" />
        <main className="p-6">
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">לקוח לא נמצא</h2>
            <p className="text-gray-500 mb-6">הלקוח שחיפשת אינו קיים ברשימה</p>
            <Button onClick={() => router.push('/clients')} variant="outline">
              חזרה לרשימה
            </Button>
          </div>
        </main>
      </>
    );
  }

  const canScan = client.status === 'ממתין' || client.status === 'סורק';

  return (
    <>
      <TopBar title={client.businessName} />
      <main className="p-6 max-w-3xl">
        {/* Header card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {client.businessName}
              </h2>
              {client.businessType && (
                <p className="text-gray-500 text-sm">{client.businessType}</p>
              )}
            </div>
            <StatusBadge status={client.status} />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            {client.area && (
              <div>
                <span className="text-gray-500 block mb-0.5">אזור</span>
                <span className="text-gray-900 font-medium">{client.area}</span>
              </div>
            )}
            <div>
              <span className="text-gray-500 block mb-0.5">תאריך הוספה</span>
              <span className="text-gray-900 font-medium">
                {new Date(client.createdAt).toLocaleDateString('he-IL')}
              </span>
            </div>
          </div>
        </div>

        {/* URLs */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">נכסים דיגיטליים</h3>
          <div className="flex flex-col gap-3">
            {client.websiteUrl ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">אתר אינטרנט</span>
                <a
                  href={client.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zap-orange hover:underline"
                  dir="ltr"
                >
                  {client.websiteUrl}
                </a>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">אתר אינטרנט</span>
                <span className="text-sm text-gray-400">לא צוין</span>
              </div>
            )}
            {client.dapeiZahavUrl ? (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">דפי זהב</span>
                <a
                  href={client.dapeiZahavUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zap-orange hover:underline"
                  dir="ltr"
                >
                  {client.dapeiZahavUrl}
                </a>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">דפי זהב</span>
                <span className="text-sm text-gray-400">לא צוין</span>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        {client.notes && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">הערות</h3>
            <p className="text-sm text-gray-600">{client.notes}</p>
          </div>
        )}

        {/* Scan CTA */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-2">סריקת נכסים דיגיטליים</h3>
          <p className="text-sm text-gray-500 mb-4">
            {client.status === 'מוכן'
              ? 'הנכסים הדיגיטליים כבר נסרקו ומוכנים'
              : client.status === 'נשלח'
              ? 'כרטיס הלקוח כבר נשלח'
              : 'לחץ על הכפתור כדי לסרוק את הנכסים הדיגיטליים של הלקוח ולהכין את הכרטיס'}
          </p>
          <Button
            disabled={!canScan}
            className="bg-zap-orange hover:bg-zap-orange-dark text-white disabled:opacity-50"
          >
            סרוק נכסים דיגיטליים
          </Button>
        </div>
      </main>
    </>
  );
}
