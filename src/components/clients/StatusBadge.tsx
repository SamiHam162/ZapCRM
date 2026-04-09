import { ClientStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

const statusStyles: Record<ClientStatus, string> = {
  'ממתין': 'bg-amber-100 text-amber-700 border border-amber-200',
  'סורק': 'bg-blue-100 text-blue-700 border border-blue-200',
  'מוכן': 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  'נשלח': 'bg-orange-100 text-orange-700 border border-orange-200',
};

interface StatusBadgeProps {
  status: ClientStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        statusStyles[status]
      )}
    >
      {status}
    </span>
  );
}
