'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowRight } from 'lucide-react';

interface TopBarProps {
  title: string;
  backHref?: string;
  onNewClient?: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export function TopBar({
  title,
  backHref,
  onNewClient,
  searchValue = '',
  onSearchChange
}: TopBarProps) {
  return (
    <header className="flex items-center justify-between gap-4 px-6 py-5 bg-white border-b border-gray-200 shadow-xs">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {backHref && (
          <Link
            href={backHref}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50 transition-colors shrink-0"
            title="חזרה"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
        <h1 className="text-2xl font-bold text-gray-900 shrink-0 truncate">{title}</h1>
        {!backHref && (
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-sm">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <Input
              placeholder="חפש לקוחות..."
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="h-9 px-3 text-sm border-gray-200 bg-gray-50 placeholder:text-gray-400 focus:bg-white focus:border-gray-300 focus:shadow-sm transition-all"
            />
          </div>
        )}
      </div>
      {onNewClient && (
        <Button
          onClick={onNewClient}
          className="bg-zap-orange hover:bg-zap-orange/90 text-white shadow-sm hover:shadow-md shrink-0 font-medium transition-all"
        >
          הוסף לקוח
        </Button>
      )}
    </header>
  );
}
