'use client';

import { useState, useMemo } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { ClientTable } from '@/components/clients/ClientTable';
import { SummaryBar } from '@/components/clients/SummaryBar';
import { EmptyState } from '@/components/clients/EmptyState';
import { AddClientDialog } from '@/components/clients/AddClientDialog';
import { useClients } from '@/hooks/useClients';
import { ClientStatus } from '@/lib/types';

export default function ClientsPage() {
  const { clients } = useClients();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<ClientStatus | 'all'>('all');

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        client.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.businessType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.area?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        activeFilter === 'all' || client.status === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [clients, searchQuery, activeFilter]);

  return (
    <>
      <TopBar
        title="לקוחות"
        onNewClient={() => setDialogOpen(true)}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <main className="flex-1 px-6 py-8 overflow-auto bg-gray-50">
        <div className="max-w-7xl">
          <SummaryBar
            clients={clients}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
          {filteredClients.length === 0 && clients.length === 0 ? (
            <EmptyState onNewClient={() => setDialogOpen(true)} />
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">אין לקוחות התואמים</p>
            </div>
          ) : (
            <ClientTable clients={filteredClients} filter={activeFilter} />
          )}
        </div>
      </main>
      <AddClientDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
