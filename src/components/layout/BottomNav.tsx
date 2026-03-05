'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Camera, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const TABS = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/add-meal', label: 'Upload', icon: Camera },
  { href: '/history', label: 'History', icon: Clock },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
      <div
        className="w-full max-w-[430px] bg-white border-t border-gray-200 flex items-center justify-around pb-safe"
        style={{ boxShadow: '0 -1px 12px rgba(0,0,0,0.06)' }}
      >
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 py-3 px-8 transition-colors"
            >
              <Icon
                size={24}
                className={active ? 'text-[#2563eb]' : 'text-gray-400'}
                strokeWidth={active ? 2.2 : 1.8}
              />
              <span
                className={cn(
                  'text-[11px] font-medium',
                  active ? 'text-[#2563eb]' : 'text-gray-400'
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
