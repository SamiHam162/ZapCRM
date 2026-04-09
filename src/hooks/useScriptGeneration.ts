'use client';

import { useState } from 'react';
import { ClientCard, CallScriptSection } from '@/lib/types';

interface ScriptGenerationState {
  isLoading: boolean;
  script: CallScriptSection[] | null;
  error: string | null;
  usedDemoData: boolean;
}

export function useScriptGeneration() {
  const [state, setState] = useState<ScriptGenerationState>({
    isLoading: false,
    script: null,
    error: null,
    usedDemoData: false,
  });

  const generate = async (
    clientCard: ClientCard
  ): Promise<{ script: CallScriptSection[]; usedDemoData: boolean } | null> => {
    setState({ isLoading: true, script: null, error: null, usedDemoData: false });

    try {
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientCard }),
      });

      if (!response.ok) {
        throw new Error('שגיאה בייצור התסריט');
      }

      const data = await response.json() as { script: CallScriptSection[]; usedDemoData: boolean };
      setState({
        isLoading: false,
        script: data.script,
        error: null,
        usedDemoData: data.usedDemoData,
      });
      return { script: data.script, usedDemoData: data.usedDemoData };
    } catch (err) {
      setState({
        isLoading: false,
        script: null,
        error: err instanceof Error ? err.message : 'שגיאה לא צפויה',
        usedDemoData: false,
      });
      return null;
    }
  };

  return { ...state, generate };
}
