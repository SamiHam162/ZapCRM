'use client';

import { ScanStepState } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ScanStepProps {
  step: ScanStepState;
}

export function ScanStep({ step }: ScanStepProps) {
  const { status, icon, label, id } = step;

  return (
    <div className="flex items-center gap-3 py-3">
      {/* Status indicator */}
      <div className={cn('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm transition-all', {
        'bg-gray-100 text-gray-400': status === 'pending',
        'bg-zap-orange text-white animate-pulse': status === 'active',
        'bg-emerald-500 text-white': status === 'done',
        'bg-red-400 text-white': status === 'failed',
      })}>
        {status === 'done' ? '✓' : status === 'failed' ? '✗' : status === 'active' ? (
          <span className="text-xs font-bold">{icon}</span>
        ) : (
          <span className="text-xs">{icon}</span>
        )}
      </div>

      {/* Label */}
      <div className="flex-1 flex items-center gap-2">
        <span className={cn('text-sm transition-colors', {
          'text-gray-400': status === 'pending',
          'text-gray-900 font-semibold': status === 'active',
          'text-gray-700': status === 'done',
          'text-red-500': status === 'failed',
        })}>
          {status === 'failed' ? `${label} (נתוני דמו)` : label}
        </span>

        {/* AI working badge */}
        {id === 3 && status === 'active' && (
          <span className="text-xs bg-zap-orange/10 text-zap-orange font-medium px-2 py-0.5 rounded-full animate-pulse">
            AI בעבודה...
          </span>
        )}
      </div>

      {/* Spinner for active */}
      {status === 'active' && (
        <div className="w-4 h-4 border-2 border-zap-orange border-t-transparent rounded-full animate-spin flex-shrink-0" />
      )}
    </div>
  );
}
