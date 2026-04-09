import { Client } from '@/lib/types';

interface SummaryBarProps {
  clients: Client[];
}

export function SummaryBar({ clients }: SummaryBarProps) {
  const total = clients.length;
  const pending = clients.filter((c) => c.status === 'ממתין').length;
  const ready = clients.filter((c) => c.status === 'מוכן').length;
  const sent = clients.filter((c) => c.status === 'נשלח').length;

  const items = [
    { label: 'סה״כ לקוחות', value: total, color: 'text-gray-900' },
    { label: 'ממתין', value: pending, color: 'text-gray-500' },
    { label: 'מוכן', value: ready, color: 'text-green-600' },
    { label: 'נשלח', value: sent, color: 'text-zap-orange' },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-white rounded-lg border border-gray-200 px-5 py-4"
        >
          <p className="text-sm text-gray-500 mb-1">{item.label}</p>
          <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}
