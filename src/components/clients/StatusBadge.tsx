import { ClientStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

const statusStyles: Record<ClientStatus, string> = {
  'ממתין': 'bg-gray-100 text-gray-600',
  'סורק': 'bg-blue-100 text-blue-700',
  'מוכן': 'bg-green-100 text-green-700',
  'נשלח': 'bg-orange-100 text-zap-orange',
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
