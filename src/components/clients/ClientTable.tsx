'use client';

import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Client } from '@/lib/types';
import { StatusBadge } from './StatusBadge';

interface ClientTableProps {
  clients: Client[];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function ClientTable({ clients }: ClientTableProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold text-gray-700 text-right">שם עסק</TableHead>
            <TableHead className="font-semibold text-gray-700 text-right">סוג עסק</TableHead>
            <TableHead className="font-semibold text-gray-700 text-right">אזור</TableHead>
            <TableHead className="font-semibold text-gray-700 text-right">סטטוס</TableHead>
            <TableHead className="font-semibold text-gray-700 text-right">תאריך הוספה</TableHead>
            <TableHead className="font-semibold text-gray-700 text-right">פעולות</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow
              key={client.id}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => router.push(`/clients/${client.id}`)}
            >
              <TableCell className="font-medium text-gray-900">
                {client.businessName}
              </TableCell>
              <TableCell className="text-gray-600">
                {client.businessType ?? '—'}
              </TableCell>
              <TableCell className="text-gray-600">
                {client.area ?? '—'}
              </TableCell>
              <TableCell>
                <StatusBadge status={client.status} />
              </TableCell>
              <TableCell className="text-gray-500 text-sm">
                {formatDate(client.createdAt)}
              </TableCell>
              <TableCell>
                <button
                  className="text-sm text-zap-orange hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/clients/${client.id}`);
                  }}
                >
                  פתח
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
