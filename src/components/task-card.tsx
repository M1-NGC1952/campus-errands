'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Task, CATEGORY_MAP, STATUS_MAP, STATUS_COLOR } from '@/lib/types';
import { Package, ShoppingBag, Armchair, FileText, MoreHorizontal, MapPin, Clock, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, typeof Package> = {
  Package,
  ShoppingBag,
  Armchair,
  FileText,
  MoreHorizontal,
};

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const [now, setNow] = useState<number>(0);

  useEffect(() => {
    setNow(Date.now());
  }, []);

  const IconComponent = ICON_MAP[
    task.category === 'express' ? 'Package' :
    task.category === 'buy' ? 'ShoppingBag' :
    task.category === 'seat' ? 'Armchair' :
    task.category === 'deliver' ? 'FileText' : 'MoreHorizontal'
  ] || MoreHorizontal;

  const deadline = new Date(task.deadline);
  const isExpired = now > 0 && deadline.getTime() < now;
  const timeStr = now > 0 ? formatDeadline(deadline, now) : '';

  return (
    <Link href={`/task/${task.id}`}>
      <div className="group rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.98]">
        {/* Header */}
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <IconComponent className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold leading-tight text-slate-800 line-clamp-1">
              {task.title}
            </h3>
          </div>
          <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-xs font-medium', STATUS_COLOR[task.status])}>
            {STATUS_MAP[task.status]}
          </span>
        </div>

        {/* Description */}
        <p className="mb-3 text-xs leading-relaxed text-slate-500 line-clamp-2">
          {task.description}
        </p>

        {/* Info Row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {task.pickupLocation}
          </span>
          <span className={cn('flex items-center gap-1', isExpired && 'text-red-400')}>
            <Clock className="h-3 w-3" />
            {isExpired ? '已超时' : timeStr}
          </span>
        </div>

        {/* Footer */}
        <div className="mt-3 flex items-center justify-between border-t border-slate-50 pt-2">
          <span className="text-xs text-slate-400">
            {task.publisherName} 发布
          </span>
          <span className="flex items-center gap-1 text-sm font-bold text-amber-500">
            <Coins className="h-3.5 w-3.5" />
            ¥{task.reward}
          </span>
        </div>
      </div>
    </Link>
  );
}

function formatDeadline(date: Date, now: number): string {
  const diff = date.getTime() - now;
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);

  if (hours < 1) return `${minutes}分钟后截止`;
  if (hours < 24) return `${hours}小时${minutes > 0 ? minutes + '分' : ''}后截止`;
  const days = Math.floor(hours / 24);
  return `${days}天后截止`;
}
