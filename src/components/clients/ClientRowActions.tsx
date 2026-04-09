'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MoreVertical } from 'lucide-react';

interface ClientRowActionsProps {
  clientId: string;
}

export function ClientRowActions({ clientId }: ClientRowActionsProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    if (confirm('האם אתה בטוח שברצונך למחוק את הלקוח?')) {
      try {
        // TODO: Implement delete API call
        console.log(`Deleting client ${clientId}`);
        // After deletion, refresh the page or update the list
        router.refresh();
      } catch (error) {
        console.error('Failed to delete client:', error);
      }
    }
  };

  const actions = [
    { label: 'צפייה', onClick: () => router.push(`/clients/${clientId}`) },
    { label: 'עריכה', onClick: () => router.push(`/clients/${clientId}?edit=true`) },
    { label: 'מחיקה', onClick: handleDelete },
  ];

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="p-2 hover:bg-gray-200 active:bg-gray-300 rounded-md transition-colors border border-transparent hover:border-gray-300"
        title="פעולות"
      >
        <MoreVertical className="w-5 h-5 text-gray-600" />
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-[9]"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-full mt-1 bg-white border border-gray-300 rounded-lg shadow-md z-10 min-w-44">
            {actions.map((action) => (
              <button
                key={action.label}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                  setOpen(false);
                }}
                className={`w-full text-right px-4 py-3 text-sm font-medium transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  action.label === 'מחיקה'
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
