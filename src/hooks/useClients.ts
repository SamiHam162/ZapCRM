'use client';

import { useContext } from 'react';
import { ClientsContext } from '@/context/ClientsContext';

export function useClients() {
  const ctx = useContext(ClientsContext);
  if (!ctx) {
    throw new Error('useClients must be used within a ClientsProvider');
  }
  return ctx;
}
