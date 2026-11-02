'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusCircle, User, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: '任务广场', icon: Home },
  { href: '/publish', label: '发布任务', icon: PlusCircle },
  { href: '/my-tasks', label: '我的任务', icon: ClipboardList },
  { href: '/profile', label: '个人中心', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-sm safe-area-bottom">
      <div className="mx-auto flex max-w-md items-center justify-around py-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs transition-all active:scale-95',
                isActive ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
              )}
            >
              <Icon className={cn('h-5 w-5', isActive && 'stroke-[2.5]')} />
              <span className={cn('font-medium', isActive && 'font-semibold')}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
