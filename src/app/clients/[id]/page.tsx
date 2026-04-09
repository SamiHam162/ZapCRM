'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/layout/TopBar';
import { StatusBadge } from '@/components/clients/StatusBadge';
import { ScanPipeline } from '@/components/scan/ScanPipeline';
import { ClientCardView } from '@/components/clients/ClientCardView';
import { CallScriptCard, CallScriptGenerateButton, CallScriptLoadingState } from '@/components/clients/CallScriptCard';
import { Button } from '@/components/ui/button';
import { useClients } from '@/hooks/useClients';
import { useScanPipeline } from '@/hooks/useScanPipeline';
import { useScriptGeneration } from '@/hooks/useScriptGeneration';

interface ClientPageProps {
  params: Promise<{ id: string }>;
}

export default function ClientPage({ params }: ClientPageProps) {
  const { id } = use(params);
  const { clients, dispatch } = useClients();
  const router = useRouter();
  const { steps, clientCard, isScanning, error, startScan, reset } = useScanPipeline();
  const { isLoading: isGeneratingScript, script, error: scriptError, usedDemoData: scriptUsedDemo, generate } = useScriptGeneration();

  const client = clients.find((c) => c.id === id);

  // Persist the scanned card when scan completes
  useEffect(() => {
    if (clientCard && client) {
      dispatch({ type: 'UPDATE_CLIENT', id: client.id, updates: { clientCard, status: 'מוכן' } });
    }
  // dispatch is stable; client.id guards against stale closure
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientCard, client?.id]);

  if (!client) {
    return (
      <>
        <TopBar title="לקוח לא נמצא" backHref="/clients" />
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
  const showPipeline = isScanning || steps.some((s) => s.status !== 'pending');
  const displayCard = clientCard ?? client.clientCard ?? null;
  const canGenerateScript = displayCard !== null && (client.status === 'מוכן' || client.status === 'נשלח');
  const displayScript = script ?? client.callScript ?? null;

  const handleScan = () => {
    reset();
    dispatch({ type: 'SET_STATUS', id: client.id, status: 'סורק' });
    startScan(client.websiteUrl, client.dapeiZahavUrl);
  };

  const handleSend = (sentAt: string) => {
    dispatch({ type: 'SEND_SCRIPT', id: client.id, sentAt });
  };

  const handleGenerate = async () => {
    const result = await generate(displayCard!);
    if (result) {
      dispatch({ type: 'UPDATE_CLIENT', id: client.id, updates: { callScript: result.script } });
    }
  };

  return (
    <>
      <TopBar title={client.businessName} backHref="/clients" />
      <main className="p-6 max-w-3xl space-y-6">
        {/* Header card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
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
            {client.sentAt && (
              <div>
                <span className="text-gray-500 block mb-0.5">תאריך שליחה</span>
                <span className="text-gray-900 font-medium">
                  {new Date(client.sentAt).toLocaleDateString('he-IL')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* URLs */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
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
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-800 mb-2">הערות</h3>
            <p className="text-sm text-gray-600">{client.notes}</p>
          </div>
        )}

        {/* Scan CTA — prominent, orange accent, only shown when no pipeline/card active */}
        {!showPipeline && !displayCard && (
          <div className="bg-white rounded-lg border border-gray-200 border-r-4 border-r-zap-orange p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">סריקת נכסים דיגיטליים</h3>
            <p className="text-sm text-gray-500 mb-5">
              AI יסרוק את האתר ודפי הזהב ויכין כרטיס לקוח מלא תוך שניות
            </p>
            <Button
              disabled={!canScan}
              onClick={handleScan}
              className="w-full bg-zap-orange hover:bg-zap-orange/90 text-white disabled:opacity-50 py-5 text-base font-semibold"
            >
              סרוק נכסים דיגיטליים ←
            </Button>
          </div>
        )}

        {/* Animated scan pipeline */}
        {showPipeline && (
          <ScanPipeline
            steps={steps}
            isScanning={isScanning}
            error={error}
            onRetry={handleScan}
          />
        )}

        {/* Client card result */}
        {displayCard && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">כרטיס לקוח</h3>
              {canScan && (
                <button
                  onClick={handleScan}
                  className="text-xs text-gray-400 hover:text-zap-orange transition-colors"
                >
                  סרוק מחדש
                </button>
              )}
            </div>
            <ClientCardView card={displayCard} />
          </div>
        )}

        {/* Call script section — shown when card is ready and status is מוכן or נשלח */}
        {canGenerateScript && (
          <div>
            {isGeneratingScript ? (
              <CallScriptLoadingState />
            ) : displayScript ? (
              <CallScriptCard
                script={displayScript}
                clientCard={displayCard!}
                clientId={client.id}
                usedDemoData={scriptUsedDemo}
                onSend={handleSend}
              />
            ) : (
              <div>
                {scriptError && (
                  <p className="text-sm text-red-600 text-center mb-3">{scriptError} — נסה שוב</p>
                )}
                <CallScriptGenerateButton onGenerate={handleGenerate} />
                <p className="text-xs text-center text-gray-400 mt-2">
                  מייצר תסריט שיחה מותאם אישית בעזרת AI
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
