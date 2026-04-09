'use client';

import { Client, ClientStatus } from '@/lib/types';

interface SummaryBarProps {
  clients: Client[];
  activeFilter?: ClientStatus | 'all';
  onFilterChange?: (status: ClientStatus | 'all') => void;
}

export function SummaryBar({
  clients,
  activeFilter = 'all',
  onFilterChange
}: SummaryBarProps) {
  const total = clients.length;
  const pending = clients.filter((c) => c.status === 'ממתין').length;
  const scanning = clients.filter((c) => c.status === 'סורק').length;
  const ready = clients.filter((c) => c.status === 'מוכן').length;
  const sent = clients.filter((c) => c.status === 'נשלח').length;

  const items = [
    { label: 'סה״כ', value: total, filter: 'all' as const, color: 'text-gray-900', dotColor: 'bg-gray-400', borderColor: 'border-gray-200 hover:border-gray-300' },
    { label: 'ממתין', value: pending, filter: 'ממתין' as const, color: 'text-amber-600', dotColor: 'bg-amber-500', borderColor: 'border-amber-200 hover:border-amber-300' },
    { label: 'סורק', value: scanning, filter: 'סורק' as const, color: 'text-blue-600', dotColor: 'bg-blue-500', borderColor: 'border-blue-200 hover:border-blue-300' },
    { label: 'מוכן', value: ready, filter: 'מוכן' as const, color: 'text-emerald-600', dotColor: 'bg-emerald-500', borderColor: 'border-emerald-200 hover:border-emerald-300' },
    { label: 'נשלח', value: sent, filter: 'נשלח' as const, color: 'text-orange-600', dotColor: 'bg-orange-500', borderColor: 'border-orange-200 hover:border-orange-300' },
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-8">
      {items.map((item) => {
        const isActive = activeFilter === item.filter;
        return (
          <button
            key={item.label}
            onClick={() => onFilterChange?.(item.filter)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all text-right group ${
              isActive
                ? 'bg-gradient-to-br from-white to-gray-50 border-zap-orange shadow-sm'
                : `bg-white ${item.borderColor} shadow-xs hover:shadow-sm`
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${item.dotColor} flex-shrink-0 transition-transform ${isActive ? 'scale-125' : ''}`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 font-medium">{item.label}</p>
              <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
