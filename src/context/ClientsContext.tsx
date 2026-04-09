'use client';

import React, { createContext, useReducer, useEffect, ReactNode } from 'react';
import { Client, ClientStatus } from '@/lib/types';
import { MOCK_CLIENTS } from '@/lib/mockData';

const STORAGE_KEY = 'zap-crm-clients';

type Action =
  | { type: 'ADD_CLIENT'; client: Client }
  | { type: 'UPDATE_CLIENT'; id: string; updates: Partial<Client> }
  | { type: 'SET_STATUS'; id: string; status: ClientStatus }
  | { type: 'DELETE_CLIENT'; id: string }
  | { type: 'SEND_SCRIPT'; id: string; sentAt: string };

function reducer(state: Client[], action: Action): Client[] {
  switch (action.type) {
    case 'ADD_CLIENT':
      return [action.client, ...state];
    case 'UPDATE_CLIENT':
      return state.map((c) => (c.id === action.id ? { ...c, ...action.updates } : c));
    case 'SET_STATUS':
      return state.map((c) => (c.id === action.id ? { ...c, status: action.status } : c));
    case 'DELETE_CLIENT':
      return state.filter((c) => c.id !== action.id);
    case 'SEND_SCRIPT':
      return state.map((c) =>
        c.id === action.id ? { ...c, status: 'נשלח', sentAt: action.sentAt } : c
      );
    default:
      return state;
  }
}

function loadInitialState(): Client[] {
  if (typeof window === 'undefined') return MOCK_CLIENTS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as Client[];
    }
  } catch {
    // localStorage unavailable (private mode) — fall back to mock data
  }
  return MOCK_CLIENTS;
}

interface ClientsContextValue {
  clients: Client[];
  dispatch: React.Dispatch<Action>;
}

export const ClientsContext = createContext<ClientsContextValue | null>(null);

export function ClientsProvider({ children }: { children: ReactNode }) {
  const [clients, dispatch] = useReducer(reducer, [], loadInitialState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
    } catch {
      // localStorage unavailable — continue without persisting
    }
  }, [clients]);

  return (
    <ClientsContext.Provider value={{ clients, dispatch }}>
      {children}
    </ClientsContext.Provider>
  );
}
