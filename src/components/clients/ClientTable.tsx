'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Client, ClientStatus } from '@/lib/types';
import { useClients } from '@/hooks/useClients';
import { ChevronDown, Trash2 } from 'lucide-react';

interface ClientTableProps {
  clients: Client[];
  filter?: ClientStatus | 'all';
}

const ITEMS_PER_PAGE = 12;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function groupClientsByStatus(clients: Client[]) {
  const statusOrder: ClientStatus[] = ['ממתין', 'סורק', 'מוכן', 'נשלח'];
  const groups: Record<ClientStatus, Client[]> = {
    'ממתין': [],
    'סורק': [],
    'מוכן': [],
    'נשלח': [],
  };

  clients.forEach((c) => {
    groups[c.status].push(c);
  });

  return statusOrder.map((status) => ({
    status,
    clients: groups[status],
  })).filter((g) => g.clients.length > 0);
}

function ClientTableSection({
  status,
  clients,
}: {
  status: ClientStatus;
  clients: Client[];
}) {
  const router = useRouter();
  const { dispatch } = useClients();
  const [expanded, setExpanded] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const start = currentPage * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const paginatedClients = clients.slice(start, end);
  const totalPages = Math.ceil(clients.length / ITEMS_PER_PAGE);

  const statusConfig: Record<ClientStatus, {
    pillBg: string;
    pillText: string;
    accentColor: string;
    bgColor: string;
    borderColor: string;
    rowHoverBg: string;
  }> = {
    'ממתין': {
      pillBg: 'bg-amber-100',
      pillText: 'text-amber-800',
      accentColor: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200 hover:border-amber-300',
      rowHoverBg: 'hover:bg-amber-50/40',
    },
    'סורק': {
      pillBg: 'bg-blue-100',
      pillText: 'text-blue-800',
      accentColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200 hover:border-blue-300',
      rowHoverBg: 'hover:bg-blue-50/40',
    },
    'מוכן': {
      pillBg: 'bg-emerald-100',
      pillText: 'text-emerald-800',
      accentColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200 hover:border-emerald-300',
      rowHoverBg: 'hover:bg-emerald-50/40',
    },
    'נשלח': {
      pillBg: 'bg-orange-100',
      pillText: 'text-orange-800',
      accentColor: 'text-orange-700',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200 hover:border-orange-300',
      rowHoverBg: 'hover:bg-orange-50/40',
    },
  };

  const config = statusConfig[status];

  const handleDelete = (clientId: string, businessName: string) => {
    if (confirm(`למחוק את "${businessName}"?`)) {
      dispatch({ type: 'DELETE_CLIENT', id: clientId });
    }
  };

  return (
    <div className="mb-8">
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${config.bgColor} ${config.borderColor} group cursor-pointer`}
      >
        <ChevronDown
          className={`w-5 h-5 text-gray-600 transition-transform flex-shrink-0 ${expanded ? '' : '-rotate-90'}`}
        />
        {/* Status pill badge — replaces small dot for better scannability */}
        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${config.pillBg} ${config.pillText} flex-shrink-0`}>
          {status}
        </span>
        <span className="flex-1" />
        <span className={`text-base font-bold ${config.accentColor} flex-shrink-0`}>{clients.length}</span>
      </button>

      {expanded && (
        <div className="mt-3 bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">

          {/* Mobile card list — visible below sm breakpoint */}
          <div className="sm:hidden divide-y divide-gray-100">
            {paginatedClients.map((client) => (
              <div
                key={client.id}
                onClick={() => router.push(`/clients/${client.id}`)}
                className={`flex items-start justify-between p-4 cursor-pointer transition-colors ${config.rowHoverBg} active:bg-gray-100`}
              >
                <div className="flex-1 min-w-0 ml-3">
                  <p className="font-semibold text-gray-900 text-sm leading-snug mb-1">
                    {client.businessName}
                  </p>
                  <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-xs text-gray-500">
                    {client.businessType && <span>{client.businessType}</span>}
                    {client.businessType && client.area && <span>·</span>}
                    {client.area && <span>{client.area}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-xs text-gray-400">
                    {status === 'נשלח' && client.sentAt
                      ? formatDate(client.sentAt)
                      : formatDate(client.createdAt)}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(client.id, client.businessName); }}
                    className="p-2 text-gray-300 hover:text-red-500 rounded-lg transition-colors"
                    title="מחק לקוח"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table — hidden below sm breakpoint */}
          <div className="hidden sm:block">
            <Table className="table-fixed w-full">
              <colgroup>
                <col className="w-[35%]" />
                <col className="w-[25%]" />
                <col className="w-[20%]" />
                <col className="w-[14%]" />
                <col className="w-[6%]" />
              </colgroup>
              <TableHeader>
                <TableRow className="bg-gray-100 border-b border-gray-200">
                  <TableHead className="font-bold text-gray-700 text-right text-xs py-4 px-4 uppercase tracking-wide">שם עסק</TableHead>
                  <TableHead className="font-bold text-gray-700 text-right text-xs py-4 px-4 uppercase tracking-wide">סוג עסק</TableHead>
                  <TableHead className="font-bold text-gray-700 text-right text-xs py-4 px-4 uppercase tracking-wide">אזור</TableHead>
                  <TableHead className="font-bold text-gray-700 text-right text-xs py-4 px-4 uppercase tracking-wide">תאריך</TableHead>
                  <TableHead className="py-4 px-4" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedClients.map((client) => (
                  <TableRow
                    key={client.id}
                    onClick={() => router.push(`/clients/${client.id}`)}
                    className={`border-b border-gray-100 last:border-b-0 transition-colors cursor-pointer group ${config.rowHoverBg}`}
                  >
                    <TableCell className="py-4 px-4">
                      <span className="font-semibold text-gray-900 text-sm group-hover:text-zap-orange group-hover:underline transition-colors">
                        {client.businessName}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-700 text-sm py-4 px-4 truncate">
                      {client.businessType ?? '—'}
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm py-4 px-4 truncate">
                      {client.area ?? '—'}
                    </TableCell>
                    <TableCell className="text-gray-500 text-xs py-4 px-4">
                      {status === 'נשלח' && client.sentAt
                        ? formatDate(client.sentAt)
                        : formatDate(client.createdAt)}
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(client.id, client.businessName); }}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="מחק לקוח"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-4 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-600">
              <span className="text-sm font-medium">
                {start + 1}–{Math.min(end, clients.length)} מתוך {clients.length}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="px-3 py-2 rounded-md border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white hover:border-gray-400 active:bg-gray-100 transition-colors text-sm font-medium"
                  title="עמוד קודם"
                >
                  ←
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="px-3 py-2 rounded-md border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white hover:border-gray-400 active:bg-gray-100 transition-colors text-sm font-medium"
                  title="עמוד הבא"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ClientTable({ clients, filter = 'all' }: ClientTableProps) {
  const filtered =
    filter === 'all' ? clients : clients.filter((c) => c.status === filter);

  const groups = groupClientsByStatus(filtered);

  if (groups.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-600 font-medium">אין לקוחות התואמים</p>
        <p className="text-gray-400 text-sm mt-1">נסה לשנות את הסינון או את מילות החיפוש</p>
      </div>
    );
  }

  return (
    <div>
      {groups.map((group) => (
        <ClientTableSection
          key={group.status}
          status={group.status}
          clients={group.clients}
        />
      ))}
    </div>
  );
}
