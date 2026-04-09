'use client';

import { useState, useRef, useEffect } from 'react';
import { ClientCard, ScanStepState } from '@/lib/types';

const SCAN_STEPS: Omit<ScanStepState, 'status'>[] = [
  { id: 1, icon: '🔍', label: 'סורק אתר אינטרנט' },
  { id: 2, icon: '📋', label: 'סורק דפי זהב' },
  { id: 3, icon: '🤖', label: 'מנתח תוכן עם AI' },
  { id: 4, icon: '📇', label: 'מייצר כרטיס לקוח' },
  { id: 5, icon: '✅', label: 'הושלם' },
];

function processLine(
  line: string,
  setSteps: React.Dispatch<React.SetStateAction<ScanStepState[]>>,
  setClientCard: React.Dispatch<React.SetStateAction<ClientCard | null>>
) {
  if (!line.startsWith('data: ')) return;
  try {
    const event = JSON.parse(line.slice(6));
    setSteps((prev) =>
      prev.map((s) =>
        s.id === event.step ? { ...s, status: event.status } : s
      )
    );
    if (event.clientCard) {
      setClientCard(event.clientCard);
    }
  } catch {
    // skip malformed lines
  }
}

export function useScanPipeline() {
  const [steps, setSteps] = useState<ScanStepState[]>(
    SCAN_STEPS.map((s) => ({ ...s, status: 'pending' }))
  );
  const [clientCard, setClientCard] = useState<ClientCard | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Abort in-flight scan on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const reset = () => {
    setSteps(SCAN_STEPS.map((s) => ({ ...s, status: 'pending' })));
    setClientCard(null);
    setError(null);
  };

  const startScan = async (websiteUrl?: string, dapeiZahavUrl?: string) => {
    // Abort any previous in-flight scan
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsScanning(true);

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteUrl, dapeiZahavUrl }),
        signal: controller.signal,
      });

      if (!response.body) throw new Error('אין גוף תגובה מהשרת');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // stream: true preserves multi-byte character boundaries across chunks
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        // Retain the potentially-incomplete last segment
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          processLine(line, setSteps, setClientCard);
        }
      }

      // Flush any remaining bytes after the stream closes
      const tail = decoder.decode();
      if (tail) buffer += tail;
      if (buffer) processLine(buffer, setSteps, setClientCard);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'שגיאה לא צפויה');
    } finally {
      setIsScanning(false);
    }
  };

  return { steps, clientCard, isScanning, error, startScan, reset };
}
