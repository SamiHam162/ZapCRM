'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/clients', label: 'דשבורד' },
  { href: '/clients', label: 'לקוחות' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-zap-dark shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-white/10">
        <span className="text-2xl">⚡</span>
        <span className="text-xl font-bold text-zap-orange">זאפ</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {navLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-zap-orange/20 text-zap-orange'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Version badge */}
      <div className="px-6 py-4">
        <span className="text-xs text-white/30 bg-white/5 px-2 py-1 rounded">
          גרסה 1.0 · דמו
        </span>
      </div>
    </aside>
  );
}
