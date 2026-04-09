'use client';

import { useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { ClientTable } from '@/components/clients/ClientTable';
import { SummaryBar } from '@/components/clients/SummaryBar';
import { EmptyState } from '@/components/clients/EmptyState';
import { AddClientDialog } from '@/components/clients/AddClientDialog';
import { useClients } from '@/hooks/useClients';

export default function ClientsPage() {
  const { clients } = useClients();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <TopBar title="לקוחות" onNewClient={() => setDialogOpen(true)} />
      <main className="p-6">
        <SummaryBar clients={clients} />
        {clients.length === 0 ? (
          <EmptyState onNewClient={() => setDialogOpen(true)} />
        ) : (
          <ClientTable clients={clients} />
        )}
      </main>
      <AddClientDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
