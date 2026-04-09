'use client';

import { ScanStepState } from '@/lib/types';
import { ScanStep } from './ScanStep';

interface ScanPipelineProps {
  steps: ScanStepState[];
  isScanning: boolean;
  error: string | null;
  onRetry?: () => void;
}

export function ScanPipeline({ steps, isScanning, error, onRetry }: ScanPipelineProps) {
  const allDone = steps.length > 0 && steps.every((s) => s.status === 'done' || s.status === 'failed');
  const lastDone = steps.length > 0 && steps[steps.length - 1].status === 'done';
  const anyActive = steps.some((s) => s.status === 'active');

  const title = isScanning || anyActive
    ? 'סריקה מתבצעת...'
    : allDone && lastDone
    ? 'הסריקה הושלמה'
    : allDone
    ? 'הסריקה הסתיימה עם שגיאות'
    : 'מוכן לסריקה';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="font-semibold text-gray-800 text-base">
          {title}
        </h3>
        {isScanning && (
          <p className="text-xs text-gray-500 mt-0.5">AI מנתח את הנכסים הדיגיטליים של הלקוח</p>
        )}
      </div>

      <div className="divide-y divide-gray-100">
        {steps.map((step) => (
          <ScanStep key={step.id} step={step} />
        ))}
      </div>

      {error && (
        <div className="mt-4 flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-lg">
          <span className="text-sm text-red-600 flex-1">{error}</span>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-xs text-red-600 font-medium underline hover:no-underline"
            >
              נסה שוב
            </button>
          )}
        </div>
      )}
    </div>
  );
}
